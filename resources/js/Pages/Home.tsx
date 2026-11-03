import React from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { SplitHero } from '@/Components/Home/SplitHero';
import { IntroBand } from '@/Components/Home/IntroBand';
import { BeforeAfterShowcase } from '@/Components/Home/BeforeAfterShowcase';
import { AwardsShowcase } from '@/Components/Home/AwardsShowcase';
import { VideoShowcase } from '@/Components/Home/VideoShowcase';
import { StickyServiceCards } from '@/Components/Home/StickyServiceCards';
import { StatsGrid } from '@/Components/Home/StatsGrid';
import { FreeTrialDropzone } from '@/Components/Home/FreeTrialDropzone';
import { PricingCardsSection } from '@/Components/Pricing/PricingCardsSection';
import { ClientMarquees } from '@/Components/Home/ClientMarquees';
import { TeamPreview } from '@/Components/Home/TeamPreview';
import { RecentWorkShowcase } from '@/Components/Home/RecentWorkShowcase';
import { TestimonialsSlider } from '@/Components/Home/TestimonialsSlider';
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

            {/* 4. Verified Industry Recognitions & Awards (Dark Luxury) */}
            <AwardsShowcase />

            {/* 5. Short-Form & Spatial 3D Video Showcase (Dark Luxury) */}
            <VideoShowcase />

            {/* 6. Core Services Sticky Stacked Cards */}
            <StickyServiceCards services={services} />

            {/* 7. Animated Daily Production Stats Grid */}
            <StatsGrid />

            {/* 8. Free Trial & Instant Batch Uploader Wizard */}
            <FreeTrialDropzone />

            {/* 9. 3-Card Bespoke Production Tiers (Request for Pricing) */}
            <PricingCardsSection />

            {/* 10. Dual Counter-Scrolling Client Marquees */}
            <ClientMarquees clients={clients} />

            {/* 11. Leadership Team */}
            <TeamPreview members={teamMembers} />

            {/* 12. Recent Work Kinetic Parallax Showcase */}
            <RecentWorkShowcase projects={featuredProjects} />

            {/* 13. Accessible Testimonials Slider */}
            <TestimonialsSlider testimonials={testimonials} />

            {/* 14. Homepage FAQ Accordion ("Frequent questions.") */}
            <HomeFaqSection />
        </>
    );
}
