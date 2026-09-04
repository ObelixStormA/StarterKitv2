<?php

use App\Modules\Search\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])
    ->get('search', SearchController::class)
    ->name('search');
