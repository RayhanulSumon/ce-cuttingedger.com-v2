import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { OrderAuthNotice } from '@/Components/Common/OrderAuthNotice';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { AuthUser } from '@/types';
import { SelectedPlanPayload } from './types';

interface CreditCheckoutDialogProps {
    checkoutPlan: SelectedPlanPayload | null;
    onClose: () => void;
    user: AuthUser | null;
    isVerified: boolean;
    notes: string;
    onNotesChange: (value: string) => void;
    processing: boolean;
    onSubmit: (event: React.FormEvent) => void;
}

/** Confirmation modal for submitting a studio credit pack or custom credit plan order. */
export function CreditCheckoutDialog({
    checkoutPlan,
    onClose,
    user,
    isVerified,
    notes,
    onNotesChange,
    processing,
    onSubmit,
}: CreditCheckoutDialogProps) {
    return (
        <Dialog open={Boolean(checkoutPlan)} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Confirm Credit Plan Order</DialogTitle>
                    <DialogDescription>
                        Submit your plan order to receive an invoice and activate credits in your Client Portal.
                    </DialogDescription>
                </DialogHeader>

                {checkoutPlan && (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2 rounded-2xl border border-ink/10 bg-page p-4 text-sm">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-ink">{checkoutPlan.plan_name}</span>
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary-ink">
                                    {checkoutPlan.billing_type === 'monthly' ? 'Monthly Plan' : 'One-Time Pack'}
                                </span>
                            </div>
                            <div className="flex justify-between gap-2 text-muted">
                                <span>Base + Bonus Credits</span>
                                <span className="font-semibold tabular-nums text-ink">
                                    {checkoutPlan.base_credits.toLocaleString()} + {checkoutPlan.bonus_credits.toLocaleString()} ={' '}
                                    {(checkoutPlan.base_credits + checkoutPlan.bonus_credits).toLocaleString()} Credits
                                </span>
                            </div>
                            <div className="flex justify-between gap-2 text-muted">
                                <span>Credit Validity</span>
                                <span className="font-semibold text-ink">
                                    {checkoutPlan.validity_days} Days (starts upon activation)
                                </span>
                            </div>
                            <div className="flex justify-between gap-2 border-t border-ink/10 pt-2">
                                <span className="font-bold text-ink">Total Investment</span>
                                <span className="text-lg font-extrabold tabular-nums text-primary-ink">
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
                                value={notes}
                                onChange={(e) => onNotesChange(e.target.value)}
                                placeholder="Share your PO number, team preferences, or initial batch details..."
                                className="w-full rounded-xl border border-ink/15 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder-faint focus:border-primary focus:outline-none"
                            />
                        </div>

                        <OrderAuthNotice user={user} fallbackPath="/pricing" />

                        <DialogFooter>
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer rounded-full border border-ink/15 px-5 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-page"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isVerified || processing}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span>{processing ? 'Submitting...' : 'Confirm & Buy Credit Plan'}</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
