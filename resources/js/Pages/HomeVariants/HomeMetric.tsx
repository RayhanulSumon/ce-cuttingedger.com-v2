import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  Scissors,
  Sparkles
} from 'lucide-react';

interface HomeProps {
  clients?: Array<{
    id: number;
    name: string;
    logo_dark?: string;
    logo_light?: string;
    url?: string;
  }>;
}

const LUXURY_BRANDS = [
  'BALENCIAGA',
  'CARTIER',
  'SSENSE',
  'FARFETCH',
  'KITH',
  'JIL SANDER',
  'ACNE STUDIOS',
  'MONCLER'
];

const METRIC_STATS = [
  { metric: '2.4M+', label: 'Catalog Assets Retouched', delta: '+34% YoY Scale' },
  { metric: '99.98%', label: 'SLA Delivery Compliance', delta: 'Guaranteed by Contract' },
  { metric: '< 0.8', label: 'Color Deviation (ΔE)', delta: 'X-Rite Calibrated' },
  { metric: '4h - 12h', label: 'Average Turnaround Time', delta: '24/7 Global Shifts' }
];

const METRIC_SERVICES = [
  {
    icon: Scissors,
    title: 'Pen-Tool Clipping Path',
    spec: '±0.25px Tolerance',
    desc: '300% zoom vector Bézier anchors for flawless silhouetting against any background color.'
  },
  {
    icon: Layers,
    title: '3D Ghost Mannequin',
    spec: 'Anatomical Symmetry',
    desc: 'Neck joint insertion, fabric volume retention, and interior tag reconstruction for e-com apparel.'
  },
  {
    icon: Sparkles,
    title: 'Jewelry Specular Polish',
    spec: 'Micro-Focus Stacking',
    desc: 'Gem facet brilliance, metal polishing, and multi-exposure dust removal for luxury hardgoods.'
  },
  {
    icon: Zap,
    title: 'Colorway Matching',
    spec: 'Physical Swatch Sync',
    desc: 'Reproduce infinite SKU color variants from a single photoshoot master plate with true color fidelity.'
  }
];

export function HomeMetric({ clients = [] }: HomeProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#0F172A] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-white py-2 px-4 text-center text-xs font-medium">
        <span className="text-[#de4a2c] font-bold">Q4 2026 BENCHMARK:</span>{' '}
        Over 99.98% SLA compliance across 12,000 enterprise batches.{' '}
        <a href="#metrics" className="underline font-bold text-neutral-300 hover:text-white ml-1">
          View Telemetry →
        </a>
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[#0F172A] text-xs font-semibold mb-6 border border-neutral-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PRODUCTION TELEMETRY ACTIVE</span>
          <span className="text-neutral-300">•</span>
          <span className="text-[#de4a2c] font-bold">16 ACTIVE CLUSTERS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
          Enterprise Post-Production.{' '}
          <span className="text-[#de4a2c]">Engineered by Metrics.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          The high-throughput retouching infrastructure trusted by global luxury marketplaces, department stores, and fast-growing DTC catalog brands.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#trial"
            className="px-7 py-3.5 rounded-full bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold text-sm tracking-wide transition-colors shadow-md flex items-center gap-2"
          >
            <span>Start Free 3-Image Trial</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#metrics"
            className="px-6 py-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#0F172A] font-bold text-sm transition-colors border border-neutral-300"
          >
            Review SLA Standards
          </a>
        </div>

        {/* 4 Metric Boxes */}
        <div id="metrics" className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {METRIC_STATS.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-[#de4a2c] transition-all hover:shadow-md"
            >
              <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#0F172A] mt-2">
                {stat.metric}
              </div>
              <div className="text-xs font-bold text-[#de4a2c] mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stat.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Logotype Strip */}
      <section className="py-8 border-y border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-6 text-neutral-500 text-xs font-mono font-bold tracking-widest uppercase">
          {(clients.length > 0 ? clients.map((c) => c.name) : LUXURY_BRANDS).slice(0, 8).map((b, i) => (
            <span key={i} className="hover:text-neutral-900 transition-colors">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Specification Services Grid */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono font-bold text-[#de4a2c] uppercase tracking-wider mb-2">
            RIGOROUS PRODUCTION CRITERIA
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Zero-Tolerance Post-Production
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            Every file undergoes dual-pass quality assurance before export in layered PSD and WebP formats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRIC_SERVICES.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-neutral-200 bg-white hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 text-[#de4a2c] flex items-center justify-center mb-4 font-bold">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-mono font-bold text-[#de4a2c] uppercase">
                    {s.spec}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mt-1">{s.title}</h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{s.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-700">
                  <span>Guaranteed SLA</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ingestion Trial Form */}
      <section id="trial" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto border-t border-neutral-200">
        <div className="rounded-3xl p-8 sm:p-12 bg-[#0F172A] text-white shadow-xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#de4a2c] text-xs font-mono font-bold uppercase">
            <span>ENTERPRISE PILOT INGESTION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black">
            Test 3 Images With Zero Financial Risk
          </h2>

          <p className="text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Upload your unedited RAW or TIFF assets. We will return 100% production-ready PSDs with vector paths within 4 to 12 hours.
          </p>

          {!formSubmitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormSubmitted(true);
              }}
              className="max-w-md mx-auto space-y-3 pt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter corporate email..."
                className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#de4a2c]"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold text-sm tracking-wide transition-colors shadow-lg"
              >
                Provision Free Test Batch
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pilot account initialized. Upload link transmitted to your email.</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC2 & NDA Compliant</span>
            </span>
            <span>•</span>
            <span>No Credit Card Required</span>
          </div>
        </div>
      </section>
    </div>
  );
}

