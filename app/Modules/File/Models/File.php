<?php

namespace App\Modules\File\Models;

use App\Models\User;
use App\Shared\Traits\Auditable;
use Database\Factories\FileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

#[Fillable(['user_id', 'name', 'path', 'disk', 'mime_type', 'extension', 'size'])]
class File extends Model
{
    use HasFactory, SoftDeletes, Auditable;

    public const CATEGORY_IMAGE = 'image';
    public const CATEGORY_VIDEO = 'video';
    public const CATEGORY_AUDIO = 'audio';
    public const CATEGORY_DOCUMENT = 'document';
    public const CATEGORY_ARCHIVE = 'archive';
    public const CATEGORY_OTHER = 'other';

    protected const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf'];
    protected const ARCHIVE_EXTENSIONS = ['zip', 'rar', '7z', 'tar', 'gz'];

    protected $appends = ['url', 'is_image', 'category'];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'deleted_at' => 'datetime',
        ];
    }

    public function getIsImageAttribute(): bool
    {
        return $this->isImage();
    }

    public function getCategoryAttribute(): string
    {
        return static::categoryFor($this->mime_type, $this->extension);
    }

    public static function categoryFor(?string $mimeType, ?string $extension): string
    {
        $extension = strtolower((string) $extension);

        if (str_starts_with((string) $mimeType, 'image/')) {
            return self::CATEGORY_IMAGE;
        }

        if (str_starts_with((string) $mimeType, 'video/')) {
            return self::CATEGORY_VIDEO;
        }

        if (str_starts_with((string) $mimeType, 'audio/')) {
            return self::CATEGORY_AUDIO;
        }

        if (in_array($extension, self::ARCHIVE_EXTENSIONS, true)) {
            return self::CATEGORY_ARCHIVE;
        }

        if (in_array($extension, self::DOCUMENT_EXTENSIONS, true)) {
            return self::CATEGORY_DOCUMENT;
        }

        return self::CATEGORY_OTHER;
    }

    public static function categories(): array
    {
        return [
            self::CATEGORY_IMAGE,
            self::CATEGORY_VIDEO,
            self::CATEGORY_AUDIO,
            self::CATEGORY_DOCUMENT,
            self::CATEGORY_ARCHIVE,
            self::CATEGORY_OTHER,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function isImage(): bool
    {
        return str_starts_with((string) $this->mime_type, 'image/');
    }

    protected static function newFactory(): FileFactory
    {
        return FileFactory::new();
    }
}
