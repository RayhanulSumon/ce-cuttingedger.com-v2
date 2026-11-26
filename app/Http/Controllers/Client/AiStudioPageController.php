<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\AiJob;
use App\Models\DigitalTwin;
use App\Services\Billing\StripeCheckoutService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiStudioPageController extends Controller
{
    /**
     * Render the authenticated AI Studio Dashboard with CuttingEdger's Digital Twin models & poses.
     */
    public function index(Request $request, StripeCheckoutService $stripeService): Response
    {
        $user = $request->user();

        $jobs = AiJob::where('user_id', $user->id)
            ->latest('id')
            ->limit(50)
            ->get();

        $digitalTwins = DigitalTwin::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->values()
            ->map(fn (DigitalTwin $twin, int $idx) => $twin->toFrontendArray($idx))
            ->all();

        return Inertia::render('Client/AiStudio', [
            'initialJobs' => $jobs,
            'digitalTwins' => $digitalTwins,
            'creditPacks' => $stripeService->packs(),
            'serviceCosts' => AiJob::SERVICE_COSTS,
        ]);
    }
}
