<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    /**
     * Display portfolio archive with category filter.
     */
    public function index(Request $request): Response
    {
        $selectedCategory = $request->query('category');

        $query = Project::with('category')->orderBy('sort_order');

        if ($selectedCategory && $selectedCategory !== 'all') {
            $query->whereHas('category', function ($q) use ($selectedCategory): void {
                $q->where('slug', $selectedCategory);
            });
        }

        $projects = $query->get();
        $categories = Category::where('type', 'work')->get();

        return Inertia::render('Work/Index', [
            'projects' => $projects,
            'categories' => $categories,
            'activeCategory' => $selectedCategory ?: 'all',
        ]);
    }

    /**
     * Display comprehensive case study detail.
     */
    public function show(Project $project): Response
    {
        $project->load('category');

        $relatedProjects = Project::with('category')
            ->where('id', '!=', $project->id)
            ->where('category_id', $project->category_id)
            ->take(2)
            ->get();

        if ($relatedProjects->isEmpty()) {
            $relatedProjects = Project::with('category')
                ->where('id', '!=', $project->id)
                ->take(2)
                ->get();
        }

        return Inertia::render('Work/Show', [
            'project' => $project,
            'relatedProjects' => $relatedProjects,
        ]);
    }
}
