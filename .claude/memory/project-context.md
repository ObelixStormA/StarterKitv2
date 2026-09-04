# Loyiha Kontekst

## Joriy holat
- **Laravel 13** toza o'rnatilgan
- **Keyingi qadam:** `php artisan breeze:install react --typescript --pest`

## Tanlangan Stack
| Layer | Texnologiya | Izoh |
|-------|-------------|------|
| Backend | Laravel 13 + PHP 8.4 | Bitta ilova |
| Frontend | React 19 + TypeScript | Laravel ichida |
| Ko'prik | Inertia.js 3 | API yo'q, CORS yo'q |
| UI | shadcn/ui + Tailwind 4 | Breeze bilan keladi |
| RBAC | Spatie Permission | `module.action` format |
| CRUD | necro304/crud-inertia-shadcn | Avtomatik scaffold |
| DB | PostgreSQL | Bitta DB |
| Test | Pest | Laravel 13 default |
| Auth | Session (Breeze) | JWT emas |

## Arxitektura qarorlari (ADR)
1. **Inertia.js** — JWT/Axios o'rniga. Sodda, session auth, CSRF tayyor
2. **React 19** — Vue o'rniga. Keng ekosistema, tayyor templatelar ko'p
3. **Session auth** — JWT emas. Monolit uchun ortiqcha murakkablik
4. **Modulli tuzilma** — `app/Modules/` ichida. Kelajakda microservice oson
5. **shadcn/ui** — Rasmiy Breeze kit ishlatadi. Teginmaslik kerak
6. **Pest** — PHPUnit emas. Laravel 13 default
7. **PostgreSQL** — SQLite production uchun emas

## O'rnatish tartibi (hali bajarilmagan)
```bash
# 1. Breeze + React + TypeScript
composer require laravel/breeze --dev
php artisan breeze:install react --typescript --pest
npm install && npm run dev

# 2. Spatie Permission
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate

# 3. CRUD Generator
composer require necro304/crud-inertia-shadcn

# 4. Modullar papkasini yaratish
mkdir -p app/Modules app/Shared/Traits app/Shared/Helpers

# 5. AppServiceProvider-da Inertia share va Gate::before
# 6. RolePermissionSeeder yozish va seed qilish
```

## Modul holati
| Modul | Status | Permission-lar |
|-------|--------|----------------|
| Auth | Breeze tayyor qiladi | login, register, reset |
| User | Rejalashtirilgan | users.view/create/edit/delete |
| Role | Rejalashtirilgan | roles.view/create/edit/delete |
| File | Rejalashtirilgan | files.view/upload/delete |
| Notification | Rejalashtirilgan | — |
| Audit | Rejalashtirilgan | audit.view/export |
| Setting | Rejalashtirilgan | settings.view/edit |

## Muhim URL-lar (local)
- App: http://localhost
- Vite HMR: http://localhost:5173
- Mailpit: http://localhost:8025
