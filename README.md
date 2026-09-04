<p align="center">
  <img src="public/assets/logo/logo.svg" width="260" alt="StarterKitV2 Logo">
</p>

<p align="center">
  <strong>Laravel 13 + React 19 + Inertia.js</strong> — modulli monolit admin panel starter kit
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PHP-8.3+-777BB4?logo=php&logoColor=white" alt="PHP 8.3+">
  <img src="https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white" alt="Laravel 13">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Inertia.js-2-9553E9?logo=inertia&logoColor=white" alt="Inertia.js 2">
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
</p>

---

## Nima bu?

**StarterKitV2** — Laravel va React'ni Inertia.js orqali birlashtirgan, tayyor RBAC, sozlamalar tizimi, fayl menejeri va ko'p tillilik bilan jihozlangan **admin panel boshlang'ich shabloni**. API yo'q, CORS yo'q — bitta ilova, bitta deploy.

Har bir CRUD modul bir xil naqsh bo'yicha qurilgan (`Controller → Service → Request → React sahifalar`), shuning uchun yangi modul qo'shish daqiqalar ichida bajariladi.

## Xususiyatlar

- 🔐 **RBAC (Spatie Permission)** — har bir modul uchun `view / ownview / create / edit / delete` granulyar ruxsatlar, rol va foydalanuvchi boshqaruvi
- ⚙️ **Dinamik sozlamalar** — `admin`/`site` guruhlariga bo'lingan key-value sozlamalar (matn, raqam, ha/yo'q, rasm yuklash va h.k.), brendlash paneli (logo + sayt nomi)
- 📁 **Fayl menejeri** — yuklash, turlar bo'yicha guruhlash (rasm/video/audio/hujjat/arxiv), xotira statistikasi
- 👤 **Hisob sozlamalari** — profil, avatar yuklash, parol o'zgartirish, hisobni o'chirish
- 🌍 **3 tillilik** — O'zbekcha, Русский, English (frontend to'liq tarjima qilingan)
- 🔔 **SweetAlert2** — barcha CRUD amallar uchun chiroyli tasdiqlash va bildirishnoma oynalari
- 🎨 **Tailwind CSS** dizayn tizimi — moslashuvchan, ochiq/qorong'i mavzu qo'llab-quvvatlashga tayyor
- 🧩 **Modulli monolit arxitektura** — `app/Modules/{User,Role,Setting,File}` — har biri o'z Controller/Service/Request/Migration to'plami bilan mustaqil

## Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 19, TypeScript (strict) |
| Ko'prik | Inertia.js 2 — API/CORS yo'q, session auth |
| RBAC | Spatie Laravel Permission |
| Stil | Tailwind CSS |
| Bildirishnoma | SweetAlert2 |
| DB | PostgreSQL (yoki har qanday Laravel qo'llab-quvvatlaydigan DB) |

## Papka tuzilmasi

```
app/
  Modules/           ← Har bir biznes-modul: User, Role, Setting, File
    <Module>/
      Controllers/
      Services/
      Requests/
      Migrations/
      <Module>ServiceProvider.php
      routes.php
  Shared/            ← BaseController va umumiy yordamchilar
resources/js/
  Pages/             ← Inertia sahifalari (.tsx)
  Layouts/           ← AuthenticatedLayout, AuthLayout
  Components/        ← Qayta ishlatiladigan UI komponentlar
  i18n/              ← uz/ru/en tarjima lug'atlari
  hooks/             ← usePermission, useFlashToasts
  lib/               ← swal, format yordamchilari
```

## O'rnatish

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate
php artisan db:seed
php artisan storage:link

npm run build   # yoki: npm run dev
```

Standart admin hisobi (seed orqali yaratiladi):

```
Email:  admin@admin.com
Parol:  password
```

## Litsenziya

MIT litsenziyasi asosida tarqatiladi.
