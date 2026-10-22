<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Order;
use App\Services\Security\EmailAndSpamGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Show the dedicated contact page.
     */
    public function index(): Response
    {
        return Inertia::render('Contact');
    }

    /**
     * Store an inbound customer contact inquiry or quote request.
     */
    public function store(Request $request): RedirectResponse
    {
        // Anti-bot honeypot check
        if ($request->filled('website_url') || $request->filled('honeypot')) {
            return back()->with('success', 'Thank you for reaching out!');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'company' => ['nullable', 'string', 'max:255'],
            'budget' => ['nullable', 'string', 'max:255'],
            'service_interest' => ['nullable', 'string', 'max:255'],
        ]);

        // Deduplication & Double-Click Guard (15s replay lockout)
        $fingerprint = 'contact_inquiry_'.md5($request->ip().strtolower($validated['email']).substr($validated['message'], 0, 50));
        if (Cache::has($fingerprint)) {
            return back()->with('success', 'Your inquiry has already been received. We will be in touch shortly!');
        }
        Cache::put($fingerprint, true, 15);

        ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $validated['company'] ?? null,
            'budget' => $validated['budget'] ?? null,
            'service_interest' => $validated['service_interest'] ?? null,
            'message' => $validated['message'],
            'inquiry_type' => 'general',
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]);

        return back()->with('success', 'Inquiry transmitted successfully. Our studio team will review and respond promptly.');
    }

    /**
     * Store a free trial order request directly into the orders table.
     */
    public function storeFreeTrial(Request $request): RedirectResponse
    {
        // Anti-bot honeypot check
        if ($request->filled('website_url') || $request->filled('honeypot')) {
            return back()->with('success', 'Thank you for reaching out!');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'service' => ['nullable', 'string', 'max:255'],
            'instructions' => ['nullable', 'string', 'max:5000'],
            'attachments.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd,zip,pdf'],
        ]);

        $guard = app(EmailAndSpamGuard::class);

        // 1. Email format and disposable burner domain check
        $emailCheck = $guard->validateEmail($validated['email']);
        if (! $emailCheck['valid']) {
            return back()->withErrors(['email' => $emailCheck['reason']])->withInput();
        }

        // 2. Strict 1-Trial Limit Enforcement (single email or single IP network)
        $eligibility = $guard->checkTrialEligibility($validated['email'], $request->ip());
        if (! $eligibility['eligible']) {
            return back()->withErrors([
                'trial_exhausted' => $eligibility['reason'],
            ])->with('trial_exhausted', [
                'reason' => $eligibility['reason'],
                'email' => $validated['email'],
            ])->withInput();
        }

        $imageUrls = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('trials', 'public');
                    $imageUrls[] = '/storage/'.$path;
                }
            }
        }

        // Deduplication & Double-Click Guard (15s replay lockout)
        $fingerprint = 'trial_order_'.md5($request->ip().strtolower($validated['email']));
        if (Cache::has($fingerprint)) {
            return back()->with('success', 'Your trial order has already been received! Our team is processing it.');
        }
        Cache::put($fingerprint, true, 15);

        $serviceName = $validated['service'] ?? 'Background Removal & Clipping Path';
        $orderNumber = 'CE-TRL-'.strtoupper(Str::random(6));

        // Directly create the unified Order record
        $order = Order::create([
            'order_number' => $orderNumber,
            'client_name' => $validated['name'],
            'client_email' => strtolower(trim($validated['email'])),
            'client_phone' => $validated['phone'] ?? null,
            'ip_address' => $request->ip(),
            'service_name' => $serviceName,
            'service_slug' => Str::slug($serviceName),
            'complexity' => 'trial',
            'quantity' => count($imageUrls) ?: 1,
            'uploaded_count' => count($imageUrls) ?: 1,
            'unit_price' => 0.00,
            'discount_percent' => 100,
            'total_price' => 0.00,
            'currency' => 'USD',
            'turnaround' => '24h Standard',
            'images' => $imageUrls,
            'instructions' => $validated['instructions'] ?? 'Complimentary 2-image production test batch',
            'status' => 'pending',
            'payment_status' => 'free_trial',
            'source' => 'web_trial',
        ]);

        return back()->with([
            'success' => "Free trial order #{$order->order_number} created successfully! Our senior artists will return your retouched files within 24 hours.",
            'order_number' => $order->order_number,
        ]);
    }
}
