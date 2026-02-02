import React from 'react';
import AppLayout from '../Shared/AppLayout';

export default function Dashboard({ auth, flash }) {
    return (
        <AppLayout title="Dashboard" auth={auth}>
            {flash?.status ? (
                <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-green-700">
                    {flash.status}
                </div>
            ) : null}

            <div className="rounded bg-white p-6 shadow-sm">
                <h1 className="text-lg font-semibold text-gray-900">Welcome</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Ini versi React (Inertia). Next: Calendar + Booking flow.
                </p>
            </div>
        </AppLayout>
    );
}
