<?php

namespace App\Services\Geo;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class IpLocationService
{
    /**
     * Resolve a human-readable location string (City, Region, Country) for an IP address.
     */
    public function resolve(?string $ip): string
    {
        if (blank($ip)) {
            return 'Unknown';
        }

        if (! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return 'Local / Private Network';
        }

        if (app()->runningUnitTests()) {
            return 'Test Environment';
        }

        return Cache::remember("ip_location:{$ip}", now()->addHours(24), function () use ($ip): string {
            try {
                $response = Http::timeout(2)->get("http://ip-api.com/json/{$ip}", [
                    'fields' => 'status,city,regionName,country',
                ]);

                if (! $response->successful()) {
                    return 'Unavailable';
                }

                $data = $response->json();
                if (($data['status'] ?? null) !== 'success') {
                    return 'Unavailable';
                }

                $parts = array_values(array_filter([
                    $data['city'] ?? null,
                    $data['regionName'] ?? null,
                    $data['country'] ?? null,
                ]));

                return $parts !== [] ? implode(', ', $parts) : 'Unavailable';
            } catch (\Throwable) {
                return 'Unavailable';
            }
        });
    }
}
