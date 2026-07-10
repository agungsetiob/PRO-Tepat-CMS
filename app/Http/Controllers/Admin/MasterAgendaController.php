<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasterAgenda;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterAgendaController extends Controller
{
    /**
     * Menampilkan halaman daftar master agenda via Inertia React
     */
    public function index()
    {
        $agendas = MasterAgenda::orderBy('order', 'asc')->paginate(10);
        
        return Inertia::render('Admin/MasterAgenda/Index', [
            'agendas' => $agendas
        ]);
    }

    /**
     * Menyimpan data master baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'required|integer|min:0'
        ]);

        MasterAgenda::create([
            'name' => $request->name,
            'order' => $request->order,
            'is_active' => true, // Default aktif untuk bank data
        ]);

        return redirect()->route('admin.master-agenda.index')
            ->with('success', 'Uraian kegiatan berhasil ditambahkan ke bank data.');
    }

    /**
     * Memperbarui data master agenda
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'required|integer|min:0'
        ]);

        $agenda = MasterAgenda::findOrFail($id);
        $agenda->update([
            'name' => $request->name,
            'order' => $request->order,
        ]);

        return redirect()->route('admin.master-agenda.index')
            ->with('success', 'Master agenda berhasil diperbarui.');
    }

    /**
     * Menghapus data master agenda
     */
    public function destroy($id)
    {
        try {
            $agenda = MasterAgenda::findOrFail($id);
            $agenda->delete();
            
            return redirect()->route('admin.master-agenda.index')
                ->with('success', 'Master agenda berhasil dihapus dari sistem.');
        } catch (\Exception $e) {
            return redirect()->route('admin.master-agenda.index')
                ->with('error', 'Gagal menghapus! Data ini terikat dengan susunan rundown yang ada.');
        }
    }
}