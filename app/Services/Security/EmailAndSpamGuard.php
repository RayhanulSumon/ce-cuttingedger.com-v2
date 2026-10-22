<?php

namespace App\Services\Security;

use App\Models\Order;

class EmailAndSpamGuard
{
    /**
     * List of well-known temporary, burner, and disposable email domains.
     *
     * @var array<string>
     */
    protected array $disposableDomains = [
        'mailinator.com',
        'tempmail.com',
        'temp-mail.org',
        '10minutemail.com',
        '10minutemail.net',
        'guerrillamail.com',
        'guerrillamail.net',
        'guerrillamail.org',
        'sharklasers.com',
        'yopmail.com',
        'yopmail.fr',
        'trashmail.com',
        'dispostable.com',
        'throwawaymail.com',
        'getairmail.com',
        'mohmal.com',
        'crazymailing.com',
        'dropmail.me',
        'burnermail.io',
        'emailondeck.com',
        'fakemailgenerator.com',
        'tempail.com',
        'generator.email',
        'nada.ltd',
        'mytemp.email',
        'getnada.com',
        'inboxkitten.com',
        'maildrop.cc',
        'harakirimail.com',
        'meltmail.com',
        'armyspy.com',
        'cuvox.de',
        'dayrep.com',
        'einrot.com',
        'fleckens.hu',
        'gustr.com',
        'jourrapide.com',
        'rhyta.com',
        'superrito.com',
        'teleworm.us',
    ];

