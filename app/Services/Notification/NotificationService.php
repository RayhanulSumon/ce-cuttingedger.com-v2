<?php

namespace App\Services\Notification;

use App\Models\ChatConsultation;
use App\Models\ChatSession;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PHPUnit\Framework\Assert as PHPUnit;

class NotificationService
{
    /**
     * Channels currently targeted for the next trigger.
     *
     * @var array<string>
     */
    protected array $targetChannels = [];

    /**
     * Specific user IDs targeted for database notification.
     *
     * @var array<int|string>
     */
    protected array $targetUserIds = [];

    /**
     * Flags for broad role-based targets.
     */
    protected bool $targetAllAdmins = false;

    protected bool $targetAllSuperAdmins = false;

    /**
     * Testing fake mode state.
     */
    protected static bool $isFake = false;

    /**
     * Recorded events in fake mode.
     *
     * @var array<int, array{event: string, channels: array<string>, data: array<string, mixed>}>
     */
    protected static array $recordedEvents = [];

    /**
     * Target all administrators (both admin and super_admin).
     */
    public function toAllAdmins(): self
    {
        $this->targetAllAdmins = true;
        $this->addChannel('admin-notifications');

        return $this;
    }

    /**
     * Target all super administrators.
     */
    public function toAllSuperAdmins(): self
    {
        $this->targetAllSuperAdmins = true;
        $this->addChannel('super-admin-notifications');

        return $this;
    }

    /**
     * Target a single custom admin by User model or ID.
     */
    public function toAdmin(User|int|string $admin): self
    {
        $id = $admin instanceof User ? $admin->id : $admin;
        $this->targetUserIds[] = $id;
        $this->addChannel("admin-user-{$id}");

        return $this;
    }

    /**
     * Target multiple specific administrators.
     *
     * @param  iterable<User|int|string>  $admins
     */
    public function toAdmins(iterable $admins): self
    {
        foreach ($admins as $admin) {
            $this->toAdmin($admin);
        }

        return $this;
    }

    /**
     * Target arbitrary custom Pusher channel(s).
     *
     * @param  string|array<string>  $channels
     */
    public function toChannel(string|array $channels): self
    {
        if (is_array($channels)) {
            foreach ($channels as $channel) {
                $this->addChannel($channel);
            }
        } else {
            $this->addChannel($channels);
        }

        return $this;
    }

    /**
     * Send event notification to all targeted channels and persist in database.
     *
     * @param  array<string, mixed>  $data
     */
    public function send(string $event, array $data = []): bool
    {
        $channels = array_values(array_unique($this->targetChannels));

        // Default to admin-notifications if no channels specifically set
        if (empty($channels)) {
            $channels = ['admin-notifications'];
        }

        // Persist notifications into database table for target administrators
        try {
            $this->storeInDatabase($event, $data);
        } catch (\Throwable $e) {
            Log::warning('Failed saving database notification: '.$e->getMessage());
        }

        // Reset targets for next call
        $this->targetChannels = [];
        $this->targetUserIds = [];
        $this->targetAllAdmins = false;
        $this->targetAllSuperAdmins = false;

        if (self::$isFake) {
            self::$recordedEvents[] = [
                'event' => $event,
                'channels' => $channels,
                'data' => $data,
            ];

            return true;
        }

        return $this->dispatchToPusher($event, $channels, $data);
    }

