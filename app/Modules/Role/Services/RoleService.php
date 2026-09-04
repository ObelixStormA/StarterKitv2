<?php

namespace App\Modules\Role\Services;

use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return Role::query()
            ->withCount('permissions')
            ->when(
                $filters['search'] ?? null,
                fn ($q, $s) => $q->where('name', 'like', "%{$s}%")
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    public function create(array $data): Role
    {
        $role = Role::create(['name' => $data['name']]);
        $role->syncPermissions($data['permissions'] ?? []);

        return $role;
    }

    public function update(Role $role, array $data): Role
    {
        $role->update(['name' => $data['name']]);
        $role->syncPermissions($data['permissions'] ?? []);

        return $role->fresh();
    }

    public function delete(Role $role): void
    {
        $role->delete();
    }

    /**
     * Permissionlarni modul bo'yicha guruhlab qaytaradi.
     * ['users' => ['view', 'ownview', 'create', 'edit', 'delete'], ...]
     */
    public function groupedPermissions(): array
    {
        return Permission::all()
            ->groupBy(fn (Permission $permission) => explode('.', $permission->name)[0])
            ->map(fn ($permissions) => $permissions->pluck('name')->values())
            ->toArray();
    }
}
