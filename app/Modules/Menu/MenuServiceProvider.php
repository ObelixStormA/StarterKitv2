<?php

namespace App\Modules\Menu;

use Illuminate\Support\ServiceProvider;

class MenuServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/Migrations');
        $this->loadRoutesFrom(__DIR__ . '/routes.php');
    }
}
