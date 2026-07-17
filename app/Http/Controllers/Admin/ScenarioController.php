<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\EventChecklist;
use App\Models\EventEquipment;
use App\Models\Scenario;
use App\Models\Tag;
use App\Models\Protocol;
use App\Models\SeatingRule;
use App\Models\Honorific;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ScenarioController extends Controller
{
    public function index()
    {
        $scenarios = Scenario::with(['category', 'tags'])->orderBy('order')->paginate(10);
        $categories = Category::orderBy('order')->get();

        return Inertia::render('Admin/Scenarios/Index', [
            'scenarios' => $scenarios,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'layout_type' => 'nullable|string|max:255',
            'jenis_acara' => 'nullable|in:kenegaraan,resmi,incognito',
            'order' => 'required|integer',
            'is_active' => 'required|boolean',
            'thumbnail' => 'nullable|image|max:2048',
            'tags' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . rand(100, 999);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            // Simpan path relatif tanpa /storage
            $validated['thumbnail'] = $path;
        }

        $scenario = Scenario::create($validated);

        if (!empty($request->tags)) {
            $tagIds = [];
            foreach (explode(',', $request->tags) as $name) {
                $trimmed = trim($name);
                if ($trimmed !== '') {
                    $tag = Tag::firstOrCreate(
                        ['slug' => Str::slug($trimmed)],
                        ['name' => $trimmed]
                    );
                    $tagIds[] = $tag->id;
                }
            }
            $scenario->tags()->sync($tagIds);
        }

        return redirect()->back()->with('message', 'Skenario berhasil ditambahkan.');
    }

    public function update(Request $request, Scenario $scenario)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'layout_type' => 'nullable|string|max:255',
            'jenis_acara' => 'nullable|in:kenegaraan,resmi,incognito',
            'order' => 'required|integer',
            'is_active' => 'required|boolean',
            'thumbnail' => 'nullable|image|max:2048',
            'tags' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . $scenario->id;

        if ($request->hasFile('thumbnail')) {
            if ($scenario->thumbnail) {
                Storage::disk('public')->delete($scenario->thumbnail);
            }

            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $validated['thumbnail'] = $path;
        } else {
            unset($validated['thumbnail']);
        }

        $scenario->update($validated);

        if ($request->filled('tags')) {
            $tagIds = [];
            foreach (explode(',', $request->tags) as $name) {
                $trimmed = trim($name);
                if ($trimmed !== '') {
                    $tag = Tag::firstOrCreate(
                        ['slug' => Str::slug($trimmed)],
                        ['name' => $trimmed]
                    );
                    $tagIds[] = $tag->id;
                }
            }
            $scenario->tags()->sync($tagIds);
        } else {
            $scenario->tags()->detach();
        }

        return redirect()->back()->with('message', 'Skenario berhasil diperbarui.');
    }


    public function destroy(Scenario $scenario)
    {
        if ($scenario->thumbnail) {
            // Sekarang di DB sudah simpan path relatif, jadi langsung delete
            Storage::disk('public')->delete($scenario->thumbnail);
        }

        $scenario->delete(); // Cascade delete otomatis
        return redirect()->back()->with('message', 'Skenario berhasil dihapus.');
    }

    public function simpanMateriTempat(Request $request, Scenario $scenario)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image_infographic' => 'nullable|image|max:3072',
            'references' => 'nullable|array',
            'seating_rules' => 'nullable|array',
        ]);

        $protocol = Protocol::firstOrNew(['scenario_id' => $scenario->id]);
        $protocol->title = $validated['title'];
        $protocol->content = $validated['content'];
        $protocol->references = $validated['references'] ?? [];

        if ($request->hasFile('image_infographic')) {
            if ($protocol->image_infographic) {
                Storage::disk('public')->delete($protocol->image_infographic);
            }
            $path = $request->file('image_infographic')->store('infographics', 'public');
            // Simpan path relatif
            $protocol->image_infographic = $path;
        }

        $protocol->save();

        // Refresh seating rules
        $protocol->seatingRules()->delete();
        if (!empty($validated['seating_rules'])) {
            foreach ($validated['seating_rules'] as $index => $rule) {
                if (!empty($rule['position_label'])) {
                    SeatingRule::create([
                        'protocol_id' => $protocol->id,
                        'position_label' => $rule['position_label'],
                        'honorific_id' => $rule['honorific_id'] ?: null,
                        'note' => $rule['note'] ?? null,
                        'order' => $index
                    ]);
                }
            }
        }

        return redirect()->route('admin.scenarios.index')->with('message', 'Materi tata tempat berhasil disimpan.');
    }

    public function kelolaMateri(Scenario $scenario)
    {
        // Bagian Tata Tempat & Penghormatan
        if ($scenario->category->type === 'tempat' || $scenario->category->type === 'hormat') {
            $protocol = Protocol::where('scenario_id', $scenario->id)->with('seatingRules.honorific')->first();
            $honorifics = Honorific::urutanProtokol()->get();

            return Inertia::render('Admin/Scenarios/MateriTempat', [
                'scenario' => $scenario->load('category'),
                'protocol' => $protocol,
                'honorifics' => $honorifics
            ]);
        }

        // [BARU] Bagian Tata Acara
        if ($scenario->category->type === 'acara') {
            $checklists = EventChecklist::where('scenario_id', $scenario->id)->orderBy('order')->get();
            $equipments = EventEquipment::where('scenario_id', $scenario->id)->get();

            return Inertia::render('Admin/Scenarios/MateriAcara', [
                'scenario' => $scenario->load('category'),
                'checklists' => $checklists,
                'equipments' => $equipments
            ]);
        }

        return redirect()->route('admin.scenarios.index')->with('error', 'Tipe kategori tidak dikenali.');
    }

    public function simpanMateriAcara(Request $request, Scenario $scenario)
    {
        $validated = $request->validate([
            'checklists' => 'nullable|array',
            'equipments' => 'nullable|array',
        ]);

        // 1. Refresh Data Susunan Acara (Checklist)
        $scenario->checklists()->delete();
        if (!empty($validated['checklists'])) {
            foreach ($validated['checklists'] as $index => $check) {
                if (!empty($check['item']) && !empty($check['section'])) {
                    EventChecklist::create([
                        'scenario_id' => $scenario->id,
                        'section' => $check['section'], // Misal: Acara Pokok
                        'item' => $check['item'],       // Misal: Menyanyikan Lagu Indonesia Raya
                        'order' => $index
                    ]);
                }
            }
        }

        // 2. Refresh Data Kelengkapan & Perlengkapan (Equipment)
        $scenario->equipments()->delete();
        if (!empty($validated['equipments'])) {
            foreach ($validated['equipments'] as $eq) {
                if (!empty($eq['name'])) {
                    EventEquipment::create([
                        'scenario_id' => $scenario->id,
                        'name' => $eq['name'],
                        'category' => $eq['category'] ?? 'perlengkapan', // kelengkapan / perlengkapan
                    ]);
                }
            }
        }

        return redirect()->route('admin.scenarios.index')->with('message', 'Materi susunan acara dan logistik berhasil disimpan.');
    }
}
