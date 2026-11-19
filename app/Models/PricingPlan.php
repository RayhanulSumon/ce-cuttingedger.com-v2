<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
