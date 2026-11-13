<?php

namespace Tests\Feature;

use App\Models\DigitalTwin;
use App\Models\Order;
use App\Models\Role;
use App\Models\TryOnLook;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DigitalTwinsAndTryOnTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $client;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $role = Role::firstOrCreate(['name' => 'super_admin']);
        $this->admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => 'secret',
                'role_id' => $role->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $this->client = User::firstOrCreate(
            ['email' => 'client@atelier.com'],
            [
                'name' => 'Clara Vance',
                'company' => 'Vance Atelier',
                'phone' => '+1 555 234 5678',
                'password' => 'secret123',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
    }

    public function test_homepage_and_catalog_receive_seeded_digital_twins_and_try_on_looks(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->has('digitalTwins', 6)
                ->has('tryOnLooks', 6)
            );

        $this->get('/digital-twins')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('DigitalTwins/Index')
                ->has('digitalTwins', 6)
            );
    }

    public function test_catalog_json_apis_return_etag_and_304_when_unchanged(): void
    {
        $twinsResponse = $this->getJson('/api/catalog/digital-twins');
        $twinsResponse->assertOk()
            ->assertJsonCount(6, 'data')
            ->assertJsonCount(7, 'attributes');

        $etag = $twinsResponse->headers->get('ETag');
        $this->assertNotEmpty($etag);

        $this->withHeaders(['If-None-Match' => $etag])
            ->getJson('/api/catalog/digital-twins')
            ->assertStatus(304);

        $looksResponse = $this->getJson('/api/catalog/try-on-looks');
        $looksResponse->assertOk()
            ->assertJsonCount(6, 'data');
    }

    public function test_guests_must_login_and_verify_email_before_ordering(): void
    {
        Notification::fake();

        $this->get('/digital-twins/order')->assertRedirect(route('login'));
        $this->get('/virtual-try-on/quote')->assertRedirect(route('login'));

        $this->post('/register', [
            'name' => 'Elena Rossi',
            'email' => 'elena@milanstudio.it',
            'company' => 'Milan Studio',
            'phone' => '+39 02 1234 5678',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])->assertRedirect(route('verification.notice'));

        $newUser = User::where('email', 'elena@milanstudio.it')->firstOrFail();
        $this->assertNull($newUser->email_verified_at);
        Notification::assertSentTo($newUser, VerifyEmail::class);

        $this->actingAs($newUser)->get('/digital-twins/order')->assertRedirect(route('verification.notice'));

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $newUser->id, 'hash' => sha1($newUser->getEmailForVerification())]
        );

        $this->actingAs($newUser)->get($verificationUrl)->assertRedirect(route('digital-twins.order'));
        $this->assertNotNull($newUser->fresh()->email_verified_at);

        $this->actingAs($newUser->fresh())->get('/digital-twins/order')->assertOk();
        $this->actingAs($newUser->fresh())->get('/portal')->assertOk();
    }

    public function test_client_can_submit_custom_digital_twin_order_with_7_dynamic_attributes(): void
    {
        Mail::fake();
        Storage::fake('public');

        $twin = DigitalTwin::firstOrFail();

        $response = $this->actingAs($this->client)->post('/digital-twins/order', [
            'mode' => 'custom',
            'digital_twin_id' => $twin->id,
            'name' => 'Clara Vance',
            'email' => 'clara@atelier.com',
            'company' => 'Vance Atelier',
            'phone' => '+1 555 234 5678',
            'attributes' => [
                'Height' => '5\'9" ft',
                'Body Structure' => 'Other: Runway Athletic',
                'Skin Tone' => 'Fair',
                'Body Measurement' => [
                    'Shoulder' => '16 in',
                    'Chest' => '34 in',
                    'Hip' => '36 in',
                ],
                'Forehead' => 'Diamond',
                'Eye Shapes' => 'Almond',
                'Lip' => 'Full',
            ],
            'selected_poses' => ['Front', 'Side', 'Close-Up'],
            'instructions' => 'Minimal editorial lighting',
            'attachments' => [
                UploadedFile::fake()->image('moodboard.jpg', 800, 1000),
            ],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $order = Order::latest('id')->firstOrFail();
        $this->assertSame($this->client->id, $order->user_id);
        $this->assertSame('digital_twin_custom', $order->order_type);
        $this->assertSame($twin->id, $order->digital_twin_id);
        $this->assertSame(0.0, (float) $order->total_price);
        $this->assertSame('5\'9" ft', $order->specifications['attributes']['Height']);
        $this->assertSame('16 in', $order->specifications['attributes']['Body Measurement']['Shoulder']);
        $this->assertCount(1, $order->images);

        $this->actingAs($this->client)
            ->get('/portal')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Client/Dashboard')
                ->has('orders', 1)
                ->where('stats.total_orders', 1)
            );
    }

    public function test_marking_lifetime_copyright_order_as_paid_automatically_marks_twin_sold_out(): void
    {
        Mail::fake();

        $twin = DigitalTwin::where('is_copyright_sold', false)->firstOrFail();

        $this->actingAs($this->client)->post('/digital-twins/order', [
            'mode' => 'lifetime',
            'digital_twin_id' => $twin->id,
            'name' => 'Marcus Sterling',
            'email' => 'marcus@luxurybrand.com',
        ])->assertRedirect();

        $order = Order::where('order_type', 'digital_twin_lifetime')->latest('id')->firstOrFail();
        $this->assertSame(490.0, (float) $order->total_price);

        $this->actingAs($this->admin)->put("/admin/orders/{$order->id}", [
            'status' => 'completed',
            'payment_status' => 'paid',
            'admin_notes' => 'Exclusive copyright transferred.',
        ])->assertRedirect();

        $this->assertTrue($twin->fresh()->is_copyright_sold);
    }

    public function test_client_can_submit_virtual_try_on_quote_using_our_model_and_3_garment_slots(): void
    {
        Mail::fake();
        Storage::fake('public');

        $look = TryOnLook::firstOrFail();

        $response = $this->actingAs($this->client)->post('/virtual-try-on/quote', [
            'model_source' => 'our_model',
            'try_on_look_id' => $look->id,
            'selected_look_name' => $look->name,
            'garment_top' => UploadedFile::fake()->image('top-blouse.png', 600, 800),
            'garment_bottom' => UploadedFile::fake()->image('bottom-trousers.png', 600, 800),
            'garment_shoes' => UploadedFile::fake()->image('shoes-heels.png', 600, 600),
            'instructions' => 'Tuck top into trousers and add gold belt.',
            'monthly_volume' => '50–200 looks / month',
            'name' => 'Sophie Laurent',
            'email' => 'sophie@parishouse.fr',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $order = Order::where('order_type', 'virtual_try_on_quote')->latest('id')->firstOrFail();
        $this->assertSame($this->client->id, $order->user_id);
        $this->assertSame($look->id, $order->try_on_look_id);
        $this->assertSame('our_model', $order->specifications['model_source']);
        $this->assertSame($look->model_name, $order->specifications['selected_model_name']);
        $this->assertArrayHasKey('top', $order->specifications['labeled_files']);
        $this->assertArrayHasKey('bottom', $order->specifications['labeled_files']);
        $this->assertArrayHasKey('shoes', $order->specifications['labeled_files']);
        $this->assertSame('Tuck top into trousers and add gold belt.', $order->instructions);
    }

    public function test_client_can_submit_virtual_try_on_quote_with_custom_uploaded_model(): void
    {
        Mail::fake();
        Storage::fake('public');

        $response = $this->actingAs($this->client)->post('/virtual-try-on/quote', [
            'model_source' => 'custom_model',
            'model_file' => UploadedFile::fake()->image('my-brand-model.jpg', 900, 1200),
            'garment_top' => UploadedFile::fake()->image('jacket.jpg', 600, 800),
            'instructions' => 'Keep natural daylight on our talent.',
            'name' => 'David Kim',
            'email' => 'david@seoulstudio.kr',
        ]);

        $response->assertRedirect();
        $order = Order::where('order_type', 'virtual_try_on_quote')->latest('id')->firstOrFail();
        $this->assertSame('custom_model', $order->specifications['model_source']);
        $this->assertArrayHasKey('client_model', $order->specifications['labeled_files']);
        $this->assertArrayHasKey('top', $order->specifications['labeled_files']);
    }

    public function test_admin_can_manage_digital_twins_attributes_and_try_on_looks(): void
    {
        Storage::fake('public');

        $this->actingAs($this->admin)
            ->get('/admin/digital-twins')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/DigitalTwins/Index')
                ->has('twins', 6)
                ->has('attributes', 7)
            );

        $this->actingAs($this->admin)
            ->post('/admin/digital-twins/attributes', [
                'name' => 'Hair Style',
                'input_type' => 'select',
                'options' => ['Straight', 'Wavy', 'Curly', 'Braided'],
                'allow_custom' => true,
                'custom_label' => 'Custom',
                'sort_order' => 8,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('digital_twin_attributes', [
            'name' => 'Hair Style',
            'slug' => 'hair_style',
        ]);

        $this->actingAs($this->admin)
            ->get('/admin/try-on-looks')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/TryOnLooks/Index')
                ->has('looks', 6)
            );
    }
}
