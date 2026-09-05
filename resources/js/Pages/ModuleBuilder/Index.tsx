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

const compactInput = 'input-theme w-full !py-2 !px-3 text-sm';

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

            <div className="max-w-6xl mx-auto space-y-4">
                <p className="text-secondary-500 text-sm">{t('module_builder.subtitle')}</p>

                {flash?.success && (
                    <div className="p-3 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                        {flash.error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    {/* Left column: fields builder */}
                    <div className="lg:col-span-2 card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-secondary-900">
                                {t('module_builder.fields_title')}
                            </h3>
                            <p className="text-xs text-secondary-400">{t('module_builder.drag_hint')}</p>
                        </div>

                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, field.id)}
                                    onDragLeave={() => setDragOverId((id) => (id === field.id ? null : id))}
                                    onDrop={() => handleDrop(index)}
                                    className={`rounded-lg border transition-colors ${
                                        dragOverId === field.id
                                            ? 'border-theme-primary bg-theme-primary/5'
                                            : 'border-surface-200 bg-surface-50/60'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 p-2">
                                        <div
                                            className="cursor-move text-secondary-400 hover:text-secondary-600 flex-shrink-0"
                                            title={t('module_builder.drag_hint')}
                                        >
                                            <GripIcon className="w-4 h-4" />
                                        </div>

                                        <input
                                            type="text"
                                            value={field.name}
                                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                                            placeholder={t('module_builder.field_name_placeholder')}
                                            className={`${compactInput} basis-32 flex-1`}
                                        />

                                        <select
                                            value={field.type}
                                            onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                                            className={`${compactInput} basis-28 flex-1`}
                                        >
                                            {fieldTypes.map((ft) => (
                                                <option key={ft} value={ft}>
                                                    {ft}
                                                </option>
                                            ))}
                                        </select>

                                        <label className="flex items-center gap-1.5 text-xs text-secondary-500 flex-shrink-0" title={t('module_builder.required')}>
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                className="checkbox-theme !w-3.5 !h-3.5"
                                            />
                                            {t('module_builder.required')}
                                        </label>

                                        <label className="flex items-center gap-1.5 text-xs text-secondary-500 flex-shrink-0" title={t('module_builder.show_in_list')}>
                                            <input
                                                type="checkbox"
                                                checked={field.in_index}
                                                onChange={(e) => updateField(field.id, { in_index: e.target.checked })}
                                                className="checkbox-theme !w-3.5 !h-3.5"
                                            />
                                            {t('module_builder.show_in_list')}
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => removeField(field.id)}
                                            disabled={fields.length === 1}
                                            className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-base leading-none flex-shrink-0 w-5"
                                            title={t('module_builder.remove_field')}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {errors[`fields.${index}.name`] && (
                                        <p className="px-2 pb-2 text-xs text-red-600">{errors[`fields.${index}.name`]}</p>
                                    )}

                                    {(field.type === 'select' || field.type === 'relation') && (
                                        <div className="px-2 pb-2 pl-8">
                                            <input
                                                type="text"
                                                value={field.type === 'select' ? field.options : field.relation_model}
                                                onChange={(e) =>
                                                    updateField(
                                                        field.id,
                                                        field.type === 'select'
                                                            ? { options: e.target.value }
                                                            : { relation_model: e.target.value },
                                                    )
                                                }
                                                placeholder={
                                                    field.type === 'select'
                                                        ? t('module_builder.options_placeholder')
                                                        : t('module_builder.relation_model_placeholder')
                                                }
                                                className={compactInput}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addField}
                            className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-theme-primary border border-theme-primary/30 hover:bg-theme-primary/5"
                        >
                            + {t('module_builder.add_field')}
                        </button>
                    </div>

                    {/* Right column: module settings + submit */}
                    <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-20">
                        <div className="card p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-secondary-900 mb-1.5">
                                    {t('module_builder.module_name')}
                                </label>
                                <input
                                    type="text"
                                    value={moduleName}
                                    onChange={(e) => setModuleName(e.target.value)}
                                    placeholder={t('module_builder.module_name_placeholder')}
                                    className={compactInput}
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <label className="flex items-center gap-2 text-sm text-secondary-900">
                                <input
                                    id="soft_deletes"
                                    type="checkbox"
                                    checked={softDeletes}
                                    onChange={(e) => setSoftDeletes(e.target.checked)}
                                    className="checkbox-theme"
                                />
                                {t('module_builder.soft_deletes')}
                            </label>

                            <button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="w-full px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                            >
                                {processing ? '...' : t('module_builder.generate')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
