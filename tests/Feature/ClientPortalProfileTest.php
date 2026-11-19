<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ClientPortalProfileTest extends TestCase
{
    use RefreshDatabase;

    protected User $client;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $adminRole = Role::firstOrCreate(['name' => 'super_admin']);

        $this->client = User::factory()->create([
            'role_id' => $userRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
            'avatar' => null,
        ]);

        $this->admin = User::factory()->create([
            'role_id' => $adminRole->id,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
    }

    public function test_guests_and_admins_cannot_upload_or_delete_client_avatar(): void
    {
        $file = UploadedFile::fake()->image('avatar.png', 400, 400);

        $this->post('/portal/avatar', ['avatar' => $file])->assertRedirect('/login');
        $this->delete('/portal/avatar')->assertRedirect('/login');

        $this->actingAs($this->admin)
            ->post('/portal/avatar', ['avatar' => $file])
            ->assertRedirect(route('login'));

        $this->actingAs($this->admin)
            ->delete('/portal/avatar')
            ->assertRedirect(route('login'));
    }

    public function test_verified_client_can_upload_profile_picture_and_replace_previous_file(): void
    {
        $firstUpload = UploadedFile::fake()->image('first-avatar.png', 600, 600);

        $response = $this->actingAs($this->client)->post('/portal/avatar', [
            'avatar' => $firstUpload,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->client->refresh();
        $firstAvatarUrl = $this->client->avatar;

        $this->assertNotNull($firstAvatarUrl);
        $this->assertStringStartsWith('/storage/avatars/', $firstAvatarUrl);

        $firstRelativePath = str_replace('/storage/', '', $firstAvatarUrl);
        Storage::disk('public')->assertExists($firstRelativePath);

        $secondUpload = UploadedFile::fake()->image('second-avatar.jpg', 800, 800);

        $secondResponse = $this->actingAs($this->client)->post('/portal/avatar', [
            'avatar' => $secondUpload,
        ]);

        $secondResponse->assertRedirect();
        $secondResponse->assertSessionHas('success');

        $this->client->refresh();
        $secondAvatarUrl = $this->client->avatar;

        $this->assertNotNull($secondAvatarUrl);
        $this->assertNotSame($firstAvatarUrl, $secondAvatarUrl);

        $secondRelativePath = str_replace('/storage/', '', $secondAvatarUrl);
        Storage::disk('public')->assertMissing($firstRelativePath);
        Storage::disk('public')->assertExists($secondRelativePath);
    }

    public function test_verified_client_can_remove_stored_and_oauth_avatars(): void
    {
        $upload = UploadedFile::fake()->image('avatar.webp', 500, 500);

        $this->actingAs($this->client)->post('/portal/avatar', [
            'avatar' => $upload,
        ])->assertRedirect();

        $this->client->refresh();
        $storedPath = str_replace('/storage/', '', (string) $this->client->avatar);
        Storage::disk('public')->assertExists($storedPath);

        $this->actingAs($this->client)
            ->delete('/portal/avatar')
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->client->refresh();
        $this->assertNull($this->client->avatar);
        Storage::disk('public')->assertMissing($storedPath);

        // Removing an external Google OAuth avatar clears the column without deleting remote assets.
        $this->client->update(['avatar' => 'https://lh3.googleusercontent.com/a/example-photo']);

        $this->actingAs($this->client)
            ->delete('/portal/avatar')
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->client->refresh();
        $this->assertNull($this->client->avatar);
    }

    public function test_invalid_mime_or_oversized_avatar_upload_fails_validation(): void
    {
        $existingUrl = '/storage/avatars/existing-avatar.webp';
        $this->client->update(['avatar' => $existingUrl]);

        $pdfFile = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');
        $this->actingAs($this->client)
            ->post('/portal/avatar', ['avatar' => $pdfFile])
            ->assertSessionHasErrors('avatar');

        $oversizedFile = UploadedFile::fake()->image('huge.png', 800, 800)->size(4500);
        $this->actingAs($this->client)
            ->post('/portal/avatar', ['avatar' => $oversizedFile])
            ->assertSessionHasErrors('avatar');

        $this->client->refresh();
        $this->assertSame($existingUrl, $this->client->avatar);
    }

    public function test_verified_client_can_update_profile_details_and_password(): void
    {
        $profileResponse = $this->actingAs($this->client)->post('/portal/profile', [
            'name' => 'Clara Vance Studio',
            'company' => 'Vance Atelier Paris',
            'phone' => '+33142685500',
        ]);

        $profileResponse->assertRedirect();
        $profileResponse->assertSessionHas('success');

        $this->client->refresh();
        $this->assertSame('Clara Vance Studio', $this->client->name);
        $this->assertSame('Vance Atelier Paris', $this->client->company);
        $this->assertSame('+33142685500', $this->client->phone);

        $passwordResponse = $this->actingAs($this->client)->post('/portal/password', [
            'password' => 'NewSecurePass123!',
            'password_confirmation' => 'NewSecurePass123!',
        ]);

        $passwordResponse->assertRedirect();
        $passwordResponse->assertSessionHas('success');

        $this->client->refresh();
        $this->assertTrue(Hash::check('NewSecurePass123!', $this->client->password));
    }

    public function test_verified_client_can_render_all_individual_portal_pages_and_guests_or_admins_are_redirected(): void
    {
        $portalUrls = [
            '/portal' => 'Client/Dashboard',
            '/portal/orders' => 'Client/Orders',
            '/portal/credits' => 'Client/Credits',
            '/portal/settings' => 'Client/Settings',
        ];

        foreach (array_keys($portalUrls) as $url) {
            $this->get($url)->assertRedirect('/login');
        }

        foreach (array_keys($portalUrls) as $url) {
            $this->actingAs($this->admin)->get($url)->assertRedirect(route('login'));
        }

        foreach ($portalUrls as $url => $component) {
            $this->actingAs($this->client)
                ->get($url)
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component($component)
                    ->has('client_badges')
                );
        }
    }
}
