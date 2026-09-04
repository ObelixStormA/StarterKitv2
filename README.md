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
  <img src="https://img.shields.io/badge/tests-41%20passing-brightgreen?logo=pestphp&logoColor=white" alt="41 tests passing">
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

**StarterKitV2** is a production-ready admin panel starter kit built on **Laravel** and **React**, glued together with **Inertia.js** — no API layer, no CORS, one app, one deploy. Every CRUD module follows the same pattern (`Controller → Service → Request → React pages`), so adding a new module takes minutes, not hours.

### Features

**Access control**
- 🔐 **RBAC (Spatie Permission)** — granular `view / ownview / create / edit / delete` permissions per module, full user & role management
- 🔑 **Two-factor authentication (TOTP)** — QR-code setup with Google Authenticator, recovery codes, enforced at login via a challenge screen
- ✉️ **Toggleable email verification** — turn the "must verify email" requirement on/off from Admin Settings, no redeploy needed
- 🗑️ **Soft deletes & trash** — Users and Files can be restored or permanently deleted from a dedicated trash view

**Admin & content**
- ⚙️ **Dynamic settings** — key-value settings split into `admin`/`site` groups (text, number, boolean, image upload, etc.), plus a dedicated branding panel (logo + site name)
- 📁 **File manager** — upload, auto-categorization (image/video/audio/document/archive), storage usage stats, trash/restore
- 📜 **Audit log** — every create/update/delete/restore on Users, Settings and Files is automatically recorded (who, what, when, from which IP)
- 🔔 **In-app notifications** — real database-backed notifications with a live bell dropdown, queued for delivery
- 🔍 **Global search** — instant cross-module search (users, roles, settings, files) from the header
- 👤 **Account settings** — profile, avatar upload, password change, account deletion

**Developer experience**
- 🌍 **3 languages** — Uzbek, Russian, English, both on the frontend **and** in backend validation messages (auto-synced with the UI language)
- 🔔 **SweetAlert2** — polished confirmation dialogs and toast notifications for every CRUD action
- 🎨 **Tailwind CSS** design system — responsive, theme-ready
- 🧩 **Modular monolith architecture** — `app/Modules/{User,Role,Setting,File,Audit,Notification,Search}`, each self-contained with its own Controller/Service/Request/Migrations
- ✅ **41 Pest tests** covering CRUD, RBAC, soft deletes and the audit log
- 🐳 **Docker & CI** — ready-to-use `Dockerfile` / `docker-compose.yml` and a GitHub Actions test workflow
- 🖼️ **Branded error pages** — 403/404/419/429/500/503 rendered as themed Inertia pages instead of the default Laravel screen

### Tech stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 19, TypeScript (strict) |
| Bridge | Inertia.js 2 — no API/CORS, session auth |
| RBAC | Spatie Laravel Permission |
| 2FA | pragmarx/google2fa + bacon/bacon-qr-code |
| Styling | Tailwind CSS |
| Notifications | SweetAlert2 (UI) + Laravel database notifications (in-app) |
| Testing | Pest |
| Database | PostgreSQL (or any Laravel-supported DB) |
| Queue | Database driver — **run `php artisan queue:work` in production** for emails & notifications |

### Project structure

