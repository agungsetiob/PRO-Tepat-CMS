<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('event_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scenario_id')->constrained()->cascadeOnDelete();
            $table->string('section'); // Acara Persiapan, Acara Pokok, Acara Penutup【360500804963495877205†L9-L13】
            $table->string('item'); // Laporan Komandan Upacara【360500804963495877205†L19-L20】
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('event_checklists'); }
};