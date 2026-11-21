<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminSystemLogTest extends TestCase
{
    use RefreshDatabase;

    private string $storagePath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->storagePath = sys_get_temp_dir().DIRECTORY_SEPARATOR.'ce-log-test-'.uniqid();
        File::ensureDirectoryExists($this->storagePath.DIRECTORY_SEPARATOR.'logs');
        $this->app->useStoragePath($this->storagePath);

        File::put($this->logPath('laravel.log'), implode("\n", [
            '[2026-11-21 10:00:00] local.INFO: Older info entry',
            '[2026-11-21 11:00:00] local.ERROR: Vertex AI generation failed {"userId":3}',
            '[stacktrace]',
            '#0 app/Services/Ai/VertexImageGenerationService.php(59)',
            '[2026-11-21 12:00:00] local.WARNING: Newest warning entry',
            '',
        ]));
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->storagePath);

        parent::tearDown();
    }

    public function test_standard_admin_cannot_view_system_logs(): void
    {
        $this->actingAs($this->userWithRole('admin'))
            ->get(route('admin.system-logs.index'))
            ->assertForbidden();
    }

    public function test_super_admin_sees_parsed_entries_newest_first_with_stack_trace(): void
    {
        $this->actingAs($this->userWithRole('super_admin'))
            ->get(route('admin.system-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/SystemLogs/Index')
                ->where('currentFile', 'laravel.log')
                ->where('totalEntries', 3)
                ->where('levelCounts.error', 1)
                ->where('entries.data.0.level', 'warning')
                ->where('entries.data.1.level', 'error')
                ->where('entries.data.1.message', 'Vertex AI generation failed {"userId":3}')
                ->where('entries.data.1.details', fn (string $details): bool => str_contains($details, 'VertexImageGenerationService.php(59)'))
            );
    }

    public function test_entries_can_be_filtered_by_level_and_search(): void
    {
        $superAdmin = $this->userWithRole('super_admin');

        $this->actingAs($superAdmin)
            ->get(route('admin.system-logs.index', ['level' => 'error']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('entries.data', 1)
                ->where('entries.data.0.level', 'error')
            );

        $this->actingAs($superAdmin)
            ->get(route('admin.system-logs.index', ['search' => 'older info']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('entries.data', 1)
                ->where('entries.data.0.level', 'info')
            );
    }

    public function test_files_outside_the_log_directory_cannot_be_downloaded(): void
    {
        $this->actingAs($this->userWithRole('super_admin'))
            ->get(route('admin.system-logs.download', ['file' => '../../.env']))
            ->assertNotFound();
    }

    public function test_super_admin_can_clear_a_log_file(): void
    {
        $this->actingAs($this->userWithRole('super_admin'))
            ->delete(route('admin.system-logs.clear'), ['file' => 'laravel.log'])
            ->assertRedirect(route('admin.system-logs.index', ['file' => 'laravel.log']));

        $this->assertSame('', File::get($this->logPath('laravel.log')));
    }

    private function logPath(string $fileName): string
    {
        return $this->storagePath.DIRECTORY_SEPARATOR.'logs'.DIRECTORY_SEPARATOR.$fileName;
    }

    private function userWithRole(string $roleName): User
    {
        return User::factory()->create(['role_id' => Role::where('name', $roleName)->firstOrFail()->id]);
    }
}
