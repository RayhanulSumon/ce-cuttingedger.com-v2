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

    public function test_renders_work_index_with_all_commissions(): void
    {
        $response = $this->get('/work');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Work/Index')
            ->has('projects')
            ->has('categories')
            ->where('activeCategory', 'all')
        );
    }

    public function test_filters_work_index_by_category(): void
    {
        $response = $this->get('/work?category=3d-spatial');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Work/Index')
            ->where('activeCategory', '3d-spatial')
        );
    }

    public function test_renders_case_study_detail_page(): void
    {
        $project = Project::firstOrFail();

        $response = $this->get("/work/{$project->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Work/Show')
            ->where('project.slug', $project->slug)
            ->has('relatedProjects')
        );
    }
}
