import React from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { SplitHero } from '@/Components/Home/SplitHero';
import { IntroBand } from '@/Components/Home/IntroBand';
import { BeforeAfterShowcase } from '@/Components/Home/BeforeAfterShowcase';
import { StickyServiceCards } from '@/Components/Home/StickyServiceCards';
import { StatsGrid } from '@/Components/Home/StatsGrid';
import { FreeTrialDropzone } from '@/Components/Home/FreeTrialDropzone';
import { VolumePricingCalculator } from '@/Components/Common/VolumePricingCalculator';
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
                title="AI-Based 2D Image Retouching & 3D CGI Model Solutions"
                description="CuttingEdger provides surgical 2D photo editing, invisible ghost mannequin jointing, high-end jewelry retouching, and 3D CGI product modeling for e-commerce brands worldwide."
            />

            {/* 1. Hero Section */}
            <SplitHero />

            {/* 2. Intro Manifesto Band */}
            <IntroBand />

            {/* 3. Interactive Before/After Craft Comparison Slider */}
            <BeforeAfterShowcase />

            {/* 4. Core Services Sticky Stacked Cards */}
            <StickyServiceCards services={services} />

            {/* 5. Animated Daily Production Stats Grid */}
            <StatsGrid />

            {/* 6. Free Trial & Instant Batch Uploader Wizard */}
            <FreeTrialDropzone />

            {/* 7. Interactive Volume Price Estimator */}
            <VolumePricingCalculator />

            {/* 8. Dual Counter-Scrolling Client Marquees */}
            <ClientMarquees clients={clients} />

            {/* 8. Leadership Team */}
            <TeamPreview members={teamMembers} />

            {/* 9. Recent Work Kinetic Parallax Showcase */}
            <RecentWorkShowcase projects={featuredProjects} />

            {/* 10. Accessible Testimonials Slider */}
            <TestimonialsSlider testimonials={testimonials} />
        </>
    );
}
