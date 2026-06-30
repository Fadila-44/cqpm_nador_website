<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_gallery_items', function (Blueprint $table) {
            $table->id();
            $table->string('category')->default('Formation');
            $table->string('image_path');
            $table->json('title');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_wide')->default(false);
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_gallery_items');
    }
};
