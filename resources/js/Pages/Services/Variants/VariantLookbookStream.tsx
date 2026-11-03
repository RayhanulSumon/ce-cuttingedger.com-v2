import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  Sparkles,
  ArrowUpRight,
  Maximize2,
  X,
  Palette,
  CheckCircle2,
  Layers,
  ChevronDown,
  Eye
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

const SWATCHES = [
  { name: 'Studio White', color: '#FFFFFF', border: '#E2E8F0', dark: true },
  { name: 'Warm Cashmere', color: '#F5F1E9', border: '#E5DFD3', dark: true },
  { name: 'Mineral Sage', color: '#EBF0EC', border: '#D5DFD7', dark: true },
  { name: 'Nordic Slate', color: '#E2E8F0', border: '#CBD5E1', dark: true },
  { name: 'Obsidian Velvet', color: '#18181B', border: '#27272A', dark: false }
];

const LOOKBOOK_ITEMS = [
  {
    id: 1,
    title: 'Architectural Trench Cut',
    category: 'Haute Couture Isolation',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    tag: 'RUNWAY'
  },
  {
    id: 2,
    title: 'Sapphire Solitaire Ring',
    category: 'Micro-Facet Prongs',
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    tag: 'JEWELRY'
  },
  {
    id: 3,
    title: 'Grained Calfskin Satchel',
    category: 'Stitch Contour Vector',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
    tag: 'LEATHER'
  },
  {
    id: 4,
    title: 'Precision Horology Bezel',
    category: 'Multi-Path Reflections',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    tag: 'TIMEPIECE'
  }
];

export const VariantLookbookStream: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [activeSwatch, setActiveSwatch] = useState(SWATCHES[1]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const heroCutoutImg =
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85';

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111113] antialiased selection:bg-[#111113] selection:text-white pb-32">
      {/* Top Banner Ticker */}
      <div className="border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-600">
          <div className="flex items-center gap-3">
            <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
              10 // STUDIO LOOKBOOK STREAM
            </span>
            <span className="text-neutral-300">/</span>
            <span className="font-semibold text-neutral-800 truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">HIGH-FASHION ATELIER</span>
            <span className="font-bold text-neutral-900">PARIS • NYC</span>
          </div>
        </div>
      </div>

      {/* 1. LOOKBOOK RUNWAY HERO SPREAD */}
      <section className="pt-8 sm:pt-12 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="rounded-3xl p-8 sm:p-14 bg-white border border-neutral-200 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Editorial Narrative */}
              <div className="lg:col-span-5 space-y-6">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-rose-600 font-bold block">
                  CAPABILITY ESSAY // NO. 10
                </span>

                <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-[#111113] leading-tight">
                  {service.h1_title || service.title}
                </h1>

                <p className="text-base text-neutral-600 font-sans leading-relaxed">
                  {service.subtitle ||
                    'Master craft vector silhouetting for luxury houses and global editorial fashion portals.'}
                </p>

                {/* Swatch Changer */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-rose-600" />
                      <span>Backdrop Colorway:</span>
                    </span>
                    <span className="font-bold text-neutral-900">{activeSwatch.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {SWATCHES.map((swatch) => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => setActiveSwatch(swatch)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          activeSwatch.name === swatch.name
                            ? 'ring-2 ring-rose-500 scale-110 shadow-sm'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: swatch.color,
                          borderColor: swatch.border
                        }}
                        title={swatch.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#free-sample"
                    className="px-6 py-3.5 rounded-full bg-[#111113] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span>Request Lookbook Batch</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                    className="px-6 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs uppercase tracking-wider transition-all border border-neutral-300"
                  >
                    Atelier Booking
                  </button>
                </div>
              </div>

              {/* Right Live Render Stage */}
              <div className="lg:col-span-7">
                <div
                  className="relative rounded-3xl h-[420px] sm:h-[480px] p-6 flex items-center justify-center border border-neutral-200 shadow-xl transition-colors duration-500 overflow-hidden"
                  style={{
                    backgroundColor: activeSwatch.color
                  }}
                >
                  <img
                    src={heroCutoutImg}
                    alt={service.title}
                    className="max-h-[85%] max-w-[85%] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-neutral-900 font-mono text-[10px] font-bold border border-neutral-200">
                    LIVE COLORWAY RENDER
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-[#111113]/80 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                    300 DPI // ZERO HALO
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNDER-PORTFOLIO VISUAL GALLERY */}
      <section className="py-12 px-4 sm:px-8 border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-rose-600 font-bold block mb-1">
                EDITORIAL LOOKBOOK PROOF
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 tracking-tight">
                Luxury Fashion & Catalog Repertoire
              </h2>
            </div>
            <div className="text-xs font-mono text-neutral-500">
              ACCURACY GUARANTEE • 12H TURNAROUND
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOOKBOOK_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxImg(item.img)}
                className="group relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-neutral-900" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-4 inset-x-4 text-white">
                    <span className="font-mono text-[10px] uppercase text-rose-300 font-semibold block">
                      {item.tag}
                    </span>
                    <h3 className="font-bold text-sm mt-0.5">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-[#111113]/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#111113] text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImg}
              alt="Preview"
              className="max-h-[82vh] w-auto object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

