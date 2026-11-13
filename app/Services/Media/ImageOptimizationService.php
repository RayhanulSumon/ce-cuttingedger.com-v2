<?php

namespace App\Services\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageOptimizationService
{
    /**
     * Store a Digital Twin main full-body image as optimized 640w + 1600w alpha-preserving WebP files.
     *
     * @return array{runway_image: string, hi_res_image: string, aspect_ratio: float}
     */
    public function storeTwinModelImage(UploadedFile $file): array
    {
        $baseName = 'twin-'.Str::random(12);
        $runwayRel = "digital-twins/{$baseName}-640.webp";
        $hiResRel = "digital-twins/{$baseName}-1600.webp";

        $dimensions = $this->encodeResizedWebp($file, $runwayRel, 640, 86);
        $this->encodeResizedWebp($file, $hiResRel, 1600, 88);

        if (! $dimensions) {
            $path = $file->store('digital-twins', 'public');
            $url = '/storage/'.$path;

            return [
                'runway_image' => $url,
                'hi_res_image' => $url,
                'aspect_ratio' => 0.36,
            ];
        }

        $aspectRatio = $dimensions['height'] > 0
            ? round($dimensions['width'] / $dimensions['height'], 4)
            : 0.36;

        return [
            'runway_image' => '/storage/'.$runwayRel,
            'hi_res_image' => '/storage/'.$hiResRel,
            'aspect_ratio' => max(0.2, min(1.2, $aspectRatio)),
        ];
    }

    /**
     * Store a Digital Twin individual pose image as an optimized 1080w WebP file.
     */
    public function storeTwinPoseImage(UploadedFile $file): string
    {
        $rel = 'digital-twins/poses/pose-'.Str::random(12).'.webp';
        if ($this->encodeResizedWebp($file, $rel, 1080, 86)) {
            return '/storage/'.$rel;
        }

        return '/storage/'.$file->store('digital-twins/poses', 'public');
    }

    /**
     * Store a Virtual Try-On model image as both 640w runway WebP and 1080w hi-res WebP.
     *
     * @return array{runway_image: string, hi_res_image: string}
     */
    public function storeTryOnModelImage(UploadedFile $file): array
    {
        $baseName = 'look-'.Str::random(12);
        $runwayRel = "try-on/{$baseName}-640.webp";
        $hiResRel = "try-on/{$baseName}-1080.webp";

        $okRunway = $this->encodeResizedWebp($file, $runwayRel, 640, 85);
        $okHiRes = $this->encodeResizedWebp($file, $hiResRel, 1080, 88);

        if (! $okRunway || ! $okHiRes) {
            $path = $file->store('try-on', 'public');
            $url = '/storage/'.$path;

            return [
                'runway_image' => $url,
                'hi_res_image' => $url,
            ];
        }

        return [
            'runway_image' => '/storage/'.$runwayRel,
            'hi_res_image' => '/storage/'.$hiResRel,
        ];
    }

    /**
     * Store a Virtual Try-On garment piece cutout as an optimized 600w WebP file.
     */
    public function storeTryOnPieceImage(UploadedFile $file): string
    {
        $rel = 'try-on/pieces/piece-'.Str::random(12).'.webp';
        if ($this->encodeResizedWebp($file, $rel, 600, 86)) {
            return '/storage/'.$rel;
        }

        return '/storage/'.$file->store('try-on/pieces', 'public');
    }

    /**
     * Resize and convert an uploaded image to alpha-preserving WebP using GD.
     *
     * @return array{width: int, height: int}|null
     */
    private function encodeResizedWebp(UploadedFile $file, string $relativeStoragePath, int $maxWidth, int $quality = 85): ?array
    {
        if (! function_exists('imagecreatefromstring') || ! function_exists('imagewebp')) {
            return null;
        }

        $raw = @file_get_contents($file->getRealPath());
        if (! $raw) {
            return null;
        }

        $src = @imagecreatefromstring($raw);
        if (! $src) {
            return null;
        }

        $origWidth = imagesx($src);
        $origHeight = imagesy($src);

        if ($origWidth <= 0 || $origHeight <= 0) {
            imagedestroy($src);

            return null;
        }

        $targetWidth = min($origWidth, $maxWidth);
        $targetHeight = (int) max(1, round($origHeight * ($targetWidth / $origWidth)));

        $dst = imagecreatetruecolor($targetWidth, $targetHeight);
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
        imagefilledrectangle($dst, 0, 0, $targetWidth, $targetHeight, $transparent);

        imagecopyresampled($dst, $src, 0, 0, 0, 0, $targetWidth, $targetHeight, $origWidth, $origHeight);

        ob_start();
        $encoded = imagewebp($dst, null, $quality);
        $webpBytes = ob_get_clean();

        imagedestroy($src);
        imagedestroy($dst);

        if (! $encoded || ! $webpBytes) {
            return null;
        }

        Storage::disk('public')->put($relativeStoragePath, $webpBytes);

        return [
            'width' => $origWidth,
            'height' => $origHeight,
        ];
    }
}
