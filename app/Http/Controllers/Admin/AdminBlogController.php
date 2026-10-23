<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Format;
use Intervention\Image\Laravel\Facades\Image;

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
     * Show the form for creating a new blog post.
     */
    public function create(): Response
    {
        $categories = BlogCategory::whereNull('parent_id')
            ->with('subcategories')
            ->get();
        $authors = TeamMember::all();

        return Inertia::render('Admin/Blogs/Create', [
            'categories' => $categories,
            'authors' => $authors,
        ]);
    }

    /**
     * Upload and optimize a blog cover image using Intervention Image.
     */
    public function uploadCover(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp,avif,gif', 'max:10240'],
        ]);

        $file = $request->file('image');
        $url = $this->optimizeAndStoreCoverImage($file);
        $relativeStoragePath = str_replace('/storage/', '', $url);

        return response()->json([
            'success' => true,
            'url' => $url,
            'filename' => $file->getClientOriginalName(),
            'size' => Storage::disk('public')->size($relativeStoragePath),
        ]);
    }

    /**
     * Optimize and store an uploaded blog cover image using Intervention Image.
     */
    protected function optimizeAndStoreCoverImage(UploadedFile $file): string
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $cleanName = Str::slug($originalName);
        $filename = ($cleanName ? Str::limit($cleanName, 35, '') : 'cover').'-'.Str::random(8).'.webp';
        $path = 'blogs/covers/'.$filename;

        // Decode image from uploaded file
        $image = Image::decode($file->getRealPath());

        // Correct orientation based on EXIF metadata
        $image->orient();

        // Scale down proportionally to 1920px max width (preventing upscaling)
        $image->scaleDown(width: 1920);

        // Encode as lightweight modern WebP at 85% quality
        $encoded = $image->encodeUsingFormat(Format::WEBP, quality: 85);

        // Store into public disk
        Storage::disk('public')->put($path, (string) $encoded);

        return '/storage/'.$path;
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
            'cover_image' => ['required_without:cover_image_file', 'nullable', 'string'],
            'cover_image_file' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp,avif,gif', 'max:10240'],
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

        if ($request->hasFile('cover_image_file')) {
            $validated['cover_image'] = $this->optimizeAndStoreCoverImage($request->file('cover_image_file'));
        }
        unset($validated['cover_image_file']);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['title']);
            $validated['slug'] = $baseSlug.'-'.Str::random(4);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        // Smart dynamic SEO fallbacks
        if (empty($validated['meta_title'])) {
            $validated['meta_title'] = $validated['title'];
        }
        if (empty($validated['meta_description'])) {
            $validated['meta_description'] = Str::limit(strip_tags($validated['excerpt']), 160);
        }
        if (empty($validated['canonical_url'])) {
            $validated['canonical_url'] = url('/blog/'.$validated['slug']);
        }
        if (empty($validated['og_image'])) {
            $validated['og_image'] = $validated['cover_image'] ?? null;
        }

        if (is_string($validated['tags'] ?? null)) {
            $validated['tags'] = array_values(array_filter(array_map('trim', explode(',', $validated['tags']))));
        }

        $validated['published_at'] = ($validated['status'] ?? 'published') === 'published' ? now() : null;

        Blog::create($validated);

        return redirect()->route('admin.blogs.index')->with('success', 'Article published with full dynamic SEO suite.');
    }

    /**
     * Show the form for editing the specified blog post.
     */
    public function edit(Blog $blog): Response
    {
        $blog->load(['category', 'subcategory', 'author']);
        $categories = BlogCategory::whereNull('parent_id')
            ->with('subcategories')
            ->get();
        $authors = TeamMember::all();

        return Inertia::render('Admin/Blogs/Edit', [
            'blog' => $blog,
            'categories' => $categories,
            'authors' => $authors,
        ]);
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
            'cover_image' => ['required_without:cover_image_file', 'nullable', 'string'],
            'cover_image_file' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp,avif,gif', 'max:10240'],
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

        if ($request->hasFile('cover_image_file')) {
            $validated['cover_image'] = $this->optimizeAndStoreCoverImage($request->file('cover_image_file'));
        }
        unset($validated['cover_image_file']);

        $validated['slug'] = Str::slug($validated['slug']);

        if (empty($validated['canonical_url'])) {
            $validated['canonical_url'] = url('/blog/'.$validated['slug']);
        }
        if (empty($validated['og_image'])) {
            $validated['og_image'] = $validated['cover_image'] ?? $blog->cover_image;
        }

        if (is_string($validated['tags'] ?? null)) {
            $validated['tags'] = array_values(array_filter(array_map('trim', explode(',', $validated['tags']))));
        }

        if (($validated['status'] ?? 'published') === 'published' && ! $blog->published_at) {
            $validated['published_at'] = now();
        }

        $blog->update($validated);

        return redirect()->route('admin.blogs.index')->with('success', "Article [{$blog->title}] and SEO metadata updated.");
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
