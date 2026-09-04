<?php

namespace Database\Factories;

use App\Modules\File\Models\File;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<File>
 */
class FileFactory extends Factory
{
    protected $model = File::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word() . '.png',
            'path' => 'files/' . $this->faker->uuid() . '.png',
            'disk' => 'public',
            'mime_type' => 'image/png',
            'extension' => 'png',
            'size' => $this->faker->numberBetween(1000, 500000),
        ];
    }
}
