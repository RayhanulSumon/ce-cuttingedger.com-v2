import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  ArrowUpRight,
  Sparkles,
  Layers,
  Wand2,
  Calendar,
  Check,
  ShieldCheck,
  ChevronDown,
  Eye,
  Sliders,
  Zap,
  Clock,
  Compass
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

export const VariantDarkObsidian: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [polishActive, setPolishActive] = useState(true);

  return (
    <div className="min-h-screen bg-[#07080B] text-neutral-200 antialiased selection:bg-emerald-400 selection:text-black pb-36 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. TOP CINEMATIC HUD STRIP */}
      <div className="border-b border-white/10 bg-[#07080B]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
            <span className="text-white font-bold tracking-wider">OBSIDIAN ATELIER</span>
            <span className="text-neutral-600">/</span>
            <span className="text-emerald-400 truncate max-w-xs">{service.title}</span>
          </div>

          <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
            <span className="hidden sm:inline">16-BIT PROPHOTO • 300 DPI</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              12H RUSH READY
            </span>
          </div>
        </div>
      </div>

      {/* 2. CINEMATIC HERO */}
      <section className="pt-16 pb-20 px-4 sm:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-xs text-neutral-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] tracking-wider uppercase">
                {service.marquee_label || 'OBSIDIAN PRECISION CRAFT'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
              {service.h1_title || service.title}
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light">
              {service.subtitle || service.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#free-sample"
                className="px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(16,185,129,0.35)] flex items-center gap-2"
              >
                <span>Request 3 Free Master Assets</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                className="px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Discovery Call</span>
              </button>
            </div>
          </div>

          {/* Obsidian Floating Spec Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 pt-8 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">TURNAROUND</div>
              <div className="text-2xl font-extrabold text-white">12 Hours</div>
              <div className="text-xs text-emerald-400 font-medium">Guaranteed SLA</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">ACCURACY</div>
              <div className="text-2xl font-extrabold text-white">0.1px Bezier</div>
              <div className="text-xs text-neutral-400 font-medium">Sub-pixel curvature</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">CAPACITY</div>
              <div className="text-2xl font-extrabold text-white">10k+ SKUs</div>
              <div className="text-xs text-neutral-400 font-medium">Daily throughput</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">SECURITY</div>
              <div className="text-2xl font-extrabold text-white">Strict NDA</div>
              <div className="text-xs text-neutral-400 font-medium">Air-gapped production</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SPECULAR POLISH SHOWCASE */}
      <section className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-white/[0.02] border border-white/10 p-6 sm:p-10 backdrop-blur-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                OBSIDIAN CRAFT VIEWER
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Live Specular Polish & Vector Clean
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setPolishActive(!polishActive)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-mono transition-all flex items-center gap-2 border ${
                polishActive
                  ? 'bg-emerald-400 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-white/10 text-white border-white/20'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{polishActive ? 'Specular Polish: ACTIVE' : 'Bypass Polish: RAW'}</span>
            </button>
          </div>

          <div className="relative h-[360px] sm:h-[460px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#141620] to-[#0A0B10] flex items-center justify-center p-6 border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85"
              alt="Specular Preview"
              className={`max-h-full max-w-full object-contain transition-all duration-500 ${
                polishActive
                  ? 'filter brightness-105 contrast-110 saturate-110 drop-shadow-[0_32px_28px_rgba(16,185,129,0.25)]'
                  : 'filter brightness-75 contrast-85 saturate-60'
              }`}
            />

            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-mono text-white">
              {polishActive ? '✦ Frequency Separation & Specular Polish' : '● Raw Studio Camera Exposure'}
            </div>
          </div>
        </div>
      </section>

      {/* 4. OBSIDIAN PROBLEM VS SOLUTION GRID */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem Card */}
          <div className="p-8 rounded-3xl bg-red-950/10 border border-red-500/20 space-y-4 relative overflow-hidden backdrop-blur-md">
            <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold block">
              [ THE PRODUCTION DEFECT ]
            </span>
            <h3 className="text-2xl font-bold text-white">Automated Clipping Flaws</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {service.problem_statement ||
                'Off-the-shelf AI removers destroy fine details, create jagged pixel edges, and introduce background color cast that severely degrades luxury brand perception.'}
            </p>
          </div>

          {/* Solution Card */}
          <div className="p-8 rounded-3xl bg-emerald-950/10 border border-emerald-500/30 space-y-4 relative overflow-hidden backdrop-blur-md">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              [ THE OBSIDIAN RESOLUTION ]
            </span>
            <h3 className="text-2xl font-bold text-white">100% Hand-Crafted Pen Tool Vectors</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {service.solution_statement ||
                'Every silhouette is outlined manually at 300% zoom with clean Bézier anchor points. Calibrated Delta-E swatches guarantee consistent colors across all devices.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRODUCTION PROCESS PROTOCOL */}
      {service.process_steps && service.process_steps.length > 0 && (
        <section className="py-16 px-4 sm:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                PRODUCTION PIPELINE
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Four-Stage Master Protocol
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {service.process_steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-3"
                >
                  <span className="text-3xl font-mono font-extrabold text-emerald-400">
                    {step.step}
                  </span>
                  <h4 className="font-bold text-base text-white">{step.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. DELIVERABLES VAULT */}
      <section className="py-16 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              ASSET OUTPUTS
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Handed-Over Deliverable Formats
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(service.deliverables || [
              'Clipping Path Embedded TIFF & EPS',
              'Layered 16-Bit ProPhoto PSD',
              'Lossless Alpha PNG with Ground Shadow',
              'Next-Gen Compressed WebP for Web Performance'
            ]).map((deliv, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="text-sm font-bold text-white">{deliv}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. OBSIDIAN FAQS */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 px-4 sm:px-8 border-t border-white/10">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                INQUIRIES
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Frequently Addressed Inquiries
              </h2>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-white"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                          isOpen ? 'rotate-180 text-emerald-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="text-xs text-neutral-400 leading-relaxed pt-3 border-t border-white/5 mt-3">
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

      {/* 8. GRAND OBSIDIAN CTA */}
      <section id="free-sample" className="py-20 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-emerald-500/30 p-8 sm:p-14 text-center space-y-6 shadow-[0_0_80px_rgba(16,185,129,0.15)] relative">
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">
            CONFIDENTIAL TRIAL PILOT
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white max-w-xl mx-auto">
            Experience the Obsidian craft on your own RAW files.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Upload 3 test images. Receive master hand-drawn vector paths and color-calibrated PSDs within 12 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              href="/#free-sample"
              className="px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2"
            >
              <span>Submit Free Test Batch</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
              className="px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Book Discovery Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

