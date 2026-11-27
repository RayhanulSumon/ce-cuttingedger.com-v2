<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\AiJob;
use App\Models\Capability;
use App\Services\Billing\StripeCheckoutService;
use App\Services\Catalog\CatalogCacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ClientCapabilityController extends Controller
{
    private const ALLOWED_SERVICES = [
        'background-removal' => [
            'title' => 'Background Removal',
            'subtitle' => 'Upload any garment, product, or model image to remove its background cleanly in seconds.',
        ],
        'digital-twins' => [
            'title' => 'Digital Twins',
            'subtitle' => 'Configure a bespoke AI Digital Twin for your brand or browse ready-to-shoot studio models.',
        ],
        'virtual-try-on' => [
            'title' => 'Virtual Try-On',
            'subtitle' => 'Order studio virtual try-on looks or generate instant AI try-on previews with your garments.',
        ],
    ];

    /**
     * Render one of the 3 Client Portal capability pages directly under /portal/capabilities/{service}.
     */
    public function show(
        Request $request,
        StripeCheckoutService $stripeService,
        string $service
    ): Response {
        abort_unless(array_key_exists($service, self::ALLOWED_SERVICES), 404);

        $capabilityRecord = Capability::active()->where('slug', $service)->first();
        $fallback = self::ALLOWED_SERVICES[$service];

        $capability = [
            'slug' => $service,
            'title' => $capabilityRecord?->title ?? $fallback['title'],
            'subtitle' => $capabilityRecord?->subtitle ?? $fallback['subtitle'],
        ];

        $user = $request->user();

        $props = [
            'capability' => $capability,
            'creditPacks' => $stripeService->packs(),
        ];

        if ($service === 'digital-twins') {
            $mode = (string) $request->query('mode', 'custom');
            if (! in_array($mode, ['custom', 'preset', 'lifetime'], true)) {
                $mode = 'custom';
            }

            $props['digitalTwins'] = CatalogCacheService::getAllDigitalTwins();
            $props['attributes'] = CatalogCacheService::getActiveTwinAttributes();
            $props['initialMode'] = $mode;
            $props['initialTwinSlug'] = Str::limit((string) $request->query('twin', ''), 120, '');
            $props['initialReference'] = Str::limit((string) $request->query('ref', ''), 120, '');
        } elseif ($service === 'virtual-try-on') {
            $props['tryOnLooks'] = CatalogCacheService::getAllTryOnLooks();
            $props['digitalTwins'] = CatalogCacheService::getAllDigitalTwins();
            $props['initialLook'] = Str::limit((string) $request->query('look', $request->query('ref', '')), 120, '');
            $props['initialJobs'] = AiJob::where('user_id', $user->id)
                ->where('service_type', AiJob::SERVICE_TRY_ON)
                ->latest('id')
                ->limit(50)
                ->get();
        } elseif ($service === 'background-removal') {
            $props['initialJobs'] = AiJob::where('user_id', $user->id)
                ->where('service_type', AiJob::SERVICE_BG_REMOVE)
                ->latest('id')
                ->limit(50)
                ->get();
        }

        return Inertia::render('Client/CapabilityShow', $props);
    }
}
