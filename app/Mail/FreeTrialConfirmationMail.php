<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FreeTrialConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(
        public Order $order,
        public string $calendlyUrl = 'https://calendly.com/cuttingedger/discovery-call'
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->order->payment_status === 'free_trial'
            ? "Your Free 3-Asset Pilot [{$this->order->order_number}] is in Production — Cutting Edger"
            : "Order Confirmation [{$this->order->order_number}] — Cutting Edger";

        return new Envelope(
            subject: $subject,
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
