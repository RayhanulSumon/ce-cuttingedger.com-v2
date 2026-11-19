<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreditPurchase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCreditPurchaseController extends Controller
{
    /**
     * Display credit pack purchases and recurring subscriptions separated from production orders.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $billingType = $request->query('billing_type');
        $provider = $request->query('payment_provider');
        $search = $request->query('search');

        $query = CreditPurchase::with(['user', 'pricingPlan', 'approver'])->latest('id');

        if ($status && in_array($status, ['pending', 'active', 'expired', 'cancelled', 'refunded'], true)) {
            $query->where('status', $status);
        }

        if ($billingType && in_array($billingType, ['one_time', 'monthly'], true)) {
            $query->where('billing_type', $billingType);
        }

        if ($provider && in_array($provider, ['manual', 'stripe'], true)) {
            $query->where('payment_provider', $provider);
        }

        if ($search) {
            $query->where(function ($q) use ($search): void {
                $q->where('reference_number', 'like', "%{$search}%")
                    ->orWhere('plan_name', 'like', "%{$search}%")
                    ->orWhere('stripe_subscription_id', 'like', "%{$search}%")
                    ->orWhere('stripe_invoice_id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search): void {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('company', 'like', "%{$search}%");
                    });
            });
        }

        $purchases = $query->paginate(15)->withQueryString()->through(fn (CreditPurchase $purchase): array => [
            'id' => $purchase->id,
            'reference_number' => $purchase->reference_number,
            'user_id' => $purchase->user_id,
            'client_name' => $purchase->user?->name ?? 'Unknown Client',
            'client_email' => $purchase->user?->email ?? '',
            'client_company' => $purchase->user?->company,
            'client_phone' => $purchase->user?->phone,
            'client_credits_balance' => (int) ($purchase->user?->credits_balance ?? 0),
            'pricing_plan_id' => $purchase->pricing_plan_id,
            'plan_name' => $purchase->plan_name,
            'billing_type' => $purchase->billing_type,
            'base_credits' => $purchase->base_credits,
            'bonus_credits' => $purchase->bonus_credits,
            'total_credits' => $purchase->total_credits,
            'amount_usd' => (float) $purchase->amount_usd,
            'currency' => $purchase->currency,
            'effective_rate_per_credit' => (float) $purchase->effective_rate_per_credit,
            'validity_days' => $purchase->validity_days,
            'features_snapshot' => (array) ($purchase->features_snapshot ?? []),
            'payment_provider' => $purchase->payment_provider,
            'payment_status' => $purchase->payment_status,
            'status' => $purchase->status,
            'stripe_customer_id' => $purchase->stripe_customer_id,
            'stripe_checkout_session_id' => $purchase->stripe_checkout_session_id,
            'stripe_payment_intent_id' => $purchase->stripe_payment_intent_id,
            'stripe_subscription_id' => $purchase->stripe_subscription_id,
            'stripe_invoice_id' => $purchase->stripe_invoice_id,
            'credits_activated' => (bool) $purchase->credits_activated,
            'activated_at_formatted' => $purchase->activated_at?->format('M j, Y \a\t g:i A'),
            'expires_at_formatted' => $purchase->expires_at?->format('M j, Y'),
            'is_expired' => $purchase->expires_at ? $purchase->expires_at->isPast() : false,
            'approver_name' => $purchase->approver?->name,
            'client_notes' => $purchase->client_notes,
            'admin_notes' => $purchase->admin_notes,
            'created_at_formatted' => $purchase->created_at?->format('M j, Y \a\t g:i A') ?? '',
        ]);

        $stats = [
            'total' => CreditPurchase::count(),
            'pending' => CreditPurchase::where('status', 'pending')->count(),
            'active' => CreditPurchase::where('status', 'active')->count(),
            'one_time_count' => CreditPurchase::where('billing_type', 'one_time')->count(),
            'monthly_count' => CreditPurchase::where('billing_type', 'monthly')->count(),
            'manual_count' => CreditPurchase::where('payment_provider', 'manual')->count(),
            'stripe_count' => CreditPurchase::where('payment_provider', 'stripe')->count(),
            'total_credits_issued' => (int) CreditPurchase::where('credits_activated', true)->sum('total_credits'),
            'paid_revenue' => (float) CreditPurchase::where('payment_status', 'paid')->sum('amount_usd'),
        ];

        return Inertia::render('Admin/CreditPurchases/Index', [
            'purchases' => $purchases,
            'stats' => $stats,
            'currentStatus' => $status,
            'currentBillingType' => $billingType,
            'currentProvider' => $provider,
            'searchTerm' => $search,
        ]);
    }

    /**
     * One-click approve & atomically activate studio credits for a pending purchase.
     */
    public function approve(Request $request, CreditPurchase $creditPurchase): RedirectResponse
    {
        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        if (array_key_exists('admin_notes', $validated)) {
            $creditPurchase->update(['admin_notes' => $validated['admin_notes']]);
        }

        $activated = $creditPurchase->activateCredits($request->user());

        if (! $activated) {
            return redirect()->back()->with(
                'success',
                "Purchase #{$creditPurchase->reference_number} was already activated."
            );
        }

        $clientName = $creditPurchase->user?->name ?? 'Client';
        $expiryLabel = $creditPurchase->expires_at?->format('M j, Y') ?? 'N/A';

        return redirect()->back()->with(
            'success',
            "Approved #{$creditPurchase->reference_number}: ".number_format($creditPurchase->total_credits)." studio credits added to {$clientName} (valid until {$expiryLabel})."
        );
    }

    /**
     * Update purchase status, payment status, or internal notes (and activate if paid/active).
     */
    public function update(Request $request, CreditPurchase $creditPurchase): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,active,expired,cancelled,refunded'],
            'payment_status' => ['nullable', 'in:unpaid,invoice_sent,paid,failed,refunded'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($validated['status'] === 'active' || ($validated['payment_status'] ?? null) === 'paid') {
            if (array_key_exists('admin_notes', $validated)) {
                $creditPurchase->update(['admin_notes' => $validated['admin_notes']]);
            }

            $activated = $creditPurchase->activateCredits($request->user());

            if ($activated) {
                $clientName = $creditPurchase->user?->name ?? 'Client';
                $expiryLabel = $creditPurchase->expires_at?->format('M j, Y') ?? 'N/A';

                return redirect()->back()->with(
                    'success',
                    "Approved #{$creditPurchase->reference_number}: ".number_format($creditPurchase->total_credits)." studio credits added to {$clientName} (valid until {$expiryLabel})."
                );
            }

            $extra = array_filter([
                'status' => $validated['status'] !== 'active' ? $validated['status'] : null,
                'payment_status' => ($validated['payment_status'] ?? null) !== 'paid' ? ($validated['payment_status'] ?? null) : null,
            ], fn (mixed $v): bool => $v !== null);

            if ($extra !== []) {
                $creditPurchase->update($extra);
            }

            return redirect()->back()->with('success', "Purchase #{$creditPurchase->reference_number} updated.");
        }

        $creditPurchase->update($validated);

        return redirect()->back()->with('success', "Purchase #{$creditPurchase->reference_number} updated.");
    }

    /**
     * Remove a credit purchase record.
     */
    public function destroy(CreditPurchase $creditPurchase): RedirectResponse
    {
        $reference = $creditPurchase->reference_number;
        $creditPurchase->delete();

        return redirect()->back()->with('success', "Purchase #{$reference} deleted.");
    }
}
