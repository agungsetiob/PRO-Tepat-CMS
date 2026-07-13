<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ManualBook;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ManualBookController extends Controller
{
    /**
     * Display a listing of the manual books.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $manualBooks = ManualBook::with('uploader')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'file_name' => $item->file_name,
                    'file_path' => $item->file_path,
                    'mime_type' => $item->mime_type,
                    'size' => $item->size,
                    'size_formatted' => $this->formatBytes($item->size),
                    'uploaded_by' => $item->uploader ? $item->uploader->name : null,
                    'is_active' => $item->is_active,
                    'created_at' => $item->created_at->format('d-m-Y H:i'),
                ];
            });

        return Inertia::render('Admin/ManualBook/Index', [
            'manualBooks' => $manualBooks,
        ]);
    }

    /**
     * Store a newly created manual book.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf|max:20480',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $path = $file->store('manual_books', 'public');

        $manualBook = ManualBook::create([
            'title' => $request->title,
            'description' => $request->description,
            'file_name' => $originalName,
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => auth()->id(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('admin.manual-book.index')->with('message', 'Manual book berhasil diunggah.');
    }

    /**
     * Update the specified manual book.
     */
    public function update(Request $request, $id)
    {
        $manualBook = ManualBook::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf|max:20480',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($request->hasFile('file')) {
            if (Storage::disk('public')->exists($manualBook->file_path)) {
                Storage::disk('public')->delete($manualBook->file_path);
            }

            $file = $request->file('file');
            $path = $file->store('manual_books', 'public');
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_path'] = $path;
            $data['mime_type'] = $file->getMimeType();
            $data['size'] = $file->getSize();
        }

        $manualBook->update($data);

        return redirect()->route('admin.manual-book.index')->with('message', 'Manual book berhasil diperbarui.');
    }

    /**
     * Remove the specified manual book.
     */
    public function destroy($id)
    {
        $manualBook = ManualBook::findOrFail($id);

        // Hapus file fisik
        if (Storage::disk('public')->exists($manualBook->file_path)) {
            Storage::disk('public')->delete($manualBook->file_path);
        }

        $manualBook->delete();

        return redirect()->route('admin.manual-book.index')->with('message', 'Manual book berhasil dihapus.');
    }

    /**
     * Download the manual book file.
     */
    public function download($id)
    {
        $manualBook = ManualBook::findOrFail($id);
        $filePath = storage_path('app/public/' . $manualBook->file_path);

        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan.');
        }

        return response()->download($filePath, $manualBook->file_name);
    }

    /**
     * Helper: format bytes to human readable.
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}