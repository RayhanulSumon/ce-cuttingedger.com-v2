<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = [
            [
                'name' => 'Delwar Hussain',
                'email' => 'delwar@cuttingedger.com',
                'slug' => 'delwar-hussain',
                'role' => 'COO',
                'since_year' => 2019,
                'bio' => 'Pioneered CuttingEdger from a boutique retouching facility into an international post-production engine trusted by over 170+ global retail and e-commerce brands.',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
                'social_links' => ['linkedin' => 'https://www.linkedin.com/company/cutting-edger/'],
                'featured' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Enamul Karim',
                'email' => 'enamilkarim@cuttingedger.com',
                'slug' => 'enamul-karim',
                'role' => 'CSO',
                'since_year' => 2020,
                'bio' => 'Oversees our multi-tiered QA inspection pipeline, ensuring every clipping path, ghost mannequin joint, and jewelry sparkle meets exacting international specifications.',
                'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
                'social_links' => ['linkedin' => 'https://linkedin.com'],
                'featured' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Afroza Luna',
                'email' => 'afroza@cuttingedger.com',
                'slug' => 'afroza-luna',
                'role' => 'HR & Operation manager',
                'since_year' => 2021,
                'bio' => 'Specializes in CAD-to-mesh digital twin modeling, PBR texture synthesis, and interactive WebGL assets for enterprise furniture and consumer hardware brands.',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                'social_links' => ['linkedin' => 'https://linkedin.com'],
                'featured' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Mahummad Belayet Hussain',
                'email' => 'tariqul@cuttingedger.com',
                'slug' => 'tariqul-islam',
                'role' => 'Lead',
                'since_year' => 2021,
                'bio' => 'Directs our high-speed vector cutout division, specializing in complex hair masking, multi-layered paths, and zero-defect Amazon/Shopify compliance.',
                'avatar' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
                'social_links' => ['linkedin' => 'https://linkedin.com'],
                'featured' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Fabi',
                'email' => 'tanvir@cuttingedger.com',
                'slug' => 'tanvir-ahmed',
                'role' => 'Client Acquisition',
                'since_year' => 2022,
                'bio' => 'Coordinates 24/7 client delivery pipelines across North America and Europe, guaranteeing strict SLA adherence for high-volume enterprise batches.',
                'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
                'social_links' => ['linkedin' => 'https://linkedin.com'],
                'featured' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($members as $member) {
            TeamMember::firstOrCreate(['slug' => $member['slug']], $member);
        }
    }
}
