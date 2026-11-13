<?php

namespace App\Http\Controllers;

use App\Mail\FreeTrialAdminNotificationMail;
use App\Mail\FreeTrialConfirmationMail;
use App\Models\DigitalTwin;
use App\Models\Order;
use App\Models\Setting;
use App\Models\TryOnLook;
use App\Services\Catalog\CatalogCacheService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
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
     * Display Page 2: Virtual Try-On Capability Quote / Pilot Request page.
     */
    public function tryOnQuote(Request $request): Response
    {
        return Inertia::render('TryOn/Quote', [
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

        return redirect()->route('try-on.quote', array_filter([
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
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('orders/digital-twins', 'public');
                    $uploadedUrls[] = '/storage/'.$path;
                }
            }
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
            'attributes' => $validated['attributes'] ?? [],
        ];

        $order = Order::create([
            'order_type' => $orderType,
            'digital_twin_id' => $twin?->id,
            'client_name' => $validated['name'],
            'client_email' => strtolower(trim($validated['email'])),
            'client_phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'ip_address' => $request->ip(),
            'service_name' => $serviceName,
            'service_slug' => Str::slug($orderType),
            'complexity' => $mode,
            'quantity' => 1,
            'uploaded_count' => count($uploadedUrls),
            'unit_price' => $rawPrice,
            'total_price' => $rawPrice,
            'currency' => 'USD',
            'turnaround' => $mode === 'custom' ? 'Custom Quote' : 'Instant / 24h Delivery',
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

        return back()->with('success', "Digital Twin request #{$order->order_number} received! Our studio team will review your specification and send your quote and next steps within one business day.");
    }

    /**
     * Store a Virtual Try-On Quote / Pilot Request (with Our Model vs Your Model + Top, Bottom, Shoes uploads).
     */
    public function storeTryOnQuote(Request $request): RedirectResponse
    {
        if ($request->filled('honeypot') || $request->filled('website_url')) {
            return back()->with('success', 'Your Virtual Try-On quote request has been received.');
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
            ? ($look ? "{$look->model_name} ({$look->name})" : ($validated['selected_look_name'] ?: 'Studio Model'))
            : 'Client Uploaded Model';

        $specifications = [
            'model_source' => $validated['model_source'],
            'try_on_look_id' => $look?->id,
            'selected_model_name' => $look?->model_name,
            'selected_look_name' => $look?->name ?? ($validated['selected_look_name'] ?? null),
            'selected_model_image' => $look?->runway_image,
            'labeled_files' => $labeledFiles,
            'other_description' => $validated['instructions'] ?? null,
        ];

        $order = Order::create([
            'order_type' => 'virtual_try_on_quote',
            'try_on_look_id' => $look?->id,
            'client_name' => $validated['name'],
            'client_email' => strtolower(trim($validated['email'])),
            'client_phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
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
            'turnaround' => '24h Proof Quote',
            'images' => $allImages,
            'specifications' => $specifications,
            'cloud_link' => $validated['cloud_link'] ?? null,
            'instructions' => $validated['instructions'] ?? null,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'source' => 'virtual_try_on_quote',
            'landing_page_url' => $validated['landing_page_url'] ?? null,
            'submission_page_url' => $validated['submission_page_url'] ?? $request->header('referer'),
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
        ]);

        $this->notifyOrderCreated($order);

        return back()->with('success', "Virtual Try-On Quote Request #{$order->order_number} received! Our specialists will review your garments and return a quote and proof within one business day.");
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
        $adminEmail = Setting::where('key', 'contact_email')->value('value') ?: config('mail.from.address', 'hello@cuttingedger.com');
        $calendlyUrl = Setting::where('key', 'calendly_url')->value('value') ?: 'https://calendly.com/cuttingedger/discovery-call';

        try {
            Mail::to($order->client_email)->send(new FreeTrialConfirmationMail($order, $calendlyUrl));
            Mail::to($adminEmail)->send(new FreeTrialAdminNotificationMail($order));
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
