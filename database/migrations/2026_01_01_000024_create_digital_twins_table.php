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
        Schema::create('digital_twins', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedInteger('look_number')->default(1);
            $table->string('archetype');
            $table->string('collection')->nullable();
            $table->text('description');
            $table->string('runway_image', 1000)->nullable();
            $table->string('hi_res_image', 1000)->nullable();
            $table->unsignedInteger('sprite_x0')->nullable();
            $table->unsignedInteger('sprite_x1')->nullable();
            $table->decimal('aspect_ratio', 6, 4)->default(0.3500);
            $table->string('preset_price')->default('$149');
            $table->string('custom_order_price')->default('$290');
            $table->string('lifetime_price')->default('$490');
            $table->boolean('is_copyright_sold')->default(false)->index();
            $table->unsignedInteger('download_count')->default(0);
            $table->date('listed_at')->nullable();
            $table->json('deliverables')->nullable();
            $table->json('featured_pieces')->nullable();
            $table->json('poses')->nullable();
            $table->boolean('is_featured_on_home')->default(true)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('digital_twin_attributes', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('input_type')->default('select'); // unit_input, select, multi_input
            $table->json('options');
            $table->boolean('allow_custom')->default(false);
            $table->string('custom_label')->nullable();
            $table->string('placeholder')->nullable();
            $table->boolean('is_required')->default(false);
            $table->boolean('is_active')->default(true)->index();
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('digital_twin_attributes');
        Schema::dropIfExists('digital_twins');
    }
};
