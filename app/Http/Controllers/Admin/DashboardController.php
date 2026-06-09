<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Honorific;
use App\Models\Scenario;
use App\Models\Protocol;
use App\Models\EventChecklist;
use App\Models\EventEquipment;
use App\Models\Tag;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Statistik dasar
        $stats = [
            'categories' => Category::count(),
            'honorifics' => Honorific::count(),
            'scenarios' => Scenario::count(),
            'activeScenarios' => Scenario::where('is_active', true)->count(),
            'protocols' => Protocol::count(),
            'equipment' => EventEquipment::count(),
            'checklistItems' => EventChecklist::count(),
            'tags' => Tag::count(),
            'categoriesByType' => [
                'tempat' => Category::where('type', 'tempat')->count(),
                'acara' => Category::where('type', 'acara')->count(),
                'hormat' => Category::where('type', 'hormat')->count(),
            ]
        ];

        // Skenario terbaru
        $recentScenarios = Scenario::with('category')
            ->latest()
            ->take(5)
            ->get();

        // Data bulanan untuk chart (6 bulan terakhir)
        $monthlyData = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthName = $month->format('M');

            $monthlyData[] = [
                'month' => $monthName,
                'scenarios' => Scenario::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
                'protocols' => Protocol::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentScenarios' => $recentScenarios,
            'monthlyData' => $monthlyData,
        ]);
    }
}