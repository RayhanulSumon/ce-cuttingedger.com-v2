<?php

namespace App\Mail;

use App\Models\ContactMessage;
use App\Services\Geo\IpLocationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactInquiryAdminNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;

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
            with: [
                'ipLocation' => app(IpLocationService::class)->resolve($this->contactMessage->ip_address),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
