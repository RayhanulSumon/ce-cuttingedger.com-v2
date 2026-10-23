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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('company')->nullable()->after('client_email');
            $table->string('role')->nullable()->after('company');
            $table->string('website')->nullable()->after('role');
            $table->string('monthly_volume')->nullable()->after('website');
            $table->string('platform')->nullable()->after('monthly_volume');
            $table->string('landing_page_url', 1000)->nullable()->after('platform');
            $table->string('submission_page_url', 1000)->nullable()->after('landing_page_url');
            $table->string('utm_source')->nullable()->after('submission_page_url');
            $table->string('utm_medium')->nullable()->after('utm_source');
            $table->string('utm_campaign')->nullable()->after('utm_medium');
            $table->string('utm_term')->nullable()->after('utm_campaign');
            $table->string('utm_content')->nullable()->after('utm_term');
            $table->string('click_id')->nullable()->after('utm_content');
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->string('role')->nullable()->after('company');
            $table->string('website')->nullable()->after('role');
            $table->string('monthly_volume')->nullable()->after('website');
            $table->string('platform')->nullable()->after('monthly_volume');
            $table->string('landing_page_url', 1000)->nullable()->after('platform');
            $table->string('submission_page_url', 1000)->nullable()->after('landing_page_url');
            $table->string('utm_source')->nullable()->after('submission_page_url');
            $table->string('utm_medium')->nullable()->after('utm_source');
            $table->string('utm_campaign')->nullable()->after('utm_medium');
            $table->string('utm_term')->nullable()->after('utm_campaign');
            $table->string('utm_content')->nullable()->after('utm_term');
            $table->string('click_id')->nullable()->after('utm_content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'company',
                'role',
                'website',
                'monthly_volume',
                'platform',
                'landing_page_url',
                'submission_page_url',
                'utm_source',
                'utm_medium',
                'utm_campaign',
                'utm_term',
                'utm_content',
                'click_id',
            ]);
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'website',
                'monthly_volume',
                'platform',
                'landing_page_url',
                'submission_page_url',
                'utm_source',
                'utm_medium',
                'utm_campaign',
                'utm_term',
                'utm_content',
                'click_id',
            ]);
        });
    }
};
