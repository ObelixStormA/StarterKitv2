<?php

namespace App\Modules\Setting\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('settings.edit');
    }

    public function rules(): array
    {
        return [
            'key' => [
                'required', 'string', 'max:255', 'regex:/^[a-z0-9_]+$/',
                Rule::unique('settings', 'key')
                    ->where(fn ($q) => $q->where('group', $this->route('setting')->group))
                    ->ignore($this->route('setting')),
            ],
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
