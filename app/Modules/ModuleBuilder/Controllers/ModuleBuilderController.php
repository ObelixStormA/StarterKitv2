<?php

namespace App\Modules\ModuleBuilder\Controllers;

use App\Shared\BaseController;
use App\Support\ModuleGenerator\FieldDefinition;
use App\Support\ModuleGenerator\ModuleGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * `crud:generate`ning vizual (drag-and-drop) versiyasi — CLI bilan bir xil
 * `App\Support\ModuleGenerator` klassini ishlatadi, shuning uchun ikkalasi
 * ham har doim bir xil natija chiqaradi.
 *
 * Faqat `local` muhitda ishlaydi: production'da fayl generatsiya qilish
 * (disk yozish, keyin migratsiya kerak bo'ladigan yangi jadval) xavfli
 * amal hisoblanadi, shuning uchun bu yerda ham CLI'dagi kabi muhit bilan
 * cheklanadi.
 */
class ModuleBuilderController extends BaseController
{
    public function index(): Response
    {
        $this->guard();

        return Inertia::render('ModuleBuilder/Index', [
            'fieldTypes' => FieldDefinition::TYPES,
        ]);
    }

    public function generate(Request $request): RedirectResponse
    {
        $this->guard();

        $validated = $request->validate([
            'name' => ['required', 'string', 'regex:/^[A-Za-z][A-Za-z0-9]*$/'],
            'soft_deletes' => ['boolean'],
            'fields' => ['required', 'array', 'min:1'],
            'fields.*.name' => ['required', 'string', 'regex:/^[a-z][a-z0-9_]*$/'],
            'fields.*.type' => ['required', 'string', 'in:' . implode(',', FieldDefinition::TYPES)],
            'fields.*.required' => ['boolean'],
            'fields.*.in_index' => ['boolean'],
            'fields.*.options' => ['nullable', 'array'],
            'fields.*.options.*' => ['string'],
            'fields.*.relation_model' => ['nullable', 'string', 'regex:/^[A-Za-z][A-Za-z0-9]*$/'],
        ]);

        try {
            $fields = array_map(
                fn (array $field) => FieldDefinition::fromArray($field),
                $validated['fields']
            );

            $generator = new ModuleGenerator(
                $validated['name'],
                $fields,
                $validated['soft_deletes'] ?? true
            );

            $created = $generator->generate();

            return back()->with(
                'success',
                count($created) . " ta fayl yaratildi ({$validated['name']} moduli). Endi: php artisan migrate, php artisan db:seed --class=RolePermissionSeeder, npm run build"
            );
        } catch (\Throwable $e) {
            return back()->with('error', 'Generatsiya xatosi: ' . $e->getMessage());
        }
    }

    private function guard(): void
    {
        abort_unless(app()->environment('local'), 404);
        abort_unless(auth()->user()->can('settings.edit'), 403);
    }
}
