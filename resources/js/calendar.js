import axios from 'axios';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function getSelectedFilters() {
    const kindEl = document.getElementById('calendar-kind');
    const kind = kindEl ? kindEl.value : '';

    let loanableId = '';
    if (kind === 'room') {
        const roomEl = document.getElementById('calendar-room-id');
        loanableId = roomEl ? roomEl.value : '';
    }

    if (kind === 'asset') {
        const assetEl = document.getElementById('calendar-asset-id');
        loanableId = assetEl ? assetEl.value : '';
    }

    return { kind, loanable_id: loanableId };
}

function initLoanCalendar() {
    const calendarEl = document.getElementById('loan-calendar');
    if (!calendarEl) return;

    const eventsUrl = calendarEl.dataset.eventsUrl;
    const createUrl = calendarEl.dataset.createUrl;

    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        height: 'auto',
        nowIndicator: true,
        selectable: true,
        selectMirror: true,
        slotMinTime: '07:00:00',
        slotMaxTime: '20:00:00',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        events: async (fetchInfo, successCallback, failureCallback) => {
            try {
                const filters = getSelectedFilters();
                const response = await axios.get(eventsUrl, {
                    params: {
                        start: fetchInfo.startStr,
                        end: fetchInfo.endStr,
                        kind: filters.kind,
                        loanable_id: filters.loanable_id,
                    },
                });

                successCallback(response.data);
            } catch (e) {
                failureCallback(e);
            }
        },
        select: (info) => {
            const params = new URLSearchParams({
                start_at: info.startStr,
                end_at: info.endStr,
            });

            window.location.href = `${createUrl}?${params.toString()}`;
        },
    });

    calendar.render();

    const kindEl = document.getElementById('calendar-kind');
    const roomEl = document.getElementById('calendar-room-id');
    const assetEl = document.getElementById('calendar-asset-id');

    const refetch = () => calendar.refetchEvents();

    if (kindEl) kindEl.addEventListener('change', refetch);
    if (roomEl) roomEl.addEventListener('change', refetch);
    if (assetEl) assetEl.addEventListener('change', refetch);

    setInterval(refetch, 30000);
}

document.addEventListener('DOMContentLoaded', initLoanCalendar);
