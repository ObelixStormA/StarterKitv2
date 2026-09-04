import LanguageSwitcher from '@/Components/LanguageSwitcher';
import Logo from '@/Components/Logo';
import { SiteBranding } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
    const { site } = usePage().props as unknown as { site: SiteBranding };
    const year = new Date().getFullYear();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-surface-100 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgb(var(--theme-primary)) 0%, transparent 70%)' }}
                />
                <div
                    className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgb(var(--theme-accent)) 0%, transparent 70%)' }}
                />
            </div>

            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher />
            </div>

            <div className="relative w-full max-w-[480px]">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center">
                        <Logo site={site} imgClassName="h-8" textClassName="text-xl font-bold text-secondary-900" />
                    </Link>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-surface-200">
                    {children}
                </div>

                <div className="text-center mt-8 space-y-2">
                    <p className="text-sm text-secondary-500">
                        &copy; {year}. Barcha huquqlar himoyalangan.
                    </p>
                </div>
            </div>
        </div>
    );
}
