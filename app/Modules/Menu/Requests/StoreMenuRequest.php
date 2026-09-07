<?php

namespace App\Modules\Menu\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('menus.create');
    }

    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:255', 'regex:/^[a-z][a-z0-9_-]*$/', 'unique:menus,key'],
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
