<?php

namespace Database\Factories;

use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BlogCategory>
 */
class BlogCategoryFactory extends Factory
{
    protected $model = BlogCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'parent_id' => null,
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => fake()->sentence(12),
        ];
    }

    /**
     * Indicate that the blog category is a subcategory of a parent.
     */
    public function subcategory(BlogCategory|int $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent instanceof BlogCategory ? $parent->id : $parent,
        ]);
    }
}
