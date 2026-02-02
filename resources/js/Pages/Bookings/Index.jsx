import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

import AppLayout from '../../Shared/AppLayout';

function urlFromTemplate(template, id) {
    return template.replace('{id}', String(id));
}

export default function BookingIndex({ bookings, createUrl, cancelUrlTemplate, auth }) {
    const page = usePage();
    const flashStatus = page.props?.flash?.status;

    return (
        <AppLayout title="My Bookings" auth={auth}>
            <div className="space-y-4">
                {flashStatus ? <div className="rounded bg-green-50 p-3 text-sm text-green-800">{flashStatus}</div> : null}

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Riwayat pengajuan booking Anda.</div>
                    <Link href={createUrl} className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
                        Buat Booking
                    </Link>
                </div>

                <div className="overflow-hidden rounded bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Waktu</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Aset</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {bookings.data.map((b) => (
                                <tr key={b.id}>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        <div>{new Date(b.start_time).toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">s/d {new Date(b.end_time).toLocaleString()}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {(b.assets || []).map((a) => a.name).join(', ') || '-'}
                                        {b.purpose ? <div className="mt-1 text-xs text-gray-500">{b.purpose}</div> : null}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">{b.status}</span>
                                        {b.decision_note ? <div className="mt-1 text-xs text-gray-500">{b.decision_note}</div> : null}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm">
                                        {b.status === 'pending' ? (
                                            <button
                                                type="button"
                                                className="rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                                                onClick={() => router.post(urlFromTemplate(cancelUrlTemplate, b.id))}
                                            >
                                                Batalkan
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
                        <div>
                            Page {bookings.current_page} of {bookings.last_page}
                        </div>
                        <div className="space-x-2">
                            {bookings.prev_page_url ? <Link href={bookings.prev_page_url}>Prev</Link> : <span className="text-gray-400">Prev</span>}
                            {bookings.next_page_url ? <Link href={bookings.next_page_url}>Next</Link> : <span className="text-gray-400">Next</span>}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
