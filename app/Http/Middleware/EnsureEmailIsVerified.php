<?php

namespace App\Http\Middleware;

use App\Modules\Setting\Services\SettingService;
use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\URL;

/**
 * Standart EnsureEmailIsVerified'ning kengaytmasi — "Admin sozlamalari"dagi
 * email_verification_enabled o'chirilgan bo'lsa, tekshiruvni butunlay o'tkazib yuboradi.
 */
class EnsureEmailIsVerified
{
    public static function redirectTo($route)
    {
        return static::class . ':' . $route;
    }

    public function handle($request, Closure $next, $redirectToRoute = null)
    {
        $enabled = app(SettingService::class)->get('admin', 'email_verification_enabled', '1') !== '0';

        if (! $enabled) {
            return $next($request);
        }

        if (
            ! $request->user() ||
            ($request->user() instanceof MustVerifyEmail && ! $request->user()->hasVerifiedEmail())
        ) {
            return $request->expectsJson()
                ? abort(403, 'Your email address is not verified.')
                : Redirect::guest(URL::route($redirectToRoute ?: 'verification.notice'));
        }

        return $next($request);
    }
}
