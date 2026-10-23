<?php

namespace Tests\Feature;

use App\Services\Security\EmailAndSpamGuard;
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

    public function test_submitting_free_trial_creates_order_and_redirects_to_thank_you(): void
    {
        $guard = app(EmailAndSpamGuard::class);
        $secretKey = config('app.key', 'cuttingedger-secret-key');
        $token = hash_hmac('sha256', '14', $secretKey);

        $payload = [
            'name' => 'Rayhanul Test',
            'email' => 'rayhanul.ce@gmail.com',
            'company' => 'Brand Studios Ltd',
            'role' => 'Creative Director',
            'website' => 'https://brandstudios.com',
            'service' => 'E-Commerce Catalog Optimization',
            'monthly_volume' => '200 – 1,000 SKUs / month',
            'platform' => 'Shopify / Shopify Plus',
            'instructions' => 'Clean white background 255',
            'captcha_answer' => '14',
            'captcha_token' => $token,
        ];

        $response = $this->post('/free-trial', $payload);

        $response->assertRedirect(route('thank-you'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('orders', [
            'client_email' => 'rayhanul.ce@gmail.com',
            'client_name' => 'Rayhanul Test',
            'payment_status' => 'free_trial',
            'source' => 'web_trial',
        ]);
    }

    public function test_free_trial_rejects_incorrect_math_captcha(): void
    {
        $secretKey = config('app.key', 'cuttingedger-secret-key');
        $token = hash_hmac('sha256', '14', $secretKey);

        $payload = [
            'name' => 'Test User',
            'email' => 'test@legitdomain.com',
            'captcha_answer' => '99', // Incorrect answer
            'captcha_token' => $token,
        ];

        $response = $this->post('/free-trial', $payload);

        $response->assertSessionHasErrors('captcha_answer');
        $this->assertDatabaseMissing('orders', [
            'client_email' => 'test@legitdomain.com',
        ]);
    }

    public function test_free_trial_rejects_disposable_email_domain(): void
    {
        $secretKey = config('app.key', 'cuttingedger-secret-key');
        $token = hash_hmac('sha256', '14', $secretKey);

        $payload = [
            'name' => 'Spammer',
            'email' => 'fake_user@mailinator.com',
            'captcha_answer' => '14',
            'captcha_token' => $token,
        ];

        $response = $this->post('/free-trial', $payload);

        $response->assertSessionHasErrors('email');
    }
}
