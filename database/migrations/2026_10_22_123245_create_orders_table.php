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
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('order_type')->default('custom_order')->index(); // digital_twin_custom, digital_twin_preset, digital_twin_lifetime, virtual_try_on_quote, capability_quote, free_trial
            $table->foreignId('digital_twin_id')->nullable()->constrained('digital_twins')->nullOnDelete();
            $table->foreignId('try_on_look_id')->nullable()->constrained('try_on_looks')->nullOnDelete();
            $table->uuid('chat_session_id')->nullable()->index();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('client_name');
            $table->string('client_email')->index();
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
            $table->string('client_phone')->nullable();
            $table->string('ip_address', 45)->nullable()->index();
            $table->string('service_name');
            $table->string('service_slug');
            $table->string('complexity')->default('simple');
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedInteger('uploaded_count')->default(0);
            $table->decimal('unit_price', 8, 2)->default(0.00);
            $table->unsignedInteger('discount_percent')->default(0);
            $table->decimal('total_price', 10, 2)->default(0.00);
            $table->string('currency', 10)->default('USD');
            $table->string('turnaround')->default('24h Standard');
            $table->json('images')->nullable();
            $table->json('specifications')->nullable();
            $table->json('completed_files')->nullable();
            $table->string('cloud_link', 1000)->nullable();
            $table->text('instructions')->nullable();
            $table->text('admin_notes')->nullable();
            $table->string('status')->default('pending')->index();
            $table->string('payment_status')->default('unpaid')->index();
            $table->string('source')->default('web_order');
            $table->timestamps();

            $table->foreign('chat_session_id')->references('id')->on('chat_sessions')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
