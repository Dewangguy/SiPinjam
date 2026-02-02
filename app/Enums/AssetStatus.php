<?php

namespace App\Enums;

enum AssetStatus: string
{
    case Available = 'available';
    case Unavailable = 'unavailable';
    case Maintenance = 'maintenance';
}
