# Contributing to StarterKitV2

Thanks for your interest in improving StarterKitV2! Contributions of any size are welcome — bug fixes, new modules, translations, documentation.

## Getting started

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate --seed
php artisan storage:link

npm run build   # or: npm run dev
```

Default admin login: `admin@admin.com` / `password`.

## Development workflow

1. Fork the repo and create a branch off `main`: `git checkout -b feature/my-change`
2. Make your change, following the existing code style:
   - PHP: PSR-12, Laravel conventions
   - TypeScript/React: `.tsx` only, strict types, no `any`
   - New backend modules go under `app/Modules/<Name>/` with their own `ServiceProvider`, `Controllers/`, `Services/`, `Requests/`, `Migrations/`, `routes.php`
3. Add or update Pest tests for anything behavioral (`tests/Feature/Modules/`)
4. Run the checks locally:
   ```bash
   php artisan test
   npm run build
   ```
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`fix:`, `feat:`, `docs:`, `refactor:`, …)
6. Open a pull request describing what changed and why

## Reporting bugs / requesting features

Please use the issue templates — they help us reproduce bugs faster and understand feature requests clearly.

## Code of conduct

Be respectful and constructive. Disagreements are fine; personal attacks are not.
