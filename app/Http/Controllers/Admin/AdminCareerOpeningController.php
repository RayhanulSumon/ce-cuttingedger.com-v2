<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerOpening;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminCareerOpeningController extends Controller
{
    /**
     * Display a listing of career openings.
     */
    public function index(): Response
    {
        $careers = CareerOpening::latest()->get();

        return Inertia::render('Admin/Careers/Index', [
            'careers' => $careers,
        ]);
    }

    /**
     * Store a newly created opening.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:255'],
            'location_type' => ['required', 'string', 'max:50'],
            'experience_level' => ['required', 'string', 'max:50'],
            'overview' => ['required', 'string'],
            'is_open' => ['boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(3);

        CareerOpening::create($validated);

        return redirect()->back()->with('success', 'Career opening opened.');
    }

    /**
     * Update the specified opening.
     */
    public function update(Request $request, CareerOpening $career): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:255'],
            'location_type' => ['required', 'string', 'max:50'],
            'experience_level' => ['required', 'string', 'max:50'],
            'overview' => ['required', 'string'],
            'is_open' => ['boolean'],
        ]);

        $career->update($validated);

        return redirect()->back()->with('success', "Career role [{$career->title}] updated.");
    }

    /**
     * Remove the specified career opening.
     */
    public function destroy(CareerOpening $career): RedirectResponse
    {
        $title = $career->title;
        $career->delete();

        return redirect()->back()->with('success', "Role [{$title}] closed.");
    }
}
