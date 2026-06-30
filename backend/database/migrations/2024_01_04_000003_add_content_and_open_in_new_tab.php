<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cms_hero_slides', function (Blueprint $table) {
            $table->json('content')->nullable()->after('alt');
        });

        Schema::table('cms_nav_items', function (Blueprint $table) {
            $table->boolean('open_in_new_tab')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('cms_hero_slides', function (Blueprint $table) {
            $table->dropColumn('content');
        });

        Schema::table('cms_nav_items', function (Blueprint $table) {
            $table->dropColumn('open_in_new_tab');
        });
    }
};
