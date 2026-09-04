# Skill: Yangi Modul Qo'shish

## Trigger
"yangi modul", "crud yarat", "modul scaffold"

## Tartib — har yangi modul uchun

```bash
# 1. Migration
php artisan make:migration create_[table]_table
# (fieldlarni yozing)
php artisan migrate

# 2. CRUD generator
php artisan crud:generate [ModelName]

# 3. ServiceProvider-ni ro'yxatga olish
# bootstrap/providers.php ga qo'shing:
# App\Modules\[Name]\[Name]ServiceProvider::class,

# 4. Permission-larni seed qiling
php artisan db:seed --class=RolePermissionSeeder

# 5. Tekshirish
php artisan route:list | grep [table]
npm run type-check
```

## Natija
```
app/Modules/[Name]/
  Controllers/[Name]Controller.php
  Models/[Name].php
  Services/[Name]Service.php
  Requests/Store[Name]Request.php
  Requests/Update[Name]Request.php
  Migrations/
  routes.php
  [Name]ServiceProvider.php

resources/js/Pages/[Name]/
  Index.tsx
  Create.tsx
  Edit.tsx

Permissions: [table].view/create/edit/delete
Route: /admin/[table]
```
