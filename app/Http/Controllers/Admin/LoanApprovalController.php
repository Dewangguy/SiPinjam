<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateLoanStatusRequest;
use App\Models\Loan;
use App\Notifications\LoanStatusChanged;

class LoanApprovalController extends Controller
{
    public function index()
    {
        $pendingLoans = Loan::query()
            ->where('status', Loan::STATUS_PENDING)
            ->with(['user', 'loanable'])
            ->orderBy('start_at')
            ->paginate(20);

        return view('admin.loans.index', [
            'pendingLoans' => $pendingLoans,
        ]);
    }

    public function update(UpdateLoanStatusRequest $request, Loan $loan)
    {
        if ($loan->status !== Loan::STATUS_PENDING) {
            return back()->with('status', 'Loan ini sudah diproses sebelumnya.');
        }

        $newStatus = $request->validated('status');

        if ($newStatus === Loan::STATUS_APPROVED) {
            $conflict = Loan::query()
                ->where('id', '!=', $loan->id)
                ->where('loanable_type', $loan->loanable_type)
                ->where('loanable_id', $loan->loanable_id)
                ->where('status', Loan::STATUS_APPROVED)
                ->overlapping($loan->start_at, $loan->end_at)
                ->exists();

            if ($conflict) {
                return back()->withErrors([
                    'status' => 'Tidak bisa disetujui karena jadwal bentrok dengan booking yang sudah disetujui.',
                ]);
            }
        }

        $loan->forceFill([
            'status' => $newStatus,
            'decision_note' => $request->validated('decision_note'),
            'decided_by' => $request->user()->id,
            'decided_at' => now(),
        ])->save();

        $loan->user->notify(new LoanStatusChanged($loan));

        return back()->with('status', 'Status pengajuan berhasil diperbarui.');
    }
}
