<?php

namespace App\Support\ModuleGenerator;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * `app/Modules/{Model}` konvensiyasiga mos to'liq CRUD modulini
 * (migration, model, service, request, controller, routes, provider)
 * va unga mos React/Inertia sahifalarini generatsiya qiladi.
 *
 * Bu klass CLI (`php artisan crud:generate`) tomonidan ishlatiladi va
 * xuddi shu holicha kelajakdagi "Module Builder" (drag-drop UI) tomonidan
 * ham chaqiriladi — ikkalasi uchun ham yagona manba.
 *
 * @see \App\Console\Commands\CrudGenerateCommand
 */
final class ModuleGenerator
{
    private readonly string $model;
    private readonly string $modelVariable;
    private readonly string $table;
    private readonly string $stubsPath;

    /** @param FieldDefinition[] $fields */
    public function __construct(
        string $name,
        private readonly array $fields,
        private readonly bool $softDeletes = true,
    ) {
        $this->model = Str::studly(Str::singular($name));
        $this->modelVariable = Str::camel($this->model);
        $this->table = Str::snake(Str::plural($this->model));
        $this->stubsPath = base_path('stubs/crud');

        if ($this->fields === []) {
            throw new RuntimeException('Kamida bitta field kerak.');
        }
    }

    public function moduleExists(): bool
    {
        return File::isDirectory(app_path("Modules/{$this->model}"));
    }

    /**
     * Barcha fayllarni yaratadi. Qaytadi: yaratilgan fayllar ro'yxati.
     *
     * @return string[]
     */
    public function generate(): array
    {
        $created = [];

        $created[] = $this->writeMigration();
        $created[] = $this->writeModel();
        $created[] = $this->writeService();
        $created[] = $this->writeStoreRequest();
        $created[] = $this->writeUpdateRequest();
        $created[] = $this->writeController();
        $created[] = $this->writeRoutes();
        $created[] = $this->writeServiceProvider();

        $this->registerServiceProvider();
        $this->registerPermissionModule();
        $this->appendTypeScriptInterface();
        $this->appendLocaleKeys();

        $created[] = $this->writeReactIndex();
        $created[] = $this->writeReactCreate();
        $created[] = $this->writeReactEdit();

        if ($this->softDeletes) {
            $created[] = $this->writeReactTrashed();
        }

        return $created;
    }

    // ------------------------------------------------------------------
    // Backend
    // ------------------------------------------------------------------

