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
        $title = fake()->unique()->words(3, true);

        return [
            'parent_id' => null,
            'title' => Str::title($title),
            'slug' => Str::slug($title),
            'tag' => null,
            'subtitle' => fake()->sentence(8),
            'description' => fake()->paragraph(),
            'icon' => 'Layers',
            'features' => [fake()->sentence(4), fake()->sentence(4)],
            'deliverables' => [fake()->sentence(3)],
            'process_steps' => [['title' => 'Brief', 'description' => fake()->sentence()]],
            'faqs' => [['question' => fake()->sentence().'?', 'answer' => fake()->sentence()]],
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    public function child(Capability $parent): static
    {
        return $this->state(fn () => ['parent_id' => $parent->id]);
    }
}
