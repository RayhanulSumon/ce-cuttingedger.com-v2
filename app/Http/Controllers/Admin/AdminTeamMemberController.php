<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminTeamMemberController extends Controller
{
    /**
     * Display a listing of team members.
     */
    public function index(): Response
    {
        $team = TeamMember::orderBy('sort_order', 'asc')->get();

        return Inertia::render('Admin/Team/Index', [
            'team' => $team,
        ]);
    }

    /**
     * Store a newly created team member.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'bio' => ['required', 'string'],
            'avatar' => ['required', 'string'],
            'since_year' => ['integer'],
            'featured' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $validated['slug'] = Str::slug($validated['name']).'-'.Str::random(3);

        TeamMember::create($validated);

        return redirect()->back()->with('success', 'Operative commissioned to crew.');
    }

    /**
     * Update the specified team member.
     */
    public function update(Request $request, TeamMember $team): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'bio' => ['required', 'string'],
            'avatar' => ['required', 'string'],
            'since_year' => ['integer'],
            'featured' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $team->update($validated);

        return redirect()->back()->with('success', "Team member [{$team->name}] updated.");
    }

    /**
     * Remove the specified team member.
     */
    public function destroy(TeamMember $team): RedirectResponse
    {
        $name = $team->name;
        $team->delete();

        return redirect()->back()->with('success', "Team member [{$name}] removed from roster.");
    }
}
