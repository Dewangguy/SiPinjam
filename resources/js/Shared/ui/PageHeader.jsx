import React from 'react';

export default function PageHeader({ title, subtitle, right }) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <div className="text-base font-semibold text-gray-900">{title}</div>
                {subtitle ? <div className="mt-1 text-sm text-gray-600">{subtitle}</div> : null}
            </div>
            {right ? <div className="flex items-center gap-2">{right}</div> : null}
        </div>
    );
}
