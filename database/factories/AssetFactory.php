<?php

namespace Database\Factories;

use App\Enums\AssetStatus;
use App\Enums\AssetType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asset>
 */
class AssetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Proyektor', 'Laptop', 'Kamera', 'Speaker', 'Mic Wireless']).' '.fake()->unique()->numberBetween(1, 30),
            'type' => fake()->randomElement([AssetType::Tool->value, AssetType::Room->value]),
            'status' => fake()->randomElement([AssetStatus::Available->value, AssetStatus::Unavailable->value, AssetStatus::Maintenance->value]),
            'description' => fake()->boolean(40) ? fake()->sentence() : null,
            'category' => fake()->randomElement(['Elektronik', 'IT', 'Multimedia']),
            'serial_number' => fake()->unique()->bothify('SN-####-????'),
            'is_active' => true,
        ];
    }

    public function room(): static
    {
        return $this->state(function () {
            return [
                'type' => AssetType::Room->value,
                'status' => AssetStatus::Available->value,
                'category' => 'Ruangan',
                'serial_number' => null,
                'name' => 'Ruang Meeting '.fake()->unique()->randomElement(['A', 'B', 'C', 'D', 'E', 'F']),
            ];
        });
    }

    public function tool(): static
    {
        return $this->state(function () {
            return [
                'type' => AssetType::Tool->value,
                'status' => AssetStatus::Available->value,
            ];
        });
    }
}
