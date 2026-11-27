<?php

namespace Tests\Feature;

use App\Models\AiJob;
use App\Models\CreditTransaction;
use App\Models\DigitalTwin;
use App\Models\Role;
use App\Models\TryOnLook;
use App\Models\User;
use App\Services\Billing\CreditLedgerService;
use App\Services\Catalog\CatalogCacheService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AiStudioAndBillingTest extends TestCase
{
    use RefreshDatabase;

    protected User $client;

    protected function setUp(): void
    {
        parent::setUp();

        $userRole = Role::firstOrCreate(['name' => 'user']);

        $this->client = User::factory()->create([
            'role_id' => $userRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'credits_balance' => 20,
        ]);

        config([
            'services.fal.key' => 'test-fal-key',
            'services.fal.queue_base_url' => 'https://queue.fal.run',
            'services.stripe.secret' => 'sk_test_123',
            'services.stripe.webhook_secret' => 'whsec_test_123',
        ]);
    }

    public function test_authenticated_client_can_view_individual_portal_capability_pages(): void
    {
        CatalogCacheService::flushAll();

        DigitalTwin::create([
            'name' => 'Aria Vance',
            'slug' => 'aria-vance',
            'archetype' => 'Female',
            'description' => 'Studio fashion model',
            'runway_image' => '/images/twins/aria.webp',
            'is_active' => true,
        ]);

        TryOnLook::create([
            'model_name' => 'Look 01',
            'slug' => 'look-01',
            'runway_image' => '/images/tryon/look-01.webp',
            'hi_res_image' => '/images/tryon/look-01-hires.webp',
            'pieces' => [],
            'pins' => [],
            'is_active' => true,
        ]);

        CatalogCacheService::flushAll();

        // Background Removal page
        $this->actingAs($this->client)
            ->get('/portal/capabilities/background-removal')
            ->assertOk()
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('Client/CapabilityShow')
                    ->where('capability.slug', 'background-removal')
                    ->has('creditPacks', 3)
            );

        // Digital Twins page loads shared frontend configurator data
        $this->actingAs($this->client)
            ->get('/portal/capabilities/digital-twins')
            ->assertOk()
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('Client/CapabilityShow')
                    ->where('capability.slug', 'digital-twins')
                    ->has('digitalTwins', 1)
                    ->has('creditPacks', 3)
            );

        // Virtual Try-On page loads shared try-on looks & digital twins
        $this->actingAs($this->client)
            ->get('/portal/capabilities/virtual-try-on')
            ->assertOk()
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('Client/CapabilityShow')
                    ->where('capability.slug', 'virtual-try-on')
                    ->has('tryOnLooks', 1)
                    ->has('digitalTwins', 1)
            );

        // Unlisted capabilities are not exposed in the client portal
        $this->actingAs($this->client)
            ->get('/portal/capabilities/3d-modeling')
            ->assertNotFound();

        // Guests are redirected to login
        $this->post('/logout');
        $this->get('/portal/capabilities/digital-twins')->assertRedirect(route('login'));
    }

    public function test_background_removal_deducts_upfront_with_markup_and_hides_from_client(): void
    {
        Http::fake([
            'https://queue.fal.run/*' => Http::response([
                'request_id' => 'fal-req-123',
                'status' => 'IN_QUEUE',
            ], 200),
        ]);

        $response = $this->actingAs($this->client)->postJson('/api/ai/bg-remove', [
            'image_url' => 'https://dev.cuttingedger.app/storage/test-garment.png',
        ]);

        $response->assertCreated()
            ->assertJsonPath('credit_balance', 18)
            ->assertJsonPath('job.service_type', 'bg_remove')
            ->assertJsonPath('job.status', 'processing')
            ->assertJsonPath('job.provider_request_id', 'fal-req-123')
            ->assertJsonMissingPath('job.credits_charged')
            ->assertJsonMissingPath('job.provider_cost_usd')
            ->assertJsonMissingPath('job.profit_usd');

        $this->assertDatabaseHas('ai_jobs', [
            'user_id' => $this->client->id,
            'base_credits' => 1,
            'credits_charged' => 2,
            'markup_percent' => 25.00,
        ]);

        $this->assertDatabaseHas('credit_transactions', [
            'user_id' => $this->client->id,
            'amount' => -2,
            'type' => 'usage',
        ]);
    }

    public function test_virtual_try_on_using_catalog_digital_twin_deducts_five_credits(): void
    {
        $twin = DigitalTwin::create([
            'name' => 'Kael Mercer',
            'slug' => 'kael-mercer',
            'archetype' => 'Menswear Studio',
            'description' => 'Studio menswear model',
            'hi_res_image' => '/images/twins/kael.webp',
            'is_active' => true,
        ]);

        Http::fake([
            'https://queue.fal.run/*' => Http::response([
                'request_id' => 'fal-tryon-456',
            ], 200),
        ]);

        $response = $this->actingAs($this->client)->postJson('/api/ai/try-on', [
            'digital_twin_id' => $twin->id,
            'pose_id' => 'pose-01',
            'garment_image_url' => 'https://dev.cuttingedger.app/storage/jacket.png',
            'category' => 'tops',
        ]);

        $response->assertCreated()
            ->assertJsonPath('credit_balance', 15)
            ->assertJsonPath('job.service_type', 'try_on')
            ->assertJsonPath('job.input_payload.digital_twin_id', $twin->id);
    }

    public function test_insufficient_credits_blocks_job_creation(): void
    {
        $this->client->update(['credits_balance' => 2]);

        $response = $this->actingAs($this->client)->postJson('/api/ai/try-on', [
            'person_image_url' => 'https://dev.cuttingedger.app/storage/model.png',
            'garment_image_url' => 'https://dev.cuttingedger.app/storage/dress.png',
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseCount('ai_jobs', 0);
        $this->assertSame(2, $this->client->fresh()->credits_balance);
    }

    public function test_fail_and_refund_job_is_idempotent(): void
    {
        $ledger = app(CreditLedgerService::class);
        $job = $ledger->chargeAndCreateJob($this->client, AiJob::PROVIDER_FAL, AiJob::SERVICE_TRY_ON, []);

        $this->assertSame(15, $this->client->fresh()->credits_balance);

        $ledger->failAndRefundJob($job->id, 'Upstream timeout');
        $ledger->failAndRefundJob($job->id, 'Duplicate webhook failure');

        $this->assertSame(20, $this->client->fresh()->credits_balance);
        $this->assertSame(AiJob::STATUS_FAILED, $job->fresh()->status);
        $this->assertSame(
            1,
            CreditTransaction::where('type', CreditTransaction::TYPE_REFUND)
                ->where('reference_id', "ai_job:{$job->id}")
                ->count()
        );
    }

    public function test_fal_webhook_verifies_ed25519_signature_and_archives_output_permanently(): void
    {
        Storage::fake('public');

        $ledger = app(CreditLedgerService::class);
        $job = $ledger->chargeAndCreateJob($this->client, AiJob::PROVIDER_FAL, AiJob::SERVICE_BG_REMOVE, []);

        $keyPair = sodium_crypto_sign_keypair();
        $secretKey = sodium_crypto_sign_secretkey($keyPair);
        $publicKey = sodium_crypto_sign_publickey($keyPair);
        $jwkX = rtrim(strtr(base64_encode($publicKey), '+/', '-_'), '=');

        Cache::put('fal.webhook.jwks', [
            ['kty' => 'OKP', 'crv' => 'Ed25519', 'x' => $jwkX],
        ], 3600);

        Http::fake([
            'https://fal.media/*' => Http::response('fake-png-binary', 200, ['Content-Type' => 'image/png']),
        ]);

        $body = json_encode([
            'request_id' => 'fal-req-999',
            'status' => 'OK',
            'payload' => [
                'image' => ['url' => 'https://fal.media/files/temp-output.png'],
            ],
        ], JSON_THROW_ON_ERROR);

        $requestId = 'fal-req-999';
        $userId = 'fal-user-1';
        $timestamp = (string) time();
        $message = "{$requestId}\n{$userId}\n{$timestamp}\n".hash('sha256', $body);
        $signatureHex = bin2hex(sodium_crypto_sign_detached($message, $secretKey));

        $response = $this->call(
            'POST',
            "/api/webhooks/fal?job_id={$job->id}",
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_X-Fal-Webhook-Request-Id' => $requestId,
                'HTTP_X-Fal-Webhook-User-Id' => $userId,
                'HTTP_X-Fal-Webhook-Timestamp' => $timestamp,
                'HTTP_X-Fal-Webhook-Signature' => $signatureHex,
            ],
            $body
        );

        $response->assertOk()->assertJsonPath('status', 'ok');

        $job->refresh();
        $this->assertSame(AiJob::STATUS_COMPLETED, $job->status);
        $this->assertNotEmpty($job->output_urls);
        $this->assertStringContainsString('/storage/ai-outputs/bg_remove/', $job->output_urls[0]);
        $this->assertSame(18, $this->client->fresh()->credits_balance);
    }

    public function test_stripe_webhook_grants_credits_idempotently(): void
    {
        $payload = json_encode([
            'id' => 'evt_123',
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_abc123',
                    'client_reference_id' => (string) $this->client->id,
                    'metadata' => [
                        'user_id' => (string) $this->client->id,
                        'pack_name' => 'Studio Pack',
                        'credits' => '200',
                    ],
                ],
            ],
        ], JSON_THROW_ON_ERROR);

        $timestamp = time();
        $sig = hash_hmac('sha256', "{$timestamp}.{$payload}", 'whsec_test_123');
        $header = "t={$timestamp},v1={$sig}";

        $this->call('POST', '/api/webhooks/stripe', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_Stripe-Signature' => $header,
        ], $payload)->assertOk();

        // Duplicate delivery must not double-grant
        $this->call('POST', '/api/webhooks/stripe', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_Stripe-Signature' => $header,
        ], $payload)->assertOk();

        $this->assertSame(220, $this->client->fresh()->credits_balance);
        $this->assertSame(
            1,
            CreditTransaction::where('type', CreditTransaction::TYPE_PURCHASE)
                ->where('reference_id', 'cs_test_abc123')
                ->count()
        );
    }

    public function test_admin_can_view_ai_usage_with_provider_cost_and_25_percent_profit_totals(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'super_admin']);
        $admin = User::factory()->create([
            'role_id' => $adminRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $ledger = app(CreditLedgerService::class);
        $ledger->chargeAndCreateJob($this->client, AiJob::PROVIDER_FAL, AiJob::SERVICE_TRY_ON, []);

        $this->actingAs($admin)
            ->get('/admin/ai-usage')
            ->assertOk()
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('Admin/AiUsage/Index')
                    ->where('summary.total_base_credits', 4)
                    ->where('summary.total_credits_charged', 5)
                    ->where('summary.total_provider_cost_usd', 0.075)
                    ->where('summary.total_billed_usd', 0.0938)
                    ->where('summary.total_profit_usd', 0.0188)
            );
    }

    public function test_admin_can_update_dynamic_ai_provider_and_pricing_settings(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'super_admin']);
        $admin = User::factory()->create([
            'role_id' => $adminRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin)
            ->post('/admin/ai-usage/settings', [
                'provider' => 'fal',
                'markup_percent' => 30,
                'services' => [
                    'bg_remove' => [
                        'model' => 'fal-ai/bria/background/remove',
                        'base_credits' => 2,
                        'provider_cost_usd' => 0.0200,
                    ],
                    'try_on' => [
                        'model' => 'fal-ai/fashn/tryon/v1.6',
                        'base_credits' => 10,
                        'provider_cost_usd' => 0.1000,
                    ],
                ],
            ])
            ->assertRedirect();

        $breakdown = AiJob::costBreakdownForService(AiJob::SERVICE_TRY_ON);
        $this->assertSame(13, $breakdown['credits_charged']); // 10 + 30% = 13
        $this->assertSame(0.1, $breakdown['provider_cost_usd']);
        $this->assertSame(0.13, $breakdown['billed_amount_usd']);
        $this->assertSame(0.03, $breakdown['profit_usd']);
    }
}
