import React from 'react';
import { Link } from '@inertiajs/react';

import AppLayout from '../../../Shared/AppLayout';

function urlFromTemplate(template, id) {
    return template.replace('{id}', String(id));
}

export default function AdminAssetsIndex({ assets, createUrl, editUrlTemplate, auth }) {
    return (
        <AppLayout title="Assets" auth={auth}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Inventory aset & ruangan.</div>
                    <Link href={createUrl} className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
                        New Asset
                    </Link>
                </div>

                <div className="overflow-hidden rounded bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Active</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {assets.data.map((a) => (
                                <tr key={a.id}>
                                    <td className="px-4 py-3 text-sm text-gray-700">{a.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{a.type}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{a.status}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{a.is_active ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-3 text-right text-sm">
                                        <Link
                                            href={urlFromTemplate(editUrlTemplate, a.id)}
                                            className="text-indigo-600 hover:text-indigo-700"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
                        <div>
                            Page {assets.current_page} of {assets.last_page}
                        </div>
                        <div className="space-x-2">
                            {assets.prev_page_url ? <Link href={assets.prev_page_url}>Prev</Link> : <span className="text-gray-400">Prev</span>}
                            {assets.next_page_url ? <Link href={assets.next_page_url}>Next</Link> : <span className="text-gray-400">Next</span>}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
