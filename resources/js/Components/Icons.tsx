import { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (children: ReactNode, props: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {children}
    </svg>
);

export const DashboardIcon = (props: IconProps) =>
    base(
        <>
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </>,
        props,
    );

export const WandIcon = (props: IconProps) =>
    base(
        <>
            <path d="M15 4V2m0 6V6m3.5 1.5L20 6m-8.5 1.5L10 6M4 20l9-9m3-3 2 2" />
            <path d="M17 4h2m-1-1v2" />
        </>,
        props,
    );

export const GripIcon = (props: IconProps) =>
    base(
        <>
            <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none" />
            <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="9" cy="18" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="6" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="18" r="1" fill="currentColor" stroke="none" />
        </>,
        props,
    );

export const UserIcon = (props: IconProps) =>
    base(
        <>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20c1.5-3.5 5-5 7.5-5s6 1.5 7.5 5" />
        </>,
        props,
    );

export const LogoutIcon = (props: IconProps) =>
    base(
        <>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
        </>,
        props,
    );

export const MenuIcon = (props: IconProps) =>
    base(
        <>
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
        </>,
        props,
    );

export const SearchIcon = (props: IconProps) =>
    base(
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
        </>,
        props,
    );

export const BellIcon = (props: IconProps) =>
    base(
        <>
            <path d="M6 8a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8z" />
            <path d="M10 20a2 2 0 004 0" />
        </>,
        props,
    );

export const SettingsIcon = (props: IconProps) =>
    base(
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 00.33 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.33 1.7 1.7 0 00-1.03 1.56V21a2 2 0 11-4 0v-.09A1.7 1.7 0 008 19.35a1.7 1.7 0 00-1.87.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.7 1.7 0 004.65 15a1.7 1.7 0 00-1.56-1.03H3a2 2 0 110-4h.09A1.7 1.7 0 004.6 8.65a1.7 1.7 0 00-.33-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06A1.7 1.7 0 008.65 4.6a1.7 1.7 0 001.03-1.56V3a2 2 0 114 0v.09a1.7 1.7 0 001.03 1.56 1.7 1.7 0 001.87-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.35 8c.14.5.5.9 1.03 1.03H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.56 1.03z" />
        </>,
        props,
    );

export const UsersIcon = (props: IconProps) =>
    base(
        <>
            <circle cx="9" cy="8" r="3.2" />
            <path d="M2.8 20c1.2-3 4-4.8 6.2-4.8s5 1.8 6.2 4.8" />
            <circle cx="17" cy="8.5" r="2.6" />
            <path d="M15.8 13.4c1.9.4 3.9 1.9 4.8 4" />
        </>,
        props,
    );

export const ShieldIcon = (props: IconProps) =>
    base(
        <>
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
            <path d="M9.5 12l1.8 1.8L14.5 10" />
        </>,
        props,
    );

export const GitHubIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
);

export const GoogleIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24Z" />
        <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.99-3.11Z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.61l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
);

export const AuditIcon = (props: IconProps) =>
    base(
        <>
            <path d="M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z" />
            <rect x="5" y="5" width="14" height="16" rx="2" />
            <path d="M9 11h6" />
            <path d="M9 15h6" />
            <path d="M9 19h3" />
        </>,
        props,
    );

export const FolderIcon = (props: IconProps) =>
    base(
        <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />,
        props,
    );

export const UploadIcon = (props: IconProps) =>
    base(
        <>
            <path d="M12 16V4" />
            <path d="M7 9l5-5 5 5" />
            <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
        </>,
        props,
    );

export const DownloadIcon = (props: IconProps) =>
    base(
        <>
            <path d="M12 4v12" />
            <path d="M7 11l5 5 5-5" />
            <path d="M4 20h16" />
        </>,
        props,
    );

export const ImageIcon = (props: IconProps) =>
    base(
        <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="M21 16l-5.5-5.5L4 21" />
        </>,
        props,
    );

export const VideoIcon = (props: IconProps) =>
    base(
        <>
            <rect x="2.5" y="6" width="14" height="12" rx="2" />
            <path d="M16.5 10.5l5-3v9l-5-3" />
        </>,
        props,
    );

export const MusicIcon = (props: IconProps) =>
    base(
        <>
            <path d="M9 18V5l11-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
        </>,
        props,
    );

export const ArchiveIcon = (props: IconProps) =>
    base(
        <>
            <rect x="3" y="4" width="18" height="4" rx="1" />
            <path d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
            <path d="M10 12h4" />
        </>,
        props,
    );

export const FileIcon = (props: IconProps) =>
    base(
        <>
            <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
            <path d="M14 3v5h5" />
        </>,
        props,
    );

export const CreditCardIcon = (props: IconProps) =>
    base(
        <>
            <rect x="2.5" y="5" width="19" height="14" rx="2" />
            <path d="M2.5 10h19" />
            <path d="M6 15h4" />
        </>,
        props,
    );

export const DevicesIcon = (props: IconProps) =>
    base(
        <>
            <rect x="2.5" y="4" width="14" height="10" rx="1.5" />
            <path d="M8 18h6" />
            <path d="M9 14v4" />
            <rect x="17.5" y="9" width="4.5" height="8" rx="1" />
        </>,
        props,
    );
