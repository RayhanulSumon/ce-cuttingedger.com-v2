<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactInquiryConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactMessage $contactMessage,
        public string $calendlyUrl = 'https://calendly.com/cuttingedger/discovery-call'
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'We have received your production inquiry — Cutting Edger',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact-inquiry-confirmation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
