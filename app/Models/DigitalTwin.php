<?php

namespace App\Models;

use App\Services\Catalog\CatalogCacheService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DigitalTwin extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'look_number' => 'integer',
        'sprite_x0' => 'integer',
        'sprite_x1' => 'integer',
        'aspect_ratio' => 'float',
        'is_copyright_sold' => 'boolean',
        'download_count' => 'integer',
        'listed_at' => 'date:Y-m-d',
        'deliverables' => 'array',
        'featured_pieces' => 'array',
        'poses' => 'array',
        'is_featured_on_home' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => CatalogCacheService::flushAll());
        static::deleted(fn () => CatalogCacheService::flushAll());
    }

    /**
     * Default 6 pose framing presets used when a Digital Twin is created or when poses are not overridden.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function defaultPoses(): array
    {
        return [
            [
                'id' => 'pose-01',
                'code' => 'POSE 01',
                'shortName' => 'Front',
                'title' => 'Full-Length Runway Walk',
                'angle' => 'Eye-Level Front · Full Body',
                'lens' => '85mm f/2.0 Studio Prime',
                'imageUrl' => null,
                'yStartFrac' => 0,
                'yEndFrac' => 1,
                'xPadFrac' => 0.04,
                'mirror' => false,
                'tiltDeg' => 0,
                'backdrop' => 'linear-gradient(180deg, #eef3f9 0%, #dde7f2 65%, #f7f9fc 100%)',
            ],
            [
                'id' => 'pose-02',
                'code' => 'POSE 02',
                'shortName' => 'Side',
                'title' => 'Three-Quarter Editorial',
                'angle' => 'Three-Quarter Mid-Length',
                'lens' => '70mm f/2.8 Soft Key',
                'imageUrl' => null,
                'yStartFrac' => 0.01,
                'yEndFrac' => 0.72,
                'xPadFrac' => 0.02,
                'mirror' => false,
                'tiltDeg' => 0,
                'backdrop' => 'linear-gradient(180deg, #f3efe9 0%, #e5dfd5 68%, #faf8f5 100%)',
            ],
            [
                'id' => 'pose-03',
                'code' => 'POSE 03',
                'shortName' => 'Close-Up',
                'title' => 'Portrait & Collar Drape',
                'angle' => 'Close-Up Bust & Neckline',
                'lens' => '105mm f/2.8 Macro Portrait',
                'imageUrl' => null,
                'yStartFrac' => 0.0,
                'yEndFrac' => 0.44,
                'xPadFrac' => 0.08,
                'mirror' => false,
                'tiltDeg' => 0,
                'backdrop' => 'linear-gradient(180deg, #e9eff6 0%, #d7e2ee 70%, #f4f7fb 100%)',
            ],
            [
                'id' => 'pose-04',
                'code' => 'POSE 04',
                'shortName' => 'Back',
                'title' => 'Counter-Turn Silhouette',
                'angle' => 'Mirrored Studio Stance',
                'lens' => '85mm f/2.0 Contre-Jour',
                'imageUrl' => null,
                'yStartFrac' => 0,
                'yEndFrac' => 1,
                'xPadFrac' => 0.04,
                'mirror' => true,
                'tiltDeg' => 0,
                'backdrop' => 'linear-gradient(180deg, #edf1f5 0%, #dce3ec 65%, #f8fafc 100%)',
            ],
            [
                'id' => 'pose-05',
                'code' => 'POSE 05',
                'shortName' => 'Detail',
                'title' => 'Waist & Garment Detail',
                'angle' => 'Mid-Torso & Tailoring Crop',
                'lens' => '90mm f/4.0 Studio Strobe',
                'imageUrl' => null,
                'yStartFrac' => 0.16,
                'yEndFrac' => 0.68,
                'xPadFrac' => 0.05,
                'mirror' => false,
                'tiltDeg' => 0,
                'backdrop' => 'linear-gradient(180deg, #f0f4f8 0%, #dfe7f0 68%, #f9fbfd 100%)',
            ],
            [
                'id' => 'pose-06',
                'code' => 'POSE 06',
                'shortName' => 'Stride',
                'title' => 'Dynamic Runway Stride',
                'angle' => 'Low-Angle Full-Body Motion',
                'lens' => '50mm f/1.8 Editorial Wide',
                'imageUrl' => null,
                'yStartFrac' => 0.08,
                'yEndFrac' => 1.0,
                'xPadFrac' => 0.03,
                'mirror' => true,
                'tiltDeg' => -1.5,
                'backdrop' => 'linear-gradient(180deg, #eaeff5 0%, #d8e2ee 65%, #f5f8fc 100%)',
            ],
        ];
    }

    /**
     * Format the Digital Twin model for the frontend runway, catalog, and modal.
     *
     * @return array<string, mixed>
     */
    public function toFrontendArray(int $index = 0): array
    {
        $x0 = $this->sprite_x0 ?? 12;
        $x1 = $this->sprite_x1 ?? 176;

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'index' => $index,
            'lookNumber' => $this->look_number,
            'x0' => $x0,
            'x1' => $x1,
            'aspectRatio' => (float) ($this->aspect_ratio ?: (($x1 - $x0) / 448)),
            'runwayImage' => $this->runway_image,
            'hiResImage' => $this->hi_res_image ?: $this->runway_image,
            'name' => $this->name,
            'archetype' => $this->archetype,
            'collection' => $this->collection ?? '',
            'presetPrice' => $this->preset_price,
            'customOrderPrice' => $this->custom_order_price,
            'lifetimePrice' => $this->lifetime_price,
            'isCopyrightSold' => (bool) $this->is_copyright_sold,
            'listedAt' => $this->listed_at ? $this->listed_at->format('Y-m-d') : now()->format('Y-m-d'),
            'downloadCount' => (int) $this->download_count,
            'description' => $this->description,
            'deliverables' => (array) ($this->deliverables ?? []),
            'featuredPieces' => (array) ($this->featured_pieces ?? []),
            'poses' => ! empty($this->poses) ? $this->poses : self::defaultPoses(),
            'isFeaturedOnHome' => (bool) $this->is_featured_on_home,
            'isActive' => (bool) $this->is_active,
            'sortOrder' => (int) $this->sort_order,
        ];
    }
}
