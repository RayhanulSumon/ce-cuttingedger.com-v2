<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiJob;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class AdminAiUsageController extends Controller
{
    /**
     * Display AI Studio token/credit usage, provider costs, markup, net profit totals, and dynamic pricing config.
     */
    public function index(Request $request): Response
    {
        $statusFilter = $request->query('status', 'all');
        $serviceFilter = $request->query('service', 'all');

        $query = AiJob::with('user:id,name,email,company')->latest('id');

        if ($statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        if ($serviceFilter !== 'all') {
            $query->where('service_type', $serviceFilter);
        }

        $jobs = $query->limit(100)->get()->map(function (AiJob $job): array {
            return [
                'id' => $job->id,
                'user_name' => $job->user?->name ?? 'Unknown',
                'user_email' => $job->user?->email ?? '',
                'provider' => $job->provider,
                'service_type' => $job->service_type,
                'status' => $job->status,
                'base_credits' => (int) $job->base_credits,
                'markup_percent' => (float) $job->markup_percent,
                'credits_charged' => (int) $job->credits_charged,
                'provider_cost_usd' => (float) $job->provider_cost_usd,
                'billed_amount_usd' => (float) $job->billed_amount_usd,
                'profit_usd' => (float) $job->profit_usd,
                'error_message' => $job->error_message,
                'created_at' => $job->created_at?->format('M j, Y g:i A'),
            ];
        })->values()->all();

        $billableQuery = AiJob::whereIn('status', [
            AiJob::STATUS_QUEUED,
            AiJob::STATUS_PROCESSING,
            AiJob::STATUS_COMPLETED,
        ]);

        $aiConfig = AiJob::getDynamicSettings();

        $summary = [
            'total_jobs' => AiJob::count(),
            'completed_jobs' => AiJob::where('status', AiJob::STATUS_COMPLETED)->count(),
            'failed_jobs' => AiJob::where('status', AiJob::STATUS_FAILED)->count(),
            'total_base_credits' => (int) $billableQuery->sum('base_credits'),
            'total_credits_charged' => (int) $billableQuery->sum('credits_charged'),
            'total_provider_cost_usd' => round((float) $billableQuery->sum('provider_cost_usd'), 4),
            'total_billed_usd' => round((float) $billableQuery->sum('billed_amount_usd'), 4),
            'total_profit_usd' => round((float) $billableQuery->sum('profit_usd'), 4),
            'markup_percent' => $aiConfig['markup_percent'],
        ];

        return Inertia::render('Admin/AiUsage/Index', [
            'jobs' => $jobs,
            'summary' => $summary,
            'aiConfig' => $aiConfig,
            'availableProviders' => [
                ['value' => AiJob::PROVIDER_FAL, 'label' => 'Fal.ai (Cloud Queue)'],
                ['value' => AiJob::PROVIDER_COMFYUI, 'label' => 'ComfyUI (Self-Hosted Adapter)'],
            ],
            'filters' => [
                'status' => $statusFilter,
                'service' => $serviceFilter,
            ],
        ]);
    }

    /**
     * Save dynamic AI provider, markup %, and per-service cost settings.
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'provider' => ['required', 'string', 'in:fal,comfyui'],
            'markup_percent' => ['required', 'numeric', 'min:0', 'max:500'],
            'services' => ['required', 'array'],
            'services.bg_remove.model' => ['required', 'string', 'max:191'],
            'services.bg_remove.base_credits' => ['required', 'integer', 'min:1', 'max:10000'],
            'services.bg_remove.provider_cost_usd' => ['required', 'numeric', 'min:0', 'max:100'],
            'services.try_on.model' => ['required', 'string', 'max:191'],
            'services.try_on.base_credits' => ['required', 'integer', 'min:1', 'max:10000'],
            'services.try_on.provider_cost_usd' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        Setting::updateOrCreate(
            ['key' => 'ai_service_pricing'],
            ['value' => json_encode($validated, JSON_THROW_ON_ERROR)]
        );

        Cache::forget('app.ai_service_pricing');

        return back()->with('success', 'AI provider and dynamic pricing settings updated.');
    }
}
