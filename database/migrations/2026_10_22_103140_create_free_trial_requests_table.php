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
        Schema::create('free_trial_requests', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('chat_session_id')->nullable()->constrained('chat_sessions')->nullOnDelete();
            $table->string('name')->default('Guest Client');
            $table->string('email')->index();
            $table->string('phone')->nullable();
            $table->json('images')->nullable();
            $table->unsignedTinyInteger('images_count')->default(1);
            $table->string('service')->default('background-removal');
            $table->text('instructions')->nullable();
            $table->string('status')->default('pending')->index(); // pending, in_production, completed, rejected
            $table->text('admin_notes')->nullable();
            $table->json('completed_files')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('free_trial_requests');
    }
};
