import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

import AppLayout from '../../Shared/AppLayout';
import Card from '../../Shared/ui/Card';
import EmptyState from '../../Shared/ui/EmptyState';
import PageHeader from '../../Shared/ui/PageHeader';
import Pagination from '../../Shared/ui/Pagination';
import StatusPill from '../../Shared/ui/StatusPill';

function urlFromTemplate(template, id) {
    return template.replace('{id}', String(id));
}

export default function BookingIndex({ bookings, createUrl, cancelUrlTemplate, auth }) {
    const page = usePage();
    const flashStatus = page.props?.flash?.status;

    return (
        <AppLayout title="My Bookings" auth={auth}>
            <div className="space-y-6">
                {flashStatus ? (
                    <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800 ring-1 ring-inset ring-green-600/20">{flashStatus}</div>
                ) : null}

                <PageHeader
                    title="Riwayat booking Anda"
                    subtitle="Lihat status pengajuan dan batalkan jika masih pending."
                    right={
                        <Link
                            href={createUrl}
                            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
                        >
                            Buat Booking
                        </Link>
                    }
                />

                {bookings.data.length === 0 ? (
                    <EmptyState
                        title="Belum ada booking"
                        description="Silakan buat pengajuan booking ruangan/aset."
                        action={
                            <Link
                                href={createUrl}
                                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
                            >
                                Buat Booking
                            </Link>
                        }
                    />
                ) : (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Waktu</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aset</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {bookings.data.map((b) => (
                                        <tr key={b.id} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                <div className="font-medium text-gray-900">{new Date(b.start_time).toLocaleString('id-ID')}</div>
                                                <div className="mt-0.5 text-xs text-gray-500">s/d {new Date(b.end_time).toLocaleString('id-ID')}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                <div className="font-medium text-gray-900">{(b.assets || []).map((a) => a.name).join(', ') || '-'}</div>
                                                {b.purpose ? <div className="mt-1 text-xs text-gray-500">{b.purpose}</div> : null}
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <StatusPill status={b.status} />
                                                {b.decision_note ? <div className="mt-1 text-xs text-gray-500">{b.decision_note}</div> : null}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm">
                                                {b.status === 'pending' ? (
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            if (!window.confirm('Batalkan booking ini?')) return;
                                                            router.post(urlFromTemplate(cancelUrlTemplate, b.id));
                                                        }}
                                                    >
                                                        Batalkan
                                                    </button>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={bookings} />
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
