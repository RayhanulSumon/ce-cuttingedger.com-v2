<?php

namespace Tests\Feature;

use App\Models\DigitalTwin;
use App\Models\Order;
use App\Models\Role;
use App\Models\TryOnLook;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
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

        $this->get('/capabilities/2d/digital-twins')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Capabilities/Show')
                ->has('digitalTwins', 24)
                ->where('digitalTwins.0.name', 'Laura')
                ->where('digitalTwins.0.archetype', 'Female')
                ->where('digitalTwins.11.name', 'John')
                ->where('digitalTwins.11.archetype', 'Male')
                ->where('digitalTwins.23.name', 'Upcoming Model')
                ->where('digitalTwins.23.archetype', 'Upcoming')
            );

        $this->get('/digital-twins')
            ->assertRedirect('/capabilities/2d/digital-twins')
            ->assertStatus(301);
    }

    public function test_catalog_json_apis_return_etag_and_304_when_unchanged(): void
    {
        $twinsResponse = $this->getJson('/api/catalog/digital-twins');
        $twinsResponse->assertOk()
            ->assertJsonCount(24, 'data')
            ->assertJsonCount(7, 'attributes');

        foreach ($twinsResponse->json('data') as $twinItem) {
            $this->assertStringStartsWith('/images/digital-twins/', (string) ($twinItem['runwayImage'] ?? ''));
            $this->assertStringStartsWith('/images/digital-twins/', (string) ($twinItem['hiResImage'] ?? ''));
            $this->assertStringNotContainsString('http', (string) ($twinItem['runwayImage'] ?? ''));
        }

        $etag = $twinsResponse->headers->get('ETag');
        $this->assertNotEmpty($etag);

        $this->withHeaders(['If-None-Match' => $etag])
            ->getJson('/api/catalog/digital-twins')
            ->assertStatus(304);

        $looksResponse = $this->getJson('/api/catalog/try-on-looks');
        $looksResponse->assertOk()
            ->assertJsonCount(6, 'data');

        foreach ($looksResponse->json('data') as $lookItem) {
            $this->assertStringStartsWith('/images/try-on/', (string) ($lookItem['model'] ?? ''));
            $this->assertStringStartsWith('/images/try-on/', (string) ($lookItem['modelHiRes'] ?? ''));
            $this->assertStringNotContainsString('http', (string) ($lookItem['model'] ?? ''));

            foreach ($lookItem['pieces'] ?? [] as $pieceItem) {
                $this->assertStringStartsWith('/images/try-on/', (string) ($pieceItem['image'] ?? ''));
                $this->assertStringNotContainsString('http', (string) ($pieceItem['image'] ?? ''));
            }
        }
    }

    public function test_guests_can_view_order_pages_but_must_login_and_verify_email_before_submitting(): void
    {
        Notification::fake();

        $this->get('/digital-twins/order')->assertOk();
        $this->get('/virtual-try-on/order')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('TryOn/Order'));

        $this->post('/digital-twins/order', [])->assertRedirect(route('login'));
        $this->post('/virtual-try-on/order', [])->assertRedirect(route('login'));

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

        $this->actingAs($newUser)->get('/digital-twins/order')->assertOk();
        $this->actingAs($newUser)->post('/digital-twins/order', [])->assertRedirect(route('verification.notice'));

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

    public function test_custom_digital_twin_order_requires_pose_reference_files_and_maps_pose_labels(): void
    {
        Mail::fake();
        Storage::fake('public');

        $twin = DigitalTwin::firstOrFail();

        // Missing reference files is rejected for custom mode
        $this->actingAs($this->client)
            ->post('/digital-twins/order', [
                'mode' => 'custom',
                'digital_twin_id' => $twin->id,
                'name' => 'Clara Vance',
                'email' => 'clara@atelier.com',
                'selected_poses' => ['Front', '3/4 Angle'],
            ])
            ->assertSessionHasErrors(['pose_references']);

        // Submitting labeled pose_references stores per-pose image URLs in specifications
        $this->actingAs($this->client)
            ->post('/digital-twins/order', [
                'mode' => 'custom',
                'digital_twin_id' => $twin->id,
                'name' => 'Clara Vance',
                'email' => 'clara@atelier.com',
                'selected_poses' => ['Front', '3/4 Angle'],
                'pose_references' => [
                    'Front' => UploadedFile::fake()->image('front-pose.jpg', 800, 1000),
                    '3/4 Angle' => UploadedFile::fake()->image('three-quarter.jpg', 800, 1000),
                ],
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $order = Order::latest('id')->firstOrFail();
        $this->assertCount(2, $order->images);
        $this->assertArrayHasKey('Front', $order->specifications['pose_reference_images']);
        $this->assertArrayHasKey('3/4 Angle', $order->specifications['pose_reference_images']);
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

    public function test_client_can_submit_virtual_try_on_order_using_our_model_and_3_garment_slots(): void
    {
        Mail::fake();
        Storage::fake('public');

        $look = TryOnLook::firstOrFail();

        $response = $this->actingAs($this->client)->post('/virtual-try-on/order', [
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

        $order = Order::where('order_type', 'virtual_try_on_order')->latest('id')->firstOrFail();
        $this->assertStringStartsWith('CE-VTO-', $order->order_number);
        $this->assertSame($this->client->id, $order->user_id);
        $this->assertSame($look->id, $order->try_on_look_id);
        $this->assertSame('our_model', $order->specifications['model_source']);
        $this->assertSame($look->model_name, $order->specifications['selected_model_name']);
        $this->assertArrayHasKey('top', $order->specifications['labeled_files']);
        $this->assertArrayHasKey('bottom', $order->specifications['labeled_files']);
        $this->assertArrayHasKey('shoes', $order->specifications['labeled_files']);
        $this->assertSame('Tuck top into trousers and add gold belt.', $order->instructions);
    }

    public function test_client_can_submit_virtual_try_on_order_with_custom_uploaded_model(): void
    {
        Mail::fake();
        Storage::fake('public');

        $response = $this->actingAs($this->client)->post('/virtual-try-on/order', [
            'model_source' => 'custom_model',
            'model_file' => UploadedFile::fake()->image('my-brand-model.jpg', 900, 1200),
            'garment_top' => UploadedFile::fake()->image('jacket.jpg', 600, 800),
            'instructions' => 'Keep natural daylight on our talent.',
            'name' => 'David Kim',
            'email' => 'david@seoulstudio.kr',
        ]);

        $response->assertRedirect();
        $order = Order::where('order_type', 'virtual_try_on_order')->latest('id')->firstOrFail();
        $this->assertStringStartsWith('CE-VTO-', $order->order_number);
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
                ->has('twins', 24)
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

        $this->actingAs($this->admin)
            ->get('/admin/client-accounts')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/ClientAccounts/Index')
                ->has('clients')
            );

        $this->actingAs($this->admin)
            ->get('/admin/users')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('users')
            );
    }

    public function test_client_and_admin_can_request_and_reset_password_via_email(): void
    {
        Notification::fake();

        $this->get('/forgot-password')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Auth/ForgotPassword'));

        // Client requests reset link
        $this->post('/forgot-password', [
            'email' => $this->client->email,
        ])->assertRedirect();

        Notification::assertSentTo($this->client, ResetPasswordNotification::class);

        // Client resets password using token
        $clientToken = Password::createToken($this->client);
        $this->get("/reset-password/{$clientToken}?email={$this->client->email}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Auth/ResetPassword'));

        $this->post('/reset-password', [
            'token' => $clientToken,
            'email' => $this->client->email,
            'password' => 'NewClientPass123!',
            'password_confirmation' => 'NewClientPass123!',
        ])->assertRedirect(route('login'));

        $this->assertTrue(Hash::check('NewClientPass123!', $this->client->fresh()->password));

        // Admin resets password using token and redirects to admin.login
        $adminToken = Password::createToken($this->admin);
        $this->post('/reset-password', [
            'token' => $adminToken,
            'email' => $this->admin->email,
            'password' => 'NewAdminPass123!',
            'password_confirmation' => 'NewAdminPass123!',
        ])->assertRedirect(route('admin.login'));

        $this->assertTrue(Hash::check('NewAdminPass123!', $this->admin->fresh()->password));
    }

    public function test_admin_try_on_look_validates_transparent_format_and_required_dimensions(): void
    {
        Storage::fake('public');

        $basePayload = [
            'model_name' => 'Studio Model A',
            'pieces' => [
                ['name' => 'Blazer', 'brand' => 'Atelier'],
            ],
            'pins' => [
                ['left' => 50, 'top' => 30],
            ],
            'is_featured_on_home' => true,
            'is_active' => true,
            'sort_order' => 10,
        ];

        // Reject solid JPG model upload
        $this->actingAs($this->admin)
            ->post('/admin/try-on-looks', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('model.jpg', 1080, 1920),
            ]))
            ->assertSessionHasErrors('model_image');

        // Reject wrong orientation landscape PNG model (1200x900)
        $landscapeResponse = $this->actingAs($this->admin)
            ->post('/admin/try-on-looks', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('model-landscape.png', 1200, 900),
            ]));
        $landscapeResponse->assertSessionHasErrors('model_image');
        $landscapeError = session('errors')->first('model_image');
        $this->assertStringContainsStringIgnoringCase('landscape', $landscapeError);

        // Reject wrong aspect ratio portrait PNG model (4:5 instead of 9:16)
        $this->actingAs($this->admin)
            ->post('/admin/try-on-looks', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('model-4x5.png', 800, 1000),
            ]))
            ->assertSessionHasErrors('model_image');

        // Reject undersized 9:16 PNG model (< 540x960)
        $this->actingAs($this->admin)
            ->post('/admin/try-on-looks', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('model-small.png', 360, 640),
            ]))
            ->assertSessionHasErrors('model_image');

        // Reject landscape banner garment piece (1200x400)
        $this->actingAs($this->admin)
            ->post('/admin/try-on-looks', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('model-valid.png', 1080, 1920),
                'piece_images' => [
                    0 => UploadedFile::fake()->image('wide-piece.png', 1200, 400),
                ],
            ]))
            ->assertSessionHasErrors('piece_images.0');

        // Accept valid 9:16 PNG model and 1:1 PNG piece without description or tag
        $this->actingAs($this->admin)
            ->post('/admin/try-on-looks', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('model-valid.png', 1080, 1920),
                'piece_images' => [
                    0 => UploadedFile::fake()->image('blazer.png', 800, 800),
                ],
            ]))
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $createdLook = TryOnLook::where('model_name', 'Studio Model A')->firstOrFail();

        $runwayRel = substr($createdLook->runway_image, strlen('/storage/'));
        $hiResRel = substr($createdLook->hi_res_image, strlen('/storage/'));
        $pieceRel = substr($createdLook->pieces[0]['image'], strlen('/storage/'));

        $this->assertStringEndsWith('.webp', $createdLook->runway_image);
        $this->assertStringEndsWith('.webp', $createdLook->hi_res_image);
        $this->assertStringEndsWith('.webp', $createdLook->pieces[0]['image']);

        Storage::disk('public')->assertExists($runwayRel);
        Storage::disk('public')->assertExists($hiResRel);
        Storage::disk('public')->assertExists($pieceRel);

        $runwaySize = getimagesizefromstring(Storage::disk('public')->get($runwayRel));
        $hiResSize = getimagesizefromstring(Storage::disk('public')->get($hiResRel));
        $pieceSize = getimagesizefromstring(Storage::disk('public')->get($pieceRel));

        $this->assertLessThanOrEqual(640, $runwaySize[0]);
        $this->assertLessThanOrEqual(1138, $runwaySize[1]);
        $this->assertLessThanOrEqual(1080, $hiResSize[0]);
        $this->assertLessThanOrEqual(1920, $hiResSize[1]);
        $this->assertLessThanOrEqual(600, $pieceSize[0]);
        $this->assertLessThanOrEqual(800, $pieceSize[1]);
    }

    public function test_admin_digital_twin_validates_transparent_format_and_required_dimensions(): void
    {
        Storage::fake('public');

        $basePayload = [
            'name' => 'Studio Twin Alpha',
            'look_number' => 99,
            'archetype' => 'Female',
            'description' => 'Full body transparent runway model.',
            'preset_price' => '$149',
            'custom_order_price' => '$290',
            'lifetime_price' => '$490',
            'is_featured_on_home' => false,
            'is_active' => true,
            'sort_order' => 99,
        ];

        // Reject JPG model upload
        $this->actingAs($this->admin)
            ->post('/admin/digital-twins', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('twin.jpg', 1080, 1920),
            ]))
            ->assertSessionHasErrors('model_image');

        // Reject landscape PNG model upload
        $this->actingAs($this->admin)
            ->post('/admin/digital-twins', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('twin-landscape.png', 1200, 800),
            ]))
            ->assertSessionHasErrors('model_image');

        // Reject landscape pose image upload
        $this->actingAs($this->admin)
            ->post('/admin/digital-twins', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('twin-valid.png', 1080, 1920),
                'pose_images' => [
                    0 => UploadedFile::fake()->image('pose-landscape.png', 1200, 800),
                ],
            ]))
            ->assertSessionHasErrors('pose_images.0');

        // Accept valid 9:16 PNG model and 3:4 PNG pose
        $this->actingAs($this->admin)
            ->post('/admin/digital-twins', array_merge($basePayload, [
                'model_image' => UploadedFile::fake()->image('twin-valid.png', 1080, 1920),
                'pose_images' => [
                    0 => UploadedFile::fake()->image('pose-front.png', 900, 1200),
                ],
            ]))
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('digital_twins', [
            'name' => 'Studio Twin Alpha',
            'look_number' => 99,
        ]);
    }

    public function test_digital_twin_private_source_zip_upload_and_paid_client_download(): void
    {
        Storage::fake('public');
        Storage::fake('local');
        Mail::fake();

        $tmpZip = tempnam(sys_get_temp_dir(), 'twinzip');
        $zip = new \ZipArchive;
        $zip->open($tmpZip, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        $zip->addFromString('README.txt', 'Raw 8K layered studio files for Laura');
        $zip->close();
        $zipContent = (string) file_get_contents($tmpZip);
        @unlink($tmpZip);

        $this->actingAs($this->admin)
            ->post('/admin/digital-twins', [
                'name' => 'Laura Raw',
                'look_number' => 101,
                'archetype' => 'Female',
                'description' => 'Photoreal studio twin with private raw ZIP pack.',
                'preset_price' => '$149',
                'custom_order_price' => '$290',
                'lifetime_price' => '$490',
                'is_featured_on_home' => false,
                'is_active' => true,
                'sort_order' => 101,
                'model_image' => UploadedFile::fake()->image('laura.png', 1080, 1920),
                'source_zip' => UploadedFile::fake()->createWithContent('laura-raw-pack.zip', $zipContent),
            ])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $twin = DigitalTwin::where('name', 'Laura Raw')->firstOrFail();

        $this->assertNotNull($twin->source_zip_path);
        $this->assertSame('laura-raw-pack.zip', $twin->source_zip_name);
        $this->assertGreaterThan(0, $twin->source_zip_size);

        // Public preview is stored on `public` disk as WebP; raw ZIP stays on `local` private disk
        $this->assertStringEndsWith('.webp', $twin->runway_image);
        Storage::disk('public')->assertExists(substr($twin->runway_image, strlen('/storage/')));
        Storage::disk('local')->assertExists($twin->source_zip_path);
        Storage::disk('public')->assertMissing($twin->source_zip_path);

        // Public catalog JSON never leaks private source_zip_path
        $catalog = $this->getJson('/api/catalog/digital-twins')->assertOk();
        $catalogItem = collect($catalog->json('data'))->firstWhere('id', $twin->id);
        $this->assertNotNull($catalogItem);
        $this->assertArrayNotHasKey('source_zip_path', $catalogItem);
        $this->assertArrayNotHasKey('sourceZipPath', $catalogItem);

        // Admin can download the private raw ZIP
        $this->actingAs($this->admin)
            ->get("/admin/digital-twins/{$twin->id}/download-package")
            ->assertOk();

        // Client submits a preset purchase order (initially unpaid/pending)
        $this->actingAs($this->client)
            ->post('/digital-twins/order', [
                'mode' => 'preset',
                'digital_twin_id' => $twin->id,
                'name' => $this->client->name,
                'email' => $this->client->email,
            ])
            ->assertRedirect();

        $order = Order::where('digital_twin_id', $twin->id)->latest('id')->firstOrFail();

        // Unpaid order cannot download the raw ZIP
        $this->actingAs($this->client)
            ->get("/portal/orders/{$order->id}/download-twin-package")
            ->assertStatus(403);

        // Another client cannot download the raw ZIP
        $otherClient = User::factory()->create([
            'email_verified_at' => now(),
            'status' => 'active',
        ]);
        $this->actingAs($otherClient)
            ->get("/portal/orders/{$order->id}/download-twin-package")
            ->assertStatus(403);

        // Admin marks order as paid/completed
        $this->actingAs($this->admin)
            ->put("/admin/orders/{$order->id}", [
                'status' => 'completed',
                'payment_status' => 'paid',
            ])
            ->assertRedirect();

        // Paid client sees download URL in Portal Orders and can download the full ZIP
        $this->actingAs($this->client)
            ->get('/portal/orders')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Client/Orders')
                ->where('orders.0.id', $order->id)
                ->where('orders.0.digital_twin_download_name', 'laura-raw-pack.zip')
                ->where('orders.0.digital_twin_download_url', fn (?string $url) => ! empty($url))
            );

        $downloadResponse = $this->actingAs($this->client)
            ->get("/portal/orders/{$order->id}/download-twin-package")
            ->assertOk();

        $this->assertStringContainsString(
            'laura-raw-pack.zip',
            (string) $downloadResponse->headers->get('content-disposition'),
        );
    }
}
