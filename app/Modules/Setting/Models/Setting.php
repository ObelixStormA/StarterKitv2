<?php

namespace App\Modules\Setting\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['group', 'key', 'type', 'value', 'label'])]
class Setting extends Model
{
    use HasFactory;

    public const GROUP_ADMIN = 'admin';
    public const GROUP_SITE = 'site';

    public const TYPE_TEXT = 'text';
    public const TYPE_TEXTAREA = 'textarea';
    public const TYPE_URL = 'url';
    public const TYPE_EMAIL = 'email';
    public const TYPE_NUMBER = 'number';
    public const TYPE_BOOLEAN = 'boolean';
    public const TYPE_IMAGE = 'image';

    public static function groups(): array
    {
        return [self::GROUP_ADMIN, self::GROUP_SITE];
    }

    public static function types(): array
    {
        return [
            self::TYPE_TEXT,
            self::TYPE_TEXTAREA,
            self::TYPE_URL,
            self::TYPE_EMAIL,
            self::TYPE_NUMBER,
            self::TYPE_BOOLEAN,
            self::TYPE_IMAGE,
        ];
    }
}
