<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\FreeTrialRequest;
use App\Services\Security\EmailAndSpamGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
     * Store an inbound contact inquiry.
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
            'inquiry_type' => ['nullable', 'string', 'max:50'],
            'turnaround_time' => ['nullable', 'string', 'max:50'],
            'output_format' => ['nullable', 'string', 'max:50'],
            'attachments.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd,zip,pdf'],
        ]);

        // If this is a free trial inquiry, verify single-trial eligibility
        if (($validated['inquiry_type'] ?? '') === 'free_trial') {
            $guard = app(EmailAndSpamGuard::class);
            $eligibility = $guard->checkTrialEligibility($validated['email'], $request->ip());
            if (! $eligibility['eligible']) {
                return back()->withErrors([
                    'trial_exhausted' => $eligibility['reason'],
                ])->with('trial_exhausted', [
                    'reason' => $eligibility['reason'],
                    'email' => $validated['email'],
                ])->withInput();
            }
        }

        $uploadedPaths = [];
        $imageUrls = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('trials', 'public');
                    $uploadedPaths[] = [
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'size' => $file->getSize(),
                    ];
                    $imageUrls[] = '/storage/'.$path;
                }
            }
        }

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
            'inquiry_type' => $validated['inquiry_type'] ?? 'general',
            'turnaround_time' => $validated['turnaround_time'] ?? null,
            'output_format' => $validated['output_format'] ?? null,
            'attachments' => $uploadedPaths,
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]);

        // Directly store FreeTrialRequest if inquiry type is free_trial
        $trialId = null;
        if (($validated['inquiry_type'] ?? '') === 'free_trial') {
            $trial = FreeTrialRequest::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'ip_address' => $request->ip(),
                'images' => $imageUrls,
                'images_count' => count($imageUrls) ?: 1,
                'service' => $validated['service_interest'] ?? 'Background Removal',
                'instructions' => $validated['message'],
                'status' => 'pending',
            ]);
            $trialId = $trial->id;
        }

        $successMessage = ($validated['inquiry_type'] ?? '') === 'free_trial'
            ? "Free trial order #{$trialId} received! Our production team will process your sample images within 24 hours."
            : 'Inquiry transmitted successfully. Our studio partners will review and respond promptly.';

        return back()->with('success', $successMessage);
    }

    /**
     * Store a free trial order request directly from the trial dropzone.
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

        $uploadedPaths = [];
        $imageUrls = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('trials', 'public');
                    $uploadedPaths[] = [
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'size' => $file->getSize(),
                    ];
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

        // Directly create the FreeTrialRequest record
        $trial = FreeTrialRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'ip_address' => $request->ip(),
            'images' => $imageUrls,
            'images_count' => count($imageUrls) ?: 1,
            'service' => $validated['service'] ?? 'Background Removal',
            'instructions' => $validated['instructions'] ?? 'Free trial sample request',
            'status' => 'pending',
        ]);

        // Also record a ContactMessage for unified messaging view
        ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'service_interest' => $validated['service'] ?? 'Background Removal',
            'message' => $validated['instructions'] ?? 'Free trial request',
            'inquiry_type' => 'free_trial',
            'attachments' => $uploadedPaths,
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]);

        return back()->with('success', "Free trial order #{$trial->id} created successfully! Our senior artists will return your retouched files within 24 hours.");
    }
}
