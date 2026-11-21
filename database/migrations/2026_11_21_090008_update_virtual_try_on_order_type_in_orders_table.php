<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('orders')
            ->where('order_type', 'virtual_try_on_quote')
            ->update(['order_type' => 'virtual_try_on_order']);

        DB::table('orders')
            ->where('source', 'virtual_try_on_quote')
            ->update(['source' => 'virtual_try_on_order']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('orders')
            ->where('order_type', 'virtual_try_on_order')
            ->update(['order_type' => 'virtual_try_on_quote']);

        DB::table('orders')
            ->where('source', 'virtual_try_on_order')
            ->update(['source' => 'virtual_try_on_quote']);
    }
};
