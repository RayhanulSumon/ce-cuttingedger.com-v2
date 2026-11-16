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
        Schema::create('contact_messages', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 50)->nullable();
            $table->string('company')->nullable();
            $table->string('website')->nullable();
            $table->string('service_interest')->nullable();
            $table->text('message');
            $table->string('ip_address', 45)->nullable();
            $table->string('status')->default('new'); // new, read, replied, archived
            $table->string('inquiry_type')->default('general');
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('inquiry_type');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
