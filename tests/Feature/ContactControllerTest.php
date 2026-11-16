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

    public function test_renders_thank_you_page_cleanly(): void
    {
        $response = $this->get('/thank-you');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('ThankYou'));
    }

    public function test_stores_valid_contact_inquiry_and_redirects(): void
    {
        $payload = [
            'name' => 'Aria Thorne',
            'email' => 'aria@hyperion-audio.com',
            'phone' => '+1 555-0199',
            'company' => 'Hyperion Acoustic Labs',
            'website' => 'https://hyperion-audio.com',
            'service_interest' => 'Kinetic 3D & Motion',
            'message' => 'Need 3D WebGL product configurator and 2D branding.',
        ];

        $response = $this->from('/contact')->post('/contact', $payload);

        $response->assertRedirect('/contact');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'aria@hyperion-audio.com',
            'name' => 'Aria Thorne',
            'phone' => '+1 555-0199',
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
