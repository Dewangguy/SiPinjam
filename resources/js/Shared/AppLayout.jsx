import React from 'react';
import { Link, usePage } from '@inertiajs/react';

function NavLink({ href, active, children }) {
    const base = 'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium';
    const activeClass = 'border-indigo-400 text-gray-900';
    const inactiveClass = 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';

    return (
        <Link href={href} className={`${base} ${active ? activeClass : inactiveClass}`}>
            {children}
        </Link>
    );
}

export default function AppLayout({ title, auth, children }) {
    const page = usePage();
    const url = page.url || '';
    const canAdmin = page.props?.can?.admin;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="border-b border-gray-100 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="text-sm font-semibold text-gray-800">
                            SiPinjam
                        </Link>
                        <div className="hidden space-x-8 sm:flex">
                            <NavLink href="/dashboard" active={url.startsWith('/dashboard')}>
                                Dashboard
                            </NavLink>
                            <NavLink href="/calendar" active={url.startsWith('/calendar')}>
                                Calendar
                            </NavLink>
                            <NavLink href="/bookings" active={url.startsWith('/bookings')}>
                                My Bookings
                            </NavLink>
                            {canAdmin ? (
                                <>
                                    <NavLink href="/admin/bookings" active={url.startsWith('/admin/bookings')}>
                                        Approvals
                                    </NavLink>
                                    <NavLink href="/admin/assets" active={url.startsWith('/admin/assets')}>
                                        Assets
                                    </NavLink>
                                </>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">{auth?.user?.name}</div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">{title}</h2>
                </div>
            </header>

            <main>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
