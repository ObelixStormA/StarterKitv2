import { useLocale } from '@/i18n/LocaleProvider';

const ACTION_KEYS: Record<string, 'permission.view' | 'permission.ownview' | 'permission.create' | 'permission.edit' | 'permission.delete'> = {
    view: 'permission.view',
    ownview: 'permission.ownview',
    create: 'permission.create',
    edit: 'permission.edit',
    delete: 'permission.delete',
};

export default function PermissionMatrix({
    groupedPermissions,
    selected,
    onToggle,
}: {
    groupedPermissions: Record<string, string[]>;
    selected: string[];
    onToggle: (permission: string) => void;
}) {
    const { t } = useLocale();

    return (
        <div className="space-y-4">
            {Object.entries(groupedPermissions).map(([module, permissions]) => (
                <div key={module} className="rounded-xl border border-surface-200 p-4">
                    <p className="text-sm font-bold text-secondary-900 capitalize mb-3">{module}</p>
                    <div className="flex flex-wrap gap-3">
                        {permissions.map((permission) => {
                            const action = permission.split('.')[1];
                            return (
                                <label
                                    key={permission}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-200 cursor-pointer hover:bg-surface-50"
                                >
                                    <input
                                        type="checkbox"
                                        className="checkbox-theme"
                                        checked={selected.includes(permission)}
                                        onChange={() => onToggle(permission)}
                                    />
                                    <span className="text-sm text-secondary-500">
                                        {ACTION_KEYS[action] ? t(ACTION_KEYS[action]) : action}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
