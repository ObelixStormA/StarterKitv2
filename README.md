<p align="center">
  <img src="public/assets/logo/logo.svg" width="260" alt="StarterKitV2 Logo">
</p>

<p align="center">
  <strong>Laravel 13 + React 19 + Inertia.js</strong> — Modular Admin Panel Starter Kit
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PHP-8.3+-777BB4?logo=php&logoColor=white" alt="PHP 8.3+">
  <img src="https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white" alt="Laravel 13">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Inertia.js-2-9553E9?logo=inertia&logoColor=white" alt="Inertia.js 2">
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
</p>

<p align="center">
  <a href="#-english">English</a> •
  <a href="#-oʻzbekcha">Oʻzbekcha</a> •
  <a href="#-русский">Русский</a>
</p>

---

## 🇬🇧 English

### What is this?

**StarterKitV2** is an admin panel starter kit built on **Laravel** and **React**, glued together with **Inertia.js** — no API layer, no CORS, one app, one deploy. Every CRUD module follows the same pattern (`Controller → Service → Request → React pages`), so adding a new module takes minutes, not hours.

### Features

- 🔐 **RBAC (Spatie Permission)** — granular `view / ownview / create / edit / delete` permissions per module, full user & role management
- ⚙️ **Dynamic settings** — key-value settings split into `admin`/`site` groups (text, number, boolean, image upload, etc.), plus a dedicated branding panel (logo + site name)
- 📁 **File manager** — upload, auto-categorization (image/video/audio/document/archive), storage usage stats
- 👤 **Account settings** — profile, avatar upload, password change, account deletion
- 🌍 **3 languages** — Uzbek, Russian, English (fully translated frontend)
- 🔔 **SweetAlert2** — polished confirmation dialogs and toast notifications for every CRUD action
- 🎨 **Tailwind CSS** design system — responsive, theme-ready
- 🧩 **Modular monolith architecture** — `app/Modules/{User,Role,Setting,File}`, each self-contained with its own Controller/Service/Request/Migrations

### Tech stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 19, TypeScript (strict) |
| Bridge | Inertia.js 2 — no API/CORS, session auth |
| RBAC | Spatie Laravel Permission |
| Styling | Tailwind CSS |
| Notifications | SweetAlert2 |
| Database | PostgreSQL (or any Laravel-supported DB) |

### Project structure

```
app/
  Modules/           ← One folder per business module: User, Role, Setting, File
    <Module>/
      Controllers/
      Services/
      Requests/
      Migrations/
      <Module>ServiceProvider.php
      routes.php
  Shared/            ← BaseController and shared helpers
resources/js/
  Pages/             ← Inertia pages (.tsx)
  Layouts/           ← AuthenticatedLayout, AuthLayout
  Components/        ← Reusable UI components
  i18n/              ← uz/ru/en translation dictionaries
  hooks/             ← usePermission, useFlashToasts
  lib/               ← swal, format helpers
```

### Installation

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate
php artisan db:seed
php artisan storage:link

