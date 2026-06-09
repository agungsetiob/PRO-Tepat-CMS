<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\HonorificController;
use App\Http\Controllers\Admin\ScenarioController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('admin.dashboard');
    }
    return Inertia::render('Auth/Login');
});

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {

    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('dashboard');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('honorifics', HonorificController::class)->except(['create', 'show', 'edit']);

    Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);

    Route::resource('scenarios', ScenarioController::class)->except(['create', 'show', 'edit']);

    Route::get('scenarios/{scenario}/materi', [ScenarioController::class, 'kelolaMateri'])->name('scenarios.materi');
    Route::post('scenarios/{scenario}/materi/tempat', [ScenarioController::class, 'simpanMateriTempat'])->name('scenarios.materi.tempat');
    Route::post('scenarios/{scenario}/materi/acara', [ScenarioController::class, 'simpanMateriAcara'])->name('scenarios.materi.acara');
});

require __DIR__ . '/auth.php';