    /**
     * Store notifications in the standard Laravel notifications table.
     *
     * @param  array<string, mixed>  $data
     */
    protected function storeInDatabase(string $event, array $data): void
    {
        $users = collect();

        if ($this->targetAllSuperAdmins) {
            $users = User::whereHas('role', fn ($q) => $q->where('name', 'super_admin'))->get();
        } elseif ($this->targetAllAdmins) {
            $users = User::whereHas('role', fn ($q) => $q->whereIn('name', ['admin', 'super_admin']))->get();
        } elseif (! empty($this->targetUserIds)) {
            $users = User::whereIn('id', array_unique($this->targetUserIds))->get();
        } else {
            // Default: all admins
            $users = User::whereHas('role', fn ($q) => $q->whereIn('name', ['admin', 'super_admin']))->get();
        }

        foreach ($users as $user) {
            DB::table('notifications')->insert([
                'id' => (string) Str::uuid(),
                'type' => $event,
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => json_encode($data),
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * One-liner convenience: Send to all administrators.
     *
     * @param  array<string, mixed>  $data
     */
    public function sendToAllAdmins(string $event, array $data = []): bool
    {
        return $this->toAllAdmins()->send($event, $data);
    }

    /**
     * One-liner convenience: Send to all super administrators.
     *
     * @param  array<string, mixed>  $data
     */
    public function sendToAllSuperAdmins(string $event, array $data = []): bool
    {
        return $this->toAllSuperAdmins()->send($event, $data);
    }

    /**
     * One-liner convenience: Send to a single admin.
     *
     * @param  array<string, mixed>  $data
     */
    public function sendToAdmin(User|int|string $admin, string $event, array $data = []): bool
    {
        return $this->toAdmin($admin)->send($event, $data);
    }

    /**
     * One-liner convenience: Send to arbitrary channel(s).
     *
     * @param  string|array<string>  $channels
     * @param  array<string, mixed>  $data
     */
    public function sendToChannel(string|array $channels, string $event, array $data = []): bool
    {
        return $this->toChannel($channels)->send($event, $data);
    }

    /**
     * Trigger high-level business notification when a calendar consultation is booked.
     */
    public function triggerConsultationBooked(ChatConsultation $consultation): bool
    {
        $payload = [
            'type' => 'consultation_booked',
            'title' => '📅 New Consultation Booked',
            'message' => "{$consultation->name} booked a call for {$consultation->scheduled_at->format('M j, Y \a\t g:i A')}",
            'consultation_id' => $consultation->id,
            'client_name' => $consultation->name,
            'client_email' => $consultation->email,
            'client_phone' => $consultation->phone,
            'scheduled_at' => $consultation->scheduled_at->toISOString(),
            'admin_url' => url('/admin/consultations'),
            'timestamp' => now()->toISOString(),
        ];

        return $this->toAllAdmins()->send('consultation.booked', $payload);
    }

    /**
     * Trigger high-level business notification when a new lead is captured.
     *
     * @param  array<string, mixed>  $leadData
     */
    public function triggerLeadCaptured(array $leadData): bool
    {
        $clientName = $leadData['name'] ?? 'Visitor';
        $clientEmail = $leadData['email'] ?? 'Unknown';

        $payload = [
            'type' => 'lead_captured',
            'title' => '🎯 New Chat Lead Captured',
            'message' => "Lead captured: {$clientName} ({$clientEmail})",
            'lead' => $leadData,
            'admin_url' => url('/admin/chat-sessions'),
            'timestamp' => now()->toISOString(),
        ];

        return $this->toAllAdmins()->send('lead.captured', $payload);
    }

    /**
     * Trigger real-time chat message broadcast for admin dashboard monitoring.
     */
    public function triggerChatMessage(ChatSession $session, string $message, string $sender = 'user'): bool
    {
        $payload = [
            'type' => 'chat_message',
            'session_id' => $session->id,
            'lead_name' => $session->lead_name ?: 'Anonymous Visitor',
            'sender' => $sender,
            'content' => $message,
            'timestamp' => now()->toISOString(),
        ];

        return $this->toAllAdmins()->send('chat.message', $payload);
    }

    /**
     * Dispatch payload to Pusher HTTP REST API with authentic HMAC-SHA256 signature.
     *
     * @param  array<string>  $channels
     * @param  array<string, mixed>  $data
     */
    protected function dispatchToPusher(string $event, array $channels, array $data): bool
    {
        $appId = config('services.pusher.app_id');
        $key = config('services.pusher.key');
        $secret = config('services.pusher.secret');
        $cluster = config('services.pusher.cluster', 'mt1');

        // If credentials are not set, log and return gracefully
        if (! $appId || ! $key || ! $secret) {
            Log::info("Pusher Notification [Event: {$event}]: Credentials not configured. Simulated delivery to channels: ".implode(', ', $channels), [
                'channels' => $channels,
                'data' => $data,
            ]);

            return true;
        }

        try {
            $body = json_encode([
                'name' => $event,
                'channels' => array_slice($channels, 0, 100), // Pusher max 100 channels per event
                'data' => json_encode($data),
            ]);

            $authTimestamp = (string) time();
            $authVersion = '1.0';
            $bodyMd5 = md5((string) $body);

            // Construct signature string according to Pusher Channels protocol
            $queryString = "auth_key={$key}&auth_timestamp={$authTimestamp}&auth_version={$authVersion}&body_md5={$bodyMd5}";
            $stringToSign = "POST\n/apps/{$appId}/events\n{$queryString}";
            $authSignature = hash_hmac('sha256', $stringToSign, $secret);

            $endpoint = "https://api-{$cluster}.pusher.com/apps/{$appId}/events?{$queryString}&auth_signature={$authSignature}";

            $response = Http::timeout(5)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->withBody((string) $body, 'application/json')
                ->post($endpoint);

            if ($response->successful()) {
                return true;
            }

            Log::warning("Pusher HTTP Trigger Error: status {$response->status()} - {$response->body()}");

            return false;
        } catch (\Throwable $e) {
            Log::error('Pusher Notification Exception: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Internal helper to add a channel to targets.
     */
    protected function addChannel(string $channel): void
    {
        $channel = trim($channel);
        if ($channel !== '' && ! in_array($channel, $this->targetChannels, true)) {
            $this->targetChannels[] = $channel;
        }
    }

    // ==========================================
    // TESTING HARNESS
    // ==========================================

    /**
     * Enable test fake mode.
     */
    public static function fake(): void
    {
        self::$isFake = true;
        self::$recordedEvents = [];
    }

    /**
     * Reset fake mode.
     */
    public static function restore(): void
    {
        self::$isFake = false;
        self::$recordedEvents = [];
    }

    /**
     * Assert an event was sent.
     */
    public static function assertSent(string $event, ?callable $callback = null): void
    {
        $matched = array_filter(self::$recordedEvents, function ($record) use ($event, $callback) {
            if ($record['event'] !== $event) {
                return false;
            }

            return $callback ? $callback($record['channels'], $record['data']) : true;
        });

        PHPUnit::assertTrue(count($matched) > 0, "Failed asserting that event '{$event}' was sent.");
    }

    /**
     * Assert an event was sent to all admins.
     */
    public static function assertSentToAllAdmins(string $event, ?callable $callback = null): void
    {
        self::assertSent($event, function ($channels, $data) use ($callback) {
            if (! in_array('admin-notifications', $channels, true)) {
                return false;
            }

            return $callback ? $callback($channels, $data) : true;
        });
    }

    /**
     * Assert an event was sent to all super admins.
     */
    public static function assertSentToAllSuperAdmins(string $event, ?callable $callback = null): void
    {
        self::assertSent($event, function ($channels, $data) use ($callback) {
            if (! in_array('super-admin-notifications', $channels, true)) {
                return false;
            }

            return $callback ? $callback($channels, $data) : true;
        });
    }

    /**
     * Assert an event was sent to a specific admin.
     */
    public static function assertSentToAdmin(User|int|string $admin, string $event, ?callable $callback = null): void
    {
        $id = $admin instanceof User ? $admin->id : $admin;
        $channel = "admin-user-{$id}";

        self::assertSent($event, function ($channels, $data) use ($channel, $callback) {
            if (! in_array($channel, $channels, true)) {
                return false;
            }

            return $callback ? $callback($channels, $data) : true;
        });
    }
}
