<?php

use App\Http\Controllers\Api\ProtocolApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    
    Route::get('/dashboard', [ProtocolApiController::class, 'getDashboard']);
    
    // Endpoint Pencarian Pintar (Contoh akses: /api/v1/search?q=bupati)
    Route::get('/search', [ProtocolApiController::class, 'quickSearch']);
    Route::get('/search-honorifics', [ProtocolApiController::class, 'quickSearchHonorifics']);

    Route::get('/scenarios/popular', [ProtocolApiController::class, 'getPopularScenarios']);
    Route::get('/honorifics', [ProtocolApiController::class, 'getHonorificsList']);
    
    Route::get('/categories/{slug}/scenarios', [ProtocolApiController::class, 'getScenariosByCategory']);
    Route::get('/scenarios/{slug}', [ProtocolApiController::class, 'getDetailSkenario']);

    Route::get('scenarios', [ProtocolApiController::class, 'index']);
    
});