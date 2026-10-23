<?php

namespace App\Http\Controllers;

use App\Mail\ContactInquiryAdminNotificationMail;
use App\Mail\ContactInquiryConfirmationMail;
use App\Mail\FreeTrialAdminNotificationMail;
use App\Mail\FreeTrialConfirmationMail;
use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Setting;
use App\Services\Security\EmailAndSpamGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
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
     * Store an inbound customer contact inquiry or quote request with full SEO attribution.
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
            'role' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'monthly_volume' => ['nullable', 'string', 'max:255'],
            'platform' => ['nullable', 'string', 'max:255'],
            'budget' => ['nullable', 'string', 'max:255'],
            'service_interest' => ['nullable', 'string', 'max:255'],
            // Attribution
            'landing_page_url' => ['nullable', 'string', 'max:1000'],
            'submission_page_url' => ['nullable', 'string', 'max:1000'],
            'utm_source' => ['nullable', 'string', 'max:255'],
            'utm_medium' => ['nullable', 'string', 'max:255'],
            'utm_campaign' => ['nullable', 'string', 'max:255'],
            'utm_term' => ['nullable', 'string', 'max:255'],
            'utm_content' => ['nullable', 'string', 'max:255'],
            'click_id' => ['nullable', 'string', 'max:255'],
        ]);

        $guard = app(EmailAndSpamGuard::class);

        // Math Captcha Verification (Doc §4.4)
        if ($request->filled('captcha_token')) {
            if (! $guard->verifyMathCaptcha($request->input('captcha_answer'), $request->input('captcha_token'))) {
                return back()->withErrors(['captcha_answer' => 'Security challenge failed. Please calculate the sum correctly.'])->withInput();
            }
        }

        // Deduplication & Double-Click Guard (15s replay lockout)
        $fingerprint = 'contact_inquiry_'.md5($request->ip().strtolower($validated['email']).substr($validated['message'], 0, 50));
        if (Cache::has($fingerprint)) {
            return back()->with('success', 'Your inquiry has already been received. We will be in touch shortly!');
        }
        Cache::put($fingerprint, true, 15);

        $contactMessage = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $validated['company'] ?? null,
            'role' => $validated['role'] ?? null,
            'website' => $validated['website'] ?? null,
            'monthly_volume' => $validated['monthly_volume'] ?? null,
            'platform' => $validated['platform'] ?? null,
            'budget' => $validated['budget'] ?? null,
            'service_interest' => $validated['service_interest'] ?? null,
            'message' => $validated['message'],
            'inquiry_type' => 'general',
            'landing_page_url' => $validated['landing_page_url'] ?? null,
            'submission_page_url' => $validated['submission_page_url'] ?? $request->header('referer'),
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
            'utm_term' => $validated['utm_term'] ?? null,
            'utm_content' => $validated['utm_content'] ?? null,
            'click_id' => $validated['click_id'] ?? null,
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]);

        $adminEmail = Setting::where('key', 'contact_email')->value('value') ?: config('mail.from.address', 'hello@cuttingedger.com');
        $calendlyUrl = Setting::where('key', 'calendly_url')->value('value') ?: 'https://calendly.com/cuttingedger/discovery-call';

        try {
            Mail::to($contactMessage->email)->send(new ContactInquiryConfirmationMail($contactMessage, $calendlyUrl));
            Mail::to($adminEmail)->send(new ContactInquiryAdminNotificationMail($contactMessage));
        } catch (\Throwable $e) {
            report($e);
        }

        return redirect()->route('thank-you')->with('success', 'Inquiry transmitted successfully. Our studio team will review your requirements.');
    }

    /**
     * Store a free 3-asset pilot request with full SEO attribution.
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
            'company' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'service' => ['nullable', 'string', 'max:255'],
            'monthly_volume' => ['nullable', 'string', 'max:255'],
            'platform' => ['nullable', 'string', 'max:255'],
            'instructions' => ['nullable', 'string', 'max:5000'],
            'attachments.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd,zip,pdf'],
            // Attribution
            'landing_page_url' => ['nullable', 'string', 'max:1000'],
            'submission_page_url' => ['nullable', 'string', 'max:1000'],
            'utm_source' => ['nullable', 'string', 'max:255'],
            'utm_medium' => ['nullable', 'string', 'max:255'],
            'utm_campaign' => ['nullable', 'string', 'max:255'],
            'utm_term' => ['nullable', 'string', 'max:255'],
            'utm_content' => ['nullable', 'string', 'max:255'],
            'click_id' => ['nullable', 'string', 'max:255'],
        ]);

        $guard = app(EmailAndSpamGuard::class);

        // Math Captcha Verification (Doc §4.4)
        if ($request->filled('captcha_token')) {
            if (! $guard->verifyMathCaptcha($request->input('captcha_answer'), $request->input('captcha_token'))) {
                return back()->withErrors(['captcha_answer' => 'Security challenge failed. Please calculate the sum correctly.'])->withInput();
            }
        }

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
                'email' => $eligibility['reason'],
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
            return redirect()->route('thank-you')->with('success', 'Your trial order has already been received! Our team is processing it.');
        }
        Cache::put($fingerprint, true, 15);

        $serviceName = $validated['service'] ?? 'E-Commerce Catalog Optimization';
        $orderNumber = 'CE-TRL-'.strtoupper(Str::random(6));

        // Directly create the unified Order record with B2B & attribution data
        $order = Order::create([
            'order_number' => $orderNumber,
            'client_name' => $validated['name'],
            'client_email' => strtolower(trim($validated['email'])),
            'client_phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'role' => $validated['role'] ?? null,
            'website' => $validated['website'] ?? null,
            'monthly_volume' => $validated['monthly_volume'] ?? null,
            'platform' => $validated['platform'] ?? null,
            'landing_page_url' => $validated['landing_page_url'] ?? null,
            'submission_page_url' => $validated['submission_page_url'] ?? $request->header('referer'),
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
            'utm_term' => $validated['utm_term'] ?? null,
            'utm_content' => $validated['utm_content'] ?? null,
            'click_id' => $validated['click_id'] ?? null,
            'ip_address' => $request->ip(),
            'service_name' => $serviceName,
            'service_slug' => Str::slug($serviceName),
            'complexity' => 'trial',
            'quantity' => count($imageUrls) ?: 3,
            'uploaded_count' => count($imageUrls) ?: 3,
            'unit_price' => 0.00,
            'discount_percent' => 100,
            'total_price' => 0.00,
            'currency' => 'USD',
            'turnaround' => '24h Standard',
            'images' => $imageUrls,
            'instructions' => $validated['instructions'] ?? 'Complimentary 3-asset production pilot test batch',
            'status' => 'pending',
            'payment_status' => 'free_trial',
            'source' => 'web_trial',
        ]);

        $adminEmail = Setting::where('key', 'contact_email')->value('value') ?: config('mail.from.address', 'hello@cuttingedger.com');
        $calendlyUrl = Setting::where('key', 'calendly_url')->value('value') ?: 'https://calendly.com/cuttingedger/discovery-call';

        try {
            Mail::to($order->client_email)->send(new FreeTrialConfirmationMail($order, $calendlyUrl));
            Mail::to($adminEmail)->send(new FreeTrialAdminNotificationMail($order));
        } catch (\Throwable $e) {
            report($e);
        }

        return redirect()->route('thank-you')->with([
            'success' => "Free 3-Asset Pilot #{$order->order_number} submitted successfully! Our senior artists will return your retouched files within 24 hours.",
            'order_number' => $order->order_number,
        ]);
    }
}
