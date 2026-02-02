import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';

import AppLayout from '../../../Shared/AppLayout';
import Badge from '../../../Shared/ui/Badge';
import Card from '../../../Shared/ui/Card';
import EmptyState from '../../../Shared/ui/EmptyState';
import PageHeader from '../../../Shared/ui/PageHeader';
import Pagination from '../../../Shared/ui/Pagination';

function urlFromTemplate(template, id) {
    return template.replace('{id}', String(id));
}

export default function AdminAssetsIndex({ assets, createUrl, editUrlTemplate, auth }) {
    const [q, setQ] = useState('');

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return assets.data;
        return assets.data.filter((a) => {
            const hay = [a.name, a.type, a.status, a.category, a.serial_number].filter(Boolean).join(' ').toLowerCase();
            return hay.includes(query);
        });
    }, [assets.data, q]);

    return (
        <AppLayout title="Assets" auth={auth}>
            <div className="space-y-6">
                <PageHeader
                    title="Inventory aset & ruangan"
                    subtitle="Kelola data aset/ruangan yang bisa dibooking."
                    right={
                        <Link
                            href={createUrl}
                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            New Asset
                        </Link>
                    }
                />

                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                    <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">Search</label>
                    <input
                        type="text"
                        className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Cari nama, type, status, category, serial…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>

                {filtered.length === 0 ? (
                    <EmptyState
                        title="Tidak ada aset"
                        description={q.trim() ? 'Tidak ada data yang cocok dengan pencarian.' : 'Silakan tambah aset baru.'}
                        action={
                            <Link
                                href={createUrl}
                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                                New Asset
                            </Link>
                        }
                    />
                ) : (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Active</th>
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {filtered.map((a) => (
                                        <tr key={a.id} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                <div className="font-medium text-gray-900">{a.name}</div>
                                                {a.category || a.serial_number ? (
                                                    <div className="mt-0.5 text-xs text-gray-500">
                                                        {[a.category, a.serial_number].filter(Boolean).join(' • ')}
                                                    </div>
                                                ) : null}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                <Badge tone="blue">{a.type}</Badge>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                <Badge tone={a.status === 'available' ? 'green' : a.status === 'maintenance' ? 'yellow' : 'gray'}>
                                                    {a.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {a.is_active ? <Badge tone="green">Active</Badge> : <Badge>Inactive</Badge>}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm">
                                                <Link
                                                    href={urlFromTemplate(editUrlTemplate, a.id)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={assets} />
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
