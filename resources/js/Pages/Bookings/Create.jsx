import React, { useMemo } from 'react';
import { Link, useForm } from '@inertiajs/react';

import AppLayout from '../../Shared/AppLayout';
import Badge from '../../Shared/ui/Badge';
import Card from '../../Shared/ui/Card';
import PageHeader from '../../Shared/ui/PageHeader';

function toDatetimeLocal(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function BookingCreate({ rooms, tools, storeUrl, indexUrl, prefill, auth }) {
    const initialStart = useMemo(() => toDatetimeLocal(prefill?.start_time), [prefill?.start_time]);
    const initialEnd = useMemo(() => toDatetimeLocal(prefill?.end_time), [prefill?.end_time]);

    const { data, setData, post, processing, errors } = useForm({
        start_time: initialStart,
        end_time: initialEnd,
        purpose: '',
        asset_ids: [],
    });

    const toggleAsset = (id) => {
        const next = new Set(data.asset_ids);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setData('asset_ids', Array.from(next));
    };

    return (
        <AppLayout title="Create Booking" auth={auth}>
            <div className="space-y-6">
                <PageHeader
                    title="Buat pengajuan booking"
                    subtitle="Pilih waktu dan aset/ruangan. Sistem akan menolak jika terjadi bentrok jadwal."
                    right={
                        <Link href={indexUrl} className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                            Kembali
                        </Link>
                    }
                />

                <Card>
                    <form
                        className="space-y-6 p-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            post(storeUrl);
                        }}
                    >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start</label>
                            <input
                                type="datetime-local"
                                className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                            {errors.start_time ? <div className="mt-1 text-xs text-red-600">{errors.start_time}</div> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End</label>
                            <input
                                type="datetime-local"
                                className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                            />
                            {errors.end_time ? <div className="mt-1 text-xs text-red-600">{errors.end_time}</div> : null}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Purpose (opsional)</label>
                        <input
                            type="text"
                            className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            value={data.purpose}
                            onChange={(e) => setData('purpose', e.target.value)}
                        />
                        {errors.purpose ? <div className="mt-1 text-xs text-red-600">{errors.purpose}</div> : null}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-700">Rooms</div>
                                <div className="text-xs text-gray-500">Pilih satu atau lebih</div>
                            </div>
                            <div className="mt-3 space-y-2">
                                {rooms.map((a) => (
                                    <label
                                        key={a.id}
                                        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                                                checked={data.asset_ids.includes(a.id)}
                                                onChange={() => toggleAsset(a.id)}
                                            />
                                            <span className="font-medium text-gray-900">{a.name}</span>
                                        </div>
                                        <Badge tone={a.status === 'available' ? 'green' : a.status === 'maintenance' ? 'yellow' : 'gray'}>
                                            {a.status}
                                        </Badge>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-700">Tools</div>
                                <div className="text-xs text-gray-500">Pilih satu atau lebih</div>
                            </div>
                            <div className="mt-3 space-y-2">
                                {tools.map((a) => (
                                    <label
                                        key={a.id}
                                        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                                                checked={data.asset_ids.includes(a.id)}
                                                onChange={() => toggleAsset(a.id)}
                                            />
                                            <span className="font-medium text-gray-900">{a.name}</span>
                                        </div>
                                        <Badge tone={a.status === 'available' ? 'green' : a.status === 'maintenance' ? 'yellow' : 'gray'}>
                                            {a.status}
                                        </Badge>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {errors.asset_ids ? <div className="text-xs text-red-600">{errors.asset_ids}</div> : null}

                    <div className="flex items-center justify-end gap-3">
                        <Link href={indexUrl} className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {processing ? 'Submitting…' : 'Submit'}
                        </button>
                    </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
