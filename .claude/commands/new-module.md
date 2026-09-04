# Command: /new-module

## Sintaksis
```
/new-module [ModuleName] [field1:type field2:type ...]
```

## Misol
```
/new-module Post title:string body:text status:enum(draft,published)
/new-module Product name:string price:decimal category_id:foreignId
/new-module Tag name:string color:string slug:string
```

## Bajarilishi
1. Migration yaratish (fieldlar bilan)
2. Model, Service, Controller, Requests scaffold
3. ServiceProvider va routes.php yaratish
4. React TSX sahifalar: Index, Create, Edit
5. TypeScript interfeys qo'shish
6. Permission-lar seedga qo'shish

## Natija
```
✅ [ModuleName] moduli yaratildi
   Backend:  app/Modules/[ModuleName]/
   Frontend: resources/js/Pages/[ModuleName]/
   Routes:   /admin/[table]
   Perms:    [table].view/create/edit/delete

Keyingi qadamlar:
   php artisan migrate
   php artisan db:seed --class=RolePermissionSeeder
   npm run type-check
```
