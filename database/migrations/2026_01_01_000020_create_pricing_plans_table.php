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
        Schema::create('pricing_plans', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('badge')->nullable()->default('Credit Pack');
            $table->string('headline');
            $table->unsignedInteger('base_credits')->default(500);
            $table->unsignedInteger('bonus_credits')->default(0);
            $table->decimal('price_amount', 10, 2)->default(250.00);
            $table->unsignedInteger('validity_days')->default(90);
            $table->string('stripe_product_id', 120)->nullable();
            $table->string('stripe_price_id', 120)->nullable();
            $table->string('price');
            $table->string('billing_cycle')->default('per sprint');
            $table->json('features')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->string('cta_text')->default('Initiate Sprint');
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};
