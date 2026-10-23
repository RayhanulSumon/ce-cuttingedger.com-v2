<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotFoundLog extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'hit_count' => 'integer',
        'last_seen_at' => 'datetime',
    ];

    public function resolvedRedirect(): BelongsTo
    {
        return $this->belongsTo(Redirect::class, 'resolved_redirect_id');
    }
}
