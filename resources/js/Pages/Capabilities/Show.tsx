import React from 'react';
import {
    CapabilityVisualStudio,
} from '@/Components/Capabilities/CapabilityVisualStudio';
import { pathForCapability } from '@/Components/Capabilities/CapabilityShared';
import { DigitalTwinsShowcase } from '@/Components/Capabilities/DigitalTwinsShowcase';
import { VirtualTryOnFittingRoom } from '@/Components/Capabilities/VirtualTryOnFittingRoom';
import { SeoHead } from '@/Components/Common/SeoHead';
import { DigitalTwinModel } from '@/Components/Landing/DigitalTwins/twins';
import { Look } from '@/Components/Landing/TryOn/looks';
import { Capability } from '@/types/models';

interface CapabilityShowProps {
    capability: Capability;
    related: Capability[];
    digitalTwins?: DigitalTwinModel[];
    tryOnLooks?: Look[];
}

/**
 * Every capability and sub-capability page renders a dedicated visual studio layout
 * while receiving only SEO and routing metadata from the backend API.
 */
export default function Show({ capability, related = [], digitalTwins }: CapabilityShowProps) {
    const parent = (capability.parent as Capability | null) ?? null;
    const seoTitle = capability.meta_title || `${capability.title} | CuttingEdger`;
    const seoDescription = capability.meta_description || capability.subtitle;

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Capabilities', url: '/capabilities' },
        ...(parent ? [{ name: parent.title, url: `/capabilities/${parent.slug}` }] : []),
        { name: capability.title, url: pathForCapability(capability, parent) },
    ];

    return (
        <>
            <SeoHead
                title={seoTitle}
                description={seoDescription}
                breadcrumbs={breadcrumbs}
                serviceSchema={{
                    name: capability.title,
                    description: seoDescription,
                    serviceType: capability.title,
                }}
            />

            {capability.slug === 'virtual-try-on' ? (
                <VirtualTryOnFittingRoom capability={capability} parent={parent} />
            ) : capability.slug === 'digital-twins' ? (
                <DigitalTwinsShowcase capability={capability} parent={parent} digitalTwins={digitalTwins} />
            ) : (
                <CapabilityVisualStudio capability={capability} parent={parent} related={related} />
            )}
        </>
    );
}
