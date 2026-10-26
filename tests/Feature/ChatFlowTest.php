<?php

namespace Tests\Feature;

use App\Models\ChatConsultation;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use App\Services\Security\EmailAndSpamGuard;
use Carbon\Carbon;
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

    public function test_generates_price_quote_card_from_intent(): void
    {
        $sessionResponse = $this->postJson('/api/chat/session');
        $sessionId = $sessionResponse->json('session_id');

        $response = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/message', [
                'message' => 'What is your price for ghost mannequin retouching for 50 images?',
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'session_id',
                'engine',
                'message' => [
                    'id',
                    'sender',
                    'content',
                    'tool_cards',
                    'suggested_replies',
                ],
            ]);

        $this->assertDatabaseHas('chat_messages', [
            'chat_session_id' => $sessionId,
            'sender' => 'assistant',
        ]);
    }

    public function test_generates_calendar_slot_picker(): void
    {
        $sessionResponse = $this->postJson('/api/chat/session');
        $sessionId = $sessionResponse->json('session_id');

        $response = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/message', [
                'message' => 'Can I schedule a meeting or call to discuss my project?',
            ]);

        $response->assertStatus(200);
        $toolCards = $response->json('message.tool_cards');
        $this->assertNotEmpty($toolCards);
        $this->assertContains($toolCards[0]['type'], ['calendar_slot_picker', 'compact_slot_proposal']);
    }

    public function test_books_consultation_slot(): void
    {
        $sessionResponse = $this->postJson('/api/chat/session');
        $sessionId = $sessionResponse->json('session_id');

        $slotTime = now()->addDays(2)->setHour(14)->setMinute(0)->toIso8601String();

        $response = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/book-slot', [
                'slot_datetime' => $slotTime,
                'name' => 'Sophia Laurent',
                'email' => 'sophia@luxefashion.fr',
                'phone' => '+33 6 12 34 56 78',
                'notes' => '500 dress photos ready for ghost mannequin',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('chat_consultations', [
            'chat_session_id' => $sessionId,
            'email' => 'sophia@luxefashion.fr',
        ]);

        $this->assertDatabaseHas('chat_sessions', [
            'id' => $sessionId,
            'lead_email' => 'sophia@luxefashion.fr',
            'status' => 'converted',
        ]);
    }

    public function test_inactivity_check_returns_nudge_for_idle_visitor(): void
    {
        $session = ChatSession::create([
            'id' => (string) Str::uuid(),
            'last_active_at' => now()->subMinutes(5),
            'status' => 'active',
        ]);

        ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'user',
            'content' => 'Hello I need clipping path quote',
        ]);

        $response = $this->withHeader('X-Chat-Session-Id', $session->id)
            ->getJson('/api/chat/inactivity-check');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'nudge' => [
                    'id',
                    'content',
                    'suggested_replies',
                ],
            ]);
    }

    public function test_inactivity_check_does_not_create_session_if_missing(): void
    {
        $initialCount = ChatSession::count();

        $response = $this->getJson('/api/chat/inactivity-check');

        $response->assertStatus(200)
            ->assertJson(['nudge' => null]);

        $this->assertEquals($initialCount, ChatSession::count());
    }

    public function test_handles_quote_confirmation_and_batch_upload_intent(): void
    {
        $sessionResponse = $this->postJson('/api/chat/session');
        $sessionId = $sessionResponse->json('session_id');

        $response = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/message', [
                'message' => 'I confirm this quote and want to upload my batch',
            ]);

        $response->assertStatus(200);
        $toolCards = $response->json('message.tool_cards');
        $this->assertNotEmpty($toolCards);
        $cardTypes = array_column($toolCards, 'type');
        $this->assertContains('order_confirmed_card', $cardTypes);
        $this->assertContains('upload_prompt_card', $cardTypes);
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

    public function test_reschedule_consultation_slot_in_chat(): void
    {
        $sessionResponse = $this->postJson('/api/chat/session');
        $sessionId = $sessionResponse->json('session_id');

        $slotTime1 = now()->addDays(2)->setHour(14)->setMinute(0)->toIso8601String();

        // 1. Initial Booking
        $response1 = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/book-slot', [
                'slot_datetime' => $slotTime1,
                'name' => 'Jean-Paul Sartre',
                'email' => 'jeanpaul@existential.fr',
            ]);
        $response1->assertStatus(200);

        $consultation = ChatConsultation::where('chat_session_id', $sessionId)->first();
        $this->assertNotNull($consultation);
        $consultationId = $consultation->id;

        // 2. Reschedule to new slot
        $slotTime2 = now()->addDays(4)->setHour(16)->setMinute(0)->toIso8601String();

        $response2 = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/book-slot', [
                'slot_datetime' => $slotTime2,
                'name' => 'Jean-Paul Sartre',
                'email' => 'jeanpaul@existential.fr',
                'consultation_id' => $consultationId,
                'is_reschedule' => true,
            ]);

        $response2->assertStatus(200);
        $this->assertStringContainsString('Rescheduled', $response2->json('message.content'));

        // Ensure no duplicate consultation was created; only updated
        $this->assertEquals(1, ChatConsultation::where('chat_session_id', $sessionId)->count());
        $consultation->refresh();
        $this->assertStringContainsString('Rescheduled via Chat', (string) $consultation->notes);
    }

    public function test_uploaded_image_quote_and_free_trial_claim_at_zero_cost(): void
    {
        $sessionResponse = $this->postJson('/api/chat/session');
        $sessionId = $sessionResponse->json('session_id');

        // 1. Upload sample image
        $uploadResponse = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/message', [
                'message' => 'Please estimate pricing for my shoes image',
                'attachments' => ['https://cuttingedger.test/storage/chat_uploads/sample_shoe.jpg'],
            ]);

        $uploadResponse->assertStatus(200);
        $toolCards = $uploadResponse->json('message.tool_cards');
        $this->assertNotEmpty($toolCards);
        $this->assertSame('quote_card', $toolCards[0]['type']);
        $this->assertTrue($toolCards[0]['free_trial_eligible']);
        $this->assertSame('0.00', $toolCards[0]['total_price']);

        // 2. Click "Claim 3 Free Sample Edits"
        $claimResponse = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/message', [
                'message' => 'Claim 3 Free Sample Edits',
            ]);

        $claimResponse->assertStatus(200);
        $claimCards = $claimResponse->json('message.tool_cards');
        $this->assertNotEmpty($claimCards);
        // Must return free_trial_confirmed_card, NOT upload_prompt_card!
        $this->assertSame('free_trial_confirmed_card', $claimCards[0]['type']);
        $this->assertSame(1, $claimCards[0]['images_count']); // Exact single image count!
        $this->assertStringContainsString('$0.00', $claimCards[0]['total_cost']);
        $this->assertStringContainsString('Free Trial', $claimResponse->json('message.content'));

        $this->assertDatabaseHas('orders', [
            'chat_session_id' => $sessionId,
            'payment_status' => 'free_trial',
            'quantity' => 1,
            'status' => 'pending',
        ]);
    }

    public function test_save_lead_endpoint_links_to_session_and_trial_order(): void
    {
        $sessionResponse = $this->postJson('/api/chat/session');
        $sessionId = $sessionResponse->json('session_id');

        // Create pending trial
        Order::create([
            'order_number' => 'CE-TRL-TEST01',
            'chat_session_id' => $sessionId,
            'client_email' => 'pending-email@temp.local',
            'client_name' => 'Guest Client',
            'service_name' => 'Background Removal',
            'service_slug' => 'background-removal',
            'quantity' => 1,
            'status' => 'pending',
            'payment_status' => 'free_trial',
        ]);

        $response = $this->withHeader('X-Chat-Session-Id', $sessionId)
            ->postJson('/api/chat/lead', [
                'email' => 'artisan@studio.com',
                'name' => 'Artisan Lead',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('chat_sessions', [
            'id' => $sessionId,
            'lead_email' => 'artisan@studio.com',
            'lead_name' => 'Artisan Lead',
        ]);

        $this->assertDatabaseHas('orders', [
            'chat_session_id' => $sessionId,
            'client_email' => 'artisan@studio.com',
        ]);
    }

    public function test_calendar_booking_prevents_duplicate_for_same_email_upcoming(): void
    {
        $email = 'duplicate-test@cuttingedger.com';

        // 1. Initial booking 2 days in future
        $slotTime1 = now()->addDays(2)->setHour(10)->setMinute(0)->toIso8601String();
        $response1 = $this->postJson('/api/chat/book-slot', [
            'slot_datetime' => $slotTime1,
            'name' => 'Test User',
            'email' => $email,
        ]);
        $response1->assertStatus(200);
        $this->assertEquals(1, ChatConsultation::where('email', $email)->count());

        // 2. User attempts to book AGAIN with same email for a different slot (e.g. 5 days in future)
        $slotTime2 = now()->addDays(5)->setHour(14)->setMinute(0)->toIso8601String();
        $response2 = $this->postJson('/api/chat/book-slot', [
            'slot_datetime' => $slotTime2,
            'name' => 'Test User',
            'email' => $email,
        ]);
        $response2->assertStatus(200);

        // MUST NOT create duplicate; must update/reschedule existing upcoming consultation!
        $this->assertEquals(1, ChatConsultation::where('email', $email)->count());
        $consultation = ChatConsultation::where('email', $email)->first();
        $this->assertEquals(Carbon::parse($slotTime2)->toDateTimeString(), $consultation->scheduled_at->toDateTimeString());
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

    public function test_single_email_can_only_claim_free_trial_once(): void
    {
        $existingEmail = 'claimed-trial@brand.com';
        Order::create([
            'order_number' => 'CE-TRL-TEST03',
            'client_email' => $existingEmail,
            'client_name' => 'Existing Client',
            'service_name' => 'Background Removal',
            'service_slug' => 'background-removal',
            'images' => ['https://cuttingedger.test/storage/chat_uploads/sample.jpg'],
            'quantity' => 3,
            'status' => 'completed',
            'payment_status' => 'free_trial',
        ]);

        // Attempting to link the same email in a new session to claim another trial must be blocked
        $response = $this->postJson('/api/chat/lead', [
            'email' => $existingEmail,
            'name' => 'Existing Client',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => false,
            'quota_exceeded' => true,
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

    public function test_disposable_email_is_blocked(): void
    {
        $response = $this->postJson('/api/chat/lead', [
            'email' => 'spammer@tempmail.com',
            'name' => 'Spam Bot',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'error_type' => 'disposable_domain',
        ]);
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

    public function test_calendar_booking_blocks_disposable_email(): void
    {
        $slotTime = now()->addDays(2)->setHour(11)->setMinute(30)->toIso8601String();
        $response = $this->postJson('/api/chat/book-slot', [
            'slot_datetime' => $slotTime,
            'name' => 'Spam Book',
            'email' => 'abuser@10minutemail.com',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'error_type' => 'disposable_domain',
        ]);
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

    public function test_fresh_chat_intent_returns_reset_prompt_card(): void
    {
        $session = ChatSession::create([
            'id' => (string) Str::uuid(),
            'status' => 'active',
            'last_active_at' => now(),
        ]);

        $response = $this->withHeader('X-Chat-Session-Id', $session->id)
            ->postJson('/api/chat/message', [
                'message' => 'can we start a fresh chat please?',
            ]);

        $response->assertStatus(200);
        $toolCards = $response->json('message.tool_cards');
        $this->assertNotEmpty($toolCards);
        $this->assertEquals('reset_chat_prompt_card', $toolCards[0]['type']);
    }
}
