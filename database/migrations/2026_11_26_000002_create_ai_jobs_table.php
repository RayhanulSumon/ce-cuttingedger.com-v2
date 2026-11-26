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
        Schema::create('ai_jobs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider', 30)->default('fal');
            $table->string('service_type', 40); // bg_remove, try_on
            $table->string('provider_request_id', 191)->nullable()->index();
            $table->unsignedInteger('credits_charged');
            $table->string('status', 30)->default('queued'); // queued, processing, completed, failed
            $table->json('input_payload')->nullable();
            $table->json('output_urls')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'service_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_jobs');
    }
};
