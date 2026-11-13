<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Catalog\CatalogCacheService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ClientPortalController extends Controller
{
    /**
     * Display the authenticated client's portal dashboard, order history, and quick studio launcher.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Ensure any orders matching the client's email are linked to their user_id
        Order::whereNull('user_id')
            ->where('client_email', strtolower($user->email))
            ->update(['user_id' => $user->id]);

        $orders = Order::where('user_id', $user->id)
            ->orWhere('client_email', strtolower($user->email))
            ->latest('id')
            ->get()
            ->map(fn (Order $order) => [
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
                'created_at_formatted' => $order->created_at->format('M j, Y \a\t g:i A'),
            ]);

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
            'digitalTwins' => CatalogCacheService::getHomeDigitalTwins(),
            'tryOnLooks' => CatalogCacheService::getHomeTryOnLooks(),
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
}

