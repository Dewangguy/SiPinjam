<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanRequest;
use App\Models\Asset;
use App\Models\Loan;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        $loans = $request->user()
            ->loans()
            ->with(['loanable', 'decidedBy'])
            ->latest()
            ->paginate(15);

        return view('loans.index', [
            'loans' => $loans,
        ]);
    }

    public function create(Request $request)
    {
        $rooms = Room::query()->where('is_active', true)->orderBy('name')->get();
        $assets = Asset::query()->where('is_active', true)->orderBy('name')->get();

        return view('loans.create', [
            'rooms' => $rooms,
            'assets' => $assets,
            'prefillStart' => $request->input('start_at'),
            'prefillEnd' => $request->input('end_at'),
        ]);
    }

    public function store(StoreLoanRequest $request)
    {
        $loanableClass = match ($request->validated('kind')) {
            'room' => Room::class,
            'asset' => Asset::class,
        };

        $loan = Loan::create([
            'user_id' => $request->user()->id,
            'loanable_type' => $loanableClass,
            'loanable_id' => (int) $request->validated('loanable_id'),
            'start_at' => Carbon::parse($request->validated('start_at')),
            'end_at' => Carbon::parse($request->validated('end_at')),
            'purpose' => $request->validated('purpose'),
            'status' => Loan::STATUS_PENDING,
        ]);

        return redirect()->route('loans.index')->with('status', 'Pengajuan berhasil dibuat dan menunggu persetujuan admin.');
    }

    public function cancel(Request $request, Loan $loan)
    {
        abort_unless($loan->user_id === $request->user()->id, 403);

        if ($loan->status !== Loan::STATUS_PENDING) {
            return back()->with('status', 'Hanya pengajuan status pending yang bisa dibatalkan.');
        }

        $loan->forceFill([
            'status' => Loan::STATUS_CANCELLED,
            'cancelled_at' => now(),
        ])->save();

        return back()->with('status', 'Pengajuan dibatalkan.');
    }
}
