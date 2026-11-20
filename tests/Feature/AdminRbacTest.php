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

    public function test_standard_admin_cannot_escalate_privileges_or_modify_admins_via_client_accounts(): void
    {
        $adminRole = Role::where('name', 'admin')->firstOrFail();
        $superRole = Role::where('name', 'super_admin')->firstOrFail();
        $userRole = Role::where('name', 'user')->firstOrFail();

        $standardAdmin = User::factory()->create(['role_id' => $adminRole->id]);
        $superAdmin = User::factory()->create(['role_id' => $superRole->id]);

        // Creating an account via /admin/client-accounts with a super_admin role_id forces 'user' role.
        $this->actingAs($standardAdmin)
            ->post('/admin/client-accounts', [
                'name' => 'Sneaky User',
                'email' => 'sneaky@example.com',
                'role_id' => $superRole->id,
                'status' => 'active',
                'password' => 'Password123!',
            ])
            ->assertRedirect();

        $created = User::where('email', 'sneaky@example.com')->firstOrFail();
        $this->assertSame($userRole->id, $created->role_id);
        $this->assertFalse($created->isAdmin());

        // Standard admin cannot update, toggle, verify, or delete an admin account via client-accounts endpoints.
        $this->actingAs($standardAdmin)
            ->put("/admin/client-accounts/{$superAdmin->id}", [
                'name' => 'Hijacked',
                'email' => $superAdmin->email,
                'status' => 'suspended',
            ])
            ->assertForbidden();

        $this->actingAs($standardAdmin)
            ->post("/admin/client-accounts/{$superAdmin->id}/toggle-status")
            ->assertForbidden();

        $this->actingAs($standardAdmin)
            ->post("/admin/client-accounts/{$superAdmin->id}/verify-email")
            ->assertForbidden();

        $this->actingAs($standardAdmin)
            ->delete("/admin/client-accounts/{$superAdmin->id}")
            ->assertForbidden();
    }
}
