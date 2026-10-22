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
            'inquiry_type' => ['nullable', 'string', 'max:50'],
            'turnaround_time' => ['nullable', 'string', 'max:50'],
            'output_format' => ['nullable', 'string', 'max:50'],
            'attachments.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp,tiff,psd,zip,pdf'],
        ]);

        $uploadedPaths = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('trials', 'public');
                    $uploadedPaths[] = [
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'size' => $file->getSize(),
                    ];
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

        $successMessage = ($validated['inquiry_type'] ?? '') === 'free_trial'
            ? 'Free trial request received! Our production team will process your sample images within the specified turnaround window.'
            : 'Inquiry transmitted successfully. Our studio partners will review and respond promptly.';

        return back()->with('success', $successMessage);
    }
}
