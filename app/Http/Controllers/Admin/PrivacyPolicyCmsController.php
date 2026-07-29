<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrivacyPolicy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrivacyPolicyCmsController extends Controller
{
    public function index()
    {
        // Ambil data pertama, jika belum ada buat instance kosong
        $policy = PrivacyPolicy::first();

        return Inertia::render('Admin/PrivacyPolicy/Index', [
            'policy' => $policy
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
        ], [
            'description.required' => 'Isi kebijakan privasi tidak boleh kosong.'
        ]);

        // Gunakan updateOrCreate agar otomatis membuat data baru jika baris belum pernah ada
        PrivacyPolicy::updateOrCreate(
            ['id' => 1],
            ['description' => $request->description]
        );

        return redirect()->back()->with('success', 'Kebijakan Privasi Aplikasi berhasil diperbarui.');
    }
}