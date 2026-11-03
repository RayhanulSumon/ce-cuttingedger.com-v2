<?php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public ChatMessage $message
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('chat.'.$this->message->chat_session_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'ChatMessageSent';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $session = $this->message->session;

        return [
            'session_id' => $this->message->chat_session_id,
            'message' => [
                'id' => $this->message->id,
                'sender' => $this->message->sender,
                'content' => $this->message->content,
                'attachments' => $this->message->attachments ?? [],
                'tool_cards' => $this->message->tool_results ?? [],
                'suggested_replies' => $this->message->suggested_replies ?? [],
                'is_read' => (bool) $this->message->is_read,
                'created_at' => $this->message->created_at->toISOString(),
            ],
            'mode' => $session?->mode ?? 'bot',
            'needs_human' => (bool) ($session?->needs_human ?? false),
            'operator_name' => $session?->operator_name,
        ];
    }
}
