<?php

namespace Tests\Feature;

use App\Models\Blog;
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

    public function test_renders_blog_index_with_journal_blogs(): void
    {
        $response = $this->get('/blog');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Index')
            ->has('blogs')
            ->has('categories')
            ->where('activeCategory', 'all')
        );
    }

    public function test_renders_individual_blog_detail_view(): void
    {
        $blog = Blog::firstOrFail();

        $response = $this->get("/blog/{$blog->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Show')
            ->where('blog.slug', $blog->slug)
            ->has('relatedBlogs')
        );
    }
}
