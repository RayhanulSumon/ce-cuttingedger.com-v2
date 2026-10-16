<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    /**
     * Display blog journal archive.
     */
    public function index(Request $request): Response
    {
        $selectedCategory = $request->query('category');

        $query = Post::with(['category', 'author'])->latest('published_at');

        if ($selectedCategory && $selectedCategory !== 'all') {
            $query->whereHas('category', function ($q) use ($selectedCategory): void {
                $q->where('slug', $selectedCategory);
            });
        }

        $posts = $query->get();
        $categories = Category::where('type', 'blog')->get();

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'activeCategory' => $selectedCategory ?: 'all',
        ]);
    }

    /**
     * Display post detail with reading time and related posts.
     */
    public function show(Post $post): Response
    {
        $post->load(['category', 'author']);

        $relatedPosts = Post::with('category')
            ->where('id', '!=', $post->id)
            ->latest('published_at')
            ->take(2)
            ->get();

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }
}
