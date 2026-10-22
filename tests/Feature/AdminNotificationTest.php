<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class AdminNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::create(['name' => 'admin']);
        $this->admin = User::factory()->create([
            'role_id' => $role->id,
            'status' => 'active',
        ]);
    }

    public function test_admin_can_fetch_notifications(): void
    {
        DB::table('notifications')->insert([
            'id' => (string) Str::uuid(),
            'type' => 'consultation.booked',
            'notifiable_type' => User::class,
            'notifiable_id' => $this->admin->id,
            'data' => json_encode([
                'title' => 'Test Booking',
                'message' => 'Client booked consultation',
                'admin_url' => '/admin/consultations',
            ]),
            'read_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->getJson('/admin/notifications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'notifications' => [
                    '*' => ['id', 'type', 'title', 'message', 'url', 'is_read'],
                ],
                'unread_count',
            ]);

        $this->assertEquals(1, $response->json('unread_count'));
    }

    public function test_admin_can_mark_notification_as_read(): void
    {
        $id = (string) Str::uuid();
        DB::table('notifications')->insert([
            'id' => $id,
            'type' => 'lead.captured',
            'notifiable_type' => User::class,
            'notifiable_id' => $this->admin->id,
            'data' => json_encode([
                'title' => 'New Lead',
                'message' => 'Visitor left contact email',
            ]),
            'read_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->postJson("/admin/notifications/{$id}/read");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertNotNull(DB::table('notifications')->where('id', $id)->value('read_at'));
    }

    public function test_admin_can_mark_all_notifications_as_read(): void
    {
        for ($i = 0; $i < 3; $i++) {
            DB::table('notifications')->insert([
                'id' => (string) Str::uuid(),
                'type' => 'chat.message',
                'notifiable_type' => User::class,
                'notifiable_id' => $this->admin->id,
                'data' => json_encode(['title' => "Alert {$i}"]),
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $response = $this->actingAs($this->admin)->postJson('/admin/notifications/mark-all-read');

        $response->assertStatus(200);
        $this->assertEquals(0, $this->admin->unreadNotifications()->count());
    }

    public function test_admin_can_delete_notification(): void
    {
        $id = (string) Str::uuid();
        DB::table('notifications')->insert([
            'id' => $id,
            'type' => 'lead.captured',
            'notifiable_type' => User::class,
            'notifiable_id' => $this->admin->id,
            'data' => json_encode(['title' => 'Delete Me']),
            'read_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/admin/notifications/{$id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('notifications', ['id' => $id]);
    }
}
