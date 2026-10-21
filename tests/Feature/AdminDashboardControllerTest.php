<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_renders_admin_dashboard_with_studio_kpis_and_inquiries(): void
    {
        $role = Role::firstOrCreate(['name' => 'super_admin']);
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            ['name' => 'Test Admin', 'password' => 'secret', 'role_id' => $role->id, 'status' => 'active']
        );

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->has('stats')
            ->has('recentInquiries')
            ->has('featuredProjects')
        );
    }
}
