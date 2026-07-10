<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GeneratedRundown;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RundownAnalyticsController extends Controller
{
    public function index()
    {
        $totalRundown = GeneratedRundown::count();
        $totalAcaraBulanIni = GeneratedRundown::whereMonth('date', date('m'))->whereYear('date', date('Y'))->count();
        
        $topLocations = GeneratedRundown::select('location', DB::raw('count(*) as total'))
            ->groupBy('location')
            ->orderBy('total', 'desc')
            ->limit(3)
            ->get();

        $topPics = GeneratedRundown::select('pic', DB::raw('count(*) as total'))
            ->whereNotNull('pic')
            ->groupBy('pic')
            ->orderBy('total', 'desc')
            ->limit(3)
            ->get();

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
        $rundown->delete();

        return redirect()->back()->with('success', 'Rekam jejak rundown berhasil dihapus dari CMS.');
    }
}