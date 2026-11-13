<?php

namespace App\Models;

use App\Services\Catalog\CatalogCacheService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DigitalTwinAttribute extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'options' => 'array',
        'allow_custom' => 'boolean',
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => CatalogCacheService::flushAll());
        static::deleted(fn () => CatalogCacheService::flushAll());
    }

    /**
     * Format attribute for the frontend configurator and Admin Panel.
     *
     * @return array<string, mixed>
     */
    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'inputType' => $this->input_type,
            'options' => (array) ($this->options ?? []),
            'allowCustom' => (bool) $this->allow_custom,
            'customLabel' => $this->custom_label ?: 'Custom',
            'placeholder' => $this->placeholder,
            'isRequired' => (bool) $this->is_required,
            'isActive' => (bool) $this->is_active,
            'sortOrder' => (int) $this->sort_order,
        ];
    }
}
