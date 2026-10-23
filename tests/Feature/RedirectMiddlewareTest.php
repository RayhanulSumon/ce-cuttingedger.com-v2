<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Redirect;
use App\Models\Service;
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

    public function test_changing_service_slug_automatically_creates_301_redirect(): void
    {
        $service = Service::whereNull('parent_id')->firstOrFail();
        $oldPath = $service->path;
        $newSlug = $service->slug.'-renamed';

        $service->update(['slug' => $newSlug]);

        $this->assertDatabaseHas('redirects', [
            'source_path' => $oldPath,
            'target_url' => "/services/{$newSlug}",
            'status_code' => 301,
            'is_active' => true,
        ]);
    }

    public function test_changing_case_study_slug_automatically_creates_301_redirect(): void
    {
        $project = Project::firstOrFail();
        $oldPath = "/case-studies/{$project->slug}";
        $newSlug = $project->slug.'-updated';

        $project->update(['slug' => $newSlug]);

        $this->assertDatabaseHas('redirects', [
            'source_path' => $oldPath,
            'target_url' => "/case-studies/{$newSlug}",
            'status_code' => 301,
            'is_active' => true,
        ]);
    }

    public function test_career_singular_301_redirects_to_careers(): void
    {
        $response = $this->get('/career');

        $response->assertStatus(301);
        $response->assertRedirect('/careers');
    }

    public function test_uppercase_esg_policy_301_redirects_to_lowercase(): void
    {
        $response = $this->get('/ESG-policy');

        $response->assertStatus(301);
        $response->assertRedirect('/esg-policy');
    }
}
