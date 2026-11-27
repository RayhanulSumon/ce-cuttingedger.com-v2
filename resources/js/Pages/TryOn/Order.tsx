import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Look } from '@/Components/Landing/TryOn/looks';
import { PAD_X } from '@/Components/Landing/shared';
import {
    TRY_ON_STAGE_BACKGROUND,
    TryOnOrderConfigurator,
} from '@/Components/Services/TryOnOrderConfigurator';
import { LandingLayout } from '@/Layouts/LandingLayout';

interface TryOnOrderProps {
    tryOnLooks?: Look[];
    initialLook?: string;
    initialService?: string;
}

export default function TryOnOrder({ tryOnLooks, initialLook = '' }: TryOnOrderProps) {
    return (
        <div className="min-h-screen bg-surface text-ink">
            <SeoHead
                title="Order Virtual Try-On — AI Garment Draping & Fitting"
                description="Select one of our studio models or upload your own model, attach your Top, Bottom, and Shoes garment photos, and submit your Virtual Try-On order."
            />

            {/* Header Hero */}
            <section
                style={{ background: TRY_ON_STAGE_BACKGROUND }}
                className={`border-b border-ink/10 pb-6 pt-24 sm:pt-28 ${PAD_X}`}
            >
                <div className="mx-auto max-w-7xl">
                    <Link
                        href="/#try-on"
                        prefetch
                        className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.18em] text-subtle transition-colors hover:text-ink"
                    >
                        <ArrowLeft size={13} />
                        Back to Virtual Try-On
                    </Link>

                    <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                        <div>
                            <p className="text-2xs font-semibold uppercase tracking-[0.22em] text-primary">
                                Virtual Try-On Studio // Custom Order
                            </p>
                            <h1 className="mt-1 font-display text-[clamp(24px,2.8vw,36px)] leading-[1.1] text-ink">
                                Order Virtual Try-On
                            </h1>
                            <p className="mt-1.5 max-w-[58ch] text-xs leading-[1.6] text-subtle sm:text-sm">
                                Select a studio runway model or upload your own, attach your garments, and submit your order.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 self-start rounded-full border border-ink/10 bg-surface/85 px-4 py-2 text-xs font-semibold text-ink shadow-xs lg:self-end">
                            <Sparkles size={14} className="text-primary" />
                            <span>AI Garment Fitting • Delivered within 1 business day</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Form Content */}
            <main className={`py-7 sm:py-10 ${PAD_X}`}>
                <div className="mx-auto max-w-7xl">
                    <TryOnOrderConfigurator tryOnLooks={tryOnLooks} initialLook={initialLook} />
                </div>
            </main>
        </div>
    );
}

TryOnOrder.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;
