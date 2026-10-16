<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Inertia\Inertia;
use Inertia\Response;

class CareerController extends Controller
{
    /**
     * Display career index with active openings.
     */
    public function index(): Response
    {
        $openings = Job::where('is_open', true)->get();

        return Inertia::render('Careers/Index', [
            'openings' => $openings,
        ]);
    }

    /**
     * Display job vacancy detail.
     */
    public function show(Job $job): Response
    {
        return Inertia::render('Careers/Show', [
            'job' => $job,
        ]);
    }
}
