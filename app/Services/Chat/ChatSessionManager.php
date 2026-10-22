<?php

namespace App\Services\Chat;

use App\Models\ChatSession;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatSessionManager
{
    public const COOKIE_NAME = 'ce_chat_session_id';

    /**
     * Resolve existing session or optionally create a new public session for the visitor.
     */
    public function resolve(Request $request, bool $touch = true, bool $createIfMissing = true, bool $forceNew = false): ?ChatSession
    {
        $session = null;

        if (! $forceNew && $request->header('X-Chat-Reset') !== 'true') {
            $sessionId = $request->header('X-Chat-Session-Id')
                ?? $request->cookie(self::COOKIE_NAME)
                ?? $request->input('session_id');

            if ($sessionId && Str::isUuid($sessionId)) {
                $session = ChatSession::find($sessionId);
            }
        }

        if (! $session) {
            if (! $createIfMissing) {
                return null;
            }

            $session = ChatSession::create([
                'id' => (string) Str::uuid(),
                'ip_address' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 500),
                'last_active_at' => now(),
                'status' => 'active',
                'metadata' => [
                    'referrer' => $request->header('referer'),
                    'landing_page' => $request->fullUrl(),
                ],
            ]);
        } elseif ($touch) {
            $session->touchActivity();
        }

        return $session;
    }

    /**
     * Check if visitor has been idle and qualifies for an in-session re-engagement nudge.
     *
     * @return array<string, mixed>|null
     */
    public function checkInactivityNudge(ChatSession $session): ?array
    {
        $idleSeconds = (int) config('chat.follow_up.idle_seconds', 120);

        // If inactive for > idleSeconds and no follow-up sent in last 10 minutes
        if ($session->last_active_at &&
            $session->last_active_at->diffInSeconds(now()) >= $idleSeconds &&
            (! $session->follow_up_sent_at || $session->follow_up_sent_at->diffInMinutes(now()) >= 10)) {

            $session->update([
                'status' => 'idle',
                'follow_up_sent_at' => now(),
                'follow_up_count' => $session->follow_up_count + 1,
            ]);

            return [
                'type' => 'inactivity_nudge',
                'content' => '👋 Still thinking it over? Feel free to ask any questions, or test our quality with up to 3 free sample edits.',
                'suggested_replies' => [
                    'Claim 3 Free Sample Edits',
                    'Ask a Question',
                    'Book a Quick Call',
                ],
            ];
        }

        return null;
    }
}
