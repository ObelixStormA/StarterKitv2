<?php

namespace App\Modules\ModuleBuilder;

use Illuminate\Support\ServiceProvider;

class ModuleBuilderServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/routes.php');
    }
}
