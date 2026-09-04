import InputError from '@/Components/InputError';
import { useLocale } from '@/i18n/LocaleProvider';
import { SettingType } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function AddSettingForm({ group }: { group: 'admin' | 'site' }) {
    const { t } = useLocale();
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        group,
        key: '',
        type: 'text' as SettingType,
        label: '',
        value: '',
        file: null as File | null,
    });

    const TYPE_OPTIONS: { value: SettingType; label: string }[] = [
        { value: 'text', label: t('settings.type.text') },
        { value: 'textarea', label: t('settings.type.textarea') },
        { value: 'url', label: t('settings.type.url') },
        { value: 'email', label: t('settings.type.email') },
        { value: 'number', label: t('settings.type.number') },
        { value: 'boolean', label: t('settings.type.boolean') },
        { value: 'image', label: t('settings.type.image') },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('settings.store'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                setOpen(false);
            },
        });
    };

    const pickFile = (file: File | undefined) => {
        if (!file) return;
        setData('file', file);
        setPreview(URL.createObjectURL(file));
    };

    if (!open) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
            >
                + {t('settings.add_new')}
            </button>
        );
    }

    return (
        <form onSubmit={submit} className="rounded-xl border border-surface-200 p-4 bg-surface-50">
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3">
                    <label className="block text-xs font-semibold text-secondary-500 mb-1">{t('settings.key')}</label>
                    <input
                        type="text"
                        placeholder="tiktok_url"
                        value={data.key}
                        onChange={(e) => setData('key', e.target.value)}
                        className="input-theme w-full font-mono text-sm"
                        autoFocus
                        required
                    />
                    <InputError message={errors.key} className="mt-1" />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-secondary-500 mb-1">{t('settings.type')}</label>
                    <select
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value as SettingType)}
                        className="input-theme w-full text-sm"
                    >
                        {TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={data.type === 'image' ? 'col-span-2' : 'col-span-3'}>
                    <label className="block text-xs font-semibold text-secondary-500 mb-1">
                        {t('settings.label')} ({t('common.optional')})
                    </label>
                    <input
                        type="text"
                        placeholder="TikTok"
                        value={data.label}
                        onChange={(e) => setData('label', e.target.value)}
                        className="input-theme w-full text-sm"
                    />
                </div>
                <div className={data.type === 'image' ? 'col-span-3' : 'col-span-2'}>
                    <label className="block text-xs font-semibold text-secondary-500 mb-1">{t('settings.value')}</label>

                    {data.type === 'image' ? (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg border border-surface-200 flex items-center justify-center overflow-hidden bg-white flex-shrink-0">
                                {preview ? (
                                    <img src={preview} alt="" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-[9px] text-secondary-400 text-center leading-tight">
                                        {t('settings.no_image')}
                                    </span>
                                )}
                            </div>
                            <label className="flex-1 px-3 py-2.5 rounded-lg border border-dashed border-surface-300 text-xs text-secondary-500 hover:bg-surface-100 cursor-pointer text-center truncate">
                                {data.file ? data.file.name : t('settings.pick_image_placeholder')}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => pickFile(e.target.files?.[0])}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    ) : (
                        <input
                            type="text"
                            placeholder="https://tiktok.com/..."
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            className="input-theme w-full text-sm"
                        />
                    )}
                    <InputError message={errors.value} className="mt-1" />
                    <InputError message={errors.file} className="mt-1" />
                </div>
                <div className="col-span-2 flex items-end gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                    >
                        {t('common.add')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-3 py-2.5 rounded-xl text-sm font-semibold text-secondary-500 hover:bg-surface-100"
                    >
                        {t('common.cancel')}
                    </button>
                </div>
            </div>
        </form>
    );
}
