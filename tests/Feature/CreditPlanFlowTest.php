<?php

namespace Tests\Feature;

use App\Models\CreditPurchase;
use App\Models\Order;
use App\Models\PricingPlan;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CreditPlanFlowTest extends TestCase
{
    use RefreshDatabase;

    protected User $client;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Mail::fake();

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $adminRole = Role::firstOrCreate(['name' => 'super_admin']);

        $this->client = User::factory()->create([
            'role_id' => $userRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'credits_balance' => 0,
            'active_plan_name' => null,
        ]);

        $this->admin = User::factory()->create([
            'role_id' => $adminRole->id,
            'password' => 'AdminPass123!',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
    }

    public function test_guests_cannot_buy_credit_plan_or_use_credits(): void
    {
        $this->post('/pricing/buy-plan', [
            'plan_name' => 'Starter Credit Pack',
            'base_credits' => 500,
            'bonus_credits' => 0,
            'total_price' => 250,
            'billing_type' => 'one_time',
        ])->assertRedirect('/login');

        $this->post('/portal/use-credits', [
            'service_category' => '2D Retouching & Cutouts',
            'asset_quantity' => 10,
            'credits_to_spend' => 10,
            'turnaround' => '24h Standard',
            'instructions' => 'White background cutouts.',
        ])->assertRedirect('/login');
    }

    public function test_authenticated_user_can_buy_credit_plan_and_see_pending_credit_history(): void
    {
        $plan = PricingPlan::where('slug', 'studio-credit-pack')->firstOrFail();

        $response = $this->actingAs($this->client)->post('/pricing/buy-plan', [
            'pricing_plan_id' => $plan->id,
            'plan_name' => 'Custom Credit Plan',
            'base_credits' => 2500,
            'bonus_credits' => 375,
            'total_price' => 1250,
            'billing_type' => 'one_time',
            'notes' => 'Q4 footwear batch',
        ]);

        $response->assertRedirect(route('client.portal'));
        $response->assertSessionHas('success');

        $this->assertSame(0, Order::where('user_id', $this->client->id)->count());

        $purchase = CreditPurchase::where('user_id', $this->client->id)->first();

        $this->assertNotNull($purchase);
        $this->assertStringStartsWith('CE-CRD-', $purchase->reference_number);
        $this->assertSame($plan->id, $purchase->pricing_plan_id);
        $this->assertSame(2875, $purchase->total_credits);
        $this->assertSame('manual', $purchase->payment_provider);
        $this->assertSame('pending', $purchase->status);
        $this->assertSame('unpaid', $purchase->payment_status);
        $this->assertFalse($purchase->credits_activated);

        $monthlyResponse = $this->actingAs($this->client)->post('/pricing/buy-plan', [
            'pricing_plan_id' => null,
            'plan_name' => 'Monthly Studio Retainer',
            'base_credits' => 1000,
            'bonus_credits' => 100,
            'total_price' => 500,
            'billing_type' => 'monthly',
            'validity_days' => 30,
        ]);

        $monthlyResponse->assertRedirect(route('client.portal'));

        $monthlyPurchase = CreditPurchase::where('user_id', $this->client->id)
            ->where('billing_type', 'monthly')
            ->firstOrFail();

        $this->assertStringStartsWith('CE-SUB-', $monthlyPurchase->reference_number);
        $this->assertSame(0, Order::where('user_id', $this->client->id)->count());

        $portal = $this->actingAs($this->client)->get('/portal');
        $portal->assertStatus(200);
        $portal->assertInertia(fn (Assert $page) => $page
            ->component('Client/Dashboard')
            ->where('stats.total_orders', 0)
            ->where('creditSummary.available_credits', 0)
            ->where('creditSummary.pending_credits', 3975)
            ->where('creditSummary.total_purchased_credits', 0)
            ->has('creditHistory', 2)
            ->where('creditHistory.0.order_number', $monthlyPurchase->reference_number)
            ->where('creditHistory.0.entry_type', 'purchase')
            ->where('creditHistory.0.credits_delta', 1100)
            ->where('creditHistory.0.is_activated', false)
            ->where('creditHistory.0.status_label', 'Pending Approval')
            ->where('creditHistory.1.order_number', $purchase->reference_number)
        );
    }

    public function test_admin_approving_credit_purchase_activates_credits_once(): void
    {
        $this->actingAs($this->client)->post('/pricing/buy-plan', [
            'plan_name' => 'Studio Credit Pack',
            'base_credits' => 2000,
            'bonus_credits' => 300,
            'total_price' => 900,
            'billing_type' => 'one_time',
        ])->assertRedirect(route('client.portal'));

        $purchase = CreditPurchase::where('user_id', $this->client->id)->firstOrFail();

        $this->actingAs($this->admin)->post("/admin/credit-purchases/{$purchase->id}/approve", [
            'admin_notes' => 'Invoice paid via wire.',
        ])->assertRedirect();

        $this->client->refresh();
        $purchase->refresh();

        $this->assertSame(2300, $this->client->credits_balance);
        $this->assertSame('Studio Credit Pack', $this->client->active_plan_name);
        $this->assertNotNull($this->client->credits_expires_at);
        $this->assertTrue($purchase->credits_activated);
        $this->assertSame('active', $purchase->status);
        $this->assertSame('paid', $purchase->payment_status);
        $this->assertSame($this->admin->id, $purchase->approved_by);
        $this->assertNotNull($purchase->activated_at);
        $this->assertNotNull($purchase->expires_at);

        // Calling approve or update a second time must not double-credit the user.
        $this->actingAs($this->admin)->post("/admin/credit-purchases/{$purchase->id}/approve")
            ->assertRedirect();

        $this->actingAs($this->admin)->put("/admin/credit-purchases/{$purchase->id}", [
            'status' => 'active',
            'payment_status' => 'paid',
            'admin_notes' => 'Follow-up note.',
        ])->assertRedirect();

        $this->client->refresh();
        $this->assertSame(2300, $this->client->credits_balance);

        $portal = $this->actingAs($this->client)->get('/portal');
        $portal->assertStatus(200);
        $portal->assertInertia(fn (Assert $page) => $page
            ->component('Client/Dashboard')
            ->where('stats.total_orders', 0)
            ->where('creditSummary.available_credits', 2300)
            ->where('creditSummary.active_plan_name', 'Studio Credit Pack')
            ->where('creditSummary.total_purchased_credits', 2300)
            ->where('creditSummary.pending_credits', 0)
            ->where('creditHistory.0.is_activated', true)
            ->where('creditHistory.0.status_label', 'Credited')
        );
    }

    public function test_user_can_spend_credits_and_cannot_overspend_balance(): void
    {
        $this->client->update([
            'credits_balance' => 500,
            'active_plan_name' => 'Starter Credit Pack',
        ]);

        $overspend = $this->actingAs($this->client)->post('/portal/use-credits', [
            'service_category' => '3D Product Model & CGI',
            'asset_quantity' => 15,
            'credits_to_spend' => 750,
            'turnaround' => '24h Standard',
            'instructions' => '15 sneaker 3D models.',
        ]);

        $overspend->assertSessionHasErrors(['credits_to_spend']);
        $this->client->refresh();
        $this->assertSame(500, $this->client->credits_balance);

        $spend = $this->actingAs($this->client)->post('/portal/use-credits', [
            'service_category' => 'Ghost Mannequin & Apparel',
            'asset_quantity' => 40,
            'credits_to_spend' => 80,
            'turnaround' => '12h Priority Rush',
            'cloud_link' => 'https://drive.google.com/drive/folders/sample-batch',
            'instructions' => 'Ghost mannequin neck jointing on 40 jackets.',
        ]);

        $spend->assertRedirect(route('client.portal'));
        $spend->assertSessionHas('success');

        $this->client->refresh();
        $this->assertSame(420, $this->client->credits_balance);

        $usageOrder = Order::where('user_id', $this->client->id)
            ->where('order_type', 'credit_usage')
            ->first();

        $this->assertNotNull($usageOrder);
        $this->assertStringStartsWith('CE-USE-', $usageOrder->order_number);
        $this->assertSame('in_production', $usageOrder->status);
        $this->assertSame('paid', $usageOrder->payment_status);
        $this->assertSame(40, $usageOrder->quantity);
        $this->assertSame(80, $usageOrder->specifications['credits_spent']);
        $this->assertSame(420, $usageOrder->specifications['remaining_credits']);

        $portal = $this->actingAs($this->client)->get('/portal');
        $portal->assertStatus(200);
        $portal->assertInertia(fn (Assert $page) => $page
            ->component('Client/Dashboard')
            ->where('creditSummary.available_credits', 420)
            ->where('creditSummary.total_used_credits', 80)
            ->has('creditHistory', 1)
            ->where('creditHistory.0.order_number', $usageOrder->order_number)
            ->where('creditHistory.0.entry_type', 'usage')
            ->where('creditHistory.0.credits_delta', -80)
            ->where('creditHistory.0.balance_after', 420)
            ->where('creditHistory.0.status_label', 'Redeemed · In Production')
        );
    }

    public function test_admin_cannot_access_client_portal_or_submit_client_orders(): void
    {
        $this->actingAs($this->admin)->get('/portal')->assertRedirect(route('login'));

        $this->actingAs($this->admin)->post('/digital-twins/order', [
            'mode' => 'custom',
            'name' => 'Admin User',
            'email' => $this->admin->email,
        ])->assertRedirect(route('login'));

        $this->actingAs($this->admin)->post('/virtual-try-on/quote', [
            'model_source' => 'our_model',
            'name' => 'Admin User',
            'email' => $this->admin->email,
            'cloud_link' => 'https://drive.google.com/drive/folders/sample',
        ])->assertRedirect(route('login'));

        $this->actingAs($this->admin)->post('/pricing/buy-plan', [
            'plan_name' => 'Starter Credit Pack',
            'base_credits' => 500,
            'bonus_credits' => 0,
            'total_price' => 250,
            'billing_type' => 'one_time',
        ])->assertRedirect(route('login'));

        $this->actingAs($this->admin)->post('/portal/use-credits', [
            'service_category' => '2D Retouching & Cutouts',
            'asset_quantity' => 10,
            'credits_to_spend' => 10,
            'turnaround' => '24h Standard',
            'instructions' => 'Cutouts.',
        ])->assertRedirect(route('login'));

        // Admin visiting /login or /register can still view client auth pages to switch accounts
        $this->actingAs($this->admin)->get('/login')->assertOk();
        $this->actingAs($this->admin)->get('/register')->assertOk();

        // Admin credentials cannot sign in on the Client Portal login endpoint
        $this->post('/login', [
            'email' => $this->admin->email,
            'password' => 'AdminPass123!',
        ])->assertSessionHasErrors(['email']);

        $this->assertGuest();
    }

    public function test_admin_updating_pricing_plan_does_not_alter_existing_client_purchase_snapshot(): void
    {
        $plan = PricingPlan::where('slug', 'studio-credit-pack')->firstOrFail();

        // Client buys Studio Credit Pack at original values ($900 for 2,000 + 300 bonus = 2,300 credits, 180-day validity)
        $this->actingAs($this->client)->post('/pricing/buy-plan', [
            'pricing_plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'base_credits' => $plan->base_credits,
            'bonus_credits' => $plan->bonus_credits,
            'total_price' => $plan->price_amount,
            'billing_type' => 'one_time',
            'validity_days' => $plan->validity_days,
            'features' => $plan->features,
        ])->assertRedirect(route('client.portal'));

        $purchase = CreditPurchase::where('user_id', $this->client->id)
            ->latest('id')
            ->firstOrFail();

        $this->assertSame(180, $purchase->validity_days);
        $this->assertNull($purchase->expires_at);

        // Admin updates Studio Credit Pack price, credits, and validity for future buyers
        $this->actingAs($this->admin)->put("/admin/pricing/{$plan->id}", [
            'name' => 'Studio Credit Pack',
            'badge' => 'Updated Popular',
            'headline' => 'Updated studio plan headline.',
            'base_credits' => 3000,
            'bonus_credits' => 500,
            'price_amount' => 1200,
            'validity_days' => 365,
            'cta_text' => 'Buy Updated Plan',
            'features' => ['3,000 + 500 bonus = 3,500 credits'],
            'is_popular' => true,
            'sort_order' => 2,
        ])->assertRedirect();

        $plan->refresh();
        $this->assertSame(3000, $plan->base_credits);
        $this->assertSame(500, $plan->bonus_credits);
        $this->assertSame(1200.0, $plan->price_amount);
        $this->assertSame(365, $plan->validity_days);

        // Public /pricing shows the updated plan values for future purchases
        $this->get('/pricing')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Pricing')
            ->where('plans.1.price_amount', 1200)
            ->where('plans.1.base_credits', 3000)
            ->where('plans.1.bonus_credits', 500)
            ->where('plans.1.validity_days', 365)
        );

        // Client's existing purchase retains its exact purchase-time snapshot
        $purchase->refresh();
        $this->assertSame(900.0, $purchase->amount_usd);
        $this->assertSame(2000, $purchase->base_credits);
        $this->assertSame(300, $purchase->bonus_credits);
        $this->assertSame(2300, $purchase->total_credits);
        $this->assertSame(180, $purchase->validity_days);
        $this->assertSame(
            ['2,000 + 300 bonus = 2,300 credits', 'Valid for 180 days from activation', '12–18h priority studio turnaround'],
            $purchase->features_snapshot
        );

        // When Admin approves the existing credit purchase, client receives their exact 2,300 snapshot credits and 180-day expiry
        $this->actingAs($this->admin)->post("/admin/credit-purchases/{$purchase->id}/approve")
            ->assertRedirect();

        $this->client->refresh();
        $purchase->refresh();
        $this->assertSame(2300, $this->client->credits_balance);
        $this->assertNotNull($this->client->credits_expires_at);
        $this->assertNotNull($purchase->expires_at);

        $expectedExpiryFormatted = $this->client->credits_expires_at->format('M j, Y');
        $this->assertSame($expectedExpiryFormatted, $purchase->expires_at->format('M j, Y'));

        $this->actingAs($this->client)->get('/portal')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('creditSummary.available_credits', 2300)
            ->where('creditSummary.total_purchased_credits', 2300)
            ->where('creditSummary.expires_at_formatted', $expectedExpiryFormatted)
            ->where('creditSummary.is_expired', false)
            ->where('creditHistory.0.credits_delta', 2300)
            ->where('creditHistory.0.amount_usd', 900)
            ->where('creditHistory.0.validity_days', 180)
            ->where('creditHistory.0.expires_at_formatted', $expectedExpiryFormatted)
        );
    }

    public function test_admin_can_manage_credit_purchases_separately_without_polluting_orders(): void
    {
        Order::query()->delete();
        CreditPurchase::query()->delete();

        Order::factory()->create([
            'order_number' => 'CE-ORD-REG01',
            'order_type' => 'custom_order',
            'client_name' => 'Regular Brand',
            'client_email' => 'regular@brand.com',
            'service_name' => 'Background Removal',
            'quantity' => 25,
            'uploaded_count' => 25,
            'total_price' => 25.00,
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAs($this->client)->post('/pricing/buy-plan', [
            'plan_name' => 'Studio Credit Pack',
            'base_credits' => 2000,
            'bonus_credits' => 300,
            'total_price' => 900,
            'billing_type' => 'one_time',
            'validity_days' => 180,
            'features' => ['2,000 + 300 bonus = 2,300 credits'],
        ])->assertRedirect(route('client.portal'));

        $this->actingAs($this->client)->post('/pricing/buy-plan', [
            'plan_name' => 'Custom Credit Plan',
            'base_credits' => 1000,
            'bonus_credits' => 100,
            'total_price' => 500,
            'billing_type' => 'monthly',
            'validity_days' => 30,
        ])->assertRedirect(route('client.portal'));

        // Orders table stays clean with only the production order
        $this->assertSame(1, Order::count());
        $this->actingAs($this->admin)
            ->get('/admin/orders')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Orders/Index')
                ->has('orders.data', 1)
                ->where('orders.data.0.order_number', 'CE-ORD-REG01')
                ->where('stats.total', 1)
            );

        $studioPurchase = CreditPurchase::where('plan_name', 'Studio Credit Pack')->firstOrFail();

        // /admin/credit-purchases filters cleanly by status and billing_type
        $this->actingAs($this->admin)
            ->get('/admin/credit-purchases?status=pending&billing_type=one_time')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/CreditPurchases/Index')
                ->has('purchases.data', 1)
                ->where('purchases.data.0.reference_number', $studioPurchase->reference_number)
                ->where('stats.total', 2)
                ->where('stats.pending', 2)
                ->where('stats.one_time_count', 1)
                ->where('stats.monthly_count', 1)
            );

        // /admin/pricing shows pending/total counts from credit_purchases
        $this->actingAs($this->admin)
            ->get('/admin/pricing')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Pricing/Index')
                ->where('pendingCreditOrdersCount', 2)
                ->where('totalCreditOrdersCount', 2)
            );

        // Admin approves Studio Credit Pack via /admin/credit-purchases/{id}/approve
        $approveResponse = $this->actingAs($this->admin)
            ->post("/admin/credit-purchases/{$studioPurchase->id}/approve");

        $this->client->refresh();
        $expectedExpiryFormatted = $this->client->credits_expires_at->format('M j, Y');

        $approveResponse->assertRedirect();
        $approveResponse->assertSessionHas('success', function (string $message) use ($studioPurchase, $expectedExpiryFormatted): bool {
            return str_contains($message, $studioPurchase->reference_number)
                && str_contains($message, '2,300 studio credits added')
                && str_contains($message, $expectedExpiryFormatted);
        });

        // /admin/client-accounts exposes updated credits balance and expiry
        $this->actingAs($this->admin)
            ->get('/admin/client-accounts')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/ClientAccounts/Index')
                ->where('clients', function ($clients) use ($expectedExpiryFormatted): bool {
                    $matched = collect($clients)->firstWhere('id', $this->client->id);

                    return $matched !== null
                        && ($matched['credits_balance'] ?? null) === 2300
                        && ($matched['active_plan_name'] ?? null) === 'Studio Credit Pack'
                        && ($matched['credits_expires_at_formatted'] ?? null) === $expectedExpiryFormatted
                        && ($matched['is_credits_expired'] ?? null) === false;
                })
            );

        // Client Portal still shows 0 orders in Orders list, while Credit Summary & History show both purchases
        $this->actingAs($this->client)
            ->get('/portal')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('stats.total_orders', 0)
                ->where('creditSummary.available_credits', 2300)
                ->where('creditSummary.total_purchased_credits', 2300)
                ->where('creditSummary.pending_credits', 1100)
                ->has('creditHistory', 2)
            );
    }
}
