import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Eye,
  SlidersHorizontal,
  Maximize2,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Camera,
  Shirt,
  UserCheck,
  Scissors,
  Layers,
  ChevronRight,
  Upload,
  RefreshCw,
  SunMedium
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

const FIVE_SERVICES = [
  {
    id: 's1',
    code: '01',
    name: 'AI Corporate Headshots',
    tag: 'HR & Executive Teams',
    headline: 'Phone Selfies to C-Suite Portraits',
    desc: 'Uniform executive studio lighting and bespoke corporate wardrobes from casual mobile selfies.',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
    beforeLabel: 'Raw Phone Selfie',
    afterLabel: 'Executive Studio Grade',
    specs: ['Sub-2h Batch SLA', '100% Identity Lock', 'Custom Backdrops'],
    icon: UserCheck
  },
  {
    id: 's2',
    code: '02',
    name: 'AI Fashion Models',
    tag: 'Apparel & Catalogues',
    headline: 'Ghost Mannequin to Living Runway',
    desc: 'Instant synthesis of flat garment plates into high-fashion editorial models with diverse poses.',
    beforeImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    beforeLabel: 'Hollow Mannequin',
    afterLabel: 'Editorial Runway Model',
    specs: ['Zero Studio Overhead', 'Natural Fabric Drape', '3 Body Types'],
    icon: Shirt
  },
  {
    id: 's3',
    code: '03',
    name: '3D Virtual Try-On',
    tag: 'E-Commerce Flagships',
    headline: 'Garment SKU to Anatomical Fit',
    desc: 'Real-time cloth tension, realistic seam stretch, and drape rendering on consumer avatars.',
    beforeImg: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    beforeLabel: 'Isolated Garment SKU',
    afterLabel: 'Anatomical Dynamic Fit',
    specs: ['4K WebGL Assets', '38% Return Reduction', 'Instant Synthesis'],
    icon: Sparkles
  },
  {
    id: 's4',
    code: '04',
    name: 'Product Scene Generation',
    tag: 'Luxury Brands & FMCG',
    headline: 'White Background to Sunlit Marble',
    desc: 'Generative physical raytraced shadows, realistic refractions, and architectural lifestyle setups.',
    beforeImg: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    beforeLabel: 'Studio Tabletop Pack',
    afterLabel: 'Sunlit Marble Scene',
    specs: ['Raytraced Caustics', 'Marketplace Presets', '10K+ SKU Batch'],
    icon: Camera
  },
  {
    id: 's5',
    code: '05',
    name: 'Precision Vector Paths',
    tag: 'Horology & Fine Jewelry',
    headline: 'Hand-Drawn Pen Tool & Retouch',
    desc: 'Sub-pixel Bézier curve isolation, gemstone facet brilliance, and non-destructive 16-bit master PSDs.',
    beforeImg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    beforeLabel: 'Macro RAW Unretouched',
    afterLabel: 'Laser Specular Polish',
    specs: ['±0.25px Vector Tolerance', 'Zero Color Bleed', '16-bit Master PSD'],
    icon: Scissors
  }
];

