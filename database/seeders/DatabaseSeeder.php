<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Models\Asset;
use App\Models\Department;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $departments = collect([
            'Finance',
            'HR',
            'IT',
            'Operations',
            'Program',
        ])->map(function (string $name) {
            return Department::query()->updateOrCreate(['name' => $name], ['name' => $name]);
        });

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@sipinjam.test'],
            [
                'name' => 'Admin SiPinjam',
                'password' => Hash::make('password'),
                'is_admin' => true,
                'role' => 'admin',
                'department_id' => $departments->random()->id,
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'approver@sipinjam.test'],
            [
                'name' => 'Approver/Manager',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'role' => 'approver',
                'department_id' => $departments->random()->id,
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'role' => 'staff',
                'department_id' => $departments->random()->id,
            ]
        );

        $users = User::factory(15)->create([
            'role' => 'staff',
            'department_id' => $departments->random()->id,
        ]);

        if (Asset::query()->count() === 0) {
            $rooms = Asset::factory(6)->room()->create();
            $tools = Asset::factory(10)->tool()->create();
        } else {
            $rooms = Asset::query()->where('type', 'room')->get();
            $tools = Asset::query()->where('type', 'tool')->get();
        }

        $allBorrowers = $users->concat([$admin]);

        $makeBookingsForAsset = function (Asset $asset) use ($allBorrowers, $admin) {
            $base = Carbon::now()->startOfWeek()->addDays(fake()->numberBetween(0, 4))->setTime(8, 0);

            for ($i = 0; $i < 3; $i++) {
                $start = (clone $base)->addDays($i)->setTime(9 + ($i * 3), 0);
                $end = (clone $start)->addHours(2);

                $booking = Booking::create([
                    'user_id' => $allBorrowers->random()->id,
                    'start_time' => $start,
                    'end_time' => $end,
                    'purpose' => 'Rapat / Kegiatan internal',
                    'status' => BookingStatus::Approved,
                    'decided_by' => $admin->id,
                    'decided_at' => now()->subDays(fake()->numberBetween(1, 5)),
                ]);

                $booking->assets()->sync([
                    $asset->id => ['quantity' => 1],
                ]);
            }

            // One pending request in the future (non-overlapping)
            $pendingStart = (clone $base)->addDays(6)->setTime(13, 0);
            $pendingEnd = (clone $pendingStart)->addHours(2);

            $pending = Booking::create([
                'user_id' => $allBorrowers->random()->id,
                'start_time' => $pendingStart,
                'end_time' => $pendingEnd,
                'purpose' => 'Pengajuan (dummy) menunggu approval',
                'status' => BookingStatus::Pending,
            ]);

            $pending->assets()->sync([
                $asset->id => ['quantity' => 1],
            ]);
        };

        if (Booking::query()->count() === 0) {
            foreach ($rooms as $asset) {
                $makeBookingsForAsset($asset);
            }

            foreach ($tools as $asset) {
                $makeBookingsForAsset($asset);
            }
        }
    }
}
