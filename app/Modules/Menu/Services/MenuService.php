<?php

namespace App\Modules\Menu\Services;

use App\Modules\Menu\Models\Menu;
use App\Modules\Menu\Models\MenuItem;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MenuService
{
    /**
     * Berilgan `key`ga ega menuning tree'sini qaytaradi (masalan sidebar
     * uchun "admin"). Menu topilmasa, bo'sh massiv qaytadi — shu bilan
     * chaqiruvchi tomon (masalan HandleInertiaRequests) har doim xavfsiz
     * ishlatishi mumkin.
     */
    public function treeByKey(string $key): array
    {
        $menu = Menu::where('key', $key)->first();

        return $menu ? $this->tree($menu) : [];
    }

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return Menu::query()
            ->withCount('items')
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('key', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    public function create(array $data): Menu
    {
        return Menu::create($data);
    }

    public function update(Menu $menu, array $data): Menu
    {
        $menu->update($data);

        return $menu->fresh();
    }

    public function delete(Menu $menu): void
    {
        $menu->delete();
    }

    public function trashed(array $filters = []): LengthAwarePaginator
    {
        return Menu::onlyTrashed()
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    public function restore(int $id): void
    {
        Menu::onlyTrashed()->findOrFail($id)->restore();
    }

    public function forceDelete(int $id): void
    {
        Menu::onlyTrashed()->findOrFail($id)->forceDelete();
    }

    /**
     * Menu'ning barcha item'larini iyerarxik (tree) massiv sifatida qaytaradi.
     *
     * @return array<int, array<string, mixed>>
     */
    public function tree(Menu $menu): array
    {
        $items = $menu->items()->orderBy('order')->get();

        return $this->buildTree($items, null);
    }

    /** @param \Illuminate\Support\Collection<int, MenuItem> $items */
    private function buildTree($items, ?int $parentId): array
    {
        return $items
            ->where('parent_id', $parentId)
            ->values()
            ->map(fn (MenuItem $item) => [
                'id' => $item->id,
                'label' => $item->label,
                'icon' => $item->icon,
                'url' => $item->url,
                'target' => $item->target,
                'permission' => $item->permission,
                'requires_local' => $item->requires_local,
                'order' => $item->order,
                'children' => $this->buildTree($items, $item->id),
            ])
            ->all();
    }

    public function createItem(Menu $menu, array $data): MenuItem
    {
        $maxOrder = MenuItem::where('menu_id', $menu->id)
            ->where('parent_id', $data['parent_id'] ?? null)
            ->max('order');

        return MenuItem::create([
            ...$data,
            'menu_id' => $menu->id,
            'order' => $maxOrder === null ? 0 : $maxOrder + 1,
        ]);
    }

    public function updateItem(MenuItem $item, array $data): MenuItem
    {
        $item->update($data);

        return $item->fresh();
    }

    public function deleteItem(MenuItem $item): void
    {
        $item->delete();
    }

    /**
     * Drag-and-drop orqali yuborilgan yangi tree tuzilmasini saqlaydi —
     * har bir node uchun `parent_id` va `order`ni yangilaydi.
     *
     * @param array<int, array{id: int, children: array}> $tree
     */
    public function reorder(Menu $menu, array $tree): void
    {
        DB::transaction(function () use ($menu, $tree) {
            $this->applyOrder($menu, $tree, null);
        });
    }

    private function applyOrder(Menu $menu, array $nodes, ?int $parentId): void
    {
        foreach ($nodes as $index => $node) {
            MenuItem::where('id', $node['id'])
                ->where('menu_id', $menu->id)
                ->update(['parent_id' => $parentId, 'order' => $index]);

            if (! empty($node['children'])) {
                $this->applyOrder($menu, $node['children'], $node['id']);
            }
        }
    }

    /** Berilgan barcha ID'lar shu menu'ga tegishli ekanini tekshiradi. */
    public function idsCollectedFromTree(array $tree): array
    {
        $ids = [];

        $walk = function (array $nodes) use (&$ids, &$walk) {
            foreach ($nodes as $node) {
                $ids[] = $node['id'];
                if (! empty($node['children'])) {
                    $walk($node['children']);
                }
            }
        };

        $walk($tree);

        return $ids;
    }
}
