<?php

namespace Tests\Unit;

use App\Models\ChatConsultation;
use App\Models\Role;
use App\Models\User;
use App\Services\Notification\NotificationService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        NotificationService::fake();
    }

    protected function tearDown(): void
    {
        NotificationService::restore();
        parent::tearDown();
    }

    public function test_can_send_notification_to_all_admins(): void
    {
        $service = new NotificationService;

        $result = $service->toAllAdmins()->send('new_inquiry', [
            'title' => 'Test Inquiry',
            'message' => 'A new inquiry has arrived.',
        ]);

        $this->assertTrue($result);
        NotificationService::assertSentToAllAdmins('new_inquiry', function ($channels, $data) {
            return $data['title'] === 'Test Inquiry';
        });
    }

    public function test_can_send_notification_to_all_super_admins(): void
    {
        $service = new NotificationService;

        $result = $service->sendToAllSuperAdmins('security_alert', [
            'severity' => 'high',
        ]);

        $this->assertTrue($result);
        NotificationService::assertSentToAllSuperAdmins('security_alert', function ($channels, $data) {
            return $data['severity'] === 'high';
        });
    }

    public function test_can_send_notification_to_specific_admin(): void
    {
        $role = Role::create(['name' => 'admin']);
        $admin = User::factory()->create(['role_id' => $role->id]);

        $service = new NotificationService;
        $result = $service->toAdmin($admin)->send('assigned_task', [
            'task_id' => 123,
        ]);

        $this->assertTrue($result);
        NotificationService::assertSentToAdmin($admin, 'assigned_task', function ($channels, $data) {
            return $data['task_id'] === 123;
        });
    }

    public function test_can_trigger_consultation_booked_notification(): void
    {
        $consultation = ChatConsultation::create([
            'name' => 'Sara Connor',
            'email' => 'sara@cyber.org',
            'phone' => '+1555123456',
            'scheduled_at' => Carbon::now()->addDay(),
            'timezone' => 'America/New_York',
            'status' => 'confirmed',
        ]);

        $service = new NotificationService;
        $service->triggerConsultationBooked($consultation);

        NotificationService::assertSentToAllAdmins('consultation.booked', function ($channels, $data) use ($consultation) {
            return $data['client_email'] === 'sara@cyber.org' && $data['consultation_id'] === $consultation->id;
        });
    }

    public function test_can_trigger_lead_captured_notification(): void
    {
        $service = new NotificationService;
        $service->triggerLeadCaptured([
            'name' => 'John Wick',
            'email' => 'john@continental.com',
            'phone' => '+1555987654',
            'company' => 'Continental',
        ]);

        NotificationService::assertSentToAllAdmins('lead.captured', function ($channels, $data) {
            return $data['lead']['email'] === 'john@continental.com';
        });
    }
}
