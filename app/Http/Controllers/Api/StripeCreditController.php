<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Billing\StripeCheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class StripeCreditController extends Controller
{
    public function __construct(
        private readonly StripeCheckoutService $stripeService,
    ) {}

    /**
     * Return available Stripe credit top-up packs.
     */
    public function packs(): JsonResponse
    {
        return response()->json([
            'packs' => $this->stripeService->packs(),
        ]);
    }

    /**
     * Create a Stripe Checkout session for a credit pack.
     */
    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pack_id' => ['required', 'string'],
        ]);

        $pack = $this->stripeService->findPack($validated['pack_id']);
        if (! $pack) {
            return response()->json(['message' => 'Selected credit pack was not found.'], 404);
        }

        $successUrl = route('client.portal.credits').'?checkout=success&session_id={CHECKOUT_SESSION_ID}';
        $cancelUrl = route('client.portal.credits').'?checkout=cancelled';

        try {
            $session = $this->stripeService->createCheckoutSession(
                $request->user(),
                $pack,
                $successUrl,
                $cancelUrl
            );
        } catch (Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 502);
        }

        return response()->json([
            'checkout_url' => $session['url'],
            'session_id' => $session['id'],
        ]);
    }
}
