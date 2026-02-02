<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Booking;
use App\Enums\BookingStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        return Inertia::render('Calendar/Index', [
            'rooms' => Asset::query()
                ->where('is_active', true)
                ->where('type', 'room')
                ->orderBy('name')
                ->get(['id', 'name']),
            'assets' => Asset::query()
                ->where('is_active', true)
                ->where('type', 'tool')
                ->orderBy('name')
                ->get(['id', 'name']),
            'eventsUrl' => route('calendar.events'),
            'createBookingUrl' => route('bookings.create'),
        ]);
    }

    public function events(Request $request)
    {
        $kind = $request->string('kind')->toString();
        $assetId = (int) $request->input('asset_id', $request->input('loanable_id'));

        $query = Booking::query()
            ->with(['user', 'assets'])
            ->blocking();

        if ($kind === 'room') {
            $query->whereHas('assets', function ($q) {
                $q->where('type', 'room');
            });
        }

        if ($kind === 'asset') {
            $query->whereHas('assets', function ($q) {
                $q->where('type', 'tool');
            });
        }

        if ($assetId > 0) {
            $query->whereHas('items', function ($q) use ($assetId) {
                $q->where('asset_id', $assetId);
            });
        }

        if ($request->filled('start') && $request->filled('end')) {
            $query->overlapping($request->input('start'), $request->input('end'));
        }

        $bookings = $query->get();

        $events = $bookings->map(function (Booking $booking) {
            $assetNames = $booking->assets->pluck('name')->take(3)->join(', ');
            $status = $booking->status;

            $color = match ($status) {
                BookingStatus::Approved => '#16a34a',
                BookingStatus::Pending => '#f59e0b',
                default => '#6b7280',
            };

            return [
                'id' => $booking->id,
                'title' => $assetNames.' — '.$booking->user->name.' ('.$status->value.')',
                'start' => $booking->start_time->toIso8601String(),
                'end' => $booking->end_time->toIso8601String(),
                'backgroundColor' => $color,
                'borderColor' => $color,
                'extendedProps' => [
                    'status' => $status->value,
                    'user' => $booking->user->name,
                    'assets' => $booking->assets->pluck('name')->all(),
                ],
            ];
        });

        return response()->json($events);
    }
}
