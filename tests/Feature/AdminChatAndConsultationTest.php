<?php

namespace Tests\Feature;

use App\Models\ChatConsultation;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminChatAndConsultationTest extends TestCase
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

    public function test_admin_can_view_consultations_index(): void
    {
        ChatConsultation::create([
            'chat_session_id' => null,
            'name' => 'Charlotte Dubois',
            'email' => 'charlotte@luxe.com',
            'phone' => '+33 6 12 34 56',
            'scheduled_at' => now()->addDays(2),
            'timezone' => 'Europe/Paris',
            'status' => 'confirmed',
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/consultations');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Consultations/Index')
            ->has('consultations')
            ->has('stats')
        );
    }

    public function test_admin_can_update_consultation_status(): void
    {
        $consultation = ChatConsultation::create([
            'chat_session_id' => null,
            'name' => 'Charlotte Dubois',
            'email' => 'charlotte@luxe.com',
            'scheduled_at' => now()->addDays(2),
            'status' => 'confirmed',
        ]);

        $response = $this->actingAs($this->admin)->put("/admin/consultations/{$consultation->id}", [
            'status' => 'completed',
            'notes' => 'Call completed with positive feedback',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('chat_consultations', [
            'id' => $consultation->id,
            'status' => 'completed',
        ]);
    }

    public function test_admin_can_delete_consultation(): void
    {
        $consultation = ChatConsultation::create([
            'chat_session_id' => null,
            'name' => 'Charlotte Dubois',
            'email' => 'charlotte@luxe.com',
            'scheduled_at' => now()->addDays(2),
            'status' => 'cancelled',
        ]);

        $response = $this->actingAs($this->admin)->delete("/admin/consultations/{$consultation->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('chat_consultations', [
            'id' => $consultation->id,
        ]);
    }

    public function test_admin_can_view_chat_sessions_index(): void
    {
        $session = ChatSession::create([
            'id' => (string) Str::uuid(),
            'lead_name' => 'Alexandre Dumas',
            'lead_email' => 'alex@studio.fr',
            'status' => 'converted',
            'last_active_at' => now(),
        ]);

        ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'user',
            'content' => 'Hello, I need pricing for 100 images',
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/chat-sessions');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/ChatSessions/Index')
            ->has('sessions')
            ->has('stats')
        );
    }

    public function test_admin_can_view_chat_session_transcript_json(): void
    {
        $session = ChatSession::create([
            'id' => (string) Str::uuid(),
            'lead_name' => 'Alexandre Dumas',
            'lead_email' => 'alex@studio.fr',
            'status' => 'converted',
            'last_active_at' => now(),
        ]);

        ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'user',
            'content' => 'Hello, test message',
        ]);

        $response = $this->actingAs($this->admin)->getJson("/admin/chat-sessions/{$session->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'session' => ['id', 'lead_name', 'lead_email'],
                'messages' => [
                    '*' => ['id', 'sender', 'content', 'created_at_formatted'],
                ],
            ]);
    }

    public function test_admin_can_delete_chat_session(): void
    {
        $session = ChatSession::create([
            'id' => (string) Str::uuid(),
            'lead_name' => 'Alexandre Dumas',
            'lead_email' => 'alex@studio.fr',
            'status' => 'abandoned',
            'last_active_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->delete("/admin/chat-sessions/{$session->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('chat_sessions', [
            'id' => $session->id,
        ]);
    }

    public function test_admin_can_bulk_delete_empty_chat_sessions(): void
    {
        // 1 empty session
        $emptySession = ChatSession::create([
            'id' => (string) Str::uuid(),
            'status' => 'active',
            'last_active_at' => now(),
        ]);

        // 1 engaged session with message
        $engagedSession = ChatSession::create([
            'id' => (string) Str::uuid(),
            'lead_name' => 'Active Lead',
            'status' => 'converted',
            'last_active_at' => now(),
        ]);
        ChatMessage::create([
            'chat_session_id' => $engagedSession->id,
            'sender' => 'user',
            'content' => 'Hello',
        ]);

        $response = $this->actingAs($this->admin)->delete('/admin/chat-sessions-bulk/destroy-all', [
            'type' => 'empty',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseMissing('chat_sessions', ['id' => $emptySession->id]);
        $this->assertDatabaseHas('chat_sessions', ['id' => $engagedSession->id]);
    }

    public function test_admin_can_bulk_delete_all_chat_sessions(): void
    {
        ChatSession::create([
            'id' => (string) Str::uuid(),
            'status' => 'active',
            'last_active_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->delete('/admin/chat-sessions-bulk/destroy-all', [
            'type' => 'all',
        ]);

        $response->assertRedirect();
        $this->assertEquals(0, ChatSession::count());
    }

    public function test_admin_can_confirm_pending_consultation(): void
    {
        $consultation = ChatConsultation::create([
            'chat_session_id' => null,
            'name' => 'Jean-Luc Godard',
            'email' => 'jeanluc@cinema.fr',
            'scheduled_at' => now()->addDays(3),
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->put("/admin/consultations/{$consultation->id}", [
            'status' => 'confirmed',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('chat_consultations', [
            'id' => $consultation->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_admin_can_reschedule_consultation(): void
    {
        $oldDate = now()->addDays(2);
        $newDate = now()->addDays(5)->startOfHour();

        $consultation = ChatConsultation::create([
            'chat_session_id' => null,
            'name' => 'Jean-Luc Godard',
            'email' => 'jeanluc@cinema.fr',
            'scheduled_at' => $oldDate,
            'status' => 'pending',
            'notes' => 'Original booking note',
        ]);

        $response = $this->actingAs($this->admin)->put("/admin/consultations/{$consultation->id}", [
            'scheduled_at' => $newDate->toIso8601String(),
            'notes' => 'Client requested Friday afternoon',
        ]);

        $response->assertRedirect();

        $consultation->refresh();
        $this->assertEquals('confirmed', $consultation->status);
        $this->assertStringContainsString('Rescheduled: previously', (string) $consultation->notes);
        $this->assertStringContainsString('Client requested Friday afternoon', (string) $consultation->notes);
    }

    public function test_admin_can_takeover_and_reply_to_chat_session(): void
    {
        $session = ChatSession::create([
            'id' => (string) Str::uuid(),
            'status' => 'active',
            'mode' => 'bot',
            'last_active_at' => now(),
        ]);

        // 1. Take over
        $takeoverResponse = $this->actingAs($this->admin)
            ->postJson("/admin/chat-sessions/{$session->id}/takeover");

        $takeoverResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'session' => [
                    'id' => $session->id,
                    'mode' => 'operator',
                ],
            ]);

        $session->refresh();
        $this->assertEquals('operator', $session->mode);
        $this->assertEquals($this->admin->id, $session->operator_id);

        // 2. Reply as operator
        $replyResponse = $this->actingAs($this->admin)
            ->postJson("/admin/chat-sessions/{$session->id}/reply", [
                'content' => 'Hello from human studio specialist!',
            ]);

        $replyResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => [
                    'sender' => 'operator',
                    'content' => 'Hello from human studio specialist!',
                ],
            ]);

        $this->assertDatabaseHas('chat_messages', [
            'chat_session_id' => $session->id,
            'sender' => 'operator',
            'content' => 'Hello from human studio specialist!',
        ]);

        // 3. Visitor polling receives the operator message
        $pollResponse = $this->withHeader('X-Chat-Session-Id', $session->id)
            ->getJson('/api/chat/poll');

        $pollResponse->assertStatus(200)
            ->assertJson([
                'mode' => 'operator',
            ]);

        $messages = $pollResponse->json('messages');
        $this->assertTrue(collect($messages)->contains('sender', 'operator'));
    }

    public function test_admin_can_release_chat_session_to_bot(): void
    {
        $session = ChatSession::create([
            'id' => (string) Str::uuid(),
            'status' => 'active',
            'mode' => 'operator',
            'operator_id' => $this->admin->id,
            'last_active_at' => now(),
        ]);

        $releaseResponse = $this->actingAs($this->admin)
            ->postJson("/admin/chat-sessions/{$session->id}/release");

        $releaseResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'session' => [
                    'mode' => 'bot',
                ],
            ]);

        $session->refresh();
        $this->assertEquals('bot', $session->mode);
    }

    public function test_visitor_request_human_flags_session_for_takeover(): void
    {
        $session = ChatSession::create([
            'id' => (string) Str::uuid(),
            'status' => 'active',
            'mode' => 'bot',
            'last_active_at' => now(),
        ]);

        $response = $this->withHeader('X-Chat-Session-Id', $session->id)
            ->postJson('/api/chat/message', [
                'message' => 'Can I speak with a real human operator please?',
            ]);

        $response->assertStatus(200);

        $session->refresh();
        $this->assertTrue($session->needs_human);
    }
}
