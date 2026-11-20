<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_purchases');
    }
};
