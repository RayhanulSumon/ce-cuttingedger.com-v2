<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatSession extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected $casts = [
        'metadata' => 'array',
        'estimated_price' => 'decimal:2',
        'last_active_at' => 'datetime',
        'follow_up_sent_at' => 'datetime',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at', 'asc');
    }

    public function consultations(): HasMany
    {
        return $this->hasMany(ChatConsultation::class);
    }

    public function touchActivity(): void
    {
        $this->updateQuietly([
            'last_active_at' => now(),
            'status' => 'active',
        ]);
    }
}
