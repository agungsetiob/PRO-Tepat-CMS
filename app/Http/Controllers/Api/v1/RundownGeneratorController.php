<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\MasterAgenda;
use App\Models\GeneratedRundown;
use App\Models\GeneratedRundownItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RundownGeneratorController extends Controller
{
    /**
     * 1. Mengambil semua master uraian kegiatan untuk pilihan dropdown di mobile app
     */
    public function getMasterAgendas(): JsonResponse
    {
        try {
            $agendas = MasterAgenda::where('is_active', true)
                ->orderBy('order', 'asc')
                ->orderBy('name', 'asc')
                ->get(['id', 'name']);

            return response()->json([
                'success' => true,
                'message' => 'Data master agenda berhasil dimuat',
                'data' => $agendas
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat master agenda: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 2. Menyimpan susunan rundown baru yang dibuat oleh user dari handphone
     */
    public function store(Request $request): JsonResponse
    {
        // Validasi input kiriman dari mobile
        $validator = Validator::make($request->all(), [
          'event_name' => 'required|string|max:255',
          'date' => 'required|date',
          'time_info' => 'required|string|max:100',
          'location' => 'required|string|max:255',
          'pic' => 'nullable|string|max:255',
          'items' => 'required|array|min:1', // Harus ada minimal 1 baris susunan acara
          'items.*.master_agenda_id' => 'required|exists:master_agendas,id',
          'items.*.start_time' => 'required|string|max:5',
          'items.*.end_time' => 'required|string|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Kita gunakan DB Transaction agar jika ada satu baris item eror, data induk tidak ikut kotor tersimpan
        DB::beginTransaction();

        try {
            // A. Simpan data induk rundown
            $rundown = GeneratedRundown::create([
                'event_name' => $request->event_name,
                'date' => $request->date,
                'time_info' => $request->time_info,
                'location' => $request->location,
                'pic' => $request->pic,
            ]);

            // B. Simpan baris-baris detail susunan acaranya
            foreach ($request->items as $index => $item) {
                GeneratedRundownItem::create([
                    'generated_rundown_id' => $rundown->id,
                    'master_agenda_id' => $item['master_agenda_id'],
                    'start_time' => $item['start_time'],
                    'end_time' => $item['end_time'],
                    'sort_order' => $index + 1, // Otomatis mengurutkan baris 1, 2, 3 sesuai urutan array
                ]);
            }

            DB::commit();

            // Load data yang sudah lengkap terelasi untuk dikembalikan ke HP (siap dicetak PDF)
            $completedData = GeneratedRundown::with('items.masterAgenda')->find($rundown->id);

            return response()->json([
                'success' => true,
                'message' => 'Rundown berhasil digenerate!',
                'data' => $completedData
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan semua penyimpanan jika ada kendala sistem
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan rundown: ' . $e->getMessage()
            ], 500);
        }
    }
}