    private function writeMigration(): string
    {
        $columns = collect($this->fields)
            ->map(fn (FieldDefinition $f) => '            ' . $f->migrationColumn())
            ->implode("\n");

        $softDeleteLine = $this->softDeletes ? "\n            \$table->softDeletes();" : '';

        $content = <<<PHP
        <?php

        use Illuminate\Database\Migrations\Migration;
        use Illuminate\Database\Schema\Blueprint;
        use Illuminate\Support\Facades\Schema;

        return new class extends Migration
        {
            public function up(): void
            {
                Schema::create('{$this->table}', function (Blueprint \$table) {
                    \$table->id();
        {$columns}
                    \$table->timestamps();{$softDeleteLine}
                });
            }

            public function down(): void
            {
                Schema::dropIfExists('{$this->table}');
            }
        };

        PHP;

        $path = app_path("Modules/{$this->model}/Migrations/" . now()->format('Y_m_d_His') . "_create_{$this->table}_table.php");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    private function writeModel(): string
    {
        $fillable = collect($this->fields)->map(fn (FieldDefinition $f) => "'{$f->columnName()}'")->implode(', ');

        $traits = ['HasFactory'];
        if ($this->softDeletes) {
            $traits[] = 'SoftDeletes';
        }
        $traits[] = 'Auditable';

        $uses = ["use App\\Shared\\Traits\\Auditable;", 'use Illuminate\Database\Eloquent\Attributes\Fillable;', 'use Illuminate\Database\Eloquent\Factories\HasFactory;', 'use Illuminate\Database\Eloquent\Model;'];
        if ($this->softDeletes) {
            $uses[] = 'use Illuminate\Database\Eloquent\SoftDeletes;';
        }

        $relations = collect($this->fields)
            ->filter(fn (FieldDefinition $f) => $f->type === 'relation')
            ->map(function (FieldDefinition $f) {
                return <<<PHP


                    public function {$f->relationMethodName()}(): \Illuminate\Database\Eloquent\Relations\BelongsTo
                    {
                        return \$this->belongsTo(\App\Models\{$f->relationModel}::class);
                    }
                PHP;
            })
            ->map(fn (string $block) => "\n\n" . $this->reindent(trim($block), 4))
            ->implode('');

        $castsBody = collect($this->fields)
            ->filter(fn (FieldDefinition $f) => in_array($f->type, ['boolean', 'date', 'datetime', 'decimal'], true))
            ->map(fn (FieldDefinition $f) => "            '{$f->columnName()}' => '" . match ($f->type) {
                'boolean' => 'boolean',
                'date' => 'date',
                'datetime' => 'datetime',
                'decimal' => 'decimal:2',
                default => 'string',
            } . "',")
            ->implode("\n");

        $castsMethod = $castsBody !== ''
            ? "\n\n    protected function casts(): array\n    {\n        return [\n{$castsBody}\n        ];\n    }"
            : '';

        $content = <<<PHP
        <?php

        namespace App\Modules\\{$this->model}\Models;

        {$this->joinUses($uses)}

        #[Fillable([{$fillable}])]
        class {$this->model} extends Model
        {
            use {$this->joinTraits($traits)};{$castsMethod}{$relations}
        }

        PHP;

        $path = app_path("Modules/{$this->model}/Models/{$this->model}.php");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    private function writeService(): string
    {
        $searchableField = $this->fields[0]->columnName();

        $trashMethods = $this->softDeletes ? <<<PHP

                public function trashed(array \$filters = []): LengthAwarePaginator
                {
                    return {$this->model}::onlyTrashed()
                        ->when(\$filters['search'] ?? null, fn (\$q, \$s) => \$q->where('{$searchableField}', 'like', "%{\$s}%"))
                        ->latest()
                        ->paginate(15)
                        ->withQueryString();
                }

                public function restore(int \$id): void
                {
                    {$this->model}::onlyTrashed()->findOrFail(\$id)->restore();
                }

                public function forceDelete(int \$id): void
                {
                    {$this->model}::onlyTrashed()->findOrFail(\$id)->forceDelete();
                }
            PHP : '';

        $eagerLoad = $this->relationEagerLoadArray();

        $content = <<<PHP
        <?php

        namespace App\Modules\\{$this->model}\Services;

        use App\Modules\\{$this->model}\Models\\{$this->model};
        use Illuminate\Pagination\LengthAwarePaginator;

        class {$this->model}Service
        {
            public function paginate(array \$filters = []): LengthAwarePaginator
            {
                return {$this->model}::query()
                    {$eagerLoad}->when(\$filters['search'] ?? null, fn (\$q, \$s) => \$q->where('{$searchableField}', 'like', "%{\$s}%"))
                    ->latest()
                    ->paginate(15)
                    ->withQueryString();
            }

            public function create(array \$data): {$this->model}
            {
                return {$this->model}::create(\$data);
            }

            public function update({$this->model} \${$this->modelVariable}, array \$data): {$this->model}
            {
                \${$this->modelVariable}->update(\$data);

                return \${$this->modelVariable}->fresh();
            }

            public function delete({$this->model} \${$this->modelVariable}): void
            {
                \${$this->modelVariable}->delete();
            }
        {$trashMethods}
        }

        PHP;

        $path = app_path("Modules/{$this->model}/Services/{$this->model}Service.php");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    private function writeStoreRequest(): string
    {
        return $this->writeRequest('Store', required: true);
    }

    private function writeUpdateRequest(): string
    {
        return $this->writeRequest('Update', required: false);
    }

    private function writeRequest(string $prefix, bool $required): string
    {
        $rules = collect($this->fields)
            ->map(function (FieldDefinition $f) use ($required) {
                $ruleParts = $f->validationRules();
                if (! $required) {
                    $ruleParts[0] = 'sometimes';
                }
                $rulesStr = collect($ruleParts)->map(fn ($r) => "'{$r}'")->implode(', ');

                return "            '{$f->columnName()}' => [{$rulesStr}],";
            })
            ->implode("\n");

        $permission = $prefix === 'Store' ? "{$this->table}.create" : "{$this->table}.edit";

        $content = <<<PHP
        <?php

        namespace App\Modules\\{$this->model}\Requests;

        use Illuminate\Foundation\Http\FormRequest;

        class {$prefix}{$this->model}Request extends FormRequest
        {
            public function authorize(): bool
            {
                return \$this->user()->can('{$permission}');
            }

            public function rules(): array
            {
                return [
        {$rules}
                ];
            }
        }

        PHP;

        $path = app_path("Modules/{$this->model}/Requests/{$prefix}{$this->model}Request.php");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    private function writeController(): string
    {
        $trashMethods = $this->softDeletes ? <<<PHP

                public function trashed(Request \$request): Response
                {
                    abort_unless(auth()->user()->can('{$this->table}.delete'), 403);

                    return Inertia::render('{$this->model}/Trashed', [
                        '{$this->indexPropName()}' => \$this->service->trashed(\$request->only('search')),
                        'filters' => \$request->only('search'),
                    ]);
                }

                public function restore(int \$id): RedirectResponse
                {
                    abort_unless(auth()->user()->can('{$this->table}.delete'), 403);

                    \$this->service->restore(\$id);

                    return back()->with('success', 'Tiklandi');
                }

                public function forceDelete(int \$id): RedirectResponse
                {
                    abort_unless(auth()->user()->can('{$this->table}.delete'), 403);

                    \$this->service->forceDelete(\$id);

                    return back()->with('success', "Butunlay o'chirildi");
                }
            PHP : '';

        $relationOptionsProp = $this->relationOptionsForCreateEdit();

        $content = <<<PHP
        <?php

        namespace App\Modules\\{$this->model}\Controllers;

        use App\Modules\\{$this->model}\Models\\{$this->model};
        use App\Modules\\{$this->model}\Requests\Store{$this->model}Request;
        use App\Modules\\{$this->model}\Requests\Update{$this->model}Request;
        use App\Modules\\{$this->model}\Services\\{$this->model}Service;
        use App\Shared\BaseController;
        use Illuminate\Http\RedirectResponse;
        use Illuminate\Http\Request;
        use Inertia\Inertia;
        use Inertia\Response;

        class {$this->model}Controller extends BaseController
        {
            public function __construct(
                private readonly {$this->model}Service \$service
            ) {}

            public function index(Request \$request): Response
            {
                abort_unless(auth()->user()->can('{$this->table}.view'), 403);

                return Inertia::render('{$this->model}/Index', [
                    '{$this->indexPropName()}' => \$this->service->paginate(\$request->only('search')),
                    'filters' => \$request->only('search'),
                ]);
            }

            public function create(): Response
            {
                abort_unless(auth()->user()->can('{$this->table}.create'), 403);

                return Inertia::render('{$this->model}/Create'{$relationOptionsProp});
            }

            public function store(Store{$this->model}Request \$request): RedirectResponse
            {
                \$this->service->create(\$request->validated());

                return redirect()->route('{$this->table}.index')->with('success', 'Yaratildi');
            }

            public function edit({$this->model} \${$this->modelVariable}): Response
            {
                abort_unless(auth()->user()->can('{$this->table}.edit'), 403);

                return Inertia::render('{$this->model}/Edit', [
                    '{$this->modelVariable}' => \${$this->modelVariable},
                ]{$this->relationOptionsMerge()});
            }

            public function update(Update{$this->model}Request \$request, {$this->model} \${$this->modelVariable}): RedirectResponse
            {
                \$this->service->update(\${$this->modelVariable}, \$request->validated());

                return redirect()->route('{$this->table}.index')->with('success', 'Yangilandi');
            }

            public function destroy({$this->model} \${$this->modelVariable}): RedirectResponse
            {
                abort_unless(auth()->user()->can('{$this->table}.delete'), 403);

                \$this->service->delete(\${$this->modelVariable});

                return redirect()->route('{$this->table}.index')->with('success', "O'chirildi");
            }
        {$trashMethods}
        }

        PHP;

        $path = app_path("Modules/{$this->model}/Controllers/{$this->model}Controller.php");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    private function writeRoutes(): string
    {
        $trashRoutes = $this->softDeletes ? "\n" . $this->reindent(<<<PHP
            Route::get('{$this->table}/trashed', [{$this->model}Controller::class, 'trashed'])->name('{$this->table}.trashed');
            Route::post('{$this->table}/{id}/restore', [{$this->model}Controller::class, 'restore'])->name('{$this->table}.restore');
            Route::delete('{$this->table}/{id}/force', [{$this->model}Controller::class, 'forceDelete'])->name('{$this->table}.force-delete');
            PHP, 8) : '';

        $content = <<<PHP
        <?php

        use App\Modules\\{$this->model}\Controllers\\{$this->model}Controller;
        use Illuminate\Support\Facades\Route;

        Route::middleware(['web', 'auth', 'verified'])
            ->prefix('admin')
            ->group(function () {{$trashRoutes}
                Route::resource('{$this->table}', {$this->model}Controller::class)->except('show');
            });

        PHP;

        $path = app_path("Modules/{$this->model}/routes.php");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    private function writeServiceProvider(): string
    {
        $content = <<<PHP
        <?php

        namespace App\Modules\\{$this->model};

        use Illuminate\Support\ServiceProvider;

        class {$this->model}ServiceProvider extends ServiceProvider
        {
            public function boot(): void
            {
                \$this->loadMigrationsFrom(__DIR__ . '/Migrations');
                \$this->loadRoutesFrom(__DIR__ . '/routes.php');
            }
        }

        PHP;

        $path = app_path("Modules/{$this->model}/{$this->model}ServiceProvider.php");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    private function registerServiceProvider(): void
    {
        $path = base_path('bootstrap/providers.php');
        $contents = File::get($path);

        $use = "use App\Modules\\{$this->model}\\{$this->model}ServiceProvider;";
        if (! str_contains($contents, $use)) {
            $contents = preg_replace(
                '/(use App\\\\Providers\\\\AppServiceProvider;)/',
                "{$use}\n$1",
                $contents,
                1
            );
        }

        $entry = "    {$this->model}ServiceProvider::class,";
        if (! str_contains($contents, $entry)) {
            $contents = preg_replace(
                '/(\s*)\];(\s*)$/',
                "\n{$entry}\n];\n",
                $contents,
                1
            );
        }

        File::put($path, $contents);
    }

    private function registerPermissionModule(): void
    {
        $path = base_path('database/seeders/RolePermissionSeeder.php');
        $contents = File::get($path);

        if (str_contains($contents, "'{$this->table}',")) {
            return;
        }

        $contents = preg_replace(
            "/(protected array \\\$modules = \\[\\n)/",
            "$1        '{$this->table}',\n",
            $contents,
            1
        );

        File::put($path, $contents);
    }

    // ------------------------------------------------------------------
    // Frontend
    // ------------------------------------------------------------------

    private function appendTypeScriptInterface(): void
    {
        $path = resource_path('js/types/index.d.ts');
        $contents = File::get($path);

        $fieldLines = collect($this->fields)
            ->map(fn (FieldDefinition $f) => $f->tsInterfaceLine())
            ->implode("\n");

        $relationLines = collect($this->fields)
            ->filter(fn (FieldDefinition $f) => $f->type === 'relation')
            ->map(fn (FieldDefinition $f) => "    {$f->relationMethodName()}?: { id: number; name: string };")
            ->implode("\n");

        $body = $relationLines !== '' ? "{$fieldLines}\n{$relationLines}" : $fieldLines;

        $interface = <<<TS

        export interface {$this->model} {
            id: number;
        {$body}
            created_at: string;
        }

        TS;

        if (! str_contains($contents, "export interface {$this->model} {")) {
            File::put($path, rtrim($contents) . "\n" . $interface);
        }
    }

    private function appendLocaleKeys(): void
    {
        $keys = $this->localeKeys();

        foreach (['uz', 'ru', 'en'] as $locale) {
            $path = resource_path("js/i18n/locales/{$locale}.ts");
            $contents = File::get($path);

            $marker = "'{$this->table}.title':";
            if (str_contains($contents, $marker)) {
                continue;
            }

            $lines = collect($keys[$locale])
                ->map(fn ($value, $key) => "    '{$key}': '" . str_replace("'", "\\'", $value) . "',")
                ->implode("\n");

            $contents = preg_replace(
                '/\};(?=\s*(?:export default|\z))/',
                "\n{$lines}\n};",
                rtrim($contents),
                1
            );

            File::put($path, $contents);
        }
    }

    /** @return array<string, array<string, string>> */
    private function localeKeys(): array
    {
        $labels = [
            'uz' => ['title' => $this->model, 'new' => 'Yangi', 'delete_confirm' => "\"{{name}}\" ni o'chirasizmi?", 'create_title' => 'Yangi', 'edit_title' => 'Tahrirlash'],
            'ru' => ['title' => $this->model, 'new' => 'Новый', 'delete_confirm' => 'Удалить "{{name}}"?', 'create_title' => 'Новый', 'edit_title' => 'Редактировать'],
            'en' => ['title' => $this->model, 'new' => 'New', 'delete_confirm' => 'Delete "{{name}}"?', 'create_title' => 'New', 'edit_title' => 'Edit'],
        ];

        $result = [];
        foreach ($labels as $locale => $l) {
            $entries = [
                "{$this->table}.title" => $l['title'],
                "{$this->table}.new" => $l['new'],
                "{$this->table}.delete_confirm" => $l['delete_confirm'],
                "{$this->table}.create.title" => $l['create_title'],
                "{$this->table}.edit.title" => $l['edit_title'],
            ];

            foreach ($this->fields as $f) {
                $entries["{$this->table}.field.{$f->columnName()}"] = $f->label();
            }

            $result[$locale] = $entries;
        }

        return $result;
    }

    private function writeReactIndex(): string
    {
        $prop = $this->indexPropName();
        $indexFields = collect($this->fields)->filter(fn (FieldDefinition $f) => $f->inIndex);
        if ($indexFields->isEmpty()) {
            $indexFields = collect([$this->fields[0]]);
        }

        $headers = $indexFields
            ->map(fn (FieldDefinition $f) => "                                <th className=\"py-3 pr-4 font-semibold\">{t('{$this->table}.field.{$f->columnName()}')}</th>")
            ->implode("\n");

        $cells = $indexFields
            ->map(fn (FieldDefinition $f) => "                                    <td className=\"py-3 pr-4 text-secondary-900\">{$f->indexCellExpression('item')}</td>")
            ->implode("\n");

        $trashLink = $this->softDeletes ? "\n" . $this->reindent(<<<JSX
            {can('{$this->table}.delete') && (
                <Link href={route('{$this->table}.trashed')} className="text-sm font-medium text-secondary-500 hover:underline">
                    {t('common.trash')}
                </Link>
            )}
            JSX, 20) : '';

        $content = <<<TSX
        import Pagination from '@/Components/Pagination';
        import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
        import { usePermission } from '@/hooks/usePermission';
        import { useLocale } from '@/i18n/LocaleProvider';
        import { confirmDelete } from '@/lib/swal';
        import { {$this->model}, Paginated } from '@/types';
        import { Head, Link, router } from '@inertiajs/react';

        export default function Index({ {$prop} }: { {$prop}: Paginated<{$this->model}> }) {
            const { can } = usePermission();
            const { t } = useLocale();

            const destroy = async (item: {$this->model}) => {
                const confirmed = await confirmDelete({
                    title: t('common.are_you_sure'),
                    text: t('{$this->table}.delete_confirm', { name: String(item.id) }),
                    confirmText: t('common.confirm_delete_button'),
                    cancelText: t('common.cancel'),
                });

                if (confirmed) {
                    router.delete(route('{$this->table}.destroy', item.id));
                }
            };

            return (
                <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('{$this->table}.title')}</h2>}>
                    <Head title={t('{$this->table}.title')} />

                    <div className="card p-6">
                        <div className="flex items-center justify-end gap-4 mb-6">{$trashLink}
                            {can('{$this->table}.create') && (
                                <Link
                                    href={route('{$this->table}.create')}
                                    className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                                >
                                    + {t('{$this->table}.new')}
                                </Link>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-secondary-500 border-b border-surface-200">
        {$headers}
                                        <th className="py-3 pr-4 font-semibold text-right">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {{$prop}.data.map((item) => (
                                        <tr key={item.id} className="border-b border-surface-100 last:border-0">
        {$cells}
                                            <td className="py-3 pr-4 text-right space-x-2 whitespace-nowrap">
                                                {can('{$this->table}.edit') && (
                                                    <Link
                                                        href={route('{$this->table}.edit', item.id)}
                                                        className="text-theme-primary hover:underline text-sm font-medium"
                                                    >
                                                        {t('common.edit')}
                                                    </Link>
                                                )}
                                                {can('{$this->table}.delete') && (
                                                    <button
                                                        onClick={() => destroy(item)}
                                                        className="text-red-600 hover:underline text-sm font-medium"
                                                    >
                                                        {t('common.delete')}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={{$prop}} />
                    </div>
                </AuthenticatedLayout>
            );
        }

        TSX;

        $path = resource_path("js/Pages/{$this->model}/Index.tsx");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    private function writeReactCreate(): string
    {
        return $this->writeReactForm('Create');
    }

    private function writeReactEdit(): string
    {
        return $this->writeReactForm('Edit');
    }

    private function writeReactForm(string $mode): string
    {
        $isEdit = $mode === 'Edit';
        $defaults = collect($this->fields)
            ->map(fn (FieldDefinition $f) => "        {$f->columnName()}: " . ($isEdit ? $f->editDefaultValue($this->modelVariable) : $f->formDefaultValue()) . ',')
            ->implode("\n");

        $fields = collect($this->fields)
            ->map(fn (FieldDefinition $f) => $this->reindent($this->stripBlankLines($f->formFieldJsx($this->table)), 20))
            ->implode("\n\n");

        $relationProps = $this->relationPropsSignature();
        $relationNames = $this->relationPropNamesList();

        if ($isEdit) {
            $destructure = $relationNames !== '' ? "{$this->modelVariable}, {$relationNames}" : $this->modelVariable;
            $propsSignature = "{ {$destructure} }: { {$this->modelVariable}: {$this->model}{$relationProps} }";
        } else {
            $propsSignature = $relationNames !== '' ? "{ {$relationNames} }: { {$this->trimLeadingSemi($relationProps)} }" : '';
        }

        $submitCall = $isEdit
            ? "put(route('{$this->table}.update', {$this->modelVariable}.id))"
            : "post(route('{$this->table}.store'))";

        $titleKey = $isEdit ? "{$this->table}.edit.title" : "{$this->table}.create.title";

        $content = <<<TSX
        import InputError from '@/Components/InputError';
        import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
        import { useLocale } from '@/i18n/LocaleProvider';
        import { {$this->model} } from '@/types';
        import { Head, Link, useForm } from '@inertiajs/react';
        import { FormEventHandler } from 'react';

        export default function {$mode}({$propsSignature}) {
            const { t } = useLocale();
            const { data, setData, {$this->formMethod($isEdit)}, processing, errors } = useForm({
        {$defaults}
            });

            const submit: FormEventHandler = (e) => {
                e.preventDefault();
                {$submitCall};
            };

            return (
                <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('{$titleKey}')}</h2>}>
                    <Head title={t('{$titleKey}')} />

                    <div className="card p-6 max-w-3xl">
                        <form onSubmit={submit} className="space-y-6">
        {$fields}

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                                >
                                    {t('common.save')}
                                </button>
                                <Link
                                    href={route('{$this->table}.index')}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-secondary-500 hover:bg-surface-100"
                                >
                                    {t('common.cancel')}
                                </Link>
                            </div>
                        </form>
                    </div>
                </AuthenticatedLayout>
            );
        }

        TSX;

        $path = resource_path("js/Pages/{$this->model}/{$mode}.tsx");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    private function writeReactTrashed(): string
    {
        $prop = 'trashed' . Str::plural($this->model);
        $nameField = $this->fields[0]->columnName();

        $content = <<<TSX
        import Pagination from '@/Components/Pagination';
        import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
        import { useLocale } from '@/i18n/LocaleProvider';
        import { confirmDelete } from '@/lib/swal';
        import { {$this->model}, Paginated } from '@/types';
        import { Head, router } from '@inertiajs/react';

        export default function Trashed({ {$prop} }: { {$prop}: Paginated<{$this->model}> }) {
            const { t } = useLocale();

            const restore = (item: {$this->model}) => router.post(route('{$this->table}.restore', item.id));

            const forceDelete = async (item: {$this->model}) => {
                const confirmed = await confirmDelete({
                    title: t('common.are_you_sure'),
                    text: t('common.force_delete_confirm', { name: String(item.{$nameField}) }),
                    confirmText: t('common.delete_forever'),
                    cancelText: t('common.cancel'),
                });

                if (confirmed) {
                    router.delete(route('{$this->table}.force-delete', item.id));
                }
            };

            return (
                <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('common.trash')} — {t('{$this->table}.title')}</h2>}>
                    <Head title={t('common.trash')} />

                    <div className="card p-6">
                        {{$prop}.data.length === 0 ? (
                            <p className="text-secondary-500 text-sm">{t('common.trash_empty')}</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-secondary-500 border-b border-surface-200">
                                            <th className="py-3 pr-4 font-semibold">{t('{$this->table}.field.{$nameField}')}</th>
                                            <th className="py-3 pr-4 font-semibold text-right">{t('common.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {{$prop}.data.map((item) => (
                                            <tr key={item.id} className="border-b border-surface-100 last:border-0">
                                                <td className="py-3 pr-4 text-secondary-900">{item.{$nameField}}</td>
                                                <td className="py-3 pr-4 text-right space-x-2 whitespace-nowrap">
                                                    <button onClick={() => restore(item)} className="text-theme-primary hover:underline text-sm font-medium">
                                                        {t('common.restore')}
                                                    </button>
                                                    <button onClick={() => forceDelete(item)} className="text-red-600 hover:underline text-sm font-medium">
                                                        {t('common.delete_forever')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <Pagination paginator={{$prop}} />
                            </div>
                        )}
                    </div>
                </AuthenticatedLayout>
            );
        }

        TSX;

        $path = resource_path("js/Pages/{$this->model}/Trashed.tsx");
        $this->put($path, $this->dedent($content));

        return $path;
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private function indexPropName(): string
    {
        return Str::camel(Str::plural($this->model));
    }

    private function formMethod(bool $isEdit): string
    {
        return $isEdit ? 'put' : 'post';
    }

    private function relationFields(): array
    {
        return collect($this->fields)->filter(fn (FieldDefinition $f) => $f->type === 'relation')->values()->all();
    }

    private function relationEagerLoadArray(): string
    {
        $relations = collect($this->relationFields())->map(fn (FieldDefinition $f) => "'{$f->relationMethodName()}'");
        if ($relations->isEmpty()) {
            return '';
        }

        return "->with([{$relations->implode(', ')}])\n                    ";
    }

    private function relationOptionsForCreateEdit(): string
    {
        $relations = $this->relationFields();
        if ($relations === []) {
            return '';
        }

        $lines = collect($relations)
            ->map(fn (FieldDefinition $f) => "'{$f->relationMethodName()}Options' => \App\Models\{$f->relationModel}::query()->select('id', 'name')->get(),")
            ->implode("\n            ");

        return ", [\n            {$lines}\n        ]";
    }

    private function relationOptionsMerge(): string
    {
        $relations = $this->relationFields();
        if ($relations === []) {
            return '';
        }

        $lines = collect($relations)
            ->map(fn (FieldDefinition $f) => "'{$f->relationMethodName()}Options' => \App\Models\{$f->relationModel}::query()->select('id', 'name')->get(),")
            ->implode("\n            ");

        return "\n            + [\n            {$lines}\n        ]";
    }

    private function relationPropsSignature(): string
    {
        $relations = $this->relationFields();
        if ($relations === []) {
            return '';
        }

        $props = collect($relations)
            ->map(fn (FieldDefinition $f) => "{$f->relationMethodName()}Options: { id: number; name: string }[]")
            ->implode('; ');

        return "; {$props}";
    }

    private function relationPropNamesList(): string
    {
        return collect($this->relationFields())
            ->map(fn (FieldDefinition $f) => "{$f->relationMethodName()}Options")
            ->implode(', ');
    }

    private function trimLeadingSemi(string $s): string
    {
        return ltrim($s, '; ');
    }

    private function joinUses(array $uses): string
    {
        return collect($uses)->sort()->implode("\n");
    }

    private function joinTraits(array $traits): string
    {
        return implode(', ', $traits);
    }

    private function put(string $path, string $content): void
    {
        File::ensureDirectoryExists(dirname($path));
        File::put($path, $content);
    }

    /**
     * Heredoc ichida PHP kod chap tomonga siljigan holda yozilgani uchun
     * har bir qatordan bir xil boshlang'ich probel miqdorini olib tashlaydi.
     */
    /**
     * Ko'p qatorli blokni (masalan bitta field'ning JSX'i) nolga tekislab,
     * so'ng berilgan chuqurlikka moslab qayta joylashtiradi — shu orqali
     * turli manbalardan (FieldDefinition, ->map() natijalari) yig'ilgan
     * bloklar asosiy shablon ichida bir xil chuqurlikda ko'rinadi.
     */
    private function reindent(string $block, int $spaces): string
    {
        $dedented = $this->dedent($block);
        $pad = str_repeat(' ', $spaces);

        return collect(explode("\n", $dedented))
            ->map(fn (string $line) => trim($line) === '' ? '' : $pad . $line)
            ->implode("\n");
    }

    /** Blokning butunlay bo'sh (faqat probel) qatorlarini olib tashlaydi. */
    private function stripBlankLines(string $block): string
    {
        return collect(explode("\n", $block))
            ->reject(fn (string $line) => trim($line) === '')
            ->implode("\n");
    }

    private function dedent(string $content): string
    {
        $lines = explode("\n", $content);
        $indents = collect($lines)
            ->filter(fn ($l) => trim($l) !== '')
            ->map(fn ($l) => strlen($l) - strlen(ltrim($l)))
            ->min() ?? 0;

        return collect($lines)
            ->map(fn ($l) => $l === '' ? '' : substr($l, $indents))
            ->implode("\n");
    }
}