```
app/
  Modules/           ← One folder per business module
    User/  Role/  Setting/  File/  Audit/  Notification/  Search/
      Controllers/
      Services/
      Requests/
      Migrations/
      <Module>ServiceProvider.php
      routes.php
  Shared/            ← BaseController, Auditable trait, shared helpers
  Notifications/     ← QueuedVerifyEmail, QueuedResetPassword, GeneralNotification
resources/js/
  Pages/             ← Inertia pages (.tsx)
  Layouts/           ← AuthenticatedLayout, AuthLayout
  Components/        ← Reusable UI components (incl. GlobalSearch, NotificationBell)
  i18n/              ← uz/ru/en translation dictionaries
  hooks/             ← usePermission, useFlashToasts
  lib/               ← swal, format helpers
lang/                ← uz/ru/en backend validation & auth messages
tests/Feature/       ← Pest test suite (41 tests)
docker/, Dockerfile, docker-compose.yml
.github/workflows/   ← CI test pipeline
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

> ⚠️ In production, start a queue worker (`php artisan queue:work`, ideally under Supervisor/systemd) — verification emails, password resets and in-app notifications are dispatched through the queue.

### Running tests

```bash
php artisan test
```

### Docker

```bash
docker compose up --build
```

Spins up the app (PHP-FPM), an nginx reverse proxy, PostgreSQL and a dedicated queue worker container.

### License

Released under the [MIT license](https://opensource.org/licenses/MIT).

<br>

---

## 🇺🇿 Oʻzbekcha

### Nima bu?

**StarterKitV2** — Laravel va React'ni Inertia.js orqali birlashtirgan, production uchun tayyor **admin panel boshlang'ich shabloni**. API yo'q, CORS yo'q — bitta ilova, bitta deploy. Har bir CRUD modul bir xil naqsh bo'yicha qurilgan (`Controller → Service → Request → React sahifalar`), shuning uchun yangi modul qo'shish daqiqalar ichida bajariladi.

### Xususiyatlar

**Kirish va xavfsizlik**
- 🔐 **RBAC (Spatie Permission)** — har bir modul uchun `view / ownview / create / edit / delete` granulyar ruxsatlar, rol va foydalanuvchi boshqaruvi
- 🔑 **Ikki bosqichli autentifikatsiya (TOTP)** — Google Authenticator bilan QR kod orqali sozlash, zaxira kodlar, login vaqtida majburiy tekshiruv
- ✉️ **Yoqiladigan/o'chiriladigan email tasdiqlash** — "Admin sozlamalari"dan bir tugma bilan yoqib-o'chirish mumkin, qayta deploy shart emas
- 🗑️ **Soft delete va Savat** — Foydalanuvchilar va Fayllarni alohida "Savat" sahifasidan tiklash yoki butunlay o'chirish mumkin

**Boshqaruv va kontent**
- ⚙️ **Dinamik sozlamalar** — `admin`/`site` guruhlariga bo'lingan key-value sozlamalar (matn, raqam, ha/yo'q, rasm yuklash va h.k.), brendlash paneli (logo + sayt nomi)
- 📁 **Fayl menejeri** — yuklash, turlar bo'yicha avtomatik guruhlash (rasm/video/audio/hujjat/arxiv), xotira statistikasi, savat/tiklash
- 📜 **Faoliyat jurnali (Audit Log)** — Foydalanuvchilar, Sozlamalar va Fayllardagi har bir yaratish/yangilash/o'chirish/tiklash avtomatik yoziladi (kim, nima, qachon, qaysi IP'dan)
- 🔔 **Ilova ichidagi bildirishnomalar** — haqiqiy bazaga asoslangan, navbat orqali yuboriladigan, header'da jonli ko'ringan bildirishnomalar
- 🔍 **Global qidiruv** — header orqali barcha modullar (foydalanuvchi, rol, sozlama, fayl) bo'yicha bir zumda qidirish
- 👤 **Hisob sozlamalari** — profil, avatar yuklash, parol o'zgartirish, hisobni o'chirish

**Dasturchi uchun qulayliklar**
- 🌍 **3 tillilik** — O'zbekcha, Русский, English — nafaqat frontend, balki **backend validatsiya xabarlari** ham (interfeys tili bilan avtomatik sinxron)
- 🔔 **SweetAlert2** — barcha CRUD amallar uchun chiroyli tasdiqlash va bildirishnoma oynalari
- 🎨 **Tailwind CSS** dizayn tizimi — moslashuvchan, mavzu qo'llab-quvvatlashga tayyor
- 🧩 **Modulli monolit arxitektura** — `app/Modules/{User,Role,Setting,File,Audit,Notification,Search}` — har biri o'z Controller/Service/Request/Migration to'plami bilan mustaqil
- ✅ **41 ta Pest test** — CRUD, RBAC, soft delete va audit logni qamrab oladi
- 🐳 **Docker va CI** — tayyor `Dockerfile` / `docker-compose.yml` va GitHub Actions test pipeline
- 🖼️ **Brendlangan xato sahifalari** — 403/404/419/429/500/503 standart Laravel sahifasi o'rniga admin panelning o'z uslubida ko'rsatiladi

### Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 19, TypeScript (strict) |
| Ko'prik | Inertia.js 2 — API/CORS yo'q, session auth |
| RBAC | Spatie Laravel Permission |
| 2FA | pragmarx/google2fa + bacon/bacon-qr-code |
| Stil | Tailwind CSS |
| Bildirishnoma | SweetAlert2 (UI) + Laravel database notifications (ilova ichi) |
| Test | Pest |
| DB | PostgreSQL (yoki har qanday Laravel qo'llab-quvvatlaydigan DB) |
| Navbat (Queue) | Database drayveri — production'da **`php artisan queue:work`** ishga tushirilishi shart (email va bildirishnomalar uchun) |

### Papka tuzilmasi

```
app/
  Modules/           ← Har bir biznes-modul uchun alohida papka
    User/  Role/  Setting/  File/  Audit/  Notification/  Search/
      Controllers/
      Services/
      Requests/
      Migrations/
      <Module>ServiceProvider.php
      routes.php
  Shared/            ← BaseController, Auditable trait, umumiy yordamchilar
  Notifications/     ← QueuedVerifyEmail, QueuedResetPassword, GeneralNotification
