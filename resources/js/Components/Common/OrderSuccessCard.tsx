import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, PlusCircle } from 'lucide-react';

interface OrderSuccessCardProps {
    title: string;
    message: string;
    onReset: () => void;
    resetLabel?: string;
}

/**
 * Full-width confirmation state shown in place of the order/quote form after
 * a successful submission so the visitor sees confirmation immediately.
 */
export function OrderSuccessCard({
    title,
    message,
    onReset,
    resetLabel = 'Submit Another Request',
}: OrderSuccessCardProps) {
    return (
        <div className="mx-auto max-w-2xl rounded-3xl border border-success/25 bg-success-soft p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-success/25 bg-success-soft text-success">
                <CheckCircle2 size={28} />
            </div>

            <h2 className="mt-5 font-brand uppercase text-xl text-ink sm:text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-success sm:text-base">{message}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                    href="/portal"
                    prefetch
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110"
                >
                    View in Client Portal
                    <ArrowRight size={14} />
                </Link>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink/20 bg-surface px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-primary hover:text-primary"
                >
                    <PlusCircle size={14} />
                    {resetLabel}
                </button>
            </div>
        </div>
    );
}
