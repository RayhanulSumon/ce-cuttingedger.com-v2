import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { HomeVariantSwitcher } from './HomeVariants/HomeVariantSwitcher';
import { HomeOriginal } from './HomeVariants/HomeOriginal';
import { HomeVisual } from './HomeVariants/HomeVisual';
import { HomeEditorial } from './HomeVariants/HomeEditorial';
import { HomeRetouchStudio } from './HomeVariants/HomeRetouchStudio';
import { HomeLuminaGlass } from './HomeVariants/HomeLuminaGlass';
import { HomeAtelierEditorial } from './HomeVariants/HomeAtelierEditorial';
import { HomeParallaxHorizon } from './HomeVariants/HomeParallaxHorizon';
import { HomeArchitectBlueprint } from './HomeVariants/HomeArchitectBlueprint';

interface HomeProps {
  featuredProjects?: any[];
  services?: any[];
  teamMembers?: any[];
  testimonials?: any[];
  clients?: Array<{
    id: number;
    name: string;
    logo_dark?: string;
    logo_light?: string;
    url?: string;
  }>;
  variant?: string;
}

export default function Home({ clients = [], variant = '1' }: HomeProps) {
  const { url } = usePage();
  const valid = ['1', '2', '3', '4', '5', '6', '7', '8'];

  // Gracefully maps legacy non-sequential IDs (?v=9, ?v=10, etc.) to 1..8
  const resolveVariant = (raw: string | null | undefined): string => {
    if (!raw) return '1';
    const legacyMap: Record<string, string> = {
      '4': '3',
      '8': '4',
      '9': '5',
      '10': '6',
      '11': '7',
      '13': '8'
    };
    if (valid.includes(raw)) return raw;
    if (legacyMap[raw]) return legacyMap[raw];
    return '1';
  };

  const getInitialVariant = () => {
    if (variant) {
      const mapped = resolveVariant(variant);
      if (mapped) return mapped;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      if (v) return resolveVariant(v);
      const saved = localStorage.getItem('ce_home_variant');
      if (saved) return resolveVariant(saved);
    }
    return '1';
  };

  const [currentVariant, setCurrentVariant] = useState(getInitialVariant);

  useEffect(() => {
    let v: string | null = null;

    if (url && url.includes('?')) {
      const search = url.split('?')[1];
      const params = new URLSearchParams(search);
      v = params.get('v');
    }

    if (!v && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      v = params.get('v');
    }

    if (!v && variant) {
      v = variant;
    }

    const resolved = resolveVariant(v);
    setCurrentVariant(resolved);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ce_home_variant', resolved);
      } catch (e) {
        // Ignore storage errors
      }
    }
  }, [url, variant]);

  const handleVariantChange = (id: string) => {
    const resolved = resolveVariant(id);
    setCurrentVariant(resolved);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ce_home_variant', resolved);
      } catch (e) {
        // Ignore storage errors
      }
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('v', resolved);
      window.history.pushState({}, '', newUrl.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderVariantContent = () => {
    switch (currentVariant) {
      case '2':
        return <HomeVisual clients={clients} />;
      case '3':
        return <HomeEditorial clients={clients} />;
      case '4':
        return <HomeRetouchStudio clients={clients} />;
      case '5':
        return <HomeLuminaGlass clients={clients} />;
      case '6':
        return <HomeAtelierEditorial clients={clients} />;
      case '7':
        return <HomeParallaxHorizon clients={clients} />;
      case '8':
        return <HomeArchitectBlueprint clients={clients} />;
      case '1':
      default:
        return <HomeOriginal clients={clients} />;
    }
  };

  return (
    <>
      <Head>
        <title>CuttingEdger — Radical Digital Agency & Post-Production Atelier</title>
        <meta
          name="description"
          content="Enterprise-grade e-commerce image post-production, AI corporate headshots, virtual try-on, AI fashion models, and hand-crafted clipping paths."
        />
      </Head>

      {/* Dynamic Active Homepage Variant Content */}
      {renderVariantContent()}

      {/* Floating Bottom Homepage Prototype Switcher Dock */}
      <HomeVariantSwitcher
        currentVariant={currentVariant}
        onVariantChange={handleVariantChange}
      />
    </>
  );
}
