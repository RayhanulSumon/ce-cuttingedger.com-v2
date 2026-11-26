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
        Schema::table('ai_jobs', function (Blueprint $table): void {
            $table->unsignedInteger('base_credits')->default(0)->after('provider_request_id');
            $table->decimal('markup_percent', 5, 2)->default(25.00)->after('base_credits');
            $table->decimal('provider_cost_usd', 10, 4)->default(0)->after('credits_charged');
            $table->decimal('billed_amount_usd', 10, 4)->default(0)->after('provider_cost_usd');
            $table->decimal('profit_usd', 10, 4)->default(0)->after('billed_amount_usd');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_jobs', function (Blueprint $table): void {
            $table->dropColumn([
                'base_credits',
                'markup_percent',
                'provider_cost_usd',
                'billed_amount_usd',
                'profit_usd',
            ]);
        });
    }
};