export function HomeLuminaGlass({ clients = [] }: HomeProps) {
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isLensHovered, setIsLensHovered] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const activeService = FIVE_SERVICES[activeServiceIdx];
  const heroImageContainerRef = useRef<HTMLDivElement>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroImageContainerRef.current) return;
    const rect = heroImageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#0F172A] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden relative">
      {/* Background Soft Ambient Light Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/30 to-rose-200/20 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-sky-200/30 to-indigo-200/20 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-100/30 to-amber-100/20 blur-[120px]" />
      </div>

      {/* Top Glass Floating Header */}
      <header className="sticky top-2 z-40 max-w-6xl mx-auto px-4">
        <div className="rounded-full bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.04)] px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#de4a2c] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#de4a2c]/20">
              CE
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-neutral-900 leading-none">
                CUTTING EDGER
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400">
                Lumina Glass Studio
              </span>
            </div>
          </Link>

          {/* Quick Service Badges */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100/60 p-0.5 rounded-full border border-neutral-200/50 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {FIVE_SERVICES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveServiceIdx(idx)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeServiceIdx === idx
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {s.code} {s.name.split(' ')[0]}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="px-4 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-[#de4a2c] text-xs font-semibold tracking-wide transition-colors shadow-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO: OPTICAL LENS STAGE
      ========================================================= */}
      <section className="relative z-10 pt-3 sm:pt-4 pb-8 sm:pb-12 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-neutral-200/80 shadow-xs mb-1.5 text-[10px] font-mono font-bold text-neutral-700">
            <span className="w-1.5 h-1.5 rounded-full bg-[#de4a2c] animate-pulse" />
            <span>05 FROSTED OPTIC DISCIPLINES</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 leading-tight">
            Pure Visual Precision,{' '}
            <span className="bg-gradient-to-r from-neutral-900 via-[#de4a2c] to-amber-600 bg-clip-text text-transparent">
              Zero Artificial Noise
            </span>
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
            Drag the split-slider to inspect raw captures against master retouch deliverables.
          </p>
        </div>

        {/* Master Optical Split Stage */}
        <div className="rounded-3xl p-2.5 sm:p-3 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] mb-4">
          <div
            ref={heroImageContainerRef}
            onMouseMove={handleHeroMouseMove}
            onMouseEnter={() => setIsLensHovered(true)}
            onMouseLeave={() => setIsLensHovered(false)}
            className="relative h-[300px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden cursor-crosshair select-none bg-neutral-100"
          >
            {/* Background Image: Retouched (Master Result) */}
            <img
              src={activeService.afterImg}
              alt={activeService.afterLabel}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Split Overlay: Raw Input */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activeService.beforeImg}
                alt={activeService.beforeLabel}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ width: `${heroImageContainerRef.current?.clientWidth || 1000}px`, maxWidth: 'none' }}
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider">
                {activeService.beforeLabel}
              </div>
            </div>

            {/* After Tag */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#de4a2c]/90 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider shadow-sm">
              {activeService.afterLabel}
            </div>

            {/* Interactive Slider Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-neutral-800 shadow-xl flex items-center justify-center font-bold text-xs border border-neutral-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#de4a2c]" />
              </div>
            </div>

            {/* Manual Slider Drag Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Before after split slider"
            />

            {/* Floating Live Inspection Card */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm p-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-lg z-20 pointer-events-none">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#de4a2c] font-bold">
                  Pillar {activeService.code} // {activeService.tag}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {sliderPosition}% Split
                </span>
              </div>
              <h3 className="font-bold text-sm text-neutral-900 leading-snug">
                {activeService.headline}
              </h3>
              <p className="text-[11px] text-neutral-600 mt-0.5 line-clamp-1">
                {activeService.desc}
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {activeService.specs.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium border border-neutral-200/50"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Service Pillar Switcher Dock (Bottom of Hero) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-2.5 pt-1 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {FIVE_SERVICES.map((s, idx) => {
              const Icon = s.icon;
              const isSelected = activeServiceIdx === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveServiceIdx(idx)}
                  className={`p-2.5 rounded-xl text-left transition-all relative overflow-hidden border ${
                    isSelected
                      ? 'bg-white shadow-sm border-[#de4a2c]/30 ring-2 ring-[#de4a2c]/20'
                      : 'bg-white/40 hover:bg-white/70 border-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-[#de4a2c]">
                      {s.code}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#de4a2c]' : 'text-neutral-400'}`} />
                  </div>
                  <div className="font-bold text-xs text-neutral-900 leading-tight">
                    {s.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                    {s.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: FROSTED GLASS 5-SERVICE REEL
      ========================================================= */}
      <section className="relative z-10 py-16 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold mb-1">
              DISCIPLINE SHOWCASE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Five Tailored Visual Engines
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
            Each discipline engineered with dedicated machine pipelines and master artists. Zero compromise on fidelity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FIVE_SERVICES.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-4 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 rounded-2xl overflow-hidden mb-4 bg-neutral-100">
                  <img
                    src={item.afterImg}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-neutral-900">
                    {item.code} // {item.name}
                  </div>
                </div>
                <h3 className="font-bold text-base text-neutral-900 mb-1">
                  {item.headline}
                </h3>
                <p className="text-xs text-neutral-600 mb-3">
                  {item.desc}
                </p>
              </div>

              <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-500">{item.specs[0]}</span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#de4a2c] hover:underline"
                >
                  Test Sample <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {FIVE_SERVICES.slice(3, 5).map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-4 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4 bg-neutral-100">
                  <img
                    src={item.afterImg}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-neutral-900">
                    {item.code} // {item.name}
                  </div>
                </div>
                <h3 className="font-bold text-base text-neutral-900 mb-1">
                  {item.headline}
                </h3>
                <p className="text-xs text-neutral-600 mb-3">
                  {item.desc}
                </p>
              </div>

              <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-500">{item.specs[0]}</span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#de4a2c] hover:underline"
                >
                  Test Sample <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 3: METRICS STRIP
      ========================================================= */}
      <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
        <div className="rounded-3xl p-8 bg-gradient-to-r from-white/80 to-white/50 backdrop-blur-2xl border border-white/80 shadow-md">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-mono tracking-tight">
                &lt; 2h
              </div>
              <div className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mt-1">
                Batch Turnaround
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">S1 & S2 rapid turnaround</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#de4a2c] font-mono tracking-tight">
                ±0.25px
              </div>
              <div className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mt-1">
                Vector Precision
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Hand-drawn pen tool paths</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-mono tracking-tight">
                300 DPI
              </div>
              <div className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mt-1">
                16-Bit Master Files
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Print & billboard certified</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-mono tracking-tight">
                2.4M+
              </div>
              <div className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mt-1">
                Commercial Frames
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Delivered without returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: INSTANT TRIAL UPLOAD
      ========================================================= */}
      <section className="relative z-10 py-16 px-4 max-w-4xl mx-auto text-center">
        <div className="rounded-3xl p-8 sm:p-12 bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block mb-3 animate-ping" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight mb-3">
            Test Your First 3 Images For Free
          </h2>
          <p className="text-neutral-600 text-sm max-w-md mx-auto mb-6">
            Upload any raw photo, flat-lay garment, or jewelry capture. We return retouched master assets within 2 hours.
          </p>

          {formSubmitted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
              Thank you! Your trial request has been submitted. Check your inbox for upload instructions.
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
                placeholder="Enter work email for free trial"
                className="flex-1 px-4 py-3 rounded-full bg-neutral-100 border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#de4a2c]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#de4a2c] text-white font-bold text-xs tracking-wider uppercase hover:bg-neutral-900 transition-colors shadow-sm"
              >
                Send Mockup
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-neutral-400 mt-6">
            <span>✓ ZERO CREDIT CARD</span>
            <span>✓ STRICT NDA</span>
            <span>✓ SUB-2H TURNAROUND</span>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="relative z-10 border-t border-neutral-200/60 py-8 px-4 text-center text-xs text-neutral-500 font-mono">
        <p>© 2026 CUTTING EDGER DIGITAL ATELIER. LUMINA GLASS PROTOTYPE 09.</p>
      </footer>
    </div>
  );
}

