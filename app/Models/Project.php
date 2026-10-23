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
}
