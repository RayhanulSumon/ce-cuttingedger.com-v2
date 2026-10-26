<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\ContactMessage;
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
        // Acknowledge unread chat leads when admin opens the transcripts & leads page
        ContactMessage::where('inquiry_type', 'chat_lead')
            ->where('status', 'new')
            ->update(['status' => 'read']);

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
            'mode' => $s->mode ?? 'bot',
            'needs_human' => (bool) $s->needs_human,
            'operator_name' => $s->operator_name,
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
            'needs_human' => ChatSession::where('needs_human', true)->count(),
            'operator_active' => ChatSession::where('mode', 'operator')->count(),
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
        // If this session has a lead email, mark associated contact message as read
        if ($chatSession->lead_email) {
            ContactMessage::where('inquiry_type', 'chat_lead')
                ->where('email', $chatSession->lead_email)
                ->where('status', 'new')
                ->update(['status' => 'read']);
        }

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
                'mode' => $chatSession->mode ?? 'bot',
                'needs_human' => (bool) $chatSession->needs_human,
                'operator_id' => $chatSession->operator_id,
                'operator_name' => $chatSession->operator_name,
                'operator_joined_at' => $chatSession->operator_joined_at?->toISOString(),
                'ip_address' => $chatSession->ip_address,
                'metadata' => $chatSession->metadata,
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Take over a chat session as a human operator.
     */
    public function takeover(Request $request, ChatSession $chatSession): JsonResponse
    {
        $user = $request->user();
        $chatSession->takeover($user);

        // Announce operator joining the conversation
        $announcement = ChatMessage::create([
            'chat_session_id' => $chatSession->id,
            'sender' => 'operator',
            'content' => "👋 **{$user->name}** (Studio Lead) has joined the chat.",
        ]);

        return response()->json([
            'success' => true,
            'session' => [
                'id' => $chatSession->id,
                'mode' => $chatSession->mode,
                'needs_human' => (bool) $chatSession->needs_human,
                'operator_name' => $chatSession->operator_name,
            ],
            'announcement' => [
                'id' => $announcement->id,
                'sender' => $announcement->sender,
                'content' => $announcement->content,
                'created_at' => $announcement->created_at->toISOString(),
                'created_at_formatted' => $announcement->created_at->format('M j, g:i A'),
            ],
        ]);
    }

    /**
     * Release chat session back to automated AI / keyword bot.
     */
    public function release(Request $request, ChatSession $chatSession): JsonResponse
    {
        $chatSession->returnToBot();

        $announcement = ChatMessage::create([
            'chat_session_id' => $chatSession->id,
            'sender' => 'assistant',
            'content' => "Our specialist stepped away. I'm here to assist with any quotes, questions, or booking needs!",
        ]);

        return response()->json([
            'success' => true,
            'session' => [
                'id' => $chatSession->id,
                'mode' => $chatSession->mode,
                'needs_human' => (bool) $chatSession->needs_human,
                'operator_name' => null,
            ],
            'announcement' => [
                'id' => $announcement->id,
                'sender' => $announcement->sender,
                'content' => $announcement->content,
                'created_at' => $announcement->created_at->toISOString(),
                'created_at_formatted' => $announcement->created_at->format('M j, g:i A'),
            ],
        ]);
    }

    /**
     * Operator replies directly to visitor.
     */
    public function reply(Request $request, ChatSession $chatSession): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string|max:3000',
        ]);

        // Auto-takeover if replying without having clicked takeover
        if (! $chatSession->isOperatorActive()) {
            $chatSession->takeover($request->user());
        }

        $message = ChatMessage::create([
            'chat_session_id' => $chatSession->id,
            'sender' => 'operator',
            'content' => trim($validated['content']),
        ]);

        $chatSession->touchActivity();

        return response()->json([
            'success' => true,
            'message' => [
                'id' => $message->id,
                'sender' => $message->sender,
                'content' => $message->content,
                'attachments' => [],
                'tool_cards' => [],
                'suggested_replies' => [],
                'created_at' => $message->created_at->toISOString(),
                'created_at_formatted' => $message->created_at->format('M j, g:i A'),
            ],
        ]);
    }

    /**
     * Poll recent messages and session status for live admin chat console.
     */
    public function poll(Request $request, ChatSession $chatSession): JsonResponse
    {
        $afterId = (int) $request->query('after_id', 0);

        $query = $chatSession->messages()->orderBy('id', 'asc');
        if ($afterId > 0) {
            $query->where('id', '>', $afterId);
        }

        $messages = $query->get()->map(fn (ChatMessage $m) => [
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
                'mode' => $chatSession->mode ?? 'bot',
                'needs_human' => (bool) $chatSession->needs_human,
                'operator_id' => $chatSession->operator_id,
                'operator_name' => $chatSession->operator_name,
                'status' => $chatSession->status,
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Mark all unread chat leads as read.
     */
    public function markAllLeadsRead(): RedirectResponse
    {
        ContactMessage::where('inquiry_type', 'chat_lead')
            ->where('status', 'new')
            ->update(['status' => 'read']);

        return redirect()->back()->with('success', 'All new chat leads marked as read.');
    }

    /**
     * Delete a chat session and associated messages.
     */
    public function destroy(ChatSession $chatSession): RedirectResponse
    {
        $chatSession->delete();

        return redirect()->back()->with('success', 'Chat session transcript deleted.');
    }

    /**
     * Delete multiple or all chat sessions.
     */
    public function destroyAll(Request $request): RedirectResponse
    {
        $type = $request->input('type', 'all');

        if ($type === 'empty') {
            $count = ChatSession::doesntHave('messages')->whereNull('lead_email')->delete();

            return redirect()->back()->with('success', "Cleared {$count} empty visitor chat sessions.");
        }

        $count = ChatSession::count();
        ChatSession::query()->delete();

        return redirect()->back()->with('success', "All {$count} chat sessions deleted successfully.");
    }
}
