<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    /**
     * Display blog journal archive with category/subcategory filtering.
     */
    public function index(Request $request): Response
    {
        $selectedCategory = $request->query('category');
        $selectedSubcategory = $request->query('subcategory');

        $query = Blog::with(['category', 'subcategory', 'author'])
            ->where('status', 'published')
            ->latest('published_at');

        if ($selectedCategory && $selectedCategory !== 'all') {
            $query->whereHas('category', function ($q) use ($selectedCategory): void {
                $q->where('slug', $selectedCategory);
            });
        }

        if ($selectedSubcategory && $selectedSubcategory !== 'all') {
            $query->whereHas('subcategory', function ($q) use ($selectedSubcategory): void {
                $q->where('slug', $selectedSubcategory);
            });
        }

        $blogs = $query->get();
        $categories = BlogCategory::whereNull('parent_id')
            ->with('subcategories')
            ->withCount('blogs')
            ->get();

        return Inertia::render('Blog/Index', [
            'blogs' => $blogs,
            'categories' => $categories,
            'activeCategory' => $selectedCategory ?: 'all',
            'activeSubcategory' => $selectedSubcategory ?: 'all',
        ]);
    }

    /**
     * Display blog detail with reading time, full SEO suite, and related blogs.
     */
    public function show(Blog $blog): Response
    {
        $blog->load(['category', 'subcategory', 'author']);

        $relatedBlogs = Blog::with(['category', 'subcategory', 'author'])
            ->where('id', '!=', $blog->id)
            ->where('status', 'published')
            ->orderByRaw('CASE WHEN blog_category_id = ? THEN 0 ELSE 1 END', [$blog->blog_category_id ?? 0])
            ->latest('published_at')
            ->take(5)
            ->get();

        return Inertia::render('Blog/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
        ]);
    }
}
