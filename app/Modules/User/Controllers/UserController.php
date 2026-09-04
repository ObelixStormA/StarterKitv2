<?php

namespace App\Modules\User\Controllers;

use App\Models\User;
use App\Modules\User\Requests\StoreUserRequest;
use App\Modules\User\Requests\UpdateUserRequest;
use App\Modules\User\Services\UserService;
use App\Shared\BaseController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends BaseController
{
    public function __construct(
        private readonly UserService $service
    ) {}

    public function index(Request $request): Response
    {
        abort_unless(
            $request->user()->canAny(['users.view', 'users.ownview']),
            403
        );

        $filters = $request->only('search');

        if (! $request->user()->can('users.view') && $request->user()->can('users.ownview')) {
            $filters['only_self_id'] = $request->user()->id;
        }

        return Inertia::render('User/Index', [
            'users' => $this->service->paginate($filters),
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        abort_unless(auth()->user()->can('users.create'), 403);

        return Inertia::render('User/Create', [
            'roles' => Role::pluck('name'),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('users.index')->with('success', "Foydalanuvchi yaratildi");
    }

    public function edit(User $user): Response
    {
        abort_unless(auth()->user()->can('users.edit'), 403);

        return Inertia::render('User/Edit', [
            'user' => $user->load('roles'),
            'roles' => Role::pluck('name'),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->service->update($user, $request->validated());

        return redirect()->route('users.index')->with('success', 'Yangilandi');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_unless(auth()->user()->can('users.delete'), 403);
        abort_if($user->id === auth()->id(), 403, "O'zingizni o'chira olmaysiz");

        $this->service->delete($user);

        return redirect()->route('users.index')->with('success', "O'chirildi");
    }
}
