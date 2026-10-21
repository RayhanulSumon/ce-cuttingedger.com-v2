<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminPostController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(): Response
    {
        $posts = Post::with(['category', 'author'])->latest()->get();
        $categories = Category::where('type', 'blog')->get();
        $authors = TeamMember::all();

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'authors' => $authors,
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'author_id' => ['nullable', 'exists:team_members,id'],
            'excerpt' => ['required', 'string'],
            'body' => ['required', 'string'],
            'cover_image' => ['required', 'string'],
            'reading_time' => ['integer'],
        ]);

        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(3);
        $validated['published_at'] = now();

        Post::create($validated);

        return redirect()->back()->with('success', 'Article published to dispatch.');
    }

    /**
     * Update the specified post.
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'author_id' => ['nullable', 'exists:team_members,id'],
            'excerpt' => ['required', 'string'],
            'body' => ['required', 'string'],
            'cover_image' => ['required', 'string'],
            'reading_time' => ['integer'],
        ]);

        $post->update($validated);

        return redirect()->back()->with('success', "Article [{$post->title}] updated.");
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $title = $post->title;
        $post->delete();

        return redirect()->back()->with('success', "Article [{$title}] purged.");
    }
}
