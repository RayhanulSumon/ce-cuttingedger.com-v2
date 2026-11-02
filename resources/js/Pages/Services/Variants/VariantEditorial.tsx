import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Calendar,
  Sparkles,
  ChevronDown,
  Quote,
  Layers,
  Camera,
  Compass,
  FileText
} from 'lucide-react';

interface VariantProps {
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
  calendlyUrl: string;
}

export const VariantEditorial: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const luxuryBrands = ['BALENCIAGA', 'CARTIER', 'SSENSE', 'MONCLER', 'KITH', 'JIL SANDER', 'ACNE STUDIOS'];

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141416] antialiased selection:bg-[#141416] selection:text-[#F6F5F0] pb-32">
      {/* 1. TOP EDITORIAL RUNNING HEADER */}
      <div className="border-b border-[#141416]/15 bg-[#F6F5F0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#141416]">ATELIER DOSSIER</span>
            <span className="text-[#141416]/30">/</span>
            <span className="text-[#141416]/70 truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#141416]/70">
            <span className="hidden sm:inline">PARIS • NEW YORK • TOKYO</span>
            <span className="font-bold text-[#141416]">VOL. 26</span>
          </div>
        </div>
      </div>

      {/* 2. EDITORIAL HERO SPREAD */}
      <section className="pt-16 pb-16 px-4 sm:px-8 border-b border-[#141416]/15">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block">
                  CAPABILITY ESSAY // NO. {service.id || '07'}
                </span>
                <h1 className="text-4xl sm:text-6xl font-serif tracking-tight text-[#141416] leading-[1.05]">
                  {service.h1_title || service.title}
                </h1>
              </div>

              <p className="text-lg sm:text-xl font-serif text-[#141416]/80 leading-relaxed italic border-l-2 border-[#141416] pl-6 py-1">
                "{service.subtitle || 'The standard of luxury visual merchandising is defined by sub-millimeter precision.'}"
              </p>

              <div className="text-sm text-[#141416]/75 leading-relaxed space-y-4 pt-2">
                <p>
                  <span className="float-left text-5xl font-serif font-bold pr-3 leading-none text-[#141416]">
                    {service.description ? service.description.charAt(0) : 'W'}
                  </span>
                  {service.description ? service.description.slice(1) : 'e treat every digital asset as a bespoke architectural plate. In luxury e-commerce, automated cuts destroy brand prestige.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 font-mono text-xs uppercase tracking-wider">
                <a
                  href="#free-sample"
                  className="px-6 py-3.5 bg-[#141416] hover:bg-neutral-800 text-[#F6F5F0] font-bold transition-colors flex items-center gap-2"
                >
                  <span>Request Atelier Sample Batch</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                  className="px-6 py-3.5 border border-[#141416] hover:bg-[#141416]/5 text-[#141416] font-bold transition-colors"
                >
                  Schedule Private Consultation
                </button>
              </div>
            </div>

            {/* Right Editorial Plate Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#141416]/20 bg-[#E8E6DF] p-3 shadow-sm">
                <div className="relative h-[420px] rounded-xl overflow-hidden bg-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85"
                    alt={service.title}
                    className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#141416] text-[#F6F5F0] font-mono text-[10px] tracking-widest uppercase">
                    FIG. 01 — PLATE ARCHIVE
                  </div>
                  <div className="absolute bottom-4 inset-x-4 p-4 bg-white/90 backdrop-blur-md border border-[#141416]/10 text-xs space-y-1">
                    <div className="font-serif font-bold text-sm text-[#141416]">
                      {service.title} • 300 DPI Atelier Master
                    </div>
                    <div className="font-mono text-[10px] text-[#141416]/60">
                      100% Hand-Rolled Vector Paths • Zero Artifact Halos
                    </div>
                  </div>
                </div>
              </div>

              {/* Editorial Meta Box */}
              <div className="p-4 rounded-xl border border-[#141416]/15 bg-white/60 font-mono text-xs grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#141416]/40 uppercase text-[10px] block font-bold">PRODUCTION SLA</span>
                  <span className="font-bold text-[#141416]">12h Guaranteed</span>
                </div>
                <div>
                  <span className="text-[#141416]/40 uppercase text-[10px] block font-bold">VECTOR ACCURACY</span>
                  <span className="font-bold text-[#141416]">0.1px Hand-Drawn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LUXURY BRAND SILHOUETTES RUNNER */}
      <div className="py-6 border-b border-[#141416]/15 bg-[#EFECE4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-6 overflow-x-auto no-scrollbar font-serif text-sm tracking-[0.2em] text-[#141416]/60 font-semibold">
          {luxuryBrands.map((brand, i) => (
            <span key={i} className="hover:text-[#141416] transition-colors shrink-0">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* 4. THE EDITORIAL MANIFESTO SPREAD (PROBLEM VS RESOLUTION) */}
      <section className="py-20 px-4 sm:px-8 border-b border-[#141416]/15">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block">
              DIAGNOSTIC DISCOURSE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#141416]">
              The Aesthetic Dilemma & Our Resolution
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left: The Dilemma */}
            <div className="space-y-4 border-t-2 border-[#141416] pt-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#141416]/50 block font-bold">
                [ 01 // THE PRODUCTION COMPROMISE ]
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#141416]">
                Why Off-the-Shelf AI Destroys Luxury Perception
              </h3>
              <p className="text-sm text-[#141416]/75 leading-relaxed font-serif">
                {service.problem_statement ||
                  'Algorithmic cutouts soften silhouettes, trim essential garment seams, and introduce color contamination. High-end clientele notice sub-pixel degradation immediately, leading to high return rates and eroded trust.'}
              </p>
              <ul className="space-y-2 pt-2 font-mono text-xs text-[#141416]/70">
                <li className="flex items-center gap-2">
                  <span>—</span>
                  <span>Fuzzy feathered contours instead of crisp architectural lines</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>—</span>
                  <span>Inconsistent lighting and uncalibrated skin/fabric hues</span>
                </li>
              </ul>
            </div>

            {/* Right: The Resolution */}
            <div className="space-y-4 border-t-2 border-[#141416] pt-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#141416]/50 block font-bold">
                [ 02 // THE MASTER CRAFT METHOD ]
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#141416]">
                Hand-Crafted Precision by Senior Artisans
              </h3>
              <p className="text-sm text-[#141416]/75 leading-relaxed font-serif">
                {service.solution_statement ||
                  'Our retouchers manually guide every Bézier anchor point with 300% zoom vector paths. Dual-pass quality control checks ensure pure non-destructive PSD deliverables certified for both print and high-density screens.'}
              </p>
              <ul className="space-y-2 pt-2 font-mono text-xs text-[#141416]/70">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>100% hand-drawn vector paths placed 1px inside the edge</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Delta-E certified color accuracy across diverse lighting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ATELIER PRODUCTION TIMELINE */}
      {service.process_steps && service.process_steps.length > 0 && (
        <section className="py-20 px-4 sm:px-8 border-b border-[#141416]/15">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#141416]/15 pb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block">
                  SYSTEMATIC PROTOCOL
                </span>
                <h2 className="text-3xl font-serif text-[#141416]">
                  The Four-Stage Atelier Pipeline
                </h2>
              </div>
              <span className="font-mono text-xs text-[#141416]/60 uppercase tracking-widest">
                VERIFIED SLA: 12-HOUR CYCLE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.process_steps.map((step, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="font-serif text-4xl text-[#141416]/30 font-bold">
                    {step.step}
                  </div>
                  <h4 className="font-serif font-bold text-lg text-[#141416] border-b border-[#141416]/20 pb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#141416]/70 leading-relaxed font-serif">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. EDITORIAL DELIVERABLES ARCHIVE */}
      <section className="py-20 px-4 sm:px-8 border-b border-[#141416]/15">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block">
              DELIVERABLE SPECIFICATION
            </span>
            <h2 className="text-3xl font-serif text-[#141416]">
              Master Plate Deliverables
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(service.deliverables || [
              'Clipping Path Embedded TIFF',
              'Layered 16-Bit ProPhoto PSD',
              'Crisp Alpha PNG Master Assets'
            ]).map((deliv, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border border-[#141416]/15 rounded-xl space-y-3"
              >
                <div className="font-mono text-xs text-[#141416]/40 uppercase font-bold">
                  ARCHIVE REF // 0{idx + 1}
                </div>
                <div className="font-serif font-bold text-lg text-[#141416]">{deliv}</div>
                <p className="text-xs text-[#141416]/60 font-serif leading-relaxed">
                  Certified for luxury editorial catalog ingest, web-optimized asset delivery, and high-resolution print.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EDITORIAL ACCORDION FAQS */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-20 px-4 sm:px-8 border-b border-[#141416]/15">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block">
                CONSULTATIVE INQUIRIES
              </span>
              <h2 className="text-3xl font-serif text-[#141416]">
                Frequently Addressed Inquiries
              </h2>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border-b border-[#141416]/20 pb-4"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 font-serif font-bold text-lg text-[#141416] py-2"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#141416]/50 transition-transform ${
                          isOpen ? 'rotate-180 text-[#141416]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="text-sm font-serif text-[#141416]/75 leading-relaxed pt-2">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. WHITE-GLOVE CONCIERGE CALLOUT */}
      <section id="free-sample" className="py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block">
            BESPOKE COMMISSION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#141416] max-w-2xl mx-auto leading-tight">
            Commission a complimentary three-asset evaluation batch.
          </h2>
          <p className="text-sm sm:text-base font-serif text-[#141416]/70 max-w-lg mx-auto leading-relaxed">
            Witness our hand-drawn precision directly on your collection's most demanding silhouettes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs uppercase tracking-wider">
            <Link
              href="/#free-sample"
              className="px-8 py-4 bg-[#141416] hover:bg-neutral-800 text-[#F6F5F0] font-bold transition-all flex items-center gap-2"
            >
              <span>Submit Evaluation Batch</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
              className="px-8 py-4 border border-[#141416] hover:bg-[#141416]/5 text-[#141416] font-bold transition-colors"
            >
              Arrange Discovery Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

