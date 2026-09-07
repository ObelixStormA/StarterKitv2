<?php

namespace App\Modules\Menu\Controllers;

use App\Modules\Menu\Models\Menu;
use App\Modules\Menu\Requests\StoreMenuRequest;
use App\Modules\Menu\Requests\UpdateMenuRequest;
use App\Modules\Menu\Services\MenuService;
use App\Shared\BaseController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends BaseController
{
    public function __construct(
        private readonly MenuService $service
    ) {}

    public function index(Request $request): Response
    {
        abort_unless(auth()->user()->can('menus.view'), 403);

        return Inertia::render('Menu/Index', [
            'menus' => $this->service->paginate($request->only('search')),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(StoreMenuRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('menus.index')->with('success', 'Menu yaratildi');
    }

    public function update(UpdateMenuRequest $request, Menu $menu): RedirectResponse
    {
        $this->service->update($menu, $request->validated());

        return redirect()->route('menus.index')->with('success', 'Yangilandi');
    }

    public function destroy(Menu $menu): RedirectResponse
    {
        abort_unless(auth()->user()->can('menus.delete'), 403);

        $this->service->delete($menu);

        return redirect()->route('menus.index')->with('success', "O'chirildi");
    }

    public function trashed(Request $request): Response
    {
        abort_unless(auth()->user()->can('menus.delete'), 403);

        return Inertia::render('Menu/Trashed', [
            'menus' => $this->service->trashed($request->only('search')),
            'filters' => $request->only('search'),
        ]);
    }

    public function restore(int $id): RedirectResponse
    {
        abort_unless(auth()->user()->can('menus.delete'), 403);

        $this->service->restore($id);

        return back()->with('success', 'Tiklandi');
    }

    public function forceDelete(int $id): RedirectResponse
    {
        abort_unless(auth()->user()->can('menus.delete'), 403);

        $this->service->forceDelete($id);

        return back()->with('success', "Butunlay o'chirildi");
    }

    public function builder(Menu $menu): Response
    {
        abort_unless(auth()->user()->can('menus.edit'), 403);

        return Inertia::render('Menu/Builder', [
            'menu' => $menu,
            'tree' => $this->service->tree($menu),
        ]);
    }
}
