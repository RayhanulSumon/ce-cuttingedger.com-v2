<?php

namespace Tests\Feature;

use App\Models\ChatSession;
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
        $this->assertSame('calendar_slot_picker', $toolCards[0]['type']);
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
        $this->assertSame('upload_prompt_card', $toolCards[0]['type']);
    }
}
