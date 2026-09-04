<?php

namespace App\Shared;

use Illuminate\Routing\Controller;

abstract class BaseController extends Controller
{
    protected function authorizePermission(string $permission): void
    {
        abort_unless(auth()->user()->can($permission), 403);
    }
}
