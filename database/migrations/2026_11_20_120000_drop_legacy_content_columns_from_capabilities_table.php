<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columnsToDrop = array_values(array_filter(
            ['description', 'features', 'deliverables', 'process_steps', 'faqs'],
            fn (string $column) => Schema::hasColumn('capabilities', $column)
        ));

        if ($columnsToDrop !== []) {
            Schema::table('capabilities', function (Blueprint $table) use ($columnsToDrop): void {
                $table->dropColumn($columnsToDrop);
            });
        }
    }

    public function down(): void
    {
        Schema::table('capabilities', function (Blueprint $table): void {
            if (! Schema::hasColumn('capabilities', 'description')) {
                $table->text('description')->nullable();
            }
            if (! Schema::hasColumn('capabilities', 'features')) {
                $table->json('features')->nullable();
            }
            if (! Schema::hasColumn('capabilities', 'deliverables')) {
                $table->json('deliverables')->nullable();
            }
            if (! Schema::hasColumn('capabilities', 'process_steps')) {
                $table->json('process_steps')->nullable();
            }
            if (! Schema::hasColumn('capabilities', 'faqs')) {
                $table->json('faqs')->nullable();
            }
        });
    }
};
