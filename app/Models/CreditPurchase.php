<?php

namespace App\Models;

use Database\Factories\CreditPurchaseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreditPurchase extends Model
{
    /** @use HasFactory<CreditPurchaseFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'base_credits' => 'integer',
            'bonus_credits' => 'integer',
            'total_credits' => 'integer',
            'amount_usd' => 'float',
            'effective_rate_per_credit' => 'float',
            'validity_days' => 'integer',
            'features_snapshot' => 'array',
            'credits_activated' => 'boolean',
            'activated_at' => 'datetime',
            'expires_at' => 'datetime',
            'current_period_start' => 'datetime',
            'current_period_end' => 'datetime',
            'metadata' => 'array',
        ];
    }

    /**
     * Generate unique reference number by billing mode when creating a purchase.
     */
    protected static function booted(): void
    {
        static::creating(function (CreditPurchase $purchase): void {
            if (empty($purchase->reference_number)) {
                $prefix = $purchase->billing_type === 'monthly' ? 'CE-SUB-' : 'CE-CRD-';
                $purchase->reference_number = $prefix.strtoupper(Str::random(6));
            }
        });
    }

    /**
     * Client account that owns this credit purchase.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Source preset pricing plan when purchased from an admin-managed plan card.
     *
     * @return BelongsTo<PricingPlan, $this>
     */
    public function pricingPlan(): BelongsTo
    {
        return $this->belongsTo(PricingPlan::class);
    }

    /**
     * Admin staff member who manually approved this purchase, if applicable.
     *
     * @return BelongsTo<User, $this>
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Atomically and idempotently credit the client's wallet and mark the purchase active.
     *
     * Shared by manual Admin approvals and future Stripe webhook handlers.
     *
     * @param  array<string, mixed>  $stripeAttributes
     */
    public function activateCredits(?User $approver = null, array $stripeAttributes = []): bool
    {
        $activated = DB::transaction(function () use ($approver, $stripeAttributes): bool {
            /** @var CreditPurchase $purchase */
            $purchase = self::whereKey($this->id)->lockForUpdate()->firstOrFail();

            if ($purchase->credits_activated) {
                return false;
            }

            /** @var User $client */
            $client = User::whereKey($purchase->user_id)->lockForUpdate()->firstOrFail();

            $validityDays = max(1, (int) $purchase->validity_days);
            $activatedAt = now();
            $expiresAt = $activatedAt->copy()->addDays($validityDays);

            $nextExpiry = $client->credits_expires_at && $client->credits_expires_at->isFuture() && $client->credits_expires_at->gt($expiresAt)
                ? $client->credits_expires_at
                : $expiresAt;

            $userPayload = [
                'credits_balance' => (int) ($client->credits_balance ?? 0) + (int) $purchase->total_credits,
                'active_plan_name' => $purchase->plan_name,
                'credits_expires_at' => $nextExpiry,
            ];

            if (! empty($stripeAttributes['stripe_customer_id']) && empty($client->stripe_customer_id)) {
                $userPayload['stripe_customer_id'] = (string) $stripeAttributes['stripe_customer_id'];
            }

            $client->update($userPayload);

            CreditTransaction::create([
                'user_id' => $client->id,
                'amount' => (int) $purchase->total_credits,
                'type' => CreditTransaction::TYPE_PURCHASE,
                'reference_id' => $stripeAttributes['stripe_checkout_session_id'] ?? $purchase->reference_number,
                'description' => "Credit pack activated: {$purchase->plan_name}",
            ]);

            $purchase->update(array_merge($stripeAttributes, [
                'status' => 'active',
                'payment_status' => 'paid',
                'credits_activated' => true,
                'activated_at' => $activatedAt,
                'expires_at' => $expiresAt,
                'approved_by' => $approver?->id ?? $purchase->approved_by,
            ]));

            return true;
        });

        $this->refresh();

        return $activated;
    }
}
