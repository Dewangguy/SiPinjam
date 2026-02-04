import React from 'react';
import { Link, useForm } from '@inertiajs/react';

import AppLayout from '../../../Shared/AppLayout';
import Card from '../../../Shared/ui/Card';
import PageHeader from '../../../Shared/ui/PageHeader';

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
                <PageHeader
                    title={isEdit ? 'Edit aset' : 'Tambah aset'}
                    subtitle={isEdit ? 'Perbarui data aset/ruangan.' : 'Tambah aset baru yang bisa dibooking.'}
                    right={
                        <Link href={indexUrl} className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                            Kembali
                        </Link>
                    }
                />

                <Card>
                    <form className="space-y-5 p-6" onSubmit={submit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name ? <div className="mt-1 text-xs text-red-600">{errors.name}</div> : null}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
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
                                className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
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
                            className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
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
                                className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                value={data.serial_number}
                                onChange={(e) => setData('serial_number', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 ring-1 ring-inset ring-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-900">Active</div>
                                <div className="mt-0.5 text-xs text-gray-600">Nonaktifkan jika aset tidak boleh dibooking.</div>
                            </div>
                            <input
                                id="is_active"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                                checked={Boolean(data.is_active)}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                        </div>
                        {errors.is_active ? <div className="mt-2 text-xs text-red-600">{errors.is_active}</div> : null}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={indexUrl} className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
