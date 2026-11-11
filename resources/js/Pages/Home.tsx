import React, { useCallback, useEffect, useState } from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { BookDemoSection } from '@/Components/Landing/BookDemoSection';
import { CaseStudySection } from '@/Components/Landing/CaseStudySection';
import { ClientsSection } from '@/Components/Landing/ClientsSection';
import { DemoModal } from '@/Components/Landing/DemoModal';
import { DigitalTwinsSection } from '@/Components/Landing/DigitalTwinsSection';
import { FaqSection } from '@/Components/Landing/FaqSection';
import { FooterSection } from '@/Components/Landing/FooterSection';
import { FullpageStage } from '@/Components/Landing/FullpageStage';
import { HeroSection } from '@/Components/Landing/HeroSection';
import { Menubar } from '@/Components/Landing/Menubar';
import { RetouchingSection } from '@/Components/Landing/RetouchingSection';
import { SECTIONS, SectionProps } from '@/Components/Landing/shared';
import { ShowcaseSection } from '@/Components/Landing/ShowcaseSection';
import { SideDots } from '@/Components/Landing/SideDots';
import { TryOnSection } from '@/Components/Landing/TryOnSection';
import { useFullpage } from '@/hooks/useFullpage';
import { getLenis } from '@/hooks/useSmoothScroll';
import { Client, Project } from '@/types/models';

interface HomeProps {
    featuredProjects?: Project[];
    clients?: Client[];
}

export default function Home({ featuredProjects = [], clients = [] }: HomeProps) {
    const [demoOpen, setDemoOpen] = useState(false);
    const { index, goTo } = useFullpage(SECTIONS.length, !demoOpen);

    const openDemo = useCallback(() => setDemoOpen(true), []);
    const closeDemo = useCallback(() => setDemoOpen(false), []);

    // Single-screen page: no document scrollbar, no smooth-scroll hijack.
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        getLenis()?.stop();
        return () => {
            document.body.style.overflow = previous;
            getLenis()?.start();
        };
    }, []);

    const sectionProps = (i: number): SectionProps => ({ active: index === i, goTo, openDemo });

    const sections = [
        <HeroSection {...sectionProps(0)} />,
        <DigitalTwinsSection {...sectionProps(1)} />,
        <TryOnSection {...sectionProps(2)} />,
        <RetouchingSection {...sectionProps(3)} />,
        <ShowcaseSection {...sectionProps(4)} projects={featuredProjects} />,
        <ClientsSection {...sectionProps(5)} clients={clients} />,
        <CaseStudySection {...sectionProps(6)} projects={featuredProjects} />,
        <BookDemoSection {...sectionProps(7)} />,
        <FaqSection {...sectionProps(8)} />,
        <FooterSection {...sectionProps(9)} />,
    ];
    return (
        <>
            <SeoHead
                title="AI Image Editing, Digital Twins & Post-Production"
                description="CuttingEdger blends AI-integrated image editing with expert post-production: digital twins, virtual try-on, retouching, 2D, 3D, DTP and video for fashion and e-commerce brands."
            />
            <FullpageStage index={index} sections={sections} />
            <Menubar index={index} goTo={goTo} openDemo={openDemo} />
            <SideDots index={index} goTo={goTo} />
            <DemoModal open={demoOpen} onClose={closeDemo} />
        </>
    );
}

/** Full-screen design: opt out of the persistent AppLayout (header/footer). */
Home.layout = (page: React.ReactNode) => page;
