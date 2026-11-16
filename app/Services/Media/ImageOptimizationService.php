<?php

namespace App\Services\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

/**
 * Domain-specific presets for Digital Twins and Virtual Try-On media,
 * powered by the centralized ImageUploadService (Intervention Image -> WebP).
 */
class ImageOptimizationService
{
    public function __construct(public ImageUploadService $imageUploadService) {}

    /**
     * Store a Digital Twin main full-body image as optimized 640w + 1600w alpha-preserving WebP files.
     *
     * @return array{runway_image: string, hi_res_image: string, aspect_ratio: float}
     */
    public function storeTwinModelImage(UploadedFile $file, ?string $oldRunway = null, ?string $oldHiRes = null): array
    {
        $baseName = 'twin-'.Str::random(12);
        $runwayRel = ImageUploadService::PATH_DIGITAL_TWINS."/{$baseName}-640.webp";
        $hiResRel = ImageUploadService::PATH_DIGITAL_TWINS."/{$baseName}-1600.webp";

        $runway = $this->imageUploadService->storeResizedWebp($file, $runwayRel, 640, 86);
        $hiRes = $this->imageUploadService->storeResizedWebp($file, $hiResRel, 1600, 88);

        if (! $runway || ! $hiRes) {
            $url = $this->imageUploadService->uploadAsWebp(
                $file,
                ImageUploadService::PATH_DIGITAL_TWINS,
                1600,
                88,
            );
            $this->imageUploadService->deleteMany([$oldRunway, $oldHiRes]);

            return [
                'runway_image' => $url,
                'hi_res_image' => $url,
                'aspect_ratio' => 0.36,
            ];
        }

        $this->imageUploadService->deleteMany([$oldRunway, $oldHiRes]);

        $aspectRatio = $runway['height'] > 0
            ? round($runway['width'] / $runway['height'], 4)
            : 0.36;

        return [
            'runway_image' => $runway['url'],
            'hi_res_image' => $hiRes['url'],
            'aspect_ratio' => max(0.2, min(1.2, $aspectRatio)),
        ];
    }

    /**
     * Store a Digital Twin individual pose image as an optimized 1080w WebP file.
     */
    public function storeTwinPoseImage(UploadedFile $file, ?string $oldUrl = null): string
    {
        return $this->imageUploadService->uploadAsWebp(
            $file,
            ImageUploadService::PATH_DIGITAL_TWIN_POSES,
            1080,
            86,
            $oldUrl,
            'pose',
        );
    }

    /**
     * Store a Virtual Try-On model image as both 640w runway WebP and 1080w hi-res WebP.
     *
     * @return array{runway_image: string, hi_res_image: string}
     */
    public function storeTryOnModelImage(UploadedFile $file, ?string $oldRunway = null, ?string $oldHiRes = null): array
    {
        $baseName = 'look-'.Str::random(12);
        $runwayRel = ImageUploadService::PATH_TRY_ON."/{$baseName}-640.webp";
        $hiResRel = ImageUploadService::PATH_TRY_ON."/{$baseName}-1080.webp";

        $runway = $this->imageUploadService->storeResizedWebp($file, $runwayRel, 640, 85);
        $hiRes = $this->imageUploadService->storeResizedWebp($file, $hiResRel, 1080, 88);

        if (! $runway || ! $hiRes) {
            $url = $this->imageUploadService->uploadAsWebp(
                $file,
                ImageUploadService::PATH_TRY_ON,
                1080,
                88,
            );
            $this->imageUploadService->deleteMany([$oldRunway, $oldHiRes]);

            return [
                'runway_image' => $url,
                'hi_res_image' => $url,
            ];
        }

        $this->imageUploadService->deleteMany([$oldRunway, $oldHiRes]);

        return [
            'runway_image' => $runway['url'],
            'hi_res_image' => $hiRes['url'],
        ];
    }

    /**
     * Store a Virtual Try-On garment piece cutout as an optimized 600w WebP file.
     */
    public function storeTryOnPieceImage(UploadedFile $file, ?string $oldUrl = null): string
    {
        return $this->imageUploadService->uploadAsWebp(
            $file,
            ImageUploadService::PATH_TRY_ON_PIECES,
            600,
            86,
            $oldUrl,
            'piece',
        );
    }
}
