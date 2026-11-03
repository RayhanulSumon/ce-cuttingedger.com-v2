import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  SlidersHorizontal,
  Maximize2,
  CheckCircle2,
  Layers,
  Sparkles,
  Camera,
  Shirt,
  UserCheck,
  Scissors,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Play,
  Pause
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

const PANORAMIC_SLIDES = [
  {
    id: 's1',
    code: '01',
    discipline: 'AI Corporate Headshots',
    tagline: 'Uniform Executive Portraits from Everyday Selfies',
    desc: 'Transforms 6–10 natural selfies into high-end executive studio portraits with custom corporate backdrops.',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80',
    afterImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=85',
    accent: '#3b82f6',
    icon: UserCheck
  },
  {
    id: 's2',
    code: '02',
    discipline: 'AI Fashion Runway Models',
    tagline: 'Ghost Mannequin Plates into Living Catwalk Models',
    desc: 'Breathes dynamic human motion, tailored body diversity, and natural fabric creases into flat apparel cutouts.',
    beforeImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=80',
    afterImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85',
    accent: '#ec4899',
    icon: Shirt
  },
  {
    id: 's3',
    code: '03',
    discipline: '3D Virtual Try-On Engine',
    tagline: 'Instant Garment Tension & Anatomical Synthesis',
    desc: 'Real-time 3D cloth wrap and seam tension simulation on digital avatars, lowering returns by 38%.',
    beforeImg: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1400&q=80',
    afterImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
    accent: '#8b5cf6',
    icon: Sparkles
  },
  {
    id: 's4',
    code: '04',
    discipline: 'Product Scene Generation',
    tagline: 'Isolated Packs into Sunlit Travertine Environments',
    desc: 'Generative physical caustics, architectural studio pedestals, and raytraced reflections for luxury goods.',
    beforeImg: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80',
    afterImg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85',
    accent: '#f59e0b',
    icon: Camera
  },
  {
    id: 's5',
    code: '05',
    discipline: 'Precision Pen Tool & Retouch',
    tagline: 'Hand-Crafted Vector Paths & Specular Facets',
    desc: '300% zoom Bézier pen paths, micro-dust elimination, and non-destructive 16-bit delivery under strict NDAs.',
    beforeImg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=80',
    afterImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=85',
    accent: '#10b981',
    icon: Scissors
  }
];

