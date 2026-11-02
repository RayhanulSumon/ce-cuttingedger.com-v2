import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { HomeVariantSwitcher } from './HomeVariants/HomeVariantSwitcher';
import { HomeOriginal } from './HomeVariants/HomeOriginal';
import { HomeVisual } from './HomeVariants/HomeVisual';
import { HomePortfolio } from './HomeVariants/HomePortfolio';
import { HomeEditorial } from './HomeVariants/HomeEditorial';
import { HomePhotoLight } from './HomeVariants/HomePhotoLight';
import { HomeStudioS1 } from './HomeVariants/HomeStudioS1';
import { HomeOmniStudio } from './HomeVariants/HomeOmniStudio';
import { HomeRetouchStudio } from './HomeVariants/HomeRetouchStudio';
import { HomeArvenStudio } from './HomeVariants/HomeArvenStudio';

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
  const valid = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const getInitialVariant = () => {
    if (variant && valid.includes(variant)) {
      return variant;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      if (v && valid.includes(v)) return v;
      const saved = localStorage.getItem('ce_home_variant');
      if (saved && valid.includes(saved)) return saved;
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

    if (!v && variant && valid.includes(variant)) {
      v = variant;
    }

    if (v && valid.includes(v)) {
      setCurrentVariant(v);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ce_home_variant', v);
        } catch (e) {
          // Ignore storage errors
        }
      }
    } else if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ce_home_variant');
      if (saved && valid.includes(saved)) {
        setCurrentVariant(saved);
      }
    }
  }, [url, variant]);

  const handleVariantChange = (id: string) => {
    setCurrentVariant(id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ce_home_variant', id);
      } catch (e) {
        // Ignore storage errors
      }
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('v', id);
      window.history.pushState({}, '', newUrl.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderVariantContent = () => {
    switch (currentVariant) {
      case '2':
        return <HomeVisual clients={clients} />;
      case '3':
        return <HomePortfolio clients={clients} />;
      case '4':
        return <HomeEditorial clients={clients} />;
      case '5':
        return <HomePhotoLight clients={clients} />;
      case '6':
        return <HomeStudioS1 clients={clients} />;
      case '7':
        return <HomeOmniStudio clients={clients} />;
      case '8':
        return <HomeRetouchStudio clients={clients} />;
      case '9':
        return <HomeArvenStudio clients={clients} />;
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
