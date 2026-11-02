import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
  ArrowUpRight,
  SlidersHorizontal,
  Upload,
  CheckCircle2,
  Maximize2,
  X,
  Check,
  Wand2,
  Palette,
  Sun,
  Scissors,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  FileCode
} from 'lucide-react';

// ==========================================
// 1. FULL-WIDTH ROUNDED HERO SHOWCASE DATA (NO PRICES)
// ==========================================
const HERO_SHOWCASE_PLATES = [
  {
    id: 'footwear',
    category: 'Footwear',
    badge: 'PRECISION PEN-TOOL PATH',
    title: 'Multi-Path Cutout & Ground Shadow',
    metric: '300% Zoom Edge Accuracy • Dynamic Studio Shadow',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=85',
    rawFilter: 'brightness(0.78) contrast(0.8) saturate(0.45) sepia(0.15)',
    doneFilter: 'brightness(1.05) contrast(1.1) saturate(1.14) drop-shadow(0 28px 26px rgba(15,15,18,0.22))',
    tintColor: '#EEF2FF'
  },
  {
    id: 'apparel',
    category: 'Apparel',
    badge: '3D GHOST MANNEQUIN',
    title: 'Invisible Mannequin & Garment Drape',
    metric: 'Natural Volume • Zero Halo Cutout',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85',
    rawFilter: 'brightness(0.75) contrast(0.82) saturate(0.5) sepia(0.12)',
    doneFilter: 'brightness(1.04) contrast(1.08) saturate(1.1)',
    tintColor: '#EAE6DF'
  },
  {
    id: 'jewelry',
    category: 'Jewelry',
    badge: 'MACRO FOCUS STACKING',
    title: 'Micro-Dust Removal & Gem Brilliance',
    metric: 'Prong Rebuild • Metal Specular Polish',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1800&q=85',
    rawFilter: 'brightness(0.7) contrast(0.78) grayscale(0.45)',
    doneFilter: 'brightness(1.08) contrast(1.15) saturate(1.08)',
    tintColor: '#F3F4F6'
  },
  {
    id: 'hardgoods',
    category: 'Cosmetics',
    badge: 'SPECULAR & REFLECTION GRADE',
    title: 'Glass Reflection & Label Rebuild',
    metric: 'Clean Highlights • Exact Color Match',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1800&q=85',
    rawFilter: 'brightness(0.76) contrast(0.82) saturate(0.5)',
    doneFilter: 'brightness(1.06) contrast(1.12) saturate(1.1)',
    tintColor: '#FDF2F8'
  }
];

// Fallback Luxury Client Logotypes
const LUXURY_BRAND_SILHOUETTES = [
  'BALENCIAGA',
  'CARTIER',
  'SSENSE',
  'FARFETCH',
  'KITH',
  'JIL SANDER',
  'ACNE STUDIOS',
  'MONCLER'
];

// ==========================================
// 2. 5-PANEL EXPANDING IMAGE ACCORDION
// ==========================================
const ACCORDION_PANELS = [
  {
    id: 'acc-1',
    tag: 'PRECISION PATH',
    title: 'Precision Clipping',
    metric: '100% Hand-Drawn Pen Tool Paths',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.75) contrast(0.82) saturate(0.45) sepia(0.2)'
  },
  {
    id: 'acc-2',
    tag: 'APPAREL STUDIO',
    title: '3D Ghost Mannequin',
    metric: 'Symmetrical Drape',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.74) contrast(0.8) saturate(0.5)'
  },
  {
    id: 'acc-3',
    tag: 'LUXURY MACRO',
    title: 'Fine Jewelry Polish',
    metric: 'Gem & Metal Clarity',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.72) contrast(0.78) grayscale(0.45)'
  },
  {
    id: 'acc-4',
    tag: 'COLOR ACCURACY',
    title: 'Multi-SKU Recolor',
    metric: 'Zero Reshoot Needed',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'hue-rotate(140deg) brightness(0.82) saturate(0.75)'
  },
  {
    id: 'acc-5',
    tag: 'SPECULAR FINISH',
    title: 'Cosmetics & Glass',
    metric: 'Specular Highlights',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.75) contrast(0.82) saturate(0.55)'
  }
];

