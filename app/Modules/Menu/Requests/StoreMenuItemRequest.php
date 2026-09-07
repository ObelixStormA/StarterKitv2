<?php

namespace App\Modules\Menu\Requests;

use App\Modules\Menu\Models\Menu;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('menus.edit');
    }

    public function rules(): array
    {
        /** @var Menu $menu */
        $menu = $this->route('menu');

        return [
            'label' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'max:2048'],
            'target' => ['required', Rule::in(['_self', '_blank'])],
            'parent_id' => [
                'nullable',
                Rule::exists('menu_items', 'id')->where('menu_id', $menu->id),
            ],
        ];
    }
}
