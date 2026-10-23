<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'name' => 'Pet Supplies Plus',
                'url' => 'https://www.petsuppliesplus.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/PetSupply.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/PetSupply.webp',
                'marquee_row' => 1,
                'sort_order' => 1,
            ],
            [
                'name' => 'Melie Bianco',
                'url' => 'https://www.meliebianco.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/Meiliebianco.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/Meiliebianco.webp',
                'marquee_row' => 1,
                'sort_order' => 2,
            ],
            [
                'name' => 'Haglöfs',
                'url' => 'https://www.haglofs.com/en',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/Haglofs.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/Haglofs.webp',
                'marquee_row' => 1,
                'sort_order' => 3,
            ],
            [
                'name' => 'Kenny Pools',
                'url' => 'http://www.kennypools.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/Kenny.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/Kenny.webp',
                'marquee_row' => 1,
                'sort_order' => 4,
            ],
            [
                'name' => 'G3 Studios',
                'url' => 'https://g3studios.net/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/G3Norbert.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/G3Norbert.webp',
                'marquee_row' => 1,
                'sort_order' => 5,
            ],
            [
                'name' => 'Felgenoutlet',
                'url' => 'https://www.felgenoutlet.com/en/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/logo_fo-300x300.png',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/logo_fo-300x300.png',
                'marquee_row' => 1,
                'sort_order' => 6,
            ],
            [
                'name' => 'Drykorn',
                'url' => 'https://drykorn.com/en-int/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/Drykorn.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/Drykorn.webp',
                'marquee_row' => 2,
                'sort_order' => 7,
            ],
            [
                'name' => 'Naked Cashmere',
                'url' => 'https://www.nakedcashmere.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/logo-nc-300x300.png',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/logo-nc-300x300.png',
                'marquee_row' => 2,
                'sort_order' => 8,
            ],
            [
                'name' => 'Bambini Fashion',
                'url' => 'https://bambinifashion.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/BambiniFashion.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/BambiniFashion.webp',
                'marquee_row' => 2,
                'sort_order' => 9,
            ],
            [
                'name' => 'aCommerce',
                'url' => 'https://www.acommerce.asia/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/aCommerce.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/aCommerce.webp',
                'marquee_row' => 2,
                'sort_order' => 10,
            ],
            [
                'name' => 'Batik Boutique',
                'url' => 'https://global.batikboutique.com/en-int',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/bb-logo-300x300.png',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/bb-logo-300x300.png',
                'marquee_row' => 2,
                'sort_order' => 11,
            ],
            [
                'name' => 'D1 Milano',
                'url' => 'https://d1milano.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/logo-shopmilano-300x300.png',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/logo-shopmilano-300x300.png',
                'marquee_row' => 2,
                'sort_order' => 12,
            ],
        ];

        foreach ($clients as $clientData) {
            Client::firstOrCreate(['name' => $clientData['name']], $clientData);
        }
    }
}
