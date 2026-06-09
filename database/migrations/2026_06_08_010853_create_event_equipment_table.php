<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('event_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scenario_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // Podium, Soundsystem【123946686323259805845†L15-L17】
            $table->enum('category', ['kelengkapan', 'perlengkapan'])->default('perlengkapan'); //【123946686323259805845†L14-L14】
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('event_equipments'); }
};