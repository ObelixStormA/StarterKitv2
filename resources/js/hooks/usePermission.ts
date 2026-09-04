import { usePage } from '@inertiajs/react';

type AuthProps = {
    auth: {
        user: { id: number; name: string; email: string };
        permissions: string[];
        roles: string[];
    };
};

export function usePermission() {
    const { auth } = usePage().props as unknown as AuthProps;

    const can = (permission: string): boolean => auth.permissions?.includes(permission) ?? false;

    const canAny = (permissions: string[]): boolean => permissions.some(can);

    const hasRole = (role: string): boolean => auth.roles?.includes(role) ?? false;

    return { can, canAny, hasRole, permissions: auth.permissions ?? [], roles: auth.roles ?? [] };
}
