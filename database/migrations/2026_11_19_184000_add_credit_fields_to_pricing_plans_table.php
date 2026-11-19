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
        Schema::table('pricing_plans', function (Blueprint $table): void {
            $table->string('badge')->nullable()->default('Credit Pack')->after('slug');
            $table->unsignedInteger('base_credits')->default(500)->after('headline');
            $table->unsignedInteger('bonus_credits')->default(0)->after('base_credits');
            $table->decimal('price_amount', 10, 2)->default(250.00)->after('bonus_credits');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pricing_plans', function (Blueprint $table): void {
            $table->dropColumn(['badge', 'base_credits', 'bonus_credits', 'price_amount']);
        });
    }
};
