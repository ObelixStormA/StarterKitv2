<?php

use App\Modules\File\Controllers\FileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'verified'])
    ->prefix('admin')
    ->group(function () {
        Route::get('files', [FileController::class, 'index'])->name('files.index');
        Route::post('files', [FileController::class, 'store'])->name('files.store');
        Route::get('files/trashed', [FileController::class, 'trashed'])->name('files.trashed');
        Route::post('files/{id}/restore', [FileController::class, 'restore'])->name('files.restore');
        Route::delete('files/{id}/force', [FileController::class, 'forceDelete'])->name('files.force-delete');
        Route::get('files/{file}/download', [FileController::class, 'download'])->name('files.download');
        Route::delete('files/{file}', [FileController::class, 'destroy'])->name('files.destroy');
    });
