<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Returned = 'returned';
    case Cancelled = 'cancelled';

    public function isBlocking(): bool
    {
        return in_array($this, [self::Pending, self::Approved], true);
    }
}