resources/js/
  Pages/             ← Inertia sahifalari (.tsx)
  Layouts/           ← AuthenticatedLayout, AuthLayout
  Components/        ← Qayta ishlatiladigan UI komponentlar (GlobalSearch, NotificationBell va h.k.)
  i18n/              ← uz/ru/en tarjima lug'atlari
  hooks/             ← usePermission, useFlashToasts
  lib/               ← swal, format yordamchilari
lang/                ← uz/ru/en backend validatsiya va auth xabarlari
tests/Feature/       ← Pest test to'plami (41 ta test)
docker/, Dockerfile, docker-compose.yml
.github/workflows/   ← CI test pipeline
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

> ⚠️ Production muhitida navbat (queue) worker'ini ishga tushiring (`php artisan queue:work`, afzalroq Supervisor/systemd orqali) — tasdiqlash email'lari, parol tiklash va ilova ichidagi bildirishnomalar navbat orqali yuboriladi.

### Testlarni ishga tushirish

```bash
php artisan test
```

### Docker

```bash
docker compose up --build
```

Ilovani (PHP-FPM), nginx proksini, PostgreSQL'ni va alohida navbat (queue) worker konteynerini ishga tushiradi.

### Litsenziya

[MIT litsenziyasi](https://opensource.org/licenses/MIT) asosida tarqatiladi.

<br>

---

## 🇷🇺 Русский

### Что это?

**StarterKitV2** — готовый к продакшену стартовый набор для админ-панели на основе **Laravel** и **React**, связанных через **Inertia.js** — без API-слоя, без CORS, одно приложение, один деплой. Каждый CRUD-модуль построен по одному и тому же шаблону (`Controller → Service → Request → React-страницы`), поэтому добавление нового модуля занимает минуты, а не часы.

### Возможности

**Доступ и безопасность**
- 🔐 **RBAC (Spatie Permission)** — детализированные права `view / ownview / create / edit / delete` для каждого модуля, полное управление пользователями и ролями
- 🔑 **Двухфакторная аутентификация (TOTP)** — настройка через QR-код с Google Authenticator, резервные коды, обязательная проверка при входе
- ✉️ **Включаемое/отключаемое подтверждение email** — переключается одним тумблером в настройках админки, без передеплоя
- 🗑️ **Мягкое удаление и корзина** — пользователей и файлы можно восстановить или удалить навсегда из отдельной корзины

**Администрирование и контент**
- ⚙️ **Динамические настройки** — настройки ключ-значение, разделённые на группы `admin`/`site` (текст, число, да/нет, загрузка изображений и т.д.), плюс отдельная панель брендинга (логотип + название сайта)
- 📁 **Файловый менеджер** — загрузка, автоматическая категоризация (изображения/видео/аудио/документы/архивы), статистика хранилища, корзина/восстановление
- 📜 **Журнал действий (Audit Log)** — каждое создание/обновление/удаление/восстановление пользователей, настроек и файлов записывается автоматически (кто, что, когда, с какого IP)
- 🔔 **Уведомления внутри приложения** — настоящие уведомления на основе БД с живым колокольчиком в шапке, доставляются через очередь
- 🔍 **Глобальный поиск** — мгновенный поиск по всем модулям (пользователи, роли, настройки, файлы) из шапки сайта
- 👤 **Настройки аккаунта** — профиль, загрузка аватара, смена пароля, удаление аккаунта

**Для разработчиков**
- 🌍 **3 языка** — узбекский, русский, английский — не только интерфейс, но и **сообщения валидации бэкенда** (автоматически синхронизируются с языком интерфейса)
- 🔔 **SweetAlert2** — аккуратные диалоги подтверждения и всплывающие уведомления для каждого CRUD-действия
- 🎨 **Дизайн-система Tailwind CSS** — адаптивная, готова к темизации
- 🧩 **Модульная монолитная архитектура** — `app/Modules/{User,Role,Setting,File,Audit,Notification,Search}`, каждый модуль самодостаточен со своими Controller/Service/Request/Migrations
- ✅ **41 тест на Pest** — покрывают CRUD, RBAC, мягкое удаление и журнал действий
- 🐳 **Docker и CI** — готовые `Dockerfile` / `docker-compose.yml` и пайплайн тестов GitHub Actions
- 🖼️ **Фирменные страницы ошибок** — 403/404/419/429/500/503 отображаются в стиле админ-панели вместо стандартного экрана Laravel

### Технологии

| Слой | Технология |
|---|---|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 19, TypeScript (strict) |
| Мост | Inertia.js 2 — без API/CORS, аутентификация через сессии |
| RBAC | Spatie Laravel Permission |
| 2FA | pragmarx/google2fa + bacon/bacon-qr-code |
| Стили | Tailwind CSS |
| Уведомления | SweetAlert2 (UI) + Laravel database notifications (внутри приложения) |
| Тестирование | Pest |
| БД | PostgreSQL (или любая БД, поддерживаемая Laravel) |
| Очередь | Драйвер database — в продакшене **обязательно запустить `php artisan queue:work`** (для email и уведомлений) |

### Структура проекта

```
app/
  Modules/           ← Отдельная папка на каждый бизнес-модуль
    User/  Role/  Setting/  File/  Audit/  Notification/  Search/
      Controllers/
      Services/
      Requests/
      Migrations/
      <Module>ServiceProvider.php
      routes.php
  Shared/            ← BaseController, трейт Auditable, общие хелперы
  Notifications/     ← QueuedVerifyEmail, QueuedResetPassword, GeneralNotification
resources/js/
  Pages/             ← Страницы Inertia (.tsx)
  Layouts/           ← AuthenticatedLayout, AuthLayout
  Components/        ← Переиспользуемые UI-компоненты (GlobalSearch, NotificationBell и др.)
  i18n/              ← Словари переводов uz/ru/en
  hooks/             ← usePermission, useFlashToasts
  lib/               ← Хелперы swal, format
lang/                ← uz/ru/en сообщения валидации и аутентификации бэкенда
tests/Feature/       ← Набор тестов Pest (41 тест)
docker/, Dockerfile, docker-compose.yml
.github/workflows/   ← CI-пайплайн тестов
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

> ⚠️ В продакшене запустите обработчик очереди (`php artisan queue:work`, желательно через Supervisor/systemd) — письма подтверждения, сброс пароля и уведомления внутри приложения отправляются через очередь.

### Запуск тестов

```bash
php artisan test
```

### Docker

```bash
docker compose up --build
```

Поднимает приложение (PHP-FPM), nginx-прокси, PostgreSQL и отдельный контейнер обработчика очереди.

### Лицензия

Распространяется под лицензией [MIT](https://opensource.org/licenses/MIT).
