<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PageControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_renders_about_page(): void
    {
        $response = $this->get('/about');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('About')
            ->has('leadership')
        );
    }

    public function test_renders_pricing_page(): void
    {
        $response = $this->get('/pricing');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Pricing')
            ->has('plans', 3)
            ->has('faqs')
        );
    }

    public function test_renders_faq_page(): void
    {
        $response = $this->get('/faq');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Faq')
            ->has('faqs')
            ->has('categories')
        );
    }

    public function test_renders_privacy_and_terms_pages(): void
    {
        $this->get('/privacy')->assertStatus(200)->assertInertia(fn (Assert $page) => $page->component('Privacy'));
        $this->get('/terms')->assertStatus(200)->assertInertia(fn (Assert $page) => $page->component('Terms'));
    }

    public function test_renders_robots_txt_as_plain_text(): void
    {
        $response = $this->get('/robots.txt');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
        $this->assertStringContainsString('User-agent: *', $response->getContent());
    }

    public function test_renders_reviews_page(): void
    {
        $response = $this->get('/reviews');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Reviews')
            ->has('testimonials')
            ->has('clients')
        );
    }
}
