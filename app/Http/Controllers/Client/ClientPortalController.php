<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\CreditPurchase;
use App\Models\Order;
use App\Models\User;
use App\Services\Media\ImageUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ClientPortalController extends Controller
{
    /**
     * Display the authenticated client's portal overview dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $orders = $this->getClientOrders($user);
        $creditData = $this->buildCreditSummaryAndHistory($user, $orders);

        $stats = [
            'total_orders' => $orders->count(),
            'in_progress' => $orders->whereIn('status', ['pending', 'in_production', 'review'])->count(),
            'completed' => $orders->where('status', 'completed')->count(),
            'digital_twin_orders' => $orders->filter(fn (array $o) => str_starts_with($o['order_type'], 'digital_twin'))->count(),
            'try_on_quotes' => $orders->where('order_type', 'virtual_try_on_quote')->count(),
        ];

        return Inertia::render('Client/Dashboard', [
            'orders' => $orders->values()->all(),
            'stats' => $stats,
            'creditSummary' => $creditData['creditSummary'],
            'creditHistory' => $creditData['creditHistory'],
        ]);
    }

    /**
     * Display the authenticated client's orders and quotes page.
     */
    public function orders(Request $request): Response
    {
        $orders = $this->getClientOrders($request->user());

        return Inertia::render('Client/Orders', [
            'orders' => $orders->values()->all(),
        ]);
    }

    /**
     * Display the authenticated client's credits and plan transaction history page.
     */
    public function credits(Request $request): Response
    {
        $user = $request->user();
        $orders = $this->getClientOrders($user);
        $creditData = $this->buildCreditSummaryAndHistory($user, $orders);

        return Inertia::render('Client/Credits', [
            'orders' => $orders->values()->all(),
            'creditSummary' => $creditData['creditSummary'],
            'creditHistory' => $creditData['creditHistory'],
        ]);
    }

    /**
     * Display the authenticated client's profile picture, personal details, and security settings page.
     */
    public function settings(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Client/Settings', [
            'availableCredits' => (int) ($user->credits_balance ?? 0),
            'activePlanName' => $user->active_plan_name,
        ]);
    }

    /**
     * Update the authenticated client's profile details.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $request->user()->update($validated);

        return back()->with('success', 'Your profile details have been updated.');
    }

    /**
     * Upload or replace the authenticated client's profile picture.
     */
    public function updateAvatar(Request $request, ImageUploadService $imageUploadService): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $user = $request->user();
        $avatarUrl = $imageUploadService->uploadAsWebp(
            $request->file('avatar'),
            ImageUploadService::PATH_AVATARS,
            512,
            86,
            $user->avatar,
            'avatar-'.$user->id,
        );

        $user->update(['avatar' => $avatarUrl]);

        return back()->with('success', 'Your profile picture has been updated.');
    }

    /**
     * Remove the authenticated client's profile picture.
     */
    public function destroyAvatar(Request $request, ImageUploadService $imageUploadService): RedirectResponse
    {
        $user = $request->user();
        $imageUploadService->delete($user->avatar);
        $user->update(['avatar' => null]);

        return back()->with('success', 'Your profile picture has been removed.');
    }

    /**
     * Update the authenticated client's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Your password has been updated.');
    }

    /**
     * Link unassociated email-matched orders and fetch formatted client order records.
     *
     * @return Collection<int, array<string, mixed>>
     */
    private function getClientOrders(User $user): Collection
    {
        Order::whereNull('user_id')
            ->where('client_email', strtolower($user->email))
            ->update(['user_id' => $user->id]);

        return Order::where('user_id', $user->id)
            ->orWhere('client_email', strtolower($user->email))
            ->latest('id')
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'order_type' => $order->order_type ?? 'custom_order',
                'service_name' => $order->service_name,
                'complexity' => $order->complexity,
                'quantity' => $order->quantity,
                'uploaded_count' => $order->uploaded_count,
                'total_price' => (float) $order->total_price,
                'currency' => $order->currency,
                'turnaround' => $order->turnaround,
                'images' => (array) ($order->images ?? []),
                'completed_files' => (array) ($order->completed_files ?? []),
                'specifications' => (array) ($order->specifications ?? []),
                'cloud_link' => $order->cloud_link,
                'instructions' => $order->instructions,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->toISOString(),
                'created_at_timestamp' => $order->created_at->timestamp,
                'created_at_formatted' => $order->created_at->format('M j, Y \a\t g:i A'),
            ]);
    }

    /**
     * Build the client's credit wallet summary and chronological ledger history.
     *
     * @param  Collection<int, array<string, mixed>>  $orders
     * @return array{creditSummary: array<string, mixed>, creditHistory: array<int, array<string, mixed>>}
     */
    private function buildCreditSummaryAndHistory(User $user, Collection $orders): array
    {
        $creditPurchases = CreditPurchase::where('user_id', $user->id)
            ->latest('id')
            ->get();

        $usageOrders = $orders->filter(
            fn (array $o): bool => $o['order_type'] === 'credit_usage'
        );

        $creditSummary = [
            'available_credits' => (int) ($user->credits_balance ?? 0),
            'active_plan_name' => $user->active_plan_name,
            'expires_at' => $user->credits_expires_at?->toISOString(),
            'expires_at_formatted' => $user->credits_expires_at?->format('M j, Y'),
            'days_remaining' => $user->credits_expires_at
                ? max(0, (int) now()->startOfDay()->diffInDays($user->credits_expires_at->copy()->startOfDay(), false))
                : null,
            'is_expired' => $user->credits_expires_at ? $user->credits_expires_at->isPast() : false,
            'total_purchased_credits' => (int) $creditPurchases
                ->where('credits_activated', true)
                ->sum('total_credits'),
            'pending_credits' => (int) $creditPurchases
                ->filter(fn (CreditPurchase $purchase): bool => ! $purchase->credits_activated && ! in_array($purchase->status, ['cancelled', 'refunded'], true))
                ->sum('total_credits'),
            'total_used_credits' => $usageOrders
                ->sum(fn (array $o): int => (int) ($o['specifications']['credits_spent'] ?? 0)),
        ];

        $purchaseEntries = $creditPurchases->map(function (CreditPurchase $purchase): array {
            $billingLabel = $purchase->billing_type === 'monthly' ? 'Monthly Plan' : 'One-Time Pack';

            $statusLabel = match (true) {
                $purchase->credits_activated => 'Credited',
                $purchase->status === 'cancelled' => 'Cancelled',
                $purchase->status === 'refunded' => 'Refunded',
                default => 'Pending Approval',
            };

            return [
                'id' => $purchase->id,
                'order_number' => $purchase->reference_number,
                'entry_type' => 'purchase',
                'title' => $purchase->plan_name,
                'subtitle' => sprintf(
                    '%s base + %s bonus credits · %s',
                    number_format($purchase->base_credits),
                    number_format($purchase->bonus_credits),
                    $billingLabel
                ),
                'credits_delta' => $purchase->total_credits,
                'balance_after' => null,
                'is_activated' => (bool) $purchase->credits_activated,
                'validity_days' => $purchase->validity_days,
                'expires_at_formatted' => $purchase->expires_at?->format('M j, Y'),
                'status_label' => $statusLabel,
                'amount_usd' => (float) $purchase->amount_usd,
                'created_at_formatted' => $purchase->created_at?->format('M j, Y \a\t g:i A') ?? '',
                '_sort_ts' => $purchase->created_at?->timestamp ?? 0,
            ];
        });

        $usageEntries = $usageOrders->map(function (array $o): array {
            $specs = $o['specifications'];
            $creditsSpent = (int) ($specs['credits_spent'] ?? 0);

            return [
                'id' => $o['id'],
                'order_number' => $o['order_number'],
                'entry_type' => 'usage',
                'title' => (string) ($specs['service_category'] ?? $o['service_name']),
                'subtitle' => sprintf('%s asset(s) · %s', number_format((int) $o['quantity']), $o['turnaround']),
                'credits_delta' => -1 * $creditsSpent,
                'balance_after' => isset($specs['remaining_credits']) ? (int) $specs['remaining_credits'] : null,
                'is_activated' => true,
                'validity_days' => null,
                'expires_at_formatted' => null,
                'status_label' => $o['status'] === 'completed' ? 'Completed' : 'Redeemed · In Production',
                'amount_usd' => (float) $o['total_price'],
                'created_at_formatted' => $o['created_at_formatted'],
                '_sort_ts' => (int) ($o['created_at_timestamp'] ?? 0),
            ];
        });

        $creditHistory = collect($purchaseEntries->all())
            ->merge($usageEntries->all())
            ->sortByDesc('_sort_ts')
            ->map(function (array $entry): array {
                unset($entry['_sort_ts']);

                return $entry;
            })
            ->values()
            ->all();

        return [
            'creditSummary' => $creditSummary,
            'creditHistory' => $creditHistory,
        ];
    }
}
