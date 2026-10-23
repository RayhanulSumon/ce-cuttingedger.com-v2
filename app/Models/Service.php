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

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::updating(function (Service $service): void {
            if ($service->isDirty('slug') || $service->isDirty('parent_id')) {
                $oldSlug = $service->getOriginal('slug');
                $oldParentId = $service->getOriginal('parent_id');
                $oldParent = $oldParentId ? Service::find($oldParentId) : null;
                $oldPath = $oldParent ? "/services/{$oldParent->slug}/{$oldSlug}" : "/services/{$oldSlug}";
                $newPath = $service->path;

                if ($oldPath !== $newPath) {
                    Redirect::updateOrCreate(
                        ['source_path' => $oldPath],
                        [
                            'target_url' => $newPath,
                            'status_code' => 301,
                            'is_regex' => false,
                            'is_active' => true,
                            'notes' => 'Automatic 301 created on service URL change',
                        ]
                    );
                }
            }
        });

        static::deleted(function (Service $service): void {
            Redirect::updateOrCreate(
                ['source_path' => $service->path],
                [
                    'target_url' => '/services',
                    'status_code' => 301,
                    'is_regex' => false,
                    'is_active' => true,
                    'notes' => 'Automatic 301 created on service deletion',
                ]
            );
        });
    }
}
