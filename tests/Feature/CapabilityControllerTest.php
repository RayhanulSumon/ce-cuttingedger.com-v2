<?php

namespace Tests\Feature;

use App\Models\Capability;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CapabilityControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_seeder_creates_four_main_capabilities_with_sub_capabilities(): void
    {
        $this->assertSame(['2d', '3d', 'dtp', 'video'], Capability::main()->orderBy('sort_order')->pluck('slug')->all());

        foreach (Capability::main()->get() as $main) {
            $this->assertGreaterThanOrEqual(4, $main->children()->count(), "{$main->slug} needs sub-capabilities");
        }
    }

    public function test_capabilities_have_no_price_columns(): void
    {
        foreach (Schema::getColumnListing('capabilities') as $column) {
            $this->assertStringNotContainsString('price', $column);
            $this->assertStringNotContainsString('rate', $column);
        }
    }

    public function test_index_lists_main_capabilities_with_their_children(): void
    {
        $this->get('/capabilities')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Capabilities/Index')
                ->has('capabilities', 4)
                ->has('capabilities.0.children')
            );
    }

    public function test_main_capability_page_renders(): void
    {
        $this->get('/capabilities/2d')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Capabilities/Show')
                ->where('capability.slug', '2d')
                ->has('capability.children')
                ->has('related')
            );
    }

    public function test_sub_capability_page_renders_under_its_parent(): void
    {
        $this->get('/capabilities/2d/ghost-mannequin')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Capabilities/Show')
                ->where('capability.slug', 'ghost-mannequin')
                ->where('capability.parent.slug', '2d')
            );
    }

    public function test_sub_capability_without_parent_redirects_to_canonical_url(): void
    {
        $this->get('/capabilities/ghost-mannequin')
            ->assertRedirect('/capabilities/2d/ghost-mannequin')
            ->assertStatus(301);
    }

    public function test_inactive_capability_is_hidden(): void
    {
        Capability::where('slug', 'video')->update(['is_active' => false]);

        $this->get('/capabilities/video')->assertStatus(404);
        $this->get('/capabilities')->assertInertia(fn (Assert $page) => $page->has('capabilities', 3));
    }

    public function test_shared_navigation_exposes_active_capabilities(): void
    {
        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('capabilities_nav', 4)
            ->where('capabilities_nav.0.tag', '2D')
            ->has('capabilities_nav.0.children')
        );
    }
}
