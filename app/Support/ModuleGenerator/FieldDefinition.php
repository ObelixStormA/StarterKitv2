<?php

namespace App\Support\ModuleGenerator;

use Illuminate\Support\Str;

/**
 * Bitta CRUD field'ining barcha metama'lumotlari: migration ustuni, validatsiya
 * qoidasi, TypeScript turi va React JSX ko'rinishini shu yerdan hosil qiladi.
 *
 * CLI (`crud:generate`) ham, kelajakdagi drag-drop UI generator ham xuddi shu
 * klassni ishlatadi — ikkalasi ham bitta manbadan (single source of truth)
 * bir xil natija chiqarishi uchun.
 */
final class FieldDefinition
{
    public const TYPES = [
        'text', 'textarea', 'number', 'decimal', 'boolean',
        'email', 'url', 'date', 'datetime', 'select', 'image', 'relation',
    ];

    public function __construct(
        public readonly string $name,
        public readonly string $type,
        public readonly bool $required = true,
        public readonly bool $inIndex = false,
        public readonly array $options = [],
        public readonly ?string $relationModel = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            type: $data['type'],
            required: (bool) ($data['required'] ?? true),
            inIndex: (bool) ($data['in_index'] ?? false),
            options: $data['options'] ?? [],
            relationModel: $data['relation_model'] ?? null,
        );
    }

    /** Jadvaldagi haqiqiy ustun nomi (relation uchun `_id` qo'shiladi). */
    public function columnName(): string
    {
        return $this->type === 'relation' ? "{$this->name}_id" : $this->name;
    }

    /** Relation uchun bog'langan jadval nomi, masalan Category -> categories. */
    public function relationTable(): string
    {
        return Str::snake(Str::plural($this->relationModel ?? ''));
    }

    /** Relation metodi nomi (belongsTo), masalan `category`. */
    public function relationMethodName(): string
    {
        return Str::camel($this->name);
    }

    /**
     * Bog'langan modelning to'liq (fully-qualified) klass nomi, masalan
     * `\App\Models\Category`. Backslash qiymatning ICHIDA saqlanadi —
     * shablon matnida `\{$expr}` shaklida yozish PHP heredoc/qo'shtirnoqli
     * satr interpolatsiyasini buzadi (backslash `{`ni "yutib", figurali
     * qavslar chiqish natijasida so'zma-so'z qolib ketadi).
     */
    public function relationFqcn(): string
    {
        return '\\App\\Models\\' . $this->relationModel;
    }

    public function label(): string
    {
        return Str::headline($this->name);
    }

    /** Migration blueprint qatori, masalan: $table->string('name'); */
    public function migrationColumn(): string
    {
        $nullable = $this->required ? '' : '->nullable()';

        return match ($this->type) {
            'text', 'email', 'url', 'select' => "\$table->string('{$this->columnName()}'){$nullable};",
            'textarea' => "\$table->text('{$this->columnName()}'){$nullable};",
            'number' => "\$table->integer('{$this->columnName()}'){$nullable};",
            'decimal' => "\$table->decimal('{$this->columnName()}', 10, 2){$nullable};",
            'boolean' => "\$table->boolean('{$this->columnName()}')->default(false);",
            'date' => "\$table->date('{$this->columnName()}'){$nullable};",
            'datetime' => "\$table->dateTime('{$this->columnName()}'){$nullable};",
            'image' => "\$table->string('{$this->columnName()}')->nullable();",
            'relation' => "\$table->foreignId('{$this->columnName()}')" . ($this->required ? "->constrained('{$this->relationTable()}');" : "->nullable()->constrained('{$this->relationTable()}');"),
            default => "\$table->string('{$this->columnName()}'){$nullable};",
        };
    }

    /** FormRequest uchun validatsiya qoidalari massivi. */
    public function validationRules(): array
    {
        $rules = [$this->required ? 'required' : 'nullable'];

        $rules[] = match ($this->type) {
            'text', 'select' => 'string|max:255',
            'textarea' => 'string|max:5000',
            'number' => 'integer',
            'decimal' => 'numeric',
            'boolean' => 'boolean',
            'email' => 'email|max:255',
            'url' => 'url|max:255',
            'date' => 'date',
            'datetime' => 'date',
            'image' => 'image|max:5120',
            'relation' => "exists:{$this->relationTable()},id",
            default => 'string|max:255',
        };

        if ($this->type === 'select' && $this->options !== []) {
            $rules[] = 'in:' . implode(',', $this->options);
        }

        return $rules;
    }

    public function tsType(): string
    {
        return match ($this->type) {
            'number', 'decimal' => 'number',
            'boolean' => 'boolean',
            'relation' => 'number',
            default => 'string',
        };
    }

    /** resources/js/types uchun interfeys qatori. */
    public function tsInterfaceLine(): string
    {
        $optional = $this->required ? '' : '?';

        return "    {$this->columnName()}{$optional}: {$this->tsType()}" . ($this->required ? '' : ' | null') . ';';
    }

    /** Create forma uchun boshlang'ich qiymat (useForm default). */
    public function formDefaultValue(): string
    {
        return match ($this->type) {
            'boolean' => 'false',
            'number', 'decimal', 'relation' => "'' as number | ''",
            'image' => 'null as File | null',
            default => "''",
        };
    }

    /**
     * Edit forma uchun boshlang'ich qiymat. Majburiy number/decimal/relation
     * field'lar uchun `??` o'rniga to'g'ridan-to'g'ri `as` cast ishlatiladi —
     * aks holda TypeScript har doim mavjud (non-nullable) qiymat uchun
     * union turni (`number | ''`) `number`ga toraytirib, forma bo'sh
     * qilinganda xato beradi. `image` field har doim `null` bilan
     * boshlanadi — mavjud rasm URL manzili emas, yangi tanlangan `File`
     * obyekti saqlanadi (mavjud rasm alohida `<img>` orqali ko'rsatiladi).
     */
    public function editDefaultValue(string $modelVariable): string
    {
        $access = "{$modelVariable}.{$this->columnName()}";

        if ($this->type === 'image') {
            return 'null as File | null';
        }

        if (in_array($this->type, ['number', 'decimal', 'relation'], true)) {
            return $this->required ? "{$access} as number | ''" : "{$access} ?? ''";
        }

        return "{$access} ?? " . $this->formDefaultValue();
    }

    /** Create/Edit forma uchun to'liq JSX bloki (4 pробел chuqurlikda). */
    public function formFieldJsx(string $tKey): string
    {
        $name = $this->columnName();
        $label = "{t('{$tKey}.field.{$name}')}";

        return match ($this->type) {
            'textarea' => <<<JSX
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{$label}</label>
                        <textarea
                            value={data.{$name}}
                            onChange={(e) => setData('{$name}', e.target.value)}
                            className="input-theme w-full"
                            rows={4}
                            {$this->requiredAttr()}
                        />
                        <InputError message={errors.{$name}} className="mt-2" />
                    </div>
                JSX,
            'boolean' => <<<JSX
                    <div className="flex items-center gap-2">
                        <input
                            id="{$name}"
                            type="checkbox"
                            checked={data.{$name}}
                            onChange={(e) => setData('{$name}', e.target.checked)}
                            className="checkbox-theme"
                        />
                        <label htmlFor="{$name}" className="text-sm text-secondary-900">{$label}</label>
                        <InputError message={errors.{$name}} className="mt-2" />
                    </div>
                JSX,
            'select' => <<<JSX
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{$label}</label>
                        <select
                            value={data.{$name}}
                            onChange={(e) => setData('{$name}', e.target.value)}
                            className="input-theme w-full"
                            {$this->requiredAttr()}
                        >
                            <option value="">{$label}...</option>
                            {$this->selectOptionsJsx()}
                        </select>
                        <InputError message={errors.{$name}} className="mt-2" />
                    </div>
                JSX,
            'relation' => <<<JSX
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{$label}</label>
                        <select
                            value={data.{$name}}
                            onChange={(e) => setData('{$name}', e.target.value === '' ? '' : Number(e.target.value))}
                            className="input-theme w-full"
                            {$this->requiredAttr()}
                        >
                            <option value="">{$label}...</option>
                            {{$this->relationMethodName()}Options.map((option) => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.{$name}} className="mt-2" />
                    </div>
                JSX,
            'image' => <<<JSX
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{$label}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('{$name}', e.target.files?.[0] ?? null)}
                            className="input-theme w-full"
                        />
                        <InputError message={errors.{$name}} className="mt-2" />
                    </div>
                JSX,
            'number', 'decimal' => <<<JSX
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{$label}</label>
                        <input
                            type="number"
                            {$this->stepAttr()}
                            value={data.{$name}}
                            onChange={(e) => setData('{$name}', e.target.value === '' ? '' : Number(e.target.value))}
                            className="input-theme w-full"
                            {$this->requiredAttr()}
                        />
                        <InputError message={errors.{$name}} className="mt-2" />
                    </div>
                JSX,
            'date', 'datetime' => <<<JSX
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{$label}</label>
                        <input
                            type="{$this->htmlInputType()}"
                            value={data.{$name}}
                            onChange={(e) => setData('{$name}', e.target.value)}
                            className="input-theme w-full"
                            {$this->requiredAttr()}
                        />
                        <InputError message={errors.{$name}} className="mt-2" />
                    </div>
                JSX,
            default => <<<JSX
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{$label}</label>
                        <input
                            type="{$this->htmlInputType()}"
                            value={data.{$name}}
                            onChange={(e) => setData('{$name}', e.target.value)}
                            className="input-theme w-full"
                            {$this->requiredAttr()}
                        />
                        <InputError message={errors.{$name}} className="mt-2" />
                    </div>
                JSX,
        };
    }

    /** Index.tsx jadvalidagi <td> ichidagi ifoda. */
    public function indexCellExpression(string $item = 'item'): string
    {
        $name = $this->columnName();

        return match ($this->type) {
            'boolean' => "{{$item}.{$name} ? '✓' : '—'}",
            'relation' => "{{$item}.{$this->relationMethodName()}?.name ?? '—'}",
            'image' => "{{$item}.{$name} ? <img src={{$item}.{$name}} className=\"h-8 w-8 rounded object-cover\" /> : '—'}",
            default => "{{$item}.{$name}}",
        };
    }

    private function requiredAttr(): string
    {
        return $this->required ? 'required' : '';
    }

    private function htmlInputType(): string
    {
        return match ($this->type) {
            'email' => 'email',
            'url' => 'url',
            'date' => 'date',
            'datetime' => 'datetime-local',
            default => 'text',
        };
    }

    private function stepAttr(): string
    {
        return $this->type === 'decimal' ? 'step="0.01"' : '';
    }

    private function selectOptionsJsx(): string
    {
        return collect($this->options)
            ->map(fn (string $option) => "<option value=\"{$option}\">{$option}</option>")
            ->implode("\n" . str_repeat(' ', 28));
    }
}
