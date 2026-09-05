<?php

namespace App\Console\Commands;

use App\Support\ModuleGenerator\FieldDefinition;
use App\Support\ModuleGenerator\ModuleGenerator;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Interaktiv CRUD modul generatori.
 *
 * `app/Modules/{Model}` konvensiyasiga to'liq mos modul (migration, model,
 * service, request, controller, routes, provider) va unga mos
 * React/Inertia sahifalarini (Index/Create/Edit/Trashed) generatsiya qiladi,
 * ServiceProvider'ni `bootstrap/providers.php`ga, permissionlarni
 * `RolePermissionSeeder`ga, TypeScript interfeysini va 3 tildagi (uz/ru/en)
 * i18n kalitlarini avtomatik qo'shadi.
 */
class CrudGenerateCommand extends Command
{
    protected $signature = 'crud:generate {name? : Model nomi, masalan Product}';

    protected $description = "Yangi CRUD modulini (backend + React sahifalar) interaktiv so'rovlar orqali generatsiya qiladi";

    public function handle(): int
    {
        $name = $this->argument('name') ?: $this->ask("Model nomi (masalan: Product)");

        if (! $name || ! preg_match('/^[A-Za-z][A-Za-z0-9]*$/', $name)) {
            $this->error("Model nomi faqat harf/raqamlardan iborat bo'lishi kerak (bo'sh joysiz).");

            return self::FAILURE;
        }

        $model = Str::studly(Str::singular($name));

        if (app_path("Modules/{$model}") && is_dir(app_path("Modules/{$model}"))) {
            if (! $this->confirm("app/Modules/{$model} allaqachon mavjud. Davom etilsinmi va fayllar qayta yozilsinmi?", false)) {
                $this->warn('Bekor qilindi.');

                return self::SUCCESS;
            }
        }

        $softDeletes = $this->confirm('Soft delete va Savat (Trash) sahifasi qo\'shilsinmi?', true);

        $fields = $this->collectFields();

        if ($fields === []) {
            $this->error('Kamida bitta field kiritilishi kerak.');

            return self::FAILURE;
        }

        $this->newLine();
        $this->table(
            ['Field', 'Turi', 'Majburiy', 'Indexda', 'Relation'],
            collect($fields)->map(fn (FieldDefinition $f) => [
                $f->name,
                $f->type,
                $f->required ? 'ha' : "yo'q",
                $f->inIndex ? 'ha' : "yo'q",
                $f->relationModel ?? '—',
            ])->all()
        );

        if (! $this->confirm('Shu fieldlar bilan modul yaratilsinmi?', true)) {
            $this->warn('Bekor qilindi.');

            return self::SUCCESS;
        }

        $generator = new ModuleGenerator($model, $fields, $softDeletes);

        $this->info("Modul yaratilmoqda: {$model}...");

        $created = $generator->generate();

        $this->newLine();
        $this->info('Yaratilgan fayllar:');
        foreach ($created as $path) {
            $this->line('  - ' . str_replace(base_path() . DIRECTORY_SEPARATOR, '', $path));
        }

        $this->newLine();
        $this->warn('Keyingi qadamlar:');
        $this->line('  1. php artisan migrate');
        $this->line('  2. php artisan db:seed --class=RolePermissionSeeder   (yangi permissionlarni qo\'shish uchun)');
        $this->line('  3. npm run build   (yoki npm run dev)');
        $this->line("  4. Kerak bo'lsa AdminLayout sidebar menusiga havola qo'shing");

        return self::SUCCESS;
    }

    /** @return FieldDefinition[] */
    protected function collectFields(): array
    {
        $fields = [];

        $this->newLine();
        $this->info("Fieldlarni bittalab kiriting. Bo'sh nom kiritib tugating.");

        while (true) {
            $this->newLine();
            $fieldName = $this->ask('Field nomi (tugatish uchun bo\'sh qoldiring)');

            if (! $fieldName) {
                break;
            }

            if (! preg_match('/^[a-z][a-z0-9_]*$/', $fieldName)) {
                $this->error("Field nomi kichik harflar, raqam va pastki chiziqdan iborat bo'lishi kerak (masalan: category_id emas, category).");

                continue;
            }

            $type = $this->choice('Turi', FieldDefinition::TYPES, 0);
            $required = $this->confirm('Majburiymi?', true);
            $inIndex = $this->confirm("Ro'yxat (Index) jadvalida ko'rsatilsinmi?", true);

            $options = [];
            $relationModel = null;

            if ($type === 'select') {
                $optionsInput = $this->ask("Variantlar, vergul bilan ajrating (masalan: draft,active,archived)");
                $options = array_values(array_filter(array_map('trim', explode(',', (string) $optionsInput))));
            }

            if ($type === 'relation') {
                $relationModel = Str::studly($this->ask('Bog\'langan model nomi (masalan: Category)'));
            }

            $fields[] = new FieldDefinition(
                name: $fieldName,
                type: $type,
                required: $required,
                inIndex: $inIndex,
                options: $options,
                relationModel: $relationModel,
            );
        }

        return $fields;
    }
}
