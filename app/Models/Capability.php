<?php

namespace App\Models;

use Database\Factories\CapabilityFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A main capability (2D, 3D, DTP, Video) or one of its sub-capabilities.
 */
class Capability extends Model
{
    /** @use HasFactory<CapabilityFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'features' => 'array',
        'deliverables' => 'array',
        'process_steps' => 'array',
        'faqs' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Main capabilities only.
     */
    public function scopeMain(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Visible on the public site.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Capability::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Capability::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Public URL path, e.g. /capabilities/2d or /capabilities/2d/ghost-mannequin.
     */
    public function getPathAttribute(): string
    {
        return $this->parent_id && $this->parent
            ? "/capabilities/{$this->parent->slug}/{$this->slug}"
            : "/capabilities/{$this->slug}";
    }

    protected static function booted(): void
    {
        // Keep old links working when a slug or parent changes, or when a capability is removed.
        static::updating(function (Capability $capability): void {
            if (! $capability->isDirty('slug') && ! $capability->isDirty('parent_id')) {
                return;
            }

            $oldParent = $capability->getOriginal('parent_id') ? Capability::find($capability->getOriginal('parent_id')) : null;
            $oldSlug = $capability->getOriginal('slug');
            $oldPath = $oldParent ? "/capabilities/{$oldParent->slug}/{$oldSlug}" : "/capabilities/{$oldSlug}";

            if ($oldPath !== $capability->path) {
                Redirect::updateOrCreate(
                    ['source_path' => $oldPath],
                    [
                        'target_url' => $capability->path,
                        'status_code' => 301,
                        'is_regex' => false,
                        'is_active' => true,
                        'notes' => 'Automatic 301 created on capability URL change',
                    ]
                );
            }
        });

        static::deleted(function (Capability $capability): void {
            Redirect::updateOrCreate(
                ['source_path' => $capability->path],
                [
                    'target_url' => '/capabilities',
                    'status_code' => 301,
                    'is_regex' => false,
                    'is_active' => true,
                    'notes' => 'Automatic 301 created on capability deletion',
                ]
            );
        });
    }
}
