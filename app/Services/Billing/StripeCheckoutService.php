<?php

namespace App\Services\Billing;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class StripeCheckoutService
{
    /**
     * Available instant credit packs for Stripe Checkout.
     *
     * @return array<int, array{id: string, name: string, credits: int, price_cents: int, price_usd: float, badge: ?string, description: string}>
     */
    public function packs(): array
    {
        return [
            [
                'id' => 'starter_50',
                'name' => 'Starter Pack',
                'credits' => 50,
                'price_cents' => 1500,
                'price_usd' => 15.00,
                'badge' => null,
                'description' => 'Starter AI Studio credit top-up pack.',
            ],
            [
                'id' => 'studio_200',
                'name' => 'Studio Pack',
                'credits' => 200,
                'price_cents' => 4900,
                'price_usd' => 49.00,
                'badge' => 'Most Popular',
                'description' => 'Standard AI Studio credit pack for brands and teams.',
            ],
            [
                'id' => 'agency_600',
                'name' => 'Agency Pack',
                'credits' => 600,
                'price_cents' => 12900,
                'price_usd' => 129.00,
                'badge' => 'Best Value',
                'description' => 'High-volume AI Studio credit pack for commercial teams.',
            ],
        ];
    }

    /**
     * Find a credit pack by ID.
     *
     * @return array{id: string, name: string, credits: int, price_cents: int, price_usd: float, badge: ?string, description: string}|null
     */
    public function findPack(string $packId): ?array
    {
        foreach ($this->packs() as $pack) {
            if ($pack['id'] === $packId) {
                return $pack;
            }
        }

        return null;
    }

    /**
     * Create a Stripe Checkout Session for a credit pack.
     *
     * @param  array{id: string, name: string, credits: int, price_cents: int, price_usd: float, badge: ?string, description: string}  $pack
     * @return array{id: string, url: string}
     */
    public function createCheckoutSession(
        User $user,
        array $pack,
        string $successUrl,
        string $cancelUrl
    ): array {
        $secret = (string) config('services.stripe.secret');
        if ($secret === '') {
            throw new RuntimeException('Stripe secret key is not configured.');
        }

        $params = [
            'mode' => 'payment',
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'client_reference_id' => (string) $user->id,
            'customer_email' => $user->email,
            'line_items[0][quantity]' => 1,
            'line_items[0][price_data][currency]' => 'usd',
            'line_items[0][price_data][unit_amount]' => $pack['price_cents'],
            'line_items[0][price_data][product_data][name]' => "{$pack['name']} ({$pack['credits']} AI Credits)",
            'line_items[0][price_data][product_data][description]' => $pack['description'],
            'metadata[user_id]' => (string) $user->id,
            'metadata[pack_id]' => $pack['id'],
            'metadata[pack_name]' => $pack['name'],
            'metadata[credits]' => (string) $pack['credits'],
        ];

        $response = Http::withToken($secret)
            ->asForm()
            ->timeout(20)
            ->post('https://api.stripe.com/v1/checkout/sessions', $params);

        if (! $response->successful()) {
            throw new RuntimeException('Unable to create Stripe Checkout session: '.$response->body());
        }

        $data = $response->json() ?? [];

        return [
            'id' => (string) ($data['id'] ?? ''),
            'url' => (string) ($data['url'] ?? ''),
        ];
    }

    /**
     * Verify a Stripe webhook signature and return the decoded event payload.
     *
     * @return array<string, mixed>
     */
    public function verifyWebhookSignature(string $payload, ?string $signatureHeader): array
    {
        $secret = (string) config('services.stripe.webhook_secret');
        if ($secret === '' || ! $signatureHeader) {
            throw new RuntimeException('Stripe webhook secret or signature header missing.');
        }

        $timestamp = null;
        $signatures = [];
        foreach (explode(',', $signatureHeader) as $part) {
            $kv = explode('=', trim($part), 2);
            if (count($kv) === 2) {
                if ($kv[0] === 't') {
                    $timestamp = (int) $kv[1];
                } elseif ($kv[0] === 'v1') {
                    $signatures[] = $kv[1];
                }
            }
        }

        if (! $timestamp || empty($signatures) || abs(time() - $timestamp) > 300) {
            throw new RuntimeException('Invalid or expired Stripe webhook timestamp.');
        }

        $expected = hash_hmac('sha256', "{$timestamp}.{$payload}", $secret);
        $valid = false;
        foreach ($signatures as $sig) {
            if (hash_equals($expected, $sig)) {
                $valid = true;
                break;
            }
        }

        if (! $valid) {
            throw new RuntimeException('Invalid Stripe webhook signature.');
        }

        return json_decode($payload, true, 512, JSON_THROW_ON_ERROR);
    }
}
