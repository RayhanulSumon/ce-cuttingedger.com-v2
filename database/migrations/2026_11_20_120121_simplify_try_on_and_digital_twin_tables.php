<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Remove unused columns from try_on_looks and digital_twins,
     * and add private raw ZIP package metadata columns on digital_twins.
     */
    public function up(): void
    {
        if (Schema::hasColumn('try_on_looks', 'description')) {
            Schema::table('try_on_looks', function (Blueprint $table): void {
                $table->dropColumn('description');
            });
        }

        Schema::table('digital_twins', function (Blueprint $table): void {
            $dropColumns = array_values(array_filter(
                ['collection', 'deliverables', 'featured_pieces'],
                fn (string $column): bool => Schema::hasColumn('digital_twins', $column),
            ));

            if ($dropColumns !== []) {
                $table->dropColumn($dropColumns);
            }

            if (! Schema::hasColumn('digital_twins', 'source_zip_path')) {
                $table->string('source_zip_path', 1000)->nullable()->after('hi_res_image');
            }
            if (! Schema::hasColumn('digital_twins', 'source_zip_name')) {
                $table->string('source_zip_name')->nullable()->after('source_zip_path');
            }
            if (! Schema::hasColumn('digital_twins', 'source_zip_size')) {
                $table->unsignedBigInteger('source_zip_size')->nullable()->after('source_zip_name');
            }
        });
    }

    /**
     * Reverse the schema simplification and private ZIP package additions.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('try_on_looks', 'description')) {
            Schema::table('try_on_looks', function (Blueprint $table): void {
                $table->string('description')->nullable()->after('slug');
            });
        }

        Schema::table('digital_twins', function (Blueprint $table): void {
            $dropZip = array_values(array_filter(
                ['source_zip_path', 'source_zip_name', 'source_zip_size'],
                fn (string $column): bool => Schema::hasColumn('digital_twins', $column),
            ));

            if ($dropZip !== []) {
                $table->dropColumn($dropZip);
            }

            if (! Schema::hasColumn('digital_twins', 'collection')) {
                $table->string('collection')->nullable()->after('archetype');
            }
            if (! Schema::hasColumn('digital_twins', 'deliverables')) {
                $table->json('deliverables')->nullable()->after('listed_at');
            }
            if (! Schema::hasColumn('digital_twins', 'featured_pieces')) {
                $table->json('featured_pieces')->nullable()->after('deliverables');
            }
        });
    }
};
