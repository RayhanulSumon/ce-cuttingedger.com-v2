import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight,
  ArrowUpRight,
  SlidersHorizontal,
  Eye,
  Check,
  ChevronDown
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

const ZENITH_STAGES = [
  {
    index: '01',
    code: 'HEADSHOT',
    title: 'AI Corporate Headshots',
    sub: 'S1 Atelier / Executive Portraits',
    tagline: 'Smartphone Selfies → C-Suite Studio Grade',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=85',
    spec: 'Sub-2h Turnaround • 100% Identity Preservation'
  },
  {
    index: '02',
    code: 'RUNWAY',
    title: 'AI Fashion Runway Models',
    sub: 'S2 Atelier / On-Model Synthesis',
    tagline: 'Ghost Mannequin → Living Catwalk Editorial',
    beforeImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85',
    spec: 'Zero Studio Overhead • Organic Fabric Creases'
  },
  {
    index: '03',
    code: 'TRY-ON',
    title: '3D Virtual Try-On Engine',
    sub: 'S3 Atelier / Real-Time Physics',
    tagline: 'Flat Garment SKU → Anatomical Avatar Fit',
    beforeImg: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85',
    spec: '4K WebGL Resolution • 38% Return Reduction'
  },
  {
    index: '04',
    code: 'SCENE',
    title: 'Product Scene Generation',
    sub: 'S4 Atelier / Architecture & Caustics',
    tagline: 'Tabletop Cutout → Sunlit Travertine Environment',
    beforeImg: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=85',
    spec: 'Raytraced Shadows • 10,000+ SKU Batch Pipeline'
  },
  {
    index: '05',
    code: 'RETOUCH',
    title: 'Precision Pen Tool & Retouch',
    sub: 'S5 Atelier / High Jewelry Vector Masking',
    tagline: 'Raw Macro Specimen → Laser Specular Facets',
    beforeImg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85',
    spec: '±0.25px Vector Bézier Paths • 16-Bit Master PSD'
  }
];

