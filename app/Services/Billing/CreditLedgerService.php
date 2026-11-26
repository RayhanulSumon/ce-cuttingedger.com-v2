<?php

namespace App\Services\Billing;

use App\Models\AiJob;
use App\Models\CreditTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreditLedgerService
{
    /**
     * Atomically lock the user row, verify sufficient credits, deduct cost,
     * log a usage transaction, and create a queued AI job.
     *
     * @param  array<string, mixed>  $inputPayload
     */
    public function chargeAndCreateJob(
        User $user,
        string $provider,
        string $serviceType,
        array $inputPayload = []
    ): AiJob {
        $cost = AiJob::costForService($serviceType);

        return DB::transaction(function () use ($user, $provider, $serviceType, $inputPayload, $cost): AiJob {
            /** @var User $lockedUser */
            $lockedUser = User::whereKey($user->id)->lockForUpdate()->firstOrFail();

            $currentBalance = (int) ($lockedUser->credits_balance ?? 0);
            if ($currentBalance < $cost) {
                throw new RuntimeException("Insufficient credits. Required: {$cost}, available: {$currentBalance}.");
            }

            $lockedUser->update([
                'credits_balance' => $currentBalance - $cost,
            ]);

            $job = AiJob::create([
                'user_id' => $lockedUser->id,
                'provider' => $provider,
                'service_type' => $serviceType,
                'credits_charged' => $cost,
                'status' => AiJob::STATUS_QUEUED,
                'input_payload' => $inputPayload,
            ]);

            CreditTransaction::create([
                'user_id' => $lockedUser->id,
                'amount' => -$cost,
                'type' => CreditTransaction::TYPE_USAGE,
                'reference_id' => "ai_job:{$job->id}",
                'description' => "AI {$serviceType} job #{$job->id}",
            ]);

            return $job;
        });
    }

    /**
     * Idempotently mark an AI job as failed and refund its charged credits back to the user.
     */
    public function failAndRefundJob(int $jobId, string $reason): ?AiJob
    {
        return DB::transaction(function () use ($jobId, $reason): ?AiJob {
            /** @var AiJob|null $job */
            $job = AiJob::whereKey($jobId)->lockForUpdate()->first();

            if (! $job) {
                return null;
            }

            if ($job->status === AiJob::STATUS_FAILED || $job->status === AiJob::STATUS_COMPLETED) {
                return $job;
            }

            $referenceId = "ai_job:{$job->id}";
            $alreadyRefunded = CreditTransaction::where('type', CreditTransaction::TYPE_REFUND)
                ->where('reference_id', $referenceId)
                ->exists();

            if (! $alreadyRefunded && $job->credits_charged > 0) {
                /** @var User $lockedUser */
                $lockedUser = User::whereKey($job->user_id)->lockForUpdate()->firstOrFail();

                $lockedUser->update([
                    'credits_balance' => (int) ($lockedUser->credits_balance ?? 0) + (int) $job->credits_charged,
                ]);

                CreditTransaction::create([
                    'user_id' => $lockedUser->id,
                    'amount' => (int) $job->credits_charged,
                    'type' => CreditTransaction::TYPE_REFUND,
                    'reference_id' => $referenceId,
                    'description' => "Refund for failed AI {$job->service_type} job #{$job->id}",
                ]);
            }

            $job->update([
                'status' => AiJob::STATUS_FAILED,
                'error_message' => mb_substr($reason, 0, 2000),
                'completed_at' => now(),
            ]);

            return $job->fresh();
        });
    }

    /**
     * Idempotently grant credits from a completed Stripe Checkout session.
     */
    public function grantCreditsFromStripeSession(
        User $user,
        int $credits,
        string $sessionId,
        string $planName
    ): bool {
        if ($credits <= 0) {
            return false;
        }

        return DB::transaction(function () use ($user, $credits, $sessionId, $planName): bool {
            $alreadyGranted = CreditTransaction::where('type', CreditTransaction::TYPE_PURCHASE)
                ->where('reference_id', $sessionId)
                ->exists();

            if ($alreadyGranted) {
                return false;
            }

            /** @var User $lockedUser */
            $lockedUser = User::whereKey($user->id)->lockForUpdate()->firstOrFail();

            $lockedUser->update([
                'credits_balance' => (int) ($lockedUser->credits_balance ?? 0) + $credits,
                'active_plan_name' => $planName,
            ]);

            CreditTransaction::create([
                'user_id' => $lockedUser->id,
                'amount' => $credits,
                'type' => CreditTransaction::TYPE_PURCHASE,
                'reference_id' => $sessionId,
                'description' => "Stripe credit top-up: {$planName}",
            ]);

            return true;
        });
    }
}

