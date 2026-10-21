<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndSuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Create initial Super Admin account if not present
        User::firstOrCreate(
            ['email' => 'admin@cuttingedger.com'],
            [
                'name' => 'Lead Architect',
                'password' => Hash::make('Secret123!'),
                'role_id' => $superAdminRole->id,
                'status' => 'active',
            ]
        );

        // Create standard Admin account for testing
        User::firstOrCreate(
            ['email' => 'editor@cuttingedger.com'],
            [
                'name' => 'Studio Editor',
                'password' => Hash::make('Secret123!'),
                'role_id' => $adminRole->id,
                'status' => 'active',
            ]
        );
    }
}
