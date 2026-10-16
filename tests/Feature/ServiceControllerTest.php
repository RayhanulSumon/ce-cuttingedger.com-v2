<?php

namespace Tests\Feature;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ServiceControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_renders_services_index_with_all_capabilities(): void
    {
        $response = $this->get('/services');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Services/Index')
            ->has('services', 4)
        );
    }

    public function test_renders_individual_service_detail_page(): void
    {
        $service = Service::firstOrFail();

        $response = $this->get("/services/{$service->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Services/Show')
            ->where('service.slug', $service->slug)
            ->has('otherServices')
        );
    }
}
