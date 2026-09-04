<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    protected array $supported = ['uz', 'ru', 'en'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('app_locale');

        if (in_array($locale, $this->supported, true)) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
