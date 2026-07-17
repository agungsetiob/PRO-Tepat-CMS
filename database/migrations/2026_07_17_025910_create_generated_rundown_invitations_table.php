<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generated_rundown_invitations', function (Blueprint $table) {
            $table->id();
            // Relasi ke induk rundown
            $table->foreignId('generated_rundown_id')
                  ->constrained('generated_rundowns')
                  ->onDelete('cascade');
            
            // Relasi ke master honorifics
            $table->foreignId('honorific_id')
                  ->constrained('honorifics')
                  ->onDelete('restrict');
            
            $table->integer('sort_order');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generated_rundown_invitations');
    }
};