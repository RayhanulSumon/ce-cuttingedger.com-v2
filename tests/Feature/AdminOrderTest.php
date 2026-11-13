<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use App\Services\Security\LinkAndFileSecurityGuard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminOrderTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $role = Role::firstOrCreate(['name' => 'super_admin']);
        $this->admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            ['name' => 'Admin User', 'password' => 'secret', 'role_id' => $role->id, 'status' => 'active']
        );
    }

    public function test_admin_can_view_orders_index(): void
    {
        Order::query()->delete();

        Order::factory()->create([
            'order_number' => 'CE-ORD-TEST01',
            'client_name' => 'John Doe',
            'client_email' => 'john@brand.com',
            'service_name' => 'Clipping Path / Background Removal',
            'quantity' => 50,
            'uploaded_count' => 10,
            'total_price' => 35.00,
            'status' => 'pending',
            'cloud_link' => 'https://drive.google.com/drive/folders/sample-folder',
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/orders');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Orders/Index')
            ->has('orders.data', 1)
            ->where('orders.data.0.order_number', 'CE-ORD-TEST01')
            ->where('orders.data.0.quantity', 50)
            ->where('orders.data.0.uploaded_count', 10)
            ->where('orders.data.0.cloud_link', 'https://drive.google.com/drive/folders/sample-folder')
            ->has('stats')
            ->where('stats.total', 1)
            ->where('stats.pending', 1)
        );
    }

    public function test_admin_can_update_order_status_and_notes(): void
    {
        $order = Order::factory()->create([
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'admin_notes' => null,
        ]);

        $response = $this->actingAs($this->admin)->put("/admin/orders/{$order->id}", [
            'status' => 'in_production',
            'payment_status' => 'paid',
            'admin_notes' => 'Assigned to Senior Retoucher Alex.',
        ]);

        $response->assertRedirect();
        $order->refresh();

        $this->assertSame('in_production', $order->status);
        $this->assertSame('paid', $order->payment_status);
        $this->assertSame('Assigned to Senior Retoucher Alex.', $order->admin_notes);
    }

    public function test_admin_can_download_zip_of_order_files(): void
    {
        Storage::fake('public');
        $file1 = UploadedFile::fake()->image('shoe1.jpg');
        $file2 = UploadedFile::fake()->image('shoe2.jpg');

        $path1 = $file1->store('chat_uploads', 'public');
        $path2 = $file2->store('chat_uploads', 'public');

        $order = Order::factory()->create([
            'order_number' => 'CE-ORD-ZIPTEST',
            'images' => [
                Storage::disk('public')->url($path1),
                Storage::disk('public')->url($path2),
            ],
            'quantity' => 2,
            'uploaded_count' => 2,
        ]);

        $response = $this->actingAs($this->admin)->get("/admin/orders/{$order->id}/download-zip");

        $response->assertStatus(200);
        $this->assertTrue(str_contains((string) $response->headers->get('content-disposition'), 'CE-ORD-ZIPTEST'));
    }

    public function test_security_guard_blocks_malicious_links_and_files(): void
    {
        $guard = app(LinkAndFileSecurityGuard::class);

        // A. Blocks non-https links
        $insecure = $guard->validateCloudLink('http://drive.google.com/test');
        $this->assertFalse($insecure['valid']);

        // B. Blocks arbitrary / untrusted / phishing domains
        $phishing = $guard->validateCloudLink('https://evil-phishing-site.com/stealer.exe');
        $this->assertFalse($phishing['valid']);

        // C. Blocks SSRF attempts to localhost and metadata IPs
        $ssrf1 = $guard->validateCloudLink('https://localhost/admin');
        $this->assertFalse($ssrf1['valid']);

        $ssrf2 = $guard->validateCloudLink('https://169.254.169.254/latest/meta-data');
        $this->assertFalse($ssrf2['valid']);

        // D. Accepts verified Google Drive, Dropbox, WeTransfer
        $gdrive = $guard->validateCloudLink('https://drive.google.com/drive/folders/123xyz');
        $this->assertTrue($gdrive['valid']);

        $wetransfer = $guard->validateCloudLink('https://we.tl/t-abc123xyz');
        $this->assertTrue($wetransfer['valid']);

        // E. Blocks dangerous double extensions (e.g. evil.php.jpg)
        $dangerousFile = UploadedFile::fake()->create('backdoor.php.jpg', 100);
        $fileCheck = $guard->inspectUploadedFile($dangerousFile);
        $this->assertFalse($fileCheck['valid']);
    }
}
