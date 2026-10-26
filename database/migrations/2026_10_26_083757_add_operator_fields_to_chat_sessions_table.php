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
        Schema::table('chat_sessions', function (Blueprint $table): void {
            $table->string('mode', 20)->default('bot')->after('status'); // 'bot', 'operator'
            $table->boolean('needs_human')->default(false)->after('mode');
            $table->foreignId('operator_id')->nullable()->constrained('users')->nullOnDelete()->after('needs_human');
            $table->string('operator_name')->nullable()->after('operator_id');
            $table->timestamp('operator_joined_at')->nullable()->after('operator_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_sessions', function (Blueprint $table): void {
            $table->dropForeign(['operator_id']);
            $table->dropColumn(['mode', 'needs_human', 'operator_id', 'operator_name', 'operator_joined_at']);
        });
    }
};