npm run build   # or: npm run dev
```

Default admin account (created by the seeder):

```
Email:    admin@admin.com
Password: password
```

### License

Released under the [MIT license](https://opensource.org/licenses/MIT).

<br>

---

## 🇺🇿 Oʻzbekcha

### Nima bu?

**StarterKitV2** — Laravel va React'ni Inertia.js orqali birlashtirgan, tayyor RBAC, sozlamalar tizimi, fayl menejeri va ko'p tillilik bilan jihozlangan **admin panel boshlang'ich shabloni**. API yo'q, CORS yo'q — bitta ilova, bitta deploy.

Har bir CRUD modul bir xil naqsh bo'yicha qurilgan (`Controller → Service → Request → React sahifalar`), shuning uchun yangi modul qo'shish daqiqalar ichida bajariladi.

### Xususiyatlar

- 🔐 **RBAC (Spatie Permission)** — har bir modul uchun `view / ownview / create / edit / delete` granulyar ruxsatlar, rol va foydalanuvchi boshqaruvi
- ⚙️ **Dinamik sozlamalar** — `admin`/`site` guruhlariga bo'lingan key-value sozlamalar (matn, raqam, ha/yo'q, rasm yuklash va h.k.), brendlash paneli (logo + sayt nomi)
- 📁 **Fayl menejeri** — yuklash, turlar bo'yicha guruhlash (rasm/video/audio/hujjat/arxiv), xotira statistikasi
- 👤 **Hisob sozlamalari** — profil, avatar yuklash, parol o'zgartirish, hisobni o'chirish
- 🌍 **3 tillilik** — O'zbekcha, Русский, English (frontend to'liq tarjima qilingan)
- 🔔 **SweetAlert2** — barcha CRUD amallar uchun chiroyli tasdiqlash va bildirishnoma oynalari
- 🎨 **Tailwind CSS** dizayn tizimi — moslashuvchan, mavzu qo'llab-quvvatlashga tayyor
- 🧩 **Modulli monolit arxitektura** — `app/Modules/{User,Role,Setting,File}` — har biri o'z Controller/Service/Request/Migration to'plami bilan mustaqil

### Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 19, TypeScript (strict) |
| Ko'prik | Inertia.js 2 — API/CORS yo'q, session auth |
| RBAC | Spatie Laravel Permission |
| Stil | Tailwind CSS |
| Bildirishnoma | SweetAlert2 |
| DB | PostgreSQL (yoki har qanday Laravel qo'llab-quvvatlaydigan DB) |

### Papka tuzilmasi

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

### O'rnatish

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

### Litsenziya

[MIT litsenziyasi](https://opensource.org/licenses/MIT) asosida tarqatiladi.

<br>

---

## 🇷🇺 Русский

### Что это?

**StarterKitV2** — стартовый набор для админ-панели на основе **Laravel** и **React**, связанных через **Inertia.js** — без API-слоя, без CORS, одно приложение, один деплой. Каждый CRUD-модуль построен по одному и тому же шаблону (`Controller → Service → Request → React-страницы`), поэтому добавление нового модуля занимает минуты, а не часы.

### Возможности

- 🔐 **RBAC (Spatie Permission)** — детализированные права `view / ownview / create / edit / delete` для каждого модуля, полное управление пользователями и ролями
- ⚙️ **Динамические настройки** — настройки ключ-значение, разделённые на группы `admin`/`site` (текст, число, да/нет, загрузка изображений и т.д.), плюс отдельная панель брендинга (логотип + название сайта)
- 📁 **Файловый менеджер** — загрузка, автоматическая категоризация (изображения/видео/аудио/документы/архивы), статистика использования хранилища
- 👤 **Настройки аккаунта** — профиль, загрузка аватара, смена пароля, удаление аккаунта
- 🌍 **3 языка** — узбекский, русский, английский (полностью переведённый интерфейс)
- 🔔 **SweetAlert2** — аккуратные диалоги подтверждения и всплывающие уведомления для каждого CRUD-действия
- 🎨 **Дизайн-система Tailwind CSS** — адаптивная, готова к темизации
- 🧩 **Модульная монолитная архитектура** — `app/Modules/{User,Role,Setting,File}`, каждый модуль самодостаточен со своими Controller/Service/Request/Migrations

### Технологии

| Слой | Технология |
|---|---|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 19, TypeScript (strict) |
| Мост | Inertia.js 2 — без API/CORS, аутентификация через сессии |
| RBAC | Spatie Laravel Permission |
| Стили | Tailwind CSS |
| Уведомления | SweetAlert2 |
| БД | PostgreSQL (или любая БД, поддерживаемая Laravel) |

### Структура проекта

```
app/
  Modules/           ← Одна папка на бизнес-модуль: User, Role, Setting, File
    <Module>/
      Controllers/
      Services/
      Requests/
      Migrations/
      <Module>ServiceProvider.php
      routes.php
  Shared/            ← BaseController и общие хелперы
resources/js/
  Pages/             ← Страницы Inertia (.tsx)
  Layouts/           ← AuthenticatedLayout, AuthLayout
  Components/        ← Переиспользуемые UI-компоненты
  i18n/              ← Словари переводов uz/ru/en
  hooks/             ← usePermission, useFlashToasts
  lib/               ← Хелперы swal, format
```

### Установка

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate
php artisan db:seed
php artisan storage:link

npm run build   # или: npm run dev
```

Аккаунт администратора по умолчанию (создаётся сидером):

```
Email:  admin@admin.com
Пароль: password
```

### Лицензия

Распространяется под лицензией [MIT](https://opensource.org/licenses/MIT).
