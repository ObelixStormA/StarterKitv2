<?php

namespace Database\Seeders;

use App\Modules\Setting\Models\Setting;
use App\Modules\Setting\Services\SettingService;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(SettingService $settings): void
    {
        $settings->seedDefaults(Setting::GROUP_SITE, [
            ['key' => 'site_description', 'label' => 'Sayt tavsifi', 'type' => Setting::TYPE_TEXTAREA, 'value' => ''],
            ['key' => 'site_keywords', 'label' => 'Kalit so\'zlar (SEO)', 'type' => Setting::TYPE_TEXT, 'value' => ''],
            ['key' => 'contact_email', 'label' => 'Aloqa uchun email', 'type' => Setting::TYPE_EMAIL, 'value' => ''],
            ['key' => 'contact_phone', 'label' => 'Aloqa uchun telefon', 'type' => Setting::TYPE_TEXT, 'value' => ''],
            ['key' => 'address', 'label' => 'Manzil', 'type' => Setting::TYPE_TEXT, 'value' => ''],
            ['key' => 'facebook_url', 'label' => 'Facebook havolasi', 'type' => Setting::TYPE_URL, 'value' => ''],
            ['key' => 'instagram_url', 'label' => 'Instagram havolasi', 'type' => Setting::TYPE_URL, 'value' => ''],
            ['key' => 'telegram_url', 'label' => 'Telegram havolasi', 'type' => Setting::TYPE_URL, 'value' => ''],
            ['key' => 'youtube_url', 'label' => 'Youtube havolasi', 'type' => Setting::TYPE_URL, 'value' => ''],
            ['key' => 'footer_text', 'label' => 'Footer matni', 'type' => Setting::TYPE_TEXTAREA, 'value' => ''],
            ['key' => 'maintenance_mode', 'label' => 'Texnik xizmat rejimi', 'type' => Setting::TYPE_BOOLEAN, 'value' => '0'],
        ]);

        $settings->seedDefaults(Setting::GROUP_ADMIN, [
            ['key' => 'site_name', 'label' => 'Sayt nomi', 'type' => Setting::TYPE_TEXT, 'value' => 'StarterKitV2'],
            ['key' => 'site_logo', 'label' => 'Logotip (URL)', 'type' => Setting::TYPE_IMAGE, 'value' => '/assets/logo/logo.svg'],
            ['key' => 'site_favicon', 'label' => 'Favicon (URL)', 'type' => Setting::TYPE_IMAGE, 'value' => '/assets/logo/favicon.ico'],
            ['key' => 'admin_email', 'label' => 'Administrator emaili', 'type' => Setting::TYPE_EMAIL, 'value' => 'admin@admin.com'],
            ['key' => 'items_per_page', 'label' => 'Ro\'yxatda sahifadagi qatorlar soni', 'type' => Setting::TYPE_NUMBER, 'value' => '15'],
            ['key' => 'timezone', 'label' => 'Vaqt zonasi', 'type' => Setting::TYPE_TEXT, 'value' => 'Asia/Tashkent'],
            ['key' => 'date_format', 'label' => 'Sana formati', 'type' => Setting::TYPE_TEXT, 'value' => 'd.m.Y'],
            ['key' => 'default_language', 'label' => 'Standart til', 'type' => Setting::TYPE_TEXT, 'value' => 'uz'],
            ['key' => 'session_timeout', 'label' => 'Sessiya muddati (daqiqa)', 'type' => Setting::TYPE_NUMBER, 'value' => '120'],
            ['key' => 'registration_enabled', 'label' => "Ro'yxatdan o'tish ochiqmi", 'type' => Setting::TYPE_BOOLEAN, 'value' => '1'],
            ['key' => 'backup_email', 'label' => 'Zaxira nusxa uchun email', 'type' => Setting::TYPE_EMAIL, 'value' => ''],
        ]);
    }
}
