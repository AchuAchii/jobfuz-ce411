import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ChevronRight, LogOut, Menu, User, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import AppSidebar from './AppSidebar';
import { BrandLockup } from './Brand';
import ThemeToggle from './ThemeToggle';

function scrollToAnchor(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getPageScrollTop() {
    if (typeof window === 'undefined') return 0;
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

const NAV_ITEMS = [
    { label: 'Home', anchor: 'hero', activeIdx: 0 },
    { label: 'Assessment Map', anchor: 'features', activeIdx: 1 },
    { label: 'Contact', anchor: 'contact', activeIdx: 7 },
];

function LandingHeader({
    activeSection,
    isScrolled,
    user,
    onLogout,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    navigate,
}) {
    const showSolid = isScrolled || activeSection > 0;

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
            <div
                className="mx-auto flex h-[var(--header-h)] max-w-[1320px] items-center justify-between rounded-full border px-3 sm:px-4 lg:px-5"
                style={{
                    background: showSolid ? 'rgb(var(--surface-elevated) / 0.96)' : 'rgb(var(--surface-elevated) / 0.9)',
                    borderColor: 'rgb(var(--border))',
                    boxShadow: showSolid ? 'var(--shadow-lift)' : 'var(--shadow-card)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                }}
            >
                <button type="button" onClick={() => (user ? navigate('/dashboard') : scrollToAnchor('hero'))} className="flex items-center gap-3">
                    <BrandLockup size={36} wordmarkClassName="text-[1.15rem]" />
                </button>

                <nav className="hidden lg:flex items-center gap-1">
                    {NAV_ITEMS.map(({ label, anchor, activeIdx }) => {
                        const isActive = activeSection === activeIdx;
                        return (
                            <button
                                key={anchor}
                                type="button"
                                onClick={() => scrollToAnchor(anchor)}
                                className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                                style={{
                                    color: isActive ? 'rgb(var(--text))' : 'rgb(var(--muted))',
                                    background: isActive ? 'rgb(var(--surface2))' : 'transparent',
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle compact className="hidden sm:inline-flex" />

                    {user ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsProfileMenuOpen((current) => !current)}
                                className="flex items-center gap-3 rounded-full border px-2 py-2 pl-3 transition-all duration-200"
                                style={{
                                    borderColor: 'rgb(var(--border))',
                                    background: 'rgb(var(--surface2) / 0.7)',
                                }}
                            >
                                <div className="hidden md:block text-right">
                                    <p className="text-xs font-semibold" style={{ color: 'rgb(var(--text))' }}>
                                        {user?.user_metadata?.display_name || 'User'}
                                    </p>
                                    <p className="text-[0.68rem] uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                        Personal studio
                                    </p>
                                </div>
                                <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                    <User size={16} />
                                </span>
                            </button>

                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                                        <Motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                            transition={{ duration: 0.18 }}
                                            className="absolute right-0 top-14 z-50 w-56 rounded-[26px] border p-2"
                                            style={{
                                                background: 'rgb(var(--surface-elevated) / 0.94)',
                                                borderColor: 'rgb(var(--border))',
                                                boxShadow: 'var(--shadow-panel)',
                                                backdropFilter: 'blur(20px)',
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onLogout?.();
                                                    setIsProfileMenuOpen(false);
                                                }}
                                                className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-sm font-semibold transition-colors duration-200"
                                                style={{ color: 'rgb(var(--danger))' }}
                                            >
                                                <LogOut size={15} />
                                                Log out
                                            </button>
                                        </Motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="hidden md:inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold"
                                style={{
                                    borderColor: 'rgb(var(--border))',
                                    background: 'rgb(var(--surface2) / 0.72)',
                                    color: 'rgb(var(--text))',
                                }}
                            >
                                Log in
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/signup')}
                                className="hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg, rgb(var(--brand)) 0%, rgb(var(--accent)) 100%)' }}
                            >
                                Get started
                                <ChevronRight size={15} />
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        className="inline-flex lg:hidden items-center justify-center rounded-full border p-2.5"
                        style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--text))', background: 'rgb(var(--surface2) / 0.7)' }}
                        onClick={() => setIsMobileMenuOpen((current) => !current)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <Motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="mx-auto mt-3 max-w-[1320px] overflow-hidden rounded-[28px] border"
                        style={{
                            background: 'rgb(var(--surface-elevated) / 0.92)',
                            borderColor: 'rgb(var(--border))',
                            boxShadow: 'var(--shadow-panel)',
                            backdropFilter: 'blur(24px)',
                        }}
                    >
                        <div className="space-y-2 p-3">
                            {NAV_ITEMS.map(({ label, anchor }) => (
                                <button
                                    key={anchor}
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        scrollToAnchor(anchor);
                                    }}
                                    className="flex w-full items-center justify-between rounded-[20px] px-4 py-3 text-left text-sm font-semibold"
                                    style={{ background: 'rgb(var(--surface2) / 0.85)', color: 'rgb(var(--text))' }}
                                >
                                    {label}
                                    <ChevronRight size={15} style={{ color: 'rgb(var(--subtle))' }} />
                                </button>
                            ))}
                            {!user && (
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            navigate('/login');
                                        }}
                                        className="rounded-[20px] border px-4 py-3 text-sm font-semibold"
                                        style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--text))' }}
                                    >
                                        Log in
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            navigate('/signup');
                                        }}
                                        className="rounded-[20px] px-4 py-3 text-sm font-semibold text-white"
                                        style={{ background: 'linear-gradient(135deg, rgb(var(--brand)) 0%, rgb(var(--accent)) 100%)' }}
                                    >
                                        Get started
                                    </button>
                                </div>
                            )}
                            <ThemeToggle className="w-full justify-center sm:hidden" />
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default function Layout({
    children,
    activeSection = 0,
    user,
    onLogout,
}) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isLanding = location.pathname === '/';
    const isAuthRoute = ['/login', '/signup', '/auth', '/reset-password'].some((path) => location.pathname.startsWith(path));
    const hasSidebar = !isLanding && !!user;

    useEffect(() => {
        if (!isLanding) return undefined;

        const onScroll = () => setIsScrolled(getPageScrollTop() > 10);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        document.documentElement.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            document.documentElement.removeEventListener('scroll', onScroll);
        };
    }, [isLanding]);

    useEffect(() => {
        if (!isMobileMenuOpen) return undefined;
        const frame = window.requestAnimationFrame(() => setIsMobileMenuOpen(false));
        return () => window.cancelAnimationFrame(frame);
    }, [location.pathname, isMobileMenuOpen]);

    return (
        <div className="min-h-screen font-sans" style={{ background: 'rgb(var(--bg))', color: 'rgb(var(--text))' }}>
            {hasSidebar && <AppSidebar user={user} onLogout={onLogout} />}

            {!hasSidebar && !isAuthRoute && (
                <>
                    <LandingHeader
                        activeSection={activeSection}
                        isScrolled={isScrolled}
                        user={user}
                        onLogout={onLogout}
                        isProfileMenuOpen={isProfileMenuOpen}
                        setIsProfileMenuOpen={setIsProfileMenuOpen}
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                        navigate={navigate}
                    />
                    {!isLanding && <div style={{ height: 'var(--header-h)' }} />}
                </>
            )}

            <main className={cn('relative z-10', hasSidebar && 'pb-20 md:pb-0 md:ml-[92px]')}>
                {children}
            </main>
        </div>
    );
}

