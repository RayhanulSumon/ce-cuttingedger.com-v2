import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  Sparkles,
  ArrowUpRight,
  Maximize2,
  X,
  Layers,
  CheckCircle2,
  Filter,
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

const GALLERY_WALL = [
  {
    id: 1,
    title: 'Monochrome Editorial Gown',
    cat: 'Apparel',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    span: 'col-span-1 md:col-span-2 row-span-2 h-[480px]'
  },
  {
    id: 2,
    title: 'Bespoke Diamond Solitaire',
    cat: 'Jewelry',
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
    span: 'col-span-1 h-[230px]'
  },
  {
    id: 3,
    title: 'Minimalist Titanium Watch',
    cat: 'Timepiece',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85',
    span: 'col-span-1 h-[230px]'
  },
  {
    id: 4,
    title: 'Handcrafted Suede Loafer',
    cat: 'Footwear',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85',
    span: 'col-span-1 h-[230px]'
  },
  {
    id: 5,
    title: 'Artisan Glass Flacon',
    cat: 'Cosmetics',
    img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85',
    span: 'col-span-1 h-[230px]'
  },
  {
    id: 6,
    title: 'Calfskin Minimalist Tote',
    cat: 'Leather',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    span: 'col-span-1 md:col-span-2 h-[320px]'
  },
  {
    id: 7,
    title: 'Streetwear Runner Sole',
    cat: 'Footwear',
    img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85',
    span: 'col-span-1 md:col-span-2 h-[320px]'
  }
];

export const VariantVisualWall: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filteredItems =
    activeFilter === 'All'
      ? GALLERY_WALL
      : GALLERY_WALL.filter((item) => item.cat === activeFilter);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1D] antialiased selection:bg-[#1F1E1D] selection:text-[#FAF8F5] pb-32">
      {/* Top Banner Ticker */}
      <div className="border-b border-[#E8E4DD] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#1F1E1D] bg-[#E8E4DD] px-2.5 py-0.5 rounded">
              09 // MINIMALIST VISUAL WALL
            </span>
            <span className="text-[#D3CECE]">/</span>
            <span className="font-semibold text-[#1F1E1D] truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </span>
          </div>
          <div className="flex items-center gap-3 text-stone-500">
            <span className="hidden sm:inline">EXHIBITION CANVAS</span>
            <span className="font-bold text-[#1F1E1D]">CURATED ATELIER</span>
          </div>
        </div>
      </div>

      {/* 1. VISUAL WALL HERO BANNER */}
      <section className="pt-8 sm:pt-12 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#E8E4DD]">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500 font-bold block">
                VISUAL ESSENCE // NO. 09
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-[#1F1E1D] leading-tight">
                {service.h1_title || service.title}
              </h1>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {['All', 'Apparel', 'Jewelry', 'Timepiece', 'Footwear', 'Leather'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    activeFilter === cat
                      ? 'bg-[#1F1E1D] text-[#FAF8F5] font-bold shadow-sm'
                      : 'bg-[#EFECE6] hover:bg-[#E8E4DD] text-stone-700 font-medium'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Curated Visual Wall Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxImg(item.img)}
                className={`group relative rounded-3xl overflow-hidden bg-[#EFECE6] border border-[#E8E4DD] cursor-pointer hover:shadow-xl transition-all duration-500 ${item.span}`}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1F1E1D]/80 backdrop-blur-md text-[#FAF8F5] font-mono text-[10px] font-bold uppercase tracking-wider">
                  {item.cat}
                </div>
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-[#1F1E1D]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E1D]/80 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
                <div className="absolute bottom-5 inset-x-5 text-[#FAF8F5]">
                  <h3 className="font-serif text-lg sm:text-xl font-bold">{item.title}</h3>
                  <div className="font-mono text-[10px] text-stone-300 mt-1 uppercase tracking-widest">
                    300 DPI // 100% Vector Pen Mask
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Strip */}
          <div className="p-6 rounded-3xl bg-[#EFECE6] border border-[#E8E4DD] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="font-bold text-[#1F1E1D]">
                Unlimited fine-tuned revisions included with all enterprise batches.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#free-sample"
                className="px-6 py-3 rounded-full bg-[#1F1E1D] hover:bg-neutral-800 text-[#FAF8F5] font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Request Sample Batch</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-[#1F1E1D]/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1F1E1D] text-white flex items-center justify-center"
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

