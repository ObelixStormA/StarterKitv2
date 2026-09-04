# Laravel 13 + React 19 + Inertia.js — Modulli Monolit

## Loyiha holati
- **Laravel 13** toza o'rnatilgan
- **Keyingi qadam:** `php artisan breeze:install react --typescript --pest`

## Tech Stack

### Backend
- **Laravel 13** + PHP 8.4 — bitta ilova, bitta deploy
- **Inertia.js 3** — API yo'q, CORS yo'q, session auth
- **Spatie Permission** — RBAC (`module.action` format)
- **Laravel Queue** — Redis orqali async vazifalar
- **PostgreSQL** — bitta DB

### Frontend (Laravel ichida)
- **React 19** + TypeScript (strict)
- **Inertia.js** — `useForm`, `router`, `Link`, `usePage`
- **shadcn/ui** — rasmiy Breeze kit bilan keladi
- **Tailwind CSS 4** — utility-first
- **Vite 6** — tez HMR

### Modullar (`app/Modules/`)
- **Auth** — login, register, reset, verify (Breeze tayyor qiladi)
- **User** — CRUD, profil, avatar, rol tayinlash
- **Role** — rollar va permissionlar boshqaruvi
- **File** — yuklash, media kutubxona, large file (TUS)
- **Notification** — email, in-app xabarlar
- **Setting** — tizim sozlamalari
- **Audit** — faoliyat logi

## Papka tuzilmasi
```
myapp/
├── app/
│   ├── Modules/                ← Biznes modullari
│   │   ├── User/
│   │   │   ├── Controllers/
│   │   │   ├── Models/
│   │   │   ├── Services/
│   │   │   ├── Requests/
│   │   │   ├── Migrations/
│   │   │   ├── routes.php
│   │   │   └── UserServiceProvider.php
│   │   ├── Role/
│   │   ├── File/
│   │   ├── Setting/
│   │   └── Audit/
│   └── Shared/                 ← BaseController, Traits, Helpers
├── resources/js/
│   ├── Pages/                  ← React/Inertia sahifalari (.tsx)
│   │   ├── Auth/               ← Breeze tayyor
│   │   ├── Dashboard/
│   │   ├── User/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   └── Edit.tsx
│   │   ├── Role/
│   │   └── File/
│   ├── Layouts/
│   │   ├── AdminLayout.tsx     ← Sidebar + header
│   │   └── AuthLayout.tsx
│   ├── Components/
│   │   ├── ui/                 ← shadcn/ui (teginma)
│   │   └── shared/             ← DataTable, PageHeader, ConfirmDialog
│   ├── hooks/
│   │   ├── usePermission.ts
│   │   └── useToast.ts
│   └── types/
│       ├── index.d.ts
│       └── models.d.ts
├── bootstrap/providers.php     ← Modul ServiceProvider ro'yxati
└── docker-compose.yml
```

## Claude uchun qoidalar
1. Frontend: faqat `.tsx` fayllar, hech qachon `.jsx` yoki `.vue`
2. `useForm`, `router`, `Link`, `usePage` — `@inertiajs/react` dan
3. Axios ishlatma — Inertia o'zi boshqaradi
4. Permission: `can('users.view')` — `usePermission` hook orqali
5. Modul qo'shganda: ServiceProvider → `bootstrap/providers.php`
6. CRUD: `php artisan crud:generate ModelName` — bitta buyruq
7. TypeScript strict — `any` ishlatma, interfeys yoz
8. shadcn/ui komponentlari `@/Components/ui/` dan import qilinadi

## Kod standartlari
- PHP: PSR-12, Laravel 13, PHP 8.4 features (readonly, match, fibers)
- TS/React: ESLint + Prettier, React 19 hooks, arrow functions
- Git: Conventional Commits
- Test: Pest (backend), Vitest (frontend)
- Permission format: `modul.amal` — `users.view`, `files.upload`

## Agentlar
- `architect` — modulli monolit dizayn qarorlari
- `backend-dev` — Laravel controller, model, service, migration
- `frontend-dev` — React/Inertia TSX sahifalar
- `security` — Spatie RBAC, session auth, policy
- `crud-generator` — yangi modul scaffold
- `devops` — Docker, deploy, CI/CD
