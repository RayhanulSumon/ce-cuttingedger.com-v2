<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'published_at' => 'datetime',
        'reading_time' => 'integer',
        'is_featured' => 'boolean',
        'tags' => 'array',
    ];

    /**
     * Primary blog category.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    /**
     * Child subcategory.
     */
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'subcategory_id');
    }

    /**
     * Author team member.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class, 'author_id');
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::updating(function (Blog $blog): void {
            if ($blog->isDirty('slug')) {
                $oldPath = "/blog/{$blog->getOriginal('slug')}";
                $newPath = "/blog/{$blog->slug}";

                if ($oldPath !== $newPath) {
                    Redirect::updateOrCreate(
                        ['source_path' => $oldPath],
                        [
                            'target_url' => $newPath,
                            'status_code' => 301,
                            'is_regex' => false,
                            'is_active' => true,
                            'notes' => 'Automatic 301 created on blog article URL change',
                        ]
                    );
                }
            }
        });

        static::deleted(function (Blog $blog): void {
            if ($blog->isForceDeleting()) {
                Redirect::updateOrCreate(
                    ['source_path' => "/blog/{$blog->slug}"],
                    [
                        'target_url' => '/blog',
                        'status_code' => 301,
                        'is_regex' => false,
                        'is_active' => true,
                        'notes' => 'Automatic 301 created on blog article permanent deletion',
                    ]
                );
            }
        });
    }
}
