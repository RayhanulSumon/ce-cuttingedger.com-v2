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
        'needs_human' => 'boolean',
        'last_active_at' => 'datetime',
        'follow_up_sent_at' => 'datetime',
        'operator_joined_at' => 'datetime',
    ];

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function isOperatorActive(): bool
    {
        return $this->mode === 'operator';
    }

    public function takeover(User $operator): void
    {
        $this->update([
            'mode' => 'operator',
            'needs_human' => false,
            'operator_id' => $operator->id,
            'operator_name' => $operator->name,
            'operator_joined_at' => now(),
            'last_active_at' => now(),
            'status' => 'active',
        ]);
    }

    public function returnToBot(): void
    {
        $this->update([
            'mode' => 'bot',
            'needs_human' => false,
            'last_active_at' => now(),
        ]);
    }

    public function requestHuman(): void
    {
        $this->update([
            'needs_human' => true,
            'last_active_at' => now(),
        ]);
    }

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
