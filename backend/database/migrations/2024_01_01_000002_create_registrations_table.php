<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->string('training_type');
            $table->string('section');
            $table->string('last_name');
            $table->string('first_name');
            $table->string('gender', 50);
            $table->string('email');
            $table->string('country_code', 10);
            $table->string('phone', 30);
            $table->string('birth_place');
            $table->date('birth_date');
            $table->string('education');
            $table->string('region');
            $table->string('city');
            $table->text('address');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
