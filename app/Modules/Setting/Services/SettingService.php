<?php

namespace App\Modules\Setting\Services;

use App\Modules\Setting\Models\Setting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class SettingService
{
    /**
     * Berilgan guruh bo'yicha barcha sozlamalarni qaytaradi.
     */
    public function byGroup(string $group): Collection
    {
        return Setting::query()
            ->where('group', $group)
            ->orderBy('id')
            ->get();
    }

    public function create(array $data): Setting
    {
        $type = $data['type'] ?? Setting::TYPE_TEXT;
        $value = $data['value'] ?? null;

        if ($type === Setting::TYPE_IMAGE && ($data['file'] ?? null) instanceof UploadedFile) {
            $value = $this->storeImage($data['file']);
        }

        return Setting::create([
            'group' => $data['group'],
            'key' => $data['key'],
            'type' => $type,
            'value' => $value,
            'label' => $data['label'] ?? null,
        ]);
    }

    public function update(Setting $setting, array $data): Setting
    {
        $value = $data['value'] ?? $setting->value;

        if ($setting->type === Setting::TYPE_IMAGE && ($data['file'] ?? null) instanceof UploadedFile) {
            $this->deleteImage($setting->value);
            $value = $this->storeImage($data['file']);
        }

        $setting->update([
            'key' => $data['key'] ?? $setting->key,
            'value' => $value,
            'label' => $data['label'] ?? $setting->label,
        ]);

        return $setting->fresh();
    }

    protected function storeImage(UploadedFile $file): string
    {
        $path = $file->store('settings', 'public');

        return Storage::disk('public')->url($path);
    }

    protected function deleteImage(?string $url): void
    {
        if (! $url || ! str_contains($url, '/storage/settings/')) {
            return;
        }

        $path = 'settings/'.basename($url);
        Storage::disk('public')->delete($path);
    }

    /**
     * Berilgan standart (default) sozlamalarni mavjud bo'lmasa yaratadi.
     * Mavjud qiymatlarni ustidan yozmaydi.
     */
    public function seedDefaults(string $group, array $defaults): void
    {
        foreach ($defaults as $default) {
            Setting::firstOrCreate(
                ['group' => $group, 'key' => $default['key']],
                [
                    'type' => $default['type'] ?? Setting::TYPE_TEXT,
                    'label' => $default['label'] ?? null,
                    'value' => $default['value'] ?? null,
                ]
            );
        }
    }

    public function delete(Setting $setting): void
    {
        if ($setting->type === Setting::TYPE_IMAGE) {
            $this->deleteImage($setting->value);
        }

        $setting->delete();
    }

    /**
     * Butun ilova bo'ylab ishlatish uchun key => value ko'rinishida qaytaradi.
     * Masalan: SettingService::get('site', 'facebook_url')
     */
    public function get(string $group, string $key, mixed $default = null): mixed
    {
        return Setting::query()
            ->where('group', $group)
            ->where('key', $key)
            ->value('value') ?? $default;
    }
}
