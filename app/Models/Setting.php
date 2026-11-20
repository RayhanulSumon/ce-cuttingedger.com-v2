<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('app.public_settings'));
        static::deleted(fn () => Cache::forget('app.public_settings'));
    }

    /**
     * Turns the "contact_phones" setting ("BD | +88 02 55020348", one per line) into label/number pairs.
     *
     * @return array<int, array{label: string, number: string}>
     */
    public static function parsePhones(?string $value): array
    {
        $phones = [];

        foreach (preg_split('/\r?\n/', (string) $value) ?: [] as $line) {
            $parts = array_map('trim', explode('|', $line, 2));

            if (count($parts) === 2 && $parts[0] !== '' && $parts[1] !== '') {
                $phones[] = ['label' => $parts[0], 'number' => $parts[1]];
            }
        }

        return $phones;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (! $setting) {
            return $default;
        }

        $decoded = json_decode($setting->value, true);

        return json_last_error() === JSON_ERROR_NONE ? $decoded : $setting->value;
    }

    /**
     * Resolve all admin notification email recipients, deduplicated.
     *
     * @return array<int, string>
     */
    public static function adminNotificationRecipients(): array
    {
        $configured = (array) config('mail.admin_recipients', []);
        $primary = static::where('key', 'contact_email')->value('value');

        $all = array_filter(array_map(
            fn (?string $email): string => strtolower(trim((string) $email)),
            [$primary, ...$configured]
        ), fn (string $email): bool => filter_var($email, FILTER_VALIDATE_EMAIL) !== false);

        return array_values(array_unique($all));
    }
}
