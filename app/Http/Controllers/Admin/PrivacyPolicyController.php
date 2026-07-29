<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrivacyPolicy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrivacyPolicyController extends Controller
{
    public function index()
    {
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

        PrivacyPolicy::updateOrCreate(
            ['id' => 1],
            ['description' => $request->description]
        );

        return redirect()->back()->with('success', 'Kebijakan Privasi Aplikasi berhasil diperbarui.');
    }

    public function show()
    {
        $policy = PrivacyPolicy::first();

        return Inertia::render('PrivacyPolicy', [
            'description' => $policy ? $policy->description : '<p>Kebijakan privasi belum dikonfigurasi oleh administrator.</p>',
            'updated_at' => $policy ? $policy->updated_at->format('d M Y') : null,
        ]);
    }
}