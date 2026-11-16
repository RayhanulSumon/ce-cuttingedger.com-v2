<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\Ai\VertexImageGenerationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Mockery;
use Tests\TestCase;

class AiPreviewControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_enforces_two_free_previews_per_ip_and_account(): void
    {
        $mock = Mockery::mock(VertexImageGenerationService::class);
        $mock->shouldReceive('generatePreview')
            ->times(3)
            ->andReturn('/storage/previews/sample.png');
        $this->app->instance(VertexImageGenerationService::class, $mock);

        $this->getJson('/ai-preview/quota')
            ->assertOk()
            ->assertJson([
                'used' => 0,
                'remaining' => 2,
                'limit' => 2,
            ]);

        $userA = User::factory()->create(['email_verified_at' => now()]);
        $userB = User::factory()->create(['email_verified_at' => now()]);

        // 1st preview as guest on IP 10.0.0.1
        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.1'])
            ->postJson('/ai-preview/generate', [
                'feature' => 'digital_twin',
                'instructions' => 'Minimal studio look',
            ])
            ->assertOk()
            ->assertJson([
                'preview_url' => '/storage/previews/sample.png',
                'quota' => ['used' => 1, 'remaining' => 1, 'limit' => 2],
            ]);

        // 2nd preview as userA on same IP 10.0.0.1
        $this->actingAs($userA)
            ->withServerVariables(['REMOTE_ADDR' => '10.0.0.1'])
            ->postJson('/ai-preview/generate', [
                'feature' => 'virtual_try_on',
                'garment_top' => UploadedFile::fake()->image('shirt.jpg'),
            ])
            ->assertOk()
            ->assertJson([
                'preview_url' => '/storage/previews/sample.png',
                'quota' => ['used' => 2, 'remaining' => 0, 'limit' => 2],
            ]);

        // 3rd preview on same IP even with a different account userB -> blocked (429)
        $this->actingAs($userB)
            ->withServerVariables(['REMOTE_ADDR' => '10.0.0.1'])
            ->postJson('/ai-preview/generate', [
                'feature' => 'digital_twin',
            ])
            ->assertStatus(429);

        // 2nd generation as userA from a different IP 10.0.0.2 -> allowed (userA had 1)
        $this->actingAs($userA)
            ->withServerVariables(['REMOTE_ADDR' => '10.0.0.2'])
            ->postJson('/ai-preview/generate', [
                'feature' => 'digital_twin',
            ])
            ->assertOk()
            ->assertJson([
                'quota' => ['used' => 2, 'remaining' => 0, 'limit' => 2],
            ]);

        // 3rd generation as userA from 10.0.0.2 -> blocked (429)
        $this->actingAs($userA)
            ->withServerVariables(['REMOTE_ADDR' => '10.0.0.2'])
            ->postJson('/ai-preview/generate', [
                'feature' => 'digital_twin',
            ])
            ->assertStatus(429);
    }
}
