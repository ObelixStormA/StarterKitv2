<?php

namespace App\Modules\File\Services;

use App\Models\User;
use App\Modules\File\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class FileService
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return $this->scoped($filters)
            ->with('user:id,name')
            ->latest()
            ->paginate(24)
            ->withQueryString();
    }

    public function upload(UploadedFile $uploaded, User $user): File
    {
        $path = $uploaded->store('files/'.date('Y/m'), 'public');

        return File::create([
            'user_id' => $user->id,
            'name' => $uploaded->getClientOriginalName(),
            'path' => $path,
            'disk' => 'public',
            'mime_type' => $uploaded->getMimeType(),
            'extension' => $uploaded->getClientOriginalExtension(),
            'size' => $uploaded->getSize(),
        ]);
    }

    public function delete(File $file): void
    {
        $file->delete();
    }

    public function restore(File $file): void
    {
        $file->restore();
    }

    public function forceDelete(File $file): void
    {
        Storage::disk($file->disk)->delete($file->path);
        $file->forceDelete();
    }

    public function trashed(array $filters = []): LengthAwarePaginator
    {
        return File::onlyTrashed()
            ->when(
                $filters['only_user_id'] ?? null,
                fn ($q, $id) => $q->where('user_id', $id)
            )
            ->with('user:id,name')
            ->latest('deleted_at')
            ->paginate(24)
            ->withQueryString();
    }

    /**
     * Har bir kategoriya (image/video/audio/document/archive/other) bo'yicha
     * fayllar soni va umumiy hajmini hisoblaydi.
     */
    public function stats(array $scopeFilters = []): array
    {
        $rows = $this->scoped($scopeFilters)->get(['mime_type', 'extension', 'size']);

        $stats = [];
        foreach (File::categories() as $category) {
            $stats[$category] = ['category' => $category, 'count' => 0, 'size' => 0];
        }

        foreach ($rows as $row) {
            $category = File::categoryFor($row->mime_type, $row->extension);
            $stats[$category]['count']++;
            $stats[$category]['size'] += $row->size;
        }

        return [
            'byCategory' => array_values($stats),
            'totalCount' => $rows->count(),
            'totalSize' => $rows->sum('size'),
            'diskFreeBytes' => @disk_free_space(Storage::disk('public')->path('')) ?: null,
        ];
    }

    protected function scoped(array $filters = [])
    {
        return File::query()
            ->when(
                $filters['search'] ?? null,
                fn ($q, $s) => $q->where('name', 'like', "%{$s}%")
            )
            ->when(
                $filters['only_user_id'] ?? null,
                fn ($q, $id) => $q->where('user_id', $id)
            )
            ->when(
                $filters['category'] ?? null,
                function ($q, $category) {
                    match ($category) {
                        File::CATEGORY_IMAGE => $q->where('mime_type', 'like', 'image/%'),
                        File::CATEGORY_VIDEO => $q->where('mime_type', 'like', 'video/%'),
                        File::CATEGORY_AUDIO => $q->where('mime_type', 'like', 'audio/%'),
                        File::CATEGORY_ARCHIVE => $q->whereIn('extension', ['zip', 'rar', '7z', 'tar', 'gz']),
                        File::CATEGORY_DOCUMENT => $q->whereIn('extension', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf']),
                        File::CATEGORY_OTHER => $q->where('mime_type', 'not like', 'image/%')
                            ->where('mime_type', 'not like', 'video/%')
                            ->where('mime_type', 'not like', 'audio/%')
                            ->whereNotIn('extension', ['zip', 'rar', '7z', 'tar', 'gz', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf']),
                        default => null,
                    };
                }
            );
    }
}
