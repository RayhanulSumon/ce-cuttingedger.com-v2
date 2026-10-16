<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgencyRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_all_primary_pages_return_successful_response(): void
    {
        $routes = [
            '/',
            '/about',
            '/services',
            '/services/product-design',
            '/work',
            '/work/kinetix-os',
            '/team',
            '/team/elena-rostova',
            '/careers',
            '/careers/senior-frontend-engineer',
            '/pricing',
            '/faq',
            '/blog',
            '/blog/death-of-minimalist-box',
            '/contact',
            '/privacy',
            '/terms',
        ];

        foreach ($routes as $route) {
            $response = $this->get($route);
            $response->assertStatus(200);
        }
    }

    public function test_contact_form_validates_and_stores_inquiry(): void
    {
        $payload = [
            'name' => 'Dr. Jessica Vance',
            'email' => 'jessica@quantum.io',
            'company' => 'Quantum Labs',
            'budget' => '$30k - $60k',
            'service_interest' => 'Product Design & Web',
            'message' => 'We want to architect a next-gen quantum compute telemetry terminal.',
        ];

        $response = $this->post('/contact', $payload);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'jessica@quantum.io',
            'name' => 'Dr. Jessica Vance',
        ]);
    }

    public function test_contact_form_honeypot_silently_traps_bots(): void
    {
        $payload = [
            'name' => 'Spam Bot',
            'email' => 'bot@spammer.com',
            'message' => 'Buy cheap pharmaceutical pills online now!',
            'website_url' => 'https://spam-domain.com', // Honeypot filled
        ];

        $response = $this->post('/contact', $payload);

        $response->assertRedirect();
        // Should not store in database
        $this->assertDatabaseMissing('contact_messages', [
            'email' => 'bot@spammer.com',
        ]);
    }

    public function test_newsletter_subscription_stores_subscriber(): void
    {
        $response = $this->post('/newsletter', [
            'email' => 'subscriber@cuttingedger.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'subscriber@cuttingedger.com',
        ]);
    }

    public function test_sitemap_and_robots_return_correct_mime_and_status(): void
    {
        $sitemapResponse = $this->get('/sitemap.xml');
        $sitemapResponse->assertStatus(200);
        $sitemapResponse->assertHeader('Content-Type', 'application/xml');

        $robotsResponse = $this->get('/robots.txt');
        $robotsResponse->assertStatus(200);
        $robotsResponse->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
    }
}
