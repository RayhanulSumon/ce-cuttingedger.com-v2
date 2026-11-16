<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiPreviewUsage extends Model
{
    protected $fillable = [
        'user_id',
        'ip_address',
        'feature',
        'preview_url',
        'prompt_summary',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Count how many previews have been consumed by either the given user account or IP address.
     */
    public static function usedCountFor(?int $userId, string $ipAddress): int
    {
        $ipCount = static::where('ip_address', $ipAddress)->count();
        $userCount = $userId ? static::where('user_id', $userId)->count() : 0;

        return max($ipCount, $userCount);
    }

    /**
     * Return quota summary for the current visitor/account.
     *
     * @return array{used: int, remaining: int, limit: int}
     */
    public static function quotaFor(?int $userId, string $ipAddress): array
    {
        $limit = max(1, (int) config('services.vertex_ai.preview_limit', 2));
        $used = static::usedCountFor($userId, $ipAddress);

        return [
            'used' => $used,
            'remaining' => max(0, $limit - $used),
            'limit' => $limit,
        ];
    }
}
