import React, { useState } from 'react';
import { Check, Coins, CreditCard, Loader2, Sparkles } from 'lucide-react';
import { toast } from '@/Components/ui/sonner';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';

export interface CreditPack {
    id: string;
    name: string;
    credits: number;
    price_cents: number;
    price_usd: number;
    badge: string | null;
    description: string;
}

interface BuyCreditsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    packs: CreditPack[];
    currentBalance: number;
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export function BuyCreditsModal({
    open,
    onOpenChange,
    packs,
    currentBalance,
}: BuyCreditsModalProps) {
    const [loadingPackId, setLoadingPackId] = useState<string | null>(null);

    const handleCheckout = async (packId: string) => {
        setLoadingPackId(packId);
        try {
            const response = await fetch('/api/credits/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ pack_id: packId }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Unable to start Stripe Checkout.');
            }

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
                return;
            }

            throw new Error('Missing Stripe Checkout URL.');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Checkout failed.');
            setLoadingPackId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-2xl border-line bg-surface p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold text-ink">
                        <Coins className="h-5 w-5 text-primary" />
                        <span>Top Up AI Studio Credits</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-subtle">
                        Current balance:{' '}
                        <span className="font-bold text-ink">
                            {currentBalance.toLocaleString()} credits
                        </span>
                        . Instant activation via Stripe Checkout.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {packs.map((pack) => {
                        const isLoading = loadingPackId === pack.id;
                        return (
                            <div
                                key={pack.id}
                                className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                                    pack.badge === 'Most Popular'
                                        ? 'border-primary bg-primary-soft/20 shadow-xs'
                                        : 'border-line bg-surface-2/40'
                                }`}
                            >
                                <div>
                                    {pack.badge && (
                                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-2xs font-bold text-primary-foreground">
                                            <Sparkles className="h-3 w-3" />
                                            {pack.badge}
                                        </span>
                                    )}
                                    <h3 className="text-sm font-bold text-ink">{pack.name}</h3>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-2xl font-extrabold tabular-nums text-ink">
                                            ${pack.price_usd}
                                        </span>
                                        <span className="text-xs text-subtle">USD</span>
                                    </div>
                                    <p className="mt-1 text-xs font-bold text-primary">
                                        {pack.credits.toLocaleString()} Credits
                                    </p>
                                    <p className="mt-2 text-2xs leading-relaxed text-subtle">
                                        {pack.description}
                                    </p>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-1.5 text-2xs text-subtle">
                                        <Check className="h-3.5 w-3.5 text-success" />
                                        <span>Auto-refund on failed jobs</span>
                                    </div>
                                    <Button
                                        type="button"
                                        disabled={loadingPackId !== null}
                                        onClick={() => handleCheckout(pack.id)}
                                        className="w-full cursor-pointer gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <CreditCard className="h-3.5 w-3.5" />
                                        )}
                                        <span>{isLoading ? 'Redirecting…' : 'Buy with Stripe'}</span>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
