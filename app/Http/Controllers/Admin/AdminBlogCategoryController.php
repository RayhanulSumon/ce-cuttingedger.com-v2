<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminBlogCategoryController extends Controller
{
    /**
     * Display a listing of blog categories and subcategories.
     */
    public function index(): Response
    {
        $categories = BlogCategory::with(['parent', 'subcategories'])
            ->withCount('blogs')
            ->latest()
            ->get();

        $parentCategories = BlogCategory::whereNull('parent_id')->get();

        return Inertia::render('Admin/BlogCategories/Index', [
            'categories' => $categories,
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * Store a newly created blog category or subcategory.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blog_categories,slug'],
            'parent_id' => ['nullable', 'exists:blog_categories,id'],
            'description' => ['nullable', 'string'],
        ]);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['name']);
            $validated['slug'] = $baseSlug;
            $count = 1;
            while (BlogCategory::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = "{$baseSlug}-{$count}";
                $count++;
            }
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        BlogCategory::create($validated);

        return redirect()->back()->with('success', 'Blog category taxonomy node created successfully.');
    }

    /**
     * Update the specified blog category.
     */
    public function update(Request $request, BlogCategory $blogCategory): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:blog_categories,slug,'.$blogCategory->id],
            'parent_id' => ['nullable', 'exists:blog_categories,id', 'different:id'],
            'description' => ['nullable', 'string'],
        ]);

        $validated['slug'] = Str::slug($validated['slug']);

        $blogCategory->update($validated);

        return redirect()->back()->with('success', "Blog category [{$blogCategory->name}] updated.");
    }

    /**
     * Remove the specified blog category.
     */
    public function destroy(BlogCategory $blogCategory): RedirectResponse
    {
        $name = $blogCategory->name;
        $blogCategory->delete();

        return redirect()->back()->with('success', "Blog category [{$name}] purged.");
    }
}
