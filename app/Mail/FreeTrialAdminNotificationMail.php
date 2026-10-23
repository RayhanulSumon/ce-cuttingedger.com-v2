<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FreeTrialAdminNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🔥 New B2B Pilot Lead [{$this->order->order_number}]: {$this->order->client_name} ({$this->order->company})",
            replyTo: [$this->order->client_email],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.free-trial-admin-notification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
