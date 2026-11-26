<?php

namespace App\Services\Ai;

use App\Models\AiJob;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class ImageAIService implements ImageAIServiceInterface
{
    /**
     * Submit a background removal job to Fal.ai Queue API.
     *
     * @return array<string, mixed>
     */
    public function generateBackgroundRemoval(AiJob $job, string $imageUrl): array
    {
        $breakdown = AiJob::costBreakdownForService(AiJob::SERVICE_BG_REMOVE);
        $modelId = $breakdown['model'];

        return $this->submitFalJob($job, $modelId, [
            'image_url' => $imageUrl,
        ]);
    }

    /**
     * Submit a virtual try-on job to Fal.ai Queue API.
     *
     * @param  array<string, mixed>  $options
     * @return array<string, mixed>
     */
    public function generateVirtualTryOn(
        AiJob $job,
        string $personImageUrl,
        string $garmentImageUrl,
        array $options = []
    ): array {
        $breakdown = AiJob::costBreakdownForService(AiJob::SERVICE_TRY_ON);
        $modelId = $breakdown['model'];

        return $this->submitFalJob($job, $modelId, [
            'model_image' => $personImageUrl,
            'garment_image' => $garmentImageUrl,
            'category' => $options['category'] ?? 'auto',
        ]);
    }

    /**
     * Submit an async job to Fal.ai Queue API with webhook callback.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function submitFalJob(AiJob $job, string $modelId, array $payload): array
    {
        $falKey = (string) config('services.fal.key');
        if ($falKey === '') {
            throw new RuntimeException('Fal.ai API key is not configured.');
        }

        $queueBase = rtrim((string) config('services.fal.queue_base_url', 'https://queue.fal.run'), '/');
        $webhookUrl = route('api.webhooks.fal', ['job_id' => $job->id]);
        $endpoint = "{$queueBase}/{$modelId}?fal_webhook=".urlencode($webhookUrl);

        $response = Http::withHeaders([
            'Authorization' => "Key {$falKey}",
        ])
            ->acceptJson()
            ->timeout(30)
            ->post($endpoint, $payload);

        if (! $response->successful()) {
            throw new RuntimeException("Fal.ai submission failed (HTTP {$response->status()}): ".$response->body());
        }

        $data = $response->json() ?? [];
        $requestId = (string) ($data['request_id'] ?? '');

        $job->update([
            'provider_request_id' => $requestId !== '' ? $requestId : null,
            'status' => AiJob::STATUS_PROCESSING,
        ]);

        return $data;
    }
}
