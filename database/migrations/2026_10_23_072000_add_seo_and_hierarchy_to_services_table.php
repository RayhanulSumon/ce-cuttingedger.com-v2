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
        Schema::table('services', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('id')->constrained('services')->nullOnDelete();
            $table->string('h1_title')->nullable()->after('subtitle');
            $table->string('meta_title')->nullable()->after('accent_color');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->string('canonical_url')->nullable()->after('meta_description');
            $table->boolean('is_noindex')->default(false)->after('canonical_url');
            $table->string('og_image')->nullable()->after('is_noindex');
            $table->text('problem_statement')->nullable()->after('og_image');
            $table->text('solution_statement')->nullable()->after('problem_statement');
            $table->json('process_steps')->nullable()->after('solution_statement');
            $table->json('faqs')->nullable()->after('process_steps');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn([
                'parent_id',
                'h1_title',
                'meta_title',
                'meta_description',
                'canonical_url',
                'is_noindex',
                'og_image',
                'problem_statement',
                'solution_statement',
                'process_steps',
                'faqs',
            ]);
        });
    }
};
