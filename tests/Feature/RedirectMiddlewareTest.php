<?php

namespace Tests\Feature;

use App\Models\Redirect;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RedirectMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_legacy_service_redirects_with_301_and_increments_hits(): void
    {
        $redirect = Redirect::where('source_path', '/services/background-removal')->firstOrFail();
        $initialHits = $redirect->hit_count;

        $response = $this->get('/services/background-removal');

        $response->assertStatus(301);
        $response->assertRedirect('/services/ecommerce-catalog-optimization/clipping-path-service');

        $redirect->refresh();
        $this->assertEquals($initialHits + 1, $redirect->hit_count);
        $this->assertNotNull($redirect->last_hit_at);
    }

    public function test_non_existent_page_logs_404_for_admin_intelligence(): void
    {
        $response = $this->get('/completely-broken-legacy-link-2023');

        $response->assertStatus(404);

        $this->assertDatabaseHas('not_found_logs', [
            'path' => '/completely-broken-legacy-link-2023',
            'hit_count' => 1,
        ]);
    }
}
