<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Capability;
use App\Services\Media\ImageUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminCapabilityController extends Controller
{
    public function __construct(public ImageUploadService $imageUploadService) {}

    /**
     * Main capabilities with their sub-capabilities.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Capabilities/Index', [
            'capabilities' => Capability::main()
                ->with('children')
                ->orderBy('sort_order')
                ->get()
                ->map(fn (Capability $main) => $main->toPublicArray(includeChildren: true))
                ->values()
                ->all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);
        $validated['slug'] = $this->uniqueSlug($validated['slug'] ?? '', $validated['title']);

        Capability::create($validated);

        return redirect()->back()->with('success', "Capability [{$validated['title']}] created.");
    }

    public function update(Request $request, Capability $capability): RedirectResponse
    {
        $validated = $this->validated($request, $capability);
        $validated['slug'] = $this->uniqueSlug($validated['slug'] ?? '', $validated['title'], $capability);

        $capability->update($validated);

        return redirect()->back()->with('success', "Capability [{$capability->title}] updated.");
    }

    public function destroy(Capability $capability): RedirectResponse
    {
        $title = $capability->title;
        $this->deleteStoredImage($capability->image);
        $capability->delete();

        return redirect()->back()->with('success', "Capability [{$title}] removed.");
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Capability $capability = null): array
    {
        $validated = $request->validate([
            // Only a main capability can be a parent, and a capability cannot be its own parent.
            'parent_id' => [
                'nullable',
                Rule::exists('capabilities', 'id')->whereNull('parent_id'),
                Rule::notIn($capability ? [$capability->id] : []),
            ],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'tag' => ['nullable', 'string', 'max:20'],
            'subtitle' => ['required', 'string', 'max:255'],
            'icon' => ['required', 'string', 'max:50'],
            'image_file' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp,avif,gif', 'max:10240'],
            'remove_image' => ['nullable', 'boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        unset($validated['image_file'], $validated['remove_image']);

        if ($request->hasFile('image_file')) {
            $validated['image'] = $this->imageUploadService->uploadAsWebp(
                $request->file('image_file'),
                ImageUploadService::PATH_CAPABILITIES,
                1200,
                85,
                $capability?->image,
                $validated['title'],
            );
        } elseif ($request->boolean('remove_image') && $capability?->image) {
            $this->imageUploadService->delete($capability->image);
            $validated['image'] = null;
        }

        $validated['parent_id'] = ! empty($validated['parent_id']) ? $validated['parent_id'] : null;
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        return $validated;
    }

    private function deleteStoredImage(?string $url): void
    {
        $this->imageUploadService->delete($url);
    }

    private function uniqueSlug(string $requested, string $title, ?Capability $ignore = null): string
    {
        $base = Str::slug($requested !== '' ? $requested : $title) ?: 'capability';
        $slug = $base;
        $counter = 2;

        while (Capability::where('slug', $slug)->when($ignore, fn ($query) => $query->where('id', '!=', $ignore->id))->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
