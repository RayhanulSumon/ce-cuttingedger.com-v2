<?php

namespace Tests\Feature;

use App\Models\Capability;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminCapabilityTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->admin = User::factory()->create(['role_id' => Role::where('name', 'admin')->first()->id]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Product Cleanup',
            'subtitle' => 'Tidy product images.',
            'description' => 'We clean up product images.',
            'icon' => 'Layers',
            'features' => ['Dust removal'],
            'deliverables' => ['PNG'],
            'process_steps' => [['title' => 'Brief', 'description' => 'Send files.']],
            'faqs' => [['question' => 'How long?', 'answer' => 'A day.']],
            'is_active' => true,
            'sort_order' => 9,
        ], $overrides);
    }

    public function test_guests_cannot_manage_capabilities(): void
    {
        $this->get('/admin/capabilities')->assertRedirect();
        $this->post('/admin/capabilities', $this->payload())->assertRedirect();
        $this->assertDatabaseMissing('capabilities', ['title' => 'Product Cleanup']);
    }

    public function test_admin_sees_main_capabilities_with_children(): void
    {
        $this->actingAs($this->admin)->get('/admin/capabilities')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Capabilities/Index')
                ->has('capabilities', 4)
                ->has('capabilities.0.children')
            );
    }

    public function test_admin_creates_a_sub_capability_under_a_main_one(): void
    {
        $main = Capability::where('slug', '2d')->firstOrFail();

        $this->actingAs($this->admin)
            ->post('/admin/capabilities', $this->payload(['parent_id' => $main->id]))
            ->assertRedirect();

        $created = Capability::where('slug', 'product-cleanup')->firstOrFail();
        $this->assertSame($main->id, $created->parent_id);
        $this->assertSame('/capabilities/2d/product-cleanup', $created->path);
    }

    public function test_slug_is_made_unique(): void
    {
        $this->actingAs($this->admin)->post('/admin/capabilities', $this->payload());
        $this->actingAs($this->admin)->post('/admin/capabilities', $this->payload());

        $this->assertSame(['product-cleanup', 'product-cleanup-2'], Capability::where('slug', 'like', 'product-cleanup%')->orderBy('id')->pluck('slug')->all());
    }

    public function test_a_sub_capability_cannot_be_used_as_a_parent(): void
    {
        $child = Capability::where('slug', 'ghost-mannequin')->firstOrFail();

        $this->actingAs($this->admin)
            ->post('/admin/capabilities', $this->payload(['parent_id' => $child->id]))
            ->assertSessionHasErrors('parent_id');
    }

    public function test_admin_updates_and_hides_a_capability(): void
    {
        $capability = Capability::where('slug', 'video')->firstOrFail();

        $this->actingAs($this->admin)
            ->put("/admin/capabilities/{$capability->id}", $this->payload(['title' => 'Video & Motion', 'slug' => 'video', 'is_active' => false]))
            ->assertRedirect();

        $this->assertFalse($capability->fresh()->is_active);
        $this->get('/capabilities/video')->assertNotFound();
    }

    public function test_deleting_a_main_capability_removes_its_sub_capabilities(): void
    {
        $main = Capability::where('slug', 'dtp')->firstOrFail();
        $childCount = $main->children()->count();
        $this->assertGreaterThan(0, $childCount);

        $this->actingAs($this->admin)->delete("/admin/capabilities/{$main->id}")->assertRedirect();

        $this->assertDatabaseMissing('capabilities', ['slug' => 'dtp']);
        $this->assertDatabaseMissing('capabilities', ['slug' => 'catalog-layout']);
        $this->assertDatabaseHas('redirects', ['source_path' => '/capabilities/dtp', 'target_url' => '/capabilities']);
    }
}
