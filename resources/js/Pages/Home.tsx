import React, { useCallback, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { ChatWidget } from '@/Components/Chat/ChatWidget';
import { SeoHead } from '@/Components/Common/SeoHead';
import { CaseStudySection } from '@/Components/Landing/CaseStudySection';
import { ClientsSection } from '@/Components/Landing/ClientsSection';
import { DemoModal } from '@/Components/Landing/DemoModal';
import { DigitalTwinsSection } from '@/Components/Landing/DigitalTwins/DigitalTwinsSection';
import { FaqSection } from '@/Components/Landing/FaqSection';
import { FooterSection } from '@/Components/Landing/FooterSection';
import { FullpageStage } from '@/Components/Landing/FullpageStage';
import { HeroSection } from '@/Components/Landing/HeroSection';
import { Menubar, sectionIndexFromUrl } from '@/Components/Landing/Menubar';
import { RetouchingSection } from '@/Components/Landing/RetouchingSection';
import { SECTION_INDEX, SECTIONS, STAGE_TRANSITION_MS } from '@/Components/Landing/shared';
import { CapabilitiesSection } from '@/Components/Landing/CapabilitiesSection';
import { ShowcaseSection } from '@/Components/Landing/ShowcaseSection';
import { SideDots } from '@/Components/Landing/SideDots';
import { TryOnSection } from '@/Components/Landing/TryOn/TryOnSection';
import { useFullpage } from '@/hooks/useFullpage';
import { Client, Project, Testimonial } from '@/types/models';

interface HomeProps {
    featuredProjects?: Project[];
    clients?: Client[];
    testimonials?: Testimonial[];
}

/** Stable fallbacks so the memoised sections do not re-render on every section change. */
const NO_PROJECTS: Project[] = [];
const NO_CLIENTS: Client[] = [];
const NO_TESTIMONIALS: Testimonial[] = [];

export default function Home({ featuredProjects = NO_PROJECTS, clients = NO_CLIENTS, testimonials = NO_TESTIMONIALS }: HomeProps) {
    const { url } = usePage();
    const [demoOpen, setDemoOpen] = useState(false);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const { index, goTo } = useFullpage(SECTIONS.length, STAGE_TRANSITION_MS, !demoOpen && !overlayOpen, sectionIndexFromUrl(url));

    const openDemo = useCallback(() => setDemoOpen(true), []);
    const closeDemo = useCallback(() => setDemoOpen(false), []);

    // Single-screen page: no document scrollbar.
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const isActive = (id: keyof typeof SECTION_INDEX) => index === SECTION_INDEX[id];
    const common = { goTo, openDemo };

    // Order must match SECTIONS in Components/Landing/shared.tsx.
    const sections = [
        <HeroSection {...common} active={isActive('hero')} />,
        <DigitalTwinsSection {...common} active={isActive('digital-twins')} onOverlayChange={setOverlayOpen} />,
        <TryOnSection {...common} active={isActive('try-on')} onOverlayChange={setOverlayOpen} />,
        <RetouchingSection {...common} active={isActive('retouching')} />,
        <ShowcaseSection {...common} active={isActive('showcase')} projects={featuredProjects} onOverlayChange={setOverlayOpen} />,
        <ClientsSection {...common} active={isActive('clients')} clients={clients} testimonials={testimonials} />,
        <CaseStudySection {...common} active={isActive('case-study')} projects={featuredProjects} />,
        <CapabilitiesSection {...common} active={isActive('capabilities')} />,
        <FaqSection {...common} active={isActive('faq')} />,
        <FooterSection {...common} active={isActive('contact')} />,
    ];

    return (
        <>
            <SeoHead
                title="AI Image Editing, Digital Twins & Post-Production"
                description="CuttingEdger blends AI-integrated image editing with expert post-production: digital twins, virtual try-on, retouching, 2D, 3D, DTP and video for fashion and e-commerce brands."
            />
            <FullpageStage index={index} sections={sections} />
            <Menubar index={index} goTo={goTo} openDemo={openDemo} hidden={overlayOpen} />
            <SideDots index={index} goTo={goTo} hidden={overlayOpen} />
            <DemoModal open={demoOpen} onClose={closeDemo} />
            {/* Floating chat, bottom right. Hidden (not unmounted) while a fullscreen overlay is open so the conversation survives. */}
            <div className={overlayOpen ? 'hidden' : undefined}>
                <ChatWidget />
            </div>
        </>
    );
}

/** Full-screen design: opt out of the persistent LandingLayout (header/footer). */
Home.layout = (page: React.ReactNode) => page;
