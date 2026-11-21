<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Logs\LaravelLogReader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminSystemLogController extends Controller
{
    public function __construct(private LaravelLogReader $logReader) {}

    /**
     * Display parsed Laravel log entries with level filtering and search.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'file' => ['nullable', 'string', 'max:255'],
            'level' => ['nullable', 'string', Rule::in(LaravelLogReader::LEVELS)],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $files = $this->logReader->files();
        $path = $this->logReader->resolvePath($validated['file'] ?? null);
        $level = $validated['level'] ?? null;
        $search = $validated['search'] ?? null;

        $entries = collect();
        $truncated = false;

        if ($path !== null) {
            $result = $this->logReader->read($path);
            $entries = collect($result['entries']);
            $truncated = $result['truncated'];
        }

        $levelCounts = collect(LaravelLogReader::LEVELS)
            ->mapWithKeys(fn (string $name): array => [$name => $entries->where('level', $name)->count()])
            ->all();

        $filtered = $entries
            ->when($level, fn ($items) => $items->where('level', $level))
            ->when($search, fn ($items) => $items->filter(
                fn (array $entry): bool => str_contains(mb_strtolower($entry['details']), mb_strtolower($search))
            ))
            ->values();

        $perPage = 25;
        $page = LengthAwarePaginator::resolveCurrentPage();

        $paginated = new LengthAwarePaginator(
            $filtered->forPage($page, $perPage)->values(),
            $filtered->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return Inertia::render('Admin/SystemLogs/Index', [
            'files' => $files,
            'currentFile' => $path !== null ? basename($path) : null,
            'entries' => $paginated,
            'levelCounts' => $levelCounts,
            'totalEntries' => $entries->count(),
            'truncated' => $truncated,
            'filters' => [
                'level' => $level,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Download the raw log file.
     */
    public function download(Request $request): BinaryFileResponse
    {
        $path = $this->logReader->resolvePath($request->query('file'));

        abort_if($path === null, 404);

        return response()->download($path);
    }

    /**
     * Empty the selected log file.
     */
    public function clear(Request $request): RedirectResponse
    {
        $path = $this->logReader->resolvePath($request->input('file'));

        abort_if($path === null, 404);

        $this->logReader->clear($path);

        return redirect()->route('admin.system-logs.index', ['file' => basename($path)])
            ->with('success', basename($path).' cleared.');
    }
}
