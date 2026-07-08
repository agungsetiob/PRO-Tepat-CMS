<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_agendas', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Tempat menyimpan nama aktivitas, misal: "Foto Bersama"
            $table->integer('order')->default(0); // Untuk mengatur urutan tampil di dropdown mobile
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_agendas');
    }
};