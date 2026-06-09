<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('seating_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protocol_id')->constrained()->cascadeOnDelete();
            $table->string('position_label'); // 1,2,3,4 atau "Tengah"
            // Ubah dari $table->string('jabatan'); menjadi:
            $table->foreignId('honorific_id')->nullable()->constrained()->nullOnDelete();
            $table->text('note')->nullable(); // Genap: 4-2-1-3【321215424688596751721†L22-L23】
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('seating_rules');
    }
};