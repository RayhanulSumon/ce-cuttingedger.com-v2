<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditTransaction extends Model
{
    public const UPDATED_AT = null;

    public const TYPE_PURCHASE = 'purchase';

    public const TYPE_USAGE = 'usage';

    public const TYPE_REFUND = 'refund';

    public const TYPE_BONUS = 'bonus';

    protected $guarded = [];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    /**
     * User who owns this ledger entry.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

