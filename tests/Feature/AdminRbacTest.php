<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminRbacTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guest_is_redirected_from_admin_portal(): void
    {
        $response = $this->get('/admin');
        $response->assertRedirect(route('login'));
    }

    public function test_standard_user_cannot_access_admin_portal(): void
    {
        $userRole = Role::where('name', 'user')->first();
        $user = User::factory()->create(['role_id' => $userRole->id]);

        $response = $this->actingAs($user)->get('/admin');
        $response->assertForbidden();
    }

    public function test_admin_can_access_projects_but_cannot_access_user_management(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create(['role_id' => $adminRole->id]);

        // Can access projects
        $response = $this->actingAs($admin)->get('/admin/projects');
        $response->assertOk();

        // Cannot access users
        $userResponse = $this->actingAs($admin)->get('/admin/users');
        $userResponse->assertForbidden();
    }

    public function test_super_admin_has_full_access_to_user_management(): void
    {
        $superRole = Role::where('name', 'super_admin')->first();
        $superAdmin = User::factory()->create(['role_id' => $superRole->id]);

        $response = $this->actingAs($superAdmin)->get('/admin/users');
        $response->assertOk();
    }
}
