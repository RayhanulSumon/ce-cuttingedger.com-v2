<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminClientController extends Controller
{
    /**
     * Display a listing of clients.
     */
    public function index(): Response
    {
        $clients = Client::orderBy('sort_order', 'asc')->get();

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
        ]);
    }

    /**
     * Store a newly created client.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'logo_dark' => ['nullable', 'string'],
            'logo_light' => ['nullable', 'string'],
            'url' => ['nullable', 'url'],
            'marquee_row' => ['integer', 'in:1,2'],
            'sort_order' => ['integer'],
        ]);

        Client::create($validated);

        return redirect()->back()->with('success', 'Brand partner added.');
    }

    /**
     * Update the specified client.
     */
    public function update(Request $request, Client $client): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'logo_dark' => ['nullable', 'string'],
            'logo_light' => ['nullable', 'string'],
            'url' => ['nullable', 'url'],
            'marquee_row' => ['integer', 'in:1,2'],
            'sort_order' => ['integer'],
        ]);

        $client->update($validated);

        return redirect()->back()->with('success', "Brand partner [{$client->name}] updated.");
    }

    /**
     * Remove the specified client.
     */
    public function destroy(Client $client): RedirectResponse
    {
        $name = $client->name;
        $client->delete();

        return redirect()->back()->with('success', "Brand partner [{$name}] removed.");
    }
}
