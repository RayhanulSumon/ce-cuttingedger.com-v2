<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'features' => 'array',
        'deliverables' => 'array',
        'process_steps' => 'array',
        'faqs' => 'array',
        'is_noindex' => 'boolean',
    ];

    /**
     * Parent service pillar (if this is a sub-service).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'parent_id');
    }

    /**
     * Child sub-services.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Service::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Resolve the public canonical path for this service.
     */
    public function getPathAttribute(): string
    {
        if ($this->parent_id && $this->parent) {
            return "/services/{$this->parent->slug}/{$this->slug}";
        }

        return "/services/{$this->slug}";
    }
}