// ==========================================
// 3. CURATED BENTO LOOKBOOK CARDS
// ==========================================
const BENTO_PORTFOLIO = [
  {
    id: 'bento-1',
    span: 'lg:col-span-7',
    height: 'h-[420px]',
    tag: 'FOOTWEAR COMPOSITE',
    title: 'Dynamic Levitation & Floor Shadow',
    turnaround: '6h Express Turnaround',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85',
    rawFilter: 'brightness(0.76) contrast(0.82) saturate(0.45) sepia(0.15)'
  },
  {
    id: 'bento-2',
    span: 'lg:col-span-5',
    height: 'h-[420px]',
    tag: 'HOROLOGY & METALS',
    title: 'Chronograph Anti-Glare Polish',
    turnaround: '12h Studio SLA',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.72) contrast(0.78) saturate(0.4)'
  },
  {
    id: 'bento-3',
    span: 'lg:col-span-5',
    height: 'h-[420px]',
    tag: 'BOTANICAL & GLASS',
    title: 'Translucent Glass & Drop Refraction',
    turnaround: '12h Studio SLA',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.75) contrast(0.8) grayscale(0.45)'
  },
  {
    id: 'bento-4',
    span: 'lg:col-span-7',
    height: 'h-[420px]',
    tag: 'HIGH-FASHION EDITORIAL',
    title: 'Color Grading & Fabric Texture Recovery',
    turnaround: 'Custom Campaign SLA',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
    rawFilter: 'brightness(0.74) contrast(0.8) saturate(0.5)'
  }
];

// ==========================================
// 4. COLOR SWATCHES FOR LIVE STUDIO TESTER
// ==========================================
const SKU_SWATCHES = [
  { name: 'Crimson Original', hue: 0, hex: '#EF4444' },
  { name: 'Cobalt Electric', hue: 215, hex: '#2563EB' },
  { name: 'Emerald Volt', hue: 125, hex: '#10B981' },
  { name: 'Sunset Violet', hue: 285, hex: '#8B5CF6' }
];

type StudioBackdropMode = 'master' | 'white' | 'gray' | 'black' | 'checker' | 'tint' | 'raw';

interface HomeProps {
  featuredProjects?: any[];
  services?: any[];
  teamMembers?: any[];
  testimonials?: any[];
  clients?: Array<{
    id: number;
    name: string;
    logo_dark?: string;
    logo_light?: string;
    url?: string;
  }>;
}

