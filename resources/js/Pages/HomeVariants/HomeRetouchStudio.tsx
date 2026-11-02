import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Scissors,
  Layers,
  Clock,
  MoveHorizontal,
  UploadCloud,
  Maximize2,
  Diamond,
  Car,
  UserCheck,
  Shirt,
  Eye,
  Camera,
  Flame,
  Zap,
  ArrowUpRight
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

interface ServiceCard {
  id: string;
  number: string;
  name: string;
  tag: string;
  image: string;
  rawImage: string;
  turnaround: string;
}

const SERVICES_11: ServiceCard[] = [
  {
    id: 'jewelry',
    number: '01',
    name: 'Jewelry Retouch',
    tag: 'Diamond & Gemstone Refraction',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h'
  },
  {
    id: 'model-high',
    number: '02',
    name: 'High End Model Retouch',
    tag: '16-Bit Frequency Separation',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h'
  },
  {
    id: 'automobile',
    number: '03',
    name: 'Automobile Retouch',
    tag: 'Metallic Studio Reflections',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    turnaround: '24h'
  },
  {
    id: 'ghost-mannequin',
    number: '04',
    name: 'Ghost Mannequin',
    tag: '3D Invisible Neck Joint',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    turnaround: '8h'
  },
  {
    id: 'shoe-retouch',
    number: '05',
    name: 'Shoe Retouch',
    tag: 'Suede & Leather Finishing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80',
    turnaround: '8h'
  },
  {
    id: 'accessories',
    number: '06',
    name: 'Accessories Retouch',
    tag: 'Luxury Watches & Handbags',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h'
  },
  {
    id: 'background-removal',
    number: '07',
    name: 'Background Removal',
    tag: 'Hand-Drawn Pen Tool Clipping',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    turnaround: '4h'
  },
  {
    id: 'hollow-man',
    number: '08',
    name: 'Hollow Man Service',
    tag: '360° Apparel Volume & Inseam',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
    turnaround: '8h'
  },
  {
    id: 'lifestyle-retouch',
    number: '09',
    name: 'Lifestyle Retouch',
    tag: 'Contact Shadows & Color Harmony',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h'
  },
  {
    id: 'regular-model',
    number: '10',
    name: 'Regular Model Retouch',
    tag: 'Catalog Blemish & Flyaway Cleanup',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    turnaround: '6h'
  },
  {
    id: 'calendar-model',
    number: '11',
    name: 'Calendar Model Retouch',
    tag: 'Glamour Lighting & Glossy Pop',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h'
  }
];

