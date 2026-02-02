<?php

namespace App\Http\Controllers;

use App\Actions\Bookings\CreateBookingAction;
use App\Enums\BookingStatus;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Asset;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(): Response
    {
        $bookings = Booking::query()
            ->where('user_id', Auth::id())
            ->with(['assets', 'decidedBy'])
            ->latest('start_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
            'createUrl' => route('bookings.create'),
            'cancelUrlTemplate' => url('/bookings/{id}/cancel'),
        ]);
    }

    public function create(): Response
    {
        $rooms = Asset::query()
            ->where('is_active', true)
            ->where('status', 'available')
            ->where('type', 'room')
            ->orderBy('name')
            ->get(['id', 'name', 'status']);

        $tools = Asset::query()
            ->where('is_active', true)
            ->where('status', 'available')
            ->where('type', 'tool')
            ->orderBy('name')
            ->get(['id', 'name', 'status']);

        return Inertia::render('Bookings/Create', [
            'rooms' => $rooms,
            'tools' => $tools,
            'storeUrl' => route('bookings.store'),
            'indexUrl' => route('bookings.index'),
            'prefill' => [
                'start_time' => request()->input('start_time'),
                'end_time' => request()->input('end_time'),
            ],
        ]);
    }

    public function store(StoreBookingRequest $request, CreateBookingAction $action): RedirectResponse
    {
        try {
            $action->execute([
                'user_id' => $request->user()->id,
                'start_time' => $request->validated('start_time'),
                'end_time' => $request->validated('end_time'),
                'purpose' => $request->validated('purpose'),
                'asset_ids' => $request->validated('asset_ids'),
            ]);
        } catch (\DomainException $e) {
            return back()
                ->withErrors(['start_time' => $e->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('bookings.index')
            ->with('status', 'Pengajuan booking berhasil dibuat dan menunggu persetujuan.');
    }

    public function cancel(Booking $booking): RedirectResponse
    {
        abort_unless($booking->user_id === Auth::id(), 403);

        if ($booking->status !== BookingStatus::Pending) {
            return back()->with('status', 'Booking tidak dapat dibatalkan (sudah diproses).');
        }

        $booking->forceFill([
            'status' => BookingStatus::Cancelled,
            'cancelled_at' => now(),
        ])->save();

        return back()->with('status', 'Booking dibatalkan.');
    }
}
