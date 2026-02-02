<?php

namespace App\Http\Controllers;

use App\Enums\AssetStatus;
use App\Enums\AssetType;
use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
use App\Models\Asset;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(): Response
    {
        $assets = Asset::query()
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Assets/Index', [
            'assets' => $assets,
            'createUrl' => route('admin.assets.create'),
            'editUrlTemplate' => url('/admin/assets/{id}/edit'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Assets/Form', [
            'asset' => null,
            'types' => array_map(fn ($c) => $c->value, AssetType::cases()),
            'statuses' => array_map(fn ($c) => $c->value, AssetStatus::cases()),
            'storeUrl' => route('admin.assets.store'),
            'indexUrl' => route('admin.assets.index'),
        ]);
    }

    public function store(StoreAssetRequest $request): RedirectResponse
    {
        Asset::create($request->validated());

        return redirect()->route('admin.assets.index')->with('status', 'Asset dibuat.');
    }

    public function edit(Asset $asset): Response
    {
        return Inertia::render('Admin/Assets/Form', [
            'asset' => $asset,
            'types' => array_map(fn ($c) => $c->value, AssetType::cases()),
            'statuses' => array_map(fn ($c) => $c->value, AssetStatus::cases()),
            'updateUrl' => route('admin.assets.update', $asset),
            'indexUrl' => route('admin.assets.index'),
        ]);
    }

    public function update(UpdateAssetRequest $request, Asset $asset): RedirectResponse
    {
        $asset->update($request->validated());

        return redirect()->route('admin.assets.index')->with('status', 'Asset diperbarui.');
    }
}
