<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('generated_rundowns', function (Blueprint $table) {
            // Menambahkan kolom pic setelah kolom location
            $table->string('pic')->nullable()->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('generated_rundowns', function (Blueprint $table) {
            $table->dropColumn('pic');
        });
    }
};