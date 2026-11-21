<?php

namespace Tests\Feature;

use App\Mail\ContactInquiryAdminNotificationMail;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AdminNotificationEmailSettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_super_admin_saves_normalized_notification_recipients(): void
    {
        $this->actingAs($this->superAdmin())
            ->post(route('admin.settings.update'), [
                'settings' => [
                    'brand_name' => 'Cutting Edger Studio',
                    'admin_notification_emails' => "Sales@Example.com, ops@example.com\nsales@example.com",
                ],
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame("sales@example.com\nops@example.com", Setting::where('key', 'admin_notification_emails')->value('value'));
        $this->assertSame('Cutting Edger Studio', Setting::where('key', 'brand_name')->value('value'));
    }

    public function test_invalid_notification_emails_are_rejected(): void
    {
        $this->actingAs($this->superAdmin())
            ->post(route('admin.settings.update'), [
                'settings' => ['admin_notification_emails' => "ops@example.com\nnot-an-email"],
            ])
            ->assertSessionHasErrors('settings.admin_notification_emails');

        $this->assertDatabaseMissing('settings', ['key' => 'admin_notification_emails']);
    }

    public function test_contact_form_notifies_only_configured_recipients(): void
    {
        Mail::fake();
        Setting::updateOrCreate(['key' => 'admin_notification_emails'], ['value' => "sales@example.com\nops@example.com"]);

        $this->post('/contact', [
            'name' => 'Aria Thorne',
            'email' => 'aria@hyperion-audio.com',
            'message' => 'Need 3D WebGL product configurator.',
        ])->assertSessionHas('success');

        Mail::assertQueued(ContactInquiryAdminNotificationMail::class, function (ContactInquiryAdminNotificationMail $mail): bool {
            return $mail->hasTo('sales@example.com')
                && $mail->hasTo('ops@example.com')
                && count($mail->to) === 2;
        });
    }

    private function superAdmin(): User
    {
        return User::factory()->create(['role_id' => Role::where('name', 'super_admin')->firstOrFail()->id]);
    }
}
