<?php

use App\Modules\Notification\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])
    ->prefix('notifications')
    ->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    });
