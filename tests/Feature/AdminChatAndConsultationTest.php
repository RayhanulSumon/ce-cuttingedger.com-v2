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
}
