<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminChatSessionController extends Controller
{
    /**
     * Display a listing of client chat sessions & transcripts.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');

        $query = ChatSession::withCount('messages')
            ->with(['consultations'])
            ->orderBy('last_active_at', 'desc');

        if ($status && in_array($status, ['converted', 'active', 'idle', 'abandoned'], true)) {
            $query->where('status', $status);
        }

        $sessions = $query->paginate(20)->through(fn (ChatSession $s) => [
            'id' => $s->id,
            'lead_name' => $s->lead_name ?: 'Anonymous Visitor',
            'lead_email' => $s->lead_email,
            'lead_phone' => $s->lead_phone,
            'company' => $s->company,
            'service_interest' => $s->service_interest,
            'estimated_price' => $s->estimated_price ? number_format((float) $s->estimated_price, 2) : null,
            'status' => $s->status,
            'ip_address' => $s->ip_address,
            'messages_count' => $s->messages_count,
            'has_consultation' => $s->consultations->isNotEmpty(),
            'last_active_at' => $s->last_active_at?->toISOString(),
            'last_active_formatted' => $s->last_active_at?->diffForHumans() ?? 'Never',
            'created_at' => $s->created_at->toISOString(),
        ]);

        $stats = [
            'total_sessions' => ChatSession::count(),
            'captured_leads' => ChatSession::whereNotNull('lead_email')->count(),
            'converted' => ChatSession::where('status', 'converted')->count(),
            'active_recent' => ChatSession::where('last_active_at', '>=', now()->subHours(24))->count(),
        ];

        return Inertia::render('Admin/ChatSessions/Index', [
            'sessions' => $sessions,
            'stats' => $stats,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Fetch complete transcript of a chat session.
     */
    public function show(ChatSession $chatSession): JsonResponse
    {
        $messages = $chatSession->messages()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn (ChatMessage $m) => [
                'id' => $m->id,
                'sender' => $m->sender,
                'content' => $m->content,
                'attachments' => $m->attachments ?? [],
                'tool_calls' => $m->tool_calls ?? [],
                'tool_results' => $m->tool_results ?? [],
                'created_at' => $m->created_at->toISOString(),
                'created_at_formatted' => $m->created_at->format('M j, g:i A'),
            ]);

        return response()->json([
            'session' => [
                'id' => $chatSession->id,
                'lead_name' => $chatSession->lead_name,
                'lead_email' => $chatSession->lead_email,
                'lead_phone' => $chatSession->lead_phone,
                'company' => $chatSession->company,
                'status' => $chatSession->status,
                'ip_address' => $chatSession->ip_address,
                'metadata' => $chatSession->metadata,
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Delete a chat session and associated messages.
     */
    public function destroy(ChatSession $chatSession): RedirectResponse
    {
        $chatSession->delete();

        return redirect()->back()->with('success', 'Chat session transcript deleted.');
    }
}
