import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

function iconClass(active) {
    return active ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600';
}

function IconDashboard({ active }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${iconClass(active)}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-10h8V3h-8v8z" />
        </svg>
    );
}

function IconCalendar({ active }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${iconClass(active)}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function IconBookings({ active }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${iconClass(active)}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h13M8 12h13M8 17h13M3 7h.01M3 12h.01M3 17h.01" />
        </svg>
    );
}

function IconInventory({ active }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${iconClass(active)}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
        </svg>
    );
}

function IconApprovals({ active }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${iconClass(active)}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function IconSettings({ active }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${iconClass(active)}`}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function IconSearch() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function IconBell() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0" />
        </svg>
    );
}

function IconMenu() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function getInitials(nameOrEmail) {
    const raw = String(nameOrEmail || '').trim();
    if (!raw) return 'U';
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function roleLabel(role) {
    const r = String(role || '').toLowerCase();
    if (r === 'admin') return 'Administrator';
    if (r === 'approver') return 'Approver';
    if (r === 'staff') return 'Staff';
    return '';
}

function SidebarLink({ href, label, subtitle, icon, active, collapsed }) {
    const activeCls = 'bg-emerald-50 text-emerald-700';
    const inactiveCls = 'text-gray-700 hover:bg-gray-50';

    return (
        <Link
            href={href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? activeCls : inactiveCls}`}
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">{icon}</div>
            {!collapsed ? (
                <div className="min-w-0">
                    <div className="truncate">{label}</div>
                    {subtitle ? <div className="truncate text-xs font-medium text-gray-500">{subtitle}</div> : null}
                </div>
            ) : null}
        </Link>
    );
}

export default function AppLayout({ title, auth, children }) {
    const page = usePage();
    const url = page.url || '';
    const canAdmin = page.props?.can?.admin;

    const user = auth?.user ?? page.props?.auth?.user;

    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem('sipinjam.sidebar.collapsed') === '1';
        } catch {
            return false;
        }
    });

    const [mobileOpen, setMobileOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const onDocClick = (e) => {
            if (!dropdownRef.current) return;
            if (!dropdownRef.current.contains(e.target)) setUserOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    useEffect(() => {
        setUserOpen(false);
        setMobileOpen(false);
    }, [url]);

    useEffect(() => {
        try {
            localStorage.setItem('sipinjam.sidebar.collapsed', collapsed ? '1' : '0');
        } catch {
            // ignore
        }
    }, [collapsed]);

    const navItems = useMemo(() => {
        const items = [
            {
                href: '/dashboard',
                label: 'Dashboard',
                subtitle: null,
                active: url.startsWith('/dashboard'),
                icon: <IconDashboard active={url.startsWith('/dashboard')} />,
            },
            {
                href: '/bookings',
                label: 'Bookings',
                subtitle: 'Peminjaman',
                active: url.startsWith('/bookings'),
                icon: <IconBookings active={url.startsWith('/bookings')} />,
            },
            {
                href: '/calendar',
                label: 'Calendar',
                subtitle: 'Jadwal & ketersediaan',
                active: url.startsWith('/calendar'),
                icon: <IconCalendar active={url.startsWith('/calendar')} />,
            },
        ];

        if (canAdmin) {
            items.push(
                {
                    href: '/admin/assets',
                    label: 'Inventory',
                    subtitle: 'Ruangan & fasilitas',
                    active: url.startsWith('/admin/assets'),
                    icon: <IconInventory active={url.startsWith('/admin/assets')} />,
                },
                {
                    href: '/admin/bookings',
                    label: 'Approvals',
                    subtitle: 'Persetujuan',
                    active: url.startsWith('/admin/bookings'),
                    icon: <IconApprovals active={url.startsWith('/admin/bookings')} />,
                }
            );
        }

        items.push({
            href: '/profile',
            label: 'Settings',
            subtitle: 'Profil akun',
            active: url.startsWith('/profile'),
            icon: <IconSettings active={url.startsWith('/profile')} />,
        });

        return items;
    }, [canAdmin, url]);

    const sidebar = (
        <div className="flex h-full flex-col">
            <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center' : ''}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 7h8M8 11h8M8 15h5" />
                    </svg>
                </div>
                {!collapsed ? (
                    <div className="min-w-0">
                        <div className="truncate text-sm font-bold tracking-tight text-gray-900">SiPinjam</div>
                        <div className="truncate text-xs font-medium text-gray-500">RFMS-style UI</div>
                    </div>
                ) : null}
            </div>

            <div className="px-3">
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <SidebarLink
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            subtitle={item.subtitle}
                            icon={item.icon}
                            active={item.active}
                            collapsed={collapsed}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-auto px-3 pb-4">
                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    onClick={() => setCollapsed((v) => !v)}
                >
                    {collapsed ? 'Expand' : 'Collapse'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex min-h-screen">
                <aside
                    className={`hidden border-r border-gray-100 bg-white lg:block ${collapsed ? 'w-24' : 'w-72'}`}
                    aria-label="Sidebar"
                >
                    {sidebar}
                </aside>

                {mobileOpen ? (
                    <div className="fixed inset-0 z-40 lg:hidden" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-900/40" onClick={() => setMobileOpen(false)} />
                        <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
                            {sidebar}
                        </aside>
                    </div>
                ) : null}

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
                        <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-50 lg:hidden"
                                onClick={() => setMobileOpen(true)}
                            >
                                <IconMenu />
                            </button>

                            <div className="relative flex-1">
                                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                                    <IconSearch />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search rooms, bookings, or facilities..."
                                    className="w-full rounded-xl border border-gray-200 bg-white px-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    onKeyDown={(e) => {
                                        if (e.key !== 'Enter') return;
                                        const value = e.currentTarget.value?.trim();
                                        if (!value) return;
                                        router.visit('/admin/assets', { method: 'get', data: { q: value } });
                                    }}
                                />
                            </div>

                            <button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-50">
                                <IconBell />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className="flex items-center gap-3 rounded-xl px-2.5 py-1.5 hover:bg-gray-50"
                                    onClick={() => setUserOpen((v) => !v)}
                                >
                                    <div className="hidden text-right sm:block">
                                        <div className="max-w-[200px] truncate text-sm font-semibold text-gray-900">{user?.name}</div>
                                        <div className="text-xs font-medium text-gray-500">{roleLabel(user?.role) || 'User'}</div>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                                        {getInitials(user?.name || user?.email)}
                                    </div>
                                </button>

                                {userOpen ? (
                                    <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                                        <div className="px-4 py-3">
                                            <div className="text-xs text-gray-500">Signed in as</div>
                                            <div className="truncate text-sm font-semibold text-gray-900">{user?.email}</div>
                                        </div>
                                        <div className="border-t border-gray-100" />
                                        <Link href="/profile" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Profile
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 px-4 py-6 lg:px-6" aria-label={title}>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
