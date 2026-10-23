<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FreeTrialConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $calendlyUrl = 'https://calendly.com/cuttingedger/discovery-call'
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your Free 3-Asset Pilot [{$this->order->order_number}] is in Production — Cutting Edger",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.free-trial-confirmation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
