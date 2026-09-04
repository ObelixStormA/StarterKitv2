<?php

namespace App\Modules\Setting\Controllers;

use App\Modules\Setting\Models\Setting;
use App\Modules\Setting\Requests\StoreSettingRequest;
use App\Modules\Setting\Requests\UpdateSettingRequest;
use App\Modules\Setting\Services\SettingService;
use App\Shared\BaseController;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends BaseController
{
    public function __construct(
        private readonly SettingService $service
    ) {}

    public function index(): Response
    {
        abort_unless(
            auth()->user()->canAny(['settings.view', 'settings.ownview']),
            403
        );

        return Inertia::render('Setting/Index', [
            'adminSettings' => $this->service->byGroup(Setting::GROUP_ADMIN),
            'siteSettings' => $this->service->byGroup(Setting::GROUP_SITE),
        ]);
    }

    public function store(StoreSettingRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return back()->with('success', 'Sozlama qo\'shildi');
    }

    public function update(UpdateSettingRequest $request, Setting $setting): RedirectResponse
    {
        $this->service->update($setting, $request->validated());

        return back()->with('success', 'Sozlama yangilandi');
    }

    public function destroy(Setting $setting): RedirectResponse
    {
        abort_unless(auth()->user()->can('settings.delete'), 403);

        $this->service->delete($setting);

        return back()->with('success', "Sozlama o'chirildi");
    }
}
