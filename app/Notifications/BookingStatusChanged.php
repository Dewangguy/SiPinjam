<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Booking;

class BookingStatusChanged extends Notification
{
    use Queueable;

    public function __construct(public Booking $booking)
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
        $this->booking->loadMissing(['assets']);

        $assets = $this->booking->assets->pluck('name')->join(', ');
        $status = $this->booking->status?->value ?? (string) $this->booking->status;

        $message = (new MailMessage)
            ->subject('Update Status Booking: '.$status)
            ->greeting('Halo '.$notifiable->name.',')
            ->line('Status pengajuan booking Anda telah diperbarui.')
            ->line('Aset: '.$assets)
            ->line('Waktu: '.$this->booking->start_time?->toDateTimeString().' s/d '.$this->booking->end_time?->toDateTimeString())
            ->line('Status: '.$status);

        if (!empty($this->booking->decision_note)) {
            $message->line('Catatan: '.$this->booking->decision_note);
        }

        return $message->action('Lihat booking', url('/bookings'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'status' => $this->booking->status?->value ?? (string) $this->booking->status,
        ];
    }
}
