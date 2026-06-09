<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('honorifics', function (Blueprint $table) {
            $table->id();
            $table->string('jabatan'); // Presiden, Gubernur, Bupati
            $table->string('sapaan_resmi'); // Yang Mulia, Yang Terhormat
            $table->string('sapaan_lisan')->nullable(); // Bapak/Ibu
            $table->text('perlakuan_khusus')->nullable(); // pengawalan, ruang transit
            $table->integer('tingkat'); // 1=Presiden, untuk sorting
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('honorifics'); }
};