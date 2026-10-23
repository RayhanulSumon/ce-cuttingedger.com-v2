<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WorkControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_renders_case_studies_index_with_all_commissions(): void
    {
        $response = $this->get('/case-studies');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Work/Index')
            ->has('projects')
            ->has('categories')
            ->where('activeCategory', 'all')
        );
    }

    public function test_legacy_work_redirects_301_to_case_studies(): void
    {
        $response = $this->get('/work');

        $response->assertStatus(301);
        $response->assertRedirect('/case-studies');
    }

    public function test_filters_case_studies_by_category(): void
    {
        $response = $this->get('/case-studies?category=3d-spatial');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Work/Index')
            ->where('activeCategory', '3d-spatial')
        );
    }

    public function test_renders_case_study_detail_page(): void
    {
        $project = Project::firstOrFail();

        $response = $this->get("/case-studies/{$project->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Work/Show')
            ->where('project.slug', $project->slug)
            ->has('relatedProjects')
        );
    }

    public function test_legacy_work_slug_redirects_301_to_case_studies_slug(): void
    {
        $project = Project::firstOrFail();

        $response = $this->get("/work/{$project->slug}");

        $response->assertStatus(301);
        $response->assertRedirect("/case-studies/{$project->slug}");
    }
}
