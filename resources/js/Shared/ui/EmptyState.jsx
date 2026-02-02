import React from 'react';

export default function EmptyState({ title = 'Tidak ada data', description, action }) {
    return (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto max-w-md">
                <div className="text-base font-semibold text-gray-900">{title}</div>
                {description ? <div className="mt-2 text-sm text-gray-600">{description}</div> : null}
                {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
            </div>
        </div>
    );
}
