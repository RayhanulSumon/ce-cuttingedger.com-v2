<?php

namespace App\Services\Media;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use RuntimeException;

class DirectUploadService
{
    /**
     * Generate a presigned upload URL for direct browser uploads (S3/R2 or signed public disk).
     *
     * @return array{upload_url: string, public_url: string, method: string, headers: array<string, string>, key: string, driver: string}
     */
    public function createPresignedUpload(
        User $user,
        string $filename,
        string $contentType,
        string $purpose = 'inputs'
    ): array {
        $extension = $this->resolveExtension($filename, $contentType);
        $safePurpose = preg_replace('/[^a-z0-9_-]/i', '', $purpose) ?: 'inputs';
        $key = "ai-studio/{$safePurpose}/user-{$user->id}/".Str::uuid().".{$extension}";

        if ($this->hasS3Configuration()) {
            return $this->createS3PresignedPut($key, $contentType);
        }

        $uploadUrl = URL::temporarySignedRoute(
            'api.uploads.local',
            now()->addMinutes(15),
            ['key' => $key, 'user' => $user->id]
        );

        return [
            'upload_url' => $uploadUrl,
            'public_url' => $this->publicDiskUrl($key),
            'method' => 'PUT',
            'headers' => [
                'Content-Type' => $contentType,
            ],
            'key' => $key,
            'driver' => 'local',
        ];
    }

    /**
     * Download a temporary AI output from an external provider and persist it in permanent storage.
     */
    public function storeFromExternalUrl(string $externalUrl, string $directory = 'ai-outputs'): string
    {
        $response = Http::timeout(45)->get($externalUrl);
        if (! $response->successful()) {
            throw new RuntimeException("Failed to download AI output from {$externalUrl} (HTTP {$response->status()}).");
        }

        $contentType = (string) ($response->header('Content-Type') ?? 'image/png');
        $extension = $this->extensionFromMime($contentType, $externalUrl);
        $key = trim($directory, '/').'/'.Str::uuid().".{$extension}";
        $body = $response->body();

        if ($this->hasS3Configuration()) {
            $this->putObjectToS3($key, $body, $contentType);

            return $this->s3PublicUrl($key);
        }

        Storage::disk('public')->put($key, $body);

        return $this->publicDiskUrl($key);
    }

    /**
     * Determine whether S3 / Cloudflare R2 credentials are configured.
     */
    public function hasS3Configuration(): bool
    {
        $disk = config('filesystems.disks.s3', []);

        return ! empty($disk['key']) && ! empty($disk['secret']) && ! empty($disk['bucket']);
    }

