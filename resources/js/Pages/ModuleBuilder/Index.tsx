import { GripIcon } from '@/Components/Icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { Head, router, usePage } from '@inertiajs/react';
import { DragEvent, useRef, useState } from 'react';

type FieldType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'decimal'
    | 'boolean'
    | 'email'
    | 'url'
    | 'date'
    | 'datetime'
    | 'select'
    | 'image'
    | 'relation';

interface FieldRow {
    id: string;
    name: string;
    type: FieldType;
    required: boolean;
    in_index: boolean;
    options: string;
    relation_model: string;
}

function makeField(): FieldRow {
    return {
        id: Math.random().toString(36).slice(2),
        name: '',
        type: 'text',
        required: true,
        in_index: true,
        options: '',
        relation_model: '',
    };
}

export default function Index({ fieldTypes }: { fieldTypes: FieldType[] }) {
    const { t } = useLocale();
    const { flash } = usePage().props as unknown as {
        flash?: { success?: string | null; error?: string | null };
    };

    const [moduleName, setModuleName] = useState('');
    const [softDeletes, setSoftDeletes] = useState(true);
    const [fields, setFields] = useState<FieldRow[]>([makeField()]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    const dragIndex = useRef<number | null>(null);

    const addField = () => setFields((prev) => [...prev, makeField()]);

    const removeField = (id: string) =>
        setFields((prev) => (prev.length > 1 ? prev.filter((f) => f.id !== id) : prev));

    const updateField = (id: string, patch: Partial<FieldRow>) =>
        setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));

    const handleDragStart = (index: number) => {
        dragIndex.current = index;
    };

    const handleDragOver = (e: DragEvent, id: string) => {
        e.preventDefault();
        setDragOverId(id);
    };

    const handleDrop = (index: number) => {
        const from = dragIndex.current;
        setDragOverId(null);
        dragIndex.current = null;

        if (from === null || from === index) return;

        setFields((prev) => {
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(index, 0, moved);
            return next;
        });
    };

    const submit = () => {
        setErrors({});

        if (!moduleName.trim()) {
            setErrors({ name: t('module_builder.error_name_required') });
            return;
        }

        setProcessing(true);

        router.post(
            route('module-builder.generate'),
            {
                name: moduleName.trim(),
                soft_deletes: softDeletes,
                fields: fields.map((f) => ({
                    name: f.name.trim(),
                    type: f.type,
                    required: f.required,
                    in_index: f.in_index,
                    options:
                        f.type === 'select'
                            ? f.options.split(',').map((o) => o.trim()).filter(Boolean)
                            : [],
                    relation_model: f.type === 'relation' ? f.relation_model.trim() : null,
                })),
            },
            {
                preserveScroll: true,
                onError: (errs) => setErrors(errs as Record<string, string>),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="heading-2 text-secondary-900">{t('module_builder.title')}</h2>}
        >
            <Head title={t('module_builder.title')} />

            <div className="max-w-5xl mx-auto space-y-6">
                <p className="text-secondary-500 text-sm">{t('module_builder.subtitle')}</p>

                {flash?.success && (
                    <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                        {flash.error}
                    </div>
                )}

                <div className="card p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-secondary-900 mb-2">
                                {t('module_builder.module_name')}
                            </label>
                            <input
                                type="text"
                                value={moduleName}
                                onChange={(e) => setModuleName(e.target.value)}
                                placeholder={t('module_builder.module_name_placeholder')}
                                className="input-theme w-full"
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 md:pt-8">
                            <input
                                id="soft_deletes"
                                type="checkbox"
                                checked={softDeletes}
                                onChange={(e) => setSoftDeletes(e.target.checked)}
                                className="checkbox-theme"
                            />
                            <label htmlFor="soft_deletes" className="text-sm text-secondary-900">
                                {t('module_builder.soft_deletes')}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-secondary-900">
                            {t('module_builder.fields_title')}
                        </h3>
                        <p className="text-xs text-secondary-500">{t('module_builder.drag_hint')}</p>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, field.id)}
                                onDragLeave={() => setDragOverId((id) => (id === field.id ? null : id))}
                                onDrop={() => handleDrop(index)}
                                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                                    dragOverId === field.id
                                        ? 'border-theme-primary bg-theme-primary/5'
                                        : 'border-surface-200 bg-surface-50/60'
                                }`}
                            >
                                <div className="cursor-move text-secondary-400 hover:text-secondary-600 pt-2" title={t('module_builder.drag_hint')}>
                                    <GripIcon className="w-5 h-5" />
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div className="md:col-span-1">
                                        <input
                                            type="text"
                                            value={field.name}
                                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                                            placeholder={t('module_builder.field_name_placeholder')}
                                            className="input-theme w-full"
                                        />
                                        {errors[`fields.${index}.name`] && (
                                            <p className="mt-1 text-xs text-red-600">{errors[`fields.${index}.name`]}</p>
                                        )}
                                    </div>

                                    <select
                                        value={field.type}
                                        onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                                        className="input-theme w-full"
                                    >
                                        {fieldTypes.map((ft) => (
                                            <option key={ft} value={ft}>
                                                {ft}
                                            </option>
                                        ))}
                                    </select>

                                    <label className="flex items-center gap-2 text-sm text-secondary-900">
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                            className="checkbox-theme"
                                        />
                                        {t('module_builder.required')}
                                    </label>

                                    <label className="flex items-center gap-2 text-sm text-secondary-900">
                                        <input
                                            type="checkbox"
                                            checked={field.in_index}
                                            onChange={(e) => updateField(field.id, { in_index: e.target.checked })}
                                            className="checkbox-theme"
                                        />
                                        {t('module_builder.show_in_list')}
                                    </label>

                                    {field.type === 'select' && (
                                        <input
                                            type="text"
                                            value={field.options}
                                            onChange={(e) => updateField(field.id, { options: e.target.value })}
                                            placeholder={t('module_builder.options_placeholder')}
                                            className="input-theme w-full md:col-span-4"
                                        />
                                    )}

                                    {field.type === 'relation' && (
                                        <input
                                            type="text"
                                            value={field.relation_model}
                                            onChange={(e) => updateField(field.id, { relation_model: e.target.value })}
                                            placeholder={t('module_builder.relation_model_placeholder')}
                                            className="input-theme w-full md:col-span-4"
                                        />
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeField(field.id)}
                                    disabled={fields.length === 1}
                                    className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed px-2 pt-2 text-lg leading-none"
                                    title={t('module_builder.remove_field')}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addField}
                        className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-theme-primary border border-theme-primary/30 hover:bg-theme-primary/5"
                    >
                        + {t('module_builder.add_field')}
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="px-6 py-3 btn-theme-primary font-semibold rounded-xl text-sm"
                    >
                        {processing ? '...' : t('module_builder.generate')}
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
