<?php

namespace App\Modules\Menu\Controllers;

use App\Modules\Menu\Models\Menu;
use App\Modules\Menu\Models\MenuItem;
use App\Modules\Menu\Requests\StoreMenuItemRequest;
use App\Modules\Menu\Requests\UpdateMenuItemRequest;
use App\Modules\Menu\Services\MenuService;
use App\Shared\BaseController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MenuItemController extends BaseController
{
    public function __construct(
        private readonly MenuService $service
    ) {}

    public function store(StoreMenuItemRequest $request, Menu $menu): RedirectResponse
    {
        $this->service->createItem($menu, $request->validated());

        return back()->with('success', "Element qo'shildi");
    }

    public function update(UpdateMenuItemRequest $request, Menu $menu, MenuItem $item): RedirectResponse
    {
        abort_unless($item->menu_id === $menu->id, 404);

        $this->service->updateItem($item, $request->validated());

        return back()->with('success', 'Yangilandi');
    }

    public function destroy(Menu $menu, MenuItem $item): RedirectResponse
    {
        abort_unless(auth()->user()->can('menus.edit'), 403);
        abort_unless($item->menu_id === $menu->id, 404);

        $this->service->deleteItem($item);

        return back()->with('success', "O'chirildi");
    }

    public function reorder(Request $request, Menu $menu): RedirectResponse
    {
        abort_unless(auth()->user()->can('menus.edit'), 403);

        $data = $request->validate([
            'tree' => ['required', 'array'],
        ]);

        $submittedIds = $this->service->idsCollectedFromTree($data['tree']);
        $validIds = $menu->items()->pluck('id')->all();

        abort_if(array_diff($submittedIds, $validIds) !== [], 422, "Noto'g'ri element ID'lari");

        $this->service->reorder($menu, $data['tree']);

        return back()->with('success', "Tartib yangilandi");
    }
}
