<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Honorific;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HonorificController extends Controller
{
    public function index()
    {
        $honorifics = Honorific::urutanProtokol()->get();
        
        return Inertia::render('Admin/Honorifics/Index', [
            'honorifics' => $honorifics
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jabatan' => 'required|string|max:255',
            'sapaan_resmi' => 'required|string|max:255',
            'sapaan_lisan' => 'nullable|string|max:255',
            'perlakuan_khusus' => 'nullable|string',
            'tingkat' => 'required|integer',
        ]);

        Honorific::create($validated);

        return redirect()->back()->with('message', 'Jabatan berhasil ditambahkan.');
    }

    public function update(Request $request, Honorific $honorific)
    {
        $validated = $request->validate([
            'jabatan' => 'required|string|max:255',
            'sapaan_resmi' => 'required|string|max:255',
            'sapaan_lisan' => 'nullable|string|max:255',
            'perlakuan_khusus' => 'nullable|string',
            'tingkat' => 'required|integer',
        ]);

        $honorific->update($validated);

        return redirect()->back()->with('message', 'Data jabatan berhasil diperbarui.');
    }

    public function destroy(Honorific $honorific)
    {
        $honorific->delete();

        return redirect()->back()->with('message', 'Jabatan berhasil dihapus.');
    }
}