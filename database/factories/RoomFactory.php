<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Ruang Rapat '.fake()->unique()->numberBetween(1, 50),
            'location' => fake()->randomElement(['Lantai 1', 'Lantai 2', 'Gedung Utama']),
            'capacity' => fake()->numberBetween(4, 30),
            'is_active' => true,
        ];
    }
}
