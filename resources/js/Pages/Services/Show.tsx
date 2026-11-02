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
import { VariantMinimalist } from './Variants/VariantMinimalist';
import { VariantEditorial } from './Variants/VariantEditorial';
import { VariantTechnical } from './Variants/VariantTechnical';
import { VariantHighConversion } from './Variants/VariantHighConversion';
import { VariantDarkObsidian } from './Variants/VariantDarkObsidian';

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
  if (!param) return 'minimalist';
  const p = param.toLowerCase().trim();
  if (p === '1' || p === 'minimalist' || p === 'studio') return 'minimalist';
  if (p === '2' || p === 'editorial' || p === 'lookbook') return 'editorial';
  if (p === '3' || p === 'technical' || p === 'lab') return 'technical';
  if (p === '4' || p === 'conversion' || p === 'ecommerce') return 'conversion';
  if (p === '5' || p === 'obsidian' || p === 'dark') return 'obsidian';
  return 'minimalist';
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
  const [variant, setVariant] = useState<ServicePageVariant>('minimalist');

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
        {variant === 'minimalist' && (
          <VariantMinimalist
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

        {variant === 'technical' && (
          <VariantTechnical
            service={service}
            otherServices={otherServices}
            relatedProjects={relatedProjects}
            calendlyUrl={calendlyUrl}
          />
        )}

        {variant === 'conversion' && (
          <VariantHighConversion
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
