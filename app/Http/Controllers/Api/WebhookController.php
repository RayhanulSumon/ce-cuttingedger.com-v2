<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiJob;
use App\Models\User;
use App\Services\Billing\CreditLedgerService;
use App\Services\Billing\StripeCheckoutService;
use App\Services\Media\DirectUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class WebhookController extends Controller
{
    public function __construct(
        private readonly CreditLedgerService $ledger,
        private readonly DirectUploadService $uploadService,
        private readonly StripeCheckoutService $stripeService,
    ) {}

    /**
     * Handle Fal.ai async webhook callbacks with ED25519 JWKS verification.
     */
    public function fal(Request $request): JsonResponse
    {
        if (! $this->verifyFalSignature($request)) {
            return response()->json(['message' => 'Invalid Fal.ai webhook signature.'], 401);
        }

        $payload = $request->all();
        $jobId = (int) $request->query('job_id', 0);
        $requestId = (string) ($payload['request_id'] ?? $request->header('X-Fal-Webhook-Request-Id', ''));

        $job = $jobId > 0
            ? AiJob::find($jobId)
            : AiJob::where('provider', AiJob::PROVIDER_FAL)->where('provider_request_id', $requestId)->first();

        if (! $job) {
            return response()->json(['message' => 'Job not found.'], 404);
        }

        if ($job->status === AiJob::STATUS_COMPLETED || $job->status === AiJob::STATUS_FAILED) {
            return response()->json(['status' => 'already_processed']);
        }

        $status = strtoupper((string) ($payload['status'] ?? ''));
        $error = $payload['error'] ?? null;

        if ($status === 'ERROR' || ! empty($error)) {
            $reason = is_string($error) ? $error : json_encode($error);
            $this->ledger->failAndRefundJob($job->id, $reason ?: 'Fal.ai reported a processing error.');

            return response()->json(['status' => 'refunded']);
        }

        $resultPayload = is_array($payload['payload'] ?? null) ? $payload['payload'] : $payload;
        $externalUrls = $this->extractFalOutputUrls($resultPayload);

        if (empty($externalUrls)) {
            $this->ledger->failAndRefundJob($job->id, 'Fal.ai webhook completed without output image URLs.');

            return response()->json(['status' => 'refunded']);
        }

        try {
            $permanentUrls = [];
            foreach ($externalUrls as $url) {
                $permanentUrls[] = $this->uploadService->storeFromExternalUrl($url, "ai-outputs/{$job->service_type}");
            }

            $job->update([
                'status' => AiJob::STATUS_COMPLETED,
                'output_urls' => $permanentUrls,
                'completed_at' => now(),
            ]);
        } catch (Throwable $e) {
            Log::error('Failed to persist Fal.ai output to permanent storage', [
                'job_id' => $job->id,
                'error' => $e->getMessage(),
            ]);
            $this->ledger->failAndRefundJob($job->id, 'Failed to archive generated output: '.$e->getMessage());

            return response()->json(['status' => 'refunded']);
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Handle Stripe checkout.session.completed webhooks idempotently.
     */
    public function stripe(Request $request): JsonResponse
    {
        try {
            $event = $this->stripeService->verifyWebhookSignature(
                $request->getContent(),
                $request->header('Stripe-Signature')
            );
        } catch (Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        if (($event['type'] ?? '') !== 'checkout.session.completed') {
            return response()->json(['received' => true]);
        }

        $session = $event['data']['object'] ?? [];
        $sessionId = (string) ($session['id'] ?? '');
        $metadata = is_array($session['metadata'] ?? null) ? $session['metadata'] : [];
        $userId = (int) ($metadata['user_id'] ?? $session['client_reference_id'] ?? 0);
        $credits = (int) ($metadata['credits'] ?? 0);
        $planName = (string) ($metadata['pack_name'] ?? 'Studio Credit Pack');

        $user = $userId > 0 ? User::find($userId) : null;
        if (! $user || $sessionId === '' || $credits <= 0) {
            return response()->json(['message' => 'Missing user or credit metadata.'], 422);
        }

        $this->ledger->grantCreditsFromStripeSession($user, $credits, $sessionId, $planName);

        return response()->json(['received' => true]);
    }

    /**
     * Extract image URLs from various Fal.ai model payload shapes.
     *
     * @param  array<string, mixed>  $payload
     * @return array<int, string>
     */
    private function extractFalOutputUrls(array $payload): array
    {
        $urls = [];

        if (! empty($payload['image']['url']) && is_string($payload['image']['url'])) {
            $urls[] = $payload['image']['url'];
        }

        foreach ((array) ($payload['images'] ?? []) as $img) {
            if (is_string($img) && $img !== '') {
                $urls[] = $img;
            } elseif (is_array($img) && ! empty($img['url'])) {
                $urls[] = (string) $img['url'];
            }
        }

        return array_values(array_unique($urls));
    }

    /**
     * Verify Fal.ai ED25519 webhook signature using Fal JWKS public keys.
     */
    private function verifyFalSignature(Request $request): bool
    {
        $requestId = (string) $request->header('X-Fal-Webhook-Request-Id', '');
        $userId = (string) $request->header('X-Fal-Webhook-User-Id', '');
        $timestamp = (string) $request->header('X-Fal-Webhook-Timestamp', '');
        $signatureHex = (string) $request->header('X-Fal-Webhook-Signature', '');

        if ($requestId === '' || $userId === '' || $timestamp === '' || $signatureHex === '') {
            return false;
        }

        if (abs(time() - (int) $timestamp) > 300) {
            return false;
        }

        if (! function_exists('sodium_crypto_sign_verify_detached')) {
            return false;
        }

        $signatureBin = @hex2bin($signatureHex);
        if ($signatureBin === false || strlen($signatureBin) !== SODIUM_CRYPTO_SIGN_BYTES) {
            return false;
        }

        $bodyHash = hash('sha256', $request->getContent());
        $message = "{$requestId}\n{$userId}\n{$timestamp}\n{$bodyHash}";

        $keys = $this->getFalJwksKeys();
        foreach ($keys as $jwk) {
            if (($jwk['kty'] ?? '') !== 'OKP' || ($jwk['crv'] ?? '') !== 'Ed25519' || empty($jwk['x'])) {
                continue;
            }

            $pubKey = $this->base64UrlDecode((string) $jwk['x']);
            if ($pubKey === false || strlen($pubKey) !== SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES) {
                continue;
            }

            if (sodium_crypto_sign_verify_detached($signatureBin, $message, $pubKey)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Fetch and cache Fal.ai JWKS public keys.
     *
     * @return array<int, array<string, mixed>>
     */
    private function getFalJwksKeys(): array
    {
        return Cache::remember('fal.webhook.jwks', 3600, function (): array {
            $jwksUrl = (string) config('services.fal.jwks_url', 'https://rest.alpha.fal.ai/.well-known/jwks.json');
            $response = Http::timeout(10)->get($jwksUrl);
            if (! $response->successful()) {
                return [];
            }

            return (array) ($response->json('keys') ?? []);
        });
    }

    private function base64UrlDecode(string $input): string|false
    {
        $remainder = strlen($input) % 4;
        if ($remainder) {
            $input .= str_repeat('=', 4 - $remainder);
        }

        return base64_decode(strtr($input, '-_', '+/'), true);
    }
}
