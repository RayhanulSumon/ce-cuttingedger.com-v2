<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class VertexImageGenerationService
{
    /**
     * Generate a real-time preview image using Vertex AI Gemini Image (Nano Banana).
     *
     * @param  array<int, array{mime_type: string, data: string}>  $referenceImages
     */
    public function generatePreview(string $prompt, array $referenceImages = []): string
    {
        if (config('services.vertex_ai.driver') === 'mock') {
            return $this->generateMockPreview($referenceImages);
        }

        $credentials = $this->loadCredentials();
        $accessToken = $this->getAccessToken($credentials);

        $projectId = $credentials['project_id'];
        $location = (string) config('services.vertex_ai.location', 'us-central1');
        $model = (string) config('services.vertex_ai.model', 'gemini-2.5-flash-image');

        $host = $location === 'global'
            ? 'aiplatform.googleapis.com'
            : "{$location}-aiplatform.googleapis.com";

        $endpoint = "https://{$host}/v1/projects/{$projectId}/locations/{$location}/publishers/google/models/{$model}:generateContent";

        $parts = [['text' => $prompt]];
        foreach ($referenceImages as $img) {
            $normalized = $this->normalizeReferenceImage($img['mime_type'], $img['data']);
            $parts[] = [
                'inlineData' => [
                    'mimeType' => $normalized['mime_type'],
                    'data' => $normalized['data'],
                ],
            ];
        }

        $response = Http::withToken($accessToken)
            ->withHeaders(['Expect' => ''])
            ->withOptions([
                'curl' => [
                    CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                ],
            ])
            ->connectTimeout(15)
            ->timeout(90)
            ->post($endpoint, [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => $parts,
                    ],
                ],
                'generationConfig' => [
                    'responseModalities' => ['TEXT', 'IMAGE'],
                ],
            ]);

        if (! $response->successful()) {
            $body = $response->body();
            if (str_contains($body, 'Sorry...') || str_contains($body, 'automated queries')) {
                throw new RuntimeException('Google blocked this local/ISP IP with an automated-queries check. Test from your production server IP or set AI_PREVIEW_DRIVER=mock in local .env.');
            }
            $errorMsg = $response->json('error.message') ?? $body;
            throw new RuntimeException("Vertex AI ({$endpoint}) generation failed: ".$errorMsg);
        }

        $candidates = $response->json('candidates', []);
        foreach ($candidates as $candidate) {
            foreach ($candidate['content']['parts'] ?? [] as $part) {
                $inlineData = $part['inlineData'] ?? $part['inline_data'] ?? null;
                if (! empty($inlineData['data'])) {
                    $mime = $inlineData['mimeType'] ?? $inlineData['mime_type'] ?? 'image/png';
                    $ext = match ($mime) {
                        'image/jpeg', 'image/jpg' => 'jpg',
                        'image/webp' => 'webp',
                        default => 'png',
                    };

                    $binary = base64_decode($inlineData['data'], true);
                    if ($binary === false) {
                        continue;
                    }

                    $path = 'previews/'.date('Y/m').'/'.Str::uuid().'.'.$ext;
                    Storage::disk('public')->put($path, $binary);

                    return '/storage/'.$path;
                }
            }
        }

        throw new RuntimeException('Vertex AI returned no image output. Please try adjusting your prompt or reference images.');
    }

    /**
     * Load and validate the Google Cloud Service Account JSON credentials.
     *
     * @return array{project_id: string, client_email: string, private_key: string, token_uri?: string}
     */
    protected function loadCredentials(): array
    {
        $path = (string) config('services.vertex_ai.credentials_path');
        if ($path === '' || ! is_file($path)) {
            throw new RuntimeException('Vertex AI credentials file not found.');
        }

        $decoded = json_decode((string) file_get_contents($path), true);
        if (
            ! is_array($decoded) ||
            empty($decoded['project_id']) ||
            empty($decoded['client_email']) ||
            empty($decoded['private_key'])
        ) {
            throw new RuntimeException('Invalid Vertex AI service account credentials.');
        }

        return $decoded;
    }

    /**
     * Mint a signed JWT and exchange it for a cached OAuth2 access token.
     *
     * @param  array{project_id: string, client_email: string, private_key: string, token_uri?: string}  $credentials
     */
    protected function getAccessToken(array $credentials): string
    {
        $cacheKey = 'vertex_ai_access_token_'.md5($credentials['client_email']);

        return Cache::remember($cacheKey, now()->addMinutes(50), function () use ($credentials): string {
            $now = time();
            $tokenUri = $credentials['token_uri'] ?? 'https://oauth2.googleapis.com/token';

            $header = $this->base64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT'], JSON_THROW_ON_ERROR));
            $claim = $this->base64UrlEncode(json_encode([
                'iss' => $credentials['client_email'],
                'scope' => 'https://www.googleapis.com/auth/cloud-platform',
                'aud' => $tokenUri,
                'iat' => $now,
                'exp' => $now + 3600,
            ], JSON_THROW_ON_ERROR));

            $unsigned = "{$header}.{$claim}";
            $signature = '';
            $signed = openssl_sign($unsigned, $signature, $credentials['private_key'], OPENSSL_ALGO_SHA256);

            if (! $signed) {
                throw new RuntimeException('Failed to sign Vertex AI JWT assertion.');
            }

            $jwt = $unsigned.'.'.$this->base64UrlEncode($signature);

            $response = Http::asForm()
                ->withOptions(['curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4]])
                ->timeout(20)
                ->post($tokenUri, [
                    'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    'assertion' => $jwt,
                ]);

            if (! $response->successful() || empty($response->json('access_token'))) {
                throw new RuntimeException('Failed to obtain Google OAuth2 token: '.$response->body());
            }

            return (string) $response->json('access_token');
        });
    }

    protected function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Downscale oversized reference images for fast, reliable Vertex AI preview requests.
     *
     * @return array{mime_type: string, data: string}
     */
    protected function normalizeReferenceImage(string $mimeType, string $base64Data): array
    {
        $binary = base64_decode($base64Data, true);
        if ($binary === false || ! function_exists('imagecreatefromstring')) {
            return ['mime_type' => $mimeType, 'data' => $base64Data];
        }

        $image = @imagecreatefromstring($binary);
        if (! $image) {
            return ['mime_type' => $mimeType, 'data' => $base64Data];
        }

        $width = imagesx($image);
        $height = imagesy($image);
        $maxDim = 1024;

        if ($width > $maxDim || $height > $maxDim) {
            $scale = min($maxDim / $width, $maxDim / $height);
            $newW = max(1, (int) round($width * $scale));
            $newH = max(1, (int) round($height * $scale));
            $resized = imagescale($image, $newW, $newH, IMG_BICUBIC);
            if ($resized !== false) {
                imagedestroy($image);
                $image = $resized;
            }
        }

        ob_start();
        imagejpeg($image, null, 85);
        $jpeg = ob_get_clean();
        imagedestroy($image);

        if (! is_string($jpeg) || $jpeg === '') {
            return ['mime_type' => $mimeType, 'data' => $base64Data];
        }

        return [
            'mime_type' => 'image/jpeg',
            'data' => base64_encode($jpeg),
        ];
    }

    /**
     * Local mock fallback when AI_PREVIEW_DRIVER=mock is enabled in .env.
     *
     * @param  array<int, array{mime_type: string, data: string}>  $referenceImages
     */
    protected function generateMockPreview(array $referenceImages): string
    {
        $source = $referenceImages[0]['data'] ?? null;
        $binary = is_string($source) ? base64_decode($source, true) : false;

        if ($binary === false || $binary === '') {
            $fallback = public_path('apple-touch-icon.png');
            $binary = is_file($fallback) ? (string) file_get_contents($fallback) : '';
        }

        $path = 'previews/'.date('Y/m').'/mock-'.Str::uuid().'.png';
        Storage::disk('public')->put($path, $binary);

        return '/storage/'.$path;
    }
}
