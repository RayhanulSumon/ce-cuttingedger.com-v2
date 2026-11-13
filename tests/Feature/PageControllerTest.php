<?php

namespace Tests\Feature;

use App\Models\User;
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
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('About')
                ->has('leadership')
        );
    }

    public function test_renders_digital_twins_catalogue_page(): void
    {
        $this->get(route('digital-twins.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('DigitalTwins/Index'));
    }

    public function test_renders_pricing_page(): void
    {
        $response = $this->get('/pricing');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Pricing')
                ->has('plans', 3)
                ->has('faqs')
        );
    }

    public function test_faq_page_redirects_to_the_homepage_section(): void
    {
        $this->get('/faq')->assertRedirect('/?section=faq')->assertStatus(301);
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

    public function test_renders_digital_twin_order_page_prefilled_from_query_string(): void
    {
        $this->get('/digital-twins/order?mode=custom&ref=Look%2016')
            ->assertRedirect(route('login'));

        $client = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($client)->get('/digital-twins/order?mode=custom&ref=Look%2016');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('DigitalTwins/Order')
                ->where('initialMode', 'custom')
                ->where('initialReference', 'Look 16')
                ->has('digitalTwins')
                ->has('attributes')
        );
    }

    public function test_legacy_order_route_redirects_to_dedicated_order_pages(): void
    {
        $this->get('/order?service=digital-twins&ref=Look%2016')
            ->assertRedirect(route('digital-twins.order', ['ref' => 'Look 16']));

        $this->get('/order?service=virtual-try-on&ref=Elena')
            ->assertRedirect(route('try-on.quote', ['look' => 'Elena', 'service' => 'virtual-try-on']));
    }

    public function test_reviews_page_redirects_to_the_homepage_section(): void
    {
        $this->get('/reviews')->assertRedirect('/?section=clients')->assertStatus(301);
    }
}
