<?php

namespace App\Http\Controllers;

use App\Mail\TeamMemberInquiryMail;
use App\Models\ContactMessage;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * Display all leadership and studio fellows.
     */
    public function index(): Response
    {
        $members = TeamMember::orderBy('sort_order')->get();

        return Inertia::render('Team/Index', [
            'members' => $members,
        ]);
    }

    /**
     * Display member profile detail.
     */
    public function show(TeamMember $member): Response
    {
        $member->load('blogs');

        return Inertia::render('Team/Show', [
            'member' => $member,
        ]);
    }

    /**
     * Send direct message specifically to this team member's private email.
     */
    public function sendInquiry(Request $request, TeamMember $member): RedirectResponse
    {
        // Anti-bot honeypot check
        if ($request->filled('honeypot')) {
            return back()->with('success', 'Thank you for reaching out!');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        // Deduplication & Double-Click Guard: Prevent rapid identical message replay (15s lockout)
        $submissionFingerprint = 'team_inquiry_'.md5($request->ip().$member->id.strtolower($validated['email']).substr($validated['message'], 0, 50));
        if (Cache::has($submissionFingerprint)) {
            return back()->with('success', "Your message was already dispatched to {$member->name}.");
        }
        Cache::put($submissionFingerprint, true, 15);

        // 1. Dispatch email directly to this member's private email if present
        if (! empty($member->email)) {
            Mail::to($member->email)->send(
                new TeamMemberInquiryMail(
                    memberName: $member->name,
                    senderName: $validated['name'],
                    senderEmail: $validated['email'],
                    senderWebsite: $validated['website'] ?? null,
                    inquiryMessage: $validated['message']
                )
            );
        }

        // 2. Also log in ContactMessage under this member's name for admin record
        ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'service_interest' => "Direct Advisory: {$member->name}",
            'message' => ($validated['website'] ? "Website: {$validated['website']}\n\n" : '').$validated['message'],
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]);

        return back()->with('success', "Direct inquiry transmitted to {$member->name}. Expect a response within 4 hours.");
    }
}
