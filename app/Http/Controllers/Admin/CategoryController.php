<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('order')->get();
        
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:tempat,acara,hormat',
            'order' => 'required|integer',
        ]);

        // Otomatis buat slug dari nama kategori
        $validated['slug'] = Str::slug($validated['name']);

        Category::create($validated);

        return redirect()->back()->with('message', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:tempat,acara,hormat',
            'order' => 'required|integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return redirect()->back()->with('message', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $category)
    {
        // Fitur safety agar tidak sengaja menghapus kategori yang masih punya skenario
        if ($category->scenarios()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Kategori tidak bisa dihapus karena masih memiliki data skenario di dalamnya.']);
        }

        $category->delete();
        return redirect()->back()->with('message', 'Kategori berhasil dihapus.');
    }
}