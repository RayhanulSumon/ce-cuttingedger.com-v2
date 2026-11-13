<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DigitalTwin;
use App\Models\DigitalTwinAttribute;
use App\Services\Media\ImageOptimizationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminDigitalTwinController extends Controller
{
    /**
     * Display the Digital Twins & Configurator Attributes admin manager.
     */
    public function index(): Response
    {
        $twins = DigitalTwin::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->values()
            ->map(fn (DigitalTwin $twin, int $idx) => $twin->toFrontendArray($idx));

        $attributes = DigitalTwinAttribute::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (DigitalTwinAttribute $attr) => $attr->toFrontendArray());

        return Inertia::render('Admin/DigitalTwins/Index', [
            'twins' => $twins,
            'attributes' => $attributes,
            'defaultPoses' => DigitalTwin::defaultPoses(),
        ]);
    }

    /**
     * Store a newly created Digital Twin model.
     */
    public function store(Request $request, ImageOptimizationService $optimizer): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'look_number' => ['required', 'integer', 'min:1'],
            'archetype' => ['required', 'string', 'max:255'],
            'collection' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'preset_price' => ['required', 'string', 'max:50'],
            'custom_order_price' => ['nullable', 'string', 'max:50'],
            'lifetime_price' => ['required', 'string', 'max:50'],
            'is_copyright_sold' => ['boolean'],
            'download_count' => ['nullable', 'integer', 'min:0'],
            'listed_at' => ['nullable', 'date'],
            'deliverables' => ['nullable', 'array'],
            'poses' => ['nullable', 'array'],
            'is_featured_on_home' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
            'model_image' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp'],
            'pose_images.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $imageMeta = [
            'runway_image' => null,
            'hi_res_image' => null,
            'aspect_ratio' => 0.36,
        ];

        if ($request->hasFile('model_image') && $request->file('model_image')->isValid()) {
            $imageMeta = $optimizer->storeTwinModelImage($request->file('model_image'));
        }

        $poses = ! empty($validated['poses']) ? $validated['poses'] : DigitalTwin::defaultPoses();
        if ($request->hasFile('pose_images')) {
            foreach ($request->file('pose_images') as $poseIdx => $poseFile) {
                if ($poseFile && $poseFile->isValid() && isset($poses[$poseIdx])) {
                    $poses[$poseIdx]['imageUrl'] = $optimizer->storeTwinPoseImage($poseFile);
                }
            }
        }

        $slug = Str::slug($validated['name']).'-'.Str::lower(Str::random(4));

        DigitalTwin::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'look_number' => $validated['look_number'],
            'archetype' => $validated['archetype'],
            'collection' => $validated['collection'] ?? null,
            'description' => $validated['description'],
            'runway_image' => $imageMeta['runway_image'],
            'hi_res_image' => $imageMeta['hi_res_image'],
            'aspect_ratio' => $imageMeta['aspect_ratio'],
            'preset_price' => $validated['preset_price'],
            'custom_order_price' => $validated['custom_order_price'] ?? '$290',
            'lifetime_price' => $validated['lifetime_price'],
            'is_copyright_sold' => $request->boolean('is_copyright_sold', false),
            'download_count' => (int) ($validated['download_count'] ?? 0),
            'listed_at' => $validated['listed_at'] ?? now()->format('Y-m-d'),
            'deliverables' => $validated['deliverables'] ?? [
                '6 Multi-Angle Pose Presets (8K PNG/TIFF)',
                'Layered PSD + Garment UV Smart Masks',
                'Commercial Global Campaign License',
            ],
            'poses' => $poses,
            'is_featured_on_home' => $request->boolean('is_featured_on_home', true),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return redirect()->back()->with('success', "Digital Twin [{$validated['name']}] created and cached.");
    }

    /**
     * Update an existing Digital Twin model.
     */
    public function update(Request $request, DigitalTwin $digitalTwin, ImageOptimizationService $optimizer): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'look_number' => ['required', 'integer', 'min:1'],
            'archetype' => ['required', 'string', 'max:255'],
            'collection' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'preset_price' => ['required', 'string', 'max:50'],
            'custom_order_price' => ['nullable', 'string', 'max:50'],
            'lifetime_price' => ['required', 'string', 'max:50'],
            'is_copyright_sold' => ['boolean'],
            'download_count' => ['nullable', 'integer', 'min:0'],
            'listed_at' => ['nullable', 'date'],
            'deliverables' => ['nullable', 'array'],
            'poses' => ['nullable', 'array'],
            'is_featured_on_home' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
            'model_image' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp'],
            'pose_images.*' => ['nullable', 'file', 'max:25600', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $updates = [
            'name' => $validated['name'],
            'look_number' => $validated['look_number'],
            'archetype' => $validated['archetype'],
            'collection' => $validated['collection'] ?? null,
            'description' => $validated['description'],
            'preset_price' => $validated['preset_price'],
            'custom_order_price' => $validated['custom_order_price'] ?? $digitalTwin->custom_order_price,
            'lifetime_price' => $validated['lifetime_price'],
            'is_copyright_sold' => $request->boolean('is_copyright_sold', false),
            'download_count' => (int) ($validated['download_count'] ?? $digitalTwin->download_count),
            'listed_at' => $validated['listed_at'] ?? ($digitalTwin->listed_at ? $digitalTwin->listed_at->format('Y-m-d') : now()->format('Y-m-d')),
            'deliverables' => $validated['deliverables'] ?? $digitalTwin->deliverables,
            'is_featured_on_home' => $request->boolean('is_featured_on_home', true),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => (int) ($validated['sort_order'] ?? $digitalTwin->sort_order),
        ];

        if ($request->hasFile('model_image') && $request->file('model_image')->isValid()) {
            $imageMeta = $optimizer->storeTwinModelImage($request->file('model_image'));
            $updates['runway_image'] = $imageMeta['runway_image'];
            $updates['hi_res_image'] = $imageMeta['hi_res_image'];
            $updates['aspect_ratio'] = $imageMeta['aspect_ratio'];
        }

        $poses = ! empty($validated['poses']) ? $validated['poses'] : ($digitalTwin->poses ?: DigitalTwin::defaultPoses());
        if ($request->hasFile('pose_images')) {
            foreach ($request->file('pose_images') as $poseIdx => $poseFile) {
                if ($poseFile && $poseFile->isValid() && isset($poses[$poseIdx])) {
                    $poses[$poseIdx]['imageUrl'] = $optimizer->storeTwinPoseImage($poseFile);
                }
            }
        }
        $updates['poses'] = $poses;

        $digitalTwin->update($updates);

        return redirect()->back()->with('success', "Digital Twin [{$digitalTwin->name}] updated and cache refreshed.");
    }

    /**
     * Quick toggle for Sold Out (is_copyright_sold) status.
     */
    public function toggleSoldOut(DigitalTwin $digitalTwin): RedirectResponse
    {
        $digitalTwin->update([
            'is_copyright_sold' => ! $digitalTwin->is_copyright_sold,
        ]);

        return redirect()->back()->with('success', "Sold-out status updated for [{$digitalTwin->name}].");
    }

    /**
     * Delete a Digital Twin model.
     */
    public function destroy(DigitalTwin $digitalTwin): RedirectResponse
    {
        $name = $digitalTwin->name;
        $digitalTwin->delete();

        return redirect()->back()->with('success', "Digital Twin [{$name}] removed.");
    }

    /**
     * Store a new customizer attribute (e.g. Height, Body Structure, Skin Tone, etc.).
     */
    public function storeAttribute(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'input_type' => ['required', 'in:unit_input,select,multi_input'],
            'options' => ['required', 'array', 'min:1'],
            'options.*' => ['required', 'string', 'max:120'],
            'allow_custom' => ['boolean'],
            'custom_label' => ['nullable', 'string', 'max:80'],
            'placeholder' => ['nullable', 'string', 'max:255'],
            'is_required' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $slug = Str::slug($validated['name'], '_');
        if (DigitalTwinAttribute::where('slug', $slug)->exists()) {
            $slug .= '_'.Str::lower(Str::random(3));
        }

        DigitalTwinAttribute::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'input_type' => $validated['input_type'],
            'options' => array_values($validated['options']),
            'allow_custom' => $request->boolean('allow_custom', false),
            'custom_label' => $validated['custom_label'] ?: 'Custom',
            'placeholder' => $validated['placeholder'] ?? null,
            'is_required' => $request->boolean('is_required', false),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return redirect()->back()->with('success', "Attribute [{$validated['name']}] added to Digital Twin Configurator.");
    }

    /**
     * Update an existing customizer attribute.
     */
    public function updateAttribute(Request $request, DigitalTwinAttribute $attribute): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'input_type' => ['required', 'in:unit_input,select,multi_input'],
            'options' => ['required', 'array', 'min:1'],
            'options.*' => ['required', 'string', 'max:120'],
            'allow_custom' => ['boolean'],
            'custom_label' => ['nullable', 'string', 'max:80'],
            'placeholder' => ['nullable', 'string', 'max:255'],
            'is_required' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $attribute->update([
            'name' => $validated['name'],
            'input_type' => $validated['input_type'],
            'options' => array_values($validated['options']),
            'allow_custom' => $request->boolean('allow_custom', false),
            'custom_label' => $validated['custom_label'] ?: 'Custom',
            'placeholder' => $validated['placeholder'] ?? null,
            'is_required' => $request->boolean('is_required', false),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => (int) ($validated['sort_order'] ?? $attribute->sort_order),
        ]);

        return redirect()->back()->with('success', "Attribute [{$attribute->name}] updated.");
    }

    /**
     * Delete a customizer attribute.
     */
    public function destroyAttribute(DigitalTwinAttribute $attribute): RedirectResponse
    {
        $name = $attribute->name;
        $attribute->delete();

        return redirect()->back()->with('success', "Attribute [{$name}] deleted.");
    }
}
