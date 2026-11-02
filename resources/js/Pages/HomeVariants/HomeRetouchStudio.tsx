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
  Diamond,
  Car,
  UserCheck,
  Shirt,
  Eye,
  Camera,
  Sun,
  Moon,
  Zap,
  Play,
  Pause,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

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
  metric: string;
  image: string;
  rawImage: string;
  turnaround: string;
  category: string;
}

const SERVICES_11: ServiceCard[] = [
  {
    id: 'jewelry',
    number: '01',
    name: 'Jewelry Retouch',
    tag: 'Diamond & Gemstone Refraction',
    metric: '99.8% Facet Clarity',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h Rush',
    category: 'Luxury'
  },
  {
    id: 'model-high',
    number: '02',
    name: 'High End Model Retouch',
    tag: '16-Bit Frequency Separation',
    metric: '100% Skin Pores Kept',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h Rush',
    category: 'Fashion'
  },
  {
    id: 'automobile',
    number: '03',
    name: 'Automobile Retouch',
    tag: 'Metallic Studio Reflections',
    metric: 'Zero Rig Glare',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    turnaround: '24h SLA',
    category: 'Automotive'
  },
  {
    id: 'ghost-mannequin',
    number: '04',
    name: 'Ghost Mannequin',
    tag: '3D Invisible Neck Joint',
    metric: 'Seamless 360° Drape',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    turnaround: '8h Fast',
    category: 'Apparel'
  },
  {
    id: 'shoe-retouch',
    number: '05',
    name: 'Shoe Retouch',
    tag: 'Suede & Leather Finishing',
    metric: 'Outsole & Sole Mirror',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80',
    turnaround: '8h Fast',
    category: 'Footwear'
  },
  {
    id: 'accessories',
    number: '06',
    name: 'Accessories Retouch',
    tag: 'Luxury Watches & Handbags',
    metric: 'Brushed Metal Balancer',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h Rush',
    category: 'Luxury'
  },
  {
    id: 'background-removal',
    number: '07',
    name: 'Background Removal',
    tag: 'Hand-Drawn Pen Tool Clipping',
    metric: '0.5px Feathered Bezier',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    turnaround: '4h Express',
    category: 'Volume'
  },
  {
    id: 'hollow-man',
    number: '08',
    name: 'Hollow Man Service',
    tag: '360° Apparel Volume & Inseam',
    metric: 'Inseam Joint Precision',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
    turnaround: '8h Fast',
    category: 'Apparel'
  },
  {
    id: 'lifestyle-retouch',
    number: '09',
    name: 'Lifestyle Retouch',
    tag: 'Contact Shadows & Color Harmony',
    metric: 'Natural Decay Shadows',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h Rush',
    category: 'Editorial'
  },
  {
    id: 'regular-model',
    number: '10',
    name: 'Regular Model Retouch',
    tag: 'Catalog Blemish & Flyaway Cleanup',
    metric: 'Batch Uniformity Grade',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    turnaround: '6h Express',
    category: 'Catalog'
  },
  {
    id: 'calendar-model',
    number: '11',
    name: 'Calendar Model Retouch',
    tag: 'Glamour Lighting & Glossy Pop',
    metric: 'High Dynamic Contrast',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=90',
    rawImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    turnaround: '12h Rush',
    category: 'Glamour'
  }
];

// INTERACTIVE MOUSE PARALLAX 3D CARD COMPONENT
interface ParallaxMouseCardProps {
  service: ServiceCard;
  isDark: boolean;
  onInspect: () => void;
}

