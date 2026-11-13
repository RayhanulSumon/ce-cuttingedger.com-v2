<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TryOnLook;
use App\Services\Media\ImageOptimizationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminTryOnLookController extends Controller
{
    /**
     * Display the Virtual Try-On Looks admin manager.
     */
    public function index(): Response
    {
        $looks = TryOnLook::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (TryOnLook $look) => $look->toFrontendArray());

        return Inertia::render('Admin/TryOnLooks/Index', [
            'looks' => $looks,
        ]);
    }

    /**
     * Store a newly created Virtual Try-On Look with auto-generated 640w & 1080w WebP images.
     */
    public function store(Request $request, ImageOptimizationService $optimizer): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'model_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'model_image' => ['required', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp'],
            'pieces' => ['required', 'array', 'min:1'],
            'pieces.*.name' => ['required', 'string', 'max:255'],
            'pieces.*.brand' => ['required', 'string', 'max:255'],
            'pieces.*.tag' => ['nullable', 'string', 'max:60'],
            'pieces.*.image' => ['nullable', 'string', 'max:1000'],
            'piece_images.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp'],
            'pins' => ['required', 'array', 'min:1'],
            'pins.*.left' => ['required', 'numeric', 'min:0', 'max:100'],
            'pins.*.top' => ['required', 'numeric', 'min:0', 'max:100'],
            'is_featured_on_home' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $modelImages = $optimizer->storeTryOnModelImage($request->file('model_image'));

        $pieces = $validated['pieces'];
        if ($request->hasFile('piece_images')) {
            foreach ($request->file('piece_images') as $idx => $pieceFile) {
                if ($pieceFile && $pieceFile->isValid() && isset($pieces[$idx])) {
                    $pieces[$idx]['image'] = $optimizer->storeTryOnPieceImage($pieceFile);
                }
            }
        }

        $pins = array_map(fn (array $pin) => [
            'left' => round((float) $pin['left'], 1),
            'top' => round((float) $pin['top'], 1),
        ], $validated['pins']);

        $slug = Str::slug($validated['name'].'-'.$validated['model_name']).'-'.Str::lower(Str::random(4));

        TryOnLook::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'model_name' => $validated['model_name'],
            'description' => $validated['description'] ?? null,
            'runway_image' => $modelImages['runway_image'],
            'hi_res_image' => $modelImages['hi_res_image'],
            'pieces' => array_values($pieces),
            'pins' => array_values($pins),
            'is_featured_on_home' => $request->boolean('is_featured_on_home', true),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return redirect()->back()->with('success', "Virtual Try-On Look [{$validated['name']}] created and cached.");
    }

    /**
     * Update an existing Virtual Try-On Look.
     */
    public function update(Request $request, TryOnLook $tryOnLook, ImageOptimizationService $optimizer): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'model_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'model_image' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp'],
            'pieces' => ['required', 'array', 'min:1'],
            'pieces.*.name' => ['required', 'string', 'max:255'],
            'pieces.*.brand' => ['required', 'string', 'max:255'],
            'pieces.*.tag' => ['nullable', 'string', 'max:60'],
            'pieces.*.image' => ['nullable', 'string', 'max:1000'],
            'piece_images.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp'],
            'pins' => ['required', 'array', 'min:1'],
            'pins.*.left' => ['required', 'numeric', 'min:0', 'max:100'],
            'pins.*.top' => ['required', 'numeric', 'min:0', 'max:100'],
            'is_featured_on_home' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $updates = [
            'name' => $validated['name'],
            'model_name' => $validated['model_name'],
            'description' => $validated['description'] ?? null,
            'is_featured_on_home' => $request->boolean('is_featured_on_home', true),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => (int) ($validated['sort_order'] ?? $tryOnLook->sort_order),
        ];

        if ($request->hasFile('model_image') && $request->file('model_image')->isValid()) {
            $modelImages = $optimizer->storeTryOnModelImage($request->file('model_image'));
            $updates['runway_image'] = $modelImages['runway_image'];
            $updates['hi_res_image'] = $modelImages['hi_res_image'];
        }

        $pieces = $validated['pieces'];
        if ($request->hasFile('piece_images')) {
            foreach ($request->file('piece_images') as $idx => $pieceFile) {
                if ($pieceFile && $pieceFile->isValid() && isset($pieces[$idx])) {
                    $pieces[$idx]['image'] = $optimizer->storeTryOnPieceImage($pieceFile);
                }
            }
        }
        $updates['pieces'] = array_values($pieces);

        $updates['pins'] = array_values(array_map(fn (array $pin) => [
            'left' => round((float) $pin['left'], 1),
            'top' => round((float) $pin['top'], 1),
        ], $validated['pins']));

        $tryOnLook->update($updates);

        return redirect()->back()->with('success', "Virtual Try-On Look [{$tryOnLook->name}] updated and cache refreshed.");
    }

    /**
     * Delete a Virtual Try-On Look.
     */
    public function destroy(TryOnLook $tryOnLook): RedirectResponse
    {
        $name = $tryOnLook->name;
        $tryOnLook->delete();

        return redirect()->back()->with('success', "Virtual Try-On Look [{$name}] deleted.");
    }
}
