import React, { useMemo, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowUpRight, Check } from 'lucide-react';
import { isVerifiedClient } from '@/Components/Common/OrderAuthNotice';
import { PageProps } from '@/types';
import { PricingPlan } from '@/types/models';
import { CreditCheckoutDialog } from './CreditCheckoutDialog';
import { CustomCreditBuilder } from './CustomCreditBuilder';
import { PresetCreditPlan, SelectedPlanPayload } from './types';

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
            'Use across 2D, 3D, DTP & Try-On',
            '24h standard turnaround',
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
            'Use across 2D, 3D, DTP & Try-On',
            '12–18h priority studio turnaround',
            'Dedicated style guide & QA memory',
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
            'Use across 2D, 3D, DTP & Try-On',
            'Sub-6h rush lane & dedicated pod',
            'Custom SFTP / API & Net-30 terms',
        ],
    },
];

const CREDIT_USAGE_GUIDE = [
    { service: '2D Retouching', cost: '1 credit / image' },
    { service: 'Ghost Mannequin', cost: '2 credits / image' },
    { service: 'Virtual Try-On / DTP', cost: '4 credits' },
    { service: '3D / Digital Twin', cost: '50 credits' },
];

/** Studio Credit Plans with compact header, Credit Packs / Custom Pack tabs, and checkout modal. */
export function PricingCardsSection({ plans = [] }: { plans?: PricingPlan[] }) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user ?? null;
    const isVerified = isVerifiedClient(user);
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

    return (
        <section id="pricing-plans-section" className="bg-page pb-12 pt-24 sm:pb-16 sm:pt-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Compact Centered Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-2xs font-semibold uppercase tracking-[0.22em] text-primary-ink">
                        Studio Credit Plans
                    </p>
                    <h1 className="mt-1.5 text-2xl font-display font-extrabold leading-[1.1] tracking-tight text-ink sm:text-4xl">
                        Simple credit plans. <span className="text-primary">Flexible production.</span>
                    </h1>
                    <p className="mt-2 text-sm text-muted sm:text-base">
                        Pick a credit pack or build your exact volume. Spend credits across 2D, 3D, Try-On, DTP &amp; Video.
                    </p>
                </div>

                {/* Accessible 2-Tab Switcher: Credit Packs vs Custom Pack */}
                <Tabs.Root defaultValue="packs" className="mt-6">
                    <div className="flex justify-center">
                        <Tabs.List
                            aria-label="Pricing options"
                            className="inline-flex items-center rounded-full border border-ink/10 bg-surface p-1 shadow-xs"
                        >
                            <Tabs.Trigger
                                value="packs"
                                className="cursor-pointer rounded-full px-5 py-2 text-xs font-semibold text-muted transition-colors hover:text-ink data-[state=active]:bg-ink data-[state=active]:text-white data-[state=active]:shadow-xs sm:text-sm"
                            >
                                Credit Packs
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="custom"
                                className="cursor-pointer rounded-full px-5 py-2 text-xs font-semibold text-muted transition-colors hover:text-ink data-[state=active]:bg-ink data-[state=active]:text-white data-[state=active]:shadow-xs sm:text-sm"
                            >
                                Custom Pack
                            </Tabs.Trigger>
                        </Tabs.List>
                    </div>

                    <Tabs.Content value="packs" className="mt-7 focus-visible:outline-none">
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                            {displayPlans.map((plan) => {
                                const isPopular = Boolean(plan.popular);
                                const totalCredits = plan.baseCredits + plan.bonusCredits;

                                return (
                                    <article
                                        key={plan.id}
                                        className={`flex flex-col justify-between rounded-2xl bg-surface p-6 transition-colors duration-200 sm:rounded-3xl sm:p-7 ${
                                            isPopular
                                                ? 'border-2 border-primary shadow-[0_16px_40px_-24px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]'
                                                : 'border border-ink/10 hover:border-ink/20'
                                        }`}
                                    >
                                        <div>
                                            {isPopular ? (
                                                <span className="inline-flex rounded-full bg-primary px-2.5 py-0.5 text-2xs font-bold uppercase tracking-[0.16em] text-primary-foreground">
                                                    {plan.eyebrow}
                                                </span>
                                            ) : (
                                                <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-subtle">
                                                    {plan.eyebrow}
                                                </p>
                                            )}

                                            <h2 className="mt-3 text-xl font-display font-bold tracking-tight text-ink">
                                                {plan.name}
                                            </h2>
                                            <p className="mt-1.5 text-sm leading-relaxed text-muted">
                                                {plan.description}
                                            </p>

                                            <div className="mt-5 rounded-2xl border border-ink/8 bg-page/75 p-4">
                                                {/* Main Highlight: Total Credits (Primary Value) */}
                                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                    <p className="flex items-baseline gap-1.5 font-display tracking-tight text-ink">
                                                        <span className="text-3xl font-extrabold tabular-nums sm:text-[34px]">
                                                            {totalCredits.toLocaleString()}
                                                        </span>
                                                        <span className="text-sm font-bold text-ink-2">
                                                            credits
                                                        </span>
                                                    </p>
                                                    {plan.bonusCredits > 0 ? (
                                                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-2xs font-bold text-primary-ink">
                                                            +{plan.bonusCredits.toLocaleString()} bonus
                                                        </span>
                                                    ) : (
                                                        <span className="text-2xs font-medium text-subtle">
                                                            Standard pack
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Secondary Row: Dollar Amount, Rate & Validity */}
                                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 pt-2.5 text-xs">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-base font-display font-bold tabular-nums text-ink">
                                                            ${plan.totalPrice.toLocaleString()}
                                                        </span>
                                                        <span className="font-semibold text-primary-ink">
                                                            ({plan.effectiveRate})
                                                        </span>
                                                    </div>
                                                    <span className="text-subtle">
                                                        {plan.validityDays}-day validity
                                                    </span>
                                                </div>
                                            </div>

                                            <ul className="mt-5 space-y-2.5">
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
                                            className={`group mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-300 ${
                                                isPopular
                                                    ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                                                    : 'bg-ink text-surface hover:bg-primary hover:text-primary-foreground'
                                            }`}
                                        >
                                            <span>{plan.buttonLabel}</span>
                                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="custom" className="mt-7 focus-visible:outline-none">
                        <CustomCreditBuilder onSelectPlan={openBuyModal} />
                    </Tabs.Content>
                </Tabs.Root>

                {/* Compact Inline Credit Usage Guide */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-ink/10 pt-5 text-xs text-muted">
                    <span className="font-semibold uppercase tracking-[0.14em] text-subtle">Credit guide:</span>
                    {CREDIT_USAGE_GUIDE.map((item, idx) => (
                        <React.Fragment key={item.service}>
                            {idx > 0 && (
                                <span aria-hidden="true" className="hidden text-ink/20 sm:inline">
                                    |
                                </span>
                            )}
                            <span>
                                <strong className="font-semibold text-ink">{item.service}</strong>{' '}
                                <span className="text-primary-ink">{item.cost}</span>
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <CreditCheckoutDialog
                checkoutPlan={checkoutPlan}
                onClose={() => setCheckoutPlan(null)}
                user={user}
                isVerified={isVerified}
                notes={buyForm.data.notes}
                onNotesChange={(value) => buyForm.setData('notes', value)}
                processing={buyForm.processing}
                onSubmit={handleConfirmPurchase}
            />
        </section>
    );
}
