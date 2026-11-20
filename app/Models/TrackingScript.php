<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class TrackingScript extends Model
{
    use HasFactory;

    public const CACHE_KEY = 'app.tracking_scripts_by_placement';

    protected $guarded = [];

    protected $casts = [
        'target_pages' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }

    /**
     * Retrieve cached concatenated active tracking scripts grouped by HTML placement.
     *
     * @return array{head: string, body_start: string, footer: string}
     */
    public static function cachedByPlacement(): array
    {
        try {
            return Cache::remember(self::CACHE_KEY, 3600, function (): array {
                $grouped = static::active()
                    ->get(['placement', 'code'])
                    ->groupBy('placement');

                return [
                    'head' => $grouped->get('head', collect())->pluck('code')->implode("\n"),
                    'body_start' => $grouped->get('body_start', collect())->pluck('code')->implode("\n"),
                    'footer' => $grouped->get('footer', collect())->pluck('code')->implode("\n"),
                ];
            });
        } catch (\Throwable) {
            return [
                'head' => '',
                'body_start' => '',
                'footer' => '',
            ];
        }
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope for active scripts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    /**
     * Scope for placement.
     */
    public function scopePlacement($query, string $placement)
    {
        return $query->where('placement', $placement);
    }
}
