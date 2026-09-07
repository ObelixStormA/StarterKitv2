import InputError from '@/Components/InputError';
import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePermission } from '@/hooks/usePermission';
import { useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete } from '@/lib/swal';
import { Menu, Paginated } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

function AddMenuForm() {
    const { t } = useLocale();
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        key: '',
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('menus.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    if (!open) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
            >
                + {t('menus.new')}
            </button>
        );
    }

    return (
        <form onSubmit={submit} className="rounded-xl border border-surface-200 p-4 bg-surface-50 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-secondary-500 mb-1">{t('menus.field.key')}</label>
                    <input
                        type="text"
                        placeholder="admin"
                        value={data.key}
                        onChange={(e) => setData('key', e.target.value)}
                        className="input-theme w-full font-mono text-sm"
                        autoFocus
                        required
                    />
                    <InputError message={errors.key} className="mt-1" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-secondary-500 mb-1">{t('menus.field.name')}</label>
                    <input
                        type="text"
                        placeholder="Admin Menu"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="input-theme w-full text-sm"
                        required
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>
                <div className="flex items-end gap-2 md:col-span-2">
                    <button type="submit" disabled={processing} className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm">
                        {t('common.add')}
                    </button>
                    <button type="button" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-secondary-500 hover:bg-surface-100">
                        {t('common.cancel')}
                    </button>
                </div>
            </div>
        </form>
    );
}

function MenuRow({ menu }: { menu: Menu }) {
    const { t } = useLocale();
    const { can } = usePermission();
    const [editing, setEditing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        key: menu.key,
        name: menu.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('menus.update', menu.id), {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const destroy = async () => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('menus.delete_confirm', { name: menu.name }),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('menus.destroy', menu.id));
        }
    };

    if (editing) {
        return (
            <tr className="border-b border-surface-100">
                <td className="py-2 pr-4" colSpan={3}>
                    <form onSubmit={submit} className="flex flex-wrap items-start gap-2">
                        <div>
                            <input
                                type="text"
                                value={data.key}
                                onChange={(e) => setData('key', e.target.value)}
                                className="input-theme !py-1.5 !px-2 text-sm font-mono w-32"
                            />
                            <InputError message={errors.key} className="mt-1" />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="input-theme !py-1.5 !px-2 text-sm w-48"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                        <button type="submit" disabled={processing} className="px-3 py-1.5 btn-theme-primary rounded-lg text-xs font-semibold">
                            {t('common.save')}
                        </button>
                        <button type="button" onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-secondary-500 hover:bg-surface-100">
                            {t('common.cancel')}
                        </button>
                    </form>
                </td>
            </tr>
        );
    }

    return (
        <tr className="border-b border-surface-100 last:border-0">
            <td className="py-3 pr-4">
                <span className="font-mono text-xs text-secondary-500">{menu.key}</span>
            </td>
            <td className="py-3 pr-4 text-secondary-900 font-medium">{menu.name}</td>
            <td className="py-3 pr-4 text-secondary-500">{menu.items_count ?? 0}</td>
            <td className="py-3 pr-4 text-right space-x-2 whitespace-nowrap">
                {can('menus.edit') && (
                    <Link href={route('menus.builder', menu.id)} className="text-theme-primary hover:underline text-sm font-medium">
                        {t('menus.open_builder')}
                    </Link>
                )}
                {can('menus.edit') && (
                    <button onClick={() => setEditing(true)} className="text-secondary-500 hover:underline text-sm font-medium">
                        {t('common.edit')}
                    </button>
                )}
                {can('menus.delete') && (
                    <button onClick={destroy} className="text-red-600 hover:underline text-sm font-medium">
                        {t('common.delete')}
                    </button>
                )}
            </td>
        </tr>
    );
}

export default function Index({ menus }: { menus: Paginated<Menu> }) {
    const { t } = useLocale();
    const { can } = usePermission();

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('menus.title')}</h2>}>
            <Head title={t('menus.title')} />

            <div className="card p-6">
                <div className="flex items-center justify-end gap-4 mb-6">
                    {can('menus.delete') && (
                        <Link href={route('menus.trashed')} className="text-sm font-medium text-secondary-500 hover:underline">
                            {t('common.trash')}
                        </Link>
                    )}
                    {can('menus.create') && <AddMenuForm />}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-secondary-500 border-b border-surface-200">
                                <th className="py-3 pr-4 font-semibold">{t('menus.field.key')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('menus.field.name')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('menus.items_count')}</th>
                                <th className="py-3 pr-4 font-semibold text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.data.map((menu) => (
                                <MenuRow key={menu.id} menu={menu} />
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={menus} />
            </div>
        </AuthenticatedLayout>
    );
}
