<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProtocolPin;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProtocolPinController extends Controller
{
    public function index()
    {
        $pins = ProtocolPin::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/ProtocolPin/Index', [
            'pins' => $pins
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pin' => 'required|string|size:6|unique:protocol_pins,pin|regex:/^[0-9]+$/',
            'label' => 'required|string|max:255'
        ], [
            'pin.regex' => 'PIN harus berupa angka penuh.',
            'pin.unique' => 'PIN ini sudah terdaftar sebelumnya.'
        ]);

        ProtocolPin::create([
            'pin' => $request->pin,
            'label' => $request->label,
            'is_active' => true
        ]);

        return redirect()->back()->with('message', 'PIN Otorisasi Protokol baru berhasil diterbitkan.');
    }

    public function update(Request $request, $id)
    {
        $pinModel = ProtocolPin::findOrFail($id);

        $request->validate([
            'pin' => 'required|string|size:6|regex:/^[0-9]+$/|unique:protocol_pins,pin,' . $id,
            'label' => 'required|string|max:255'
        ]);

        $pinModel->update([
            'pin' => $request->pin,
            'label' => $request->label,
            'is_active' => $request->has('is_active') ? $request->is_active : $pinModel->is_active
        ]);

        return redirect()->back()->with('message', 'Data PIN berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $pinModel = ProtocolPin::findOrFail($id);
        $pinModel->delete();

        return redirect()->back()->with('message', 'PIN berhasil dihapus secara permanen dari server.');
    }
}