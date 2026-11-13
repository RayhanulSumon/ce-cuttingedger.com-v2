<?php

namespace App\Services\Catalog;

use App\Models\DigitalTwin;
use App\Models\DigitalTwinAttribute;
use App\Models\TryOnLook;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class CatalogCacheService
{
    public const KEY_HOME_TWINS = 'catalog.digital_twins.home';

    public const KEY_ALL_TWINS = 'catalog.digital_twins.all';

    public const KEY_TWIN_ATTRIBUTES = 'catalog.digital_twin_attributes.active';

    public const KEY_HOME_TRY_ON = 'catalog.try_on_looks.home';

    public const KEY_ALL_TRY_ON = 'catalog.try_on_looks.all';

    /**
     * Get active Digital Twins featured on the Homepage runway.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getHomeDigitalTwins(): array
    {
        if (! Schema::hasTable('digital_twins')) {
            return [];
        }

        return Cache::rememberForever(self::KEY_HOME_TWINS, function (): array {
            $models = DigitalTwin::query()
                ->where('is_active', true)
                ->where('is_featured_on_home', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get();

            if ($models->isEmpty()) {
                $models = DigitalTwin::query()
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->orderBy('id')
                    ->take(6)
                    ->get();
            }

            return $models
                ->values()
                ->map(fn (DigitalTwin $twin, int $idx) => $twin->toFrontendArray($idx))
                ->all();
        });
    }

    /**
     * Get all active Digital Twins for the /digital-twins catalog and order reference selector.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getAllDigitalTwins(): array
    {
        if (! Schema::hasTable('digital_twins')) {
            return [];
        }

        return Cache::rememberForever(self::KEY_ALL_TWINS, function (): array {
            return DigitalTwin::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->values()
                ->map(fn (DigitalTwin $twin, int $idx) => $twin->toFrontendArray($idx))
                ->all();
        });
    }

    /**
     * Get all active Digital Twin Configurator Attributes ordered by sort_order.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getActiveTwinAttributes(): array
    {
        if (! Schema::hasTable('digital_twin_attributes')) {
            return [];
        }

        return Cache::rememberForever(self::KEY_TWIN_ATTRIBUTES, function (): array {
            return DigitalTwinAttribute::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (DigitalTwinAttribute $attr) => $attr->toFrontendArray())
                ->all();
        });
    }

    /**
     * Get active Virtual Try-On Looks featured on the Homepage ring runway.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getHomeTryOnLooks(): array
    {
        if (! Schema::hasTable('try_on_looks')) {
            return [];
        }

        return Cache::rememberForever(self::KEY_HOME_TRY_ON, function (): array {
            $looks = TryOnLook::query()
                ->where('is_active', true)
                ->where('is_featured_on_home', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get();

            if ($looks->isEmpty()) {
                $looks = TryOnLook::query()
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->orderBy('id')
                    ->take(6)
                    ->get();
            }

            return $looks
                ->values()
                ->map(fn (TryOnLook $look) => $look->toFrontendArray())
                ->all();
        });
    }

    /**
     * Get all active Virtual Try-On Looks for the quote selector.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getAllTryOnLooks(): array
    {
        if (! Schema::hasTable('try_on_looks')) {
            return [];
        }

        return Cache::rememberForever(self::KEY_ALL_TRY_ON, function (): array {
            return TryOnLook::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->values()
                ->map(fn (TryOnLook $look) => $look->toFrontendArray())
                ->all();
        });
    }

    /**
     * Flush all catalog cache keys after an Admin save or delete.
     */
    public static function flushAll(): void
    {
        Cache::forget(self::KEY_HOME_TWINS);
        Cache::forget(self::KEY_ALL_TWINS);
        Cache::forget(self::KEY_TWIN_ATTRIBUTES);
        Cache::forget(self::KEY_HOME_TRY_ON);
        Cache::forget(self::KEY_ALL_TRY_ON);
    }
}
