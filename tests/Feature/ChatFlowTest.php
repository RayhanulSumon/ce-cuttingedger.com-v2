<?php

namespace Tests\Feature;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use App\Services\Security\EmailAndSpamGuard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ChatFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_initializes_public_chat_session(): void
    {
        $response = $this->postJson('/api/chat/session');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'session_id',
                'messages',
            ]);

        $this->assertDatabaseCount('chat_sessions', 1);
    }

    public function test_view_all_services_returns_service_catalog_card(): void
    {
        $sessionResponse = $this->postJson('/api/chat/session');
        $sessionId = $sessionResponse->json('session_id');

        $response = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/message', [
                'message' => 'View All Services',
            ]);

        $response->assertStatus(200);
        $toolCards = $response->json('message.tool_cards');
        $this->assertNotEmpty($toolCards);
        $this->assertSame('service_catalog_card', $toolCards[0]['type']);
        $this->assertNotEmpty($toolCards[0]['services']);
    }

    public function test_specific_service_query_returns_service_detail_card(): void
    {
        $sessionResponse = $this->postJson('/api/chat/session');
        $sessionId = $sessionResponse->json('session_id');

        $response = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/message', [
                'message' => 'Tell me about ghost mannequin service specs',
            ]);

        $response->assertStatus(200);
        $toolCards = $response->json('message.tool_cards');
        $this->assertNotEmpty($toolCards);
        $this->assertSame('service_detail_card', $toolCards[0]['type']);
        $this->assertContains($toolCards[0]['slug'], ['ghost-mannequin', 'ghost-mannequin-service']);
    }

    public function test_admin_can_view_and_update_free_trial(): void
    {
        $role = Role::firstOrCreate(['name' => 'super_admin']);
        $admin = User::firstOrCreate(
            ['email' => 'admin-trials@test.com'],
            ['name' => 'Admin User', 'password' => 'secret', 'role_id' => $role->id, 'status' => 'active']
        );

        $trial = Order::create([
            'order_number' => 'CE-TRL-TEST02',
            'client_email' => 'client@brand.com',
            'client_name' => 'Brand Director',
            'service_name' => 'Background Removal',
            'service_slug' => 'background-removal',
            'images' => ['https://cuttingedger.test/storage/chat_uploads/sample.jpg'],
            'quantity' => 1,
            'status' => 'pending',
            'payment_status' => 'free_trial',
        ]);

        $response = $this->actingAs($admin)->get('/admin/orders?type=free_trial');
        $response->assertStatus(200);

        // Update status to in_production
        $updateResponse = $this->actingAs($admin)->put("/admin/orders/{$trial->id}", [
            'status' => 'in_production',
            'admin_notes' => 'Assigned to senior retoucher',
        ]);
        $updateResponse->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'id' => $trial->id,
            'status' => 'in_production',
            'admin_notes' => 'Assigned to senior retoucher',
        ]);
    }

    public function test_admin_clears_unread_chat_lead_count_on_view_and_mark_all_read(): void
    {
        $role = Role::firstOrCreate(['name' => 'super_admin']);
        $admin = User::firstOrCreate(
            ['email' => 'admin-leads@test.com'],
            ['name' => 'Admin Leads', 'password' => 'secret', 'role_id' => $role->id, 'status' => 'active']
        );

        ContactMessage::create([
            'name' => 'Visitor Lead',
            'email' => 'visitor@test.com',
            'message' => 'Chat lead notes',
            'inquiry_type' => 'chat_lead',
            'status' => 'new',
        ]);

        $this->assertEquals(1, ContactMessage::where('inquiry_type', 'chat_lead')->where('status', 'new')->count());

        // Visiting /admin/chat-sessions marks unread leads as read
        $response = $this->actingAs($admin)->get('/admin/chat-sessions');
        $response->assertStatus(200);
        $this->assertEquals(0, ContactMessage::where('inquiry_type', 'chat_lead')->where('status', 'new')->count());
    }

    public function test_ip_rate_limiting_blocks_spam_free_trials(): void
    {
        $spamIp = '198.51.100.42';

        // First trial from this IP is registered
        Order::create([
            'order_number' => 'CE-TRL-TEST04',
            'client_email' => 'legit1@company.com',
            'ip_address' => $spamIp,
            'client_name' => 'First User',
            'service_name' => 'Background Removal',
            'service_slug' => 'background-removal',
            'images' => ['https://cuttingedger.test/storage/chat_uploads/sample1.jpg'],
            'quantity' => 1,
            'status' => 'pending',
            'payment_status' => 'free_trial',
            'created_at' => now()->subDay(),
        ]);

        // Second trial claim from the same IP within 7 days using different email must be blocked
        $guard = app(EmailAndSpamGuard::class);
        $check = $guard->checkIpRateLimit($spamIp);

        $this->assertFalse($check['allowed']);
        $this->assertStringContainsString('already been activated from your network', $check['reason']);
    }

    public function test_resets_chat_session_and_returns_fresh_welcome(): void
    {
        $session = ChatSession::create([
            'id' => (string) Str::uuid(),
            'status' => 'active',
            'last_active_at' => now(),
        ]);
        ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'user',
            'content' => 'Old message that needs to be cleared',
        ]);

        $response = $this->withHeader('X-Chat-Session-Id', $session->id)
            ->postJson('/api/chat/reset');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'session_id',
                'messages',
            ]);

        $newSessionId = $response->json('session_id');
        $this->assertNotEquals($session->id, $newSessionId);
        $this->assertEquals('archived', $session->fresh()->status);

        $messages = $response->json('messages');
        $this->assertCount(1, $messages);
        $this->assertEquals('assistant', $messages[0]['sender']);
        $this->assertStringContainsString('Welcome to **CuttingEdger**', $messages[0]['content']);
    }

    public function test_pricing_question_returns_pricing_card_and_contact_link(): void
    {
        $sessionId = $this->postJson('/api/chat/session')->json('session_id');

        $response = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/message', ['message' => 'How much does ghost mannequin retouching cost?']);

        $response->assertStatus(200);
        $types = collect($response->json('message.tool_cards'))->pluck('type')->all();
        $this->assertContains('pricing_card', $types);
        $this->assertContains('link_card', $types);
    }

    public function test_booking_request_points_to_contact_instead_of_booking(): void
    {
        $sessionId = $this->postJson('/api/chat/session')->json('session_id');

        $response = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/message', ['message' => 'I want to book a call tomorrow at 11am']);

        $response->assertStatus(200);
        $types = collect($response->json('message.tool_cards'))->pluck('type')->all();
        $this->assertSame(['link_card'], $types);
        $this->assertDatabaseCount('chat_consultations', 0);
    }

    public function test_action_endpoints_are_removed(): void
    {
        $this->assertContains($this->postJson('/api/chat/book-slot')->status(), [404, 405]);
        $this->assertContains($this->postJson('/api/chat/lead')->status(), [404, 405]);
        $this->assertContains($this->postJson('/api/chat/upload')->status(), [404, 405]);
        $this->getJson('/api/chat/available-slots')->assertStatus(404);
    }
}
