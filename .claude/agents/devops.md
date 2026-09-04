# Agent: DevOps

## Role
Bitta Laravel ilovasi uchun Docker, Nginx, CI/CD pipeline. Microservice emas.

## Trigger
"docker", "deploy", "nginx", "env", "production", "ci/cd"

## docker-compose.yml

```yaml
services:
  app:
    build: { context: ., dockerfile: Dockerfile }
    volumes: [.:/var/www/html, /var/www/html/vendor]
    environment:
      APP_ENV: local
      DB_HOST: postgres
      CACHE_STORE: redis
      QUEUE_CONNECTION: redis
      SESSION_DRIVER: redis
    depends_on:
      postgres: { condition: service_healthy }
      redis:    { condition: service_healthy }
    networks: [appnet]

  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    volumes:
      - .:/var/www/html
      - ./docker/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on: [app]
    networks: [appnet]

  vite:
    image: node:20-alpine
    working_dir: /var/www/html
    command: npm run dev -- --host
    ports: ["5173:5173"]
    volumes: [.:/var/www/html]
    networks: [appnet]

  queue:
    build: { context: ., dockerfile: Dockerfile }
    command: php artisan queue:work --sleep=3 --tries=3
    volumes: [.:/var/www/html]
    depends_on: [app, redis]
    restart: unless-stopped
    networks: [appnet]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_DATABASE:-myapp}
      POSTGRES_USER: ${DB_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-secret}
    volumes: [postgres_data:/var/lib/postgresql/data]
    networks: [appnet]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD:-secret}
    networks: [appnet]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s

  mailpit:
    image: axllent/mailpit
    ports: ["8025:8025"]
    networks: [appnet]

volumes:
  postgres_data:
networks:
  appnet:
```

## Dockerfile

```dockerfile
FROM php:8.4-fpm-alpine

RUN apk add --no-cache postgresql-dev libzip-dev libpng-dev nodejs npm \
    && docker-php-ext-install pdo pdo_pgsql zip gd pcntl bcmath opcache

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize \
    && npm ci && npm run build && rm -rf node_modules

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
```

## docker/nginx.conf

```nginx
server {
    listen 80;
    root /var/www/html/public;
    index index.php;

    gzip on;
    gzip_types text/css application/javascript application/json;

    location /build/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass   app:9000;
        fastcgi_param  SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include        fastcgi_params;
        fastcgi_read_timeout 300;
    }

    location ~ /\.(?!well-known).* { deny all; }
}
```

## Makefile

```makefile
.PHONY: up down install fresh migrate seed test

up:
	docker compose up -d

down:
	docker compose down

install:
	cp .env.example .env
	docker compose up -d
	docker compose exec app composer install
	docker compose exec app php artisan key:generate
	docker compose exec app php artisan migrate --seed
	@echo "Tayyor! http://localhost"

fresh:
	docker compose exec app php artisan migrate:fresh --seed

migrate:
	docker compose exec app php artisan migrate

seed:
	docker compose exec app php artisan db:seed

clear:
	docker compose exec app php artisan cache:clear
	docker compose exec app php artisan config:clear
	docker compose exec app php artisan route:clear
	docker compose exec app php artisan view:clear

cache:
	docker compose exec app php artisan config:cache
	docker compose exec app php artisan route:cache
	docker compose exec app php artisan view:cache

test:
	docker compose exec app php artisan test --parallel

shell:
	docker compose exec app sh
```

## GitHub Actions CI/CD

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: secret, POSTGRES_DB: testing }
        options: --health-cmd pg_isready --health-interval 5s

    steps:
      - uses: actions/checkout@v4

      - uses: shivammathur/setup-php@v2
        with: { php-version: '8.4', extensions: pdo_pgsql, zip }

      - run: composer install --no-interaction --prefer-dist
      - run: cp .env.testing .env && php artisan key:generate
      - run: php artisan migrate --force
      - run: npm ci && npm run build
      - run: php artisan test --parallel

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/myapp
            git pull origin main
            composer install --no-dev --optimize-autoloader
            npm ci && npm run build
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            php artisan queue:restart
```

## .env.example

```env
APP_NAME=MyApp
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=myapp
DB_USERNAME=postgres
DB_PASSWORD=secret

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=redis
REDIS_PASSWORD=secret
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_FROM_ADDRESS=noreply@myapp.uz
MAIL_FROM_NAME="${APP_NAME}"

VITE_APP_NAME="${APP_NAME}"
```
