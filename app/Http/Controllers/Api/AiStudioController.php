<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiJob;
use App\Models\DigitalTwin;
use App\Services\Ai\ImageAIServiceInterface;
use App\Services\Billing\CreditLedgerService;
use App\Services\Media\DirectUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class AiStudioController extends Controller
{
    public function __construct(
        private readonly CreditLedgerService $ledger,
        private readonly ImageAIServiceInterface $aiService,
        private readonly DirectUploadService $uploadService,
    ) {}

    /**
     * Generate a presigned upload URL for direct browser uploads.
     */
    public function presignUpload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'filename' => ['required', 'string', 'max:255'],
            'content_type' => ['required', 'string', 'in:image/jpeg,image/png,image/webp'],
            'purpose' => ['nullable', 'string', 'in:inputs,garments,models'],
        ]);

        $presigned = $this->uploadService->createPresignedUpload(
            $request->user(),
            $validated['filename'],
            $validated['content_type'],
            $validated['purpose'] ?? 'inputs'
        );

        return response()->json($presigned);
    }

    /**
     * Handle signed local/public disk uploads when S3/R2 is not configured.
     */
    public function storeLocalUpload(Request $request): JsonResponse
    {
        $key = (string) $request->query('key', '');
        $expectedUserId = (int) $request->query('user', 0);

        if ($key === '' || str_contains($key, '..') || $request->user()?->id !== $expectedUserId) {
            abort(403, 'Invalid upload target.');
        }

        $content = $request->getContent();
        if ($content === '') {
            $file = $request->file('file');
            if (! $file) {
                return response()->json(['message' => 'Empty upload body.'], 422);
            }
            $content = $file->get();
        }

        if (strlen($content) > 15 * 1024 * 1024) {
            return response()->json(['message' => 'File exceeds 15 MB upload limit.'], 422);
        }

        Storage::disk('public')->put($key, $content);

        return response()->json([
            'key' => $key,
            'public_url' => rtrim((string) config('app.url', 'http://localhost'), '/').'/storage/'.ltrim($key, '/'),
        ]);
    }

    /**
     * Submit a Background Removal job (1 credit) via Fal.ai.
     */
    public function bgRemove(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image_url' => ['required', 'url', 'max:1000'],
        ]);

        return $this->dispatchAiJob(
            $request,
            AiJob::PROVIDER_FAL,
            AiJob::SERVICE_BG_REMOVE,
            ['image_url' => $validated['image_url']],
            fn (AiJob $job) => $this->aiService->generateBackgroundRemoval($job, $validated['image_url'])
        );
    }

    /**
     * Submit an Instant Virtual Try-On job (5 credits) using a CuttingEdger Digital Twin pose or custom model photo.
     */
    public function tryOn(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'digital_twin_id' => ['nullable', 'integer', 'exists:digital_twins,id'],
            'pose_id' => ['nullable', 'string', 'max:40'],
            'person_image_url' => ['nullable', 'url', 'max:1000'],
            'garment_image_url' => ['required', 'url', 'max:1000'],
            'category' => ['nullable', 'string', 'in:auto,tops,bottoms,one-pieces'],
        ]);

        $personImageUrl = $validated['person_image_url'] ?? null;
        $twinName = null;

        if (! empty($validated['digital_twin_id'])) {
            $twin = DigitalTwin::where('id', $validated['digital_twin_id'])
                ->where('is_active', true)
                ->first();

            if (! $twin) {
                return response()->json(['message' => 'Selected Digital Twin is not available.'], 404);
            }

            $twinName = $twin->name;
            $personImageUrl = $this->resolveTwinPoseUrl($twin, $validated['pose_id'] ?? null);
        }

        if (empty($personImageUrl)) {
            return response()->json(['message' => 'Please select a Digital Twin model or upload a model photo.'], 422);
        }

        $payload = [
            'digital_twin_id' => $validated['digital_twin_id'] ?? null,
            'digital_twin_name' => $twinName,
            'pose_id' => $validated['pose_id'] ?? null,
            'person_image_url' => $personImageUrl,
            'garment_image_url' => $validated['garment_image_url'],
            'category' => $validated['category'] ?? 'auto',
        ];

        return $this->dispatchAiJob(
            $request,
            AiJob::PROVIDER_FAL,
            AiJob::SERVICE_TRY_ON,
            $payload,
            fn (AiJob $job) => $this->aiService->generateVirtualTryOn(
                $job,
                $personImageUrl,
                $validated['garment_image_url'],
                ['category' => $payload['category']]
            )
        );
    }

    /**
     * List authenticated user's AI jobs for the gallery.
     */
    public function listJobs(Request $request): JsonResponse
    {
        $jobs = AiJob::where('user_id', $request->user()->id)
            ->latest('id')
            ->limit(50)
            ->get();

        return response()->json([
            'jobs' => $jobs,
            'credit_balance' => (int) ($request->user()->credits_balance ?? 0),
        ]);
    }

    /**
     * Poll a single AI job status.
     */
    public function showJob(Request $request, AiJob $aiJob): JsonResponse
    {
        if ($aiJob->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        return response()->json([
            'job' => $aiJob,
            'credit_balance' => (int) ($request->user()->fresh()->credits_balance ?? 0),
        ]);
    }

    /**
     * Resolve an absolute HTTPS/HTTP image URL for a Digital Twin pose.
     */
    private function resolveTwinPoseUrl(DigitalTwin $twin, ?string $poseId): ?string
    {
        $poses = ! empty($twin->poses) ? $twin->poses : DigitalTwin::defaultPoses();
        $selectedPose = null;

        if ($poseId) {
            foreach ($poses as $pose) {
                if (($pose['id'] ?? null) === $poseId) {
                    $selectedPose = $pose;
                    break;
                }
            }
        }

        $rawPath = $selectedPose['imageUrl']
            ?? $twin->hi_res_image
            ?? $twin->runway_image;

        if (empty($rawPath)) {
            return null;
        }

        if (str_starts_with($rawPath, 'http://') || str_starts_with($rawPath, 'https://')) {
            return $rawPath;
        }

        return rtrim((string) config('app.url', 'http://localhost'), '/').'/'.ltrim($rawPath, '/');
    }

    /**
     * Shared atomic credit-charge + provider-dispatch + automatic-refund wrapper.
     *
     * @param  array<string, mixed>  $payload
     * @param  callable(AiJob): array<string, mixed>  $callback
     */
    private function dispatchAiJob(
        Request $request,
        string $provider,
        string $serviceType,
        array $payload,
        callable $callback
    ): JsonResponse {
        $user = $request->user();

        try {
            $job = $this->ledger->chargeAndCreateJob($user, $provider, $serviceType, $payload);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        try {
            $callback($job);
        } catch (Throwable $e) {
            $failedJob = $this->ledger->failAndRefundJob($job->id, $e->getMessage());

            return response()->json([
                'message' => 'Failed to dispatch AI job; credits were automatically refunded.',
                'error' => $e->getMessage(),
                'job' => $failedJob,
                'credit_balance' => (int) ($user->fresh()->credits_balance ?? 0),
            ], 502);
        }

        return response()->json([
            'job' => $job->fresh(),
            'credit_balance' => (int) ($user->fresh()->credits_balance ?? 0),
        ], 201);
    }
}
