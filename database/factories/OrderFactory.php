<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(5, 100);
        $unitPrice = 0.85;

        return [
            'order_number' => 'CE-ORD-'.strtoupper(fake()->bothify('??####')),
            'client_name' => fake()->name(),
            'client_email' => fake()->safeEmail(),
            'client_phone' => fake()->phoneNumber(),
            'service_name' => 'Clipping Path / Background Removal',
            'service_slug' => 'background-removal',
            'complexity' => fake()->randomElement(['simple', 'medium', 'complex']),
            'quantity' => $quantity,
            'uploaded_count' => $quantity,
            'unit_price' => $unitPrice,
            'discount_percent' => 10,
            'total_price' => round($quantity * $unitPrice * 0.9, 2),
            'currency' => 'USD',
            'turnaround' => '24h Standard',
            'images' => [
                'https://cuttingedger.test/storage/chat_uploads/sample1.jpg',
                'https://cuttingedger.test/storage/chat_uploads/sample2.jpg',
            ],
            'instructions' => 'Retouch with clean white background and drop shadow.',
            'status' => fake()->randomElement(['pending', 'in_production', 'completed']),
            'payment_status' => 'unpaid',
            'source' => 'chat',
        ];
    }
}
