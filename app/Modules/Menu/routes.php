<?php

use App\Modules\Menu\Controllers\MenuController;
use App\Modules\Menu\Controllers\MenuItemController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'verified'])
    ->prefix('admin')
    ->group(function () {
        Route::get('menus/trashed', [MenuController::class, 'trashed'])->name('menus.trashed');
        Route::post('menus/{id}/restore', [MenuController::class, 'restore'])->name('menus.restore');
        Route::delete('menus/{id}/force', [MenuController::class, 'forceDelete'])->name('menus.force-delete');

        Route::get('menus', [MenuController::class, 'index'])->name('menus.index');
        Route::post('menus', [MenuController::class, 'store'])->name('menus.store');
        Route::put('menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
        Route::delete('menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');

        Route::get('menus/{menu}/builder', [MenuController::class, 'builder'])->name('menus.builder');

        Route::post('menus/{menu}/items', [MenuItemController::class, 'store'])->name('menu-items.store');
        Route::put('menus/{menu}/items/{item}', [MenuItemController::class, 'update'])->name('menu-items.update');
        Route::delete('menus/{menu}/items/{item}', [MenuItemController::class, 'destroy'])->name('menu-items.destroy');
        Route::post('menus/{menu}/items/reorder', [MenuItemController::class, 'reorder'])->name('menu-items.reorder');
    });
