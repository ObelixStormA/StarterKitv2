import InputError from '@/Components/InputError';
import { useLocale } from '@/i18n/LocaleProvider';
import { Setting } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

/**
 * Sayt nomi va logotipini o'zgartirish uchun soddalashtirilgan panel.
 * "Key" haqida umuman o'ylash shart emas — mavjud site_name/site_logo
 * sozlamalariga to'g'ridan-to'g'ri, faqat "value"/"file" yuborib yangilaydi.
 */
export default function BrandingCard({ settings }: { settings: Setting[] }) {
    const { t } = useLocale();
    const logoSetting = settings.find((s) => s.key === 'site_logo');
    const nameSetting = settings.find((s) => s.key === 'site_name');

    if (!logoSetting && !nameSetting) {
        return null;
    }

    return (
        <div className="card p-6 mb-6">
            <h3 className="text-base font-bold text-secondary-900 mb-1">{t('settings.branding')}</h3>
            <p className="text-sm text-secondary-500 mb-5">{t('settings.branding_desc')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {logoSetting && <LogoField setting={logoSetting} />}
                {nameSetting && <NameField setting={nameSetting} />}
            </div>
        </div>
    );
}

function LogoField({ setting }: { setting: Setting }) {
    const { t } = useLocale();
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(setting.value);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const pick = (file: File | undefined) => {
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setProcessing(true);
        setError(undefined);

        router.post(
            route('settings.update', setting.id),
            {
                _method: 'put',
                key: setting.key,
                label: setting.label ?? '',
                file,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onError: (errors) => setError(errors.file ?? errors.key),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('settings.site_logo')}</label>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-surface-200 flex items-center justify-center overflow-hidden bg-white flex-shrink-0">
                    {preview ? (
                        <img src={preview} alt="" className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-[10px] text-secondary-400">{t('settings.no_image')}</span>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => pick(e.target.files?.[0])}
                />
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={processing}
                    className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm disabled:opacity-60"
                >
                    {processing ? t('files.uploading') : t('settings.pick_image')}
                </button>
            </div>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

function NameField({ setting }: { setting: Setting }) {
    const { t } = useLocale();
    const { data, setData, put, processing, errors, isDirty } = useForm({
        key: setting.key,
        label: setting.label ?? '',
        value: setting.value ?? '',
    });

    const save = () => {
        put(route('settings.update', setting.id), { preserveScroll: true });
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('settings.site_name')}</label>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={data.value}
                    onChange={(e) => setData('value', e.target.value)}
                    className="input-theme flex-1"
                />
                <button
                    type="button"
                    onClick={save}
                    disabled={!isDirty || processing}
                    className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm disabled:opacity-40"
                >
                    {t('common.save')}
                </button>
            </div>
            <InputError message={errors.value} className="mt-2" />
        </div>
    );
}
