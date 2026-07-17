<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('protocol_pins', function (Blueprint $table) {
            $table->id();
            $table->string('pin', 6)->unique();
            $table->string('label')->placeholder('Contoh: Kantor Bupati, RSUD, dll');
            $table->boolean('is_active')->default(true); // Untuk aktif/nonaktifkan PIN instan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('protocol_pins');
    }
};