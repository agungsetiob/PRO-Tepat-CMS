<?php

use App\Http\Controllers\Api\v1\ManualBookApiController;
use App\Http\Controllers\Api\v1\ProtocolApiController;
use App\Http\Controllers\Api\v1\RundownGeneratorController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['api.key', 'throttle:99,1'])
    ->group(function () {
        
        Route::get('/dashboard', [ProtocolApiController::class, 'getDashboard']);
        
        // Endpoint Pencarian Pintar (Contoh akses: /api/v1/search?q=bupati)
        Route::get('/search', [ProtocolApiController::class, 'quickSearch']);
        Route::get('/search-honorifics', [ProtocolApiController::class, 'quickSearchHonorifics']);

        Route::get('/scenarios/popular', [ProtocolApiController::class, 'getPopularScenarios']);
        Route::get('/honorifics', [ProtocolApiController::class, 'getHonorificsList']);
        
        Route::get('/categories/{slug}/scenarios', [ProtocolApiController::class, 'getScenariosByCategory']);
        Route::get('/scenarios/{slug}', [ProtocolApiController::class, 'getDetailSkenario']);

        Route::get('scenarios', [ProtocolApiController::class, 'index']);

        Route::get('/master-agendas', [RundownGeneratorController::class, 'getMasterAgendas']);
        Route::post('/rundowns', [RundownGeneratorController::class, 'store'])->middleware('api.pin');;
        Route::get('/generated-rundowns', [RundownGeneratorController::class, 'getRundownsList']);
        Route::get('/generated-rundowns/{id}', [RundownGeneratorController::class, 'getRundownDetail']);
        Route::post('/invitations/{id}/presence', [RundownGeneratorController::class, 'updatePresence'])->middleware('api.pin');
        Route::post('/rundowns/verify-pin', [RundownGeneratorController::class, 'verifyPin']);

        Route::get('manual-books', [ManualBookApiController::class, 'index']);
        Route::get('manual-books/{id}', [ManualBookApiController::class, 'show']);
        Route::get('manual-books/{id}/download', [ManualBookApiController::class, 'download']);

        Route::get('/privacy-policy', [RundownGeneratorController::class, 'getPrivacyPolicy']);
    });
