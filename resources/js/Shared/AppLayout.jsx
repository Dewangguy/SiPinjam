import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

function NavLink({ href, active, children }) {
    const base = 'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition';
    const activeClass = 'bg-indigo-50 text-indigo-700';
    const inactiveClass = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';

    return (
        <Link href={href} className={`${base} ${active ? activeClass : inactiveClass}`}>
            {children}
        </Link>
    );
}

function StatusBadge({ children, tone = 'gray' }) {
    const cls =
        tone === 'green'
            ? 'bg-green-50 text-green-700 ring-green-600/20'
            : tone === 'yellow'
              ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
              : tone === 'red'
                ? 'bg-red-50 text-red-700 ring-red-600/20'
                : 'bg-gray-50 text-gray-700 ring-gray-600/20';

    return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>{children}</span>;
}

export default function AppLayout({ title, auth, children }) {
    const page = usePage();
    const url = page.url || '';
    const canAdmin = page.props?.can?.admin;

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const onDocClick = (e) => {
            if (!dropdownRef.current) return;
            if (!dropdownRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [url]);

    const navItems = useMemo(() => {
        const items = [
            { href: '/dashboard', label: 'Dashboard', active: url.startsWith('/dashboard') },
            { href: '/calendar', label: 'Calendar', active: url.startsWith('/calendar') },
            { href: '/bookings', label: 'My Bookings', active: url.startsWith('/bookings') },
        ];
        if (canAdmin) {
            items.push(
                { href: '/admin/bookings', label: 'Approvals', active: url.startsWith('/admin/bookings') },
                { href: '/admin/assets', label: 'Assets', active: url.startsWith('/admin/assets') }
            );
        }
        return items;
    }, [canAdmin, url]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-gray-900">
                            SiPinjam
                        </Link>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={() => setOpen((v) => !v)}
                            >
                                <span className="max-w-[220px] truncate">{auth?.user?.name}</span>
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className={`transition ${open ? 'rotate-180' : ''}`}>
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {open ? (
                                <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                                    <div className="px-4 py-3">
                                        <div className="text-xs text-gray-500">Signed in as</div>
                                        <div className="truncate text-sm font-medium text-gray-900">{auth?.user?.email}</div>
                                    </div>
                                    <div className="border-t border-gray-100" />
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <nav className="flex items-center gap-2 overflow-x-auto pb-4">
                        {navItems.map((item) => (
                            <NavLink key={item.href} href={item.href} active={item.active}>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>

            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold leading-tight text-gray-900">{title}</h2>
                </div>
            </header>

            <main>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
