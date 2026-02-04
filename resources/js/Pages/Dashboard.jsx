import React, { useMemo } from 'react';
import { Link } from '@inertiajs/react';

import AppLayout from '../Shared/AppLayout';
import Badge from '../Shared/ui/Badge';
import Card from '../Shared/ui/Card';
import PageHeader from '../Shared/ui/PageHeader';
import StatusPill from '../Shared/ui/StatusPill';

function formatTimeRange(startIso, endIso) {
    const start = startIso ? new Date(startIso) : null;
    const end = endIso ? new Date(endIso) : null;
    if (!start || !end) return '-';
    const fmt = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return `${fmt(start)} - ${fmt(end)}`;
}

function timeAgo(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const minutes = Math.max(1, Math.floor(diff / 60000));
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
}

function StatCard({ label, value, hint }) {
    return (
        <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-medium text-gray-600">{label}</div>
                    <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</div>
                    {hint ? <div className="mt-2 text-xs font-medium text-emerald-700">{hint}</div> : null}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                </div>
            </div>
        </Card>
    );
}

export default function Dashboard({ auth, flash, stats, todaySchedule, recentActivity }) {
    const schedule = todaySchedule || [];
    const activity = recentActivity || [];

    const cards = useMemo(
        () => [
            { label: 'Active Loans Today', value: stats?.active_today ?? 0, hint: null },
            { label: 'Pending Requests', value: stats?.pending_requests ?? 0, hint: null },
            { label: 'Total Rooms Available', value: stats?.rooms_available ?? 0, hint: null },
            { label: 'Scheduled This Week', value: stats?.scheduled_this_week ?? 0, hint: null },
        ],
        [stats]
    );

    return (
        <AppLayout title="Dashboard" auth={auth}>
            <div className="space-y-6">
                {flash?.status ? (
                    <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-inset ring-emerald-600/20">{flash.status}</div>
                ) : null}

                <PageHeader title="Dashboard Overview" subtitle="Welcome back! Here's what's happening today." />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((c) => (
                        <StatCard key={c.label} label={c.label} value={c.value} hint={c.hint} />
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                        <Card className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-base font-semibold text-gray-900">Today's Schedule</div>
                                    <div className="mt-1 text-sm text-gray-600">Agenda booking untuk hari ini.</div>
                                </div>
                                <Link
                                    href="/calendar"
                                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                                >
                                    Open Calendar
                                </Link>
                            </div>

                            <div className="mt-5 space-y-3">
                                {schedule.length === 0 ? (
                                    <div className="rounded-xl bg-gray-50 p-6 text-sm text-gray-600 ring-1 ring-inset ring-gray-200">
                                        Tidak ada booking hari ini.
                                    </div>
                                ) : (
                                    schedule.map((b) => (
                                        <div key={b.id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 hover:bg-gray-50/40">
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-semibold text-gray-900">
                                                    {(b.assets || []).map((a) => a.name).join(', ') || 'Booking'}
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                                                    <span className="inline-flex items-center gap-1">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                                                        </svg>
                                                        {formatTimeRange(b.start_time, b.end_time)}
                                                    </span>
                                                    {b.purpose ? (
                                                        <span className="inline-flex items-center gap-1">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
                                                            </svg>
                                                            <span className="truncate">{b.purpose}</span>
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <StatusPill status={b.status} />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="text-base font-semibold text-gray-900">Recent Activity</div>
                                <Link href={auth?.user?.role === 'admin' || auth?.user?.role === 'approver' ? '/admin/bookings' : '/bookings'} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                                    View All
                                </Link>
                            </div>

                            <div className="mt-5 space-y-4">
                                {activity.length === 0 ? (
                                    <div className="text-sm text-gray-600">Belum ada aktivitas.</div>
                                ) : (
                                    activity.map((a) => {
                                        const who = a.user?.name ?? 'Someone';
                                        const asset = (a.assets || []).map((x) => x.name).join(', ') || 'asset';
                                        const verb = a.status === 'pending' ? 'requested' : 'booked';
                                        return (
                                            <div key={a.id} className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                                                        {getInitials(who)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-sm text-gray-900">
                                                            <span className="font-semibold">{who}</span> <span className="text-gray-600">{verb}</span>
                                                        </div>
                                                        <div className="truncate text-sm font-semibold text-gray-900">{asset}</div>
                                                        <div className="mt-1 text-xs font-medium text-gray-500">{timeAgo(a.created_at)}</div>
                                                    </div>
                                                </div>
                                                <div className="shrink-0">
                                                    {a.status ? (
                                                        <Badge tone={a.status === 'approved' ? 'green' : a.status === 'pending' ? 'yellow' : 'gray'}>
                                                            {String(a.status).charAt(0).toUpperCase() + String(a.status).slice(1)}
                                                        </Badge>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="mt-6">
                                <Link
                                    href={auth?.user?.role === 'admin' || auth?.user?.role === 'approver' ? '/admin/bookings' : '/bookings'}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    View All Activity
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function getInitials(nameOrEmail) {
    const raw = String(nameOrEmail || '').trim();
    if (!raw) return 'U';
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
