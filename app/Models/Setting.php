<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $guarded = [];

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
}
