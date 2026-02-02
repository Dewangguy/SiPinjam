<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\Loan;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Loan>
 */
class LoanFactory extends Factory
{
    protected $model = Loan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = Carbon::now()->addDays(fake()->numberBetween(1, 10))->setTime(fake()->numberBetween(8, 16), 0);
        $end = (clone $start)->addHours(fake()->randomElement([1, 2, 3]));

        $kind = fake()->randomElement(['room', 'asset']);
        $loanableClass = $kind === 'room' ? Room::class : Asset::class;

        return [
            'user_id' => User::factory(),
            'loanable_type' => $loanableClass,
            'loanable_id' => $loanableClass::factory(),
            'start_at' => $start,
            'end_at' => $end,
            'purpose' => fake()->sentence(3),
            'status' => Loan::STATUS_PENDING,
        ];
    }
}
