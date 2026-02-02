import React, { useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { router } from '@inertiajs/react';

import AppLayout from '../../Shared/AppLayout';
import { useCalendarStore } from '../../stores/calendarStore';

export default function CalendarIndex({ rooms, assets, eventsUrl, createBookingUrl, auth }) {
    const calendarRef = useRef(null);

    const kind = useCalendarStore((s) => s.kind);
    const roomId = useCalendarStore((s) => s.roomId);
    const assetId = useCalendarStore((s) => s.assetId);
    const setKind = useCalendarStore((s) => s.setKind);
    const setRoomId = useCalendarStore((s) => s.setRoomId);
    const setAssetId = useCalendarStore((s) => s.setAssetId);

    const loanableId = useMemo(() => {
        if (kind === 'room') return roomId;
        if (kind === 'asset') return assetId;
        return '';
    }, [kind, roomId, assetId]);

    const events = async (fetchInfo, successCallback, failureCallback) => {
        try {
            const response = await axios.get(eventsUrl, {
                params: {
                    start: fetchInfo.startStr,
                    end: fetchInfo.endStr,
                    kind,
                    loanable_id: loanableId,
                },
            });
            successCallback(response.data);
        } catch (e) {
            failureCallback(e);
        }
    };

    useEffect(() => {
        const id = setInterval(() => {
            const api = calendarRef.current?.getApi?.();
            api?.refetchEvents?.();
        }, 30000);

        return () => clearInterval(id);
    }, []);

    // Whenever filters change, refetch immediately.
    useEffect(() => {
        const api = calendarRef.current?.getApi?.();
        api?.refetchEvents?.();
    }, [kind, loanableId]);

    return (
        <AppLayout title="Availability Calendar" auth={auth}>
            <div className="space-y-6">
                <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                            <div className="text-sm font-medium text-gray-900">Filter</div>
                            <div className="inline-flex rounded-lg bg-gray-100 p-1">
                                <button
                                    type="button"
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${kind === '' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                    onClick={() => setKind('')}
                                >
                                    Semua
                                </button>
                                <button
                                    type="button"
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${kind === 'room' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                    onClick={() => setKind('room')}
                                >
                                    Ruangan
                                </button>
                                <button
                                    type="button"
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${kind === 'asset' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                    onClick={() => setKind('asset')}
                                >
                                    Aset
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">Item (opsional)</label>
                                {kind === 'room' ? (
                                    <select
                                        className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                    >
                                        <option value="">Semua Ruangan</option>
                                        {rooms.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : null}

                                {kind === 'asset' ? (
                                    <select
                                        className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={assetId}
                                        onChange={(e) => setAssetId(e.target.value)}
                                    >
                                        <option value="">Semua Aset</option>
                                        {assets.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="mt-2 text-sm text-gray-500">Pilih jenis untuk filter per item.</div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-3 lg:items-end">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-yellow-500" /> Pending
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-600" /> Approved
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-gray-400" /> Others
                                </span>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                                onClick={() => router.visit(createBookingUrl)}
                            >
                                Buat Booking
                            </button>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        height="auto"
                        nowIndicator={true}
                        selectable={true}
                        selectMirror={true}
                        slotMinTime="07:00:00"
                        slotMaxTime="20:00:00"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        events={events}
                        select={(info) => {
                            router.visit(createBookingUrl, {
                                method: 'get',
                                data: {
                                    start_time: info.startStr,
                                    end_time: info.endStr,
                                },
                            });
                        }}
                    />
                    <p className="mt-3 text-sm text-gray-600">Klik-drag pada kalender untuk prefill waktu booking.</p>
                </div>
            </div>
        </AppLayout>
    );
}
