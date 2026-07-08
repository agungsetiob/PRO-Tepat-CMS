<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generated_rundown_items', function (Blueprint $table) {
            $table->id();
            // Relasi asing ke tabel induk rundown, jika induk dihapus, item ikut terhapus (cascade)
            $table->foreignId('generated_rundown_id')
                  ->constrained('generated_rundowns')
                  ->onDelete('cascade');
            
            // Relasi asing ke master pilihan kegiatan
            $table->foreignId('master_agenda_id')
                  ->constrained('master_agendas')
                  ->onDelete('restrict'); // Mencegah master dihapus jika sedang dipakai di rundown
            
            $table->string('start_time', 5); // Jam mulai, contoh: "10.00"
            $table->string('end_time', 5);   // Jam selesai, contoh: "10.05"
            $table->integer('sort_order');   // Menyimpan nomor urut baris (Baris 1, 2, 3, dst)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generated_rundown_items');
    }
};