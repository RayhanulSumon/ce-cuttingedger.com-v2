<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreditPurchase;
use App\Models\PricingPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminPricingPlanController extends Controller
{
    /**
     * Display a listing of pricing plans.
     */
    public function index(): Response
    {
        $plans = PricingPlan::orderBy('sort_order', 'asc')->get();

        return Inertia::render('Admin/Pricing/Index', [
            'plans' => $plans,
            'pendingCreditOrdersCount' => CreditPurchase::where('status', 'pending')->count(),
            'totalCreditOrdersCount' => CreditPurchase::count(),
        ]);
    }

    /**
     * Store a newly created pricing plan.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePlan($request);
        $validated['slug'] = Str::slug($validated['name']).'-'.Str::random(3);

        PricingPlan::create($validated);

        return redirect()->back()->with('success', 'Credit plan created.');
    }

    /**
     * Update the specified pricing plan.
     */
    public function update(Request $request, PricingPlan $pricing): RedirectResponse
    {
        $validated = $this->validatePlan($request);

        $pricing->update($validated);

        return redirect()->back()->with('success', "Plan [{$pricing->name}] updated.");
    }

    /**
     * Remove the specified pricing plan.
     */
    public function destroy(PricingPlan $pricing): RedirectResponse
    {
        $name = $pricing->name;
        $pricing->delete();

        return redirect()->back()->with('success', "Plan [{$name}] removed.");
    }

    /**
     * Validate and derive display pricing fields for a credit plan.
     *
     * @return array<string, mixed>
     */
    private function validatePlan(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'badge' => ['nullable', 'string', 'max:60'],
            'headline' => ['required', 'string', 'max:255'],
            'base_credits' => ['required', 'integer', 'min:10', 'max:500000'],
            'bonus_credits' => ['required', 'integer', 'min:0', 'max:500000'],
            'price_amount' => ['required', 'numeric', 'min:1', 'max:500000'],
            'validity_days' => ['required', 'integer', 'min:1', 'max:3650'],
            'cta_text' => ['required', 'string', 'max:60'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'is_popular' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $priceAmount = (float) $validated['price_amount'];
        $totalCredits = max(1, (int) $validated['base_credits'] + (int) $validated['bonus_credits']);

        $validated['badge'] = $validated['badge'] ?: ($request->boolean('is_popular') ? 'Most Popular' : 'Credit Pack');
        $validated['features'] = array_values(array_filter(
            array_map('trim', (array) ($validated['features'] ?? [])),
            fn (string $item): bool => $item !== ''
        ));
        $validated['price'] = '$'.number_format($priceAmount, 0);
        $validated['billing_cycle'] = sprintf('$%.2f / credit', $priceAmount / $totalCredits);

        return $validated;
    }
}
