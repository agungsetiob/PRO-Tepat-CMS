<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('protocols', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scenario_id')->constrained()->cascadeOnDelete();
            $table->string('title'); // Pedoman Umum Tata Tempat
            $table->longText('content')->nullable(); // Isi UU + penjelasan
            $table->string('image_infographic')->nullable(); // Denah HD
            $table->json('references')->nullable(); // ["Pasal 13 UU No 9/2010"]
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('protocols'); }
};