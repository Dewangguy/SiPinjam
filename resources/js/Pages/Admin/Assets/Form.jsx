import React from 'react';
import { Link, useForm } from '@inertiajs/react';

import AppLayout from '../../../Shared/AppLayout';

export default function AdminAssetForm({ asset, types, statuses, storeUrl, updateUrl, indexUrl, auth }) {
    const isEdit = Boolean(asset);

    const { data, setData, post, patch, processing, errors } = useForm({
        name: asset?.name ?? '',
        type: asset?.type ?? 'tool',
        status: asset?.status ?? 'available',
        description: asset?.description ?? '',
        category: asset?.category ?? '',
        serial_number: asset?.serial_number ?? '',
        is_active: asset?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) patch(updateUrl);
        else post(storeUrl);
    };

    return (
        <AppLayout title={isEdit ? 'Edit Asset' : 'New Asset'} auth={auth}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">{isEdit ? 'Perbarui data aset.' : 'Tambah aset baru.'}</div>
                    <Link href={indexUrl} className="text-sm text-indigo-600 hover:text-indigo-700">
                        Kembali
                    </Link>
                </div>

                <form className="space-y-4 rounded bg-white p-6 shadow-sm" onSubmit={submit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name ? <div className="mt-1 text-xs text-red-600">{errors.name}</div> : null}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                {types.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                            {errors.type ? <div className="mt-1 text-xs text-red-600">{errors.type}</div> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            {errors.status ? <div className="mt-1 text-xs text-red-600">{errors.status}</div> : null}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description ? <div className="mt-1 text-xs text-red-600">{errors.description}</div> : null}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                value={data.serial_number}
                                onChange={(e) => setData('serial_number', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={Boolean(data.is_active)}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">
                            Active
                        </label>
                        {errors.is_active ? <div className="text-xs text-red-600">{errors.is_active}</div> : null}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={indexUrl} className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
