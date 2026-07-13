<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\ManualBook;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ManualBookApiController extends Controller
{
    /**
     * Daftar manual book (hanya yang aktif)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->query('per_page', 10);

        $manualBooks = ManualBook::where('is_active', true)
            ->with('uploader')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'uploaded_by' => $item->uploader ? $item->uploader->name : null,
                    'created_at' => $item->created_at->toISOString(),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Daftar manual book berhasil dimuat.',
            'data' => $manualBooks->items(),
            'current_page' => $manualBooks->currentPage(),
            'last_page' => $manualBooks->lastPage(),
            'per_page' => $manualBooks->perPage(),
            'total' => $manualBooks->total(),
            'has_more' => $manualBooks->hasMorePages(),
        ], 200);
    }

    /**
     * Detail manual book
     */
    public function show($id): JsonResponse
    {
        $manualBook = ManualBook::where('is_active', true)
            ->with('uploader')
            ->find($id);

        if (!$manualBook) {
            return response()->json([
                'success' => false,
                'message' => 'Manual book tidak ditemukan atau tidak aktif.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail manual book berhasil dimuat.',
            'data' => [
                'id' => $manualBook->id,
                'title' => $manualBook->title,
                'description' => $manualBook->description,
                'file_name' => $manualBook->file_name,
                'file_url' => $this->getFileUrl($manualBook->file_path),
                'size' => $manualBook->size,
                'size_formatted' => $this->formatBytes($manualBook->size),
                'mime_type' => $manualBook->mime_type,
                'uploaded_by' => $manualBook->uploader ? $manualBook->uploader->name : null,
                'created_at' => $manualBook->created_at->toISOString(),
            ]
        ], 200);
    }

    /**
     * Download file manual book
     */
    public function download($id)
    {
        $manualBook = ManualBook::where('is_active', true)->find($id);

        if (!$manualBook) {
            return response()->json([
                'success' => false,
                'message' => 'Manual book tidak ditemukan atau tidak aktif.'
            ], 404);
        }

        $filePath = storage_path('app/public/' . $manualBook->file_path);

        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File tidak ditemukan di server.'
            ], 404);
        }

        return response()->download($filePath, $manualBook->file_name, [
            'Content-Type' => $manualBook->mime_type,
        ]);
    }

    /**
     * Helper: URL publik file
     */
    private function getFileUrl($path): string
    {
        return asset('storage/' . $path);
    }

    /**
     * Helper: format ukuran file
     */
    private function formatBytes($bytes, $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}