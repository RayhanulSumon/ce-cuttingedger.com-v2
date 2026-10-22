import React from 'react';
import { Head } from '@inertiajs/react';

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    robots?: string;
    image?: string;
    canonicalUrl?: string;
    type?: 'website' | 'article';
    jsonLd?: Record<string, unknown>;
}

export function SeoHead({
    title,
    description = 'CuttingEdger is an elite digital agency engineering kinetic software interfaces, tactile brand identities, and high-performance web applications.',
    keywords,
    robots,
    image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    canonicalUrl,
    type = 'website',
    jsonLd,
}: SeoHeadProps) {
    const siteTitle = title ? `${title} — CuttingEdger` : 'CuttingEdger — Radical Digital Agency & Creative Engineering';

    const defaultJsonLd = jsonLd || {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Cutting Edger',
        url: 'https://www.cuttingedger.com',
        image: 'https://www.cuttingedger.com/images/ce/ce_logo_word.png',
        telephone: '+14099952565',
        priceRange: '$0.35 - $2.50',
        description: description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Artisan Center, Level-7, House# 57/9, West Panthapath',
            addressLocality: 'Dhaka',
            postalCode: '1215',
            addressCountry: 'BD',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 23.7527991,
            longitude: 90.3819406,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
        },
        sameAs: [
            'https://www.facebook.com/CuttingEdgerInc',
            'https://twitter.com/cutting_edger',
            'https://www.instagram.com/cuttingedgerinc/',
            'https://www.linkedin.com/company/cutting-edger/',
            'https://www.youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ',
            'https://www.pinterest.com/CuttingEdgerTeam2019/',
        ],
    };

    return (
        <Head>
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {robots && <meta name="robots" content={robots} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Canonical Link */}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Structured Data JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(defaultJsonLd)}
            </script>
        </Head>
    );
}
