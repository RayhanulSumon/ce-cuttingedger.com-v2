<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Blog extends Model
{
    use HasFactory;

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
}
