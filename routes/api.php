<?php

use App\Http\Controllers\Api\ProtocolApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Endpoint Beranda Mobile (Mengembalikan Kategori & Skenario)
    Route::get('/dashboard', [ProtocolApiController::class, 'getDashboard']);
    
    // Endpoint Pencarian Pintar (Contoh akses: /api/v1/search?q=bupati)
    Route::get('/search', [ProtocolApiController::class, 'quickSearch']);
    
    // Endpoint Detail Konten Materi
    Route::get('/scenarios/{slug}', [ProtocolApiController::class, 'getDetailSkenario']);
});