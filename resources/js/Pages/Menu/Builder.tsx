import { GripIcon } from '@/Components/Icons';
import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MessageKey, useLocale } from '@/i18n/LocaleProvider';
import { ICON_MAP } from '@/lib/iconMap';
import { Menu, MenuItemTarget, MenuTreeNode } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { DragEvent, FormEventHandler, useEffect, useState } from 'react';

type DropPosition = 'before' | 'after' | 'inside';

const compactInput = 'input-theme w-full !py-1.5 !px-2 text-sm';

function IconPreview({ name, className = 'w-4 h-4' }: { name: string | null; className?: string }) {
    if (!name || !ICON_MAP[name]) return <span className={`${className} inline-block`} />;
    const Icon = ICON_MAP[name];
    return <Icon className={className} />;
}

/** id -> node bo'yicha qidiruv, tree ichidan node'ni olib tashlaydi. */
function removeNode(tree: MenuTreeNode[], id: number): [MenuTreeNode | null, MenuTreeNode[]] {
    let removed: MenuTreeNode | null = null;

    const walk = (nodes: MenuTreeNode[]): MenuTreeNode[] =>
        nodes
            .filter((n) => {
                if (n.id === id) {
                    removed = n;
                    return false;
                }
                return true;
            })
            .map((n) => ({ ...n, children: walk(n.children) }));

    const result = walk(tree);

    return [removed, result];
}

function insertNode(tree: MenuTreeNode[], targetId: number, position: DropPosition, node: MenuTreeNode): MenuTreeNode[] {
    const result: MenuTreeNode[] = [];

    for (const n of tree) {
        if (n.id === targetId) {
            if (position === 'before') result.push(node);
            if (position === 'inside') {
                result.push({ ...n, children: [...n.children, node] });
                continue;
            }
            result.push({ ...n, children: insertNode(n.children, targetId, position, node) });
            if (position === 'after') result.push(node);
            continue;
        }

        result.push({ ...n, children: insertNode(n.children, targetId, position, node) });
    }

    return result;
}

function isDescendant(node: MenuTreeNode, id: number): boolean {
    return node.children.some((c) => c.id === id || isDescendant(c, id));
}

function findNode(tree: MenuTreeNode[], id: number): MenuTreeNode | null {
    for (const n of tree) {
        if (n.id === id) return n;
        const found = findNode(n.children, id);
        if (found) return found;
    }
    return null;
}

