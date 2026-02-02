import React from 'react';
import Badge from './Badge';

function toneForStatus(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'approved') return 'green';
    if (s === 'pending') return 'yellow';
    if (s === 'rejected') return 'red';
    if (s === 'cancelled' || s === 'canceled') return 'gray';
    return 'gray';
}

function labelForStatus(status) {
    const s = String(status || '').toLowerCase();
    if (!s) return '-';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function StatusPill({ status, className = '' }) {
    return (
        <Badge tone={toneForStatus(status)} className={className}>
            {labelForStatus(status)}
        </Badge>
    );
}
