<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiscoveryCallTest extends TestCase
{
    use RefreshDatabase;

    public function test_slots_endpoint_returns_bookable_days(): void
    {
        $response = $this->getJson('/api/discovery-call/slots?timezone=UTC');

        $response->assertStatus(200)->assertJsonStructure(['days']);
        $this->assertNotEmpty($response->json('days'));
    }

    public function test_visitor_can_book_a_consultation_slot(): void
    {
        $slot = $this->getJson('/api/discovery-call/slots?timezone=UTC')->json('days.0.slots.0.iso');

        $response = $this->postJson('/api/discovery-call/book', [
            'slot_datetime' => $slot,
            'name' => 'Jane Buyer',
            'email' => 'jane@example-brand.com',
        ]);

        $response->assertStatus(200)->assertJson(['success' => true]);
        $this->assertDatabaseHas('chat_consultations', ['email' => 'jane@example-brand.com']);
    }

    public function test_booking_requires_name_and_email(): void
    {
        $this->postJson('/api/discovery-call/book', ['slot_datetime' => 'x'])->assertStatus(422);
    }
}
