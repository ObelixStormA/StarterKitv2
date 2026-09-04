# Agent: Security

## Role
Session auth, Spatie Permission RBAC, middleware va
input validatsiyani implement qilasan. JWT yo'q.

## Trigger
"auth", "permission", "rol", "policy", "middleware",
"ruxsat", "xavfsizlik", "CSRF"

## Auth arxitekturasi — Session based

```
Browser → [Inertia Request + CSRF token] → Laravel
                                               ↓
                                    [Session auth check]
                                               ↓
                                   [Spatie Permission check]
                                               ↓
                                    Controller → Inertia::render()
```

JWT ishlatilmaydi — sabab:
- Inertia session orqali ishlaydi
- CSRF Laravel o'zi boshqaradi (Breeze o'rnatadi)
- Refresh token muammo yo'q
- Server-side session revoke oson

## Spatie Permission sozlash

### AppServiceProvider — super-admin bypass
```php
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::before(function ($user, $ability) {
        if ($user->hasRole('super-admin')) {
            return true;
        }
    });
}
```

### Permission naming — `module.action` format
```php
// Barcha permission-lar shu formatda:
'users.view'      'users.create'    'users.edit'    'users.delete'
'roles.view'      'roles.create'    'roles.edit'    'roles.delete'
'files.view'      'files.upload'    'files.delete'
'settings.view'   'settings.edit'
'audit.view'      'audit.export'
```

### RolePermissionSeeder
```php
<?php
use Spatie\Permission\Models\{Role, Permission};

$modules = [
    'users'    => ['view', 'create', 'edit', 'delete'],
    'roles'    => ['view', 'create', 'edit', 'delete'],
    'files'    => ['view', 'upload', 'delete'],
    'settings' => ['view', 'edit'],
    'audit'    => ['view', 'export'],
];

foreach ($modules as $module => $actions) {
    foreach ($actions as $action) {
        Permission::firstOrCreate(['name' => "{$module}.{$action}"]);
    }
}

$superAdmin = Role::firstOrCreate(['name' => 'super-admin']);
$admin      = Role::firstOrCreate(['name' => 'admin']);
$manager    = Role::firstOrCreate(['name' => 'manager']);
$user       = Role::firstOrCreate(['name' => 'user']);

$admin->syncPermissions(Permission::all());
$manager->syncPermissions([
    'users.view', 'users.create',
    'files.view', 'files.upload',
]);
$user->syncPermissions(['files.view', 'files.upload']);
```

## Controller-da permission tekshirish

```php
// Usul 1 — abort_unless (oddiy)
public function index(): Response
{
    abort_unless(auth()->user()->can('users.view'), 403);
    return Inertia::render('User/Index', [...]);
}

// Usul 2 — middleware route-da
Route::resource('users', UserController::class)
    ->middleware('can:users.view');

// Usul 3 — Policy (murakkab logika uchun)
public function update(Request $request, User $user): RedirectResponse
{
    $this->authorize('update', $user); // Policy orqali
}
```

## Policy — murakkab ruxsat logikasi

```php
<?php
// app/Modules/User/Policies/UserPolicy.php
namespace App\Modules\User\Policies;

use App\Modules\User\Models\User;

class UserPolicy
{
    // O'zini yoki admin bo'lsa tahrirlash
    public function update(User $authUser, User $target): bool
    {
        return $authUser->id === $target->id
            || $authUser->can('users.edit');
    }

    // O'zini o'chira olmaydi
    public function delete(User $authUser, User $target): bool
    {
        return $authUser->id !== $target->id
            && $authUser->can('users.delete');
    }
}
```

## Inertia-da CSRF

```tsx
// React-da CSRF automatic — Inertia o'zi boshqaradi
// Breeze o'rnatganda axios CSRF token sozlanadi
// Qo'shimcha hech narsa qilish kerak emas

// Faqat method override kerak bo'lganda:
<Link href={`/admin/users/${id}`} method="delete" as="button">
    O'chirish
</Link>
```

## Rate Limiting — login himoya

```php
// app/Modules/Auth/Controllers/AuthController.php
use Illuminate\Support\Facades\RateLimiter;

public function login(LoginRequest $request): RedirectResponse
{
    $key = 'login.' . $request->ip();

    if (RateLimiter::tooManyAttempts($key, 5)) {
        $seconds = RateLimiter::availableIn($key);
        return back()->withErrors([
            'email' => "Juda ko'p urinish. {$seconds} soniya kuting.",
        ]);
    }

    if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
        RateLimiter::hit($key, 60);
        return back()->withErrors(['email' => 'Email yoki parol noto\'g\'ri']);
    }

    RateLimiter::clear($key);
    $request->session()->regenerate();

    return redirect()->intended('/dashboard');
}
```

## Frontend-da permission tekshirish

```tsx
// hooks/usePermission.ts — barcha sahifalarda ishlating
const { can, hasRole } = usePermission()

// Tugmani ko'rsatish/yashirish
{can('users.create') && (
    <Button asChild>
        <Link href="/admin/users/create">Yangi</Link>
    </Button>
)}

// Sahifaga kirish himoyasi — backend ham tekshiradi
// Frontend tekshiruvi faqat UI uchun, asosiy himoya backendda
```

## Security Checklist
- [ ] `Gate::before` super-admin uchun sozlangan
- [ ] Barcha route-lar `auth` middleware-da
- [ ] Har controller-da `abort_unless` yoki `authorize`
- [ ] Rate limiting login endpointda
- [ ] `$fillable` — mass assignment himoya
- [ ] CSRF — Inertia o'zi boshqaradi (Breeze bilan)
- [ ] Password `bcrypt` — Laravel default
- [ ] Soft deletes muhim modellarda
- [ ] File upload — mime type va hajm validatsiyasi
- [ ] SQL injection — faqat Eloquent/QueryBuilder
