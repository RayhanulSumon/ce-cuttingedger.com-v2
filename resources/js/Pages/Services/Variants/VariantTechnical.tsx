import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  ArrowUpRight,
  Terminal,
  Cpu,
  Sliders,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Zap,
  Clock,
  ChevronDown,
  Hash,
  Database,
  Code2,
  FileCode2,
  Calendar
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

export const VariantTechnical: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [skuVolume, setSkuVolume] = useState(300);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activeLayerTab, setActiveLayerTab] = useState<'layer0' | 'layer1' | 'layer2'>('layer0');

  // Compute Technical SLA estimates dynamically
  const volumeEstimate = useMemo(() => {
    if (skuVolume <= 100) {
      return { hours: '4 - 6 Hours', team: '1 Dedicated Senior Artisan', tier: 'Express Pilot SLA' };
    }
    if (skuVolume <= 500) {
      return { hours: '12 Hours', team: '3 Artisans + 1 QA Lead', tier: 'Standard Studio SLA' };
    }
    if (skuVolume <= 1500) {
      return { hours: '18 - 24 Hours', team: '6 Artisans + 2 QA Leads', tier: 'Enterprise Batch SLA' };
    }
    return { hours: 'Custom Continuous Ingest', team: 'Dedicated 12-Desk Production Pod', tier: 'Dedicated Retainer SLA' };
  }, [skuVolume]);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E2E8F0] antialiased selection:bg-[#00F5FF] selection:text-[#0A0B0E] font-sans pb-32">
      {/* 1. TECHNICAL TERMINAL STATUS STRIP */}
      <div className="border-b border-cyan-500/20 bg-[#0E1015] sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-400 font-bold tracking-wider">SPEC LAB // SYS_V3.8</span>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <span className="text-neutral-400 hidden sm:inline truncate max-w-sm">
              ENGINE: {service.title.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span className="hidden md:inline font-bold text-emerald-400">● 100% VECTOR PRECISION</span>
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-300">
              QC: PASSED
            </span>
          </div>
        </div>
      </div>

      {/* 2. TECHNICAL HERO WORKBENCH */}
      <section className="pt-14 pb-16 px-4 sm:px-8 border-b border-white/10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,245,255,0.08),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 font-mono text-xs text-cyan-300">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>SPECIFICATION // {service.marquee_label || 'HIGH-PRECISION ASSET PIPELINE'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-mono font-extrabold tracking-tight text-white leading-tight">
                {service.h1_title || service.title}
              </h1>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl font-mono">
                {service.subtitle || service.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <a
                href="#calculator"
                className="px-6 py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)] flex items-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Estimate Batch SLA</span>
              </a>

              <a
                href="#free-sample"
                className="px-6 py-3.5 rounded-lg border border-white/20 hover:border-white/40 text-white font-bold transition-all flex items-center gap-2 bg-white/5"
              >
                <span>Upload Test Files</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Technical Specs Readout Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
            <div className="p-4 rounded-xl bg-[#12141C] border border-cyan-500/20 font-mono space-y-1">
              <div className="text-[10px] uppercase text-cyan-400/70 font-bold">VECTOR TOLERANCE</div>
              <div className="text-xl font-extrabold text-white">≤ 0.1px Bezier</div>
              <div className="text-[11px] text-neutral-400">Sub-pixel curvature</div>
            </div>
            <div className="p-4 rounded-xl bg-[#12141C] border border-white/10 font-mono space-y-1">
              <div className="text-[10px] uppercase text-neutral-400 font-bold">CALIBRATED DELTA-E</div>
              <div className="text-xl font-extrabold text-emerald-400">&lt; 1.0 Strict</div>
              <div className="text-[11px] text-neutral-400">D65 Master Colorimeter</div>
            </div>
            <div className="p-4 rounded-xl bg-[#12141C] border border-white/10 font-mono space-y-1">
              <div className="text-[10px] uppercase text-neutral-400 font-bold">BATCH THROUGHPUT</div>
              <div className="text-xl font-extrabold text-white">10,000 SKUs/Day</div>
              <div className="text-[11px] text-neutral-400">Automated queue balancing</div>
            </div>
            <div className="p-4 rounded-xl bg-[#12141C] border border-white/10 font-mono space-y-1">
              <div className="text-[10px] uppercase text-neutral-400 font-bold">SECURITY ENCRYPTION</div>
              <div className="text-xl font-extrabold text-white">AES-256 + NDA</div>
              <div className="text-[11px] text-neutral-400">Air-gapped production pod</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE BATCH VOLUME & SLA ESTIMATOR */}
      <section id="calculator" className="py-16 px-4 sm:px-8 border-b border-white/10 bg-[#0D0F14]">
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#13151D] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-xs uppercase text-cyan-400 font-bold block">
                PRODUCTION CALCULATOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
                Live Turnaround & Capacity Estimator
              </h2>
            </div>
            <span className="font-mono text-xs px-3 py-1.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              TIER: {volumeEstimate.tier}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-neutral-400">Select Monthly or Batch SKU Volume:</span>
              <span className="text-xl font-extrabold text-cyan-300 bg-white/5 px-4 py-1 rounded border border-white/10">
                {skuVolume.toLocaleString()} SKUs
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="3000"
              step="50"
              value={skuVolume}
              onChange={(e) => setSkuVolume(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between font-mono text-[11px] text-neutral-500">
              <span>50 SKUs (Sample Pilot)</span>
              <span>1,000 SKUs (Catalog Drop)</span>
              <span>3,000+ SKUs (Continuous Retainer)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <span className="text-[10px] text-neutral-400 block font-bold">ESTIMATED CYCLE SLA</span>
              <span className="text-xl font-extrabold text-white mt-1 block">
                {volumeEstimate.hours}
              </span>
              <span className="text-xs text-emerald-400">100% On-Time Guarantee</span>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <span className="text-[10px] text-neutral-400 block font-bold">ALLOCATED DESK FORCE</span>
              <span className="text-xl font-extrabold text-white mt-1 block">
                {volumeEstimate.team}
              </span>
              <span className="text-xs text-neutral-400">Dual-Pass QC Verification</span>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <span className="text-[10px] text-neutral-400 block font-bold">INGEST ARCHITECTURE</span>
              <span className="text-xl font-extrabold text-cyan-300 mt-1 block">
                SFTP / S3 / API
              </span>
              <span className="text-xs text-neutral-400">Automated Drop Watcher</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPECIFICATION MATRIX: STANDARD VS CUTTINGEDGER LAB */}
      <section className="py-16 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-5xl mx-auto space-y-8 font-mono">
          <div className="text-center space-y-2">
            <span className="text-xs text-cyan-400 uppercase font-bold tracking-wider">
              BENCHMARK AUDIT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Technical Specification Matrix
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#12141C]">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-neutral-400">
                <tr>
                  <th className="p-4">SPECIFICATION PARAMETER</th>
                  <th className="p-4 text-neutral-400">GENERIC / AUTOMATED AI</th>
                  <th className="p-4 text-cyan-300 bg-cyan-950/30">CUTTINGEDGER SPEC LAB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                <tr>
                  <td className="p-4 font-bold text-white">Path Generation Method</td>
                  <td className="p-4 text-red-400">Automated Alpha Guessing</td>
                  <td className="p-4 text-emerald-400 font-bold bg-cyan-950/20">
                    100% Hand-Crafted Pen Tool Bezier
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Edge Placement Accuracy</td>
                  <td className="p-4 text-neutral-400">Fuzzy ± 2.0px artifact spread</td>
                  <td className="p-4 text-emerald-400 font-bold bg-cyan-950/20">
                    Exact 0.5px sub-pixel inward tuck
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Layer Deliverables</td>
                  <td className="p-4 text-neutral-400">Flattened JPG or simple PNG</td>
                  <td className="p-4 text-cyan-300 font-bold bg-cyan-950/20">
                    Layered PSD (Shadow, Mask, Polish, Recolor)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Color Space Integrity</td>
                  <td className="p-4 text-neutral-400">sRGB compressed, shifted hues</td>
                  <td className="p-4 text-cyan-300 font-bold bg-cyan-950/20">
                    16-Bit ProPhoto / Adobe RGB / Delta-E calibrated
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">SLA Enforcement</td>
                  <td className="p-4 text-neutral-400">Best-effort, frequent delays</td>
                  <td className="p-4 text-emerald-400 font-bold bg-cyan-950/20">
                    Contractual 12-Hour SLA with audit logs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. SYSTEM PIPELINE PROTOCOL */}
      {service.process_steps && service.process_steps.length > 0 && (
        <section className="py-16 px-4 sm:px-8 border-b border-white/10 font-mono">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="space-y-1">
              <span className="text-xs text-cyan-400 uppercase font-bold tracking-wider">
                EXECUTION PIPELINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Four-Stage Audited Protocol
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {service.process_steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#12141C] border border-white/10 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>STAGE {step.step}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{step.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. TECHNICAL DELIVERABLES MANIFEST */}
      <section className="py-16 px-4 sm:px-8 border-b border-white/10 font-mono">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="space-y-1">
            <span className="text-xs text-cyan-400 uppercase font-bold tracking-wider">
              ASSET SPECIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Export Manifest & File Payloads
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(service.deliverables || [
              'Embedded Clipping Path (TIFF / EPS)',
              '16-Bit ProPhoto Layered PSD',
              'Lossless Alpha Channel PNG',
              'Compressed Next-Gen WebP 300 DPI'
            ]).map((deliv, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#12141C] border border-white/10 flex items-center gap-3 text-xs"
              >
                <FileCode2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{deliv}</div>
                  <div className="text-[11px] text-neutral-400">DAM & E-Com compliant manifest</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED TECHNICAL QUESTIONS */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 px-4 sm:px-8 border-b border-white/10 font-mono">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-cyan-400 uppercase font-bold tracking-wider">
                SYSTEM DOCUMENTATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Technical FAQ
              </h2>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl bg-[#12141C] border border-white/10 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs text-white"
                    >
                      <span>// {faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-cyan-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-neutral-400 font-sans leading-relaxed border-t border-white/5 pt-3">
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

      {/* 8. TERMINAL INGEST CTA */}
      <section id="free-sample" className="py-16 px-4 sm:px-8 font-mono">
        <div className="max-w-4xl mx-auto rounded-2xl bg-cyan-950/30 border border-cyan-500/40 p-8 sm:p-12 text-center space-y-6">
          <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">
            ZERO LATENCY • AIR-GAPPED EVALUATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Trigger an automated test batch evaluation.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed font-sans">
            Submit 3 RAW assets. Receive audited Photoshop vector paths and color-calibrated masters within 12 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/#free-sample"
              className="px-8 py-4 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(0,245,255,0.4)] flex items-center gap-2"
            >
              <span>Initialize Test Batch</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
              className="px-6 py-4 rounded-lg border border-white/20 text-white font-bold text-xs hover:bg-white/5 transition-all"
            >
              Schedule Tech Architecture Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

