<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        ]);
    }

    /**
     * Store a newly created pricing plan.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'headline' => ['required', 'string', 'max:255'],
            'price' => ['required', 'string', 'max:50'],
            'billing_cycle' => ['required', 'string', 'max:50'],
            'cta_text' => ['required', 'string', 'max:50'],
            'is_popular' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $validated['slug'] = Str::slug($validated['name']).'-'.Str::random(3);

        PricingPlan::create($validated);

        return redirect()->back()->with('success', 'Engagement plan created.');
    }

    /**
     * Update the specified pricing plan.
     */
    public function update(Request $request, PricingPlan $pricing): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'headline' => ['required', 'string', 'max:255'],
            'price' => ['required', 'string', 'max:50'],
            'billing_cycle' => ['required', 'string', 'max:50'],
            'cta_text' => ['required', 'string', 'max:50'],
            'is_popular' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

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
}
