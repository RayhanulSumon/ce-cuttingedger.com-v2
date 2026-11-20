<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use Illuminate\Translation\PotentiallyTranslatedString;
use Intervention\Image\Laravel\Facades\Image;
use Throwable;

/**
 * Validates studio upload pixel resolution and aspect ratio for Try-On and Digital Twin assets.
 */
class StudioImageDimensions implements ValidationRule
{
    public function __construct(
        public int $minWidth,
        public int $minHeight,
        public float $minRatio,
        public float $maxRatio,
        public string $ratioLabel,
        public string $recommendedSize,
    ) {}

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! ($value instanceof UploadedFile) || ! $value->isValid()) {
            return;
        }

        [$width, $height] = $this->resolveDimensions($value);

        if ($width <= 0 || $height <= 0) {
            $fail('Invalid PNG or WebP image.');

            return;
        }

        $ratio = $width / $height;
        if ($this->maxRatio < 1.0 && $width > $height) {
            $fail("Use a vertical portrait — landscape ({$width}×{$height}) is not allowed.");

            return;
        }

        if ($ratio < $this->minRatio || $ratio > $this->maxRatio) {
            $fail("Wrong ratio ({$width}×{$height}). Use {$this->ratioLabel} ({$this->recommendedSize}).");

            return;
        }

        if ($width < $this->minWidth || $height < $this->minHeight) {
            $fail("Too small ({$width}×{$height}). Min {$this->minWidth}×{$this->minHeight} px.");

            return;
        }
    }

    /**
     * Resolve pixel width and height, falling back to Intervention Image for edge encodings.
     *
     * @return array{0: int, 1: int}
     */
    private function resolveDimensions(UploadedFile $file): array
    {
        $realPath = $file->getRealPath();
        if (! is_string($realPath) || $realPath === '') {
            return [0, 0];
        }

        $info = @getimagesize($realPath);
        if (is_array($info) && isset($info[0], $info[1]) && $info[0] > 0 && $info[1] > 0) {
            return [(int) $info[0], (int) $info[1]];
        }

        try {
            $image = Image::decode($realPath);
            $image->orient();

            return [$image->width(), $image->height()];
        } catch (Throwable) {
            return [0, 0];
        }
    }
}
