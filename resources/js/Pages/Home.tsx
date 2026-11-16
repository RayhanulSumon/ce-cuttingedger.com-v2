import React, { useCallback, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { ChatWidget } from '@/Components/Chat/ChatWidget';
import { ScrollToTop, useScrolledPast } from '@/Components/Common/ScrollToTop';
import { SeoHead } from '@/Components/Common/SeoHead';
import { CaseStudySection } from '@/Components/Landing/CaseStudySection';
import { ClientsSection } from '@/Components/Landing/ClientsSection';
import { DemoModal } from '@/Components/Landing/DemoModal';
import { DigitalTwinsSection } from '@/Components/Landing/DigitalTwins/DigitalTwinsSection';
import { DigitalTwinModel } from '@/Components/Landing/DigitalTwins/twins';
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
import { Look } from '@/Components/Landing/TryOn/looks';
import { TryOnSection } from '@/Components/Landing/TryOn/TryOnSection';
import { useFullpage } from '@/hooks/useFullpage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Client, Project, Testimonial } from '@/types/models';

interface HomeProps {
    digitalTwins?: DigitalTwinModel[];
    tryOnLooks?: Look[];
    featuredProjects?: Project[];
    clients?: Client[];
    testimonials?: Testimonial[];
}

/** Stable fallbacks so the memoised sections do not re-render on every section change. */
const NO_TWINS: DigitalTwinModel[] = [];
const NO_LOOKS: Look[] = [];
const NO_PROJECTS: Project[] = [];
const NO_CLIENTS: Client[] = [];
const NO_TESTIMONIALS: Testimonial[] = [];

/** Sections that use a fixed viewport stage layout rather than natural vertical flow on mobile. */
const STAGE_BOUNDED_SECTIONS = new Set<number>([
    SECTION_INDEX.hero,
    SECTION_INDEX['digital-twins'],
    SECTION_INDEX.showcase,
    SECTION_INDEX.clients,
]);

export default function Home({
    digitalTwins = NO_TWINS,
    tryOnLooks = NO_LOOKS,
    featuredProjects = NO_PROJECTS,
    clients = NO_CLIENTS,
    testimonials = NO_TESTIMONIALS,
}: HomeProps) {
    const { url } = usePage();
    const initialSection = sectionIndexFromUrl(url);
    const isMobile = useMediaQuery('(max-width: 767px)') === true;
    const scrolledPast = useScrolledPast(400);
    const [demoOpen, setDemoOpen] = useState(false);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const { index, goTo: goToFullpage } = useFullpage(
        SECTIONS.length,
        STAGE_TRANSITION_MS,
        !isMobile && !demoOpen && !overlayOpen,
        initialSection,
    );

    const openDemo = useCallback(() => setDemoOpen(true), []);
    const closeDemo = useCallback(() => setDemoOpen(false), []);

    const goToMobile = useCallback((nextIndex: number) => {
        const clamped = Math.max(0, Math.min(SECTIONS.length - 1, nextIndex));
        if (clamped === SECTION_INDEX.hero) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        document.getElementById(SECTIONS[clamped].id)?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const goTo = isMobile ? goToMobile : goToFullpage;

    // Single-screen page on desktop: no document scrollbar. Mobile uses normal vertical scroll.
    useEffect(() => {
        if (isMobile) {
            document.body.style.overflow = '';
            return;
        }
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobile]);

    // Deep-link support (e.g. /?section=try-on) when opening on mobile.
    useEffect(() => {
        if (!isMobile || initialSection === 0) {
            return;
        }
        document.getElementById(SECTIONS[initialSection].id)?.scrollIntoView({ behavior: 'auto' });
    }, [isMobile, initialSection]);

    const isActive = (id: keyof typeof SECTION_INDEX) => isMobile || index === SECTION_INDEX[id];
    const common = { goTo, openDemo };

    // Order must match SECTIONS in Components/Landing/shared.tsx.
    const sections = [
        <HeroSection {...common} active={isActive('hero')} />,
        <DigitalTwinsSection {...common} twins={digitalTwins} active={isActive('digital-twins')} onOverlayChange={setOverlayOpen} />,
        <TryOnSection {...common} looks={tryOnLooks} active={isActive('try-on')} onOverlayChange={setOverlayOpen} />,
        <RetouchingSection {...common} active={isActive('retouching')} />,
        <ShowcaseSection {...common} active={isActive('showcase')} projects={featuredProjects} onOverlayChange={setOverlayOpen} />,
        <ClientsSection {...common} active={isActive('clients')} clients={clients} testimonials={testimonials} />,
        <CaseStudySection {...common} active={isActive('case-study')} projects={featuredProjects} />,
        <CapabilitiesSection {...common} active={isActive('capabilities')} />,
        <FaqSection {...common} active={isActive('faq')} />,
        <FooterSection {...common} active={isActive('contact')} />,
    ];

    const menuIndex = isMobile ? (scrolledPast ? 1 : 0) : index;
    const scrollTopVisible = isMobile ? scrolledPast : index > SECTION_INDEX.hero;

    return (
        <>
            <SeoHead
                title="AI Image Editing, Digital Twins & Post-Production"
                description="CuttingEdger blends AI-integrated image editing with expert post-production: digital twins, virtual try-on, retouching, 2D, 3D, DTP and video for fashion and e-commerce brands."
            />
            {isMobile ? (
                <main className="w-full">
                    {sections.map((section, i) => (
                        <section
                            key={SECTIONS[i].id}
                            id={SECTIONS[i].id}
                            className={STAGE_BOUNDED_SECTIONS.has(i) ? 'h-[100svh] w-full overflow-hidden' : 'w-full'}
                        >
                            {section}
                        </section>
                    ))}
                </main>
            ) : (
                <>
                    <FullpageStage index={index} sections={sections} />
                    <SideDots index={index} goTo={goTo} hidden={overlayOpen} />
                </>
            )}
            <Menubar index={menuIndex} goTo={goTo} openDemo={openDemo} hidden={overlayOpen} />
            <DemoModal open={demoOpen} onClose={closeDemo} />
            {/* Floating chat, bottom right. Hidden (not unmounted) while a fullscreen overlay is open so the conversation survives. */}
            <div className={overlayOpen ? 'hidden' : undefined}>
                <ScrollToTop visible={scrollTopVisible} onClick={() => goTo(SECTION_INDEX.hero)} />
                <ChatWidget />
            </div>
        </>
    );
}

/** Full-screen design: opt out of the persistent LandingLayout (header/footer). */
Home.layout = (page: React.ReactNode) => page;
