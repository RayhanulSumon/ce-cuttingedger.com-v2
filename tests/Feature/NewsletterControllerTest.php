<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsletterControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_subscribes_email_to_newsletter_and_redirects(): void
    {
        $response = $this->post('/newsletter', [
            'email' => 'founder@cuttingedger.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'founder@cuttingedger.com',
        ]);
    }

    public function test_fails_validation_for_invalid_email(): void
    {
        $response = $this->post('/newsletter', [
            'email' => 'not-an-email',
        ]);

        $response->assertSessionHasErrors(['email']);
    }
}
