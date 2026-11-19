export type BillingType = 'one_time' | 'monthly';

export interface SelectedPlanPayload {
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

export interface PresetCreditPlan {
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
