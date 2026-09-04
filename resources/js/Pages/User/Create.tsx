import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create({ roles }: { roles: string[] }) {
    const { t } = useLocale();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    const toggleRole = (role: string) => {
        setData(
            'roles',
            data.roles.includes(role) ? data.roles.filter((r) => r !== role) : [...data.roles, role],
        );
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('users.create.title')}</h2>}>
            <Head title={t('users.create.title')} />

            <div className="card p-6 max-w-2xl">
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('common.name')}</label>
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
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('common.email')}</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="input-theme w-full"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('common.password')}</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="input-theme w-full"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('common.confirm_password')}</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="input-theme w-full"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('users.field.roles')}</label>
                        <div className="flex flex-wrap gap-2">
                            {roles.map((role) => (
                                <button
                                    type="button"
                                    key={role}
                                    onClick={() => toggleRole(role)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                        data.roles.includes(role)
                                            ? 'bg-theme-primary text-white border-theme-primary'
                                            : 'border-surface-200 text-secondary-500 hover:bg-surface-100'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
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
                            href={route('users.index')}
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
