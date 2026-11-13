<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'images' => 'array',
        'specifications' => 'array',
        'completed_files' => 'array',
        'quantity' => 'integer',
        'uploaded_count' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'discount_percent' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order): void {
            if (empty($order->order_number)) {
                $prefix = match (true) {
                    $order->payment_status === 'free_trial' || $order->source === 'web_trial' || $order->source === 'chat_trial' => 'CE-TRL-',
                    str_starts_with((string) $order->order_type, 'digital_twin') => 'CE-TWN-',
                    $order->order_type === 'virtual_try_on_quote' => 'CE-VTO-',
                    default => 'CE-ORD-',
                };
                $order->order_number = $prefix.strtoupper(Str::random(6));
            }
        });
    }

    /**
     * Check if this order is a free trial.
     */
    public function isFreeTrial(): bool
    {
        return $this->payment_status === 'free_trial' || $this->source === 'web_trial' || $this->source === 'chat_trial';
    }

    /**
     * Get the associated Digital Twin if applicable.
     */
    public function digitalTwin(): BelongsTo
    {
        return $this->belongsTo(DigitalTwin::class);
    }

    /**
     * Get the associated Virtual Try-On Look if applicable.
     */
    public function tryOnLook(): BelongsTo
    {
        return $this->belongsTo(TryOnLook::class);
    }

    /**
     * Get associated chat session.
     */
    public function chatSession(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class);
    }

    /**
     * Get client user if registered.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