export default function Builder({ menu, tree: initialTree }: { menu: Menu; tree: MenuTreeNode[] }) {
    const { t } = useLocale();
    const { flash } = usePage().props as unknown as { flash?: { success?: string | null; error?: string | null } };

    const [tree, setTree] = useState<MenuTreeNode[]>(initialTree);
    const [dragId, setDragId] = useState<number | null>(null);
    const [dropTarget, setDropTarget] = useState<{ id: number; position: DropPosition } | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => setTree(initialTree), [initialTree]);

    const persist = (newTree: MenuTreeNode[]) => {
        setTree(newTree);
        router.post(
            route('menu-items.reorder', menu.id),
            JSON.parse(JSON.stringify({ tree: newTree })),
            { preserveScroll: true, preserveState: true, only: ['flash'] },
        );
    };

    const handleDragOver = (e: DragEvent, targetId: number) => {
        e.preventDefault();
        if (dragId === null || dragId === targetId) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const offset = e.clientY - rect.top;
        const ratio = offset / rect.height;

        const position: DropPosition = ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : 'inside';
        setDropTarget({ id: targetId, position });
    };

    const handleDrop = (targetId: number) => {
        setDropTarget(null);

        if (dragId === null || dragId === targetId || !dropTarget) return;

        const dragged = findNode(tree, dragId);
        if (!dragged) return;

        // O'zining avlodiga tashlanishiga (aylanma bog'lanish) yo'l qo'ymaslik
        if (isDescendant(dragged, targetId)) return;

        const [removed, withoutDragged] = removeNode(tree, dragId);
        if (!removed) return;

        const newTree = insertNode(withoutDragged, targetId, dropTarget.position, removed);
        persist(newTree);
        setDragId(null);
    };

    const dropToRoot = () => {
        setDropTarget(null);
        if (dragId === null) return;

        const [removed, withoutDragged] = removeNode(tree, dragId);
        if (!removed) return;

        persist([...withoutDragged, removed]);
        setDragId(null);
    };

    const deleteItem = (id: number) => {
        router.delete(route('menu-items.destroy', { menu: menu.id, item: id }), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('menus.index')} className="text-sm text-theme-primary hover:underline font-medium">
                        ← {t('menus.title')}
                    </Link>
                    <h2 className="heading-2 text-secondary-900">{t(menu.name as MessageKey)}</h2>
                </div>
            }
        >
            <Head title={`${t('menus.builder_title')} — ${t(menu.name as MessageKey)}`} />

            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-secondary-500 text-sm">{t('menus.builder_hint')}</p>
                    <Link href={route('icons.index')} target="_blank" className="text-sm font-medium text-theme-primary hover:underline flex-shrink-0">
                        {t('menus.view_icons')}
                    </Link>
                </div>

                {flash?.success && (
                    <div className="p-3 rounded-xl bg-green-50 text-green-700 text-sm font-medium">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">{flash.error}</div>
                )}

                <div className="card p-4">
                    <div
                        className="space-y-1 min-h-[3rem]"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={dropToRoot}
                    >
                        {tree.map((node) => (
                            <TreeNode
                                key={node.id}
                                node={node}
                                depth={0}
                                menu={menu}
                                dragId={dragId}
                                dropTarget={dropTarget}
                                editingId={editingId}
                                setEditingId={setEditingId}
                                onDragStart={setDragId}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onDelete={deleteItem}
                            />
                        ))}

                        {tree.length === 0 && (
                            <p className="text-sm text-secondary-400 py-6 text-center">{t('menus.no_items')}</p>
                        )}
                    </div>

                    <AddItemForm menuId={menu.id} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function TreeNode({
    node,
    depth,
    menu,
    dragId,
    dropTarget,
    editingId,
    setEditingId,
    onDragStart,
    onDragOver,
    onDrop,
    onDelete,
}: {
    node: MenuTreeNode;
    depth: number;
    menu: Menu;
    dragId: number | null;
    dropTarget: { id: number; position: DropPosition } | null;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    onDragStart: (id: number) => void;
    onDragOver: (e: DragEvent, id: number) => void;
    onDrop: (id: number) => void;
    onDelete: (id: number) => void;
}) {
    const { t } = useLocale();
    const isDragging = dragId === node.id;
    const isTarget = dropTarget?.id === node.id;

    if (editingId === node.id) {
        return (
            <div style={{ marginLeft: depth * 24 }}>
                <EditItemForm menu={menu} node={node} onDone={() => setEditingId(null)} />
                {node.children.map((child) => (
                    <TreeNode
                        key={child.id}
                        node={child}
                        depth={depth + 1}
                        menu={menu}
                        dragId={dragId}
                        dropTarget={dropTarget}
                        editingId={editingId}
                        setEditingId={setEditingId}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        );
    }

    return (
        <div style={{ marginLeft: depth * 24 }}>
            <div
                draggable
                onDragStart={() => onDragStart(node.id)}
                onDragOver={(e) => onDragOver(e, node.id)}
                onDrop={(e) => {
                    e.stopPropagation();
                    onDrop(node.id);
                }}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    isDragging ? 'opacity-40' : ''
                } ${
                    isTarget && dropTarget?.position === 'inside'
                        ? 'border-theme-primary bg-theme-primary/5'
                        : 'border-transparent hover:bg-surface-50'
                }`}
            >
                {isTarget && dropTarget?.position === 'before' && (
                    <div className="absolute left-0 right-0 -top-0.5 h-0.5 bg-theme-primary" />
                )}
                {isTarget && dropTarget?.position === 'after' && (
                    <div className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-theme-primary" />
                )}

                <span className="cursor-move text-secondary-400 hover:text-secondary-600 flex-shrink-0">
                    <GripIcon className="w-4 h-4" />
                </span>

                <IconPreview name={node.icon} className="w-4 h-4 text-secondary-500 flex-shrink-0" />

                <span className="text-sm font-medium text-secondary-900">{node.label}</span>

                {node.url && <span className="text-xs text-secondary-400 truncate">{node.url}</span>}
                {node.target === '_blank' && (
                    <span className="text-[10px] uppercase text-secondary-400 border border-surface-200 rounded px-1">
                        {t('menus.new_tab')}
                    </span>
                )}

                <span className="flex-1" />

                <button onClick={() => setEditingId(node.id)} className="text-xs font-medium text-theme-primary hover:underline">
                    {t('common.edit')}
                </button>
                <button onClick={() => onDelete(node.id)} className="text-xs font-medium text-red-600 hover:underline">
                    {t('common.delete')}
                </button>
            </div>

            {node.children.map((child) => (
                <TreeNode
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                    menu={menu}
                    dragId={dragId}
                    dropTarget={dropTarget}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

function ItemFields({
    data,
    setData,
    errors,
}: {
    data: { label: string; icon: string; url: string; target: MenuItemTarget };
    setData: (key: string, value: string) => void;
    errors: Record<string, string>;
}) {
    const { t } = useLocale();

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 flex-1">
            <div className="md:col-span-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-lg border border-surface-200 flex items-center justify-center flex-shrink-0 bg-white">
                        <IconPreview name={data.icon || null} className="w-4 h-4 text-secondary-500" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('menus.icon_placeholder')}
                        value={data.icon}
                        onChange={(e) => setData('icon', e.target.value)}
                        className={compactInput}
                    />
                </div>
            </div>
            <div className="md:col-span-1">
                <input
                    type="text"
                    placeholder={t('menus.field.label')}
                    value={data.label}
                    onChange={(e) => setData('label', e.target.value)}
                    className={compactInput}
                    required
                />
                <InputError message={errors.label} className="mt-1" />
            </div>
            <div className="md:col-span-2">
                <input
                    type="text"
                    placeholder="/admin/users"
                    value={data.url}
                    onChange={(e) => setData('url', e.target.value)}
                    className={compactInput}
                />
                <InputError message={errors.url} className="mt-1" />
            </div>
            <div className="md:col-span-1">
                <select value={data.target} onChange={(e) => setData('target', e.target.value)} className={compactInput}>
                    <option value="_self">{t('menus.target.same_tab')}</option>
                    <option value="_blank">{t('menus.target.new_tab')}</option>
                </select>
            </div>
        </div>
    );
}

function EditItemForm({ menu, node, onDone }: { menu: Menu; node: MenuTreeNode; onDone: () => void }) {
    const { t } = useLocale();
    const { data, setData, put, processing, errors } = useForm({
        label: node.label,
        icon: node.icon ?? '',
        url: node.url ?? '',
        target: node.target,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('menu-items.update', { menu: menu.id, item: node.id }), {
            preserveScroll: true,
            onSuccess: onDone,
        });
    };

    return (
        <form onSubmit={submit} className="flex items-start gap-2 p-3 mb-1 rounded-lg border border-theme-primary/30 bg-theme-primary/5">
            <ItemFields data={data} setData={setData as (k: string, v: string) => void} errors={errors} />
            <div className="flex gap-1 flex-shrink-0">
                <button type="submit" disabled={processing} className="px-3 py-1.5 btn-theme-primary rounded-lg text-xs font-semibold">
                    {t('common.save')}
                </button>
                <button type="button" onClick={onDone} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-secondary-500 hover:bg-surface-100">
                    {t('common.cancel')}
                </button>
            </div>
        </form>
    );
}

function AddItemForm({ menuId }: { menuId: number }) {
    const { t } = useLocale();
    const { data, setData, post, processing, errors, reset } = useForm({
        label: '',
        icon: '',
        url: '',
        target: '_self' as MenuItemTarget,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('menu-items.store', menuId), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="flex items-start gap-2 mt-4 pt-4 border-t border-surface-200">
            <ItemFields data={data} setData={setData as (k: string, v: string) => void} errors={errors} />
            <button
                type="submit"
                disabled={processing}
                className="px-4 py-1.5 btn-theme-primary font-semibold rounded-lg text-sm flex-shrink-0"
            >
                + {t('menus.add_item')}
            </button>
        </form>
    );
}
