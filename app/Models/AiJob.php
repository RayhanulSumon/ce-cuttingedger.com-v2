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

    /**
     * Credit cost schedule per AI service.
     *
     * @var array<string, int>
     */
    public const SERVICE_COSTS = [
        self::SERVICE_BG_REMOVE => 1,
        self::SERVICE_TRY_ON => 5,
    ];

    protected $guarded = [];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'credits_charged' => 'integer',
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
     * Resolve credit cost for a given service type.
     */
    public static function costForService(string $serviceType): int
    {
        return self::SERVICE_COSTS[$serviceType]
            ?? throw new \InvalidArgumentException("Unsupported AI service type: {$serviceType}");
    }
}
