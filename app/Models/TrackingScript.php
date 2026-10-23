<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrackingScript extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'target_pages' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope for active scripts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    /**
     * Scope for placement.
     */
    public function scopePlacement($query, string $placement)
    {
        return $query->where('placement', $placement);
    }
}
