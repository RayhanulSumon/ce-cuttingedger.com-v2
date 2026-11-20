<?php

namespace Database\Factories;

use App\Models\Capability;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Capability>
 */
class CapabilityFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = Str::title(fake()->unique()->words(3, true));
        $subtitle = fake()->sentence(8);

        return [
            'parent_id' => null,
            'title' => $title,
            'slug' => Str::slug($title),
            'tag' => null,
            'subtitle' => $subtitle,
            'icon' => 'Layers',
            'meta_title' => "{$title} | CuttingEdger",
            'meta_description' => $subtitle,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    public function child(Capability $parent): static
    {
        return $this->state(fn () => ['parent_id' => $parent->id]);
    }
}
