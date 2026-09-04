# Agent: Backend Developer (Laravel 13)

## Role
Laravel 13 modulli monolit ichida modul yaratish, controller, model,
service, migration yozish. Inertia::render() bilan React sahifaga data uzatish.

## Trigger
"controller yoz", "model yarat", "migration", "service", "route qo'sh",
"Inertia render", "backend logika"

## ServiceProvider — har modul uchun

```php
<?php
// app/Modules/User/UserServiceProvider.php
namespace App\Modules\User;

use Illuminate\Support\ServiceProvider;

class UserServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/routes.php');
        $this->loadMigrationsFrom(__DIR__ . '/Migrations');
    }

    public function register(): void
    {
        $this->app->scoped(
            \App\Modules\User\Services\UserService::class
        );
    }
}
```

```php
// bootstrap/providers.php
return [
    App\Providers\AppServiceProvider::class,
    App\Modules\User\UserServiceProvider::class,
    App\Modules\Role\RoleServiceProvider::class,
    App\Modules\File\FileServiceProvider::class,
    App\Modules\Setting\SettingServiceProvider::class,
    App\Modules\Audit\AuditServiceProvider::class,
];
```

## Controller — Inertia::render() bilan

```php
<?php
// app/Modules/User/Controllers/UserController.php
namespace App\Modules\User\Controllers;

use App\Shared\BaseController;
use App\Modules\User\Models\User;
use App\Modules\User\Services\UserService;
use App\Modules\User\Requests\StoreUserRequest;
use App\Modules\User\Requests\UpdateUserRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UserController extends BaseController
{
    public function __construct(
        private readonly UserService $service
    ) {}

    public function index(): Response
    {
        abort_unless(auth()->user()->can('users.view'), 403);

        return Inertia::render('User/Index', [
            'users'   => $this->service->paginate(request()->all()),
            'filters' => request()->only('search', 'role'),
        ]);
    }

    public function create(): Response
    {
        abort_unless(auth()->user()->can('users.create'), 403);

        return Inertia::render('User/Create', [
            'roles' => \Spatie\Permission\Models\Role::all(['id', 'name']),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('users.index')
            ->with('success', 'Foydalanuvchi yaratildi');
    }

    public function edit(User $user): Response
    {
        abort_unless(auth()->user()->can('users.edit'), 403);

        return Inertia::render('User/Edit', [
            'user'  => $user->load('roles'),
            'roles' => \Spatie\Permission\Models\Role::all(['id', 'name']),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->service->update($user, $request->validated());

        return redirect()->route('users.index')
            ->with('success', 'Yangilandi');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_unless(auth()->user()->can('users.delete'), 403);
        $this->service->delete($user);

        return redirect()->route('users.index')
            ->with('success', 'O\'chirildi');
    }
}
```

## Service Class

```php
<?php
// app/Modules/User/Services/UserService.php
namespace App\Modules\User\Services;

use App\Modules\User\Models\User;
use App\Modules\User\Events\UserCreated;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return User::query()
            ->with('roles')
            ->when($filters['search'] ?? null,
                fn($q, $s) => $q->where('name', 'like', "%{$s}%")
                               ->orWhere('email', 'like', "%{$s}%")
            )
            ->when($filters['role'] ?? null,
                fn($q, $r) => $q->role($r)
            )
            ->latest()
            ->paginate(20)
            ->withQueryString();
    }

    public function create(array $data): User
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        if (!empty($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        event(new UserCreated($user));

        return $user;
    }

    public function update(User $user, array $data): User
    {
        $user->update(array_filter([
            'name'     => $data['name']     ?? null,
            'email'    => $data['email']    ?? null,
            'password' => isset($data['password'])
                            ? Hash::make($data['password']) : null,
        ]));

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return $user->fresh('roles');
    }

    public function delete(User $user): void
    {
        $user->delete();
    }
}
```

## Routes

```php
<?php
// app/Modules/User/routes.php
use App\Modules\User\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('users.')
    ->group(function () {
        Route::resource('users', UserController::class);
    });
```

## Model

```php
<?php
// app/Modules/User/Models/User.php
namespace App\Modules\User\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use Notifiable, HasRoles;

    protected $fillable = ['name', 'email', 'password', 'avatar'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }
}
```

## Form Request

```php
<?php
// app/Modules/User/Requests/StoreUserRequest.php
namespace App\Modules\User\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('users.create');
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'min:2', 'max:100'],
            'email'    => ['required', 'email:rfc,dns', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'roles'    => ['sometimes', 'array'],
            'roles.*'  => ['exists:roles,name'],
        ];
    }
}
```

## app/Shared/BaseController.php

```php
<?php
namespace App\Shared;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller;

abstract class BaseController extends Controller
{
    use AuthorizesRequests;
}
```

## Inertia Shared Data — AppServiceProvider

```php
Inertia::share([
    'auth' => function () {
        if (!auth()->check()) return null;
        $user = auth()->user();
        return [
            'user' => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'avatar'      => $user->avatar,
                'roles'       => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ];
    },
    'flash' => fn() => [
        'success' => session('success'),
        'error'   => session('error'),
    ],
]);
```

## Checklist — har yangi modul
- [ ] `app/Modules/[Name]/` papkasi yaratildi
- [ ] `[Name]ServiceProvider` yaratildi
- [ ] `bootstrap/providers.php` ga qo'shildi
- [ ] Migration yaratildi va migrate qilindi
- [ ] Model + Service + Controller + Requests tayyor
- [ ] `routes.php` yozildi, route nomlari berildi
- [ ] Permission-lar `RolePermissionSeeder` ga qo'shildi
- [ ] React sahifalar yaratildi (`Pages/[Name]/`)
- [ ] Pest test yozildi
