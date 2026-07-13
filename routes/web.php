<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\HonorificController;
use App\Http\Controllers\Admin\ScenarioController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ManualBookController;
use App\Http\Controllers\Admin\MasterAgendaController;
use App\Http\Controllers\Admin\RundownAnalyticsController;
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

    Route::get('/master-agenda', [MasterAgendaController::class, 'index'])->name('master-agenda.index');
    Route::post('/master-agenda', [MasterAgendaController::class, 'store'])->name('master-agenda.store');
    Route::put('/master-agenda/{id}', [MasterAgendaController::class, 'update'])->name('master-agenda.update');
    Route::delete('/master-agenda/{id}', [MasterAgendaController::class, 'destroy'])->name('master-agenda.destroy');

    Route::get('/rundown-analytics', [RundownAnalyticsController::class, 'index'])->name('rundown-analytics.index');
    Route::delete('/rundown-analytics/{id}', [RundownAnalyticsController::class, 'destroy'])->name('rundown-analytics.destroy');
    Route::resource('manual-book', ManualBookController::class)->except(['show', 'edit', 'create'])->name('manual-book', 'manual-book.index');
    Route::get('manual-book/{id}/download', [ManualBookController::class, 'download'])->name('manual-book.download');
});

require __DIR__ . '/auth.php';