export function HomeParallaxHorizon({ clients = [] }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [expandedCol, setExpandedCol] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [formDone, setFormDone] = useState(false);

  const active = PANORAMIC_SLIDES[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % PANORAMIC_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + PANORAMIC_SLIDES.length) % PANORAMIC_SLIDES.length);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#0A0D14] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Top Panoramic Ribbon */}
      <header className="border-b border-neutral-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-base tracking-tight text-neutral-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#de4a2c]" />
              CUTTING EDGER
            </Link>
            <span className="text-[11px] font-mono text-neutral-400 border-l border-neutral-300 pl-3 hidden sm:inline">
              PARALLAX HORIZON // 05 DISCIPLINES
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 font-mono text-[11px] text-neutral-500">
              <span>SLA: &lt; 2H</span>
              <span>VECTOR: ±0.25PX</span>
              <span className="text-emerald-600 font-bold">● ACTIVE LAB</span>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-[#de4a2c] transition-colors"
            >
              Book Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO: HORIZONTAL FILMSTRIP EXHIBITION
      ========================================================= */}
      <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold">
              CINEMATIC FILMSTRIP EXHIBITION
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-0.5">
              Interactive 5-Pillar Horizon
            </h1>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-neutral-500 mr-2">
              {active.code} / 05
            </span>
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-white border border-neutral-300 shadow-xs flex items-center justify-center hover:bg-neutral-100 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-neutral-900 text-white shadow-xs flex items-center justify-center hover:bg-[#de4a2c] transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master Panoramic Artboard with Integrated Split Slider */}
        <div className="relative h-[480px] sm:h-[600px] rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl border border-neutral-300/80 group">
          {/* After Image (Right/Full) */}
          <img
            src={active.afterImg}
            alt={active.tagline}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Before Image (Left Split) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={active.beforeImg}
              alt="Raw Input"
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ width: '100vw', maxWidth: 'none' }}
            />
            <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider">
              RAW CAPTURE
            </div>
          </div>

          {/* After Tag */}
          <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-mono uppercase tracking-wider shadow-md">
            MASTER ATELIER FINISH
          </div>

          {/* Split Divider */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.8)] z-20 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-neutral-900 shadow-xl flex items-center justify-center text-xs font-bold border border-neutral-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#de4a2c]" />
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            aria-label="Split slider"
          />

          {/* Floating Lower HUD */}
          <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20 pointer-events-none">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-[#de4a2c] text-white font-mono text-[10px] font-bold">
                  PILLAR {active.code}
                </span>
                <span className="font-mono text-xs text-neutral-500 uppercase tracking-wide">
                  {active.discipline}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-950">
                {active.tagline}
              </h2>
            </div>

            <div className="pointer-events-auto flex items-center gap-3">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#de4a2c] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm inline-flex items-center gap-2"
              >
                Order Free Test <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Thumbnail Filmstrip Stepper */}
        <div className="grid grid-cols-5 gap-3 mt-4">
          {PANORAMIC_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-20 sm:h-24 rounded-2xl overflow-hidden relative border transition-all text-left group ${
                currentSlide === idx
                  ? 'ring-2 ring-[#de4a2c] border-[#de4a2c]'
                  : 'opacity-70 hover:opacity-100 border-neutral-300'
              }`}
            >
              <img src={s.afterImg} alt={s.discipline} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end text-white">
                <span className="font-mono text-[10px] font-bold text-amber-400">{s.code}</span>
                <span className="text-[11px] font-bold leading-tight truncate">{s.discipline}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 2: MULTI-COLUMN EXPANDER ACCORDION
      ========================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold mb-1">
            FULL SERVICE SPECTRUM
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Hover to Expand Any Pillar
          </h2>
        </div>

        {/* Dynamic Multi-Column Flex Accordion */}
        <div className="h-[460px] flex flex-col sm:flex-row gap-2 rounded-3xl overflow-hidden bg-neutral-200 p-2 shadow-inner">
          {PANORAMIC_SLIDES.map((col, idx) => {
            const isExp = expandedCol === idx;
            return (
              <div
                key={col.id}
                onMouseEnter={() => setExpandedCol(idx)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out flex flex-col justify-end p-6 ${
                  isExp ? 'sm:flex-[4] flex-[3]' : 'sm:flex-[1] flex-[1]'
                }`}
              >
                <img
                  src={col.afterImg}
                  alt={col.discipline}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                <div className="relative z-10 text-white">
                  <span className="font-mono text-xs font-bold text-[#de4a2c] block mb-1">
                    {col.code} //
                  </span>
                  <h3 className="font-bold text-lg sm:text-xl leading-tight mb-2">
                    {col.discipline}
                  </h3>

                  {isExp && (
                    <div className="animate-in fade-in duration-300">
                      <p className="text-xs text-neutral-300 max-w-md mb-4 line-clamp-2">
                        {col.desc}
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-neutral-900 text-xs font-bold hover:bg-[#de4a2c] hover:text-white transition-colors"
                      >
                        Explore Service <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 3: FREE TEST FOOTER BAR
      ========================================================= */}
      <footer className="border-t border-neutral-300/80 bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mb-3">
            Start Your First Free Batch Now
          </h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">
            Upload up to 3 test files. Our artists and automated pipeline deliver master PSDs under strict NDA.
          </p>

          {formDone ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold font-mono">
              Request received. An engineer will initiate your upload channel.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormDone(true);
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Work email address"
                className="flex-1 px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#de4a2c]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#de4a2c] text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-900 transition-colors"
              >
                Send 3 Free Test
              </button>
            </form>
          )}

          <div className="text-[11px] font-mono text-neutral-400 mt-8">
            © 2026 CUTTING EDGER ATELIER. PARALLAX HORIZON PROTOTYPE 11.
          </div>
        </div>
      </footer>
    </div>
  );
}

