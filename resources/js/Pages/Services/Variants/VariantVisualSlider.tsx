import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Layers,
  X,
  Play,
  Pause
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

const HERO_SLIDES = [
  {
    id: 1,
    title: 'High-Jewelry Multi-Path',
    subtitle: 'Sapphire & Platinum Micro-Bezel Isolation',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=85',
    spec: '0.1px Vector Nodes // 100% Alpha Channel',
    tag: 'HAUTE JOAILLERIE'
  },
  {
    id: 2,
    title: 'Runway Silk Organza',
    subtitle: 'Ultra-Fine Edge Masking & Retain Transparency',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
    spec: 'Preserved Sheer Drape // Zero Halo Edge',
    tag: 'EDITORIAL ATELIER'
  },
  {
    id: 3,
    title: 'Sculpted Leather Handbag',
    subtitle: 'Precision Stitch Contour & Ground Contact Shadow',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=85',
    spec: 'Multipath Hardware Isolation // PSD Delivery',
    tag: 'LUXURY LEATHER'
  },
  {
    id: 4,
    title: 'Precision Swiss Chrono',
    subtitle: 'Metallic Bezel & Domed Crystal Isolation',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=85',
    spec: 'Sub-Pixel Bezier Accuracy // 12h SLA',
    tag: 'TIMEPIECE MASTER'
  }
];

const PORTFOLIO_ILLUSTRATIONS = [
  {
    id: 1,
    title: 'Eyewear Acetate & Lens Refraction',
    category: 'Optical Transparency',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
    type: 'eyewear'
  },
  {
    id: 2,
    title: 'Footwear Knit & Textured Rubber',
    category: 'Intricate Perimeter',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    type: 'footwear'
  },
  {
    id: 3,
    title: 'Cosmetic Glass & Dropper Flacon',
    category: 'Liquid Boundary Cutout',
    image: 'https://images.unsplash.com/photo-1608248597359-566b693836d5?auto=format&fit=crop&w=1000&q=80',
    type: 'cosmetics'
  },
  {
    id: 4,
    title: 'Fine Diamond Ring Cluster',
    category: 'Micro-Prong Retention',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    type: 'jewelry'
  },
  {
    id: 5,
    title: 'Cashmere Tailored Trench',
    category: 'Wool Surface Masking',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
    type: 'apparel'
  },
  {
    id: 6,
    title: 'Minimalist Ceramic Bottle',
    category: 'Geometric Curvature Isolation',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80',
    type: 'cosmetics'
  }
];

export const VariantVisualSlider: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Auto-advance hero slides every 5s
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const activeSlide = HERO_SLIDES[currentSlide];

  const filteredPortfolio =
    activeCategory === 'all'
      ? PORTFOLIO_ILLUSTRATIONS
      : PORTFOLIO_ILLUSTRATIONS.filter((item) => item.type === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white pb-32">
      {/* Top Banner Ticker */}
      <div className="border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-600">
          <div className="flex items-center gap-3">
            <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              04 // VISUAL SLIDER SHOWCASE
            </span>
            <span className="text-neutral-300">/</span>
            <span className="font-semibold text-neutral-800 truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">HIGH-VELOCITY IMAGE SUITE</span>
            <span className="font-bold text-neutral-900">4K ATELIER REELS</span>
          </div>
        </div>
      </div>

      {/* 1. GRAND CINEMATIC SLIDER HERO BANNER */}
      <section className="pt-8 sm:pt-12 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Slider Frame */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-950 text-white min-h-[520px] sm:min-h-[580px] flex flex-col justify-end">
            {/* Background Image Slide with Fade */}
            <div className="absolute inset-0 z-0">
              {HERO_SLIDES.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover brightness-[0.75]"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            </div>

            {/* Slider Top Floating HUD */}
            <div className="relative z-10 p-6 sm:p-10 flex items-center justify-between mb-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-mono tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeSlide.tag}</span>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors"
                  title={isAutoPlaying ? 'Pause Auto-Slide' : 'Play Auto-Slide'}
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))
                  }
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider Bottom Content Overlay */}
            <div className="relative z-10 p-6 sm:p-12 space-y-4 max-w-3xl">
              <div className="font-mono text-xs tracking-widest text-emerald-400 uppercase font-semibold">
                {activeSlide.spec}
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {activeSlide.title}
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 font-normal">
                {activeSlide.subtitle}
              </p>

              {/* Direct Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#free-sample"
                  className="px-6 py-3 rounded-full bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <span>Request Atelier Sample Batch</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                  className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Schedule Technical Brief
                </button>
              </div>

              {/* Slide Progress Dots / Thumbnails */}
              <div className="flex items-center gap-2 pt-6">
                {HERO_SLIDES.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    className="group relative flex-1 h-1.5 rounded-full overflow-hidden bg-white/20 transition-all"
                  >
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        i === currentSlide ? 'w-full' : 'w-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNDER-PORTFOLIO VISUAL ILLUSTRATION GRID (MINIMAL TEXT) */}
      <section className="py-12 px-4 sm:px-8 border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header & Category Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">
                PORTFOLIO PROOF REPERTOIRE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                Service Illustrations & Showcase
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {[
                { id: 'all', label: 'All Catalogues' },
                { id: 'jewelry', label: 'Jewelry' },
                { id: 'apparel', label: 'Apparel' },
                { id: 'footwear', label: 'Footwear' },
                { id: 'cosmetics', label: 'Cosmetics' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    activeCategory === cat.id
                      ? 'bg-neutral-900 text-white font-bold shadow-sm'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-medium'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal-Text Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxImg(item.image)}
                className="group relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-neutral-900" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
                  <div className="absolute bottom-4 inset-x-4 text-white">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-blue-300 font-semibold block">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-base mt-0.5">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImg}
              alt="Expanded preview"
              className="max-h-[82vh] w-auto object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

