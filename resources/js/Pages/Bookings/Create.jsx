import React, { useEffect, useMemo, useState } from 'react';
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

export default function BookingCreate({ rooms, tools, storeUrl, indexUrl, availabilityUrl, prefill, auth }) {
    const initialStart = useMemo(() => toDatetimeLocal(prefill?.start_time), [prefill?.start_time]);
    const initialEnd = useMemo(() => toDatetimeLocal(prefill?.end_time), [prefill?.end_time]);

    const [blockedAssetIds, setBlockedAssetIds] = useState([]);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [availabilityError, setAvailabilityError] = useState('');
    const [autoRemovedIds, setAutoRemovedIds] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        start_time: initialStart,
        end_time: initialEnd,
        purpose: '',
        asset_ids: [],
    });

    const isValidRange = useMemo(() => {
        if (!data.start_time || !data.end_time) return false;
        const start = new Date(data.start_time);
        const end = new Date(data.end_time);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
        return end.getTime() > start.getTime();
    }, [data.start_time, data.end_time]);

    useEffect(() => {
        if (!isValidRange) {
            setBlockedAssetIds([]);
            setAvailabilityError('');
            setCheckingAvailability(false);
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            try {
                setCheckingAvailability(true);
                setAvailabilityError('');

                const params = new URLSearchParams({
                    start_time: data.start_time,
                    end_time: data.end_time,
                });

                const res = await fetch(`${availabilityUrl}?${params.toString()}`, {
                    headers: {
                        Accept: 'application/json',
                    },
                    signal: controller.signal,
                });

                if (!res.ok) {
                    let message = 'Gagal mengecek ketersediaan aset.';
                    try {
                        const json = await res.json();
                        if (json?.message) message = json.message;
                    } catch {
                        // ignore
                    }
                    throw new Error(message);
                }

                const json = await res.json();
                const ids = Array.isArray(json?.blocked_asset_ids) ? json.blocked_asset_ids : [];
                const normalized = ids.map((v) => Number(v)).filter((v) => Number.isFinite(v));
                setBlockedAssetIds(normalized);

                // Auto-remove assets that became blocked after time changes.
                if (data.asset_ids.length > 0 && normalized.length > 0) {
                    const blockedSet = new Set(normalized);
                    const kept = data.asset_ids.filter((id) => !blockedSet.has(id));
                    const removed = data.asset_ids.filter((id) => blockedSet.has(id));
                    if (removed.length > 0) {
                        setData('asset_ids', kept);
                        setAutoRemovedIds(removed);
                    } else {
                        setAutoRemovedIds([]);
                    }
                } else {
                    setAutoRemovedIds([]);
                }
            } catch (e) {
                if (e?.name === 'AbortError') return;
                setAvailabilityError(e?.message || 'Gagal mengecek ketersediaan aset.');
            } finally {
                setCheckingAvailability(false);
            }
        }, 250);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.start_time, data.end_time, isValidRange]);

    const toggleAsset = (id) => {
        if (blockedAssetIds.includes(id)) return;
        const next = new Set(data.asset_ids);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setData('asset_ids', Array.from(next));
    };

    const blockedSet = useMemo(() => new Set(blockedAssetIds), [blockedAssetIds]);
    const blockedCount = blockedAssetIds.length;

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

                    <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-inset ring-gray-200">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm font-medium text-gray-900">Ketersediaan aset</div>
                                <div className="mt-0.5 text-xs text-gray-600">
                                    {isValidRange
                                        ? 'Daftar aset akan otomatis dinonaktifkan jika sudah dibooking pada rentang waktu yang sama.'
                                        : 'Isi Start dan End terlebih dahulu untuk melihat aset yang tersedia.'}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {checkingAvailability ? 'Mengecek…' : isValidRange ? `${blockedCount} terpakai` : ''}
                            </div>
                        </div>
                        {availabilityError ? <div className="mt-2 text-xs text-amber-700">{availabilityError}</div> : null}
                        {autoRemovedIds.length > 0 ? (
                            <div className="mt-2 text-xs text-amber-700">
                                Beberapa aset otomatis dilepas karena sudah terbooking pada waktu tersebut.
                            </div>
                        ) : null}
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
                                    (() => {
                                        const isBlocked = blockedSet.has(a.id);
                                        const disabled = !isValidRange || isBlocked;
                                        return (
                                    <label
                                        key={a.id}
                                        className={`flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 ${
                                            disabled ? 'cursor-not-allowed bg-gray-50 opacity-70' : 'cursor-pointer bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                                                checked={data.asset_ids.includes(a.id)}
                                                disabled={disabled}
                                                onChange={() => toggleAsset(a.id)}
                                            />
                                            <span className="font-medium text-gray-900">{a.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isBlocked ? <Badge tone="gray">Booked</Badge> : null}
                                            <Badge tone={a.status === 'available' ? 'green' : a.status === 'maintenance' ? 'yellow' : 'gray'}>
                                                {a.status}
                                            </Badge>
                                        </div>
                                    </label>
                                        );
                                    })()
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
                                    (() => {
                                        const isBlocked = blockedSet.has(a.id);
                                        const disabled = !isValidRange || isBlocked;
                                        return (
                                    <label
                                        key={a.id}
                                        className={`flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 ${
                                            disabled ? 'cursor-not-allowed bg-gray-50 opacity-70' : 'cursor-pointer bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                                                checked={data.asset_ids.includes(a.id)}
                                                disabled={disabled}
                                                onChange={() => toggleAsset(a.id)}
                                            />
                                            <span className="font-medium text-gray-900">{a.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isBlocked ? <Badge tone="gray">Booked</Badge> : null}
                                            <Badge tone={a.status === 'available' ? 'green' : a.status === 'maintenance' ? 'yellow' : 'gray'}>
                                                {a.status}
                                            </Badge>
                                        </div>
                                    </label>
                                        );
                                    })()
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
