import React from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { SplitHero } from '@/Components/Home/SplitHero';
import { IntroBand } from '@/Components/Home/IntroBand';
import { StickyWorkCards } from '@/Components/Home/StickyWorkCards';
import { StatsGrid } from '@/Components/Home/StatsGrid';
import { ClientMarquees } from '@/Components/Home/ClientMarquees';
import { TeamPreview } from '@/Components/Home/TeamPreview';
import { RecentWorkShowcase } from '@/Components/Home/RecentWorkShowcase';
import { TestimonialsSlider } from '@/Components/Home/TestimonialsSlider';
import { Project, Service, TeamMember, Testimonial, Client } from '@/types/models';

interface HomeProps {
    featuredProjects: Project[];
    services: Service[];
    teamMembers: TeamMember[];
    testimonials: Testimonial[];
    clients?: Client[];
}

export default function Home({
    featuredProjects = [],
    services = [],
    teamMembers = [],
    testimonials = [],
    clients = [],
}: HomeProps) {
    return (
        <>
            <SeoHead
                title="Radical Digital Agency & Creative Engineering"
                description="CuttingEdger builds high-octane brand systems, kinetic software interfaces, and immersive web platforms for visionary innovators."
            />

            {/* 1. Hero Section (Option A Split Hero) */}
            <SplitHero />

            {/* 2. Intro Manifesto Band */}
            <IntroBand />

            {/* 3. Featured Work Sticky Stacked Cards */}
            <StickyWorkCards projects={featuredProjects} />

            {/* 4. Animated Stats Grid */}
            <StatsGrid />

            {/* 6. Dual Counter-Scrolling Client Marquees */}
            <ClientMarquees clients={clients} />

            {/* 7. Leadership Team */}
            <TeamPreview members={teamMembers} />

            {/* 8. Recent Work Kinetic Parallax Showcase (Agntix Design Agency Style) */}
            <RecentWorkShowcase projects={featuredProjects} />

            {/* 9. Accessible Testimonials Slider */}
            <TestimonialsSlider testimonials={testimonials} />
        </>
    );
}
