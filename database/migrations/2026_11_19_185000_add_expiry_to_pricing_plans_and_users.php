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
            $table->unsignedInteger('validity_days')->default(90)->after('price_amount');
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->timestamp('credits_expires_at')->nullable()->after('active_plan_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pricing_plans', function (Blueprint $table): void {
            $table->dropColumn('validity_days');
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('credits_expires_at');
        });
    }
};
