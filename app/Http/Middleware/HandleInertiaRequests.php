<?php

namespace App\Http\Middleware;

use App\Modules\Setting\Services\SettingService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function __construct(
        private readonly SettingService $settings
    ) {}

    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $permissions = $user?->getAllPermissions()->pluck('name') ?? [];
        $roles = $user?->getRoleNames() ?? [];

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user?->makeHidden(['roles', 'permissions']),
                'permissions' => $permissions,
                'roles' => $roles,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'site' => [
                'name' => fn () => $this->settings->get('admin', 'site_name', 'Laravel'),
                'logo' => fn () => $this->settings->get('admin', 'site_logo', '/assets/logo/logo.svg'),
                'favicon' => fn () => $this->settings->get('admin', 'site_favicon', '/assets/logo/favicon.ico'),
            ],
        ];
    }
}
