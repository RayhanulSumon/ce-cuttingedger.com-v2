<?php

namespace App\Services\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Format;
use Intervention\Image\Laravel\Facades\Image;
use Throwable;

/**
 * Centralized image upload, WebP conversion (via Intervention Image), and cleanup service.
 */
class ImageUploadService
{
    public const PATH_CAPABILITIES = 'capabilities';

    public const PATH_BLOG_COVERS = 'blogs/covers';

    public const PATH_DIGITAL_TWINS = 'digital-twins';

    public const PATH_DIGITAL_TWIN_POSES = 'digital-twins/poses';

    public const PATH_TRY_ON = 'try-on';

    public const PATH_TRY_ON_PIECES = 'try-on/pieces';

    public const PATH_ORDERS_TRY_ON = 'orders/try-on';

    public const PATH_AVATARS = 'avatars';

    /**
     * Directory map keyed by domain identifier for easy management.
     *
     * @var array<string, string>
     */
    public const DIRECTORIES = [
        'capabilities' => self::PATH_CAPABILITIES,
        'blog_covers' => self::PATH_BLOG_COVERS,
        'digital_twins' => self::PATH_DIGITAL_TWINS,
        'digital_twin_poses' => self::PATH_DIGITAL_TWIN_POSES,
        'try_on' => self::PATH_TRY_ON,
        'try_on_pieces' => self::PATH_TRY_ON_PIECES,
        'orders_try_on' => self::PATH_ORDERS_TRY_ON,
        'avatars' => self::PATH_AVATARS,
    ];

    /**
     * Resolve a directory key (e.g. "capabilities") or relative path to its storage directory.
     */
    public static function directory(string $keyOrPath): string
    {
        return trim(self::DIRECTORIES[$keyOrPath] ?? $keyOrPath, '/');
    }

    /**
     * Convert any uploaded image to an oriented, scaled WebP file and store it on the public disk.
     * Deletes the previous stored file if `$oldUrl` is provided.
     */
    public function uploadAsWebp(
        UploadedFile $file,
        string $directoryKeyOrPath,
        int $maxWidth = 1920,
        int $quality = 85,
        ?string $oldUrl = null,
        ?string $filenamePrefix = null,
    ): string {
        $directory = self::directory($directoryKeyOrPath);
        $baseName = $this->buildFilename($file, $filenamePrefix);
        $relativePath = "{$directory}/{$baseName}.webp";

        try {
            $image = Image::decode($file->getRealPath());
            $image->orient();
            $image->scaleDown(width: $maxWidth);
            $encoded = $image->encodeUsingFormat(Format::WEBP, quality: $quality);

            Storage::disk('public')->put($relativePath, (string) $encoded);
            $storedUrl = '/storage/'.$relativePath;
        } catch (Throwable) {
            $fallbackPath = Storage::disk('public')->putFile($directory, $file);
            $storedUrl = '/storage/'.$fallbackPath;
        }

        if ($oldUrl && $oldUrl !== $storedUrl) {
            $this->delete($oldUrl);
        }

        return $storedUrl;
    }

    /**
     * Encode an uploaded image to WebP at a specific path without deleting anything, returning dimensions.
     *
     * @return array{url: string, width: int, height: int}|null
     */
    public function storeResizedWebp(
        UploadedFile $file,
        string $relativePath,
        int $maxWidth,
        int $quality = 85,
    ): ?array {
        try {
            $image = Image::decode($file->getRealPath());
            $image->orient();
            $image->scaleDown(width: $maxWidth);
            $width = $image->width();
            $height = $image->height();
            $encoded = $image->encodeUsingFormat(Format::WEBP, quality: $quality);

            Storage::disk('public')->put($relativePath, (string) $encoded);

            return [
                'url' => '/storage/'.$relativePath,
                'width' => $width,
                'height' => $height,
            ];
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Safely delete a previously uploaded `/storage/...` image from the public disk.
     * Ignores external URLs and static `/images/...` assets.
     */
    public function delete(?string $url): void
    {
        if (! $url || ! str_starts_with($url, '/storage/')) {
            return;
        }

        $relativePath = substr($url, strlen('/storage/'));
        if ($relativePath !== '') {
            Storage::disk('public')->delete($relativePath);
        }
    }

    /**
     * Delete multiple `/storage/...` URLs from the public disk.
     *
     * @param  array<int, string|null>  $urls
     */
    public function deleteMany(array $urls): void
    {
        foreach (array_unique(array_filter($urls)) as $url) {
            $this->delete($url);
        }
    }

    private function buildFilename(UploadedFile $file, ?string $prefix): string
    {
        if ($prefix !== null && $prefix !== '') {
            return Str::slug($prefix).'-'.Str::random(10);
        }

        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $cleanName = Str::slug($originalName);

        return ($cleanName !== '' ? Str::limit($cleanName, 35, '') : 'image').'-'.Str::random(8);
    }
}
