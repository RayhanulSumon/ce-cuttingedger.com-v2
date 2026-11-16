<?php

namespace App\Http\Controllers;

use App\Models\AiPreviewUsage;
use App\Models\DigitalTwin;
use App\Models\TryOnLook;
use App\Services\Ai\VertexImageGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class AiPreviewController extends Controller
{
    public function __construct(
        protected VertexImageGenerationService $vertexService
    ) {}

    /**
     * Return remaining free AI preview quota for the current account / IP.
     */
    public function quota(Request $request): JsonResponse
    {
        return response()->json(
            AiPreviewUsage::quotaFor($request->user()?->id, (string) $request->ip())
        );
    }

    /**
     * Generate a real-time AI preview (max 2 free per account or IP).
     */
    public function generate(Request $request): JsonResponse
    {
        $userId = $request->user()?->id;
        $ip = (string) $request->ip();
        $quota = AiPreviewUsage::quotaFor($userId, $ip);

        if ($quota['remaining'] <= 0) {
            return response()->json([
                'message' => 'You have used your 2 free real-time AI previews. Submit your order to continue with studio production.',
                'quota' => $quota,
            ], 429);
        }

        $validated = $request->validate([
            'feature' => ['required', 'in:digital_twin,virtual_try_on'],
            'digital_twin_id' => ['nullable', 'integer', 'exists:digital_twins,id'],
            'try_on_look_id' => ['nullable', 'integer', 'exists:try_on_looks,id'],
            'attributes' => ['nullable', 'array'],
            'instructions' => ['nullable', 'string', 'max:2000'],
            'model_file' => ['nullable', 'file', 'max:15360', 'mimes:jpg,jpeg,png,webp'],
            'garment_top' => ['nullable', 'file', 'max:15360', 'mimes:jpg,jpeg,png,webp'],
            'garment_bottom' => ['nullable', 'file', 'max:15360', 'mimes:jpg,jpeg,png,webp'],
            'garment_shoes' => ['nullable', 'file', 'max:15360', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $referenceImages = [];
        $prompt = $validated['feature'] === 'virtual_try_on'
            ? $this->buildTryOnPrompt($request, $validated, $referenceImages)
            : $this->buildDigitalTwinPrompt($request, $validated, $referenceImages);

        try {
            $previewUrl = $this->vertexService->generatePreview($prompt, $referenceImages);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Real-time preview could not be generated right now. Please try again or submit your order.',
            ], 502);
        }

        AiPreviewUsage::create([
            'user_id' => $userId,
            'ip_address' => $ip,
            'feature' => $validated['feature'],
            'preview_url' => $previewUrl,
            'prompt_summary' => mb_substr($prompt, 0, 500),
        ]);

        return response()->json([
            'preview_url' => $previewUrl,
            'quota' => AiPreviewUsage::quotaFor($userId, $ip),
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @param  array<int, array{mime_type: string, data: string}>  $referenceImages
     */
    protected function buildTryOnPrompt(Request $request, array $validated, array &$referenceImages): string
    {
        if ($request->hasFile('model_file')) {
            $this->appendUploadedImage($request->file('model_file'), $referenceImages);
        } elseif (! empty($validated['try_on_look_id'])) {
            $look = TryOnLook::find($validated['try_on_look_id']);
            if ($look?->runway_image) {
                $this->appendLocalImage($look->runway_image, $referenceImages);
            }
        }

        foreach (['garment_top', 'garment_bottom', 'garment_shoes'] as $slot) {
            if ($request->hasFile($slot)) {
                $this->appendUploadedImage($request->file($slot), $referenceImages);
            }
        }

        $notes = trim((string) ($validated['instructions'] ?? ''));

        return trim(
            'High-fashion e-commerce studio photography virtual try-on. '
            .'Dress the person from the first reference image naturally in the garment items shown in the subsequent reference images, '
            .'preserving the model\'s face, pose, body proportions, and neutral studio background with realistic fabric drape and lighting. '
            .($notes !== '' ? "Additional styling notes: {$notes}." : '')
        );
    }

    /**
     * @param  array<string, mixed>  $validated
     * @param  array<int, array{mime_type: string, data: string}>  $referenceImages
     */
    protected function buildDigitalTwinPrompt(Request $request, array $validated, array &$referenceImages): string
    {
        if ($request->hasFile('model_file')) {
            $this->appendUploadedImage($request->file('model_file'), $referenceImages);
        } elseif (! empty($validated['digital_twin_id'])) {
            $twin = DigitalTwin::find($validated['digital_twin_id']);
            if ($twin?->image_url) {
                $this->appendLocalImage($twin->image_url, $referenceImages);
            }
        }

        $traitParts = [];
        foreach (($validated['attributes'] ?? []) as $key => $value) {
            if (is_array($value)) {
                $joined = implode(', ', array_filter(array_map(
                    fn ($k, $v) => $v !== '' && $v !== null ? "{$k}: {$v}" : null,
                    array_keys($value),
                    array_values($value)
                )));
                if ($joined !== '') {
                    $traitParts[] = "{$key} ({$joined})";
                }
            } elseif (is_string($value) && trim($value) !== '') {
                $traitParts[] = "{$key}: {$value}";
            }
        }

        $notes = trim((string) ($validated['instructions'] ?? ''));

        return trim(
            'Full-body high-fashion studio lookbook portrait of a photorealistic fashion model on a clean neutral studio backdrop, editorial lighting. '
            .($referenceImages !== [] ? 'Use the provided reference image for facial identity and overall likeness. ' : '')
            .($traitParts !== [] ? 'Model specifications: '.implode('; ', $traitParts).'. ' : '')
            .($notes !== '' ? "Styling notes: {$notes}." : '')
        );
    }

    /**
     * @param  array<int, array{mime_type: string, data: string}>  $referenceImages
     */
    protected function appendUploadedImage(?UploadedFile $file, array &$referenceImages): void
    {
        if (! $file || ! $file->isValid()) {
            return;
        }

        $raw = file_get_contents($file->getRealPath());
        if ($raw === false) {
            return;
        }

        $referenceImages[] = [
            'mime_type' => $file->getMimeType() ?: 'image/jpeg',
            'data' => base64_encode($raw),
        ];
    }

    /**
     * @param  array<int, array{mime_type: string, data: string}>  $referenceImages
     */
    protected function appendLocalImage(string $publicUrl, array &$referenceImages): void
    {
        if (str_starts_with($publicUrl, 'http://') || str_starts_with($publicUrl, 'https://')) {
            try {
                $res = Http::timeout(15)->get($publicUrl);
                if ($res->successful() && $res->body() !== '') {
                    $mime = $res->header('Content-Type') ?: 'image/webp';
                    $referenceImages[] = [
                        'mime_type' => explode(';', $mime)[0],
                        'data' => base64_encode($res->body()),
                    ];
                }
            } catch (\Throwable) {
                // Ignore unreachable remote reference image
            }

            return;
        }

        $relative = ltrim(parse_url($publicUrl, PHP_URL_PATH) ?: '', '/');
        if ($relative === '') {
            return;
        }

        $candidates = [
            public_path($relative),
            str_starts_with($relative, 'storage/')
                ? storage_path('app/public/'.substr($relative, strlen('storage/')))
                : null,
        ];

        foreach (array_filter($candidates) as $fullPath) {
            if (is_file($fullPath)) {
                $raw = file_get_contents($fullPath);
                if ($raw !== false) {
                    $mime = mime_content_type($fullPath) ?: 'image/jpeg';
                    $referenceImages[] = [
                        'mime_type' => $mime,
                        'data' => base64_encode($raw),
                    ];
                }

                return;
            }
        }
    }
}
