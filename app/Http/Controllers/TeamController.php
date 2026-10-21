<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * Display all leadership and studio fellows.
     */
    public function index(): Response
    {
        $members = TeamMember::orderBy('sort_order')->get();

        return Inertia::render('Team/Index', [
            'members' => $members,
        ]);
    }

    /**
     * Display member profile detail.
     */
    public function show(TeamMember $member): Response
    {
        $member->load('blogs');

        return Inertia::render('Team/Show', [
            'member' => $member,
        ]);
    }
}
