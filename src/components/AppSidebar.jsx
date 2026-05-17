import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { History, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { ASSESSMENTS } from '../config/assessments';
import { LogoMark, Wordmark } from './Brand';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
    { path: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard', group: 'main' },
    ...ASSESSMENTS.filter((item) => item.showInSidebar).map((item) => ({
        path: item.path,
        icon: item.icon,
        labelKey: item.labelKey,
        group: 'assess',
    })),
    { path: '/history', icon: History, labelKey: 'nav.history', group: 'history' },
];

const MOBILE_ITEMS = ['/dashboard', '/resume', '/mcq', '/interview', '/history'];

function Tooltip({ label }) {
    return (
        <span
            className={cn(
                'pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold shadow-card',
                'opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-hover/sidebar:hidden',
            )}
            style={{
                background: 'rgb(var(--surface-elevated))',
                borderColor: 'rgb(var(--border))',
                color: 'rgb(var(--muted))',
            }}
        >
            {label}
        </span>
    );
}

function NavItem({ item, label, isActive, onClick }) {
    const Icon = item.icon || LayoutDashboard;

    return (
        <div className="relative group/item">
            <button
                type="button"
                onClick={onClick}
                className={cn(
                    'flex w-full items-center gap-3 overflow-hidden rounded-[22px] py-3 transition-all duration-200',
                    'justify-center px-0 group-hover/sidebar:justify-start group-hover/sidebar:px-3',
                )}
                style={{
                    background: isActive ? 'rgb(var(--brand-soft))' : 'transparent',
                    color: isActive ? 'rgb(var(--brand))' : 'rgb(var(--muted))',
                    border: isActive ? '1px solid rgb(var(--brand) / 0.18)' : '1px solid transparent',
                }}
            >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: isActive ? 'rgb(var(--surface-elevated))' : 'transparent' }}>
                    <Icon size={17} />
                </span>
                <span
                    className={cn(
                        'overflow-hidden whitespace-nowrap text-sm font-semibold',
                        'max-w-0 opacity-0 group-hover/sidebar:max-w-[170px] group-hover/sidebar:opacity-100',
                        'transition-all duration-200',
                    )}
                >
                    {label}
                </span>
            </button>
            <Tooltip label={label} />
        </div>
    );
}

export default function AppSidebar({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const isActive = (path) => location.pathname === path;
    const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
    const email = user?.email || '';
    const initials = displayName.slice(0, 2).toUpperCase();

    const mainItems = NAV_ITEMS.filter((item) => item.group === 'main');
    const assessItems = NAV_ITEMS.filter((item) => item.group === 'assess');
    const historyItems = NAV_ITEMS.filter((item) => item.group === 'history');

    return (
        <>
            <aside
                className={cn(
                    'group/sidebar fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[32px] border md:flex',
                    'w-[88px] hover:w-[280px] transition-[width] duration-300 ease-out',
                )}
                style={{
                    background: 'rgb(var(--surface-elevated) / 0.86)',
                    borderColor: 'rgb(var(--border))',
                    boxShadow: 'var(--shadow-panel)',
                    backdropFilter: 'blur(24px)',
                }}
            >
                <div className="flex items-center justify-between gap-3 border-b px-4 py-4" style={{ borderColor: 'rgb(var(--border))' }}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <LogoMark size={38} />
                        <span
                            className={cn(
                                'overflow-hidden whitespace-nowrap',
                                'max-w-0 opacity-0 transition-all duration-200 group-hover/sidebar:max-w-[150px] group-hover/sidebar:opacity-100',
                            )}
                        >
                            <Wordmark className="text-[1.25rem]" />
                        </span>
                    </div>
                    <span className="hidden group-hover/sidebar:inline-flex">
                        <ThemeToggle compact />
                    </span>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="space-y-1">
                        {mainItems.map((item) => (
                            <NavItem
                                key={item.path}
                                item={item}
                                label={t(item.labelKey)}
                                isActive={isActive(item.path)}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                    </div>

                    <div className="mx-2 my-4 h-px" style={{ background: 'rgb(var(--border))' }} />

                    <div className="space-y-1">
                        <p
                            className={cn(
                                'px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-subtle',
                                'max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-hover/sidebar:max-h-8 group-hover/sidebar:opacity-100',
                            )}
                        >
                            Assessments
                        </p>
                        {assessItems.map((item) => (
                            <NavItem
                                key={item.path}
                                item={item}
                                label={t(item.labelKey)}
                                isActive={isActive(item.path)}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                    </div>

                    <div className="mx-2 my-4 h-px" style={{ background: 'rgb(var(--border))' }} />

                    <div className="space-y-1">
                        {historyItems.map((item) => (
                            <NavItem
                                key={item.path}
                                item={item}
                                label={t(item.labelKey)}
                                isActive={isActive(item.path)}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                    </div>
                </nav>

                <div className="border-t px-3 py-4" style={{ borderColor: 'rgb(var(--border))' }}>
                    <div className="mb-3 flex items-center gap-3 overflow-hidden rounded-[24px] border p-2.5" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface2) / 0.8)' }}>
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                            <span className="text-sm font-bold">{initials}</span>
                        </div>
                        <div
                            className={cn(
                                'overflow-hidden',
                                'max-w-0 opacity-0 transition-all duration-200 group-hover/sidebar:max-w-[170px] group-hover/sidebar:opacity-100',
                            )}
                        >
                            <p className="truncate text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>{displayName}</p>
                            <p className="truncate text-xs" style={{ color: 'rgb(var(--subtle))' }}>{email}</p>
                        </div>
                    </div>

                    <div className="relative group/item">
                        <button
                            type="button"
                            onClick={onLogout}
                            className="flex w-full items-center gap-3 rounded-[22px] py-3 transition-all duration-200 justify-center group-hover/sidebar:justify-start group-hover/sidebar:px-3"
                            style={{ color: 'rgb(var(--danger))' }}
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full">
                                <LogOut size={16} />
                            </span>
                            <span
                                className={cn(
                                    'overflow-hidden whitespace-nowrap text-sm font-semibold',
                                    'max-w-0 opacity-0 transition-all duration-200 group-hover/sidebar:max-w-[170px] group-hover/sidebar:opacity-100',
                                )}
                            >
                                Log out
                            </span>
                        </button>
                        <Tooltip label="Log out" />
                    </div>
                </div>
            </aside>

            <div className="fixed right-4 top-4 z-40 md:hidden">
                <ThemeToggle compact />
            </div>

            <nav
                className="fixed inset-x-3 bottom-3 z-50 flex rounded-[28px] border px-2 py-2 md:hidden"
                style={{
                    background: 'rgb(var(--surface-elevated) / 0.9)',
                    borderColor: 'rgb(var(--border))',
                    boxShadow: 'var(--shadow-panel)',
                    backdropFilter: 'blur(22px)',
                }}
            >
                {NAV_ITEMS.filter((item) => MOBILE_ITEMS.includes(item.path)).map((item) => {
                    const Icon = item.icon || LayoutDashboard;
                    const active = isActive(item.path);
                    const label = t(item.labelKey);

                    return (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() => navigate(item.path)}
                            className="flex flex-1 flex-col items-center gap-1 rounded-[22px] px-2 py-2 text-[10px] font-semibold transition-colors duration-150"
                            style={{
                                color: active ? 'rgb(var(--brand))' : 'rgb(var(--subtle))',
                                background: active ? 'rgb(var(--brand-soft))' : 'transparent',
                            }}
                        >
                            <Icon size={17} />
                            <span>{label.split(' ')[0]}</span>
                        </button>
                    );
                })}
            </nav>
        </>
    );
}