    /**
     * Validate an email address against disposable domains and MX DNS records.
     *
     * @return array{valid: bool, reason: string|null, error_type: string|null}
     */
    public function validateEmail(string $email): array
    {
        $email = strtolower(trim($email));

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'valid' => false,
                'reason' => 'Please provide a valid email format (e.g. name@brand.com).',
                'error_type' => 'invalid_format',
            ];
        }

        $parts = explode('@', $email);
        $domain = $parts[1] ?? '';

        if (empty($domain)) {
            return [
                'valid' => false,
                'reason' => 'Invalid email domain.',
                'error_type' => 'invalid_domain',
            ];
        }

        // 1. Check against known disposable / burner domains
        if ($this->isDisposableDomain($domain)) {
            return [
                'valid' => false,
                'reason' => "Temporary and disposable email addresses ({$domain}) are not accepted for production deliveries. Please provide a genuine business or personal email address.",
                'error_type' => 'disposable_domain',
            ];
        }

        // 2. Real-Time MX / DNS Validation (check if domain exists and can receive mail)
        // Skip in unit test environments or local .test / .local domains
        if (! $this->isLocalOrTestDomain($domain)) {
            if (! $this->hasValidDnsRecords($domain)) {
                return [
                    'valid' => false,
                    'reason' => "The email domain '{$domain}' does not appear to exist or cannot receive mail. Please check for typos.",
                    'error_type' => 'mx_record_missing',
                ];
            }
        }

        return [
            'valid' => true,
            'reason' => null,
            'error_type' => null,
        ];
    }

    /**
     * Check if an IP address has exceeded the free trial rate limit (max 1 per 7 days).
     *
     * @return array{allowed: bool, reason: string|null, existing_id: int|null}
     */
    public function checkIpRateLimit(?string $ipAddress, ?string $currentSessionId = null): array
    {
        if (empty($ipAddress)) {
            return ['allowed' => true, 'reason' => null, 'existing_id' => null];
        }

        // In test environments or local development (127.0.0.1, ::1), allow unless explicitly testing rate limits
        if (app()->environment('local') && in_array($ipAddress, ['127.0.0.1', '::1', 'localhost'], true)) {
            return ['allowed' => true, 'reason' => null, 'existing_id' => null];
        }

        $existingRecentTrial = Order::where('ip_address', $ipAddress)
            ->where('payment_status', 'free_trial')
            ->where('created_at', '>=', now()->subDays(7))
            ->when($currentSessionId, fn ($q) => $q->where('chat_session_id', '!=', $currentSessionId))
            ->latest('id')
            ->first();

        if ($existingRecentTrial) {
            return [
                'allowed' => false,
                'reason' => 'A free trial sample order has already been activated from your network/location recently. To prevent abuse, complimentary trials are limited to 1 per client/studio. Please apply our standard production rates ($0.49/image) or schedule a technical call.',
                'existing_id' => $existingRecentTrial->id,
            ];
        }

        return ['allowed' => true, 'reason' => null, 'existing_id' => null];
    }

    /**
     * Check if a client is eligible for a free trial based on email and IP.
     * Enforces strict limit: 1 free trial per email address and per network/IP.
     *
     * @return array{eligible: bool, reason: string|null, existing_id: int|null}
     */
    public function checkTrialEligibility(string $email, ?string $ipAddress): array
    {
        $normalizedEmail = strtolower(trim($email));

        // 1. Check if email has ever claimed a free trial
        $existingEmailTrial = Order::where('client_email', $normalizedEmail)
            ->where('payment_status', 'free_trial')
            ->latest('id')
            ->first();

        if ($existingEmailTrial) {
            return [
                'eligible' => false,
                'reason' => 'Free trial quota limit reached. A complimentary trial has already been redeemed under this email address. Free trials are strictly limited to 1 trial per client/studio. Please review our paid plans starting at $0.49/image or contact us for high-volume pricing.',
                'existing_id' => $existingEmailTrial->id,
            ];
        }

        // 2. Check if IP address has claimed a free trial recently (skip local test IPs in dev)
        if (! empty($ipAddress) && ! (app()->environment('local') && in_array($ipAddress, ['127.0.0.1', '::1', 'localhost'], true))) {
            $existingIpTrial = Order::where('ip_address', $ipAddress)
                ->where('payment_status', 'free_trial')
                ->where('created_at', '>=', now()->subDays(30))
                ->latest('id')
                ->first();

            if ($existingIpTrial) {
                return [
                    'eligible' => false,
                    'reason' => 'Free trial quota limit reached. A complimentary trial sample has already been activated from your network/location recently. To prevent abuse, complimentary trials are limited to 1 per client/studio. Please apply our standard production rates ($0.49/image) or choose a paid plan.',
                    'existing_id' => $existingIpTrial->id,
                ];
            }
        }

        return [
            'eligible' => true,
            'reason' => null,
            'existing_id' => null,
        ];
    }

    /**
     * Check if domain is disposable.
     */
    protected function isDisposableDomain(string $domain): bool
    {
        if (in_array($domain, $this->disposableDomains, true)) {
            return true;
        }

        // Check for subdomains of disposable providers
        foreach ($this->disposableDomains as $disposable) {
            if (str_ends_with($domain, '.'.$disposable)) {
                return true;
            }
        }

        // Check common suspicious disposable keyword patterns in domain
        $suspiciousKeywords = ['tempmail', '10minute', 'dispos', 'throwaway', 'fakeinbox', 'fakemail'];
        foreach ($suspiciousKeywords as $keyword) {
            if (str_contains($domain, $keyword)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if domain is local or testing domain.
     */
    protected function isLocalOrTestDomain(string $domain): bool
    {
        return str_ends_with($domain, '.test') ||
            str_ends_with($domain, '.local') ||
            str_ends_with($domain, '.example') ||
            str_ends_with($domain, '.localhost') ||
            $domain === 'example.com';
    }

    /**
     * Check if domain has valid MX or A DNS records.
     */
    protected function hasValidDnsRecords(string $domain): bool
    {
        // Skip external network DNS lookups in unit testing environment
        if (app()->runningUnitTests()) {
            return true;
        }

        // Suppress warnings in case DNS lookup fails
        try {
            if (function_exists('checkdnsrr')) {
                return checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A');
            }
        } catch (\Throwable) {
            return true; // Fallback safely if DNS lookup is unavailable
        }

        return true;
    }
}
