<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\Admin\BookingApprovalController;
use App\Http\Controllers\Admin\LoanApprovalController;
use App\Enums\AssetStatus;
use App\Enums\AssetType;
use App\Enums\BookingStatus;
use App\Models\Asset;
use App\Models\Booking;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    $todayStart = now()->startOfDay();
    $todayEnd = now()->endOfDay();

    $weekStart = now()->startOfWeek();
    $weekEnd = now()->endOfWeek();

    $activeToday = Booking::query()
        ->blocking()
        ->overlapping($todayStart, $todayEnd)
        ->count();

    $pendingRequests = Booking::query()
        ->where('status', BookingStatus::Pending)
        ->count();

    $roomsAvailable = Asset::query()
        ->where('type', AssetType::Room)
        ->where('status', AssetStatus::Available)
        ->where('is_active', true)
        ->count();

    $scheduledThisWeek = Booking::query()
        ->blocking()
        ->whereBetween('start_time', [$weekStart, $weekEnd])
        ->count();

    $todaySchedule = Booking::query()
        ->blocking()
        ->whereBetween('start_time', [$todayStart, $todayEnd])
        ->with(['assets'])
        ->orderBy('start_time')
        ->limit(6)
        ->get()
        ->map(fn (Booking $b) => [
            'id' => $b->id,
            'start_time' => $b->start_time?->toIso8601String(),
            'end_time' => $b->end_time?->toIso8601String(),
            'assets' => $b->assets->map(fn ($a) => ['id' => $a->id, 'name' => $a->name, 'type' => $a->type?->value])->values(),
            'purpose' => $b->purpose,
            'status' => $b->status?->value,
        ]);

    $recentActivity = Booking::query()
        ->with(['user', 'assets'])
        ->latest('created_at')
        ->limit(6)
        ->get()
        ->map(fn (Booking $b) => [
            'id' => $b->id,
            'created_at' => $b->created_at?->toIso8601String(),
            'user' => $b->user ? ['id' => $b->user->id, 'name' => $b->user->name, 'email' => $b->user->email] : null,
            'assets' => $b->assets->map(fn ($a) => ['id' => $a->id, 'name' => $a->name])->values(),
            'status' => $b->status?->value,
        ]);

    return Inertia::render('Dashboard', [
        'stats' => [
            'active_today' => $activeToday,
            'pending_requests' => $pendingRequests,
            'rooms_available' => $roomsAvailable,
            'scheduled_this_week' => $scheduledThisWeek,
        ],
        'todaySchedule' => $todaySchedule,
        'recentActivity' => $recentActivity,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');
    Route::get('/calendar/events', [CalendarController::class, 'events'])->name('calendar.events');

    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    Route::get('/loans', [LoanController::class, 'index'])->name('loans.index');
    Route::get('/loans/create', [LoanController::class, 'create'])->name('loans.create');
    Route::post('/loans', [LoanController::class, 'store'])->name('loans.store');
    Route::post('/loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');
});

Route::middleware(['auth', 'role:admin,approver'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/assets', [AssetController::class, 'index'])->name('assets.index');
    Route::get('/assets/create', [AssetController::class, 'create'])->name('assets.create');
    Route::post('/assets', [AssetController::class, 'store'])->name('assets.store');
    Route::get('/assets/{asset}/edit', [AssetController::class, 'edit'])->name('assets.edit');
    Route::patch('/assets/{asset}', [AssetController::class, 'update'])->name('assets.update');

    Route::get('/bookings', [BookingApprovalController::class, 'index'])->name('bookings.index');
    Route::patch('/bookings/{booking}', [BookingApprovalController::class, 'update'])->name('bookings.update');

    Route::get('/loans', [LoanApprovalController::class, 'index'])->name('loans.index');
    Route::patch('/loans/{loan}', [LoanApprovalController::class, 'update'])->name('loans.update');
});

require __DIR__.'/auth.php';
