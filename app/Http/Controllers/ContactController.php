<?php

namespace App\Http\Controllers;

use App\Mail\ContactInquiryAdminNotificationMail;
use App\Mail\ContactInquiryConfirmationMail;
use App\Models\ContactMessage;
use App\Models\Setting;
use App\Services\Security\EmailAndSpamGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Generate a stateless signed math CAPTCHA challenge for public forms.
     */
    public function mathCaptcha(EmailAndSpamGuard $guard): JsonResponse
    {
        return response()->json($guard->generateMathCaptcha());
    }

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
            'phone' => ['nullable', 'string', 'max:50', 'regex:/^\+?[0-9\s().-]{7,25}$/'],
            'company' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'service_interest' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
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
            'phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'website' => $validated['website'] ?? null,
            'service_interest' => $validated['service_interest'] ?? null,
            'message' => $validated['message'],
            'inquiry_type' => 'general',
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]);

        $adminEmails = Setting::adminNotificationRecipients();
        $calendlyUrl = Setting::where('key', 'calendly_url')->value('value') ?: 'https://calendly.com/cuttingedger/discovery-call';

        try {
            Mail::to($contactMessage->email)->queue(new ContactInquiryConfirmationMail($contactMessage, $calendlyUrl));
            if ($adminEmails !== []) {
                Mail::to($adminEmails)->queue(new ContactInquiryAdminNotificationMail($contactMessage));
            }
        } catch (\Throwable $e) {
            report($e);
        }

        return back()->with('success', 'Thank you! Your project brief has been received. One of our project managers will review your requirements and respond within 24 hours.');
    }
}
