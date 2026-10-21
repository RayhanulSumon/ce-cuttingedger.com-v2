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
        Schema::create('services', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('marquee_label');
            $table->string('subtitle');
            $table->text('description');
            $table->json('features')->nullable();
            $table->json('deliverables')->nullable();
            $table->string('icon')->default('Layers');
            $table->integer('sort_order')->default(0);
            $table->string('accent_color')->nullable()->default('#d4ff00');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