function ParallaxMouseCard({ service, isDark, onInspect }: ParallaxMouseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [showRawPeek, setShowRawPeek] = useState(false);
  const animRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => {
      setCoords({ x, y });
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowRawPeek(false);
    setCoords({ x: 0.5, y: 0.5 });
  };

  // 3D Parallax Tilt angles
  const rotateY = isHovered ? (coords.x - 0.5) * 18 : 0;
  const rotateX = isHovered ? (coords.y - 0.5) * -18 : 0;
  const imgShiftX = isHovered ? (coords.x - 0.5) * -24 : 0;
  const imgShiftY = isHovered ? (coords.y - 0.5) * -24 : 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
          isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)'
        }`,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      className={`group relative rounded-3xl overflow-hidden border shadow-2xl cursor-pointer will-change-transform ${
        isDark
          ? 'bg-neutral-900/90 border-white/10 hover:border-[#de4a2c]/70 hover:shadow-[0_25px_50px_rgba(222,74,44,0.25)]'
          : 'bg-white border-black/10 hover:border-[#de4a2c]/70 hover:shadow-[0_25px_50px_rgba(222,74,44,0.2)]'
      }`}
    >
      {/* Dynamic 60 FPS Glare Spotlight following cursor across the card */}
      <div
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-200"
        style={{
          background: isHovered
            ? `radial-gradient(circle 260px at ${coords.x * 100}% ${coords.y * 100}%, rgba(255,255,255,0.24) 0%, transparent 65%)`
            : 'none',
          opacity: isHovered ? 1 : 0
        }}
      />

      {/* Main Image Viewport with Inverse Parallax Shift */}
      <div className="relative w-full h-[380px] sm:h-[440px] overflow-hidden bg-black">
        <img
          src={showRawPeek ? service.rawImage : service.image}
          alt={service.name}
          style={{
            transform: `scale(${isHovered ? 1.12 : 1}) translate(${imgShiftX}px, ${imgShiftY}px)`,
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          className={`w-full h-full object-cover object-center select-none pointer-events-none ${
            showRawPeek ? 'filter sepia-[0.1] contrast-90 brightness-95' : ''
          }`}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

        {/* Top Header Glassmorphic Bar */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/20 shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>{service.number}. {service.category}</span>
          </span>

          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-neutral-300 border border-white/15">
            {service.turnaround}
          </span>
        </div>

        {/* Floating 3D Micro-Metric Chip */}
        <div
          style={{
            transform: `translateZ(30px) translate(${imgShiftX * 0.5}px, ${imgShiftY * 0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
          className="absolute top-16 right-4 z-20 px-3 py-1 rounded-full bg-[#de4a2c] text-white font-mono text-[10px] font-bold shadow-2xl border border-white/20 pointer-events-none"
        >
          {service.metric}
        </div>

        {/* Raw Peek Button Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowRawPeek(!showRawPeek);
          }}
          className={`absolute bottom-20 left-4 z-20 px-3 py-1 rounded-full font-mono text-[10px] font-bold transition-all border shadow-lg ${
            showRawPeek
              ? 'bg-[#de4a2c] text-white border-white/20'
              : 'bg-black/80 text-neutral-300 hover:text-white border-white/15'
          }`}
        >
          {showRawPeek ? 'Showing: Raw Plate' : 'Hold / Click: Peek Raw'}
        </button>
      </div>

      {/* Bottom Editorial Content Panel */}
      <div className="p-5 relative z-20 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-white group-hover:text-[#de4a2c] transition-colors">
            {service.name}
          </h3>
          <p className="text-xs font-mono text-neutral-300 mt-1">
            {service.tag}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onInspect();
          }}
          className="w-10 h-10 rounded-full bg-white text-black hover:bg-[#de4a2c] hover:text-white transition-all flex items-center justify-center shrink-0 shadow-xl group/btn"
          aria-label={`Inspect ${service.name}`}
        >
          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export function HomeRetouchStudio({ clients = [] }: HomeProps) {
  const { isDark, toggleTheme } = useTheme();

  // Hero Interactive Slider with AUTO-SLIDE & MOUSE HOVER STOP
  const [heroSplit, setHeroSplit] = useState(50);
  const [activeHeroSubject, setActiveHeroSubject] = useState(0);
  const [isHeroAutoSliding, setIsHeroAutoSliding] = useState(true);
  const [isUserHoveringHero, setIsUserHoveringHero] = useState(false);
  const heroAutoSlideAnimRef = useRef<number | null>(null);

  // Parallax States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, pctX: 50, pctY: 50 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Big Studio Comparison State with AUTO-SLIDE OSCILLATION
  const [activeStudioIndex, setActiveStudioIndex] = useState(0);
  const [studioSplit, setStudioSplit] = useState(50);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [isUserHoveringLab, setIsUserHoveringLab] = useState(false);
  const autoSlideAnimRef = useRef<number | null>(null);

  // Scroll listener for real parallax depth (throttled to RAF)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Section Ambient Mouse Glow & Background Watermark tilt
  const handleHeroSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y, pctX, pctY });
  };

  // 60 FPS Smooth Auto-Slide Loop for HERO STAGE (Pauses on hover/mouse move)
  useEffect(() => {
    if (!isHeroAutoSliding || isUserHoveringHero) {
      if (heroAutoSlideAnimRef.current) cancelAnimationFrame(heroAutoSlideAnimRef.current);
      return;
    }

    let startTime = performance.now();
    const animateHeroAutoSlide = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      // Smooth sinusoidal oscillation between 18% and 82%
      const val = 50 + Math.sin(elapsed / 1300) * 31;
      setHeroSplit(Math.round(val));
      heroAutoSlideAnimRef.current = requestAnimationFrame(animateHeroAutoSlide);
    };

    heroAutoSlideAnimRef.current = requestAnimationFrame(animateHeroAutoSlide);
    return () => {
      if (heroAutoSlideAnimRef.current) cancelAnimationFrame(heroAutoSlideAnimRef.current);
    };
  }, [isHeroAutoSliding, isUserHoveringHero]);

  // 60 FPS Smooth Auto-Slide Loop for "Precision Studio Lab"
  useEffect(() => {
    if (!isAutoSliding || isUserHoveringLab) {
      if (autoSlideAnimRef.current) cancelAnimationFrame(autoSlideAnimRef.current);
      return;
    }

    let startTime = performance.now();

    const animateAutoSlide = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      // Smooth sinusoidal oscillation between 18% and 82%
      const value = 50 + Math.sin(elapsed / 1200) * 32;
      setStudioSplit(Math.round(value));
      autoSlideAnimRef.current = requestAnimationFrame(animateAutoSlide);
    };

    autoSlideAnimRef.current = requestAnimationFrame(animateAutoSlide);

    return () => {
      if (autoSlideAnimRef.current) cancelAnimationFrame(autoSlideAnimRef.current);
    };
  }, [isAutoSliding, isUserHoveringLab]);

  // 60 FPS Mouse Movement across Hero Stage (Moves split line directly & tilts 3D perspective)
  const handleHeroStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((x / rect.width) * 100);
    setHeroSplit(percent);

    // 3D perspective mouse tilt
    const normX = (clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    const pctX = (x / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: normX, y: normY, pctX, pctY });
  };

  const handleStudioSplitMove = (clientX: number, target: HTMLDivElement) => {
    setIsAutoSliding(false); // Pause auto-slide upon user touch or drag
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setStudioSplit(Math.round((x / rect.width) * 100));
  };

  const scrollToLabWithIndex = (idx: number) => {
    setActiveStudioIndex(idx);
    setStudioSplit(50);
    const el = document.getElementById('studio-lab');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Hero showcase subjects
  const heroShowcase = [
    {
      title: 'Jewelry Refraction',
      subtitle: 'Sub-micron diamond facet clarity',
      retouched: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=95',
      raw: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80',
      badge: '01. JEWELRY'
    },
    {
      title: 'High-Fashion Model',
      subtitle: '16-bit frequency separation with raw pores',
      retouched: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=95',
      raw: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80',
      badge: '02. MODEL'
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
      badge: '06. ACCESSORIES'
    }
  ];

  const currentHero = heroShowcase[activeHeroSubject];
  const currentStudio = SERVICES_11[activeStudioIndex];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans antialiased overflow-x-hidden selection:bg-[#de4a2c] selection:text-white ${
      isDark
        ? 'bg-[#07080B] text-[#F3F4F6]'
        : 'bg-[#F8F9FA] text-[#111318]'
    }`}>
      
      {/* 1. ATELIER HEADER: WITH WORKING THEME TOGGLE (LIGHT / DARK) */}
      <header className={`border-b sticky top-0 z-50 px-4 sm:px-8 lg:px-12 py-2.5 flex items-center justify-between transition-colors backdrop-blur-xl ${
        isDark
          ? 'bg-[#07080B]/90 border-white/[0.08]'
          : 'bg-white/90 border-black/[0.08] shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#de4a2c] animate-pulse" />
          <Link href="/" className="font-display text-sm sm:text-base font-bold tracking-tight hover:opacity-80 transition-opacity">
            CUTTING EDGER
          </Link>
          <span className={isDark ? 'text-white/20' : 'text-black/20'}>/</span>
          <span className={`text-xs font-mono uppercase tracking-wider hidden sm:inline ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            Retouch Atelier (V8)
          </span>
        </div>

        {/* Navigation Anchors */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="#parallax-runway"
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-black/5'
            }`}
          >
            Parallax Runway
          </a>
          <a
            href="#studio-lab"
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-black/5'
            }`}
          >
            Auto-Slide Lab
          </a>
          <a
            href="#services"
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-black/5'
            }`}
          >
            11 Services
          </a>
        </div>

        {/* Actions: Direct Working Theme Toggle & CTA */}
        <div className="flex items-center gap-3">
          {/* Working Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light and Dark Mode"
            className={`p-2 rounded-full border transition-all flex items-center justify-center ${
              isDark
                ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10'
                : 'bg-neutral-100 border-black/10 text-neutral-800 hover:bg-neutral-200 shadow-sm'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/#free-sample"
            className="px-4 py-1.5 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#de4a2c]/20"
          >
            <span>Test 3 Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. REVOLUTIONARY HERO: PROPORTIONED TO FIT THE VIEWPORT BEAUTIFULLY */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroSectionMouseMove}
        className="relative max-w-[1520px] mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-col justify-center overflow-hidden min-h-[calc(100vh-65px)]"
      >
        {/* Dynamic 60 FPS Ambient Mouse Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 480px at ${mousePos.pctX}% ${mousePos.pctY}%, rgba(222, 74, 44, 0.3) 0%, transparent 70%)`
          }}
        />

        {/* Ambient Typographic Watermark (Inverse 3D Shift) */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-display font-black tracking-tighter select-none pointer-events-none whitespace-nowrap transition-transform duration-100 ${
            isDark ? 'text-white/[0.02]' : 'text-black/[0.02]'
          }`}
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * -35}px), calc(-50% + ${mousePos.y * -25}px))`
          }}
        >
          RETOUCH ATELIER
        </div>

        {/* Top Minimal Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5 relative z-20">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#de4a2c] font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Commercial Image Editing & Finishing</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mt-0.5">
              Visual Perfection at Commerce Velocity
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto-Slide Indicator & Toggle */}
            <button
              onClick={() => setIsHeroAutoSliding(!isHeroAutoSliding)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                isHeroAutoSliding && !isUserHoveringHero
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {isHeroAutoSliding && !isUserHoveringHero ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isHeroAutoSliding && !isUserHoveringHero ? 'Auto-Scan Active' : 'Hover / Manual'}</span>
            </button>

            {/* 4 Hero Showcase Subject Chips */}
            <div className={`flex items-center gap-1 p-1 rounded-2xl border text-xs font-mono ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
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
                      : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {item.badge}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* THE RESPONSIVE VIEWPORT-FITTING 3D PARALLAX STAGE (Tracks mousemove directly & auto-oscillates) */}
        <div
          onMouseEnter={() => setIsUserHoveringHero(true)}
          onMouseLeave={() => {
            setIsUserHoveringHero(false);
            setMousePos({ x: 0, y: 0, pctX: 50, pctY: 50 });
          }}
          onMouseMove={handleHeroStageMouseMove}
          onTouchMove={(e) => {
            if (e.touches[0]) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(rect.width, e.touches[0].clientX - rect.left));
              setHeroSplit(Math.round((x / rect.width) * 100));
            }
          }}
          style={{
            transform: `perspective(1200px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 3}deg)`,
            transition: isUserHoveringHero ? 'transform 0.08s ease-out' : 'transform 0.3s ease-out'
          }}
          className={`relative w-full h-[440px] sm:h-[500px] md:h-[540px] lg:h-[580px] xl:h-[620px] max-h-[66vh] rounded-3xl overflow-hidden select-none border shadow-2xl cursor-ew-resize group z-10 transition-colors ${
            isDark
              ? 'bg-black border-white/15 shadow-[0_20px_70px_rgba(222,74,44,0.15)]'
              : 'bg-neutral-100 border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.1)]'
          }`}
        >
          {/* RIGHT LAYER: FINISHED 16-BIT RETOUCHED */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={currentHero.retouched}
              alt={currentHero.title}
              className="w-full h-full object-cover object-center select-none pointer-events-none"
              draggable={false}
            />

            {/* Finished Badge */}
            <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20 shadow-2xl flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Finished: {currentHero.title}</span>
            </div>
          </div>

          {/* LEFT LAYER: RAW CAPTURE (CLIPPED BY SLIDER) */}
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
              <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-neutral-300 font-mono text-xs font-bold border border-white/10 shadow-2xl flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-neutral-400" />
                <span>Raw Unprocessed Plate</span>
              </div>
            </div>
          </div>

          {/* VERTICAL DIVIDER LINE WITH LASER GLOW */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_#de4a2c,0_0_40px_#de4a2c] z-30 pointer-events-none"
            style={{ left: `${heroSplit}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/20 flex items-center justify-center font-mono text-xs font-bold ring-4 ring-[#de4a2c]/30">
              ⟷
            </div>
          </div>

          {/* Bottom Floating Pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-2xl border border-white/15 text-center">
            <span>
              {isUserHoveringHero
                ? 'Cursor Active: Move mouse horizontally to inspect'
                : `${currentHero.subtitle} • Hover to control`}
            </span>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className={`flex items-center justify-between mt-3 px-1 text-xs font-mono ${
          isDark ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsHeroAutoSliding(false);
                setHeroSplit(0);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                heroSplit === 0
                  ? 'bg-[#de4a2c] text-white font-bold'
                  : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-neutral-200 hover:bg-neutral-300'
              }`}
            >
              Finished (100%)
            </button>
            <button
              onClick={() => {
                setIsHeroAutoSliding(false);
                setHeroSplit(50);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                heroSplit === 50
                  ? 'bg-[#de4a2c] text-white font-bold'
                  : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-neutral-200 hover:bg-neutral-300'
              }`}
            >
              50 / 50 Split
            </button>
            <button
              onClick={() => {
                setIsHeroAutoSliding(false);
                setHeroSplit(100);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                heroSplit === 100
                  ? 'bg-[#de4a2c] text-white font-bold'
                  : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-neutral-200 hover:bg-neutral-300'
              }`}
            >
              Raw (100%)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px]">Split: {heroSplit}%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={heroSplit}
              onChange={(e) => setHeroSplit(Number(e.target.value))}
              className="w-24 sm:w-44 h-1.5 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
            />
          </div>
        </div>
      </section>

      {/* 3. PRECISION STUDIO LAB: WITH SILKY 60FPS AUTO-SLIDE & INTERACTIVE CONTROLS */}
      <section id="studio-lab" className={`py-16 sm:py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t transition-colors ${
        isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
      }`}>
        
        {/* Lab Header with Auto-Slide Pill Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>Precision Studio Lab</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mt-1">
              {currentStudio.number}. {currentStudio.name}
            </h2>
            <div className={`text-xs font-mono mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {currentStudio.tag} • Key Metric: <span className="text-[#de4a2c] font-bold">{currentStudio.metric}</span>
            </div>
          </div>

          {/* Quick Pill Selector for all 11 services */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {SERVICES_11.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveStudioIndex(idx);
                  setStudioSplit(50);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                  activeStudioIndex === idx
                    ? 'bg-[#de4a2c] text-white font-bold shadow-md scale-105'
                    : isDark ? 'bg-white/5 text-neutral-400 hover:text-white' : 'bg-neutral-200 text-neutral-700 hover:text-black'
                }`}
              >
                <span>{s.number}. {s.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Large Interactive Split Stage with AUTO-SLIDING capability */}
        <div className={`relative max-w-5xl mx-auto rounded-3xl border shadow-2xl p-4 sm:p-6 transition-colors ${
          isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-black/10'
        }`}>
          
          {/* Top Bar inside Lab */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06] dark:border-white/[0.08] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase">Dynamic Finishing Inspection:</span>
              <span className="text-[#de4a2c] font-bold">{studioSplit}% Scan Width</span>
            </div>

            {/* Auto-Slide Toggle Button */}
            <button
              onClick={() => setIsAutoSliding(!isAutoSliding)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                isAutoSliding
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {isAutoSliding ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoSliding ? 'Auto-Slide Scanning (Active)' : 'Auto-Slide Paused'}</span>
            </button>
          </div>

          <div
            className="relative w-full h-[460px] sm:h-[560px] md:h-[620px] rounded-2xl overflow-hidden bg-black select-none border border-black/10 cursor-ew-resize group shadow-inner"
            onMouseEnter={() => setIsUserHoveringLab(true)}
            onMouseLeave={() => setIsUserHoveringLab(false)}
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
                <span>Finished 16-Bit Retouch</span>
              </div>

              {/* Inset Metric Tag */}
              <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#10b981] font-mono text-xs font-bold border border-white/10 shadow-lg">
                ✓ {currentStudio.metric}
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
                  <span>Raw Capture Plate</span>
                </div>
              </div>
            </div>

            {/* DIVIDER HANDLE */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_24px_rgba(255,255,255,1)] z-30 pointer-events-none"
              style={{ left: `${studioSplit}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/20 flex items-center justify-center font-mono text-xs font-bold">
                ⟷
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-xl border border-white/10">
              <span>{isAutoSliding && !isUserHoveringLab ? 'Auto-Scanning • Hover or drag to pause' : 'Drag left / right to inspect'}</span>
            </div>
          </div>

          {/* Quick Buttons Below */}
          <div className={`mt-4 pt-2.5 flex items-center justify-between text-xs font-mono ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAutoSliding(false);
                  setStudioSplit(0);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  studioSplit === 0
                    ? 'bg-[#de4a2c] text-white font-bold'
                    : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
              >
                100% Finished
              </button>
              <button
                onClick={() => {
                  setIsAutoSliding(false);
                  setStudioSplit(50);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  studioSplit === 50
                    ? 'bg-[#de4a2c] text-white font-bold'
                    : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
              >
                50 / 50 Split
              </button>
              <button
                onClick={() => {
                  setIsAutoSliding(false);
                  setStudioSplit(100);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  studioSplit === 100
                    ? 'bg-[#de4a2c] text-white font-bold'
                    : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
              >
                100% Raw
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px]">Slide: {studioSplit}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={studioSplit}
                onChange={(e) => {
                  setIsAutoSliding(false);
                  setStudioSplit(Number(e.target.value));
                }}
                className="w-24 sm:w-44 h-1.5 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE LUXURY PARALLAX RUNWAY: WITH INTERACTIVE 3D MOUSE PARALLAX TILT ON CARDS */}
      <section id="parallax-runway" className={`py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t transition-colors ${
        isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
      }`}>
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-3">
          <div>
            <div className="text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider">
              Interactive 3D Mouse Parallax
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
              The Parallax Runway
            </h2>
          </div>
          <div className={`text-xs font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Move mouse over any card to trigger 3D perspective tilt & depth reflection
          </div>
        </div>

        {/* 3 Staggered Parallax Columns with INTERACTIVE MOUSE 3D TILT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* COLUMN 1: Smooth Glide */}
          <div
            className="space-y-6 sm:space-y-8 transition-transform duration-100 ease-out"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            {SERVICES_11.slice(0, 4).map((s) => (
              <ParallaxMouseCard
                key={s.id}
                service={s}
                isDark={isDark}
                onInspect={() => {
                  const idx = SERVICES_11.findIndex((item) => item.id === s.id);
                  scrollToLabWithIndex(idx);
                }}
              />
            ))}
          </div>

          {/* COLUMN 2: Staggered Depth */}
          <div
            className="space-y-6 sm:space-y-8 transition-transform duration-100 ease-out md:mt-14"
            style={{ transform: `translateY(${scrollY * 0.07}px)` }}
          >
            {SERVICES_11.slice(4, 8).map((s) => (
              <ParallaxMouseCard
                key={s.id}
                service={s}
                isDark={isDark}
                onInspect={() => {
                  const idx = SERVICES_11.findIndex((item) => item.id === s.id);
                  scrollToLabWithIndex(idx);
                }}
              />
            ))}
          </div>

          {/* COLUMN 3: Deep Background Velocity */}
          <div
            className="space-y-6 sm:space-y-8 transition-transform duration-100 ease-out md:-mt-8"
            style={{ transform: `translateY(${scrollY * -0.08}px)` }}
          >
            {SERVICES_11.slice(8, 11).map((s) => (
              <ParallaxMouseCard
                key={s.id}
                service={s}
                isDark={isDark}
                onInspect={() => {
                  const idx = SERVICES_11.findIndex((item) => item.id === s.id);
                  scrollToLabWithIndex(idx);
                }}
              />
            ))}

            {/* Inset Complimentary Trial Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#de4a2c] via-[#b8371c] to-[#801e0a] text-white shadow-2xl flex flex-col justify-between h-[360px] border border-white/20">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider bg-black/25 px-3 py-1 rounded-full">
                  Complimentary Evaluation
                </span>
                <h3 className="font-display text-2xl font-bold mt-4">
                  Test Your Own 3 RAW Images
                </h3>
                <p className="font-mono text-xs text-white/85 mt-2 leading-relaxed">
                  Experience non-destructive 16-bit finishing on your active product line. 24h SLA.
                </p>
              </div>

              <Link
                href="/#free-sample"
                className="w-full py-3.5 px-4 rounded-xl bg-white text-black hover:bg-black hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Upload 3 Test Files</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. ALL 11 SPECIALIST SERVICES VISUAL TILES */}
      <section id="services" className={`py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t transition-colors ${
        isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider">
              Service Catalog
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
              11 Specialist Disciplines
            </h2>
          </div>
          <span className={`text-xs font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Click any tile to inspect in Lab
          </span>
        </div>

        {/* 11 Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {SERVICES_11.map((service, idx) => (
            <button
              key={service.id}
              onClick={() => scrollToLabWithIndex(idx)}
              className={`group p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 ${
                isDark
                  ? 'bg-neutral-900 border-white/10 hover:border-[#de4a2c]'
                  : 'bg-white border-black/10 hover:border-[#de4a2c] shadow-sm'
              }`}
            >
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black mb-3">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#de4a2c] font-bold">
                  {service.number}
                </span>
              </div>

              <div>
                <div className="font-display text-xs font-bold group-hover:text-[#de4a2c] transition-colors truncate">
                  {service.name}
                </div>
                <div className={`text-[10px] font-mono truncate mt-0.5 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  {service.tag}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 6. MINIMAL FREE PILOT CTA */}
      <section className={`py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t transition-colors ${
        isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
      }`}>
        <div className={`max-w-3xl mx-auto text-center rounded-3xl border p-8 sm:p-12 shadow-2xl transition-colors ${
          isDark
            ? 'bg-neutral-900 border-white/10'
            : 'bg-white border-black/10 shadow-lg'
        }`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border ${
            isDark ? 'bg-white/5 border-white/10 text-neutral-300' : 'bg-neutral-100 border-black/10 text-neutral-700'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-[#de4a2c]" />
            <span>Complimentary Pilot Evaluation</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Test 3 Images on Us.
          </h2>

          <p className={`font-mono text-xs mb-6 max-w-md mx-auto ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
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
      <footer className={`border-t py-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-4 transition-colors ${
        isDark ? 'border-white/[0.08] text-neutral-500' : 'border-black/[0.08] text-neutral-500'
      }`}>
        <div>Cutting Edger • 11 Commercial Image Editing Services • 16-Bit Non-Destructive</div>
        <div className="flex items-center gap-4">
          <a href="#parallax-runway" className="hover:opacity-80 transition-opacity">Parallax Runway</a>
          <span className="opacity-30">•</span>
          <a href="#studio-lab" className="hover:opacity-80 transition-opacity">Auto-Slide Lab</a>
          <span className="opacity-30">•</span>
          <a href="#services" className="hover:opacity-80 transition-opacity">11 Services</a>
        </div>
      </footer>

    </div>
  );
}