export function HomeZenithCanvas({ clients = [] }: HomeProps) {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [showRawHold, setShowRawHold] = useState(false);
  const [accordionHover, setAccordionHover] = useState<number | null>(null);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryDone, setInquiryDone] = useState(false);

  const active = ZENITH_STAGES[activeStageIdx];

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#0A0D14] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Top Zenith Studio Bar */}
      <header className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-widest text-neutral-900 uppercase">
              CUTTING EDGER
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              / ZENITH CANVAS 15
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
            {ZENITH_STAGES.map((s, idx) => (
              <button
                key={s.index}
                onClick={() => setActiveStageIdx(idx)}
                className={`transition-colors ${
                  activeStageIdx === idx
                    ? 'text-neutral-900 font-bold border-b border-neutral-900 pb-0.5'
                    : 'hover:text-neutral-900'
                }`}
              >
                {s.index} {s.code}
              </button>
            ))}
          </div>

          <Link
            href="/contact"
            className="px-5 py-2 rounded-full border border-neutral-900 bg-neutral-900 text-white text-xs font-semibold hover:bg-[#de4a2c] hover:border-[#de4a2c] transition-all"
          >
            Start Free Test
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO: MONUMENTAL FULLSCREEN VISUAL STAGE
      ========================================================= */}
      <section className="relative px-4 sm:px-12 pt-8 pb-16 max-w-7xl mx-auto">
        {/* Minimal Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#de4a2c] font-bold block mb-1">
              DISCIPLINE {active.index} // {active.sub}
            </span>
            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-neutral-950">
              {active.tagline}
            </h1>
          </div>
          <div className="font-mono text-xs text-neutral-500 text-right">
            <span>{active.spec}</span>
          </div>
        </div>

        {/* Master Full-Bleed Artboard with Integrated Slider */}
        <div className="relative h-[500px] sm:h-[650px] rounded-3xl overflow-hidden bg-neutral-100 shadow-2xl border border-neutral-200 group">
          {/* Output Image (After) */}
          <img
            src={active.afterImg}
            alt={active.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Input Image (Before) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={active.beforeImg}
              alt="Raw Input"
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ width: '100vw', maxWidth: 'none' }}
            />
            <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider">
              RAW SOURCE PLATE
            </div>
          </div>

          {/* After Tag */}
          <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-neutral-900 text-[11px] font-mono uppercase tracking-wider shadow-sm font-bold">
            MASTER ATELIER FINISH
          </div>

          {/* Split Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.7)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-neutral-900 shadow-xl flex items-center justify-center font-bold text-xs border border-neutral-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#de4a2c]" />
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            aria-label="Zenith slider"
          />

          {/* Minimal Floating Dock Bottom Center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
            <div className="rounded-full bg-white/90 backdrop-blur-xl border border-white/80 shadow-lg px-4 py-2 flex items-center gap-2">
              {ZENITH_STAGES.map((s, idx) => (
                <button
                  key={s.index}
                  onClick={() => setActiveStageIdx(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                    activeStageIdx === idx
                      ? 'bg-neutral-950 text-white font-bold shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {s.index} {s.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: VISUAL EXPANDING ACCORDION
      ========================================================= */}
      <section className="py-16 px-4 sm:px-12 max-w-7xl mx-auto border-t border-neutral-200">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold block mb-1">
            EXPLORE ALL FIVE
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-950">
            Hover to Open Any Production Chamber
          </h2>
        </div>

        <div className="space-y-3">
          {ZENITH_STAGES.map((item, idx) => {
            const isOpen = accordionHover === idx;
            return (
              <div
                key={item.index}
                onMouseEnter={() => setAccordionHover(idx)}
                onMouseLeave={() => setAccordionHover(null)}
                className={`border border-neutral-200 rounded-3xl overflow-hidden transition-all duration-500 ${
                  isOpen ? 'bg-neutral-50 shadow-lg' : 'bg-white hover:border-neutral-300'
                }`}
              >
                <div className="p-6 sm:p-8 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#de4a2c]">
                      {item.index}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium text-neutral-950">
                        {item.title}
                      </h3>
                      <span className="text-xs font-mono text-neutral-400 block mt-0.5">
                        {item.sub}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
                      {item.spec}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-neutral-900' : ''
                      }`}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-8 pt-0 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative h-64 rounded-2xl overflow-hidden bg-neutral-200">
                        <img
                          src={item.beforeImg}
                          alt="Raw"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white font-mono text-[10px] uppercase">
                          RAW INPUT PLATE
                        </div>
                      </div>
                      <div className="relative h-64 rounded-2xl overflow-hidden bg-neutral-200">
                        <img
                          src={item.afterImg}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 text-neutral-900 font-mono text-[10px] uppercase font-bold">
                          POLISHED COMMERCIAL ASSET
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 3: MINIMALIST COMMISSIONS INQUIRY
      ========================================================= */}
      <footer className="py-20 px-6 max-w-4xl mx-auto text-center font-sans">
        <span className="text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold block mb-2">
          COMPLIMENTARY BENCHMARK
        </span>
        <h2 className="text-3xl sm:text-4xl font-light text-neutral-950 mb-3">
          Test Your Production Portfolio Today
        </h2>
        <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
          Send 3 sample raw plates. We return commercial master files in 2 hours with complete vector clipping paths.
        </p>

        {inquiryDone ? (
          <div className="p-4 rounded-full bg-neutral-100 text-neutral-900 font-mono text-xs">
            ✓ Ingest sequence confirmed. Check your email for secure upload access.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setInquiryDone(true);
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={inquiryEmail}
              onChange={(e) => setInquiryEmail(e.target.value)}
              placeholder="Your work email"
              className="flex-1 px-5 py-3 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-[#de4a2c] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              Get Samples
            </button>
          </form>
        )}

        <div className="mt-14 font-mono text-[10px] text-neutral-400">
          © 2026 CUTTING EDGER ATELIER. ZENITH CANVAS PROTOTYPE 15.
        </div>
      </footer>
    </div>
  );
}

