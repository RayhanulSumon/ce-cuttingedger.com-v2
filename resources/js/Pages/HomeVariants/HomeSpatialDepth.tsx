import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  CheckCircle2,
  Layers,
  Camera,
  Shirt,
  UserCheck,
  Scissors,
  Eye,
  SlidersHorizontal,
  Compass,
  RotateCw,
  Zap,
  ShieldCheck
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

const SPATIAL_CARDS = [
  {
    id: 's1',
    code: '01',
    title: 'AI Corporate Headshots',
    label: 'EXECUTIVE PORTRAITURE',
    desc: 'Bespoke corporate studio portraits from casual smartphone selfies with consistent company lighting.',
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    after: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
    elevation: 'shadow-[0_20px_60px_rgba(59,130,246,0.12)]',
    accent: '#3b82f6',
    icon: UserCheck
  },
  {
    id: 's2',
    code: '02',
    title: 'AI Fashion Runway Models',
    label: 'APPAREL SYNTHESIS',
    desc: 'Transforms flat ghost mannequins into living editorial runway models with natural fabric creases.',
    before: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
    after: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    elevation: 'shadow-[0_20px_60px_rgba(236,72,153,0.12)]',
    accent: '#ec4899',
    icon: Shirt
  },
  {
    id: 's3',
    code: '03',
    title: '3D Virtual Try-On Engine',
    label: 'CLOTH PHYSICS',
    desc: 'Real-time 3D cloth wrap, tension matching, and seam draping on consumer avatars.',
    before: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
    after: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    elevation: 'shadow-[0_20px_60px_rgba(139,92,246,0.12)]',
    accent: '#8b5cf6',
    icon: Sparkles
  },
  {
    id: 's4',
    code: '04',
    title: 'Product Scene Generation',
    label: 'ENVIRONMENT RIGGING',
    desc: 'Generative physical caustics, sunlit travertine pedestals, and raytraced reflections for luxury goods.',
    before: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80',
    after: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
    elevation: 'shadow-[0_20px_60px_rgba(245,158,11,0.12)]',
    accent: '#f59e0b',
    icon: Camera
  },
  {
    id: 's5',
    code: '05',
    title: 'Precision Pen Tool Paths',
    label: 'HIGH JEWELRY & MASKING',
    desc: 'Bespoke ±0.25px vector Bézier paths, micro-dust ablation, and non-destructive 16-bit master PSDs.',
    before: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    after: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
    elevation: 'shadow-[0_20px_60px_rgba(16,185,129,0.12)]',
    accent: '#10b981',
    icon: Scissors
  }
];

