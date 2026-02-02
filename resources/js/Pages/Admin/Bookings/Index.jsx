import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

import AppLayout from '../../../Shared/AppLayout';
import Card from '../../../Shared/ui/Card';
import EmptyState from '../../../Shared/ui/EmptyState';
import PageHeader from '../../../Shared/ui/PageHeader';
import Pagination from '../../../Shared/ui/Pagination';
import StatusPill from '../../../Shared/ui/StatusPill';

function urlFromTemplate(template, id) {
    return template.replace('{id}', String(id));
}

export default function AdminBookingsIndex({ bookings, updateUrlTemplate, auth }) {
    const page = usePage();
    const flashStatus = page.props?.flash?.status;

    const approve = (id) => {
        router.patch(urlFromTemplate(updateUrlTemplate, id), { status: 'approved' });
    };

    const reject = (id) => {
        const note = window.prompt('Catatan penolakan (wajib):');
        if (!note) return;
        router.patch(urlFromTemplate(updateUrlTemplate, id), { status: 'rejected', decision_note: note });
    };

    return (
        <AppLayout title="Approvals" auth={auth}>
            <div className="space-y-6">
                {flashStatus ? (
                    <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800 ring-1 ring-inset ring-green-600/20">{flashStatus}</div>
                ) : null}

                <PageHeader title="Persetujuan Booking" subtitle="Approve/Reject pengajuan booking. Reject wajib menyertakan catatan." />

                {bookings.data.length === 0 ? (
                    <EmptyState title="Tidak ada pengajuan" description="Saat ini tidak ada booking yang perlu diproses." />
                ) : (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pemohon</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Waktu</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aset</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {bookings.data.map((b) => {
                                        const isPending = b.status === 'pending';
                                        return (
                                            <tr key={b.id} className="hover:bg-gray-50/50">
                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    <div className="font-medium text-gray-900">{b.user?.name ?? '-'}</div>
                                                    {b.user?.email ? <div className="mt-0.5 text-xs text-gray-500">{b.user.email}</div> : null}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    <div className="font-medium text-gray-900">{new Date(b.start_time).toLocaleString('id-ID')}</div>
                                                    <div className="mt-0.5 text-xs text-gray-500">s/d {new Date(b.end_time).toLocaleString('id-ID')}</div>
                                                    {b.purpose ? <div className="mt-1 text-xs text-gray-500">{b.purpose}</div> : null}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    {(b.assets || []).map((a) => a.name).join(', ') || '-'}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <StatusPill status={b.status} />
                                                    {b.decision_note ? <div className="mt-1 text-xs text-gray-500">{b.decision_note}</div> : null}
                                                </td>
                                                <td className="px-4 py-4 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold shadow-sm transition ${
                                                                isPending
                                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                                    : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                            }`}
                                                            disabled={!isPending}
                                                            onClick={() => approve(b.id)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                                                isPending
                                                                    ? 'border-red-200 bg-white text-red-700 hover:bg-red-50'
                                                                    : 'cursor-not-allowed border-gray-200 bg-white text-gray-400'
                                                            }`}
                                                            disabled={!isPending}
                                                            onClick={() => reject(b.id)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
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
