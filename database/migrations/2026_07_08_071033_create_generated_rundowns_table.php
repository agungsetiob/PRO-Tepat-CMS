<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generated_rundowns', function (Blueprint $table) {
            $table->id();
            $table->string('event_name'); // Nama Acara, contoh: "Peresmian Gedung Dialisis"
            $table->date('date');         // Tanggal Acara, contoh: "2026-06-01"
            $table->string('time_info');   // Keterangan waktu umum, contoh: "10.00 WITA s.d. Selesai"
            $table->string('location');    // Lokasi Tempat, contoh: "RSUD dr. H. Andi Abdurrahman Noor"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generated_rundowns');
    }
};