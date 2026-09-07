import {
    ArchiveIcon,
    AuditIcon,
    BellIcon,
    CreditCardIcon,
    DashboardIcon,
    DevicesIcon,
    DownloadIcon,
    FileIcon,
    FolderIcon,
    GitHubIcon,
    GoogleIcon,
    GripIcon,
    ImageIcon,
    LogoutIcon,
    MenuIcon,
    MusicIcon,
    SearchIcon,
    SettingsIcon,
    ShieldIcon,
    UploadIcon,
    UserIcon,
    UsersIcon,
    VideoIcon,
    WandIcon,
} from '@/Components/Icons';
import { ComponentType, SVGProps } from 'react';

/**
 * Loyihadagi barcha ikonkalar — bitta manba (single source of truth).
 * Yangi ikonka qo'shsangiz, `Icons.tsx`dan tashqari shu yerga ham qo'shing —
 * shunda u "Iconkalar" katalogida va ikonka nomi kiritiladigan barcha
 * joylarda (masalan Menu Builder) avtomatik ko'rinadi.
 */
export const ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    DashboardIcon,
    WandIcon,
    UserIcon,
    LogoutIcon,
    MenuIcon,
    SearchIcon,
    BellIcon,
    SettingsIcon,
    UsersIcon,
    ShieldIcon,
    GitHubIcon,
    GoogleIcon,
    AuditIcon,
    FolderIcon,
    UploadIcon,
    DownloadIcon,
    ImageIcon,
    VideoIcon,
    MusicIcon,
    ArchiveIcon,
    FileIcon,
    CreditCardIcon,
    DevicesIcon,
    GripIcon,
};

export const ICON_NAMES = Object.keys(ICON_MAP);
