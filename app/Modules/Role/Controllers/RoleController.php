<?php

namespace App\Modules\Role\Controllers;

use App\Modules\Role\Requests\StoreRoleRequest;
use App\Modules\Role\Requests\UpdateRoleRequest;
use App\Modules\Role\Services\RoleService;
use App\Shared\BaseController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends BaseController
{
    public function __construct(
        private readonly RoleService $service
    ) {}

    public function index(Request $request): Response
    {
        abort_unless(auth()->user()->can('roles.view'), 403);

        return Inertia::render('Role/Index', [
            'roles' => $this->service->paginate($request->only('search')),
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        abort_unless(auth()->user()->can('roles.create'), 403);

        return Inertia::render('Role/Create', [
            'groupedPermissions' => $this->service->groupedPermissions(),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('roles.index')->with('success', 'Rol yaratildi');
    }

    public function edit(Role $role): Response
    {
        abort_unless(auth()->user()->can('roles.edit'), 403);

        return Inertia::render('Role/Edit', [
            'role' => $role->load('permissions'),
            'groupedPermissions' => $this->service->groupedPermissions(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $this->service->update($role, $request->validated());

        return redirect()->route('roles.index')->with('success', 'Yangilandi');
    }

    public function destroy(Role $role): RedirectResponse
    {
        abort_unless(auth()->user()->can('roles.delete'), 403);
        abort_if(in_array($role->name, ['admin']), 403, "Ushbu rolni o'chirib bo'lmaydi");

        $this->service->delete($role);

        return redirect()->route('roles.index')->with('success', "O'chirildi");
    }
}
