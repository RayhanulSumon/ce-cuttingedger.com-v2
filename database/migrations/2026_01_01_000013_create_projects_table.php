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
        Schema::create('projects', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('h1_title')->nullable();
            $table->string('slug')->unique();
            $table->string('client_name');
            $table->string('year')->default('2026');
            $table->text('summary');
            $table->text('client_challenge')->nullable();
            $table->text('work_done')->nullable();
            $table->text('measurable_result')->nullable();
            $table->longText('description')->nullable();
            $table->string('cover_image');
            $table->json('gallery')->nullable();
            $table->json('before_after_images')->nullable();
            $table->json('deliverables')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('is_concept')->default(false);
            $table->integer('sort_order')->default(0);
            $table->json('metrics')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->boolean('is_noindex')->default(false);
            $table->string('og_image')->nullable();
            $table->string('live_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
