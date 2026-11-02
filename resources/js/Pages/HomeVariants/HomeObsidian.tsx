import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Sparkles, Eye, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface HomeObsidianProps {
  clients?: any[];
}

export function HomeObsidian({ clients = [] }: HomeObsidianProps) {
  return (
    <div className="min-h-screen bg-[#050608] text-[#E0E2EC] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      <Head>
        <title>CuttingEdger Obsidian — Stealth Post-Production Craft</title>
      </Head>

      <section className="relative pt-36 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#de4a2c]/15 blur-[160px] rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono uppercase tracking-widest text-[#de4a2c] mb-6">
            <Flame className="w-3.5 h-3.5" />
            <span>Obsidian Edition 05 // #DE4A2C Glow</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Stealth Precision.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff7859] to-white">
              Velvety Obsidian.
            </span>
          </h1>
          <p className="mt-5 text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
            Deep-black backdrop contrast, specular highlight carving, and invisible vector isolation crafted for iconic luxury maisons.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/services/ecommerce-catalog-optimization/clipping-path-service?v=5"
              className="px-8 py-4 rounded-full bg-[#de4a2c] hover:bg-[#c2381c] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(222,74,44,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Obsidian Layout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

