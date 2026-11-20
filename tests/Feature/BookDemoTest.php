<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BookDemoTest extends TestCase
{
    use RefreshDatabase;

    public function test_book_demo_page_renders_with_configured_calendly_url(): void
    {
        Setting::updateOrCreate(
            ['key' => 'calendly_url'],
            ['value' => 'https://calendly.com/cuttingedger/demo']
        );

        $response = $this->get('/book-a-demo');

        $response->assertStatus(200)
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('BookDemo')
                    ->where('settings.calendly_url', 'https://calendly.com/cuttingedger/demo')
            );
    }

    public function test_removed_internal_calendar_routes_return_404(): void
    {
        $role = Role::firstOrCreate(['name' => 'super_admin']);
        $admin = User::factory()->create([
            'role_id' => $role->id,
            'status' => 'active',
        ]);

        $this->get('/api/discovery-call/slots')->assertStatus(404);
        $this->assertContains($this->post('/api/discovery-call/book')->status(), [404, 405]);
        $this->actingAs($admin)->get('/admin/consultations')->assertStatus(404);
    }
}
