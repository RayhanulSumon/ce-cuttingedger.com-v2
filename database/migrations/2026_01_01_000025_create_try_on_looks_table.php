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
        Schema::create('try_on_looks', function (Blueprint $table): void {
            $table->id();
            $table->string('model_name');
            $table->string('slug')->unique();
            $table->string('runway_image', 1000);
            $table->string('hi_res_image', 1000);
            $table->json('pieces');
            $table->json('pins');
            $table->boolean('is_featured_on_home')->default(true);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'is_featured_on_home', 'sort_order']);
            $table->index(['is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('try_on_looks');
    }
};
