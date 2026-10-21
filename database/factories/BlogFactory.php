<?php

namespace Database\Factories;

use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Blog>
 */
class BlogFactory extends Factory
{
    protected $model = Blog::class;

    /**
     * Curated high-resolution editorial tech and design imagery.
     */
    protected static array $curatedCovers = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(6);
        $slug = Str::slug($title);
        $cover = fake()->randomElement(self::$curatedCovers);
        $excerpt = fake()->paragraph(3);

        $body = "# {$title}\n\n"
            .fake()->paragraphs(3, true)."\n\n"
            ."## The Architectural Philosophy\n\n"
            .fake()->paragraphs(2, true)."\n\n"
            .'> '.fake()->sentence(14)."\n\n"
            ."```typescript\n// Runtime kinetic pipeline\nexport function computeInteraction() {\n    return { latency: '8ms', status: 'optimal' };\n}\n```\n\n"
            ."### Performance Benchmarks\n\n"
            .fake()->paragraphs(2, true);

        return [
            'blog_category_id' => BlogCategory::factory(),
            'subcategory_id' => null,
            'author_id' => TeamMember::inRandomOrder()->value('id') ?? 1,
            'title' => rtrim($title, '.'),
            'slug' => $slug,
            'excerpt' => $excerpt,
            'body' => $body,
            'cover_image' => $cover,
            'reading_time' => fake()->numberBetween(4, 12),
            'is_featured' => fake()->boolean(30),
            'status' => 'published',
            'tags' => [fake()->word(), fake()->word(), fake()->word()],
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),

            // Dynamic SEO Suite
            'meta_title' => rtrim($title, '.').' — CuttingEdger Journal',
            'meta_description' => Str::limit($excerpt, 155),
            'meta_keywords' => implode(', ', fake()->words(5)),
            'canonical_url' => "https://cuttingedger.com/blog/{$slug}",
            'og_image' => $cover,
            'robots' => 'index, follow',
        ];
    }

    /**
     * Indicate that the blog is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the blog is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
