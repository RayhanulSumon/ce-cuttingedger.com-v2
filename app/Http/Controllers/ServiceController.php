<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display all capabilities & disciplines.
     */
    public function index(): Response
    {
        $services = Service::orderBy('sort_order')->get();

        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }

    /**
     * Display individual service discipline detail.
     */
    public function show(Service $service): Response
    {
        $otherServices = Service::where('id', '!=', $service->id)->get();
        $relatedProjects = Project::where('featured', true)->take(2)->get();

        return Inertia::render('Services/Show', [
            'service' => $service,
            'otherServices' => $otherServices,
            'relatedProjects' => $relatedProjects,
        ]);
    }
}
