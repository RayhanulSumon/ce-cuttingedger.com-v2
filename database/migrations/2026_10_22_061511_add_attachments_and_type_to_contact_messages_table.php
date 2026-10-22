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
        Schema::table('contact_messages', function (Blueprint $table): void {
            $table->string('inquiry_type')->default('general')->after('status');
            $table->string('turnaround_time')->nullable()->after('inquiry_type');
            $table->string('output_format')->nullable()->after('turnaround_time');
            $table->json('attachments')->nullable()->after('output_format');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table): void {
            $table->dropColumn(['inquiry_type', 'turnaround_time', 'output_format', 'attachments']);
        });
    }
};
