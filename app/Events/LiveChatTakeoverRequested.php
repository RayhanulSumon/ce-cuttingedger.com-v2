<?php

namespace App\Events;

use App\Models\ChatSession;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LiveChatTakeoverRequested implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public ChatSession $session,
        public string $userText = ''
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('admin-notifications'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'chat.takeover_requested';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'type' => 'chat_takeover_requested',
            'title' => '🚨 Live Chat Requested',
            'message' => ($this->session->lead_name ?: 'Anonymous Visitor').' requested a human specialist.',
            'session_id' => $this->session->id,
            'lead_name' => $this->session->lead_name ?: 'Anonymous Visitor',
            'ip_address' => $this->session->ip_address,
            'user_text' => $this->userText,
            'admin_url' => url('/admin/chat-sessions?id='.$this->session->id),
            'timestamp' => now()->toISOString(),
        ];
    }
}
