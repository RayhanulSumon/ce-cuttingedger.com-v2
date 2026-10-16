<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContactControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_renders_contact_page_view(): void
    {
        $response = $this->get('/contact');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('Contact'));
    }

    public function test_stores_valid_contact_inquiry_and_redirects(): void
    {
        $payload = [
            'name' => 'Aria Thorne',
            'email' => 'aria@hyperion-audio.com',
            'company' => 'Hyperion Acoustic Labs',
            'budget' => '$30k - $60k',
            'service_interest' => 'Kinetic 3D & Motion',
            'message' => 'Need 3D WebGL product configurator and 2D branding.',
        ];

        $response = $this->post('/contact', $payload);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'aria@hyperion-audio.com',
            'name' => 'Aria Thorne',
        ]);
    }

    public function test_honeypot_silently_discards_automated_bot_spam(): void
    {
        $payload = [
            'name' => 'Spam Bot',
            'email' => 'bot@spammer.com',
            'message' => 'Spam content',
            'website_url' => 'https://hidden-trap.com',
        ];

        $response = $this->post('/contact', $payload);

        $response->assertRedirect();
        $this->assertDatabaseMissing('contact_messages', [
            'email' => 'bot@spammer.com',
        ]);
    }
}