    /**
     * Build a SigV4 presigned PUT URL for S3 or Cloudflare R2 without requiring aws-sdk-php.
     *
     * @return array{upload_url: string, public_url: string, method: string, headers: array<string, string>, key: string, driver: string}
     */
    private function createS3PresignedPut(string $key, string $contentType): array
    {
        $disk = config('filesystems.disks.s3');
        $accessKey = (string) $disk['key'];
        $secretKey = (string) $disk['secret'];
        $region = (string) ($disk['region'] ?: 'auto');
        $bucket = (string) $disk['bucket'];
        $endpoint = rtrim((string) ($disk['endpoint'] ?: "https://s3.{$region}.amazonaws.com"), '/');
        $usePathStyle = (bool) ($disk['use_path_style_endpoint'] ?? ! empty($disk['endpoint']));

        $parsed = parse_url($endpoint);
        $scheme = $parsed['scheme'] ?? 'https';
        $host = $parsed['host'] ?? "s3.{$region}.amazonaws.com";

        if ($usePathStyle) {
            $canonicalUri = '/'.rawurlencode($bucket).'/'.implode('/', array_map('rawurlencode', explode('/', $key)));
            $requestHost = $host;
        } else {
            $requestHost = "{$bucket}.{$host}";
            $canonicalUri = '/'.implode('/', array_map('rawurlencode', explode('/', $key)));
        }

        $amzDate = gmdate('Ymd\THis\Z');
        $dateStamp = gmdate('Ymd');
        $credentialScope = "{$dateStamp}/{$region}/s3/aws4_request";

        $queryParams = [
            'X-Amz-Algorithm' => 'AWS4-HMAC-SHA256',
            'X-Amz-Credential' => "{$accessKey}/{$credentialScope}",
            'X-Amz-Date' => $amzDate,
            'X-Amz-Expires' => '900',
            'X-Amz-SignedHeaders' => 'content-type;host',
        ];
        ksort($queryParams);
        $canonicalQuery = http_build_query($queryParams, '', '&', PHP_QUERY_RFC3986);

        $canonicalHeaders = "content-type:{$contentType}\nhost:{$requestHost}\n";
        $signedHeaders = 'content-type;host';
        $canonicalRequest = "PUT\n{$canonicalUri}\n{$canonicalQuery}\n{$canonicalHeaders}\n{$signedHeaders}\nUNSIGNED-PAYLOAD";

        $stringToSign = "AWS4-HMAC-SHA256\n{$amzDate}\n{$credentialScope}\n".hash('sha256', $canonicalRequest);
        $signingKey = $this->getSignatureKey($secretKey, $dateStamp, $region, 's3');
        $signature = hash_hmac('sha256', $stringToSign, $signingKey);

        $uploadUrl = "{$scheme}://{$requestHost}{$canonicalUri}?{$canonicalQuery}&X-Amz-Signature={$signature}";

        return [
            'upload_url' => $uploadUrl,
            'public_url' => $this->s3PublicUrl($key),
            'method' => 'PUT',
            'headers' => [
                'Content-Type' => $contentType,
            ],
            'key' => $key,
            'driver' => 's3',
        ];
    }

    /**
     * Upload raw bytes directly to S3/R2 using a presigned PUT request.
     */
    private function putObjectToS3(string $key, string $body, string $contentType): void
    {
        $presigned = $this->createS3PresignedPut($key, $contentType);
        $response = Http::withHeaders(['Content-Type' => $contentType])
            ->withBody($body, $contentType)
            ->timeout(45)
            ->put($presigned['upload_url']);

        if (! $response->successful()) {
            throw new RuntimeException("S3/R2 upload failed with HTTP {$response->status()}.");
        }
    }

    private function getSignatureKey(string $key, string $dateStamp, string $regionName, string $serviceName): string
    {
        $kDate = hash_hmac('sha256', $dateStamp, 'AWS4'.$key, true);
        $kRegion = hash_hmac('sha256', $regionName, $kDate, true);
        $kService = hash_hmac('sha256', $serviceName, $kRegion, true);

        return hash_hmac('sha256', 'aws4_request', $kService, true);
    }

    private function s3PublicUrl(string $key): string
    {
        $base = rtrim((string) config('filesystems.disks.s3.url'), '/');
        if ($base !== '') {
            return "{$base}/{$key}";
        }

        $bucket = (string) config('filesystems.disks.s3.bucket');
        $region = (string) (config('filesystems.disks.s3.region') ?: 'us-east-1');

        return "https://{$bucket}.s3.{$region}.amazonaws.com/{$key}";
    }

    private function publicDiskUrl(string $key): string
    {
        return rtrim((string) config('app.url', 'http://localhost'), '/').'/storage/'.ltrim($key, '/');
    }

    private function resolveExtension(string $filename, string $contentType): string
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            return $ext;
        }

        return $this->extensionFromMime($contentType, $filename);
    }

    private function extensionFromMime(string $contentType, string $fallbackPath = ''): string
    {
        return match (true) {
            str_contains($contentType, 'jpeg'), str_contains($contentType, 'jpg') => 'jpg',
            str_contains($contentType, 'webp') => 'webp',
            str_contains($contentType, 'png') => 'png',
            default => strtolower(pathinfo(parse_url($fallbackPath, PHP_URL_PATH) ?: '', PATHINFO_EXTENSION)) ?: 'png',
        };
    }
}
