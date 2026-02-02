<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Booking extends Model
{
    /** @use HasFactory<\Database\Factories\BookingFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'start_time',
        'end_time',
        'purpose',
        'status',
        'decision_note',
        'decided_by',
        'decided_at',
        'returned_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'decided_at' => 'datetime',
            'returned_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'status' => BookingStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function decidedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'decided_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }

    public function assets(): BelongsToMany
    {
        return $this->belongsToMany(Asset::class, 'booking_items')
            ->withPivot(['quantity'])
            ->withTimestamps();
    }

    public function scopeOverlapping($query, $startTime, $endTime)
    {
        return $query->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime);
    }

    public function scopeBlocking($query)
    {
        return $query->whereIn('status', [BookingStatus::Pending, BookingStatus::Approved]);
    }
}
