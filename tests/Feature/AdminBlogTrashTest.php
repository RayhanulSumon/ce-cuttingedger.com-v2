<?php

namespace Tests\Feature;

use App\Models\Blog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminBlogTrashTest extends TestCase
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

    public function test_admin_can_soft_delete_blog_article(): void
    {
        $blog = Blog::firstOrFail();
        $originalStatus = $blog->status;

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.blogs.destroy', $blog->id));

        $response->assertRedirect();
        $this->assertSoftDeleted('blogs', ['id' => $blog->id]);

        // Status remains unchanged in DB while soft-deleted
        $trashedBlog = Blog::withTrashed()->find($blog->id);
        $this->assertNotNull($trashedBlog);
        $this->assertNotNull($trashedBlog->deleted_at);
        $this->assertSame($originalStatus, $trashedBlog->status);
    }

    public function test_admin_blogs_index_excludes_soft_deleted_blogs_and_shows_trashed_count(): void
    {
        $blog = Blog::firstOrFail();
        $blog->delete();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.blogs.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Blogs/Index')
            ->has('blogs')
            ->where('trashedCount', 1)
        );
    }

    public function test_admin_can_view_trashed_blogs_page(): void
    {
        $blog = Blog::firstOrFail();
        $blog->delete();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.blogs.trash'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Blogs/Trash')
            ->has('blogs', 1)
            ->where('blogs.0.id', $blog->id)
        );
    }

    public function test_admin_can_restore_soft_deleted_blog_to_previous_stage(): void
    {
        $blog = Blog::firstOrFail();
        $originalStatus = $blog->status;
        $blog->delete();

        $this->assertSoftDeleted('blogs', ['id' => $blog->id]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.blogs.restore', $blog->id));

        $response->assertRedirect();
        $this->assertNotSoftDeleted('blogs', ['id' => $blog->id]);

        $restoredBlog = Blog::find($blog->id);
        $this->assertNotNull($restoredBlog);
        $this->assertNull($restoredBlog->deleted_at);
        $this->assertSame($originalStatus, $restoredBlog->status);
    }

    public function test_admin_can_permanently_force_delete_soft_deleted_blog(): void
    {
        $blog = Blog::firstOrFail();
        $blogId = $blog->id;
        $blog->delete();

        $this->assertSoftDeleted('blogs', ['id' => $blogId]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.blogs.force-delete', $blogId));

        $response->assertRedirect();
        $this->assertDatabaseMissing('blogs', ['id' => $blogId]);
    }

    public function test_public_pages_do_not_display_soft_deleted_blogs(): void
    {
        $blog = Blog::where('status', 'published')->firstOrFail();
        $slug = $blog->slug;
        $blog->delete();

        // Should not be in public list
        $indexResponse = $this->get('/blog');
        $indexResponse->assertOk();
        $indexResponse->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Index')
            ->where('blogs', fn ($blogs) => ! collect($blogs)->pluck('slug')->contains($slug))
        );

        // Detail page should 404
        $showResponse = $this->get("/blog/{$slug}");
        $showResponse->assertNotFound();
    }
}
