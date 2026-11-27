<?php

namespace App\Http\Controllers;

use App\Mail\FreeTrialAdminNotificationMail;
use App\Mail\FreeTrialConfirmationMail;
use App\Models\DigitalTwin;
use App\Models\Order;
use App\Models\Setting;
use App\Models\TryOnLook;
use App\Models\User;
use App\Services\Catalog\CatalogCacheService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display Page 1: Digital Twins Custom Configurator & Preset/Lifetime Order page.
     */
    public function digitalTwinOrder(Request $request): Response
    {
        $mode = $request->query('mode', 'custom');
        if (! in_array($mode, ['custom', 'preset', 'lifetime'], true)) {
            $mode = 'custom';
        }

        return Inertia::render('DigitalTwins/Order', [
            'digitalTwins' => CatalogCacheService::getAllDigitalTwins(),
            'attributes' => CatalogCacheService::getActiveTwinAttributes(),
            'initialMode' => $mode,
            'initialTwinSlug' => Str::limit((string) $request->query('twin', ''), 120, ''),
            'initialReference' => Str::limit((string) $request->query('ref', ''), 120, ''),
        ]);
    }

    /**
     * Display Page 2: Virtual Try-On Custom Order page.
     */
    public function tryOnOrder(Request $request): Response
    {
        return Inertia::render('TryOn/Order', [
            'tryOnLooks' => CatalogCacheService::getAllTryOnLooks(),
            'initialLook' => Str::limit((string) $request->query('look', $request->query('ref', '')), 120, ''),
            'initialService' => Str::limit((string) $request->query('service', 'virtual-try-on'), 80, ''),
        ]);
    }

    /**
     * Redirect any legacy /order links to the appropriate dedicated page.
     */
    public function legacyRedirect(Request $request): RedirectResponse
    {
        $service = (string) $request->query('service', '');
        $ref = (string) $request->query('ref', '');

        if ($service === 'digital-twins') {
            return redirect()->route('digital-twins.order', array_filter([
                'ref' => $ref ?: null,
            ]));
        }

        return redirect()->route('try-on.order', array_filter([
            'look' => $ref ?: null,
            'service' => $service ?: null,
        ]));
    }

    /**
     * Store a Digital Twin Order (Custom Configurator, Preset License, or Lifetime Copyright).
     */
    public function storeDigitalTwinOrder(Request $request): RedirectResponse
    {
        if ($request->filled('honeypot') || $request->filled('website_url')) {
            return back()->with('success', 'Your Digital Twin request has been received.');
        }

        $validated = $request->validate([
            'mode' => ['required', 'in:custom,preset,lifetime'],
            'digital_twin_id' => ['nullable', 'integer', 'exists:digital_twins,id'],
            'reference_twin_name' => ['nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'attributes' => ['nullable', 'array'],
            'selected_poses' => ['nullable', 'array'],
            'instructions' => ['nullable', 'string', 'max:5000'],
            'cloud_link' => ['nullable', 'string', 'max:1000'],
            'pose_references' => ['nullable', 'array'],
            'pose_references.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd'],
            'attachments.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd,zip,pdf'],
            'landing_page_url' => ['nullable', 'string', 'max:1000'],
            'submission_page_url' => ['nullable', 'string', 'max:1000'],
            'utm_source' => ['nullable', 'string', 'max:255'],
            'utm_medium' => ['nullable', 'string', 'max:255'],
            'utm_campaign' => ['nullable', 'string', 'max:255'],
        ]);

        $mode = $validated['mode'];
        $twin = ! empty($validated['digital_twin_id'])
            ? DigitalTwin::find($validated['digital_twin_id'])
            : null;

        if (($mode === 'preset' || $mode === 'lifetime') && $twin && $twin->is_copyright_sold) {
            return back()->withErrors([
                'digital_twin_id' => 'This Digital Twin copyright has already been sold and is no longer available.',
            ])->withInput();
        }

        $uploadedUrls = [];
        $poseReferenceImages = [];

        if ($request->hasFile('pose_references')) {
            foreach ($request->file('pose_references') as $poseName => $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('orders/digital-twins', 'public');
                    $url = '/storage/'.$path;
                    $poseReferenceImages[(string) $poseName] = $url;
                    $uploadedUrls[] = $url;
                }
            }
        }

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('orders/digital-twins', 'public');
                    $uploadedUrls[] = '/storage/'.$path;
                }
            }
        }

        if ($mode === 'custom' && $uploadedUrls === []) {
            return back()->withErrors([
                'pose_references' => 'Please upload at least one reference pose image so we can generate your Digital Twin model.',
            ])->withInput();
        }

        $orderType = match ($mode) {
            'preset' => 'digital_twin_preset',
            'lifetime' => 'digital_twin_lifetime',
            default => 'digital_twin_custom',
        };

        $serviceName = match ($mode) {
            'preset' => 'Digital Twin Pose Preset'.($twin ? " — {$twin->name}" : ''),
            'lifetime' => 'Digital Twin Lifetime Copyright'.($twin ? " — {$twin->name}" : ''),
            default => 'Custom Brand Digital Twin'.($twin ? " (Ref: {$twin->name})" : ''),
        };

        $rawPrice = match ($mode) {
            'preset' => $twin ? (float) preg_replace('/[^0-9.]/', '', $twin->preset_price) : 149.00,
            'lifetime' => $twin ? (float) preg_replace('/[^0-9.]/', '', $twin->lifetime_price) : 490.00,
            default => 0.00,
        };

        $specifications = [
            'mode' => $mode,
            'reference_twin_id' => $twin?->id,
            'reference_twin_name' => $twin?->name ?? ($validated['reference_twin_name'] ?? 'Build from scratch'),
            'look_number' => $twin?->look_number,
            'selected_poses' => $validated['selected_poses'] ?? [],
            'pose_reference_images' => $poseReferenceImages,
            'attributes' => $validated['attributes'] ?? [],
        ];

        $order = Order::create([
            'order_type' => $orderType,
            'user_id' => $request->user()?->id,
            'digital_twin_id' => $twin?->id,
            'client_name' => $validated['name'],
            'client_email' => strtolower(trim($validated['email'])),
            'client_phone' => $validated['phone'] ?? $request->user()?->phone,
            'company' => $validated['company'] ?? $request->user()?->company,
            'ip_address' => $request->ip(),
            'service_name' => $serviceName,
            'service_slug' => Str::slug($orderType),
            'complexity' => $mode,
            'quantity' => 1,
            'uploaded_count' => count($uploadedUrls),
            'unit_price' => $rawPrice,
            'total_price' => $rawPrice,
            'currency' => 'USD',
            'turnaround' => $mode === 'custom' ? '24h Studio Review' : 'Instant / 24h Delivery',
            'images' => $uploadedUrls,
            'specifications' => $specifications,
            'cloud_link' => $validated['cloud_link'] ?? null,
            'instructions' => $validated['instructions'] ?? null,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'source' => 'digital_twin_order',
            'landing_page_url' => $validated['landing_page_url'] ?? null,
            'submission_page_url' => $validated['submission_page_url'] ?? $request->header('referer'),
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
        ]);

        $this->notifyOrderCreated($order);

        return back()->with('success', "Digital Twin order #{$order->order_number} received! Our studio team will review your specification and follow up with next steps within one business day.");
    }

    /**
     * Store a Virtual Try-On Order (with Our Model vs Your Model + Top, Bottom, Shoes uploads).
     */
    public function storeTryOnOrder(Request $request): RedirectResponse
    {
        if ($request->filled('honeypot') || $request->filled('website_url')) {
            return back()->with('success', 'Your Virtual Try-On order has been received.');
        }

        $validated = $request->validate([
            'model_source' => ['required', 'in:our_model,custom_model'],
            'try_on_look_id' => ['nullable', 'integer', 'exists:try_on_looks,id'],
            'selected_look_name' => ['nullable', 'string', 'max:255'],
            'model_file' => ['nullable', 'required_if:model_source,custom_model', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd'],
            'garment_top' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd'],
            'garment_bottom' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd'],
            'garment_shoes' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'monthly_volume' => ['nullable', 'string', 'max:255'],
            'cloud_link' => ['nullable', 'string', 'max:1000'],
            'instructions' => ['nullable', 'string', 'max:5000'],
            'landing_page_url' => ['nullable', 'string', 'max:1000'],
            'submission_page_url' => ['nullable', 'string', 'max:1000'],
            'utm_source' => ['nullable', 'string', 'max:255'],
            'utm_medium' => ['nullable', 'string', 'max:255'],
            'utm_campaign' => ['nullable', 'string', 'max:255'],
        ]);

        if (
            ! $request->hasFile('garment_top') &&
            ! $request->hasFile('garment_bottom') &&
            ! $request->hasFile('garment_shoes') &&
            empty($validated['cloud_link'])
        ) {
            return back()->withErrors([
                'garment_top' => 'Please upload at least one garment file (Top, Bottom, or Shoes) or provide a cloud link.',
            ])->withInput();
        }

        $look = ! empty($validated['try_on_look_id'])
            ? TryOnLook::find($validated['try_on_look_id'])
            : null;

        $labeledFiles = [];
        $allImages = [];

        $slots = [
            'client_model' => 'model_file',
            'top' => 'garment_top',
            'bottom' => 'garment_bottom',
            'shoes' => 'garment_shoes',
        ];

        foreach ($slots as $slotKey => $inputName) {
            if ($request->hasFile($inputName) && $request->file($inputName)->isValid()) {
                $path = $request->file($inputName)->store("orders/try-on/{$slotKey}", 'public');
                $url = '/storage/'.$path;
                $labeledFiles[$slotKey] = $url;
                $allImages[] = $url;
            }
        }

        $modelSummary = $validated['model_source'] === 'our_model'
            ? ($look ? $look->model_name : ($validated['selected_look_name'] ?: 'Studio Model'))
            : 'Client Uploaded Model';

        $specifications = [
            'model_source' => $validated['model_source'],
            'try_on_look_id' => $look?->id,
            'selected_model_name' => $look?->model_name,
            'selected_look_name' => $look?->model_name ?? ($validated['selected_look_name'] ?? null),
            'selected_model_image' => $look?->runway_image,
            'labeled_files' => $labeledFiles,
            'other_description' => $validated['instructions'] ?? null,
        ];

        $order = Order::create([
            'order_type' => 'virtual_try_on_order',
            'user_id' => $request->user()?->id,
            'try_on_look_id' => $look?->id,
            'client_name' => $validated['name'],
            'client_email' => strtolower(trim($validated['email'])),
            'client_phone' => $validated['phone'] ?? $request->user()?->phone,
            'company' => $validated['company'] ?? $request->user()?->company,
            'monthly_volume' => $validated['monthly_volume'] ?? null,
            'ip_address' => $request->ip(),
            'service_name' => "Virtual Try-On — {$modelSummary}",
            'service_slug' => 'virtual-try-on',
            'complexity' => $validated['model_source'],
            'quantity' => max(1, count($allImages)),
            'uploaded_count' => count($allImages),
            'unit_price' => 0.00,
            'total_price' => 0.00,
            'currency' => 'USD',
            'turnaround' => '24h Studio Delivery',
            'images' => $allImages,
            'specifications' => $specifications,
            'cloud_link' => $validated['cloud_link'] ?? null,
            'instructions' => $validated['instructions'] ?? null,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'source' => 'virtual_try_on_order',
            'landing_page_url' => $validated['landing_page_url'] ?? null,
            'submission_page_url' => $validated['submission_page_url'] ?? $request->header('referer'),
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
        ]);

        $this->notifyOrderCreated($order);

        return back()->with('success', "Virtual Try-On Order #{$order->order_number} received! Our specialists will review your garments and follow up within one business day.");
    }

    /**
     * Spend active studio credits from the client's wallet to launch a production order.
     */
    public function storeCreditUsageOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_category' => ['required', 'string', 'max:120'],
            'asset_quantity' => ['required', 'integer', 'min:1', 'max:50000'],
            'credits_to_spend' => ['required', 'integer', 'min:1', 'max:100000'],
            'turnaround' => ['required', 'string', 'max:80'],
            'cloud_link' => ['nullable', 'string', 'max:1000'],
            'instructions' => ['required', 'string', 'max:5000'],
        ]);

        $creditsToSpend = (int) $validated['credits_to_spend'];

        $order = DB::transaction(function () use ($request, $validated, $creditsToSpend): Order {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();

            if ($user->credits_balance < $creditsToSpend) {
                throw ValidationException::withMessages([
                    'credits_to_spend' => 'Insufficient studio credits in your wallet for this order.',
                ]);
            }

            $user->credits_balance -= $creditsToSpend;
            $user->save();

            return Order::create([
                'order_type' => 'credit_usage',
                'user_id' => $user->id,
                'client_name' => $user->name,
                'client_email' => strtolower($user->email),
                'client_phone' => $user->phone,
                'company' => $user->company,
                'ip_address' => $request->ip(),
                'service_name' => "{$validated['service_category']} ({$creditsToSpend} Credits)",
                'service_slug' => Str::slug($validated['service_category']),
                'complexity' => 'credit_redemption',
                'quantity' => (int) $validated['asset_quantity'],
                'uploaded_count' => 0,
                'unit_price' => 0,
                'total_price' => 0,
                'currency' => 'USD',
                'turnaround' => $validated['turnaround'],
                'cloud_link' => $validated['cloud_link'] ?? null,
                'instructions' => $validated['instructions'],
                'specifications' => [
                    'paid_with_credits' => true,
                    'credits_spent' => $creditsToSpend,
                    'remaining_credits' => (int) $user->credits_balance,
                    'service_category' => $validated['service_category'],
                ],
                'status' => 'in_production',
                'payment_status' => 'paid',
                'source' => 'portal_credit_redemption',
            ]);
        });

        $this->notifyOrderCreated($order);

        return redirect()->route('client.portal')->with(
            'success',
            "Order #{$order->order_number} launched using {$creditsToSpend} studio credits!"
        );
    }

    /**
     * Fast cached JSON API for Digital Twins catalog.
     */
    public function apiDigitalTwins(Request $request): JsonResponse
    {
        $payload = $request->boolean('home_only')
            ? CatalogCacheService::getHomeDigitalTwins()
            : CatalogCacheService::getAllDigitalTwins();

        return $this->cachedJsonResponse($request, [
            'data' => $payload,
            'attributes' => CatalogCacheService::getActiveTwinAttributes(),
        ]);
    }

    /**
     * Fast cached JSON API for Virtual Try-On Looks.
     */
    public function apiTryOnLooks(Request $request): JsonResponse
    {
        $payload = $request->boolean('home_only')
            ? CatalogCacheService::getHomeTryOnLooks()
            : CatalogCacheService::getAllTryOnLooks();

        return $this->cachedJsonResponse($request, [
            'data' => $payload,
        ]);
    }

    /**
     * Build an ETag + Cache-Control JSON response for fast client loading.
     *
     * @param  array<string, mixed>  $data
     */
    private function cachedJsonResponse(Request $request, array $data): JsonResponse
    {
        $etag = '"'.md5(json_encode($data) ?: '').'"';

        if ($request->header('If-None-Match') === $etag) {
            return response()->json(null, 304)
                ->header('ETag', $etag)
                ->header('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
        }

        return response()->json($data)
            ->header('ETag', $etag)
            ->header('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
    }

    /**
     * Send confirmation and admin notification emails without blocking the request if mail fails.
     */
    private function notifyOrderCreated(Order $order): void
    {
        $adminEmails = Setting::adminNotificationRecipients();
        $calendlyUrl = Setting::where('key', 'calendly_url')->value('value') ?: 'https://calendly.com/cuttingedger/discovery-call';

        try {
            Mail::to($order->client_email)->queue(new FreeTrialConfirmationMail($order, $calendlyUrl));
            if ($adminEmails !== []) {
                Mail::to($adminEmails)->queue(new FreeTrialAdminNotificationMail($order));
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
