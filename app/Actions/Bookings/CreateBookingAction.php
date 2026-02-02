<?php

namespace App\Actions\Bookings;

use App\Enums\BookingStatus;
use App\Models\Asset;
use App\Models\Booking;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CreateBookingAction
{
    /**
     * @param  array{user_id:int,start_time:string,end_time:string,purpose?:string|null,asset_ids:array<int,int>}  $data
     */
    public function execute(array $data): Booking
    {
        $assetIds = array_values(array_unique(array_map('intval', $data['asset_ids'] ?? [])));

        return DB::transaction(function () use ($data, $assetIds) {
            $assets = Asset::query()
                ->whereIn('id', $assetIds)
                ->get(['id', 'name', 'type', 'status', 'is_active']);

            if ($assets->count() !== count($assetIds)) {
                throw new \InvalidArgumentException('Some assets are invalid.');
            }

            $unavailable = $assets->first(function (Asset $asset) {
                return !$asset->is_active || $asset->status?->value !== 'available';
            });

            if ($unavailable) {
                throw new \DomainException('Some assets are not available.');
            }

            // Conflict check: any blocking booking that overlaps for any selected asset.
            $hasConflict = Booking::query()
                ->blocking()
                ->overlapping($data['start_time'], $data['end_time'])
                ->whereHas('items', function ($q) use ($assetIds) {
                    $q->whereIn('asset_id', $assetIds);
                })
                ->exists();

            if ($hasConflict) {
                throw new \DomainException('Schedule conflict detected.');
            }

            $booking = Booking::create([
                'user_id' => (int) $data['user_id'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'purpose' => Arr::get($data, 'purpose'),
                'status' => BookingStatus::Pending,
            ]);

            $items = collect($assetIds)->map(fn (int $assetId) => [
                'asset_id' => $assetId,
                'quantity' => 1,
            ])->all();

            $booking->assets()->sync($items);

            return $booking->load(['assets', 'user']);
        });
    }
}
