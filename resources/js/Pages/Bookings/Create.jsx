import React, { useMemo } from 'react';
import { Link, useForm } from '@inertiajs/react';

import AppLayout from '../../Shared/AppLayout';

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
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Buat pengajuan booking ruangan / aset.</div>
                    <Link href={indexUrl} className="text-sm text-indigo-600 hover:text-indigo-700">
                        Kembali
                    </Link>
                </div>

                <form
                    className="space-y-4 rounded bg-white p-6 shadow-sm"
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
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                            {errors.start_time ? <div className="mt-1 text-xs text-red-600">{errors.start_time}</div> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End</label>
                            <input
                                type="datetime-local"
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
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
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                            value={data.purpose}
                            onChange={(e) => setData('purpose', e.target.value)}
                        />
                        {errors.purpose ? <div className="mt-1 text-xs text-red-600">{errors.purpose}</div> : null}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <div className="text-sm font-medium text-gray-700">Rooms</div>
                            <div className="mt-2 space-y-2">
                                {rooms.map((a) => (
                                    <label key={a.id} className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={data.asset_ids.includes(a.id)}
                                            onChange={() => toggleAsset(a.id)}
                                        />
                                        <span>{a.name}</span>
                                        <span className="text-xs text-gray-400">({a.status})</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-700">Tools</div>
                            <div className="mt-2 space-y-2">
                                {tools.map((a) => (
                                    <label key={a.id} className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={data.asset_ids.includes(a.id)}
                                            onChange={() => toggleAsset(a.id)}
                                        />
                                        <span>{a.name}</span>
                                        <span className="text-xs text-gray-400">({a.status})</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {errors.asset_ids ? <div className="text-xs text-red-600">{errors.asset_ids}</div> : null}

                    <div className="flex items-center justify-end gap-3">
                        <Link href={indexUrl} className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Submitting…' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
