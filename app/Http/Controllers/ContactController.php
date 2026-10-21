<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
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
        ]);

        // Deduplication & Double-Click Guard (15s replay lockout)
        $fingerprint = 'contact_inquiry_'.md5($request->ip().strtolower($validated['email']).substr($validated['message'], 0, 50));
        if (Cache::has($fingerprint)) {
            return back()->with('success', 'Your project brief has already been received. We will be in touch shortly!');
        }
        Cache::put($fingerprint, true, 15);

        ContactMessage::create([
            ...$validated,
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]);

        return back()->with('success', 'Inquiry transmitted successfully. Our studio partners will review and respond within 24 hours.');
    }
}
