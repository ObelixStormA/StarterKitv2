import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Edit({ product }: { product: Product }) {
    const { t } = useLocale();
    const { data, setData, put, processing, errors } = useForm({
        name: product.name ?? '',
        price: product.price as number | '',
        create_at: product.create_at ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('products.edit.title')}</h2>}>
            <Head title={t('products.edit.title')} />

            <div className="card p-6 max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('products.field.name')}</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="input-theme w-full"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('products.field.price')}</label>
                        <input
                            type="number"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value === '' ? '' : Number(e.target.value))}
                            className="input-theme w-full"
                            required
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('products.field.create_at')}</label>
                        <input
                            type="datetime-local"
                            value={data.create_at}
                            onChange={(e) => setData('create_at', e.target.value)}
                            className="input-theme w-full"
                        />
                        <InputError message={errors.create_at} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                        >
                            {t('common.save')}
                        </button>
                        <Link
                            href={route('products.index')}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-secondary-500 hover:bg-surface-100"
                        >
                            {t('common.cancel')}
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