export default function Home({ clients = [] }: HomeProps) {
  // 1. Hero Interactive State
  const [heroTabIdx, setHeroTabIdx] = useState(0);
  const currentHero = HERO_SHOWCASE_PLATES[heroTabIdx] || HERO_SHOWCASE_PLATES[0];
  const [splitPos, setSplitPos] = useState(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [heroFinishMode, setHeroFinishMode] = useState<StudioBackdropMode>('master');
  const heroStageRef = useRef<HTMLDivElement>(null);

  // 2. Core Studio Capabilities (5-Panel Accordion State)
  const [expandedAccordion, setExpandedAccordion] = useState(1);
  const [accordionRawMap, setAccordionRawMap] = useState<Record<string, boolean>>({});

  // 3. Interactive Live Retouching Playground State
  const [layerCutout, setLayerCutout] = useState(true);
  const [layerShadow, setLayerShadow] = useState(true);
  const [layerPolish, setLayerPolish] = useState(true);
  const [activeSwatchIdx, setActiveSwatchIdx] = useState(0);

  // 4. Bento Lookbook State
  const [globalRawMode, setGlobalRawMode] = useState(false);
  const [hoveredBentoId, setHoveredBentoId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<(typeof BENTO_PORTFOLIO)[number] | null>(null);

  // 5. Free Sample Dropzone State
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([
    'Precision Clipping',
    '3D Ghost Mannequin'
  ]);
  const [selectedTurnaround, setSelectedTurnaround] = useState('12h Express');
  const [volumeSlider, setVolumeSlider] = useState(250);
  const [trialSubmitted, setTrialSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Intro Slider Glide Demo (Visually signals interactivity on load without text)
  useEffect(() => {
    let frameId: number;
    let start: number | null = null;
    const duration = 1400;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const offset = Math.sin(progress * Math.PI * 2) * 12;
        setSplitPos(50 + offset);
        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setSplitPos(50);
        }
      };
      frameId = requestAnimationFrame(step);
    }, 900);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // Handle Split Slider Dragging
  const updateSplitPosition = (clientX: number) => {
    if (!heroStageRef.current) return;
    const rect = heroStageRef.current.getBoundingClientRect();
    const x = Math.max(12, Math.min(clientX - rect.left, rect.width - 12));
    setSplitPos((x / rect.width) * 100);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDraggingSplit) updateSplitPosition(e.clientX);
    };
    const onTouch = (e: TouchEvent) => {
      if (isDraggingSplit && e.touches[0]) updateSplitPosition(e.touches[0].clientX);
    };
    const onUp = () => setIsDraggingSplit(false);

    if (isDraggingSplit) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onTouch);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDraggingSplit]);

  const toggleCapabilityPill = (cap: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((item) => item !== cap) : [...prev, cap]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  // Compute Live Playground Filter
  const getPlaygroundFilter = () => {
    const currentSwatch = SKU_SWATCHES[activeSwatchIdx] || SKU_SWATCHES[0];
    const hue = currentSwatch.hue;
    const polishPart = layerPolish
      ? 'brightness(1.06) contrast(1.1) saturate(1.12)'
      : 'brightness(0.84) contrast(0.86) saturate(0.65)';
    const shadowPart = layerShadow
      ? 'drop-shadow(0 32px 24px rgba(15,15,18,0.28))'
      : 'drop-shadow(0 2px 4px rgba(15,15,18,0.06))';
    return `hue-rotate(${hue}deg) ${polishPart} ${shadowPart}`;
  };

  // Volume slider dynamic tier
  const volumeTierInfo = useMemo(() => {
    if (volumeSlider < 100) {
      return {
        sla: '6h Rush SLA',
        badge: '⚡ Express Rush',
        desc: 'Dedicated Senior Retoucher • Express Pilot'
      };
    }
    if (volumeSlider <= 1000) {
      return {
        sla: '12h Express Studio SLA',
        badge: '⏱️ Studio SLA',
        desc: 'Multi-Desk Production • Dual-Pass Quality Control'
      };
    }
    return {
      sla: 'Custom Enterprise SLA',
      badge: '👑 Enterprise SLA',
      desc: 'Dedicated Art Director • Automated Slack/FTP API Ingest'
    };
  }, [volumeSlider]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F0F12] antialiased selection:bg-[#0F0F12] selection:text-white">
      <Head>
        <title>CuttingEdger — Creative Digital Post-Production Studio</title>
        <meta
          name="description"
          content="Visual post-production for modern brands. 3D ghost mannequin, precision clipping, jewelry polish, cosmetics, and multi-SKU colorways."
        />
      </Head>

      {/* ==========================================
          1. MINIMALIST FLOATING TOP BAR
      ========================================== */}
      <div className="sticky top-5 z-50 px-4 sm:px-8 pointer-events-none">
        <header className="max-w-7xl mx-auto h-16 px-6 rounded-full bg-white/90 backdrop-blur-xl border border-neutral-200/80 shadow-[0_8px_30px_rgba(15,15,18,0.04)] flex items-center justify-between pointer-events-auto">
          <a
            href="#"
            className="text-lg font-extrabold tracking-tight text-[#0F0F12] flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>CuttingEdger.</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <a href="#capabilities" className="hover:text-[#0F0F12] transition-colors">
              Capabilities
            </a>
            <a href="#interactive-studio" className="hover:text-[#0F0F12] transition-colors">
              Interactive Studio
            </a>
            <a href="#portfolio" className="hover:text-[#0F0F12] transition-colors">
              Portfolio
            </a>
            <a href="#free-sample" className="hover:text-[#0F0F12] transition-colors">
              Free Sample
            </a>
          </nav>

          <a
            href="#free-sample"
            className="px-5 py-2.5 rounded-full bg-[#0F0F12] text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Start Free Trial</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </header>
      </div>

      {/* ==========================================
          2. CLEAN ROUNDED VISUAL HERO STAGE
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-14">
        {/* Editorial Centered Hero Header (Apple / Linear Luxury Design) */}
        <div className="text-center max-w-3xl mx-auto mb-9">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/80 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0F0F12]">
              DIGITAL POST-PRODUCTION STUDIO
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F0F12] leading-[1.08]">
            Visual Post-Production for Modern Brands.
          </h1>

          <p className="text-xs sm:text-base text-neutral-500 font-medium mt-3.5 max-w-xl mx-auto leading-relaxed">
            100% hand-drawn pen-tool vector paths, invisible ghost mannequin drape, and colorways with guaranteed 12-hour turnaround.
          </p>

          {/* Balanced Luxury Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="#free-sample"
              className="px-6 py-3.5 rounded-full bg-[#0F0F12] text-white text-xs sm:text-sm font-extrabold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-[0_4px_16px_rgba(15,15,18,0.12)] hover:shadow-[0_8px_24px_rgba(15,15,18,0.2)]"
            >
              <span>Get 3 Free Sample Retouches</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#interactive-studio"
              className="px-5 py-3.5 rounded-full bg-white text-neutral-700 hover:text-[#0F0F12] border border-neutral-200/80 text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow"
            >
              Test Live Playground ↓
            </a>
          </div>
        </div>

        {/* Cinematic Rounded Visual Hero Stage (Pure Uncluttered Showcase) */}
        <div
          ref={heroStageRef}
          onMouseDown={(e) => {
            setIsDraggingSplit(true);
            updateSplitPosition(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDraggingSplit(true);
            if (e.touches[0]) updateSplitPosition(e.touches[0].clientX);
          }}
          className="relative w-full h-[470px] sm:h-[550px] rounded-[32px] overflow-hidden select-none cursor-ew-resize border border-neutral-200/80 shadow-[0_25px_60px_rgba(15,15,18,0.08)] bg-white"
        >
          {/* AFTER / STUDIO MASTER LAYER */}
          <div className="absolute inset-0 bg-[#F4F4F6]">
            <img
              key={`hero-after-${currentHero.id}`}
              src={currentHero.image}
              alt={currentHero.title}
              draggable="false"
              className="w-full h-full object-cover object-center transition-all duration-700"
              style={{ filter: currentHero.doneFilter }}
            />
          </div>

          {/* BEFORE / RAW CAPTURE LAYER (Clipped by Split Slider) */}
          <div
            className="absolute inset-0 overflow-hidden bg-[#D6D3CD]"
            style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
          >
            <img
              key={`hero-before-${currentHero.id}`}
              src={currentHero.image}
              alt="Unedited Raw"
              draggable="false"
              className="w-full h-full object-cover object-center transition-all duration-700"
              style={{ filter: currentHero.rawFilter }}
            />
            <span className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-extrabold tracking-wide">
              RAW CAPTURE
            </span>
          </div>

          {/* Center Tactile Split Divider with RAW | MASTER Badge */}
          <div
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.4)] pointer-events-none"
            style={{ left: `${splitPos}%` }}
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-white text-[#0F0F12] shadow-2xl flex items-center gap-1.5 border border-neutral-200 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
              <span>RAW</span>
              <span className="opacity-30">|</span>
              <span className="text-emerald-600 font-extrabold">MASTER</span>
            </div>
          </div>

          {/* Bottom Gradient & Typography Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white z-20"
          >
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                {currentHero.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                {currentHero.title}
              </h2>
              <span className="text-xs text-neutral-300 font-medium mt-1 block">
                {currentHero.metric}
              </span>
            </div>

            {/* Discreet Plate Switcher in Bottom Corner */}
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/20 self-start sm:self-auto">
              {HERO_SHOWCASE_PLATES.map((plate, index) => (
                <button
                  key={plate.id}
                  onClick={() => setHeroTabIdx(index)}
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                    heroTabIdx === index
                      ? 'bg-white text-[#0F0F12] shadow-sm'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {plate.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. CORE STUDIO CAPABILITIES (EXACT ACCORDION)
      ========================================== */}
      <section id="capabilities" className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]">
                Core Studio Capabilities
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-neutral-500">
              Hover or tap any vertical panel to expand • Click badge to flip RAW / DONE
            </p>
          </div>

          {/* 5-Panel Horizontal Expanding Strip */}
          <div className="flex flex-col lg:flex-row gap-3.5 h-auto lg:h-[500px]">
            {ACCORDION_PANELS.map((panel, idx) => {
              const isExpanded = expandedAccordion === idx;
              const isRaw = !!accordionRawMap[panel.id];

              return (
                <div
                  key={panel.id}
                  onMouseEnter={() => setExpandedAccordion(idx)}
                  onClick={() => setExpandedAccordion(idx)}
                  className={`relative rounded-[28px] overflow-hidden cursor-pointer transition-all duration-500 ease-out border border-neutral-200/80 bg-white ${
                    isExpanded
                      ? 'lg:flex-[3.5] h-[380px] lg:h-full shadow-xl'
                      : 'lg:flex-[1] h-[120px] lg:h-full opacity-95 hover:opacity-100'
                  }`}
                >
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className="w-full h-full object-cover object-center transition-all duration-500"
                    style={{
                      filter: isRaw ? panel.rawFilter : 'brightness(1.04) contrast(1.06)'
                    }}
                  />

                  {/* Smooth Dark Bottom Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  {/* Top-Right Interactive Pill */}
                  {isExpanded && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAccordionRawMap((prev) => ({
                          ...prev,
                          [panel.id]: !prev[panel.id]
                        }));
                      }}
                      className={`absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-md ${
                        isRaw
                          ? 'bg-amber-400 text-[#0F0F12]'
                          : 'bg-white text-[#0F0F12] hover:bg-neutral-100'
                      }`}
                    >
                      {isRaw ? 'Viewing: RAW' : 'Viewing: EDITED'}
                    </button>
                  )}

                  {/* Bottom Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                        {panel.tag}
                      </span>
                      <h3
                        className={`font-extrabold tracking-tight transition-all ${
                          isExpanded ? 'text-xl sm:text-2xl mt-0.5' : 'text-base'
                        }`}
                      >
                        {panel.title}
                      </h3>
                      {isExpanded && (
                        <span className="text-xs text-neutral-300 font-medium mt-1 block">
                          {panel.metric}
                        </span>
                      )}
                    </div>

                    {isExpanded && (
                      <a
                        href="#free-sample"
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-white text-[#0F0F12] flex items-center justify-center hover:bg-emerald-400 transition-colors shrink-0 shadow-md"
                        title="Try this capability"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. INTERACTIVE LIVE RETOUCHING PLAYGROUND
      ========================================== */}
      <section id="interactive-studio" className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]">
                Interactive Retouching Studio
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-neutral-500">
              Toggle non-destructive studio layers & live SKU colorways in real time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Visual Canvas Card (8 Cols) */}
            <div
              className={`lg:col-span-8 relative h-[420px] sm:h-[460px] rounded-[28px] overflow-hidden border border-neutral-200/80 shadow-sm flex items-center justify-center transition-colors duration-500 ${
                layerCutout ? 'checkerboard-subtle' : 'bg-[#D8D5CE]'
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85"
                alt="Interactive Studio Sample"
                className={`w-full h-full object-cover object-center transition-all duration-500 ${
                  layerCutout ? 'mix-blend-multiply scale-90 object-contain' : ''
                }`}
                style={{ filter: getPlaygroundFilter() }}
              />

              {/* Top-Right Status Pill */}
              <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/80 text-xs font-extrabold text-[#0F0F12] shadow-sm">
                Active SKU: {SKU_SWATCHES[activeSwatchIdx].name}
              </div>

              {/* Bottom Overlay Bar matching Accordion style */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end justify-between text-white">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                    LIVE LAYER PREVIEW
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight mt-0.5">
                    Multi-Layer PSD Production Pipeline
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLayerCutout(false);
                    setLayerShadow(false);
                    setLayerPolish(false);
                    setActiveSwatchIdx(0);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#0F0F12] text-xs font-bold backdrop-blur-md transition-colors"
                >
                  Reset to Raw
                </button>
              </div>
            </div>

            {/* Right Clean Layer Toggles Card (4 Cols) */}
            <div className="lg:col-span-4 rounded-[28px] bg-white border border-neutral-200/80 p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                  STUDIO FINISHING CONTROLS
                </span>
                <h3 className="text-lg font-extrabold text-[#0F0F12]">
                  Customize Post-Production
                </h3>

                {/* Layer 1: Clipping Path */}
                <button
                  type="button"
                  onClick={() => setLayerCutout(!layerCutout)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    layerCutout
                      ? 'bg-[#0F0F12] text-white border-[#0F0F12]'
                      : 'bg-[#F8F9FA] text-[#0F0F12] border-neutral-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Scissors className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-extrabold">Pen-Tool Background Cutout</div>
                      <div className="text-[11px] opacity-70">300% zoom vector path</div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      layerCutout ? 'bg-emerald-400 text-[#0F0F12]' : 'bg-neutral-200'
                    }`}
                  >
                    {layerCutout && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Layer 2: Natural Drop Shadow */}
                <button
                  type="button"
                  onClick={() => setLayerShadow(!layerShadow)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    layerShadow
                      ? 'bg-[#0F0F12] text-white border-[#0F0F12]'
                      : 'bg-[#F8F9FA] text-[#0F0F12] border-neutral-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sun className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-extrabold">Natural Floor Shadow</div>
                      <div className="text-[11px] opacity-70">Soft grounded studio depth</div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      layerShadow ? 'bg-emerald-400 text-[#0F0F12]' : 'bg-neutral-200'
                    }`}
                  >
                    {layerShadow && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Layer 3: Micro-Blemish & Specular Polish */}
                <button
                  type="button"
                  onClick={() => setLayerPolish(!layerPolish)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    layerPolish
                      ? 'bg-[#0F0F12] text-white border-[#0F0F12]'
                      : 'bg-[#F8F9FA] text-[#0F0F12] border-neutral-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wand2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-extrabold">Studio Polish & Contrast</div>
                      <div className="text-[11px] opacity-70">Dust, glue & crease removal</div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      layerPolish ? 'bg-emerald-400 text-[#0F0F12]' : 'bg-neutral-200'
                    }`}
                  >
                    {layerPolish && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Layer 4: Multi-SKU Colorway Swatches */}
                <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-neutral-200/80">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-extrabold flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-emerald-600" />
                      Instant SKU Color Match
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-500">
                      {SKU_SWATCHES[activeSwatchIdx].name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {SKU_SWATCHES.map((swatch, idx) => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => setActiveSwatchIdx(idx)}
                        className={`h-8 flex-1 rounded-xl transition-all border-2 ${
                          activeSwatchIdx === idx
                            ? 'border-[#0F0F12] scale-105 shadow-sm'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                        title={swatch.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <a
                href="#free-sample"
                className="mt-5 w-full py-3.5 rounded-full bg-[#0F0F12] text-white text-xs font-extrabold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Test With Your Own Product</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. CURATED BENTO LOOKBOOK
      ========================================== */}
      <section id="portfolio" className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]">
                Curated Studio Lookbook
              </h2>
            </div>

            {/* Global Toggle Pill */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-neutral-200/80 self-start sm:self-auto shadow-sm">
              <button
                type="button"
                onClick={() => setGlobalRawMode(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  !globalRawMode
                    ? 'bg-[#0F0F12] text-white'
                    : 'text-neutral-500 hover:text-[#0F0F12]'
                }`}
              >
                Viewing: ALL EDITED
              </button>
              <button
                type="button"
                onClick={() => setGlobalRawMode(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  globalRawMode
                    ? 'bg-amber-400 text-[#0F0F12]'
                    : 'text-neutral-500 hover:text-[#0F0F12]'
                }`}
              >
                Viewing: ALL RAW
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {BENTO_PORTFOLIO.map((card) => {
              const isHovered = hoveredBentoId === card.id;
              const showRaw = globalRawMode ? !isHovered : isHovered;

              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredBentoId(card.id)}
                  onMouseLeave={() => setHoveredBentoId(null)}
                  onClick={() => setLightboxItem(card)}
                  className={`${card.span} ${card.height} relative rounded-[28px] overflow-hidden cursor-pointer border border-neutral-200/80 bg-white group shadow-sm hover:shadow-xl transition-all duration-500`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                    style={{
                      filter: showRaw
                        ? card.rawFilter
                        : 'brightness(1.04) contrast(1.08)'
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  {/* Top-Right Pill Badge */}
                  <span
                    className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-md transition-colors ${
                      showRaw
                        ? 'bg-amber-400 text-[#0F0F12]'
                        : 'bg-white text-[#0F0F12]'
                    }`}
                  >
                    {showRaw ? 'Viewing: RAW (Hover for Edited)' : 'Viewing: EDITED (Hover for Raw)'}
                  </span>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                        {card.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                        {card.title}
                      </h3>
                      <span className="text-xs text-neutral-300 font-medium mt-1 block">
                        {card.turnaround}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-white text-[#0F0F12] flex items-center justify-center group-hover:bg-emerald-400 transition-colors shrink-0 shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. FREE SAMPLE & VISUAL VOLUME ESTIMATOR
      ========================================== */}
      <section id="free-sample" className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto rounded-[32px] bg-[#0F0F12] text-white p-7 sm:p-12 border border-neutral-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column (6 Cols): Interactive Volume Slider & Capabilities */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                  COMPLIMENTARY STUDIO TEST
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Experience Our Quality With a Free Sample.
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Send us up to 3 RAW product images. We retouch them to your exact brand specifications and return master files within hours.
                </p>
              </div>

              {/* Interactive Volume & SLA Slider (Replaces heavy text) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">
                    ESTIMATED MONTHLY ASSETS
                  </span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                    {volumeSlider >= 1000 ? '1,000+ images/mo' : `${volumeSlider} images/mo`}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1200"
                  step="20"
                  value={volumeSlider}
                  onChange={(e) => setVolumeSlider(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                />
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 pt-1">
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {volumeTierInfo.badge}: {volumeTierInfo.sla}
                  </span>
                  <span className="opacity-75">{volumeTierInfo.desc}</span>
                </div>
              </div>

              {/* Select Capabilities */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-2.5">
                  1. SELECT DESIRED CAPABILITIES
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Precision Clipping',
                    '3D Ghost Mannequin',
                    'Fine Jewelry Polish',
                    'Multi-SKU Recolor',
                    'Cosmetics & Glass'
                  ].map((cap) => {
                    const active = selectedCapabilities.includes(cap);
                    return (
                      <button
                        type="button"
                        key={cap}
                        onClick={() => toggleCapabilityPill(cap)}
                        className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                          active
                            ? 'bg-emerald-400 text-[#0F0F12]'
                            : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{cap}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format Badges & NDA Shield */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Strict NDA Protection
                </span>
                <div className="flex items-center gap-1.5 opacity-60 text-[10px] font-mono uppercase">
                  {['PSD', 'TIFF', 'CR3', 'NEF', 'PNG'].map((fmt) => (
                    <span key={fmt} className="px-1.5 py-0.5 rounded bg-white/10">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (6 Cols): Clean Rounded Upload Dropzone */}
            <div className="lg:col-span-6">
              {!trialSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setTrialSubmitted(true);
                  }}
                  className="rounded-[26px] bg-white/5 border border-white/10 p-6 sm:p-8 space-y-4"
                >
                  <label
                    onClick={() => fileInputRef.current?.click()}
                    className="block border-2 border-dashed border-white/20 hover:border-emerald-400 rounded-2xl p-7 text-center cursor-pointer transition-colors bg-white/5"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="w-11 h-11 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-extrabold text-white block">
                      {uploadedFiles.length > 0
                        ? `${uploadedFiles.length} RAW file(s) attached`
                        : 'Drop RAW files here or click to browse'}
                    </span>
                    <span className="text-xs text-neutral-400 mt-1 block">
                      Supports PSD, TIFF, CR3, NEF, PNG & JPG • Strict NDA Protection
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="email"
                      required
                      placeholder="Work email address..."
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400"
                    />
                    <input
                      type="text"
                      placeholder="Brand / Studio URL (optional)"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-emerald-400 text-[#0F0F12] font-extrabold text-xs sm:text-sm hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Submit Free Sample Request</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="rounded-[26px] bg-white/5 border border-emerald-400/30 p-8 text-center space-y-3">
                  <CheckCircle2 className="w-11 h-11 text-emerald-400 mx-auto" />
                  <h3 className="text-xl font-extrabold">Sample Request Received</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
                    Our senior retouching desk has queued your sample for{' '}
                    <span className="text-emerald-300 font-bold">{volumeTierInfo.sla}</span>{' '}
                    turnaround.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTrialSubmitted(false);
                      setUploadedFiles([]);
                    }}
                    className="text-xs font-extrabold text-emerald-400 underline pt-2"
                  >
                    Upload another batch
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. LIGHTBOX MODAL FOR BENTO LOOKBOOK
      ========================================== */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-[28px] overflow-hidden bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-[#0F0F12] flex items-center justify-center shadow-md hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-[480px] sm:h-[540px] relative">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                  {lightboxItem.tag}
                </span>
                <h3 className="text-2xl font-extrabold mt-0.5">{lightboxItem.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          8. MINIMALIST FOOTER
      ========================================== */}
      <footer className="py-10 px-4 sm:px-8 border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-neutral-500">
          <div className="flex items-center gap-2 text-[#0F0F12] font-extrabold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>CuttingEdger.com</span>
          </div>
          <div className="flex gap-6">
            <a href="#capabilities" className="hover:text-[#0F0F12] transition-colors">
              Capabilities
            </a>
            <a href="#interactive-studio" className="hover:text-[#0F0F12] transition-colors">
              Interactive Studio
            </a>
            <a href="#portfolio" className="hover:text-[#0F0F12] transition-colors">
              Portfolio
            </a>
            <a href="#free-sample" className="hover:text-[#0F0F12] transition-colors">
              Free Sample
            </a>
          </div>
          <span>© {new Date().getFullYear()} CuttingEdger Studio</span>
        </div>
      </footer>
    </div>
  );
}

// Override global AppLayout with a Fragment so the landing page renders its own minimalist design
Home.layout = (page: React.ReactNode) => <>{page}</>;
