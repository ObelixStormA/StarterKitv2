import InputError from '@/Components/InputError';
import { usePermission } from '@/hooks/usePermission';
import { useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete } from '@/lib/swal';
import { Setting } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function SettingRow({ setting }: { setting: Setting }) {
    const { can } = usePermission();
    const { t } = useLocale();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(setting.value);

    const { data, setData, post, processing, errors, isDirty } = useForm({
        _method: 'put' as const,
        key: setting.key,
        label: setting.label ?? '',
        value: setting.value ?? '',
        file: null as File | null,
    });

    const save: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('settings.update', setting.id), { preserveScroll: true, forceFormData: true });
    };

    const destroy = async () => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('settings.delete_confirm', { key: setting.key }),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('settings.destroy', setting.id), { preserveScroll: true });
        }
    };

    const pickFile = (file: File | undefined) => {
        if (!file) return;
        setData('file', file);
        setPreview(URL.createObjectURL(file));
    };

    const disabled = !can('settings.edit');

    return (
        <form onSubmit={save} className="grid grid-cols-12 gap-3 items-start py-3 border-b border-surface-100 last:border-0">
            <div className="col-span-3">
                <input
                    type="text"
                    value={data.key}
                    onChange={(e) => setData('key', e.target.value)}
                    disabled={disabled}
                    className="input-theme w-full font-mono text-sm"
                />
                <InputError message={errors.key} className="mt-1" />
            </div>
            <div className="col-span-3">
                <input
                    type="text"
                    placeholder={`${t('settings.label')} (${t('common.optional')})`}
                    value={data.label}
                    onChange={(e) => setData('label', e.target.value)}
                    disabled={disabled}
                    className="input-theme w-full text-sm"
                />
            </div>
            <div className="col-span-4">
                {setting.type === 'textarea' && (
                    <textarea
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        disabled={disabled}
                        rows={2}
                        className="input-theme w-full text-sm"
                    />
                )}

                {setting.type === 'boolean' && (
                    <label className="flex items-center gap-2 h-full pt-2">
                        <input
                            type="checkbox"
                            checked={data.value === '1'}
                            onChange={(e) => setData('value', e.target.checked ? '1' : '0')}
                            disabled={disabled}
                            className="checkbox-theme"
                        />
                        <span className="text-sm text-secondary-500">
                            {data.value === '1' ? t('settings.enabled') : t('settings.disabled')}
                        </span>
                    </label>
                )}

                {setting.type === 'image' && (
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border border-surface-200 flex items-center justify-center overflow-hidden bg-white flex-shrink-0">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt=""
                                    className="w-full h-full object-contain"
                                    onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                                />
                            ) : (
                                <span className="text-[10px] text-secondary-400">{t('settings.no_image')}</span>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => pickFile(e.target.files?.[0])}
                            disabled={disabled}
                        />

                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-surface-200 text-secondary-500 hover:bg-surface-100"
                            >
                                {t('settings.pick_image')}
                            </button>
                        )}

                        <InputError message={errors.file} className="mt-1" />
                    </div>
                )}

                {!['textarea', 'boolean', 'image'].includes(setting.type) && (
                    <input
                        type={
                            setting.type === 'email'
                                ? 'email'
                                : setting.type === 'number'
                                  ? 'number'
                                  : setting.type === 'url'
                                    ? 'url'
                                    : 'text'
                        }
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        disabled={disabled}
                        className="input-theme w-full text-sm"
                    />
                )}
                <InputError message={errors.value} className="mt-1" />
            </div>
            <div className="col-span-2 flex items-center gap-2 pt-1">
                {can('settings.edit') && (
                    <button
                        type="submit"
                        disabled={!isDirty || processing}
                        className="px-3 py-1.5 btn-theme-primary rounded-lg text-xs font-semibold disabled:opacity-40"
                    >
                        {t('common.save')}
                    </button>
                )}
                {can('settings.delete') && (
                    <button
                        type="button"
                        onClick={destroy}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                        {t('common.delete')}
                    </button>
                )}
            </div>
        </form>
    );
}
