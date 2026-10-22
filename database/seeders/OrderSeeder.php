<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Order::create([
            'order_number' => 'CE-ORD-9281',
            'client_name' => 'Sarah Jenkins',
            'client_email' => 'sarah.jenkins@lumina-apparel.com',
            'client_phone' => '+1 (415) 890-2134',
            'service_name' => 'Ghost Mannequin Joint',
            'service_slug' => 'ghost-mannequin',
            'complexity' => 'medium',
            'quantity' => 50,
            'uploaded_count' => 50,
            'unit_price' => 1.45,
            'discount_percent' => 10,
            'total_price' => 65.25,
            'currency' => 'USD',
            'turnaround' => 'Sub-12 Hours SLA',
            'images' => [
                'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80',
            ],
            'instructions' => 'Clean symmetrical ghost mannequin joint with inner collar alignment. Export sRGB 2000x2000 transparent PNG.',
            'admin_notes' => 'Priority client. Assigned to studio crew 2.',
            'status' => 'in_production',
            'payment_status' => 'paid',
            'source' => 'chat',
        ]);

        Order::create([
            'order_number' => 'CE-ORD-4720',
            'client_name' => 'David Kim',
            'client_email' => 'david.kim@aurora-jewelry.co',
            'client_phone' => '+1 (212) 441-9980',
            'service_name' => 'Fine Jewelry Retouch',
            'service_slug' => 'jewelry-retouch',
            'complexity' => 'complex',
            'quantity' => 25,
            'uploaded_count' => 10,
            'unit_price' => 6.20,
            'discount_percent' => 10,
            'total_price' => 139.50,
            'currency' => 'USD',
            'turnaround' => '24h Standard',
            'images' => [
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
            ],
            'instructions' => 'Macro prong cleanup, metal reflection smoothing, and diamond sparkle enhancement.',
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'source' => 'chat',
        ]);

        Order::create([
            'order_number' => 'CE-ORD-1154',
            'client_name' => 'Marcus Vance',
            'client_email' => 'marcus@hypekicks.de',
            'client_phone' => '+49 30 901820',
            'service_name' => 'Clipping Path / Cutout',
            'service_slug' => 'background-removal',
            'complexity' => 'simple',
            'quantity' => 100,
            'uploaded_count' => 100,
            'unit_price' => 0.45,
            'discount_percent' => 20,
            'total_price' => 36.00,
            'currency' => 'USD',
            'turnaround' => '24h Standard',
            'images' => [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
            ],
            'instructions' => 'Hand-drawn vector clipping paths with 0.5px feather. White background output.',
            'status' => 'completed',
            'payment_status' => 'paid',
            'source' => 'chat',
        ]);

        Order::create([
            'order_number' => 'CE-TRL-1082',
            'client_name' => 'Elena Rostova',
            'client_email' => 'elena@nordic-wear.se',
            'client_phone' => '+46 8 123 4567',
            'ip_address' => '192.168.1.100',
            'service_name' => 'Background Removal & Clipping Path',
            'service_slug' => 'background-removal',
            'complexity' => 'trial',
            'quantity' => 2,
            'uploaded_count' => 2,
            'unit_price' => 0.00,
            'discount_percent' => 100,
            'total_price' => 0.00,
            'currency' => 'USD',
            'turnaround' => '24h Standard',
            'images' => [
                'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
            ],
            'instructions' => 'Free trial test batch: Remove background, output transparent PNG with soft shadow.',
            'status' => 'pending',
            'payment_status' => 'free_trial',
            'source' => 'web_trial',
        ]);
    }
}
