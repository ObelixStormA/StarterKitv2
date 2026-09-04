# Skill: Debug va Troubleshooting

## Trigger
"xato", "ishlamayapti", "error", "debug", "muammo"

## Tez diagnostika

### Laravel log
```bash
docker compose exec app tail -f storage/logs/laravel.log
docker compose exec app php artisan tinker
>>> User::find(1)->getAllPermissions()->pluck('name')
>>> User::find(1)->can('users.view')
```

### Tez-tez uchraydigan xatolar

#### "Class not found" — ServiceProvider yo'q
```bash
grep "ModuleName" bootstrap/providers.php
docker compose exec app composer dump-autoload
```

#### 403 Forbidden — permission yo'q
```bash
docker compose exec app php artisan tinker
>>> $u = User::find(1)
>>> $u->getRoleNames()
>>> $u->getAllPermissions()->pluck('name')
>>> $u->can('users.view')
```

#### "Inertia page not found"
```bash
# Controller: Inertia::render('User/Index')
# Fayl: resources/js/Pages/User/Index.tsx
ls resources/js/Pages/User/
```

#### TypeScript xato
```bash
npm run type-check
npm run build 2>&1 | head -30
```

#### Migration topilmadi
```bash
# ServiceProvider da loadMigrationsFrom() bor?
docker compose exec app php artisan migrate:status
```

#### Vite HMR ishlamayapti
```bash
docker compose logs -f vite
# vite.config.ts da server.host: '0.0.0.0' bo'lsin
```

### Performance
```bash
# N+1 muammo — Debugbar
composer require barryvdh/laravel-debugbar --dev
# http://localhost?_debugbar=true
```

### Checklist
- [ ] `storage/logs/laravel.log` ko'rildi
- [ ] `php artisan route:list` route mavjud
- [ ] `php artisan config:clear && config:cache` qilindi
- [ ] `composer dump-autoload` qilindi
- [ ] Permission seed qayta qilindi
- [ ] TypeScript xatolar tekshirildi
