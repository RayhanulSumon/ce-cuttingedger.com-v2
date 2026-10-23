<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Redirect extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'status_code' => 'integer',
        'is_regex' => 'boolean',
        'hit_count' => 'integer',
        'is_active' => 'boolean',
        'last_hit_at' => 'datetime',
    ];

    public function notFoundLogs(): HasMany
    {
        return $this->hasMany(NotFoundLog::class, 'resolved_redirect_id');
    }

    /**
     * Normalize path for matching.
     */
    public static function normalizePath(string $path): string
    {
        $path = parse_url($path, PHP_URL_PATH) ?? $path;
        $path = '/'.ltrim(rtrim($path, '/'), '/');

        return strtolower($path);
    }
}
