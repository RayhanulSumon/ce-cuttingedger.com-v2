import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { HomeVariantSwitcher } from './HomeVariants/HomeVariantSwitcher';
import { HomeOriginal } from './HomeVariants/HomeOriginal';
import { HomeVisual } from './HomeVariants/HomeVisual';
import { HomePortfolio } from './HomeVariants/HomePortfolio';
import { HomeEditorial } from './HomeVariants/HomeEditorial';
import { HomePhotoLight } from './HomeVariants/HomePhotoLight';

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
}

export default function Home({ clients = [] }: HomeProps) {
  const { url } = usePage();
  const [currentVariant, setCurrentVariant] = useState('1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      if (v && ['1', '2', '3', '4', '5'].includes(v)) {
        setCurrentVariant(v);
      } else {
        const saved = localStorage.getItem('ce_home_variant');
        if (saved && ['1', '2', '3', '4', '5'].includes(saved)) {
          setCurrentVariant(saved);
        }
      }
    }
  }, [url]);

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
          content="Enterprise-grade e-commerce image post-production, AI headshots, virtual try-on, and ghost mannequin retouching with #de4a2c brand identity."
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
