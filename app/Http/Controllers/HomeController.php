<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Project;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the full-screen, section-by-section homepage.
     */
    public function index(Request $request): Response
    {
        $featuredProjects = Project::with('category')
            ->where('featured', true)
            ->orderBy('sort_order')
            ->take(4)
            ->get();

        $clients = Client::orderBy('sort_order')->get();

        $testimonials = Testimonial::orderByDesc('featured')->latest()->take(8)->get();

        return Inertia::render('Home', [
            'featuredProjects' => $featuredProjects,
            'clients' => $clients,
            'testimonials' => $testimonials,
        ]);
    }
}
