<?php

namespace App\Actions\Bookings;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class UpdateBookingStatusAction
{
    public function execute(Booking $booking, BookingStatus $newStatus, ?string $decisionNote, int $decidedByUserId): Booking
    {
        return DB::transaction(function () use ($booking, $newStatus, $decisionNote, $decidedByUserId) {
            $booking->loadMissing(['items']);

            if ($booking->status !== BookingStatus::Pending) {
                throw new \DomainException('Booking already processed.');
            }

            if ($newStatus === BookingStatus::Approved) {
                $assetIds = $booking->items->pluck('asset_id')->all();

                $conflict = Booking::query()
                    ->where('id', '!=', $booking->id)
                    ->whereIn('status', [BookingStatus::Approved])
                    ->overlapping($booking->start_time, $booking->end_time)
                    ->whereHas('items', function ($q) use ($assetIds) {
                        $q->whereIn('asset_id', $assetIds);
                    })
                    ->exists();

                if ($conflict) {
                    throw new \DomainException('Cannot approve: schedule conflict with an approved booking.');
                }
            }

            $booking->forceFill([
                'status' => $newStatus,
                'decision_note' => $decisionNote,
                'decided_by' => $decidedByUserId,
                'decided_at' => now(),
            ])->save();

            return $booking->fresh(['user', 'assets', 'decidedBy']);
        });
    }
}
