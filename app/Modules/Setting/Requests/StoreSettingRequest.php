<?php

namespace App\Modules\Setting\Requests;

use App\Modules\Setting\Models\Setting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('settings.create');
    }

    public function rules(): array
    {
        return [
            'group' => ['required', Rule::in(Setting::groups())],
            'key' => [
                'required', 'string', 'max:255', 'regex:/^[a-z0-9_]+$/',
                Rule::unique('settings', 'key')->where(fn ($q) => $q->where('group', $this->input('group'))),
            ],
            'type' => ['nullable', Rule::in(Setting::types())],
            'value' => ['nullable', 'string'],
            'file' => ['nullable', 'image', 'max:2048'],
            'label' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'key.regex' => "Key faqat kichik harflar, raqamlar va pastki chiziqdan iborat bo'lishi kerak (masalan: facebook_url)",
        ];
    }
}
