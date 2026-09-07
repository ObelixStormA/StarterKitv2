<?php

namespace Database\Seeders;

use App\Modules\Menu\Models\Menu;
use App\Modules\Menu\Models\MenuItem;
use Illuminate\Database\Seeder;

/**
 * Standart "admin" va "site" menularini yaratadi.
 *
 * "admin" menu — admin panel sidebar'ida hozir turgan barcha havolalarni
 * o'z ichiga oladi (Dashboard/Administrator/Account guruhlari). Sidebar
 * shu menuning tree'sidan dinamik tarzda quriladi (HandleInertiaRequests
 * orqali har bir sahifaga ulashiladi).
 *
 * "site" menu — bo'sh boshlanadi, kelajakda saytning frontend qismidagi
 * navigatsiya uchun ishlatiladi.
 */
class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // `name`ga i18n kaliti saqlanadi — frontend `t(menu.name)` orqali
        // joriy tilga tarjima qilib ko'rsatadi (item label'lari kabi).
        $admin = Menu::updateOrCreate(['key' => 'admin'], ['name' => 'menus.system.admin_name']);
        Menu::updateOrCreate(['key' => 'site'], ['name' => 'menus.system.site_name']);

        // Qayta ishga tushirilganda eskilarini tozalab, yangidan yaratamiz —
        // shunda seeder har doim "hozirgi holat"ni aks ettiradi.
        $admin->items()->delete();

        // Label sifatida i18n kaliti saqlanadi (masalan "nav.users") — frontend
        // buni `t(label)` orqali joriy tilga tarjima qilib ko'rsatadi. Admin
        // Menu Builder orqali qo'shgan o'z elementlari uchun `t()` mos kalit
        // topa olmasa, labelning o'zini qaytaradi (LocaleProvider fallback).
        $dashboardGroup = $this->createRoot($admin, 'nav.dashboard', 0);
        $this->createChild($dashboardGroup, 'nav.dashboard', 'DashboardIcon', '/dashboard', null, 0);

        $adminGroup = $this->createRoot($admin, 'nav.administrator', 1);
        $this->createChild($adminGroup, 'nav.users', 'UsersIcon', '/admin/users', 'users.view,users.ownview', 0);
        $this->createChild($adminGroup, 'nav.roles', 'ShieldIcon', '/admin/roles', 'roles.view', 1);
        $this->createChild($adminGroup, 'nav.files', 'FolderIcon', '/admin/files', 'files.view,files.ownview', 2);
        $this->createChild($adminGroup, 'nav.settings', 'SettingsIcon', '/admin/settings', 'settings.view,settings.ownview', 3);
        $this->createChild($adminGroup, 'nav.audit', 'AuditIcon', '/admin/audit', 'audit.view', 4);
        $this->createChild($adminGroup, 'nav.menus', 'MenuIcon', '/admin/menus', 'menus.view,menus.ownview', 5);
        $this->createChild($adminGroup, 'nav.module_builder', 'WandIcon', '/admin/module-builder', 'settings.edit', 6, requiresLocal: true);

        $accountGroup = $this->createRoot($admin, 'nav.account', 2);
        $this->createChild($accountGroup, 'nav.profile', 'UserIcon', '/profile', null, 0);
    }

    private function createRoot(Menu $menu, string $label, int $order): MenuItem
    {
        return MenuItem::create([
            'menu_id' => $menu->id,
            'parent_id' => null,
            'label' => $label,
            'target' => '_self',
            'order' => $order,
        ]);
    }

    private function createChild(
        MenuItem $parent,
        string $label,
        string $icon,
        string $url,
        ?string $permission,
        int $order,
        bool $requiresLocal = false,
    ): MenuItem {
        return MenuItem::create([
            'menu_id' => $parent->menu_id,
            'parent_id' => $parent->id,
            'label' => $label,
            'icon' => $icon,
            'url' => $url,
            'target' => '_self',
            'permission' => $permission,
            'requires_local' => $requiresLocal,
            'order' => $order,
        ]);
    }
}
