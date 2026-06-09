<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Protokol',
            'email' => 'admin@protokol.test',
            'password' => Hash::make(env('ADMIN_PASS')),
            'email_verified_at' => now(),
        ]);
    }
}