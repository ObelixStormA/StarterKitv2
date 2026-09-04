<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Har bir modul uchun standart amallar to'plami.
     */
    protected array $actions = ['view', 'ownview', 'create', 'edit', 'delete'];

    /**
     * RBAC bilan boshqariladigan modullar.
     */
    protected array $modules = [
        'users',
        'roles',
        'files',
        'notifications',
        'settings',
        'audit',
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach ($this->modules as $module) {
            foreach ($this->actions as $action) {
                Permission::firstOrCreate(['name' => "{$module}.{$action}"]);
            }
        }

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());

        $manager = Role::firstOrCreate(['name' => 'manager']);
        $manager->syncPermissions(
            Permission::whereIn('name', [
                'users.view', 'users.ownview', 'users.edit',
                'files.view', 'files.ownview', 'files.create', 'files.edit', 'files.delete',
                'notifications.view', 'notifications.ownview',
                'settings.view',
            ])->get()
        );

        $user = Role::firstOrCreate(['name' => 'user']);
        $user->syncPermissions(
            Permission::whereIn('name', [
                'files.ownview', 'files.create', 'files.edit', 'files.delete',
                'notifications.ownview',
            ])->get()
        );

        $adminUser = User::firstWhere('email', 'admin@admin.com');
        $adminUser?->syncRoles(['admin']);
    }
}
