<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'gallery' => 'array',
        'deliverables' => 'array',
        'metrics' => 'array',
        'featured' => 'boolean',
        'is_concept' => 'boolean',
        'is_noindex' => 'boolean',
        'before_after_images' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Resolve the public canonical path for this case study.
     */
    public function getPathAttribute(): string
    {
        return "/case-studies/{$this->slug}";
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::updating(function (Project $project): void {
            if ($project->isDirty('slug')) {
                $oldPath = "/case-studies/{$project->getOriginal('slug')}";
                $newPath = "/case-studies/{$project->slug}";

                if ($oldPath !== $newPath) {
                    Redirect::updateOrCreate(
                        ['source_path' => $oldPath],
                        [
                            'target_url' => $newPath,
                            'status_code' => 301,
                            'is_regex' => false,
                            'is_active' => true,
                            'notes' => 'Automatic 301 created on case study URL change',
                        ]
                    );
                }
            }
        });

        static::deleted(function (Project $project): void {
            Redirect::updateOrCreate(
                ['source_path' => "/case-studies/{$project->slug}"],
                [
                    'target_url' => '/case-studies',
                    'status_code' => 301,
                    'is_regex' => false,
                    'is_active' => true,
                    'notes' => 'Automatic 301 created on case study deletion',
                ]
            );
        });
    }
}
