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
        Schema::create('chat_consultations', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('chat_session_id')->nullable()->constrained('chat_sessions')->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->foreignId('service_id')->nullable()->constrained('services')->nullOnDelete();
            $table->dateTime('scheduled_at');
            $table->string('timezone')->default('UTC');
            $table->string('status')->default('confirmed'); // pending, confirmed, completed, cancelled
            $table->text('notes')->nullable();
            $table->string('external_calendar_event_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_consultations');
    }
};
