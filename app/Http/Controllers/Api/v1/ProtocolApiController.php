<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Scenario;
use App\Models\Honorific;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProtocolApiController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $scenarios = Scenario::with('category')
                ->where('is_active', true)
                ->orderBy('id', 'desc')
                ->cursorPaginate(3);

            return response()->json([
                'success' => true,
                'message' => 'Master data skenario berhasil dimuat',
                'data' => $scenarios->items(),
                'next_cursor' => $scenarios->nextCursor() ? $scenarios->nextCursor()->encode() : null,
                'has_more' => $scenarios->hasMorePages()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * 
     * Mengambil pedoman yang berada di urutan teratas
     */
    public function getPopularScenarios()
    {
        $populars = Scenario::where('is_active', true)
            ->with(['category'])
            ->limit(3)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $populars
        ], 200);
    }
    /**
     * DASHBOARD
     * 
     */
    public function getDashboard()
    {
        $categories = Category::orderBy('order')
            ->select(['id', 'name', 'slug', 'icon', 'type', 'order'])
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar kategori berhasil dimuat.',
            'data' => $categories
        ], 200);
    }

    /**
     * LIST SKENARIO PER KATEGORI
     * 
     */
    public function getScenariosByCategory(Request $request, $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak ditemukan.'
            ], 404);
        }

        $perPage = $request->query('per_page', 7);
        $scenarios = Scenario::where('category_id', $category->id)
            ->where('is_active', true)
            ->with(['tags'])
            ->orderBy('order', 'asc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Daftar skenario kategori ' . $category->name . ' berhasil dimuat.',
            'category_name' => $category->name,
            'category_type' => $category->type,
            'current_page' => $scenarios->currentPage(),
            'last_page' => $scenarios->lastPage(),
            'total' => $scenarios->total(),
            'has_more' => $scenarios->hasMorePages(),
            'data' => $scenarios->items() // Memisahkan payload data murni dari meta pagination standard
        ], 200);
    }

    /**
     * DETAIL MATERI SKENARIO
     * Tetap cerdas memilah load data berdasarkan tipe kategori
     */
    public function getDetailSkenario($slug)
    {
        $scenario = Scenario::where('slug', $slug)
            ->where('is_active', true)
            ->with(['category', 'tags'])
            ->first();

        if (!$scenario) {
            return response()->json([
                'success' => false,
                'message' => 'Skenario tidak ditemukan atau nonaktif.'
            ], 404);
        }

        if ($scenario->category->type === 'tempat' || $scenario->category->type === 'hormat') {
            $scenario->load(['protocols.seatingRules.honorific']);
        } else {
            $scenario->load(['checklists', 'equipments']);
        }

        return response()->json([
            'success' => true,
            'data' => $scenario
        ], 200);
    }

    /**
     * QUICK SEARCH ONE-DOOR
     */
    public function quickSearch(Request $request)
    {
        $keyword = $request->query('q');

        if (empty($keyword)) {
            return response()->json([
                'success' => true,
                'data' => [],
                'has_more' => false
            ], 200);
        }

        $results = Scenario::where('is_active', true)
            ->where(function ($query) use ($keyword) {
                $query->where('title', 'LIKE', "%{$keyword}%")
                    ->orWhere('description', 'LIKE', "%{$keyword}%")
                    ->orWhereHas('tags', function ($tagQuery) use ($keyword) {
                        $tagQuery->where('name', 'LIKE', "%{$keyword}%");
                    });
            })
            ->with(['category', 'tags'])
            ->orderBy('order', 'asc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'current_page' => $results->currentPage(),
            'has_more' => $results->hasMorePages(),
            'data' => $results->items()
        ], 200);
    }

    /**
     * QUICK REFERENSI SAPAAN PEJABAT (HONORIFICS)
     * Kamus saku mandiri untuk melihat tata cara penyebutan nama jabatan di lapangan
     */
    public function getHonorificsList(Request $request)
    {
        $search = $request->query('search');

        $query = Honorific::orderBy('tingkat', 'asc');

        if (!empty($search)) {
            $query->where('jabatan', 'LIKE', "%{$search}%");
        }

        $honorifics = $query->get();

        return response()->json([
            'success' => true,
            'data' => $honorifics
        ], 200);
    }

    public function quickSearchHonorifics(Request $request)
    {
        $keyword = $request->query('q');

        if (empty($keyword)) {
            return response()->json([
                'success' => true,
                'data' => []
            ], 200);
        }

        $results = Honorific::where(function ($query) use ($keyword) {
            $query->where('jabatan', 'LIKE', "%{$keyword}%");
        })
            ->orderBy('tingkat')
            ->get();

        return response()->json([
            'success' => true,
            'count' => $results->count(),
            'data' => $results
        ], 200);
    }
}