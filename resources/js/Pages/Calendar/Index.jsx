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
            <div className="space-y-4">
                <div className="rounded bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Jenis</label>
                            <select
                                className="mt-1 rounded-md border-gray-300 shadow-sm"
                                value={kind}
                                onChange={(e) => setKind(e.target.value)}
                            >
                                <option value="">Semua</option>
                                <option value="room">Ruangan</option>
                                <option value="asset">Aset</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Item (opsional)</label>
                            {kind === 'room' ? (
                                <select
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
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
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
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
                            ) : null}

                            {kind === '' ? (
                                <div className="mt-1 text-xs text-gray-500">Pilih jenis agar bisa filter per item.</div>
                            ) : null}
                        </div>

                        <div className="md:ms-auto">
                            <button
                                type="button"
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                                onClick={() => router.visit(createBookingUrl)}
                            >
                                Ajukan Booking
                            </button>
                        </div>
                    </div>
                </div>

                <div className="rounded bg-white p-6 shadow-sm">
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
                    <p className="mt-3 text-xs text-gray-500">Klik-drag pada kalender untuk prefill form pengajuan.</p>
                </div>
            </div>
        </AppLayout>
    );
}
