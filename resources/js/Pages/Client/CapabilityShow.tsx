import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
    Coins,
    Plus,
    Shirt,
    SlidersHorizontal,
    Sparkles,
    Users,
} from 'lucide-react';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { AiBgRemoveWorkspace } from '@/Components/Client/AiBgRemoveWorkspace';
import { AiJobItem } from '@/Components/Client/aiStudioApi';
import { AiTryOnWorkspace } from '@/Components/Client/AiTryOnWorkspace';
import { BuyCreditsModal, CreditPack } from '@/Components/Client/BuyCreditsModal';
import { PortalDigitalTwinsCatalog } from '@/Components/Client/PortalDigitalTwinsCatalog';
import { SeoHead } from '@/Components/Common/SeoHead';
import {
    DigitalTwinAttributeItem,
    DigitalTwinModel,
} from '@/Components/Landing/DigitalTwins/twins';
import { Look } from '@/Components/Landing/TryOn/looks';
import { DigitalTwinOrderConfigurator } from '@/Components/Services/DigitalTwinOrderConfigurator';
import { TryOnOrderConfigurator } from '@/Components/Services/TryOnOrderConfigurator';
import { Button } from '@/Components/ui/button';
import { getClientLayout } from '@/Layouts/Client/ClientLayout';
import { PageProps } from '@/types';

interface ClientCapabilityShowProps {
    capability: {
        slug: 'background-removal' | 'digital-twins' | 'virtual-try-on';
        title: string;
        subtitle: string;
    };
    creditPacks: CreditPack[];
    digitalTwins?: DigitalTwinModel[];
    attributes?: DigitalTwinAttributeItem[];
    tryOnLooks?: Look[];
    initialJobs?: AiJobItem[];
    initialMode?: 'custom' | 'preset' | 'lifetime';
    initialTwinSlug?: string;
    initialReference?: string;
    initialLook?: string;
}

export default function ClientCapabilityShow({
    capability,
    creditPacks = [],
    digitalTwins = [],
    attributes = [],
    tryOnLooks = [],
    initialJobs = [],
    initialMode = 'custom',
    initialTwinSlug = '',
    initialReference = '',
    initialLook = '',
}: ClientCapabilityShowProps) {
    const { auth } = usePage<PageProps>().props;
    const [creditBalance, setCreditBalance] = useState<number>(auth?.user?.credits_balance ?? 0);
    const [buyModalOpen, setBuyModalOpen] = useState(false);

    const [twinTab, setTwinTab] = useState<'customize' | 'catalog'>('customize');
    const [selectedCatalogTwin, setSelectedCatalogTwin] = useState<DigitalTwinModel | null>(null);
    const [tryOnTab, setTryOnTab] = useState<'order' | 'ai'>('order');

    useEffect(() => {
        setCreditBalance(auth?.user?.credits_balance ?? 0);
    }, [auth?.user?.credits_balance]);

    useEffect(() => {
        setTwinTab('customize');
        setSelectedCatalogTwin(null);
        setTryOnTab('order');
    }, [capability.slug]);

    return (
        <>
            <SeoHead
                title={`${capability.title} — Client Workspace`}
                description={capability.subtitle}
            />

            <AdminPageHeader title={capability.title} description={capability.subtitle}>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary-soft px-3 py-2 text-xs font-bold text-primary-ink">
                        <Coins className="h-3.5 w-3.5 text-primary" />
                        <span className="tabular-nums">{creditBalance.toLocaleString()} Credits</span>
                    </div>
                    <Button
                        type="button"
                        onClick={() => setBuyModalOpen(true)}
                        className="cursor-pointer gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Buy Credits</span>
                    </Button>
                </div>
            </AdminPageHeader>

            <div className="space-y-6">
                {capability.slug === 'background-removal' && (
                    <AiBgRemoveWorkspace
                        initialJobs={initialJobs}
                        onBalanceUpdate={setCreditBalance}
                    />
                )}

                {capability.slug === 'digital-twins' && (
                    <>
                        <div className="inline-flex rounded-2xl border border-line bg-surface p-1.5 shadow-xs">
                            <button
                                type="button"
                                onClick={() => setTwinTab('customize')}
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                    twinTab === 'customize'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'text-muted hover:text-ink'
                                }`}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>Customize Digital Twin</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTwinTab('catalog')}
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                    twinTab === 'catalog'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'text-muted hover:text-ink'
                                }`}
                            >
                                <Users className="h-4 w-4" />
                                <span>Browse Studio Twins</span>
                            </button>
                        </div>

                        {twinTab === 'customize' ? (
                            <DigitalTwinOrderConfigurator
                                digitalTwins={digitalTwins}
                                attributes={attributes}
                                initialMode={initialMode}
                                initialTwinSlug={initialTwinSlug}
                                initialReference={initialReference}
                                externalSelectedTwin={selectedCatalogTwin}
                                embedded
                            />
                        ) : (
                            <PortalDigitalTwinsCatalog
                                digitalTwins={digitalTwins}
                                onCustomizeTwin={(twin) => {
                                    setSelectedCatalogTwin(twin);
                                    setTwinTab('customize');
                                }}
                            />
                        )}
                    </>
                )}

                {capability.slug === 'virtual-try-on' && (
                    <>
                        <div className="inline-flex rounded-2xl border border-line bg-surface p-1.5 shadow-xs">
                            <button
                                type="button"
                                onClick={() => setTryOnTab('order')}
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                    tryOnTab === 'order'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'text-muted hover:text-ink'
                                }`}
                            >
                                <Shirt className="h-4 w-4" />
                                <span>Virtual Try-On Order</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTryOnTab('ai')}
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                    tryOnTab === 'ai'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'text-muted hover:text-ink'
                                }`}
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Instant AI Try-On</span>
                            </button>
                        </div>

                        {tryOnTab === 'order' ? (
                            <TryOnOrderConfigurator
                                tryOnLooks={tryOnLooks}
                                initialLook={initialLook}
                                embedded
                            />
                        ) : (
                            <AiTryOnWorkspace
                                initialJobs={initialJobs}
                                digitalTwins={digitalTwins}
                                onBalanceUpdate={setCreditBalance}
                            />
                        )}
                    </>
                )}
            </div>

            <BuyCreditsModal
                open={buyModalOpen}
                onOpenChange={setBuyModalOpen}
                packs={creditPacks}
                currentBalance={creditBalance}
            />
        </>
    );
}

ClientCapabilityShow.layout = getClientLayout;
