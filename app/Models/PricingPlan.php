<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PricingPlan extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'features' => 'array',
        'is_popular' => 'boolean',
        'sort_order' => 'integer',
        'base_credits' => 'integer',
        'bonus_credits' => 'integer',
        'price_amount' => 'float',
        'validity_days' => 'integer',
    ];

    /**
     * Credit purchases associated with this pricing plan.
     *
     * @return HasMany<CreditPurchase, $this>
     */
    public function creditPurchases(): HasMany
    {
        return $this->hasMany(CreditPurchase::class);
    }
}
