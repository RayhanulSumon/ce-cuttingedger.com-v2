<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TryOnLook;
use App\Rules\StudioImageDimensions;
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
        $validated = $request->validate(
            $this->validationRules(true),
            $this->validationMessages(),
        );

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

        $slug = Str::slug($validated['model_name']).'-'.Str::lower(Str::random(4));

        TryOnLook::create([
            'slug' => $slug,
            'model_name' => $validated['model_name'],
            'runway_image' => $modelImages['runway_image'],
            'hi_res_image' => $modelImages['hi_res_image'],
            'pieces' => array_values($pieces),
            'pins' => array_values($pins),
            'is_featured_on_home' => $request->boolean('is_featured_on_home', true),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return redirect()->back()->with('success', "Virtual Try-On Look [{$validated['model_name']}] created and cached.");
    }

    /**
     * Update an existing Virtual Try-On Look.
     */
    public function update(Request $request, TryOnLook $tryOnLook, ImageOptimizationService $optimizer): RedirectResponse
    {
        $validated = $request->validate(
            $this->validationRules(false),
            $this->validationMessages(),
        );

        $updates = [
            'model_name' => $validated['model_name'],
            'is_featured_on_home' => $request->boolean('is_featured_on_home', true),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => (int) ($validated['sort_order'] ?? $tryOnLook->sort_order),
        ];

        if ($request->hasFile('model_image') && $request->file('model_image')->isValid()) {
            $modelImages = $optimizer->storeTryOnModelImage(
                $request->file('model_image'),
                $tryOnLook->runway_image,
                $tryOnLook->hi_res_image,
            );
            $updates['runway_image'] = $modelImages['runway_image'];
            $updates['hi_res_image'] = $modelImages['hi_res_image'];
        }

        $pieces = $validated['pieces'];
        if ($request->hasFile('piece_images')) {
            foreach ($request->file('piece_images') as $idx => $pieceFile) {
                if ($pieceFile && $pieceFile->isValid() && isset($pieces[$idx])) {
                    $oldPieceUrl = $pieces[$idx]['image'] ?? null;
                    $pieces[$idx]['image'] = $optimizer->storeTryOnPieceImage($pieceFile, $oldPieceUrl);
                }
            }
        }
        $updates['pieces'] = array_values($pieces);

        $updates['pins'] = array_values(array_map(fn (array $pin) => [
            'left' => round((float) $pin['left'], 1),
            'top' => round((float) $pin['top'], 1),
        ], $validated['pins']));

        $tryOnLook->update($updates);

        return redirect()->back()->with('success', "Virtual Try-On Look [{$tryOnLook->model_name}] updated and cache refreshed.");
    }

    /**
     * Delete a Virtual Try-On Look.
     */
    public function destroy(TryOnLook $tryOnLook, ImageOptimizationService $optimizer): RedirectResponse
    {
        $name = $tryOnLook->model_name;
        $pieceUrls = array_map(fn ($piece) => $piece['image'] ?? null, $tryOnLook->pieces ?? []);
        $optimizer->imageUploadService->deleteMany([
            $tryOnLook->runway_image,
            $tryOnLook->hi_res_image,
            ...$pieceUrls,
        ]);
        $tryOnLook->delete();

        return redirect()->back()->with('success', "Virtual Try-On Look [{$name}] deleted.");
    }

    /**
     * Shared validation rules enforcing transparent studio PNG/WebP format and aspect ratios.
     *
     * @return array<string, mixed>
     */
    private function validationRules(bool $isCreate): array
    {
        return [
            'model_name' => ['required', 'string', 'max:255'],
            'model_image' => [
                $isCreate ? 'required' : 'nullable',
                'file',
                'max:25600',
                'mimes:png,webp',
                new StudioImageDimensions(
                    minWidth: 540,
                    minHeight: 960,
                    minRatio: 0.50,
                    maxRatio: 0.63,
                    ratioLabel: '9:16 portrait',
                    recommendedSize: '1080×1920',
                ),
            ],
            'pieces' => ['required', 'array', 'min:1'],
            'pieces.*.name' => ['required', 'string', 'max:255'],
            'pieces.*.brand' => ['required', 'string', 'max:255'],
            'pieces.*.tag' => ['nullable', 'string', 'max:60'],
            'pieces.*.image' => ['nullable', 'string', 'max:1000'],
            'piece_images.*' => [
                'nullable',
                'file',
                'max:25600',
                'mimes:png,webp',
                new StudioImageDimensions(
                    minWidth: 400,
                    minHeight: 400,
                    minRatio: 0.65,
                    maxRatio: 1.15,
                    ratioLabel: '1:1 or 3:4',
                    recommendedSize: '800×800',
                ),
            ],
            'pins' => ['required', 'array', 'min:1'],
            'pins.*.left' => ['required', 'numeric', 'min:0', 'max:100'],
            'pins.*.top' => ['required', 'numeric', 'min:0', 'max:100'],
            'is_featured_on_home' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ];
    }

    /**
     * Explicit validation messages for unsupported formats.
     *
     * @return array<string, string>
     */
    private function validationMessages(): array
    {
        return [
            'model_image.mimes' => 'PNG or WebP only (transparent background).',
            'piece_images.*.mimes' => 'PNG or WebP only (transparent background).',
        ];
    }
}
