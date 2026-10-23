<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactInquiryAdminNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactMessage $contactMessage
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "📩 New Quote / Project Brief: {$this->contactMessage->name} ({$this->contactMessage->company})",
            replyTo: [$this->contactMessage->email],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact-inquiry-admin-notification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
