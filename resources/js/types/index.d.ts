export type SettingType = 'text' | 'textarea' | 'url' | 'email' | 'number' | 'boolean' | 'image';

export interface Setting {
    id: number;
    group: 'admin' | 'site';
    key: string;
    type: SettingType;
    value: string | null;
    label: string | null;
}

export type FileCategory = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

export interface FileCategoryStat {
    category: FileCategory;
    count: number;
    size: number;
}

export interface FileStats {
    byCategory: FileCategoryStat[];
    totalCount: number;
    totalSize: number;
    diskFreeBytes: number | null;
}

export interface FileItem {
    id: number;
    user_id: number;
    name: string;
    path: string;
    disk: string;
    mime_type: string | null;
    extension: string | null;
    size: number;
    url: string;
    is_image: boolean;
    category: FileCategory;
    created_at: string;
    user?: { id: number; name: string };
}

export interface Role {
    id: number;
    name: string;
    permissions_count?: number;
    permissions?: { id: number; name: string }[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    avatar_url?: string | null;
    roles?: Role[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

export interface SiteBranding {
    name: string;
    logo: string;
    favicon: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        permissions: string[];
        roles: string[];
    };
    site: SiteBranding;
};
