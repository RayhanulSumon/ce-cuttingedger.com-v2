import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  Sparkles,
  ArrowUpRight,
  Layers,
  Sliders,
  MoveRight,
  Eye,
  CheckCircle2,
  Maximize2,
  X,
  Compass,
  Zap,
  ShieldCheck
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

const PARALLAX_PORTFOLIO = [
  {
    id: 1,
    title: 'Bespoke Tailored Overcoat',
    category: 'Fine Fiber Edge Isolation',
    beforeImg: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
    badge: 'WOOL MASK'
  },
  {
    id: 2,
    title: 'Titanium Chronograph',
    category: 'Reflective Surface Multi-Path',
    beforeImg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    badge: '32 PATHS'
  },
  {
    id: 3,
    title: 'Leather Satchel Silhouette',
    category: 'Hardware & Strap Isolation',
    beforeImg: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    badge: 'CALFSKIN'
  },
  {
    id: 4,
    title: 'Crystal Stemware Goblet',
    category: 'Refraction Alpha Channel',
    beforeImg: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85',
    badge: 'GLASS ALPHA'
  }
];

export const VariantParallax: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  // Parallax Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [splitPos, setSplitPos] = useState(50);
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20; // -10 to 10
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 antialiased selection:bg-stone-900 selection:text-[#FDFBF7] pb-32">
      {/* Subtle top indicator bar */}
      <div className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-widest text-stone-600">
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              PARALLAX HORIZON // 03
            </span>
            <span className="text-stone-300">/</span>
            <span className="truncate max-w-[200px] sm:max-w-none text-stone-900 font-semibold">
              {service.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-stone-400">DEPTH SEPARATION ENGINE</span>
            <span className="font-bold text-stone-900">STUDIO MASTER</span>
          </div>
        </div>
      </div>

      {/* 1. PARALLAX HERO BANNER */}
      <section className="pt-10 sm:pt-16 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Main Parallax Horizon Stage */}
          <div
            ref={heroCardRef}
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-100 to-stone-200/60 border border-stone-200 shadow-xl transition-all duration-300 ease-out"
            style={{ perspective: '1000px' }}
          >
            {/* Background Parallax Grid Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-transform duration-200 ease-out opacity-25"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #78716c 1px, transparent 0)',
                backgroundSize: '24px 24px',
                transform: `translate(${tilt.x * -0.5}px, ${tilt.y * -0.5}px)`
              }}
            />

            <div className="relative z-10 p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Headline (Minimal Text) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-xs font-mono tracking-wider">
                  <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>KINETIC DEPTH ISOLATION</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-stone-900 leading-[1.08]">
                  {service.h1_title || service.title}
                </h1>

                <p className="text-base text-stone-600 font-sans leading-relaxed">
                  {service.subtitle ||
                    'Multi-plane vector silhouette separation. Zero digital fringe artifacts, guaranteed sub-millimeter precision.'}
                </p>

                {/* Minimal Telemetry HUD */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 font-mono">
                  <div className="p-3 rounded-2xl bg-white/80 border border-stone-200/80 shadow-sm">
                    <div className="text-[10px] text-stone-400 font-bold uppercase">TOLERANCE</div>
                    <div className="text-sm font-bold text-stone-900 mt-0.5">0.1px</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/80 border border-stone-200/80 shadow-sm">
                    <div className="text-[10px] text-stone-400 font-bold uppercase">MASKING</div>
                    <div className="text-sm font-bold text-stone-900 mt-0.5">Alpha 16b</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/80 border border-stone-200/80 shadow-sm">
                    <div className="text-[10px] text-stone-400 font-bold uppercase">BATCH SLA</div>
                    <div className="text-sm font-bold text-stone-900 mt-0.5">&lt; 12 Hours</div>
                  </div>
                </div>

                {/* Direct CTA */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <a
                    href="#free-sample"
                    className="px-6 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span>Instant Sample Run</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                    className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider transition-all border border-stone-300"
                  >
                    Atelier Booking
                  </button>
                </div>
              </div>

              {/* Right Interactive Parallax Depth Card */}
              <div className="lg:col-span-7">
                <div
                  className="relative h-[420px] sm:h-[480px] rounded-3xl overflow-hidden bg-white shadow-2xl border border-stone-200 transition-transform duration-200 ease-out select-none"
                  style={{
                    transform: `rotateY(${tilt.x * 0.4}deg) rotateX(${tilt.y * -0.4}deg)`
                  }}
                >
                  {/* Before / After Split Horizon Slider */}
                  <div className="relative w-full h-full overflow-hidden">
                    {/* Underlying After (Clipped Cutout) */}
                    <div className="absolute inset-0 bg-stone-50 flex items-center justify-center">
                      {/* Checkerboard Pattern */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)',
                          backgroundSize: '24px 24px',
                          backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
                        }}
                      />
                      <img
                        src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85"
                        alt="Hand-drawn vector cutout"
                        className="w-full h-full object-cover relative z-10"
                      />
                      <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md text-white font-mono text-[10px] font-bold tracking-wider">
                        STUDIO VECTOR ISOLATION
                      </div>
                    </div>

                    {/* Overlying Before Image with Split Clip */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)` }}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85"
                        alt="Raw capture"
                        className="w-full h-full object-cover filter brightness-90 contrast-95"
                      />
                      <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-stone-900 font-mono text-[10px] font-bold tracking-wider border border-stone-200">
                        RAW CAPTURE
                      </div>
                    </div>

                    {/* Draggable Divider Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                      style={{ left: `${splitPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs">
                        ↔
                      </div>
                    </div>

                    {/* Slider Input overlay */}
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={splitPos}
                      onChange={(e) => setSplitPos(Number(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
                    />
                  </div>

                  {/* Top Floating Telemetry Pill */}
                  <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-mono font-bold border border-stone-200 shadow-sm">
                      INTERACTIVE SPLIT: DRAG HORIZON
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/90 text-stone-950 text-[10px] font-mono font-bold shadow-sm">
                      DEPTH ACCELERATED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNDER-PORTFOLIO VISUAL ILLUSTRATION GALLERY */}
      <section className="py-12 px-4 sm:px-8 border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-amber-700 font-bold block mb-1">
                EXHIBITION PROOF
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight">
                Depth-Separated Work Showcase
              </h2>
            </div>
            <div className="text-xs font-mono text-stone-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>CLICK TO EXPAND HIGH-RES ATELIER PLATE</span>
            </div>
          </div>

          {/* 4 Large Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PARALLAX_PORTFOLIO.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveLightbox(item.afterImg)}
                className="group relative rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                  <img
                    src={item.afterImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                    {item.badge}
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-stone-900" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Minimal Floating Info */}
                  <div className="absolute bottom-5 inset-x-5 text-white">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300 font-semibold block">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeLightbox}
              alt="Expanded"
              className="max-h-[82vh] w-auto object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