export function HomeRetouchStudio({ clients = [] }: HomeProps) {
  // Hero Interactive Slider
  const [heroSplit, setHeroSplit] = useState(50);
  const [activeHeroSubject, setActiveHeroSubject] = useState(0);

  // Parallax States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, pctX: 50, pctY: 50 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Big Studio Comparison State
  const [activeStudioIndex, setActiveStudioIndex] = useState(0);
  const [studioSplit, setStudioSplit] = useState(50);

  // Scroll listener for real parallax depth
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 60 FPS Mouse Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => {
      setMousePos({ x, y, pctX, pctY });
    });
  };

  const handleHeroSplitMove = (clientX: number, target: HTMLDivElement) => {
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setHeroSplit(Math.round((x / rect.width) * 100));
  };

  const handleStudioSplitMove = (clientX: number, target: HTMLDivElement) => {
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setStudioSplit(Math.round((x / rect.width) * 100));
  };

  // Hero showcase subjects
  const heroShowcase = [
    {
      title: 'Jewelry Refraction',
      subtitle: 'Sub-micron diamond facet clarity',
      retouched: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=95',
      raw: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80',
      badge: '04. JEWELRY'
    },
    {
      title: 'High-Fashion Model',
      subtitle: '16-bit frequency separation with raw pores',
      retouched: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=95',
      raw: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80',
      badge: '06. MODEL'
    },
    {
      title: 'Automotive Finish',
      subtitle: 'Specular metallic curve & alloy pop',
      retouched: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=95',
      raw: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80',
      badge: '03. AUTOMOBILE'
    },
    {
      title: 'Luxury Timepiece',
      subtitle: 'Brushed metal & lens reflection control',
      retouched: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=95',
      raw: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=80',
      badge: '02. ACCESSORIES'
    }
  ];

  const currentHero = heroShowcase[activeHeroSubject];
  const currentStudio = SERVICES_11[activeStudioIndex];

  return (
    <div className="min-h-screen bg-[#07080B] text-[#F3F4F6] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* 1. MINIMAL ATELIER HEADER */}
      <header className="border-b border-white/[0.08] bg-[#07080B]/85 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#de4a2c] animate-pulse" />
          <Link href="/" className="font-display text-sm sm:text-base font-bold tracking-tight text-white hover:text-neutral-300 transition-colors">
            CUTTING EDGER
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 hidden sm:inline">
            Retouch Atelier
          </span>
        </div>

        {/* 11 Services Pill Link */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="#parallax-runway"
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 transition-colors border border-white/5"
          >
            Parallax Runway
          </a>
          <a
            href="#services-deck"
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 transition-colors border border-white/5"
          >
            11 Services
          </a>
          <a
            href="#studio-lab"
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 transition-colors border border-white/5"
          >
            Live Lab
          </a>
        </div>

        {/* Quick CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/#free-sample"
            className="px-4 py-2 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#de4a2c]/20"
          >
            <span>Test 3 Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. REVOLUTIONARY 3D PARALLAX HERO (IMAGE-FIRST, MINIMAL TEXT) */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-8 py-8 max-w-[1520px] mx-auto overflow-hidden"
      >
        {/* Dynamic 60 FPS Mouse Spotlight Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 500px at ${mousePos.pctX}% ${mousePos.pctY}%, rgba(222, 74, 44, 0.25) 0%, transparent 70%)`
          }}
        />

        {/* Floating Background Ambient Watermark */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-display font-black text-white/[0.02] tracking-tighter select-none pointer-events-none whitespace-nowrap"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * -40}px), calc(-50% + ${mousePos.y * -30}px))`
          }}
        >
          RETOUCH ATELIER
        </div>

        {/* Hero Top Minimal Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-20">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>11 Specialized Commercial Services</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-1">
              Visual Perfection at Scale.
            </h1>
          </div>

          {/* Quick Subject Selectors */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
            {heroShowcase.map((item, idx) => (
              <button
                key={item.badge}
                onClick={() => {
                  setActiveHeroSubject(idx);
                  setHeroSplit(50);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  activeHeroSubject === idx
                    ? 'bg-[#de4a2c] text-white font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.badge}
              </button>
            ))}
          </div>
        </div>

        {/* IMMERSIVE 3D PARALLAX SPLIT STAGE */}
        <div
          style={{
            transform: `perspective(1200px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 3.5}deg)`,
            transition: 'transform 0.15s ease-out'
          }}
          className="relative w-full h-[520px] sm:h-[640px] md:h-[700px] xl:h-[740px] rounded-3xl overflow-hidden bg-black select-none border border-white/15 shadow-2xl cursor-ew-resize group z-10"
          onMouseDown={(e) => handleHeroSplitMove(e.clientX, e.currentTarget)}
          onTouchMove={(e) => {
            if (e.touches[0]) handleHeroSplitMove(e.touches[0].clientX, e.currentTarget);
          }}
        >
          {/* Dynamic Laser Beam */}
          <div className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300" />

          {/* RIGHT LAYER: FINISHED 16-BIT RETOUCHED IMAGE */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={currentHero.retouched}
              alt={currentHero.title}
              className="w-full h-full object-cover object-center select-none pointer-events-none"
              draggable={false}
            />

            {/* Finished Badge */}
            <div className="absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20 shadow-2xl flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Finished: {currentHero.title}</span>
            </div>
          </div>

          {/* LEFT LAYER: RAW IMAGE (CLIPPED BY SLIDER) */}
          <div
            className="absolute inset-0 overflow-hidden z-20"
            style={{ clipPath: `polygon(0 0, ${heroSplit}% 0, ${heroSplit}% 100%, 0 100%)` }}
          >
            <div className="w-full h-full relative">
              <img
                src={currentHero.raw}
                alt={currentHero.title}
                className="w-full h-full object-cover object-center select-none pointer-events-none filter sepia-[0.1] contrast-90 brightness-95 blur-[0.2px]"
                draggable={false}
              />

              {/* Raw Badge */}
              <div className="absolute top-5 left-5 z-20 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-neutral-300 font-mono text-xs font-bold border border-white/10 shadow-2xl flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-neutral-400" />
                <span>Raw Unprocessed Plate</span>
              </div>
            </div>
          </div>

          {/* VERTICAL DIVIDER LINE */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,1)] z-30 pointer-events-none"
            style={{ left: `${heroSplit}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/20 flex items-center justify-center font-mono text-xs font-bold">
              ⟷
            </div>
          </div>

          {/* Floating Pill at Bottom Center */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-2xl border border-white/10">
            <span>{currentHero.subtitle} • Drag to compare</span>
          </div>
        </div>

        {/* Minimal Controls Bar Below */}
        <div className="flex items-center justify-between mt-4 px-2 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHeroSplit(0)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                heroSplit === 0 ? 'bg-[#de4a2c] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              Finished
            </button>
            <button
              onClick={() => setHeroSplit(50)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                heroSplit === 50 ? 'bg-[#de4a2c] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              50/50
            </button>
            <button
              onClick={() => setHeroSplit(100)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                heroSplit === 100 ? 'bg-[#de4a2c] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              Raw
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-500">Split: {heroSplit}%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={heroSplit}
              onChange={(e) => setHeroSplit(Number(e.target.value))}
              className="w-24 sm:w-44 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
            />
          </div>
        </div>
      </section>

      {/* 3. DEDICATED TRUE SCROLL PARALLAX RUNWAY */}
      <section id="parallax-runway" className="py-24 px-4 sm:px-8 max-w-[1520px] mx-auto border-t border-white/[0.08] relative">
        
        {/* Minimal Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider mb-1">
              Multi-Layer Depth
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
              The Parallax Runway
            </h2>
          </div>
          <div className="text-xs font-mono text-neutral-500">
            Scroll to experience dual-speed depth layers
          </div>
        </div>

        {/* 3 Staggered Parallax Columns Moving at Different Speeds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* COLUMN 1: Scrolls at normal speed (Speed 1.0) */}
          <div
            className="space-y-6 sm:space-y-8 transition-transform duration-100 ease-out"
            style={{ transform: `translateY(${scrollY * -0.06}px)` }}
          >
            {SERVICES_11.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300"
              >
                <div className="relative w-full h-[360px] sm:h-[440px] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between">
                  <div>
                    <div className="text-xs font-mono text-[#de4a2c] font-bold">{s.number}</div>
                    <div className="font-display text-lg font-bold text-white">{s.name}</div>
                    <div className="text-[11px] font-mono text-neutral-400 mt-0.5">{s.tag}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 shrink-0">
                    {s.turnaround}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMN 2: Scrolls faster (Speed 1.3 - Dynamic Depth) */}
          <div
            className="space-y-6 sm:space-y-8 transition-transform duration-100 ease-out md:mt-16"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          >
            {SERVICES_11.slice(4, 8).map((s) => (
              <div
                key={s.id}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300"
              >
                <div className="relative w-full h-[360px] sm:h-[440px] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between">
                  <div>
                    <div className="text-xs font-mono text-[#de4a2c] font-bold">{s.number}</div>
                    <div className="font-display text-lg font-bold text-white">{s.name}</div>
                    <div className="text-[11px] font-mono text-neutral-400 mt-0.5">{s.tag}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 shrink-0">
                    {s.turnaround}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMN 3: Scrolls slower (Speed 0.7 - Deep Background Plane) */}
          <div
            className="space-y-6 sm:space-y-8 transition-transform duration-100 ease-out md:-mt-8"
            style={{ transform: `translateY(${scrollY * -0.09}px)` }}
          >
            {SERVICES_11.slice(8, 11).map((s) => (
              <div
                key={s.id}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300"
              >
                <div className="relative w-full h-[360px] sm:h-[440px] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between">
                  <div>
                    <div className="text-xs font-mono text-[#de4a2c] font-bold">{s.number}</div>
                    <div className="font-display text-lg font-bold text-white">{s.name}</div>
                    <div className="text-[11px] font-mono text-neutral-400 mt-0.5">{s.tag}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 shrink-0">
                    {s.turnaround}
                  </span>
                </div>
              </div>
            ))}

            {/* Free Trial Card Inset */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#de4a2c] to-[#992510] text-white shadow-2xl flex flex-col justify-between h-[360px]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full">
                  Instant Access
                </span>
                <h3 className="font-display text-2xl font-bold mt-4">
                  Test Your Own 3 RAW Images Free
                </h3>
                <p className="font-mono text-xs text-white/80 mt-2">
                  No credit card required. Receive non-destructive proofs in 24 hours.
                </p>
              </div>

              <Link
                href="/#free-sample"
                className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-black hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>Upload 3 Test Files</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. THE 11 SERVICES VISUAL DECK (MINIMAL TEXT, IMAGE CARDS) */}
      <section id="services-deck" className="py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider">
              Service Catalog
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
              All 11 Specialist Disciplines
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-500">11 of 11 Active</span>
        </div>

        {/* 11 Service Visual Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {SERVICES_11.map((service, idx) => (
            <button
              key={service.id}
              onClick={() => {
                setActiveStudioIndex(idx);
                const el = document.getElementById('studio-lab');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group p-3 rounded-2xl bg-neutral-900 border border-white/10 hover:border-[#de4a2c] text-left transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black mb-3">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#de4a2c] font-bold">
                  {service.number}
                </span>
              </div>

              <div>
                <div className="font-display text-xs font-bold text-white group-hover:text-[#de4a2c] transition-colors truncate">
                  {service.name}
                </div>
                <div className="text-[10px] font-mono text-neutral-400 truncate mt-0.5">
                  {service.tag}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE RETOUCH STUDIO (FULL-WIDTH COMPARISON) */}
      <section id="studio-lab" className="py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t border-white/[0.08]">
        
        {/* Lab Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider">
              Precision Studio Lab
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              {currentStudio.number}. {currentStudio.name}
            </h2>
            <div className="text-xs font-mono text-neutral-400 mt-1">
              {currentStudio.tag} • Standard SLA: {currentStudio.turnaround}
            </div>
          </div>

          {/* Quick Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {SERVICES_11.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveStudioIndex(idx);
                  setStudioSplit(50);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                  activeStudioIndex === idx
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {s.number}
              </button>
            ))}
          </div>
        </div>

        {/* Large Interactive Split Stage */}
        <div className="relative max-w-5xl mx-auto bg-neutral-900 rounded-3xl border border-white/10 shadow-2xl p-4 sm:p-6">
          <div
            className="relative w-full h-[460px] sm:h-[580px] md:h-[650px] rounded-2xl overflow-hidden bg-black select-none border border-white/10 cursor-ew-resize group shadow-inner"
            onMouseDown={(e) => handleStudioSplitMove(e.clientX, e.currentTarget)}
            onTouchMove={(e) => {
              if (e.touches[0]) handleStudioSplitMove(e.touches[0].clientX, e.currentTarget);
            }}
          >
            {/* RIGHT LAYER: FINISHED */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={currentStudio.image}
                alt={currentStudio.name}
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                draggable={false}
              />

              <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20 shadow-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Finished Retouch</span>
              </div>
            </div>

            {/* LEFT LAYER: RAW */}
            <div
              className="absolute inset-0 overflow-hidden z-20"
              style={{ clipPath: `polygon(0 0, ${studioSplit}% 0, ${studioSplit}% 100%, 0 100%)` }}
            >
              <div className="w-full h-full relative">
                <img
                  src={currentStudio.rawImage}
                  alt={currentStudio.name}
                  className="w-full h-full object-cover object-center select-none pointer-events-none filter sepia-[0.1] contrast-90 brightness-95 blur-[0.2px]"
                  draggable={false}
                />

                <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-neutral-300 font-mono text-xs font-bold border border-white/10 shadow-xl flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Raw Capture</span>
                </div>
              </div>
            </div>

            {/* DIVIDER HANDLE */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,1)] z-30 pointer-events-none"
              style={{ left: `${studioSplit}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/20 flex items-center justify-center font-mono text-xs font-bold">
                ⟷
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-xl border border-white/10">
              <span>Drag left / right to inspect seam & edge precision</span>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="mt-4 pt-2.5 flex items-center justify-between text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStudioSplit(0)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  studioSplit === 0 ? 'bg-[#de4a2c] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                100% Finished
              </button>
              <button
                onClick={() => setStudioSplit(50)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  studioSplit === 50 ? 'bg-[#de4a2c] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                50 / 50 Split
              </button>
              <button
                onClick={() => setStudioSplit(100)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  studioSplit === 100 ? 'bg-[#de4a2c] text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                100% Raw
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-500">Split: {studioSplit}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={studioSplit}
                onChange={(e) => setStudioSplit(Number(e.target.value))}
                className="w-24 sm:w-44 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. MINIMAL ENTERPRISE FREE PILOT CTA */}
      <section className="py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t border-white/[0.08]">
        <div className="max-w-3xl mx-auto text-center rounded-3xl bg-neutral-900 border border-white/10 p-8 sm:p-12 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-neutral-300 mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#de4a2c]" />
            <span>Complimentary Pilot Evaluation</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Test 3 Images on Us.
          </h2>

          <p className="font-mono text-xs text-neutral-400 mb-6 max-w-md mx-auto">
            Drop 3 files. Receive hand-finished 16-bit layered proofs within 24 hours. Zero commitment.
          </p>

          <Link
            href="/#free-sample"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-[#de4a2c]/20"
          >
            <span>Upload 3 Test Images</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. MINIMAL FOOTER */}
      <footer className="border-t border-white/[0.08] py-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4">
        <div>Cutting Edger • 11 Commercial Image Editing Services • 16-Bit Non-Destructive</div>
        <div className="flex items-center gap-4">
          <a href="#parallax-runway" className="hover:text-white transition-colors">Parallax Runway</a>
          <span className="text-white/20">•</span>
          <a href="#services-deck" className="hover:text-white transition-colors">11 Services</a>
          <span className="text-white/20">•</span>
          <a href="#studio-lab" className="hover:text-white transition-colors">Live Lab</a>
        </div>
      </footer>

    </div>
  );
}
