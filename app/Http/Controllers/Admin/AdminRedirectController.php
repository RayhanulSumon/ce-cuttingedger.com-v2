<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotFoundLog;
use App\Models\Redirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminRedirectController extends Controller
{
    /**
     * Display redirects and 404 monitoring logs.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $redirectsQuery = Redirect::query()->orderBy('created_at', 'desc');

        if ($search) {
            $redirectsQuery->where(function ($q) use ($search) {
                $q->where('source_path', 'like', "%{$search}%")
                    ->orWhere('target_url', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        $redirects = $redirectsQuery->paginate(20)->withQueryString();

        $notFoundLogs = NotFoundLog::orderBy('hit_count', 'desc')
            ->orderBy('last_seen_at', 'desc')
            ->take(30)
            ->get();

        $totalRedirects = Redirect::count();
        $totalHits = Redirect::sum('hit_count');
        $total404s = NotFoundLog::count();

        return Inertia::render('Admin/Redirects/Index', [
            'redirects' => $redirects,
            'notFoundLogs' => $notFoundLogs,
            'filters' => [
                'search' => $search,
            ],
            'stats' => [
                'total_redirects' => $totalRedirects,
                'total_hits' => $totalHits,
                'total_404s' => $total404s,
            ],
        ]);
    }

    /**
     * Store a new redirect rule.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'source_path' => ['required', 'string', 'max:500'],
            'target_url' => ['required', 'string', 'max:500'],
            'status_code' => ['required', 'integer', 'in:301,302,404,410,403'],
            'is_regex' => ['boolean'],
            'is_active' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $sourcePath = $validated['is_regex'] ?? false
            ? trim($validated['source_path'])
            : Redirect::normalizePath($validated['source_path']);

        // Check if duplicate
        if (Redirect::where('source_path', $sourcePath)->exists()) {
            return redirect()->back()->withErrors(['source_path' => 'A redirect rule for this source path already exists.']);
        }

        Redirect::create([
            'source_path' => $sourcePath,
            'target_url' => trim($validated['target_url']),
            'status_code' => (int) $validated['status_code'],
            'is_regex' => $request->boolean('is_regex', false),
            'is_active' => $request->boolean('is_active', true),
            'notes' => $validated['notes'] ?? null,
        ]);

        // If this matches an existing 404 log, remove or link it
        NotFoundLog::where('path', $sourcePath)->delete();

        return redirect()->back()->with('success', "Redirect for '{$sourcePath}' created successfully.");
    }

    /**
     * Update an existing redirect rule.
     */
    public function update(Request $request, Redirect $redirect): RedirectResponse
    {
        $validated = $request->validate([
            'source_path' => ['required', 'string', 'max:500'],
            'target_url' => ['required', 'string', 'max:500'],
            'status_code' => ['required', 'integer', 'in:301,302,404,410,403'],
            'is_regex' => ['boolean'],
            'is_active' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $sourcePath = $validated['is_regex'] ?? false
            ? trim($validated['source_path'])
            : Redirect::normalizePath($validated['source_path']);

        $redirect->update([
            'source_path' => $sourcePath,
            'target_url' => trim($validated['target_url']),
            'status_code' => (int) $validated['status_code'],
            'is_regex' => $request->boolean('is_regex', false),
            'is_active' => $request->boolean('is_active', true),
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Redirect rule updated successfully.');
    }

    /**
     * Toggle active state.
     */
    public function toggle(Redirect $redirect): RedirectResponse
    {
        $redirect->update(['is_active' => ! $redirect->is_active]);

        $status = $redirect->is_active ? 'enabled' : 'disabled';

        return redirect()->back()->with('success', "Redirect has been {$status}.");
    }

    /**
     * Remove a redirect rule.
     */
    public function destroy(Redirect $redirect): RedirectResponse
    {
        $redirect->delete();

        return redirect()->back()->with('success', 'Redirect rule deleted.');
    }

    /**
     * Create a redirect directly from a logged 404 URL.
     */
    public function resolve404(Request $request, NotFoundLog $notFoundLog): RedirectResponse
    {
        $validated = $request->validate([
            'target_url' => ['required', 'string', 'max:500'],
            'status_code' => ['required', 'integer', 'in:301,302,410'],
        ]);

        $sourcePath = Redirect::normalizePath($notFoundLog->path);

        $redirect = Redirect::create([
            'source_path' => $sourcePath,
            'target_url' => trim($validated['target_url']),
            'status_code' => (int) $validated['status_code'],
            'is_regex' => false,
            'is_active' => true,
            'notes' => "Resolved from 404 log ({$notFoundLog->hit_count} hits)",
        ]);

        $notFoundLog->delete();

        return redirect()->back()->with('success', "404 for '{$sourcePath}' resolved with a {$redirect->status_code} redirect.");
    }

    /**
     * Clear all recorded 404 logs.
     */
    public function clear404Logs(): RedirectResponse
    {
        NotFoundLog::truncate();

        return redirect()->back()->with('success', 'All 404 error logs cleared.');
    }

    /**
     * Bulk CSV Export of all redirects.
     */
    public function exportCsv(): StreamedResponse
    {
        $fileName = 'cuttingedger-redirects-'.date('Y-m-d').'.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Source Path', 'Target URL', 'Status Code', 'Hits', 'Active', 'Notes']);

            Redirect::chunk(200, function ($redirects) use ($handle) {
                foreach ($redirects as $r) {
                    fputcsv($handle, [
                        $r->source_path,
                        $r->target_url,
                        $r->status_code,
                        $r->hit_count,
                        $r->is_active ? '1' : '0',
                        $r->notes,
                    ]);
                }
            });

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv',
        ]);
    }

    /**
     * Bulk CSV Import of redirects.
     */
    public function importCsv(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        $header = fgetcsv($handle);

        $imported = 0;
        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) >= 2) {
                $source = Redirect::normalizePath($row[0]);
                $target = trim($row[1]);
                $code = isset($row[2]) ? (int) $row[2] : 301;
                $notes = $row[5] ?? 'Imported via CSV';

                if (! empty($source) && ! empty($target)) {
                    Redirect::updateOrCreate(
                        ['source_path' => $source],
                        [
                            'target_url' => $target,
                            'status_code' => in_array($code, [301, 302, 404, 410, 403]) ? $code : 301,
                            'is_active' => true,
                            'notes' => $notes,
                        ]
                    );
                    $imported++;
                }
            }
        }
        fclose($handle);

        return redirect()->back()->with('success', "Imported {$imported} redirects from CSV.");
    }
}
