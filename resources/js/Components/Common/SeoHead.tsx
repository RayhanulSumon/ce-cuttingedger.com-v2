import React from 'react';
import { Head } from '@inertiajs/react';

interface SeoHeadProps {
    title?: string;
    description?: string;
    image?: string;
    canonicalUrl?: string;
    type?: 'website' | 'article';
    jsonLd?: Record<string, unknown>;
}

export function SeoHead({
    title,
    description = 'CuttingEdger is an elite digital agency engineering kinetic software interfaces, tactile brand identities, and high-performance web applications.',
    image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    canonicalUrl,
    type = 'website',
    jsonLd,
}: SeoHeadProps) {
    const siteTitle = title ? `${title} — CuttingEdger` : 'CuttingEdger — Radical Digital Agency & Creative Engineering';

    const defaultJsonLd = jsonLd || {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CuttingEdger',
        url: 'https://cuttingedger.com',
        logo: 'https://cuttingedger.com/logo.png',
        description: description,
        sameAs: [
            'https://twitter.com/cuttingedger',
            'https://linkedin.com/company/cuttingedger',
            'https://github.com/cuttingedger',
        ],
    };

    return (
        <Head>
            <title>{siteTitle}</title>
            <meta name="description" content={description} />

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
