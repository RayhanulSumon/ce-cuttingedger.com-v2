import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Service, Project } from '@/types/models';
import { PageProps } from '@/types';
import {
  VariantSwitcher,
  ServicePageVariant,
  VARIANT_OPTIONS
} from './Variants/VariantSwitcher';

// 10 Curated Image-First Production Variants (Kept #2 and #5)
import { VariantGlassmorphic } from './Variants/VariantGlassmorphic';
import { VariantEditorial } from './Variants/VariantEditorial';
import { VariantParallax } from './Variants/VariantParallax';
import { VariantVisualSlider } from './Variants/VariantVisualSlider';
import { VariantDarkObsidian } from './Variants/VariantDarkObsidian';
import { VariantBentoAtelier } from './Variants/VariantBentoAtelier';
import { VariantSplitCanvas } from './Variants/VariantSplitCanvas';
import { VariantPerspective3D } from './Variants/VariantPerspective3D';
import { VariantVisualWall } from './Variants/VariantVisualWall';
import { VariantLookbookStream } from './Variants/VariantLookbookStream';

interface ServiceShowProps {
  service: Service & {
    parent?: Service;
    children?: Service[];
    problem_statement?: string;
    solution_statement?: string;
    process_steps?: { step: string; title: string; description: string }[];
    faqs?: { question: string; answer: string }[];
    h1_title?: string;
  };
  otherServices: Service[];
  relatedProjects: Project[];
}

const parseVariantParam = (param: string | null): ServicePageVariant => {
  if (!param) return 'glassmorphic';
  const p = param.toLowerCase().trim();
  if (p === '1' || p === 'glassmorphic' || p === 'lumina' || p === 'minimalist' || p === 'studio')
    return 'glassmorphic';
  if (p === '2' || p === 'editorial' || p === 'lookbook') return 'editorial';
  if (p === '3' || p === 'parallax' || p === 'horizon' || p === 'technical' || p === 'lab')
    return 'parallax';
  if (
    p === '4' ||
    p === 'slider' ||
    p === 'slider-showcase' ||
    p === 'cinematic' ||
    p === 'conversion'
  )
    return 'slider-showcase';
  if (p === '5' || p === 'obsidian' || p === 'dark') return 'obsidian';
  if (p === '6' || p === 'bento' || p === 'bento-grid' || p === 'atelier') return 'bento-grid';
  if (p === '7' || p === 'split' || p === 'split-canvas' || p === 'canvas') return 'split-canvas';
  if (p === '8' || p === '3d' || p === 'perspective' || p === 'perspective-3d')
    return 'perspective-3d';
  if (p === '9' || p === 'wall' || p === 'visual-wall' || p === 'exhibition') return 'visual-wall';
  if (p === '10' || p === 'stream' || p === 'lookbook-stream' || p === 'runway')
    return 'lookbook-stream';
  return 'glassmorphic';
};

export default function Show({
  service,
  otherServices = [],
  relatedProjects = [],
}: ServiceShowProps) {
  const { settings } = usePage<PageProps>().props;
  const calendlyUrl =
    (settings as any)?.calendly_url || 'https://calendly.com/cuttingedger/discovery-call';

  // Read initial variant from query param or localStorage
  const [variant, setVariant] = useState<ServicePageVariant>('glassmorphic');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlV = urlParams.get('v') || urlParams.get('variant');
      if (urlV) {
        setVariant(parseVariantParam(urlV));
      } else {
        const stored = localStorage.getItem('ce_service_page_variant');
        if (stored) {
          setVariant(parseVariantParam(stored));
        }
      }
    }
  }, []);

  const handleSelectVariant = (newVariant: ServicePageVariant) => {
    setVariant(newVariant);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('v', newVariant);
      window.history.replaceState({}, '', url.toString());
      localStorage.setItem('ce_service_page_variant', newVariant);
    }
  };

  // Build dynamic breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
  ];

  if (service.parent) {
    breadcrumbs.push({
      name: service.parent.title,
      url: `/services/${service.parent.slug}`,
    });
  }

  breadcrumbs.push({
    name: service.title,
    url: service.parent
      ? `/services/${service.parent.slug}/${service.slug}`
      : `/services/${service.slug}`,
  });

  return (
    <>
      <SeoHead
        title={service.meta_title || `${service.title} Services — Cutting Edger`}
        description={service.meta_description || service.subtitle || service.description}
        breadcrumbs={breadcrumbs}
        serviceSchema={{
          name: service.title,
          description: service.description,
          serviceType: service.title,
        }}
        faqSchema={service.faqs || []}
      />

      {/* RENDER THE ACTIVE DESIGN VARIANT */}
      <main className="relative transition-all duration-300">
        {variant === 'glassmorphic' && (
          <VariantGlassmorphic
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'editorial' && (
          <VariantEditorial
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'parallax' && (
          <VariantParallax
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'slider-showcase' && (
          <VariantVisualSlider
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'obsidian' && (
          <VariantDarkObsidian
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'bento-grid' && (
          <VariantBentoAtelier
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'split-canvas' && (
          <VariantSplitCanvas
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'perspective-3d' && (
          <VariantPerspective3D
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'visual-wall' && (
          <VariantVisualWall
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'lookbook-stream' && (
          <VariantLookbookStream
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}
      </main>

      {/* FLOATING DESIGN VARIANT SWITCHER DOCK */}
      <VariantSwitcher
        currentVariant={variant}
        onSelectVariant={handleSelectVariant}
        serviceTitle={service.title}
      />
    </>
  );
}
