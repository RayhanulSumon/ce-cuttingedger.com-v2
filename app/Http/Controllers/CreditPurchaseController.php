<?php

namespace App\Http\Controllers;

use App\Models\CreditPurchase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CreditPurchaseController extends Controller
{
    /**
     * Store a new studio credit plan or subscription purchase request in credit_purchases.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'pricing_plan_id' => ['nullable', 'integer', 'exists:pricing_plans,id'],
            'plan_name' => ['required', 'string', 'max:120'],
            'base_credits' => ['required', 'integer', 'min:10', 'max:500000'],
            'bonus_credits' => ['required', 'integer', 'min:0', 'max:500000'],
            'total_price' => ['required', 'numeric', 'min:1', 'max:500000'],
            'billing_type' => ['required', 'in:one_time,monthly'],
            'validity_days' => ['nullable', 'integer', 'min:1', 'max:3650'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $user = $request->user();
        $totalPrice = (float) $validated['total_price'];
        $baseCredits = (int) $validated['base_credits'];
        $bonusCredits = (int) $validated['bonus_credits'];
        $totalCredits = $baseCredits + $bonusCredits;
        $effectiveRate = round($totalPrice / max(1, $totalCredits), 4);
        $validityDays = (int) ($validated['validity_days'] ?? ($validated['billing_type'] === 'monthly' ? 30 : 180));
        $featuresSnapshot = array_values(array_filter(
            array_map('trim', (array) ($validated['features'] ?? [])),
            fn (string $item): bool => $item !== ''
        ));

        $purchase = CreditPurchase::create([
            'user_id' => $user->id,
            'pricing_plan_id' => $validated['pricing_plan_id'] ?? null,
            'plan_name' => $validated['plan_name'],
            'billing_type' => $validated['billing_type'],
            'base_credits' => $baseCredits,
            'bonus_credits' => $bonusCredits,
            'total_credits' => $totalCredits,
            'amount_usd' => $totalPrice,
            'currency' => 'USD',
            'effective_rate_per_credit' => $effectiveRate,
            'validity_days' => $validityDays,
            'features_snapshot' => $featuresSnapshot,
            'payment_provider' => 'manual',
            'payment_status' => 'unpaid',
            'status' => 'pending',
            'stripe_customer_id' => $user->stripe_customer_id,
            'credits_activated' => false,
            'client_notes' => $validated['notes'] ?? null,
            'metadata' => [
                'ip_address' => $request->ip(),
                'snapshot_captured_at' => now()->toISOString(),
            ],
        ]);

        return redirect()->route('client.portal')->with(
            'success',
            "Credit plan request #{$purchase->reference_number} submitted for {$totalCredits} studio credits! Your credits will activate as soon as payment is confirmed."
        );
    }
}
