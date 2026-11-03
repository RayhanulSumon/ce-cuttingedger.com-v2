import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronRight,
  Check,
  Eye,
  Camera,
  Shirt,
  Sparkles,
  Scissors,
  UserCheck
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

const EDITORIAL_DISCIPLINES = [
  {
    num: '01',
    slug: 'headshots',
    title: 'AI Corporate Headshots',
    sub: 'S1 Atelier / Portraiture',
    quote: 'From casual smartphone selfies to executive C-suite portraits with unified corporate illumination.',
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
    beforeTag: 'Raw Unprocessed Selfie',
    afterTag: 'C-Suite Studio Standard',
    spec: 'Sub-2h SLA • Identity Preserve Lock'
  },
  {
    num: '02',
    slug: 'runway',
    title: 'AI Runway Fashion Models',
    sub: 'S2 Atelier / Apparel Movement',
    quote: 'Converting flat ghost mannequins into dynamic editorial living models across global runway diversity.',
    before: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    beforeTag: 'Hollow Mannequin Plate',
    afterTag: 'Living Runway Editorial',
    spec: 'Zero Studio Overhead • Realistic Fabric Drape'
  },
  {
    num: '03',
    slug: 'tryon',
    title: '3D Virtual Try-On Synthesis',
    sub: 'S3 Atelier / Garment Physics',
    quote: 'Photorealistic garment synthesis on customer or brand avatars with micro-wrinkle tension alignment.',
    before: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    beforeTag: 'Flat Garment SKU',
    afterTag: 'Anatomical Model Fit',
    spec: '4K Ultra-Res • 38% Return Reduction'
  },
  {
    num: '04',
    slug: 'scene',
    title: 'Architectural Scene Generation',
    sub: 'S4 Atelier / Environment Design',
    quote: 'Replacing blank product cutouts with bespoke morning sun caustics, travertine marble, and natural air.',
    before: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    beforeTag: 'Isolated Studio Product',
    afterTag: 'Sunlit Marble Scene',
    spec: 'Raytraced Caustics • 10K+ SKU Automation'
  },
  {
    num: '05',
    slug: 'paths',
    title: 'Hand-Crafted Pen Tool Paths',
    sub: 'S5 Atelier / High Jewelry & Retouch',
    quote: 'Bespoke ±0.25px vector Bézier paths, micro-dust ablation, and non-destructive 16-bit master PSDs.',
    before: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    beforeTag: 'Macro RAW Unretouched',
    afterTag: 'Specular Diamond Master',
    spec: '±0.25px Vector Tolerance • Zero Halos'
  }
];

const LUXURY_HOUSES = ['BALENCIAGA', 'CARTIER', 'SSENSE', 'JIL SANDER', 'ACNE STUDIOS', 'FARFETCH', 'MONCLER'];

