import { SiteBranding } from '@/types';

const DEFAULT_LOGO_PATH = '/assets/logo/logo.svg';

export default function Logo({
    site,
    imgClassName = 'h-7',
    textClassName = 'text-lg font-bold text-secondary-900',
}: {
    site: SiteBranding;
    imgClassName?: string;
    textClassName?: string;
}) {
    const hasCustomLogo = site.logo !== DEFAULT_LOGO_PATH;
    const iconSrc = hasCustomLogo ? site.logo : '/assets/logo/mark.svg';

    return (
        <span className="inline-flex items-center gap-2">
            <img src={iconSrc} alt={site.name} className={`${imgClassName} object-contain`} />
            <span className={textClassName}>{site.name}</span>
        </span>
    );
}
