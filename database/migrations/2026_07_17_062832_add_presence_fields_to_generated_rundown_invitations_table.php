<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('generated_rundown_invitations', function (Blueprint $table) {
            // status: 'belum_hadir', 'hadir', 'tidak_hadir'
            $table->string('status', 20)->default('belum_hadir')->after('honorific_id');
            $table->string('presence_photo')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('generated_rundown_invitations', function (Blueprint $table) {
            $table->dropColumn(['status', 'presence_photo']);
        });
    }
};