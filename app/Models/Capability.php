<?php

namespace App\Models;

use Database\Factories\CapabilityFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

/**
 * A main capability (2D, 3D, DTP, Video) or one of its sub-capabilities.
 */
class Capability extends Model
{
    /** @use HasFactory<CapabilityFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
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

    /**
     * Minimal SEO & routing payload for public capability pages and catalog APIs.
     *
     * @return array<string, mixed>
     */
    public function toPublicArray(bool $includeParent = false, bool $includeChildren = false): array
    {
        $payload = [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'tag' => $this->tag,
            'subtitle' => $this->subtitle,
            'icon' => $this->icon,
            'image' => $this->image,
            'meta_title' => $this->meta_title ?: "{$this->title} | CuttingEdger",
            'meta_description' => $this->meta_description ?: $this->subtitle,
            'is_active' => (bool) $this->is_active,
            'sort_order' => (int) $this->sort_order,
            'path' => $this->path,
        ];

        if ($includeParent) {
            $payload['parent'] = $this->parent ? [
                'id' => $this->parent->id,
                'title' => $this->parent->title,
                'slug' => $this->parent->slug,
                'tag' => $this->parent->tag,
                'subtitle' => $this->parent->subtitle,
                'icon' => $this->parent->icon,
                'image' => $this->parent->image,
                'meta_title' => $this->parent->meta_title ?: "{$this->parent->title} | CuttingEdger",
                'meta_description' => $this->parent->meta_description ?: $this->parent->subtitle,
                'path' => $this->parent->path,
            ] : null;
        }

        if ($includeChildren) {
            $payload['children'] = $this->relationLoaded('children')
                ? $this->children->map(fn (Capability $child) => [
                    'id' => $child->id,
                    'parent_id' => $child->parent_id,
                    'title' => $child->title,
                    'slug' => $child->slug,
                    'tag' => $child->tag,
                    'subtitle' => $child->subtitle,
                    'icon' => $child->icon,
                    'image' => $child->image,
                    'meta_title' => $child->meta_title ?: "{$child->title} | CuttingEdger",
                    'meta_description' => $child->meta_description ?: $child->subtitle,
                    'is_active' => (bool) $child->is_active,
                    'sort_order' => (int) $child->sort_order,
                    'path' => "/capabilities/{$this->slug}/{$child->slug}",
                ])->values()->all()
                : [];
        }

        return $payload;
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('app.capabilities_nav'));

        static::saved(fn () => Cache::forget('app.capabilities_nav'));

        // Keep old links working when a slug or parent changes, or when a capability is removed.
        static::updating(function (Capability $capability): void {
            if (! $capability->isDirty('slug') && ! $capability->isDirty('parent_id')) {
                return;
            }

            $oldParent = $capability->getOriginal('parent_id') ? Capability::find($capability->getOriginal('parent_id')) : null;
            $oldSlug = $capability->getOriginal('slug');
            $oldPath = $oldParent ? "/capabilities/{$oldParent->slug}/{$oldSlug}" : "/capabilities/{$oldSlug}";

            $capability->unsetRelation('parent');

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
            Cache::forget('app.capabilities_nav');
            Cache::forget('app.capabilities_nav');
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
