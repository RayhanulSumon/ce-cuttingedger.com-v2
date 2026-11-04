import React from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { SplitHero } from '@/Components/Home/SplitHero';
import { ClientMarquees } from '@/Components/Home/ClientMarquees';
import { IntroBand } from '@/Components/Home/IntroBand';
import { StickyServiceCards } from '@/Components/Home/StickyServiceCards';
import { AwardsShowcase } from '@/Components/Home/AwardsShowcase';
import { VideoShowcase } from '@/Components/Home/VideoShowcase';
import { BeforeAfterShowcase } from '@/Components/Home/BeforeAfterShowcase';
import { TeamPreview } from '@/Components/Home/TeamPreview';
import { StatsGrid } from '@/Components/Home/StatsGrid';
import { HomeFaqSection } from '@/Components/Home/HomeFaqSection';
import { Project, Service, TeamMember, Testimonial, Client } from '@/types/models';

interface HomeProps {
    featuredProjects: Project[];
    services: Service[];
    teamMembers: TeamMember[];
    testimonials: Testimonial[];
    clients?: Client[];
}

export default function Home({
    services = [],
    teamMembers = [],
    clients = [],
}: HomeProps) {
    return (
        <>
            <SeoHead
                title="Enterprise Visual Production, Accelerated by AI & 3D CGI | CuttingEdger"
                description="CuttingEdger empowers global luxury brands and corporate agencies with AI-powered visual production, 3D spatial CGI, and high-volume precision retouching."
            />

            {/* SECTION 1: The Hero Section (Interactive AI & Media Showcase with 4 Clickable Tabs) */}
            <SplitHero />

            {/* SECTION 2: Trust & Client Logos Bar ("Our Core Capabilities & Tech Stack" 2x5 Dark Grid) */}
            <ClientMarquees clients={clients} />

            {/* SECTION 3: Intro Statement & Value Proposition (48% Base Opacity Scroll-Reveal) */}
            <IntroBand />

            {/* SECTION 4: The AI & B2B Service Grid (4-Card Bento Grid + Layered Stacked Cards) */}
            <StickyServiceCards services={services} />

            {/* Awards Bar: "JUST A FEW OF OUR AWARDS..." (Matching Reference Layout) */}
            <AwardsShowcase />

            {/* SECTION 5: Portfolio & Case Study Showcase (Curved ROI Vertical Cards + Interactive Before/After Sliders) */}
            <VideoShowcase />
            <BeforeAfterShowcase />

            {/* SECTION 7: Leadership & Team Section ("Executive Leadership & Creative Directors") */}
            <TeamPreview members={teamMembers} />

            {/* SECTION 6: "Why CuttingEdger?" (Studio Metrics Strip + Traditional vs. AI Workflow Comparison) */}
            <StatsGrid />

            {/* SECTION 8: FAQ Accordion ("Frequent questions.") — High-Conversion Footer follows in AppLayout */}
            <HomeFaqSection />
        </>
    );
}
