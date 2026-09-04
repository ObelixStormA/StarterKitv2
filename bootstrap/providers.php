<?php

use App\Modules\Audit\AuditServiceProvider;
use App\Modules\File\FileServiceProvider;
use App\Modules\Notification\NotificationServiceProvider;
use App\Modules\Role\RoleServiceProvider;
use App\Modules\Search\SearchServiceProvider;
use App\Modules\Setting\SettingServiceProvider;
use App\Modules\User\UserServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    UserServiceProvider::class,
    RoleServiceProvider::class,
    SettingServiceProvider::class,
    FileServiceProvider::class,
    AuditServiceProvider::class,
    NotificationServiceProvider::class,
    SearchServiceProvider::class,
];
