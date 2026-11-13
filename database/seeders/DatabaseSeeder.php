<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndSuperAdminSeeder::class,
            CategoryAndProjectSeeder::class,
            CapabilitySeeder::class,
            DigitalTwinSeeder::class,
            TryOnLookSeeder::class,
            SeoSettingsSeeder::class,
            ClientSeeder::class,
            TestimonialSeeder::class,
            PricingPlanSeeder::class,
            FaqSeeder::class,
            TeamMemberSeeder::class,
            JobSeeder::class,
            BlogSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
