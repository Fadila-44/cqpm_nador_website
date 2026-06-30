<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_visits', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_hash', 64);
            $table->date('visit_date');
            $table->timestamps();

            $table->unique(['visitor_hash', 'visit_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_visits');
    }
};
