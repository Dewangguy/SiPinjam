<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Actions\Bookings\UpdateBookingStatusAction;
use App\Enums\BookingStatus;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Models\Booking;
use App\Notifications\BookingStatusChanged;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BookingApprovalController extends Controller
{
    public function index(): Response
    {
        $bookings = Booking::query()
            ->where('status', BookingStatus::Pending)
            ->with(['user', 'assets'])
            ->orderBy('start_time')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'updateUrlTemplate' => url('/admin/bookings/{id}'),
        ]);
    }

    public function update(UpdateBookingStatusRequest $request, Booking $booking, UpdateBookingStatusAction $action): RedirectResponse
    {
        $newStatus = match ($request->validated('status')) {
            'approved' => BookingStatus::Approved,
            'rejected' => BookingStatus::Rejected,
            default => throw new \InvalidArgumentException('Invalid status.'),
        };

        try {
            $booking = $action->execute(
                $booking,
                $newStatus,
                $request->validated('decision_note'),
                $request->user()->id
            );
        } catch (\DomainException $e) {
            return back()->withErrors(['status' => $e->getMessage()]);
        }

        $booking->user->notify(new BookingStatusChanged($booking));

        return back()->with('status', 'Status booking diperbarui.');
    }
}
