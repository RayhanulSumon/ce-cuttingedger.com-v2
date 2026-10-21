<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTestimonialController extends Controller
{
    /**
     * Display a listing of testimonials.
     */
    public function index(): Response
    {
        $testimonials = Testimonial::latest()->get();

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Store a newly created testimonial.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'client_role' => ['required', 'string', 'max:255'],
            'client_company' => ['required', 'string', 'max:255'],
            'quote' => ['required', 'string'],
            'rating' => ['integer', 'min:1', 'max:5'],
            'featured' => ['boolean'],
            'avatar' => ['nullable', 'string'],
        ]);

        Testimonial::create($validated);

        return redirect()->back()->with('success', 'Client endorsement recorded.');
    }

    /**
     * Update the specified testimonial.
     */
    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'client_role' => ['required', 'string', 'max:255'],
            'client_company' => ['required', 'string', 'max:255'],
            'quote' => ['required', 'string'],
            'rating' => ['integer', 'min:1', 'max:5'],
            'featured' => ['boolean'],
            'avatar' => ['nullable', 'string'],
        ]);

        $testimonial->update($validated);

        return redirect()->back()->with('success', 'Client endorsement updated.');
    }

    /**
     * Remove the specified testimonial.
     */
    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return redirect()->back()->with('success', 'Endorsement removed.');
    }
}
