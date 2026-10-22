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
        Schema::create('chat_sessions', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('lead_name')->nullable();
            $table->string('lead_email')->nullable();
            $table->string('lead_phone')->nullable();
            $table->string('company')->nullable();
            $table->string('service_interest')->nullable();
            $table->string('complexity_level')->nullable();
            $table->decimal('estimated_price', 10, 2)->nullable();
            $table->string('status')->default('active'); // active, idle, converted, abandoned
            $table->timestamp('last_active_at')->nullable();
            $table->timestamp('follow_up_sent_at')->nullable();
            $table->unsignedInteger('follow_up_count')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_sessions');
    }
};
