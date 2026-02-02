<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = Carbon::now()
            ->addDays(fake()->numberBetween(0, 10))
            ->setTime(fake()->numberBetween(8, 16), 0);

        $end = (clone $start)->addHours(fake()->numberBetween(1, 3));

        return [
            'start_time' => $start,
            'end_time' => $end,
            'purpose' => fake()->boolean(70) ? fake()->sentence(6) : null,
            'status' => BookingStatus::Pending,
        ];
    }
}
