<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Support\Facades\RateLimiter;
use App\Http\Controllers\Controller;
use App\Models\MasterAgenda;
use App\Models\GeneratedRundown;
use App\Models\GeneratedRundownItem;
use App\Models\GeneratedRundownInvitation;
use App\Models\ProtocolPin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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
            'invitations' => 'required|array|min:1',
            'invitations.*.honorific_id' => 'required|exists:honorifics,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

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
                    'sort_order' => $index + 1,
                ]);
            }

            foreach ($request->invitations as $index => $inv) {
                GeneratedRundownInvitation::create([
                    'generated_rundown_id' => $rundown->id,
                    'honorific_id' => $inv['honorific_id'],
                    'sort_order' => $index + 1,
                ]);
            }

            DB::commit();

            $completedData = GeneratedRundown::with(['items.masterAgenda', 'invitations.honorific'])->find($rundown->id);

            return response()->json([
                'success' => true,
                'message' => 'Rundown dan List Undangan berhasil digenerate!',
                'data' => $completedData
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan rundown: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 3. Menampilkan daftar riwayat rundown dengan pencarian dan cursor pagination (Load More)
     */
    public function getRundownsList(Request $request): JsonResponse
    {
        try {
            // Inisialisasi query dasar beserta hitung relasi baris
            $query = GeneratedRundown::withCount(['items', 'invitations']);

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('event_name', 'LIKE', '%' . $search . '%')
                        ->orWhere('location', 'LIKE', '%' . $search . '%')
                        ->orWhere('pic', 'LIKE', '%' . $search . '%');
                });
            }

            $rundowns = $query->orderBy('id', 'desc')->cursorPaginate(7);

            return response()->json([
                'success' => true,
                'message' => 'Daftar riwayat rundown berhasil dimuat',
                'data' => $rundowns->items(),
                'next_cursor' => $rundowns->nextCursor() ? $rundowns->nextCursor()->encode() : null,
                'has_more' => $rundowns->hasMorePages()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat daftar rundown: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 4. Menampilkan detail spesifik dari satu rundown (termasuk susunan acara dan list honorifics undangan)
     */
    public function getRundownDetail($id): JsonResponse
    {
        try {
            $rundown = GeneratedRundown::with([
                'items.masterAgenda',
                'invitations.honorific'
            ])->find($id);

            if (!$rundown) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data rundown tidak ditemukan atau telah dihapus'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detail data rundown sukses dimuat',
                'data' => $rundown
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail rundown: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 5. Update Status Kehadiran & Foto Pejabat oleh Petugas Protokol
     */
    public function updatePresence(Request $request, $invitationId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:hadir,tidak_hadir,belum_hadir',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:4096'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $invitation = GeneratedRundownInvitation::findOrFail($invitationId);

            $dataUpdate = ['status' => $request->status];

            // Jika status hadir dan ada lampiran foto kamera dari protokol
            if ($request->status === 'hadir' && $request->hasFile('photo')) {
                // Hapus foto lama jika ada ganti ulang
                if ($invitation->presence_photo) {
                    Storage::disk('public')->delete($invitation->presence_photo);
                }

                // Simpan ke direktori storage/public/presence_photos
                $path = $request->file('photo')->store('presence_photos', 'public');
                $dataUpdate['presence_photo'] = $path;
            } elseif ($request->status === 'tidak_hadir' || $request->status === 'belum_hadir') {
                // Hapus foto jika status dibatalkan/diubah ke tidak hadir
                if ($invitation->presence_photo) {
                    Storage::disk('public')->delete($invitation->presence_photo);
                    $dataUpdate['presence_photo'] = null;
                }
            }

            $invitation->update($dataUpdate);

            // Ambil data terbaru beserta master info honorific-nya
            $updatedData = GeneratedRundownInvitation::with('honorific')->find($invitationId);

            return response()->json([
                'success' => true,
                'message' => 'Presensi pejabat berhasil diperbarui',
                'data' => $updatedData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses presensi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function verifyPin(Request $request): JsonResponse
    {
        $request->validate([
            'pin' => 'required|string|size:6',
        ]);

        $throttleKey = 'verify-pin:' . $request->ip();

        // 1. CEK LIMITER: Maksimal 5 kali percobaan salah
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'success' => false,
                'message' => "Terlalu banyak percobaan. Tunggu $seconds detik."
            ], 429);
        }

        // 2. Cek apakah PIN terdaftar dan berstatus aktif di database
        $isValid = ProtocolPin::where('pin', $request->pin)
            ->where('is_active', true)
            ->exists();

        if ($isValid) {
            // 3. JIKA SUKSES: Hapus riwayat kesalahan untuk IP ini
            RateLimiter::clear($throttleKey);

            return response()->json([
                'success' => true,
                'message' => 'Akses Protokol Diterima.'
            ], 200);
        }

        // 4. JIKA GAGAL: Catat percobaan salah ini
        RateLimiter::hit($throttleKey, 60);

        return response()->json([
            'success' => false,
            'message' => 'PIN Protokol Salah atau Sudah Dinonaktifkan!'
        ], 401);
    }
}
