<?php

namespace Tests\Feature;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BlogControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_renders_blog_index_with_journal_posts(): void
    {
        $response = $this->get('/blog');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Index')
            ->has('posts')
            ->has('categories')
            ->where('activeCategory', 'all')
        );
    }

    public function test_renders_individual_post_detail_view(): void
    {
        $post = Post::firstOrFail();

        $response = $this->get("/blog/{$post->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Show')
            ->where('post.slug', $post->slug)
            ->has('relatedPosts')
        );
    }
}
