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
     * Resolve the emails that receive form-submission notifications.
     *
     * Uses the "admin_notification_emails" setting managed in Admin → Settings; until it has been saved once,
     * the contact email plus the MAIL_ADMIN_RECIPIENTS defaults are used.
     *
     * @return array<int, string>
     */
    public static function adminNotificationRecipients(): array
    {
        $saved = static::where('key', 'admin_notification_emails')->first();

        if ($saved) {
            return static::parseEmailList($saved->value);
        }

        $primary = (string) static::where('key', 'contact_email')->value('value');

        return static::parseEmailList(implode("\n", [$primary, ...(array) config('mail.admin_recipients', [])]));
    }

    /**
     * Split a comma/semicolon/newline separated list into valid, lowercase, unique emails.
     *
     * @return array<int, string>
     */
    public static function parseEmailList(?string $value): array
    {
        return array_values(array_unique(array_filter(
            array_map(fn (string $email): string => strtolower(trim($email)), preg_split('/[\s,;]+/', (string) $value) ?: []),
            fn (string $email): bool => filter_var($email, FILTER_VALIDATE_EMAIL) !== false
        )));
    }

    /**
     * Return the entries of a comma/semicolon/newline separated list that are not valid emails.
     *
     * @return array<int, string>
     */
    public static function invalidEmailsIn(?string $value): array
    {
        return array_values(array_filter(
            array_map('trim', preg_split('/[\s,;]+/', (string) $value) ?: []),
            fn (string $email): bool => $email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false
        ));
    }
}
