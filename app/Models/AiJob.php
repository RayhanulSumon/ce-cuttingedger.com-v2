<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiJob extends Model
{
    public const PROVIDER_FAL = 'fal';

    public const SERVICE_BG_REMOVE = 'bg_remove';

    public const SERVICE_TRY_ON = 'try_on';

    public const STATUS_QUEUED = 'queued';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public const MARKUP_PERCENT = 25.00;

    /**
     * Base credit cost per service before 25% markup.
     *
     * @var array<string, int>
     */
    public const BASE_COSTS = [
        self::SERVICE_BG_REMOVE => 1,
        self::SERVICE_TRY_ON => 4,
    ];

    /**
     * Estimated upstream provider API cost in USD per job.
     *
     * @var array<string, float>
     */
    public const PROVIDER_COSTS_USD = [
        self::SERVICE_BG_REMOVE => 0.0180,
        self::SERVICE_TRY_ON => 0.0750,
    ];

    /**
     * Final user-facing credit costs (base + 25% markup, rounded up).
     *
     * @var array<string, int>
     */
    public const SERVICE_COSTS = [
        self::SERVICE_BG_REMOVE => 2, // 1 + 25% = 1.25 -> 2 credits
        self::SERVICE_TRY_ON => 5,    // 4 + 25% = 5.00 -> 5 credits
    ];

    protected $guarded = [];

    /**
     * Hide internal provider cost & margin fields from client JSON responses.
     *
     * @var list<string>
     */
    protected $hidden = [
        'base_credits',
        'markup_percent',
        'provider_cost_usd',
        'billed_amount_usd',
        'profit_usd',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'base_credits' => 'integer',
            'markup_percent' => 'float',
            'credits_charged' => 'integer',
            'provider_cost_usd' => 'float',
            'billed_amount_usd' => 'float',
            'profit_usd' => 'float',
            'input_payload' => 'array',
            'output_urls' => 'array',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * User who initiated this AI job.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Resolve user-facing credit cost (including 25% markup) for a given service type.
     */
    public static function costForService(string $serviceType): int
    {
        return self::costBreakdownForService($serviceType)['credits_charged'];
    }

    /**
     * Compute full credit & USD cost breakdown including the 25% markup.
     *
     * @return array{base_credits: int, markup_percent: float, credits_charged: int, provider_cost_usd: float, billed_amount_usd: float, profit_usd: float}
     */
    public static function costBreakdownForService(string $serviceType): array
    {
        if (! isset(self::BASE_COSTS[$serviceType])) {
            throw new \InvalidArgumentException("Unsupported AI service type: {$serviceType}");
        }

        $baseCredits = self::BASE_COSTS[$serviceType];
        $markupPercent = self::MARKUP_PERCENT;
        $creditsCharged = (int) ceil($baseCredits * (1 + ($markupPercent / 100)));

        $providerCostUsd = self::PROVIDER_COSTS_USD[$serviceType] ?? 0.0;
        $billedAmountUsd = round($providerCostUsd * (1 + ($markupPercent / 100)), 4);
        $profitUsd = round($billedAmountUsd - $providerCostUsd, 4);

        return [
            'base_credits' => $baseCredits,
            'markup_percent' => $markupPercent,
            'credits_charged' => $creditsCharged,
            'provider_cost_usd' => $providerCostUsd,
            'billed_amount_usd' => $billedAmountUsd,
            'profit_usd' => $profitUsd,
        ];
    }
}
