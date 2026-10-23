<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request): Response
    {
        $projects = Project::with('category')
            ->orderBy('sort_order', 'asc')
            ->latest()
            ->get();

        $categories = Category::where('type', 'work')->get();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'client_name' => ['required', 'string', 'max:255'],
            'year' => ['required', 'string', 'max:10'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'summary' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['required', 'string'],
            'featured' => ['boolean'],
            'is_concept' => ['boolean'],
            'sort_order' => ['integer'],
            'live_url' => ['nullable', 'url'],
            'h1_title' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'string', 'max:500'],
            'is_noindex' => ['boolean'],
            'og_image' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(4);
        $validated['is_concept'] = $request->boolean('is_concept', false);
        $validated['is_noindex'] = $request->boolean('is_noindex', false);

        Project::create($validated);

        return redirect()->back()->with('success', 'Project commissioned successfully.');
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'client_name' => ['required', 'string', 'max:255'],
            'year' => ['required', 'string', 'max:10'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'summary' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['required', 'string'],
            'featured' => ['boolean'],
            'is_concept' => ['boolean'],
            'sort_order' => ['integer'],
            'live_url' => ['nullable', 'url'],
            'h1_title' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'string', 'max:500'],
            'is_noindex' => ['boolean'],
            'og_image' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['is_concept'] = $request->boolean('is_concept', false);
        $validated['is_noindex'] = $request->boolean('is_noindex', false);

        $project->update($validated);

        return redirect()->back()->with('success', "Project [{$project->title}] updated successfully.");
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $title = $project->title;
        $project->delete();

        return redirect()->back()->with('success', "Project [{$title}] archived successfully.");
    }
}
