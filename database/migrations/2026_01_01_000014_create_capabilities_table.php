<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Capabilities are a two-level tree: a main capability (2D, 3D, DTP, Video) has many sub-capabilities.
     * There are deliberately no price columns; pricing is quoted per project.
     */
    public function up(): void
    {
        Schema::create('capabilities', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('capabilities')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('tag', 20)->nullable(); // short label for main capabilities, e.g. "2D"
            $table->string('subtitle');
            $table->text('description');
            $table->string('icon', 50)->default('Layers');
            $table->json('features')->nullable(); // ["Feature", ...]
            $table->json('deliverables')->nullable(); // ["Deliverable", ...]
            $table->json('process_steps')->nullable(); // [{"title": "", "description": ""}, ...]
            $table->json('faqs')->nullable(); // [{"question": "", "answer": ""}, ...]
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['parent_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capabilities');
    }
};
