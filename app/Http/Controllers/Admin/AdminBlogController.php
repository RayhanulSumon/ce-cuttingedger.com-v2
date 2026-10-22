<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminBlogController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(): Response
    {
        $blogs = Blog::with(['category', 'subcategory', 'author'])->latest()->get();
        $categories = BlogCategory::whereNull('parent_id')
            ->with('subcategories')
            ->get();
        $allCategories = BlogCategory::all();
        $authors = TeamMember::all();
        $trashedCount = Blog::onlyTrashed()->count();

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs,
            'categories' => $categories,
            'allCategories' => $allCategories,
            'authors' => $authors,
            'trashedCount' => $trashedCount,
        ]);
    }

    /**
     * Store a newly created blog post with dynamic SEO and subcategories.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blogs,slug'],
            'blog_category_id' => ['nullable', 'exists:blog_categories,id'],
            'subcategory_id' => ['nullable', 'exists:blog_categories,id'],
            'author_id' => ['nullable', 'exists:team_members,id'],
            'excerpt' => ['required', 'string'],
            'body' => ['required', 'string'],
            'cover_image' => ['required', 'string'],
            'reading_time' => ['nullable', 'integer', 'min:1'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['nullable', 'in:draft,published,archived'],
            'tags' => ['nullable'],
            // Dynamic SEO suite
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'string', 'max:255'],
            'og_image' => ['nullable', 'string', 'max:255'],
            'robots' => ['nullable', 'string', 'max:100'],
        ]);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['title']);
            $validated['slug'] = $baseSlug.'-'.Str::random(4);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        // Automatic reading time estimate if not specified (words / 200)
        if (empty($validated['reading_time'])) {
            $wordCount = str_word_count(strip_tags($validated['body']));
            $validated['reading_time'] = max(1, (int) ceil($wordCount / 200));
        }

        // Smart dynamic SEO fallbacks
        if (empty($validated['meta_title'])) {
            $validated['meta_title'] = $validated['title'];
        }
        if (empty($validated['meta_description'])) {
            $validated['meta_description'] = Str::limit(strip_tags($validated['excerpt']), 160);
        }
        if (empty($validated['og_image'])) {
            $validated['og_image'] = $validated['cover_image'];
        }

        if (is_string($validated['tags'] ?? null)) {
            $validated['tags'] = array_values(array_filter(array_map('trim', explode(',', $validated['tags']))));
        }

        $validated['published_at'] = ($validated['status'] ?? 'published') === 'published' ? now() : null;

        Blog::create($validated);

        return redirect()->back()->with('success', 'Article published with full dynamic SEO suite.');
    }

    /**
     * Update the specified blog post.
     */
    public function update(Request $request, Blog $blog): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:blogs,slug,'.$blog->id],
            'blog_category_id' => ['nullable', 'exists:blog_categories,id'],
            'subcategory_id' => ['nullable', 'exists:blog_categories,id'],
            'author_id' => ['nullable', 'exists:team_members,id'],
            'excerpt' => ['required', 'string'],
            'body' => ['required', 'string'],
            'cover_image' => ['required', 'string'],
            'reading_time' => ['nullable', 'integer', 'min:1'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['nullable', 'in:draft,published,archived'],
            'tags' => ['nullable'],
            // Dynamic SEO suite
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'string', 'max:255'],
            'og_image' => ['nullable', 'string', 'max:255'],
            'robots' => ['nullable', 'string', 'max:100'],
        ]);

        $validated['slug'] = Str::slug($validated['slug']);

        if (empty($validated['reading_time'])) {
            $wordCount = str_word_count(strip_tags($validated['body']));
            $validated['reading_time'] = max(1, (int) ceil($wordCount / 200));
        }

        if (is_string($validated['tags'] ?? null)) {
            $validated['tags'] = array_values(array_filter(array_map('trim', explode(',', $validated['tags']))));
        }

        if (($validated['status'] ?? 'published') === 'published' && ! $blog->published_at) {
            $validated['published_at'] = now();
        }

        $blog->update($validated);

        return redirect()->back()->with('success', "Article [{$blog->title}] and SEO metadata updated.");
    }

    /**
     * Remove the specified blog post (soft delete).
     */
    public function destroy(Blog $blog): RedirectResponse
    {
        $title = $blog->title;
        $blog->delete();

        return redirect()->back()->with('success', "Article [{$title}] moved to trash.");
    }

    /**
     * Display a listing of soft-deleted blog posts.
     */
    public function trash(): Response
    {
        $trashedBlogs = Blog::onlyTrashed()
            ->with(['category', 'subcategory', 'author'])
            ->latest('deleted_at')
            ->get();

        return Inertia::render('Admin/Blogs/Trash', [
            'blogs' => $trashedBlogs,
        ]);
    }

    /**
     * Restore the specified soft-deleted blog post to its exact previous stage.
     */
    public function restore(int $id): RedirectResponse
    {
        $blog = Blog::onlyTrashed()->findOrFail($id);
        $title = $blog->title;
        $blog->restore();

        return redirect()->back()->with('success', "Article [{$title}] restored to its previous state.");
    }

    /**
     * Permanently remove the specified blog post from storage.
     */
    public function forceDelete(int $id): RedirectResponse
    {
        $blog = Blog::onlyTrashed()->findOrFail($id);
        $title = $blog->title;
        $blog->forceDelete();

        return redirect()->back()->with('success', "Article [{$title}] permanently deleted.");
    }
}