export function HomeSpatialDepth({ clients = [] }: HomeProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sliderVal, setSliderVal] = useState(50);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [submitted, setSubmitted] = useState(false);

  const active = SPATIAL_CARDS[selectedIdx];
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 12), y: x * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#0A0D14] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Floating Spatial Header */}
      <header className="sticky top-4 z-40 max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.04)] px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#de4a2c] to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#de4a2c]/20">
              CE
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-neutral-900 leading-none">
                CUTTING EDGER
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Spatial Depth Studio
              </span>
            </div>
          </Link>

          {/* Quick Floating Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-100/70 p-1 rounded-2xl">
            {SPATIAL_CARDS.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => setSelectedIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedIdx === idx
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {card.code} {card.title.split(' ')[0]}
              </button>
            ))}
          </div>

          <Link
            href="/contact"
            className="px-4 py-2 rounded-2xl bg-neutral-900 hover:bg-[#de4a2c] text-white text-xs font-semibold transition-colors"
          >
            Start Free Test
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO: 3D PERSPECTIVE TILT STAGE
      ========================================================= */}
      <section className="py-12 sm:py-16 px-4 max-w-6xl mx-auto text-center">
        <div className="max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200/80 shadow-xs mb-3 text-xs font-medium text-neutral-700">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Interactive 3D Stage // Move Mouse to Tilt Perspective</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 mb-3">
            Spatial Precision Atelier
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base">
            Hover over the floating stage to experience 3D depth and slide between raw plates and polished commercial deliverables.
          </p>
        </div>

        {/* Floating Perspective Stage */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out'
          }}
          className={`max-w-4xl mx-auto rounded-3xl p-3 bg-white/90 border border-white/90 ${active.elevation} backdrop-blur-2xl transition-shadow duration-500 mb-10 text-left`}
        >
          <div className="relative h-[420px] sm:h-[540px] rounded-2xl overflow-hidden bg-neutral-100 select-none">
            {/* Master After Image */}
            <img
              src={active.after}
              alt={active.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Split Before Image */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderVal}%` }}
            >
              <img
                src={active.before}
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ width: `${cardRef.current?.clientWidth || 900}px`, maxWidth: 'none' }}
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider">
                RAW CAPTURE
              </div>
            </div>

            {/* After Tag */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-neutral-900 text-[11px] font-mono uppercase tracking-wider shadow-sm font-bold">
              POLISHED MASTER
            </div>

            {/* Split Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.6)] z-20 pointer-events-none"
              style={{ left: `${sliderVal}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-neutral-900 shadow-xl flex items-center justify-center font-bold text-xs border border-neutral-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#de4a2c]" />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Spatial slider"
            />

            {/* Floating Glass Island Card on bottom */}
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/90 shadow-lg z-20 pointer-events-none">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#de4a2c]">
                DISCIPLINE {active.code} // {active.label}
              </span>
              <h3 className="text-base font-bold text-neutral-950 mt-0.5">
                {active.title}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                {active.desc}
              </p>
            </div>
          </div>
        </div>

        {/* 5 Floating Spatial Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {SPATIAL_CARDS.map((card, idx) => {
            const Icon = card.icon;
            const isSel = selectedIdx === idx;
            return (
              <button
                key={card.id}
                onClick={() => setSelectedIdx(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSel
                    ? 'bg-white border-[#de4a2c] ring-2 ring-[#de4a2c]/20 shadow-md scale-[1.02]'
                    : 'bg-white/60 hover:bg-white border-neutral-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-[#de4a2c]">{card.code}</span>
                  <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-[#de4a2c]' : 'text-neutral-400'}`} />
                </div>
                <div className="font-bold text-xs text-neutral-900 leading-tight">
                  {card.title}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 2: FLOATING ISLAND SPEC BENCH
      ========================================================= */}
      <section className="py-14 px-4 max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 bg-white/80 border border-neutral-200/80 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <Zap className="w-5 h-5 text-[#de4a2c] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-neutral-900 mb-1">Sub-2h Rush Pipeline</h4>
              <p className="text-xs text-neutral-500">Fast batch delivery without sacrificing human QA verification.</p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-neutral-900 mb-1">Strict Enterprise NDA</h4>
              <p className="text-xs text-neutral-500">Unreleased catalog and celebrity assets secured with zero data leak.</p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <Sparkles className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-neutral-900 mb-1">16-Bit Non-Destructive</h4>
              <p className="text-xs text-neutral-500">Layered master PSDs with vector pen clipping paths and shadow layers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: FREE TEST MODAL TRIGGER
      ========================================================= */}
      <footer className="py-14 border-t border-neutral-200 bg-white px-4 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 mb-2">
            Try 3 Assets on the Spatial Workbench
          </h2>
          <p className="text-xs text-neutral-500 mb-5">
            Test any service: AI headshots, virtual try-on, or jewelry retouch.
          </p>

          {submitted ? (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold font-mono">
              ✓ Ingest request received. Check inbox for upload link.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter work email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#de4a2c]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#de4a2c] hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Send Test
              </button>
            </form>
          )}

          <div className="mt-8 text-[11px] font-mono text-neutral-400">
            © 2026 CUTTING EDGER ATELIER. SPATIAL DEPTH PROTOTYPE 14.
          </div>
        </div>
      </footer>
    </div>
  );
}

