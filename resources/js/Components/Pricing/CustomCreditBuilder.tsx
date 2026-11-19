import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { BillingType, SelectedPlanPayload } from './types';

const SLIDER_MIN = 250;
const SLIDER_MAX = 20000;
const SLIDER_STEP = 250;
const SLIDER_PRESETS = [500, 1000, 2500, 5000, 10000];

function getVolumeBonusPercent(credits: number): number {
    if (credits >= 10000) return 30;
    if (credits >= 5000) return 25;
    if (credits >= 3500) return 20;
    if (credits >= 2000) return 15;
    if (credits >= 1000) return 10;
    return 0;
}

interface CustomCreditBuilderProps {
    onSelectPlan: (plan: Omit<SelectedPlanPayload, 'notes'>) => void;
}

/** Interactive custom credit volume builder with live volume & monthly bonus calculation. */
export function CustomCreditBuilder({ onSelectPlan }: CustomCreditBuilderProps) {
    const [customCredits, setCustomCredits] = useState<number>(2500);
    const [billingType, setBillingType] = useState<BillingType>('one_time');

    const quote = useMemo(() => {
        const volumeBonusPct = getVolumeBonusPercent(customCredits);
        const monthlyBonusPct = billingType === 'monthly' ? 10 : 0;
        const totalBonusPct = volumeBonusPct + monthlyBonusPct;
        const bonusCredits = Math.round((customCredits * totalBonusPct) / 100);
        const totalCredits = customCredits + bonusCredits;
        const totalPrice = Number((customCredits * 0.5).toFixed(2));
        const effectivePerCredit = (totalPrice / Math.max(1, totalCredits)).toFixed(2);
        const validityDays =
            billingType === 'monthly' ? 30 : customCredits >= 5000 ? 365 : customCredits >= 2000 ? 180 : 90;

        return {
            totalBonusPct,
            bonusCredits,
            totalCredits,
            totalPrice,
            validityDays,
            effectivePerCredit,
        };
    }, [customCredits, billingType]);

    const sliderProgress = ((customCredits - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

    return (
        <div className="mx-auto max-w-4xl rounded-2xl border border-ink/10 bg-surface p-6 sm:rounded-3xl sm:p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
                {/* Left Controls */}
                <div className="flex flex-col justify-between gap-6 lg:col-span-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-display font-bold tracking-tight text-ink sm:text-2xl">
                                Customize your credit volume
                            </h2>
                            <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                                Volume bonuses apply automatically starting at 1,000 credits.
                            </p>
                        </div>

                        <div
                            role="group"
                            aria-label="Billing frequency"
                            className="inline-flex rounded-full border border-ink/10 bg-page p-1"
                        >
                            <button
                                type="button"
                                onClick={() => setBillingType('one_time')}
                                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                    billingType === 'one_time'
                                        ? 'bg-ink text-white'
                                        : 'text-muted hover:text-ink'
                                }`}
                            >
                                One-Time
                            </button>
                            <button
                                type="button"
                                onClick={() => setBillingType('monthly')}
                                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                    billingType === 'monthly'
                                        ? 'bg-primary text-white'
                                        : 'text-muted hover:text-ink'
                                }`}
                            >
                                Monthly +10%
                            </button>
                        </div>
                    </div>

                    {/* Volume Range Slider */}
                    <div className="space-y-3">
                        <div className="flex items-baseline justify-between gap-3">
                            <label
                                htmlFor="custom-credits-slider"
                                className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle"
                            >
                                Base credits
                            </label>
                            <span className="text-2xl font-display font-extrabold tabular-nums text-ink">
                                {customCredits.toLocaleString()} credits
                            </span>
                        </div>

                        <input
                            id="custom-credits-slider"
                            type="range"
                            min={SLIDER_MIN}
                            max={SLIDER_MAX}
                            step={SLIDER_STEP}
                            value={customCredits}
                            onChange={(e) => setCustomCredits(Number(e.target.value))}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg accent-primary"
                            style={{
                                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${sliderProgress}%, color-mix(in srgb, var(--color-ink) 12%, transparent) ${sliderProgress}%, color-mix(in srgb, var(--color-ink) 12%, transparent) 100%)`,
                            }}
                        />

                        <div className="flex justify-between text-[11px] font-medium text-subtle">
                            <span>{SLIDER_MIN.toLocaleString()}</span>
                            <span>{SLIDER_MAX.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Quick Preset Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-xs font-medium text-subtle">Presets:</span>
                        {SLIDER_PRESETS.map((amount) => (
                            <button
                                key={amount}
                                type="button"
                                onClick={() => setCustomCredits(amount)}
                                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold tabular-nums transition-colors ${
                                    customCredits === amount
                                        ? 'bg-ink text-white'
                                        : 'border border-ink/10 bg-page text-ink-2 hover:border-ink/25 hover:text-ink'
                                }`}
                            >
                                {amount.toLocaleString()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Summary Card */}
                <div className="flex flex-col justify-between rounded-2xl border border-ink/8 bg-page/75 p-5 sm:p-6 lg:col-span-5">
                    <div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
                                Estimated total
                            </span>
                            {quote.totalBonusPct > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary-ink">
                                    <Sparkles className="h-3 w-3" />
                                    +{quote.totalBonusPct}% Bonus
                                </span>
                            )}
                        </div>

                        <div className="mt-3 flex items-baseline justify-between gap-2 border-b border-ink/10 pb-3.5">
                            <span className="text-3xl font-display font-extrabold tracking-tight tabular-nums text-ink sm:text-4xl">
                                ${quote.totalPrice.toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-primary-ink">
                                ${quote.effectivePerCredit} / credit
                            </span>
                        </div>

                        <dl className="mt-3.5 space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between gap-2">
                                <dt className="text-muted">Base credits</dt>
                                <dd className="font-semibold tabular-nums text-ink">
                                    {customCredits.toLocaleString()}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-2">
                                <dt className="text-muted">Bonus credits</dt>
                                <dd className="font-semibold tabular-nums text-primary-ink">
                                    +{quote.bonusCredits.toLocaleString()}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-2">
                                <dt className="text-muted">Validity</dt>
                                <dd className="font-semibold text-ink">{quote.validityDays} days</dd>
                            </div>
                            <div className="flex justify-between gap-2 border-t border-ink/10 pt-2">
                                <dt className="font-bold text-ink">Total credits</dt>
                                <dd className="font-extrabold tabular-nums text-ink">
                                    {quote.totalCredits.toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onSelectPlan({
                                pricing_plan_id: null,
                                plan_name: 'Custom Credit Plan',
                                base_credits: customCredits,
                                bonus_credits: quote.bonusCredits,
                                total_price: quote.totalPrice,
                                billing_type: billingType,
                                validity_days: quote.validityDays,
                                features: [
                                    `${customCredits.toLocaleString()} base studio credits`,
                                    quote.totalBonusPct > 0
                                        ? `+${quote.totalBonusPct}% bonus (${quote.bonusCredits.toLocaleString()} extra credits)`
                                        : 'Standard pay-as-you-go credit rate',
                                    `Valid for ${quote.validityDays} days from activation`,
                                ],
                            })
                        }
                        className="group mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-hover"
                    >
                        <span>Buy Custom Plan</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
