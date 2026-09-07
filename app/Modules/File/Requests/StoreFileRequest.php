<?php

namespace App\Modules\File\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('files.create');
    }

    /**
     * Ruxsat etilgan kengaytmalar (allowlist). `mimes` qoidasi faylning
     * haqiqiy kontent-turini (magic bytes) tekshiradi — shunchaki nom
     * kengaytmasini emas — shuning uchun `.php`ni `.jpg` deb nomlab
     * yuklashning oldini oladi.
     */
    protected const ALLOWED_MIMES = 'jpg,jpeg,png,gif,webp,svg,bmp,'
        . 'mp4,mov,avi,webm,'
        . 'mp3,wav,ogg,'
        . 'pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,rtf,'
        . 'zip,rar,7z,tar,gz';

    public function rules(): array
    {
        return [
            'files' => ['required', 'array', 'min:1'],
            'files.*' => ['required', 'file', 'max:20480', 'mimes:' . self::ALLOWED_MIMES],
        ];
    }
}
