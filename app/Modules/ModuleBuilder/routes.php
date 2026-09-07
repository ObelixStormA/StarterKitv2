<?php

use App\Modules\ModuleBuilder\Controllers\ModuleBuilderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'verified'])
    ->prefix('admin')
    ->group(function () {
        Route::get('module-builder', [ModuleBuilderController::class, 'index'])->name('module-builder.index');
        Route::post('module-builder', [ModuleBuilderController::class, 'generate'])->name('module-builder.generate');
        Route::delete('module-builder/{name}', [ModuleBuilderController::class, 'destroy'])->name('module-builder.destroy');
    });
