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
        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('is_concept')->default(false)->after('featured');
            $table->string('h1_title')->nullable()->after('title');
            $table->string('canonical_url')->nullable()->after('meta_description');
            $table->boolean('is_noindex')->default(false)->after('canonical_url');
            $table->string('og_image')->nullable()->after('is_noindex');
            $table->json('before_after_images')->nullable()->after('gallery');
            $table->text('client_challenge')->nullable()->after('summary');
            $table->text('work_done')->nullable()->after('client_challenge');
            $table->text('measurable_result')->nullable()->after('work_done');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'is_concept',
                'h1_title',
                'canonical_url',
                'is_noindex',
                'og_image',
                'before_after_images',
                'client_challenge',
                'work_done',
                'measurable_result',
            ]);
        });
    }
};
