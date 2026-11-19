<?php

namespace Tests\Feature;

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
        $response = $this->actingAs($this->client)->post('/pricing/buy-plan', [
            'plan_name' => 'Custom Credit Plan',
            'base_credits' => 2500,
            'bonus_credits' => 375,
            'total_price' => 1250,
            'billing_type' => 'one_time',
            'notes' => 'Q4 footwear batch',
        ]);

        $response->assertRedirect(route('client.portal'));
        $response->assertSessionHas('success');

        $order = Order::where('user_id', $this->client->id)
            ->where('order_type', 'credit_plan')
            ->first();

        $this->assertNotNull($order);
        $this->assertStringStartsWith('CE-CRD-', $order->order_number);
        $this->assertSame(2875, $order->quantity);
        $this->assertSame('pending', $order->status);
        $this->assertSame('unpaid', $order->payment_status);
        $this->assertFalse((bool) ($order->specifications['credits_activated'] ?? true));

        $portal = $this->actingAs($this->client)->get('/portal');
        $portal->assertStatus(200);
        $portal->assertInertia(fn (Assert $page) => $page
            ->component('Client/Dashboard')
            ->where('creditSummary.available_credits', 0)
            ->where('creditSummary.pending_credits', 2875)
            ->where('creditSummary.total_purchased_credits', 0)
            ->has('creditHistory', 1)
            ->where('creditHistory.0.order_number', $order->order_number)
            ->where('creditHistory.0.entry_type', 'purchase')
            ->where('creditHistory.0.credits_delta', 2875)
            ->where('creditHistory.0.is_activated', false)
            ->where('creditHistory.0.status_label', 'Pending Approval')
        );
    }

    public function test_admin_marking_credit_plan_paid_activates_credits_once(): void
    {
        $this->actingAs($this->client)->post('/pricing/buy-plan', [
            'plan_name' => 'Studio Credit Pack',
            'base_credits' => 2000,
            'bonus_credits' => 300,
            'total_price' => 900,
            'billing_type' => 'one_time',
        ]);

        $order = Order::where('order_type', 'credit_plan')->firstOrFail();

        $this->actingAs($this->admin)->put("/admin/orders/{$order->id}", [
            'status' => 'completed',
            'payment_status' => 'paid',
            'admin_notes' => 'Invoice paid via wire.',
        ])->assertRedirect();

        $this->client->refresh();
        $order->refresh();

        $this->assertSame(2300, $this->client->credits_balance);
        $this->assertSame('Studio Credit Pack', $this->client->active_plan_name);
        $this->assertTrue((bool) ($order->specifications['credits_activated'] ?? false));

        // Updating the order a second time must not double-credit the user.
        $this->actingAs($this->admin)->put("/admin/orders/{$order->id}", [
            'status' => 'completed',
            'payment_status' => 'paid',
            'admin_notes' => 'Follow-up note.',
        ])->assertRedirect();

        $this->client->refresh();
        $this->assertSame(2300, $this->client->credits_balance);

        $portal = $this->actingAs($this->client)->get('/portal');
        $portal->assertStatus(200);
        $portal->assertInertia(fn (Assert $page) => $page
            ->component('Client/Dashboard')
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
            'plan_name' => $plan->name,
            'base_credits' => $plan->base_credits,
            'bonus_credits' => $plan->bonus_credits,
            'total_price' => $plan->price_amount,
            'billing_type' => 'one_time',
            'validity_days' => $plan->validity_days,
            'features' => $plan->features,
        ])->assertRedirect(route('client.portal'));

        $order = Order::where('user_id', $this->client->id)
            ->where('order_type', 'credit_plan')
            ->latest('id')
            ->firstOrFail();

        $this->assertSame(180, $order->specifications['validity_days']);
        $this->assertNull($order->specifications['expires_at']);

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
        $order->refresh();
        $this->assertSame(900.0, (float) $order->total_price);
        $this->assertSame(2300, $order->quantity);
        $this->assertSame(2000, $order->specifications['base_credits']);
        $this->assertSame(300, $order->specifications['bonus_credits']);
        $this->assertSame(2300, $order->specifications['total_credits']);
        $this->assertSame(900, $order->specifications['total_price']);
        $this->assertSame(180, $order->specifications['validity_days']);
        $this->assertSame(['2,000 + 300 bonus = 2,300 credits', 'Valid for 180 days from activation', '12–18h priority studio turnaround'], $order->specifications['features_snapshot']);

        // When Admin marks the existing order paid, client receives their exact 2,300 snapshot credits and 180-day expiry
        $this->actingAs($this->admin)->put("/admin/orders/{$order->id}", [
            'status' => 'completed',
            'payment_status' => 'paid',
        ])->assertRedirect();

        $this->client->refresh();
        $order->refresh();
        $this->assertSame(2300, $this->client->credits_balance);
        $this->assertNotNull($this->client->credits_expires_at);
        $this->assertNotNull($order->specifications['expires_at']);
        $this->assertNotNull($order->specifications['expires_at_formatted']);

        $expectedExpiryFormatted = $this->client->credits_expires_at->format('M j, Y');
        $this->assertSame($expectedExpiryFormatted, $order->specifications['expires_at_formatted']);

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
}
