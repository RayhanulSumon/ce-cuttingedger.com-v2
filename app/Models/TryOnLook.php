<?php

namespace App\Models;

use App\Services\Catalog\CatalogCacheService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TryOnLook extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'pieces' => 'array',
        'pins' => 'array',
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
     * Format the Try-On Look for the frontend ring runway and quote page.
     *
     * @return array<string, mixed>
     */
    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'modelName' => $this->model_name,
            'name' => $this->name,
            'description' => $this->description ?? '',
            'model' => $this->runway_image,
            'modelHiRes' => $this->hi_res_image ?: $this->runway_image,
            'pieces' => (array) ($this->pieces ?? []),
            'pins' => (array) ($this->pins ?? []),
            'isFeaturedOnHome' => (bool) $this->is_featured_on_home,
            'isActive' => (bool) $this->is_active,
            'sortOrder' => (int) $this->sort_order,
        ];
    }
}
