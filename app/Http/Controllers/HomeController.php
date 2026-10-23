<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Project;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the agency flagship homepage.
     */
    public function index(Request $request): Response
    {
        $featuredProjects = Project::with('category')
            ->where('featured', true)
            ->orderBy('sort_order')
            ->take(4)
            ->get();

        // Pass 4 core service pillars to the homepage showcase
        $services = Service::whereNull('parent_id')
            ->orderBy('sort_order')
            ->take(4)
            ->get();

        $teamMembers = TeamMember::where('featured', true)
            ->orderBy('sort_order')
            ->take(5)
            ->get();

        $testimonials = Testimonial::where('featured', true)
            ->latest()
            ->take(6)
            ->get();

        $clients = Client::orderBy('sort_order')->get();

        return Inertia::render('Home', [
            'featuredProjects' => $featuredProjects,
            'services' => $services,
            'teamMembers' => $teamMembers,
            'testimonials' => $testimonials,
            'clients' => $clients,
        ]);
    }
}
