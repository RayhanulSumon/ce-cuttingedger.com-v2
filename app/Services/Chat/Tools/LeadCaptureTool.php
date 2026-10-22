<?php

namespace App\Services\Chat\Tools;

use App\Models\ChatSession;
use App\Models\ContactMessage;

class LeadCaptureTool
{
    /**
     * Tool schema for lead capture.
     *
     * @return array<string, mixed>
     */
    public static function schema(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'capture_lead',
                'description' => 'Capture visitor contact information to send an itemized estimate, sample edits, or follow-up communication.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'email' => ['type' => 'string', 'description' => 'Visitor email address'],
                        'name' => ['type' => 'string', 'description' => 'Visitor name'],
                        'phone' => ['type' => 'string', 'description' => 'Visitor phone or WhatsApp number'],
                        'company' => ['type' => 'string', 'description' => 'Company or store name'],
                        'notes' => ['type' => 'string', 'description' => 'Notes or specifics discussed'],
                    ],
                    'required' => ['email'],
                ],
            ],
        ];
    }

    /**
     * Save lead to session and contact messages.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function execute(array $params, ?ChatSession $session = null): array
    {
        $email = trim((string) ($params['email'] ?? ''));
        $name = trim((string) ($params['name'] ?? 'Visitor'));
        $phone = trim((string) ($params['phone'] ?? ''));
        $company = trim((string) ($params['company'] ?? ''));
        $notes = trim((string) ($params['notes'] ?? 'Captured via smart chat assistant'));

        if ($session) {
            $session->update([
                'lead_email' => $email,
                'lead_name' => $name !== 'Visitor' ? $name : $session->lead_name,
                'lead_phone' => $phone ?: $session->lead_phone,
                'company' => $company ?: $session->company,
                'status' => 'converted',
            ]);
        }

        ContactMessage::create([
            'name' => $name,
            'email' => $email,
            'company' => $company ?: null,
            'service_interest' => $session?->service_interest ?? 'Chat Inquiry',
            'message' => $notes,
            'inquiry_type' => 'chat_lead',
            'status' => 'new',
            'ip_address' => $session?->ip_address,
        ]);

        return [
            'type' => 'lead_captured_card',
            'email' => $email,
            'name' => $name,
            'message' => "Thank you! We've registered {$email}. Our senior team will follow up shortly with your tailored details.",
        ];
    }
}
