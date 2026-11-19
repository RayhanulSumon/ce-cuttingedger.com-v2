<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('credit_purchases', function (Blueprint $table): void {
            $table->id();
            $table->string('reference_number', 40)->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pricing_plan_id')->nullable()->constrained('pricing_plans')->nullOnDelete();

            // Immutable checkout snapshot
            $table->string('plan_name', 160);
            $table->string('billing_type', 30)->default('one_time'); // one_time, monthly
            $table->unsignedInteger('base_credits');
            $table->unsignedInteger('bonus_credits')->default(0);
            $table->unsignedInteger('total_credits');
            $table->decimal('amount_usd', 10, 2);
            $table->string('currency', 10)->default('USD');
            $table->decimal('effective_rate_per_credit', 8, 4)->default(0);
            $table->unsignedInteger('validity_days')->default(90);
            $table->json('features_snapshot')->nullable();

            // Payment & lifecycle state
            $table->string('payment_provider', 30)->default('manual'); // manual, stripe
            $table->string('payment_status', 30)->default('unpaid'); // unpaid, invoice_sent, paid, failed, refunded
            $table->string('status', 30)->default('pending'); // pending, active, expired, cancelled, refunded

            // Stripe-ready billing identifiers
            $table->string('stripe_customer_id', 120)->nullable()->index();
            $table->string('stripe_checkout_session_id', 191)->nullable()->unique();
            $table->string('stripe_payment_intent_id', 120)->nullable()->index();
            $table->string('stripe_subscription_id', 120)->nullable()->index();
            $table->string('stripe_invoice_id', 120)->nullable()->index();
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();

            // Activation & audit trail
            $table->boolean('credits_activated')->default(false);
            $table->timestamp('activated_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();

            // Notes & metadata
            $table->text('client_notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'payment_status']);
            $table->index(['billing_type', 'status']);
        });

        if (! Schema::hasColumn('users', 'stripe_customer_id')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->string('stripe_customer_id', 120)->nullable()->index()->after('credits_expires_at');
            });
        }

        if (! Schema::hasColumn('pricing_plans', 'stripe_product_id')) {
            Schema::table('pricing_plans', function (Blueprint $table): void {
                $table->string('stripe_product_id', 120)->nullable()->after('validity_days');
                $table->string('stripe_price_id', 120)->nullable()->after('stripe_product_id');
            });
        }

        if (Schema::hasTable('orders')) {
            $creditPlanOrders = DB::table('orders')
                ->where('order_type', 'credit_plan')
                ->orderBy('id')
                ->get();

            foreach ($creditPlanOrders as $order) {
                $specs = json_decode((string) ($order->specifications ?? '{}'), true);
                if (! is_array($specs)) {
                    $specs = [];
                }

                $userId = $order->user_id ?: DB::table('users')
                    ->whereRaw('LOWER(email) = ?', [strtolower((string) $order->client_email)])
                    ->value('id');

                if (! $userId) {
                    continue;
                }

                $baseCredits = (int) ($specs['base_credits'] ?? $order->quantity ?? 0);
                $bonusCredits = (int) ($specs['bonus_credits'] ?? 0);
                $totalCredits = max(1, (int) ($specs['total_credits'] ?? ($baseCredits + $bonusCredits)));
                $amountUsd = (float) ($specs['total_price'] ?? $order->total_price ?? 0);
                $billingType = ((string) ($specs['billing_type'] ?? $order->complexity ?? 'one_time')) === 'monthly' ? 'monthly' : 'one_time';
                $validityDays = max(1, (int) ($specs['validity_days'] ?? ($billingType === 'monthly' ? 30 : 90)));
                $isActivated = ! empty($specs['credits_activated']);

                $status = match (true) {
                    $order->status === 'cancelled' => 'cancelled',
                    $isActivated || $order->status === 'completed' || $order->payment_status === 'paid' => 'active',
                    default => 'pending',
                };

                $reference = (string) ($order->order_number ?: ($billingType === 'monthly' ? 'CE-SUB-' : 'CE-CRD-').strtoupper(Str::random(6)));
                if (DB::table('credit_purchases')->where('reference_number', $reference)->exists()) {
                    $reference = ($billingType === 'monthly' ? 'CE-SUB-' : 'CE-CRD-').strtoupper(Str::random(6));
                }

                $activatedAt = ! empty($specs['activated_at']) ? Carbon::parse((string) $specs['activated_at']) : null;
                $expiresAt = ! empty($specs['expires_at']) ? Carbon::parse((string) $specs['expires_at']) : null;

                DB::table('credit_purchases')->insert([
                    'reference_number' => $reference,
                    'user_id' => $userId,
                    'pricing_plan_id' => null,
                    'plan_name' => (string) ($specs['plan_name'] ?? $order->service_name ?? 'Studio Credit Plan'),
                    'billing_type' => $billingType,
                    'base_credits' => $baseCredits,
                    'bonus_credits' => $bonusCredits,
                    'total_credits' => $totalCredits,
                    'amount_usd' => $amountUsd,
                    'currency' => (string) ($order->currency ?? 'USD'),
                    'effective_rate_per_credit' => (float) ($specs['effective_rate_per_credit'] ?? round($amountUsd / $totalCredits, 4)),
                    'validity_days' => $validityDays,
                    'features_snapshot' => json_encode($specs['features_snapshot'] ?? []),
                    'payment_provider' => 'manual',
                    'payment_status' => (string) ($order->payment_status ?? 'unpaid'),
                    'status' => $status,
                    'credits_activated' => $isActivated,
                    'activated_at' => $activatedAt,
                    'expires_at' => $expiresAt,
                    'approved_by' => null,
                    'client_notes' => $order->instructions,
                    'admin_notes' => $order->admin_notes,
                    'metadata' => json_encode([
                        'migrated_from_order_id' => $order->id,
                        'snapshot_captured_at' => $specs['snapshot_captured_at'] ?? null,
                        'ip_address' => $order->ip_address,
                    ]),
                    'created_at' => $order->created_at ?? now(),
                    'updated_at' => $order->updated_at ?? now(),
                ]);

                DB::table('orders')->where('id', $order->id)->delete();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_purchases');

        if (Schema::hasColumn('users', 'stripe_customer_id')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->dropIndex(['stripe_customer_id']);
                $table->dropColumn('stripe_customer_id');
            });
        }

        if (Schema::hasColumn('pricing_plans', 'stripe_product_id')) {
            Schema::table('pricing_plans', function (Blueprint $table): void {
                $table->dropColumn(['stripe_product_id', 'stripe_price_id']);
            });
        }
    }
};
