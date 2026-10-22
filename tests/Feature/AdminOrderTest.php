<?php

namespace Tests\Feature;

use App\Models\ChatSession;
use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use App\Services\Chat\ChatSessionManager;
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

    public function test_chat_creates_order_and_validates_quantity_discrepancy(): void
    {
        $session = ChatSession::create([
            'ip_address' => '127.0.0.1',
            'status' => 'active',
            'lead_email' => 'client@shopifybrand.com',
            'lead_name' => 'Sarah Connor',
        ]);

        // 1. Client confirms batch order of 50 images in chat
        $response = $this->withHeaders(['X-Chat-Session-Id' => $session->id])
            ->withCookie(ChatSessionManager::COOKIE_NAME, $session->id)
            ->postJson('/api/chat/message', [
                'message' => 'Proceed with order for 50 Clipping Path / Background Removal images (medium complexity, $35.00)',
            ]);

        $response->assertStatus(200);

        // Verify order created in DB
        $order = Order::where('chat_session_id', $session->id)->first();
        $this->assertNotNull($order);
        $this->assertSame(50, $order->quantity);
        $this->assertSame(0, $order->uploaded_count);
        $this->assertSame('pending', $order->status);

        // 2. Client uploads 2 images (less than quoted 50)
        $msgWithUploads = $this->withHeaders(['X-Chat-Session-Id' => $session->id])
            ->withCookie(ChatSessionManager::COOKIE_NAME, $session->id)
            ->postJson('/api/chat/message', [
                'message' => 'Uploaded 2 test images',
                'attachments' => [
                    'https://cdn.example.com/img1.jpg',
                    'https://cdn.example.com/img2.jpg',
                ],
            ]);

        $msgWithUploads->assertStatus(200);
        $order->refresh();

        $this->assertSame(50, $order->quantity);
        $this->assertSame(2, $order->uploaded_count);
        $this->assertCount(2, $order->images);

        // 3. Client shares Google Drive folder link
        $msgWithDrive = $this->withHeaders(['X-Chat-Session-Id' => $session->id])
            ->withCookie(ChatSessionManager::COOKIE_NAME, $session->id)
            ->postJson('/api/chat/message', [
                'message' => 'Here are all the remaining files on Google Drive: https://drive.google.com/drive/folders/1a2b3c4d5e',
            ]);

        $msgWithDrive->assertStatus(200);
        $order->refresh();

        $this->assertSame('https://drive.google.com/drive/folders/1a2b3c4d5e', $order->cloud_link);
    }

    public function test_file_size_limit_and_cloud_link_endpoint(): void
    {
        Storage::fake('public');
        $session = ChatSession::create(['ip_address' => '127.0.0.1']);

        $order = Order::factory()->create([
            'chat_session_id' => $session->id,
            'status' => 'pending',
            'cloud_link' => null,
        ]);

        // 1. Test file exceeding 25MB limit (e.g. 27MB)
        $oversizedFile = UploadedFile::fake()->create('huge_raw_batch.psd', 27000); // 27MB
        $uploadResponse = $this->withHeaders(['X-Chat-Session-Id' => $session->id])
            ->withCookie(ChatSessionManager::COOKIE_NAME, $session->id)
            ->postJson('/api/chat/upload', [
                'file' => $oversizedFile,
            ]);

        $uploadResponse->assertStatus(422);
        $uploadResponse->assertJsonStructure(['error', 'suggest_cloud_drive']);
        $this->assertTrue($uploadResponse->json('suggest_cloud_drive'));

        // 2. Test direct cloud link submission endpoint with trusted link
        $cloudResponse = $this->withHeaders(['X-Chat-Session-Id' => $session->id])
            ->withCookie(ChatSessionManager::COOKIE_NAME, $session->id)
            ->postJson('/api/chat/cloud-link', [
                'link' => 'https://www.dropbox.com/sh/xyz123/all-product-photos',
            ]);

        $cloudResponse->assertStatus(200);
        $order->refresh();
        $this->assertSame('https://www.dropbox.com/sh/xyz123/all-product-photos', $order->cloud_link);
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
