import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface FaqItem {
    question: string;
    answer: string;
}

interface ServiceSchema {
    name: string;
    description: string;
    serviceType?: string;
    url?: string;
}

interface ArticleSchema {
    headline: string;
    description?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    image?: string;
}

interface ReviewsSchema {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
}

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    noindex?: boolean;
    robots?: string;
    image?: string;
    canonicalUrl?: string;
    type?: 'website' | 'article';
    breadcrumbs?: BreadcrumbItem[];
    serviceSchema?: ServiceSchema;
    articleSchema?: ArticleSchema;
    faqSchema?: FaqItem[];
    reviewsSchema?: ReviewsSchema;
    jsonLd?: Record<string, unknown>;
}

export function SeoHead({
    title,
    description = 'Cutting Edger is an AI-driven visual performance agency specializing in e-commerce catalog retouching, color standardization, white-label production, and 3D CGI virtual studio staging.',
    keywords,
    noindex = false,
    robots,
    image = 'https://cuttingedger.com/images/ce/ce_og_banner.jpg',
    canonicalUrl,
    type = 'website',
    breadcrumbs,
    serviceSchema,
    articleSchema,
    faqSchema,
    reviewsSchema,
    jsonLd,
}: SeoHeadProps) {
    const { url } = usePage();
    const siteTitle = title ? `${title} — Cutting Edger` : 'Cutting Edger — AI-Driven Visual Performance Agency';
    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : `https://cuttingedger.com${url}`);
    const robotsContent = robots || (noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 1. Organization Schema (Site-wide)
    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://cuttingedger.com/#organization',
        name: 'Cutting Edger',
        url: 'https://cuttingedger.com',
        logo: {
            '@type': 'ImageObject',
            url: 'https://cuttingedger.com/images/ce/ce_logo_word.png',
            width: 600,
            height: 120,
        },
        description: description,
        telephone: '+1 (409) 995-2565',
        email: 'hello@cuttingedger.com',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Artisan Center, Level-7, House# 57/9, West Panthapath',
            addressLocality: 'Dhaka',
            postalCode: '1215',
            addressCountry: 'BD',
        },
        sameAs: [
            'https://facebook.com/CuttingEdgerInc',
            'https://twitter.com/cutting_edger',
            'https://instagram.com/cuttingedgerinc',
            'https://linkedin.com/company/cutting-edger',
            'https://youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ',
        ],
    };

    const graph: any[] = [orgSchema];

    // 2. BreadcrumbList Schema (Inner Pages)
    if (breadcrumbs && breadcrumbs.length > 0) {
        graph.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((b, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: b.name,
                item: b.url.startsWith('http') ? b.url : `https://cuttingedger.com${b.url}`,
            })),
        });
    }

    // 3. Service Schema (Service & Sub-service Pages)
    if (serviceSchema) {
        graph.push({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: serviceSchema.name,
            description: serviceSchema.description,
            serviceType: serviceSchema.serviceType || serviceSchema.name,
            url: serviceSchema.url || currentUrl,
            provider: {
                '@id': 'https://cuttingedger.com/#organization',
            },
            areaServed: ['US', 'CA', 'GB', 'EU', 'AU'],
        });
    }

    // 4. Article Schema (Blogs & Case Studies)
    if (articleSchema) {
        graph.push({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: articleSchema.headline,
            description: articleSchema.description || description,
            image: articleSchema.image || image,
            author: {
                '@type': 'Organization',
                name: articleSchema.author || 'Cutting Edger Studio',
            },
            publisher: {
                '@id': 'https://cuttingedger.com/#organization',
            },
            datePublished: articleSchema.datePublished || '2026-01-01',
            dateModified: articleSchema.dateModified || articleSchema.datePublished || '2026-10-23',
            mainEntityOfPage: currentUrl,
        });
    }

    // 5. FAQPage Schema (Only on genuine FAQ blocks)
    if (faqSchema && faqSchema.length > 0) {
        graph.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqSchema.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                },
            })),
        });
    }

    // 6. Reviews / AggregateRating Schema
    if (reviewsSchema) {
        graph.push({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Cutting Edger',
            image: image,
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: reviewsSchema.ratingValue.toFixed(1),
                reviewCount: reviewsSchema.reviewCount,
                bestRating: reviewsSchema.bestRating || 5,
                worstRating: 1,
            },
        });
    }

    if (jsonLd) {
        graph.push(jsonLd);
    }

    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': graph,
    };

    return (
        <Head>
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={robotsContent} />

            {/* Canonical Link */}
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="Cutting Edger" />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={currentUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Head>
    );
}
