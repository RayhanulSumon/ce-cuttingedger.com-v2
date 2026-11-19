import React, { useMemo, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowUpRight, Check, Coins, SlidersHorizontal, Sparkles } from 'lucide-react';
import { isClientUser, isVerifiedClient, OrderAuthNotice } from '@/Components/Common/OrderAuthNotice';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { PageProps } from '@/types';
import { PricingPlan } from '@/types/models';

type BillingType = 'one_time' | 'monthly';

interface SelectedPlanPayload {
    pricing_plan_id?: number | null;
    plan_name: string;
    base_credits: number;
    bonus_credits: number;
    total_price: number;
    billing_type: BillingType;
    validity_days: number;
    features: string[];
    notes: string;
}

interface PresetCreditPlan {
    id: string;
    presetPlanId?: number | null;
    eyebrow: string;
    name: string;
    description: string;
    baseCredits: number;
    bonusCredits: number;
    totalPrice: number;
    validityDays: number;
    effectiveRate: string;
    popular?: boolean;
    buttonLabel: string;
    features: string[];
}

const PRESET_PLANS: PresetCreditPlan[] = [
    {
        id: 'starter',
        eyebrow: 'Starter Pack',
        name: 'Starter Credit Pack',
        description: 'Ideal for boutique shoots, product launches, and testing studio workflows.',
        baseCredits: 500,
        bonusCredits: 0,
        totalPrice: 250,
        validityDays: 90,
        effectiveRate: '$0.50 / credit',
        buttonLabel: 'Buy Starter Plan',
        features: [
            'Valid for 90 days from activation',
            'Use across 2D, 3D, DTP & Try-On',
            'Unlimited revisions with 2-step QA',
        ],
    },
    {
        id: 'studio',
        eyebrow: 'Most Popular',
        name: 'Studio Credit Pack',
        description: 'Built for growing fashion and e-commerce brands with recurring catalog drops.',
        baseCredits: 2000,
        bonusCredits: 300,
        totalPrice: 900,
        validityDays: 180,
        effectiveRate: '$0.39 / credit',
        popular: true,
        buttonLabel: 'Buy Studio Plan',
        features: [
            '2,000 + 300 bonus = 2,300 credits',
            'Valid for 180 days from activation',
            '12–18h priority studio turnaround',
        ],
    },
    {
        id: 'scale',
        eyebrow: 'High Volume',
        name: 'Scale Credit Pack',
        description: 'Maximum per-credit value for multi-season rollouts and enterprise teams.',
        baseCredits: 5000,
        bonusCredits: 1250,
        totalPrice: 2000,
        validityDays: 365,
        effectiveRate: '$0.32 / credit',
        buttonLabel: 'Buy Scale Plan',
        features: [
            '5,000 + 1,250 bonus = 6,250 credits',
            'Valid for 365 days (12 months) from activation',
            'Sub-6h rush lane & dedicated pod',
        ],
    },
];

const SLIDER_PRESETS = [500, 1000, 2500, 5000, 10000];

const CREDIT_USAGE_GUIDE = [
    { service: '2D Retouching', cost: '1 credit / image' },
    { service: 'Ghost Mannequin', cost: '2 credits / image' },
    { service: 'Virtual Try-On / DTP', cost: '4 credits' },
    { service: '3D / Digital Twin', cost: '50 credits' },
];

function getVolumeBonusPercent(credits: number): number {
    if (credits >= 10000) return 30;
    if (credits >= 5000) return 25;
    if (credits >= 3500) return 20;
    if (credits >= 2000) return 15;
    if (credits >= 1000) return 10;
    return 0;
}

