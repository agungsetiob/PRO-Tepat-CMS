<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GeneratedRundown;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RundownAnalyticsCmsController extends Controller
{
    public function index()
    {
        // 1. Data Ringkasan Statistik (Cards)
        $totalRundown = GeneratedRundown::count();
        $totalAcaraBulanIni = GeneratedRundown::whereMonth('date', date('m'))->whereYear('date', date('Y'))->count();
        
        // 2. Analitik Top 3 Lokasi Terbanyak
        $topLocations = GeneratedRundown::select('location', DB::raw('count(*) as total'))
            ->groupBy('location')
            ->orderBy('total', 'desc')
            ->limit(3)
            ->get();

        // 3. Analitik Top 3 Pelaksana/PJ Teraktif
        $topPics = GeneratedRundown::select('pic', DB::raw('count(*) as total'))
            ->whereNotNull('pic')
            ->groupBy('pic')
            ->orderBy('total', 'desc')
            ->limit(3)
            ->get();

        // 4. Riwayat Daftar Rundown (Daftar Utama)
        // Kita eager load jumlah items_count untuk mengetahui berapa baris urutan acara di dalamnya
        $rundowns = GeneratedRundown::withCount('items')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/RundownAnalytics/Index', [
            'stats' => [
                'total_rundown' => $totalRundown,
                'total_this_month' => $totalAcaraBulanIni,
                'top_locations' => $topLocations,
                'top_pics' => $topPics
            ],
            'rundowns' => $rundowns
        ]);
    }

    public function destroy($id)
    {
        $rundown = GeneratedRundown::findOrFail($id);
        $rundown->delete(); // Otomatis menghapus detail items karena cascade migration

        return redirect()->back()->with('success', 'Rekam jejak rundown berhasil dihapus dari CMS.');
    }
}