<?php

namespace Database\Factories;

use App\Models\CreditPurchase;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CreditPurchase>
 */
class CreditPurchaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $baseCredits = 500;
        $bonusCredits = 0;
        $totalCredits = $baseCredits + $bonusCredits;
        $amountUsd = 250.00;

        return [
            'user_id' => User::factory(),
            'pricing_plan_id' => null,
            'plan_name' => 'Starter Credit Pack',
            'billing_type' => 'one_time',
            'base_credits' => $baseCredits,
            'bonus_credits' => $bonusCredits,
            'total_credits' => $totalCredits,
            'amount_usd' => $amountUsd,
            'currency' => 'USD',
            'effective_rate_per_credit' => round($amountUsd / $totalCredits, 4),
            'validity_days' => 90,
            'features_snapshot' => ['Valid for 90 days from activation'],
            'payment_provider' => 'manual',
            'payment_status' => 'unpaid',
            'status' => 'pending',
            'credits_activated' => false,
        ];
    }
}
