<?php

use App\Http\Controllers\Api\ProtocolApiController;
use Illuminate\Support\Facades\Route;

// Route::prefix('v1')->group(function () {
//     // Endpoint Beranda Mobile (Mengembalikan Kategori & Skenario)
//     Route::get('/dashboard', [ProtocolApiController::class, 'getDashboard']);

//     Route::get('/scenarios/popular', [ProtocolApiController::class, 'getPopularScenarios']);
//     Route::get('/honorifics', [ProtocolApiController::class, 'getHonorificsList']);
    
//     // Endpoint Pencarian Pintar (Contoh akses: /api/v1/search?q=bupati)
//     Route::get('/search', [ProtocolApiController::class, 'quickSearch']);
    
//     // Endpoint Detail Konten Materi
//     Route::get('/scenarios/{slug}', [ProtocolApiController::class, 'getDetailSkenario']);
    
//     Route::get('/categories/{slug}/scenarios', [ProtocolApiController::class, 'getScenariosByCategory']);
// });


Route::prefix('v1')->group(function () {
    
    // 1. RUTE STATIS / ABSOLUT (Wajib di Atas Sekali)
    Route::get('/dashboard', [ProtocolApiController::class, 'getDashboard']);
    Route::get('/search', [ProtocolApiController::class, 'quickSearch']);
    Route::get('/scenarios/popular', [ProtocolApiController::class, 'getPopularScenarios']);
    Route::get('/honorifics', [ProtocolApiController::class, 'getHonorificsList']);
    
    // 2. RUTE DINAMIS / WILDCARD (Taruh di Paling Bawah)
    Route::get('/categories/{slug}/scenarios', [ProtocolApiController::class, 'getScenariosByCategory']);
    Route::get('/scenarios/{slug}', [ProtocolApiController::class, 'getDetailSkenario']);

    Route::get('scenarios', [ProtocolApiController::class, 'index']);
    
});