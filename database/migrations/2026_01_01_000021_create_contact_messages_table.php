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
            $table->string('company')->nullable();
            $table->string('role')->nullable();
            $table->string('website')->nullable();
            $table->string('monthly_volume')->nullable();
            $table->string('platform')->nullable();
            $table->string('landing_page_url', 1000)->nullable();
            $table->string('submission_page_url', 1000)->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_term')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('click_id')->nullable();
            $table->string('budget')->nullable();
            $table->string('service_interest')->nullable();
            $table->text('message');
            $table->string('ip_address')->nullable();
            $table->string('status')->default('new'); // new, read, replied, archived
            $table->string('inquiry_type')->default('general');
            $table->string('turnaround_time')->nullable();
            $table->string('output_format')->nullable();
            $table->json('attachments')->nullable();
            $table->timestamps();
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