/** Studio Credit Plans: admin-managed packs, a customizable credit slider builder, and direct purchase checkout. */
export function PricingCardsSection({ plans = [] }: { plans?: PricingPlan[] }) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user ?? null;
    const clientUser = isClientUser(user) ? user : null;
    const isVerified = isVerifiedClient(user);

    const [customCredits, setCustomCredits] = useState<number>(2500);
    const [billingType, setBillingType] = useState<BillingType>('one_time');
    const [checkoutPlan, setCheckoutPlan] = useState<SelectedPlanPayload | null>(null);

    const displayPlans = useMemo<PresetCreditPlan[]>(() => {
        if (!plans || plans.length === 0) {
            return PRESET_PLANS;
        }

        return plans.map((plan) => {
            const baseCredits = plan.base_credits ?? 500;
            const bonusCredits = plan.bonus_credits ?? 0;
            const totalCredits = Math.max(1, baseCredits + bonusCredits);
            const totalPrice = Number(
                plan.price_amount ?? (Number(String(plan.price).replace(/[^0-9.]/g, '')) || 250)
            );

            return {
                id: String(plan.id || plan.slug),
                presetPlanId: typeof plan.id === 'number' ? plan.id : null,
                eyebrow: plan.badge || (plan.is_popular ? 'Most Popular' : 'Credit Pack'),
                name: plan.name,
                description: plan.headline,
                baseCredits,
                bonusCredits,
                totalPrice,
                validityDays: plan.validity_days ?? 90,
                effectiveRate: `$${(totalPrice / totalCredits).toFixed(2)} / credit`,
                popular: Boolean(plan.is_popular),
                buttonLabel: plan.cta_text || `Buy ${plan.name}`,
                features: Array.isArray(plan.features) ? plan.features : [],
            };
        });
    }, [plans]);

    const buyForm = useForm<SelectedPlanPayload>({
        pricing_plan_id: null,
        plan_name: '',
        base_credits: 500,
        bonus_credits: 0,
        total_price: 250,
        billing_type: 'one_time',
        validity_days: 90,
        features: [],
        notes: '',
    });

    const customQuote = useMemo(() => {
        const volumeBonusPct = getVolumeBonusPercent(customCredits);
        const monthlyBonusPct = billingType === 'monthly' ? 10 : 0;
        const totalBonusPct = volumeBonusPct + monthlyBonusPct;
        const bonusCredits = Math.round((customCredits * totalBonusPct) / 100);
        const totalCredits = customCredits + bonusCredits;
        const totalPrice = Number((customCredits * 0.5).toFixed(2));
        const effectivePerCredit = totalPrice / Math.max(1, totalCredits);
        const validityDays =
            billingType === 'monthly' ? 30 : customCredits >= 5000 ? 365 : customCredits >= 2000 ? 180 : 90;

        return {
            volumeBonusPct,
            monthlyBonusPct,
            totalBonusPct,
            bonusCredits,
            totalCredits,
            totalPrice,
            validityDays,
            effectivePerCredit: effectivePerCredit.toFixed(2),
        };
    }, [customCredits, billingType]);

    const openBuyModal = (plan: Omit<SelectedPlanPayload, 'notes'>) => {
        const payload: SelectedPlanPayload = { ...plan, notes: '' };
        setCheckoutPlan(payload);
        buyForm.setData(payload);
        buyForm.clearErrors();
    };

    const handleConfirmPurchase = (event: React.FormEvent) => {
        event.preventDefault();
        if (!checkoutPlan || !isVerified) return;

        buyForm.post(route('pricing.buy-plan'), {
            preserveScroll: true,
            onSuccess: () => {
                setCheckoutPlan(null);
                buyForm.reset();
            },
        });
    };

    const sliderProgress = ((customCredits - 250) / (20000 - 250)) * 100;

    return (
        <section id="pricing-plans-section" className="bg-page py-14 sm:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Active Client Credit Wallet Status */}
                {clientUser && (
                    <div className="mb-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary/25 bg-surface px-6 py-4 shadow-xs sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3.5">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary-ink">
                                <Coins className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
                                    Your Studio Credit Wallet
                                </p>
                                <p className="mt-0.5 text-base font-extrabold text-ink">
                                    {(clientUser.credits_balance ?? 0).toLocaleString()} Credits Available
                                    {clientUser.active_plan_name && (
                                        <span className="ml-2 text-xs font-semibold text-primary-ink">
                                            · {clientUser.active_plan_name}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/portal"
                            prefetch
                            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-page px-5 py-2 text-xs font-bold text-ink transition-colors hover:border-primary hover:text-primary-ink"
                        >
                            <span>Manage & Use Credits</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                )}

                {/* 3 Simple Preset Credit Plan Cards */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {displayPlans.map((plan) => {
                        const isPopular = Boolean(plan.popular);
                        const totalCredits = plan.baseCredits + plan.bonusCredits;

                        return (
                            <article
                                key={plan.id}
                                className={`flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition-colors duration-300 ${
                                    isPopular
                                        ? 'border-2 border-primary bg-surface shadow-[0_20px_50px_-24px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]'
                                        : 'border border-ink/10 bg-surface hover:border-ink/25'
                                }`}
                            >
                                <div>
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                                            isPopular ? 'bg-primary text-white' : 'bg-page text-subtle'
                                        }`}
                                    >
                                        {plan.eyebrow}
                                    </span>

                                    <h2 className="mt-5 text-2xl font-display font-extrabold tracking-tight text-ink">
                                        {plan.name}
                                    </h2>
                                    <p className="mt-2 text-sm leading-relaxed text-muted">
                                        {plan.description}
                                    </p>

                                    <div className="mt-6 border-y border-ink/10 py-5">
                                        <div className="flex items-baseline justify-between gap-3">
                                            <p className="text-3xl font-display font-extrabold tracking-tight text-ink">
                                                ${plan.totalPrice.toLocaleString()}
                                            </p>
                                            <span className="text-xs font-semibold text-primary-ink">
                                                {plan.effectiveRate}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 text-sm font-bold text-ink-2">
                                            {totalCredits.toLocaleString()} Total Credits
                                            {plan.bonusCredits > 0 && (
                                                <span className="ml-1.5 text-xs font-semibold text-primary-ink">
                                                    (incl. +{plan.bonusCredits.toLocaleString()} bonus)
                                                </span>
                                            )}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-subtle">
                                            Valid for {plan.validityDays} days from activation
                                        </p>
                                    </div>

                                    <ul className="mt-6 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-2.5 text-sm leading-snug text-ink-2"
                                            >
                                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        openBuyModal({
                                            pricing_plan_id: plan.presetPlanId ?? null,
                                            plan_name: plan.name,
                                            base_credits: plan.baseCredits,
                                            bonus_credits: plan.bonusCredits,
                                            total_price: plan.totalPrice,
                                            billing_type: 'one_time',
                                            validity_days: plan.validityDays,
                                            features: plan.features,
                                        })
                                    }
                                    className={`group mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                                        isPopular
                                            ? 'bg-primary text-white hover:bg-primary-hover'
                                            : 'bg-ink text-white hover:bg-primary'
                                    }`}
                                >
                                    <span>{plan.buttonLabel}</span>
                                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </button>
                            </article>
                        );
                    })}
                </div>

                {/* Interactive Custom Credit Plan Builder */}
                <div className="mt-10 rounded-3xl border border-ink/10 bg-surface p-6 sm:p-9 shadow-xs">
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                        <div className="space-y-6 lg:col-span-7">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-ink">
                                        <SlidersHorizontal className="h-3.5 w-3.5" />
                                        Customize Your Credit Plan
                                    </span>
                                    <h3 className="mt-1 text-2xl font-display font-extrabold tracking-tight text-ink">
                                        Build an exact credit bundle
                                    </h3>
                                </div>

                                {/* One-Time vs Monthly Auto-Topup Toggle */}
                                <div className="inline-flex rounded-full border border-ink/10 bg-page p-1">
                                    <button
                                        type="button"
                                        onClick={() => setBillingType('one_time')}
                                        className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                            billingType === 'one_time'
                                                ? 'bg-ink text-white'
                                                : 'text-muted hover:text-ink'
                                        }`}
                                    >
                                        One-Time Pack
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBillingType('monthly')}
                                        className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                            billingType === 'monthly'
                                                ? 'bg-primary text-white'
                                                : 'text-muted hover:text-ink'
                                        }`}
                                    >
                                        Monthly (+10% Bonus)
                                    </button>
                                </div>
                            </div>

                            {/* Range Slider */}
                            <div className="space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <label
                                        htmlFor="custom-credits-slider"
                                        className="text-sm font-semibold text-ink-2"
                                    >
                                        Base Credits
                                    </label>
                                    <span className="text-2xl font-display font-extrabold tabular-nums text-ink">
                                        {customCredits.toLocaleString()} Credits
                                    </span>
                                </div>

                                <input
                                    id="custom-credits-slider"
                                    type="range"
                                    min={250}
                                    max={20000}
                                    step={250}
                                    value={customCredits}
                                    onChange={(e) => setCustomCredits(Number(e.target.value))}
                                    className="h-2.5 w-full cursor-pointer appearance-none rounded-lg accent-primary"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${sliderProgress}%, color-mix(in srgb, var(--color-ink) 12%, transparent) ${sliderProgress}%, color-mix(in srgb, var(--color-ink) 12%, transparent) 100%)`,
                                    }}
                                />

                                <div className="flex justify-between text-[11px] font-medium text-subtle">
                                    <span>250 credits</span>
                                    <span>20,000 credits</span>
                                </div>
                            </div>

                            {/* Quick Credit Preset Pills */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 text-xs font-semibold text-subtle">Quick select:</span>
                                {SLIDER_PRESETS.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => setCustomCredits(amount)}
                                        className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                            customCredits === amount
                                                ? 'bg-primary text-white'
                                                : 'border border-ink/10 bg-page text-ink-2 hover:border-primary/40 hover:text-ink'
                                        }`}
                                    >
                                        {amount.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Custom Plan Summary */}
                        <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-page p-6 lg:col-span-5">
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
                                        Your Custom Bundle
                                    </span>
                                    {customQuote.totalBonusPct > 0 && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary-ink">
                                            <Sparkles className="h-3 w-3" />+{customQuote.totalBonusPct}% Bonus
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
                                    <span className="text-4xl font-display font-extrabold tabular-nums text-ink">
                                        ${customQuote.totalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-xs font-semibold text-primary-ink">
                                        ${customQuote.effectivePerCredit} / credit
                                    </span>
                                </div>

                                <dl className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted">Base credits</dt>
                                        <dd className="font-semibold tabular-nums text-ink">
                                            {customCredits.toLocaleString()}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted">Bonus credits</dt>
                                        <dd className="font-semibold tabular-nums text-primary-ink">
                                            +{customQuote.bonusCredits.toLocaleString()}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted">Credit validity</dt>
                                        <dd className="font-semibold text-ink">
                                            {customQuote.validityDays} days from activation
                                        </dd>
                                    </div>
                                    <div className="flex justify-between border-t border-ink/10 pt-2">
                                        <dt className="font-bold text-ink">Total studio credits</dt>
                                        <dd className="font-extrabold tabular-nums text-ink">
                                            {customQuote.totalCredits.toLocaleString()}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    openBuyModal({
                                        pricing_plan_id: null,
                                        plan_name: 'Custom Credit Plan',
                                        base_credits: customCredits,
                                        bonus_credits: customQuote.bonusCredits,
                                        total_price: customQuote.totalPrice,
                                        billing_type: billingType,
                                        validity_days: customQuote.validityDays,
                                        features: [
                                            `${customCredits.toLocaleString()} base studio credits`,
                                            customQuote.totalBonusPct > 0
                                                ? `+${customQuote.totalBonusPct}% bonus (${customQuote.bonusCredits.toLocaleString()} extra credits)`
                                                : 'Standard pay-as-you-go credit rate',
                                            `Valid for ${customQuote.validityDays} days from activation`,
                                        ],
                                    })
                                }
                                className="group mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-hover"
                            >
                                <span>Buy Custom Plan</span>
                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Compact Credit Usage Guide Strip */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {CREDIT_USAGE_GUIDE.map((item) => (
                        <div
                            key={item.service}
                            className="rounded-2xl border border-ink/10 bg-surface px-4 py-3 text-center sm:text-left"
                        >
                            <p className="text-xs font-bold text-ink">{item.service}</p>
                            <p className="mt-0.5 text-xs font-semibold text-primary-ink">{item.cost}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Buy Credit Plan Confirmation Modal */}
            <Dialog open={Boolean(checkoutPlan)} onOpenChange={(open) => !open && setCheckoutPlan(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Confirm Credit Plan Order</DialogTitle>
                        <DialogDescription>
                            Submit your plan order to receive an invoice and activate credits in your Client Portal.
                        </DialogDescription>
                    </DialogHeader>

                    {checkoutPlan && (
                        <form onSubmit={handleConfirmPurchase} className="space-y-4">
                            <div className="rounded-2xl border border-ink/10 bg-page p-4 space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-ink">{checkoutPlan.plan_name}</span>
                                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary-ink">
                                        {checkoutPlan.billing_type === 'monthly' ? 'Monthly Plan' : 'One-Time Pack'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-muted">
                                    <span>Base + Bonus Credits</span>
                                    <span className="font-semibold text-ink tabular-nums">
                                        {checkoutPlan.base_credits.toLocaleString()} + {checkoutPlan.bonus_credits.toLocaleString()} ={' '}
                                        {(checkoutPlan.base_credits + checkoutPlan.bonus_credits).toLocaleString()} Credits
                                    </span>
                                </div>
                                <div className="flex justify-between text-muted">
                                    <span>Credit Validity</span>
                                    <span className="font-semibold text-ink">
                                        {checkoutPlan.validity_days} Days (starts upon activation)
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-ink/10 pt-2">
                                    <span className="font-bold text-ink">Total Investment</span>
                                    <span className="text-lg font-extrabold text-primary-ink tabular-nums">
                                        ${checkoutPlan.total_price.toLocaleString()} USD
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="credit-plan-notes" className="block text-xs font-semibold text-ink-2">
                                    Project or billing notes (optional)
                                </label>
                                <textarea
                                    id="credit-plan-notes"
                                    rows={3}
                                    value={buyForm.data.notes}
                                    onChange={(e) => buyForm.setData('notes', e.target.value)}
                                    placeholder="Share your PO number, team preferences, or initial batch details..."
                                    className="w-full rounded-xl border border-ink/15 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder-faint focus:border-primary focus:outline-none"
                                />
                            </div>

                            <OrderAuthNotice user={user} fallbackPath="/pricing" />

                            <DialogFooter>
                                <button
                                    type="button"
                                    onClick={() => setCheckoutPlan(null)}
                                    className="cursor-pointer rounded-full border border-ink/15 px-5 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-page"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!isVerified || buyForm.processing}
                                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <span>{buyForm.processing ? 'Submitting...' : 'Confirm & Buy Credit Plan'}</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
