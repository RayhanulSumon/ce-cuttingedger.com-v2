<?php

namespace Tests\Feature;

use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\Role;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminBlogCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $adminRole = Role::where('name', 'admin')->first();
        $this->admin = User::factory()->create(['role_id' => $adminRole->id]);
    }

    public function test_admin_can_view_blog_create_page(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.blogs.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Blogs/Create')
            ->has('categories')
            ->has('authors')
        );
    }

    public function test_admin_can_store_new_blog_and_is_redirected_to_index(): void
    {
        $category = BlogCategory::first();
        $author = TeamMember::first();

        $blogData = [
            'title' => 'Mastering Spatial UI Layouts',
            'slug' => 'mastering-spatial-ui-layouts',
            'blog_category_id' => $category?->id,
            'author_id' => $author?->id,
            'excerpt' => 'A comprehensive deep-dive into crafting tactile, spatial web interfaces.',
            'body' => '<h2>Introduction</h2><p>Spatial layouts redefine digital depth.</p>',
            'cover_image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
            'reading_time' => 4,
            'is_featured' => true,
            'status' => 'published',
            'tags' => 'Spatial, Design, UI',
            'meta_title' => 'Mastering Spatial UI Layouts — CuttingEdger',
            'meta_description' => 'A comprehensive deep-dive into crafting tactile, spatial web interfaces.',
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.blogs.store'), $blogData);

        $response->assertRedirect(route('admin.blogs.index'));
        $this->assertDatabaseHas('blogs', [
            'slug' => 'mastering-spatial-ui-layouts',
            'title' => 'Mastering Spatial UI Layouts',
            'is_featured' => 1,
            'status' => 'published',
        ]);
    }

    public function test_admin_can_view_blog_edit_page(): void
    {
        $blog = Blog::firstOrFail();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.blogs.edit', $blog->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Blogs/Edit')
            ->has('blog')
            ->where('blog.id', $blog->id)
            ->has('categories')
            ->has('authors')
        );
    }

    public function test_admin_can_update_blog_and_is_redirected_to_index(): void
    {
        $blog = Blog::firstOrFail();

        $updatedData = [
            'title' => 'Updated Article Title for Testing',
            'slug' => $blog->slug,
            'blog_category_id' => $blog->blog_category_id,
            'author_id' => $blog->author_id,
            'excerpt' => 'Updated excerpt synopsis for this article.',
            'body' => '<p>Updated content body for testing purposes.</p>',
            'cover_image' => $blog->cover_image,
            'reading_time' => 7,
            'is_featured' => false,
            'status' => 'published',
            'tags' => 'Updated, Architecture',
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.blogs.update', $blog->id), $updatedData);

        $response->assertRedirect(route('admin.blogs.index'));
        $this->assertDatabaseHas('blogs', [
            'id' => $blog->id,
            'title' => 'Updated Article Title for Testing',
            'reading_time' => 7,
        ]);
    }

    public function test_guest_cannot_access_create_or_edit_blog_pages(): void
    {
        $blog = Blog::firstOrFail();

        $createResponse = $this->get(route('admin.blogs.create'));
        $createResponse->assertRedirect('/login');

        $editResponse = $this->get(route('admin.blogs.edit', $blog->id));
        $editResponse->assertRedirect('/login');
    }
}
