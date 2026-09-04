<?php

use App\Modules\File\FileServiceProvider;
use App\Modules\Role\RoleServiceProvider;
use App\Modules\Setting\SettingServiceProvider;
use App\Modules\User\UserServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    UserServiceProvider::class,
    RoleServiceProvider::class,
    SettingServiceProvider::class,
    FileServiceProvider::class,
];
