<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Scenario;
use Illuminate\Http\Request;

class ProtocolApiController extends Controller
{
    /**
     * 1. Ambil Semua Kategori + Skenario di dalamnya (Untuk Halaman Beranda Mobile)
     */
    public function getDashboard()
    {
        $categories = Category::orderBy('order')
            ->with(['scenarios' => function ($query) {
                $query->where('is_active', true)->orderBy('order');
            }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ], 200);
    }

    /**
     * 2. Ambil Detail Materi Skenario Berdasarkan Slug
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

        // Jika tipenya tempat, muat relasi tata tempat (protocols & seating rules)
        if ($scenario->category->type === 'tempat') {
            $scenario->load(['protocols.seatingRules.honorific']);
        } 
        // Jika tipenya acara / hormat, muat relasi rundown & logistik
        else {
            $scenario->load(['checklists', 'equipments']);
        }

        return response()->json([
            'success' => true,
            'data' => $scenario
        ], 200);
    }

    /**
     * 3. QUICK SEARCH (Satu Pintu Berdasarkan Judul, Deskripsi, atau Tags)
     */
    public function quickSearch(Request $request)
    {
        $keyword = $request->query('q');

        if (empty($keyword)) {
            return response()->json([
                'success' => true,
                'data' => []
            ], 200);
        }

        // Cari skenario yang aktif berdasarkan judul, deskripsi, ATAU kecocokan nama tags
        $results = Scenario::where('is_active', true)
            ->where(function ($query) use ($keyword) {
                $query->where('title', 'LIKE', "%{$keyword}%")
                      ->orWhere('description', 'LIKE', "%{$keyword}%")
                      ->orWhereHas('tags', function ($tagQuery) use ($keyword) {
                          $tagQuery->where('name', 'LIKE', "%{$keyword}%");
                      });
            })
            ->with(['category', 'tags'])
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'count' => $results->count(),
            'data' => $results
        ], 200);
    }
}