export function HomeAtelierEditorial({ clients = [] }: HomeProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showRaw, setShowRaw] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const active = EDITORIAL_DISCIPLINES[selectedIdx];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#121212] selection:bg-[#121212] selection:text-white font-serif antialiased overflow-x-hidden">
      {/* Top Editorial Masthead Bar */}
      <header className="border-b border-neutral-300/80 px-6 sm:px-12 py-5 font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-neutral-900">
              Cutting Edger
            </Link>
            <span className="hidden md:inline text-neutral-400 font-mono text-[11px] uppercase tracking-widest">
              // ATELIER ISSUE NO. 24
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            <span>PARIS</span>
            <span>NEW YORK</span>
            <span>TOKYO</span>
            <span className="text-[#de4a2c] font-bold">5 DISCIPLINES</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="px-5 py-2 border border-neutral-900 rounded-none bg-neutral-900 text-white hover:bg-transparent hover:text-neutral-900 text-xs font-mono uppercase tracking-wider transition-all"
            >
              Order Sample
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO: EDITORIAL SPLIT COVER
      ========================================================= */}
      <section className="px-6 sm:px-12 py-12 sm:py-20 max-w-7xl mx-auto border-b border-neutral-300/70">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Asymmetrical Typography Index */}
          <div className="lg:col-span-5 font-sans">
            <span className="font-mono text-xs uppercase tracking-widest text-[#de4a2c] block mb-3 font-semibold">
              // THE 2026 VISUAL REPORT
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-[1.05] tracking-tight text-neutral-950 mb-6">
              The Pure Architecture <br />
              <span className="italic font-light">of Visual Taste.</span>
            </h1>

            <p className="font-serif text-neutral-600 text-base sm:text-lg leading-relaxed mb-8">
              {active.quote}
            </p>

            {/* Quick Index Switcher (01 to 05) */}
            <div className="space-y-2 border-t border-b border-neutral-200 py-4 mb-8">
              {EDITORIAL_DISCIPLINES.map((item, idx) => (
                <button
                  key={item.num}
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full flex items-center justify-between text-left py-2 px-3 transition-colors ${
                    selectedIdx === idx
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'hover:bg-neutral-200/50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs">{item.num}</span>
                    <span className="text-xs uppercase tracking-wide font-sans">{item.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>

            {/* Press and Hold RAW Toggle */}
            <div className="flex items-center gap-4">
              <button
                onMouseDown={() => setShowRaw(true)}
                onMouseUp={() => setShowRaw(false)}
                onTouchStart={() => setShowRaw(true)}
                onTouchEnd={() => setShowRaw(false)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2 select-none"
              >
                <Eye className="w-3.5 h-3.5" />
                {showRaw ? 'Releasing RAW Plate...' : 'Press & Hold for RAW'}
              </button>
              <span className="text-[11px] font-mono text-neutral-500">
                {active.spec}
              </span>
            </div>
          </div>

          {/* Right Column: Monumental Full-Height Frame */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] bg-neutral-200 overflow-hidden shadow-2xl border border-neutral-900/10">
              <img
                src={showRaw ? active.before : active.after}
                alt={active.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Minimal Magazine Stamp */}
              <div className="absolute top-6 left-6 font-mono text-[11px] bg-white/90 backdrop-blur-md px-3 py-1.5 uppercase tracking-wider text-neutral-900 border border-neutral-300">
                {showRaw ? active.beforeTag : active.afterTag}
              </div>

              <div className="absolute bottom-6 right-6 font-mono text-[11px] bg-neutral-900/80 backdrop-blur-md text-white px-3 py-1.5 uppercase tracking-wider">
                {active.num} / 05 // {active.sub}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: LUXURY BRAND MARQUEE
      ========================================================= */}
      <section className="py-8 border-b border-neutral-300/70 overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline">
            PRODUCED FOR LUXURY HOUSES:
          </span>
          <div className="flex items-center gap-8 sm:gap-14 overflow-x-auto py-2">
            {LUXURY_HOUSES.map((house, i) => (
              <span
                key={i}
                className="font-serif text-xs sm:text-sm tracking-[0.25em] text-neutral-800 uppercase whitespace-nowrap opacity-80"
              >
                {house}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: THE 5-PILLAR ARCHIVE LOOKBOOK
      ========================================================= */}
      <section className="px-6 sm:px-12 py-20 max-w-7xl mx-auto">
        <div className="mb-14 font-sans text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-[#de4a2c] font-bold block mb-2">
            COMPLETE ARCHIVE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-neutral-950 tracking-tight">
            Curated Atelier Disciplines
          </h2>
        </div>

        <div className="space-y-16">
          {EDITORIAL_DISCIPLINES.map((item, idx) => (
            <div
              key={item.num}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-neutral-200 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[16/10] bg-neutral-200 overflow-hidden shadow-md">
                  <img
                    src={item.after}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-900 border border-neutral-200">
                    DISCIPLINE {item.num}
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-6 font-sans ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="font-mono text-xs text-neutral-400 uppercase tracking-widest mb-1">
                  {item.sub}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-950 mb-3">
                  {item.title}
                </h3>
                <p className="font-serif text-neutral-600 text-sm sm:text-base leading-relaxed mb-6">
                  {item.quote}
                </p>
                <div className="font-mono text-xs text-neutral-500 mb-6 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#de4a2c]" /> {item.spec}
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider border-b border-neutral-900 pb-1 hover:text-[#de4a2c] hover:border-[#de4a2c] transition-colors"
                >
                  Request Discipline Sample <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 4: BESPOKE COMMISSION FOOTER
      ========================================================= */}
      <section className="bg-neutral-900 text-white px-6 sm:px-12 py-20 font-sans">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#de4a2c] block mb-3">
            ATELIER COMMISSION
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light mb-6">
            Commission Your Test Production
          </h2>
          <p className="font-serif text-neutral-400 text-base max-w-lg mx-auto mb-8">
            Experience our sub-2h turnaround and pixel-clean vector paths on your own raw catalog imagery with zero cost.
          </p>

          {formSubmitted ? (
            <div className="p-4 bg-white/10 text-white font-mono text-xs">
              Thank you. Our atelier director will contact you immediately.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormSubmitted(true);
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Work email address"
                className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-neutral-900 font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#de4a2c] hover:text-white transition-colors"
              >
                Inquire Now
              </button>
            </form>
          )}

          <div className="mt-12 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            © 2026 CUTTING EDGER ATELIER. EDITORIAL PROTOTYPE 10.
          </div>
        </div>
      </section>
    </div>
  );
}

