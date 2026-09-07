<?php

namespace App\Modules\Menu\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('menus.edit');
    }

    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:255', 'regex:/^[a-z][a-z0-9_-]*$/', Rule::unique('menus', 'key')->ignore($this->route('menu'))],
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
