<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiJob;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminAiUsageController extends Controller
{
    /**
     * Display AI Studio token/credit usage, provider costs, 25% markup, and net profit totals.
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

        $summary = [
            'total_jobs' => AiJob::count(),
            'completed_jobs' => AiJob::where('status', AiJob::STATUS_COMPLETED)->count(),
            'failed_jobs' => AiJob::where('status', AiJob::STATUS_FAILED)->count(),
            'total_base_credits' => (int) $billableQuery->sum('base_credits'),
            'total_credits_charged' => (int) $billableQuery->sum('credits_charged'),
            'total_provider_cost_usd' => round((float) $billableQuery->sum('provider_cost_usd'), 4),
            'total_billed_usd' => round((float) $billableQuery->sum('billed_amount_usd'), 4),
            'total_profit_usd' => round((float) $billableQuery->sum('profit_usd'), 4),
            'markup_percent' => AiJob::MARKUP_PERCENT,
        ];

        return Inertia::render('Admin/AiUsage/Index', [
            'jobs' => $jobs,
            'summary' => $summary,
            'filters' => [
                'status' => $statusFilter,
                'service' => $serviceFilter,
            ],
        ]);
    }
}
