<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Loan;

class LoanStatusChanged extends Notification
{
    use Queueable;

    public function __construct(public Loan $loan)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $loanableName = $this->loan->loanable?->name ?? 'Item';

        $statusText = match ($this->loan->status) {
            Loan::STATUS_APPROVED => 'DISETUJUI',
            Loan::STATUS_REJECTED => 'DITOLAK',
            Loan::STATUS_CANCELLED => 'DIBATALKAN',
            default => strtoupper($this->loan->status),
        };

        return (new MailMessage)
            ->subject('Status Pengajuan Peminjaman: '.$statusText)
            ->greeting('Halo '.$notifiable->name.',')
            ->line('Pengajuan peminjaman kamu sudah diproses.')
            ->line('Item: '.$loanableName)
            ->line('Waktu: '.$this->loan->start_at?->toDateTimeString().' s/d '.$this->loan->end_at?->toDateTimeString())
            ->when((bool) $this->loan->decision_note, function (MailMessage $mail) {
                $mail->line('Catatan Admin: '.$this->loan->decision_note);
            })
            ->action('Lihat Riwayat Peminjaman', route('loans.index'))
            ->line('Terima kasih.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
