import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  ArrowUpRight,
  Check,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Calendar,
  Layers,
  Scissors,
  Sun,
  Eye,
  Sliders,
  ChevronDown,
  CheckCircle2,
  FileCheck2,
  Lock,
  Zap,
  Clock
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

export const VariantMinimalist: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [isHoveringCompare, setIsHoveringCompare] = useState(false);

  // Default sample images for demonstration
  const beforeImage =
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80';
  const afterImage =
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85';

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F0F12] antialiased selection:bg-[#0F0F12] selection:text-white pb-32">
      {/* 1. TOP BREADCRUMB & CATEGORY BAR */}
      <div className="border-b border-neutral-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-neutral-500 font-semibold truncate">
            <Link href="/" className="hover:text-[#0F0F12] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[#0F0F12] transition-colors">Services</Link>
            {service.parent && (
              <>
                <span>/</span>
                <Link
                  href={`/services/${service.parent.slug}`}
                  className="hover:text-[#0F0F12] transition-colors"
                >
                  {service.parent.title}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#0F0F12] font-extrabold truncate">{service.title}</span>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              12h Express Production Ready
            </span>
          </div>
        </div>
      </div>

      {/* 2. SUB-SERVICES PILLS BAR */}
      {service.children && service.children.length > 0 && (
        <div className="border-b border-neutral-200/60 bg-white py-3 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 shrink-0 mr-2">
              Specialized Modules:
            </span>
            {service.children.map((child) => (
              <Link
                key={child.id || child.slug}
                href={`/services/${service.slug}/${child.slug}`}
                className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-[#0F0F12] text-neutral-600 hover:text-white font-bold transition-all shrink-0 text-xs"
              >
                {child.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 3. HERO SECTION */}
      <section className="pt-12 sm:pt-16 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Eyebrow and Title */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200/80 shadow-xs text-xs font-bold text-neutral-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{service.marquee_label || 'PRECISION ATELIER POST-PRODUCTION'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F0F12] leading-[1.08]">
              {service.h1_title || service.title}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 font-medium leading-relaxed max-w-2xl">
              {service.subtitle || service.description}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#free-sample"
                className="px-7 py-3.5 rounded-full bg-[#0F0F12] hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>Request 3 Free Sample Assets</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-[#0F0F12] font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Book 15-Min Discovery Call</span>
              </button>
            </div>
          </div>

          {/* Studio Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 pt-8 border-t border-neutral-200/80">
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Turnaround SLA</div>
              <div className="text-xl font-extrabold text-[#0F0F12] mt-0.5">12h Guaranteed</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">⚡ Rush 6h option available</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Path Precision</div>
              <div className="text-xl font-extrabold text-[#0F0F12] mt-0.5">0.1px Vector</div>
              <div className="text-xs text-neutral-500 font-medium mt-1">300% zoom hand-drawn</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Studio Capacity</div>
              <div className="text-xl font-extrabold text-[#0F0F12] mt-0.5">10,000 SKUs/Day</div>
              <div className="text-xs text-neutral-500 font-medium mt-1">Multi-desk concurrent flow</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Confidentiality</div>
              <div className="text-xl font-extrabold text-[#0F0F12] mt-0.5">Strict NDA</div>
              <div className="text-xs text-neutral-500 font-medium mt-1">Enterprise air-gapped security</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE BEFORE/AFTER QUALITY SHOWCASE */}
      <section className="py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[32px] bg-white border border-neutral-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">
                  CRAFT VERIFICATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F0F12]">
                  Interactive Before & After Inspection
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium max-w-md">
                Drag the slider or click anywhere to inspect pixel-perfect vector cutouts, contact shadows, and texture recovery.
              </p>
            </div>

            {/* Split Image Canvas */}
            <div
              className="relative h-[360px] sm:h-[480px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-neutral-200 bg-neutral-100"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setSliderPos(Math.max(5, Math.min(pos, 95)));
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                  setSliderPos(Math.max(5, Math.min(pos, 95)));
                }
              }}
            >
              {/* After (Retouched) Image */}
              <div
                className="absolute inset-0 bg-[#FFFFFF] flex items-center justify-center p-6"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
                }}
              >
                <img
                  src={afterImage}
                  alt="Post-Production Final"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_28px_24px_rgba(15,15,18,0.24)]"
                />
              </div>

              {/* Before (Raw) Image (Clipped) */}
              <div
                className="absolute inset-0 bg-[#E5E5E2] overflow-hidden flex items-center justify-center p-6 border-r-2 border-white"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={beforeImage}
                  alt="Raw Photographic Plate"
                  className="max-h-full max-w-full object-contain filter brightness-[0.8] contrast-[0.82] saturate-[0.6] sepia-[0.15]"
                />
              </div>

              {/* Slider Handle Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0F0F12] text-white border-2 border-white shadow-xl flex items-center justify-center">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0F0F12]/80 backdrop-blur-md text-white font-extrabold text-xs">
                RAW PLATE
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-md">
                MASTER RETOUCHED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROBLEM & SOLUTION COMPARISON */}
      <section className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Industry Problem */}
            <div className="p-8 rounded-[28px] bg-white border border-red-200/80 shadow-xs space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 block">
                THE PRODUCTION BOTTLENECK
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F0F12]">
                Automated AI & In-House Clutter
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                {service.problem_statement ||
                  'Automated clipping tools guess boundaries, leaving unsightly fringe and clipped silhouettes. In-house retouchers get overwhelmed during seasonal spikes, stalling collection launches and degrading product conversion.'}
              </p>
              <div className="pt-2 space-y-2">
                {[
                  'Fuzzy, jagged edges that fail luxury standards',
                  'Color halos bleeding onto marketplace backdrops',
                  'Unpredictable turnaround and lack of scaling bandwidth'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-700">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 text-[10px]">
                      ✕
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The CuttingEdger Resolution */}
            <div className="p-8 rounded-[28px] bg-white border border-emerald-300 shadow-xs space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">
                THE ATELIER RESOLUTION
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F0F12]">
                100% Hand-Crafted Studio Discipline
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                {service.solution_statement ||
                  'Every curve is traced by hand at 300% zoom using Bézier pen paths. We combine dedicated senior retouch desks, dual-pass quality audits, and custom enterprise DAM pipelines.'}
              </p>
              <div className="pt-2 space-y-2">
                {[
                  'Hand-drawn Bézier vectors placed 0.5px inside edge',
                  'Calibrated Delta-E color consistency across all SKUs',
                  'Guaranteed 12-hour turnaround with dual-pass QC verification'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-[#0F0F12]">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SYSTEMATIC 4-STEP PIPELINE */}
      {service.process_steps && service.process_steps.length > 0 && (
        <section className="py-12 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">
                STANDARDIZED WORKFLOW
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F0F12]">
                Systematic Production Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                From initial secure ingest to multi-format delivery, every asset passes four audited milestones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {service.process_steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all space-y-3"
                >
                  <span className="text-2xl font-mono font-extrabold text-emerald-600">
                    {step.step}
                  </span>
                  <h4 className="font-extrabold text-base text-[#0F0F12]">{step.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. DELIVERABLES & FORMATS VAULT */}
      <section className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-neutral-200/80 shadow-sm space-y-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">
                DELIVERABLE ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F0F12]">
                Production Deliverables & Export Formats
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                Configured to drop directly into your brand DAM, Shopify, Amazon, or ERP catalogs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {(service.deliverables || [
                'Clipping Path Embedded TIFF & EPS',
                'Transparent PNG with Crisp Alpha Channel',
                '16-Bit ProPhoto Layered PSD Master Files',
                'Optimized Next-Gen WebP / AVIF for Web Performance'
              ]).map((deliv, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-emerald-600 shadow-xs">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-extrabold text-[#0F0F12]">{deliv}</div>
                  <div className="text-[11px] text-neutral-500 font-medium">Certified 300 DPI Color Space</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-12 px-4 sm:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">
                KNOWLEDGE BASE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F0F12]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-[#0F0F12]"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                          isOpen ? 'rotate-180 text-emerald-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed border-t border-neutral-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 9. BOTTOM CONVERSION ACTION */}
      <section id="free-sample" className="py-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto rounded-[32px] bg-[#0F0F12] text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">
            NO RISK • STRICT NDA PROTECTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-xl mx-auto">
            Ready to inspect our craft on your own RAW product photos?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Upload up to 3 sample images. We'll return pixel-perfect hand-drawn vector clipping paths and master PSDs in under 12 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/#free-sample"
              className="px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#0F0F12] font-extrabold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <span>Submit Free Test Batch</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
              className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm transition-all"
            >
              Book Discovery Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

