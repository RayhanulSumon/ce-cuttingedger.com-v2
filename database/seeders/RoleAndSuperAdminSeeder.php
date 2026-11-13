<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RoleAndSuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage_orders',
            'manage_digital_twins',
            'manage_try_on_looks',
            'manage_clients',
            'manage_inbox',
            'manage_content',
            'manage_seo',
            'manage_settings',
            'manage_admins',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        $superAdminRole->syncPermissions($permissions);
        $adminRole->syncPermissions([
            'manage_orders',
            'manage_digital_twins',
            'manage_try_on_looks',
            'manage_clients',
            'manage_inbox',
            'manage_content',
            'manage_seo',
        ]);

        // Create initial Super Admin account if not present
        $superAdmin = User::updateOrCreate(
            ['email' => 'admin@cuttingedger.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('12345678'),
                'role_id' => $superAdminRole->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->syncRoles([$superAdminRole->name]);

        // Create standard Admin account for testing
        $editor = User::updateOrCreate(
            ['email' => 'editor@cuttingedger.com'],
            [
                'name' => 'Studio Editor',
                'password' => Hash::make('Secret123!'),
                'role_id' => $adminRole->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $editor->syncRoles([$adminRole->name]);

        // Seed 2 Verified Client Accounts for Testing
        $client1 = User::updateOrCreate(
            ['email' => 'client1@cuttingedger.com'],
            [
                'name' => 'Clara Vance',
                'company' => 'Vance Atelier Paris',
                'phone' => '+33 1 42 68 55 00',
                'password' => Hash::make('12345678'),
                'role_id' => $userRole->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $client1->syncRoles([$userRole->name]);

        $client2 = User::updateOrCreate(
            ['email' => 'client2@cuttingedger.com'],
            [
                'name' => 'Marcus Sterling',
                'company' => 'Sterling Luxury Group',
                'phone' => '+1 (212) 555-0194',
                'password' => Hash::make('12345678'),
                'role_id' => $userRole->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $client2->syncRoles([$userRole->name]);
    }
}
