<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class AiJob extends Model
{
    public const PROVIDER_FAL = 'fal';

    public const PROVIDER_COMFYUI = 'comfyui';

    public const SERVICE_BG_REMOVE = 'bg_remove';

    public const SERVICE_TRY_ON = 'try_on';

    public const STATUS_QUEUED = 'queued';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public const MARKUP_PERCENT = 25.00;

    /**
     * Base credit cost per service before markup.
     *
     * @var array<string, int>
     */
    public const BASE_COSTS = [
        self::SERVICE_BG_REMOVE => 1,
        self::SERVICE_TRY_ON => 4,
    ];

    /**
     * Default user-facing credit costs (base + 25% markup, rounded up).
     *
     * @var array<string, int>
     */
    public const SERVICE_COSTS = [
        self::SERVICE_BG_REMOVE => 2,
        self::SERVICE_TRY_ON => 5,
    ];

    protected $guarded = [];

    /**
     * Hide internal cost, credit charge, and margin fields from client JSON responses.
     *
     * @var list<string>
     */
    protected $hidden = [
        'base_credits',
        'markup_percent',
        'credits_charged',
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
     * Load dynamic AI provider and pricing settings (managed in Admin -> AI Usage & Profit).
     *
     * @return array{provider: string, markup_percent: float, services: array<string, array{model: string, base_credits: int, provider_cost_usd: float}>}
     */
    public static function getDynamicSettings(): array
    {
        $defaults = [
            'provider' => self::PROVIDER_FAL,
            'markup_percent' => self::MARKUP_PERCENT,
            'services' => [
                self::SERVICE_BG_REMOVE => [
                    'model' => (string) config('services.fal.bg_remove_model', 'fal-ai/bria/background/remove'),
                    'base_credits' => self::BASE_COSTS[self::SERVICE_BG_REMOVE],
                    'provider_cost_usd' => (float) config('services.fal.bg_remove_cost_usd', 0.0180),
                ],
                self::SERVICE_TRY_ON => [
                    'model' => (string) config('services.fal.try_on_model', 'fal-ai/fashn/tryon/v1.6'),
                    'base_credits' => self::BASE_COSTS[self::SERVICE_TRY_ON],
                    'provider_cost_usd' => (float) config('services.fal.try_on_cost_usd', 0.0750),
                ],
            ],
        ];

        $saved = Cache::remember('app.ai_service_pricing', 300, function (): mixed {
            try {
                return Setting::get('ai_service_pricing');
            } catch (\Throwable) {
                return null;
            }
        });

        if (! is_array($saved)) {
            return $defaults;
        }

        return [
            'provider' => (string) ($saved['provider'] ?? $defaults['provider']),
            'markup_percent' => (float) ($saved['markup_percent'] ?? $defaults['markup_percent']),
            'services' => [
                self::SERVICE_BG_REMOVE => array_merge(
                    $defaults['services'][self::SERVICE_BG_REMOVE],
                    (array) ($saved['services'][self::SERVICE_BG_REMOVE] ?? [])
                ),
                self::SERVICE_TRY_ON => array_merge(
                    $defaults['services'][self::SERVICE_TRY_ON],
                    (array) ($saved['services'][self::SERVICE_TRY_ON] ?? [])
                ),
            ],
        ];
    }

    /**
     * Resolve user-facing credit cost (including markup) for a given service type.
     */
    public static function costForService(string $serviceType): int
    {
        return self::costBreakdownForService($serviceType)['credits_charged'];
    }

    /**
     * Compute full credit & USD cost breakdown including dynamic Admin markup.
     *
     * @return array{provider: string, model: string, base_credits: int, markup_percent: float, credits_charged: int, provider_cost_usd: float, billed_amount_usd: float, profit_usd: float}
     */
    public static function costBreakdownForService(string $serviceType): array
    {
        $settings = self::getDynamicSettings();
        if (! isset($settings['services'][$serviceType])) {
            throw new \InvalidArgumentException("Unsupported AI service type: {$serviceType}");
        }

        $serviceCfg = $settings['services'][$serviceType];
        $baseCredits = max(1, (int) $serviceCfg['base_credits']);
        $markupPercent = max(0.0, (float) $settings['markup_percent']);
        $creditsCharged = (int) ceil($baseCredits * (1 + ($markupPercent / 100)));

        $providerCostUsd = max(0.0, (float) $serviceCfg['provider_cost_usd']);
        $billedAmountUsd = round($providerCostUsd * (1 + ($markupPercent / 100)), 4);
        $profitUsd = round($billedAmountUsd - $providerCostUsd, 4);

        return [
            'provider' => $settings['provider'],
            'model' => (string) $serviceCfg['model'],
            'base_credits' => $baseCredits,
            'markup_percent' => $markupPercent,
            'credits_charged' => $creditsCharged,
            'provider_cost_usd' => $providerCostUsd,
            'billed_amount_usd' => $billedAmountUsd,
            'profit_usd' => $profitUsd,
        ];
    }
}
