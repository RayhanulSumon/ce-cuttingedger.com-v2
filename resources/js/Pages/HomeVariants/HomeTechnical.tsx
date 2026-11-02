import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Terminal, Cpu, Sliders, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HomeTechnicalProps {
  clients?: any[];
}

export function HomeTechnical({ clients = [] }: HomeTechnicalProps) {
  const [selectedSpec, setSelectedSpec] = useState<'tolerance' | 'color' | 'layers'>('tolerance');

  return (
    <div className="min-h-screen bg-[#08090C] text-[#E2E8F0] selection:bg-[#de4a2c] selection:text-white font-mono antialiased overflow-x-hidden">
      <Head>
        <title>CuttingEdger Tech — High-Throughput Post-Production Pipeline</title>
      </Head>

      {/* Cyber Blueprint Grid Background */}
      <div className="pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#de4a2c]/50 text-xs text-[#de4a2c] mb-6">
          <Terminal className="w-3.5 h-3.5" />
          <span>PRODUCTION TELEMETRY HUD // BUILD 2026.11</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-sans">
          Algorithmic Routing.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff6b4a] to-white">
            Human Precision.
          </span>
        </h1>
        <p className="mt-4 text-neutral-400 font-sans text-base sm:text-lg max-w-2xl">
          Zero-tolerance vector path precision, automated metadata injection, and guaranteed turnaround SLAs via our distributed production clusters.
        </p>

        {/* Live HUD Matrix */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-neutral-400 uppercase">Vector Path Tolerance</div>
            <div className="text-2xl font-bold text-[#de4a2c] mt-1">±0.25 px</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">300% zoom verification</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-neutral-400 uppercase">Throughput Capacity</div>
            <div className="text-2xl font-bold text-white mt-1">20,000+</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Images / 24-hr cycle</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-neutral-400 uppercase">Color Drift Threshold</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">ΔE &lt; 0.8</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">X-Rite Pantone standard</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-neutral-400 uppercase">SLA Adherence Rate</div>
            <div className="text-2xl font-bold text-[#de4a2c] mt-1">99.98%</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Enterprise contract backed</div>
          </div>
        </div>

        {/* Technical Workbench Preview */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0F1117] border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#de4a2c] animate-ping" />
              <span className="font-bold text-white font-sans">CLUSTER STATUS: OPERATIONAL</span>
            </div>
            <Link
              href="/services/ecommerce-catalog-optimization/clipping-path-service?v=3"
              className="text-[#de4a2c] hover:underline flex items-center gap-1 font-bold"
            >
              <span>View Technical Single Page (Variant 03)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-xs font-mono text-[#de4a2c] font-bold">STAGE 01 // INGESTION</div>
              <h4 className="text-base font-bold text-white mt-1">Asset De-Bayering & Audit</h4>
              <p className="text-xs text-neutral-400 mt-2">
                Automated checksum validation, color profile extraction (sRGB, Adobe RGB 1998, Display P3), and metadata tagging.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-xs font-mono text-[#de4a2c] font-bold">STAGE 02 // VECTORIZING</div>
              <h4 className="text-base font-bold text-white mt-1">Hand Pen-Tool Masking</h4>
              <p className="text-xs text-neutral-400 mt-2">
                Manual Bezier path anchor distribution with smart tangent handles to prevent stair-stepping or pixel halos on high-res displays.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-xs font-mono text-[#de4a2c] font-bold">STAGE 03 // DISPATCH</div>
              <h4 className="text-base font-bold text-white mt-1">S3 / FTP Cloud Delivery</h4>
              <p className="text-xs text-neutral-400 mt-2">
                Layered PSD, transparent alpha PNG, and WebP web-optimized packages delivered directly to brand CDN or storage buckets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

