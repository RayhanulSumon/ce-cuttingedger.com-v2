<?php

namespace App\Mail;

use App\Models\Order;
use App\Services\Geo\IpLocationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FreeTrialAdminNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(
        public Order $order
    ) {}

    public function envelope(): Envelope
    {
        $label = match ($this->order->order_type) {
            'digital_twin_preset' => 'Digital Twin Preset Order',
            'digital_twin_custom' => 'Digital Twin Custom Order',
            'digital_twin_lifetime' => 'Digital Twin Lifetime Order',
            'virtual_try_on_order' => 'Virtual Try-On Order',
            default => $this->order->payment_status === 'free_trial' ? '3-Asset Pilot Lead' : 'New Order',
        };
        $company = $this->order->company ? " ({$this->order->company})" : '';

        return new Envelope(
            subject: "{$label} [{$this->order->order_number}]: {$this->order->client_name}{$company}",
            replyTo: [$this->order->client_email],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.free-trial-admin-notification',
            with: [
                'ipLocation' => app(IpLocationService::class)->resolve($this->order->ip_address),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
