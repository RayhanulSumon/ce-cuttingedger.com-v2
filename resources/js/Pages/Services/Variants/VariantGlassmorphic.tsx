import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ZoomIn,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Maximize2,
  X,
  Zap,
  Download,
  Calendar
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

const GLASS_GALLERY = [
  {
    id: 1,
    title: 'Haute Horlogerie Timepiece',
    category: 'Multi-Path Metal Reflection',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    zoomDetail: '16-node sub-pixel sapphire crystal bezel isolation',
    tag: '300 DPI'
  },
  {
    id: 2,
    title: 'Silk Organza Trench',
    category: 'Fine Edge Transparency',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    zoomDetail: 'Semi-sheer alpha blending with zero ghosting',
    tag: 'ALPHA'
  },
  {
    id: 3,
    title: 'Handcrafted Italian Loafer',
    category: 'Complex Leather Silhouette',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
    zoomDetail: 'Sole stitch vector tracking & soft ground contact shadow',
    tag: 'STUDIO'
  },
  {
    id: 4,
    title: 'Sculptural Perfume Flacon',
    category: 'Refraction & Glass Cutout',
    img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85',
    zoomDetail: 'Interior liquid boundary preserved through glass',
    tag: 'REFRACT'
  },
  {
    id: 5,
    title: 'Minimalist Diamond Pendant',
    category: 'Micro-Facet Isolation',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    zoomDetail: 'Prong retention vector mask without brilliance drop',
    tag: 'LUXURY'
  },
  {
    id: 6,
    title: 'High-Top Luxury Sneaker',
    category: 'Textured Sole & Laces',
    img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85',
    zoomDetail: 'Deep lace undercut separation for e-comm zoom',
    tag: 'E-COM'
  }
];

export const VariantGlassmorphic: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  // Interactive Magnifier State
  const [isHovered, setIsHovered] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<'cutout' | 'original'>('cutout');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const heroImage =
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=85';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setLensPos({ x, y });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased relative selection:bg-slate-900 selection:text-white pb-28">
      {/* Soft Prismatic Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-sky-200/40 via-indigo-100/30 to-emerald-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[15%] w-[700px] h-[700px] bg-gradient-to-br from-amber-100/40 via-rose-100/20 to-sky-100/30 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10">
        {/* TOP FROSTED STATUS BAR */}
        <div className="border-b border-white/60 bg-white/70 backdrop-blur-xl sticky top-0 z-40 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-600">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 font-semibold border border-sky-500/20">
                <Sparkles className="w-3 h-3 text-sky-500" />
                GLASSMORPHIC ATELIER
              </span>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-slate-800 truncate max-w-[200px] sm:max-w-none">
                {service.title}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span className="hidden sm:inline">0.1px Hand-Drawn Precision</span>
              <span className="font-bold text-slate-900">100% STUDIO ACCREDITED</span>
            </div>
          </div>
        </div>

        {/* 1. GLASSMORPHIC HERO BANNER */}
        <section className="pt-10 sm:pt-16 pb-16 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Banner Header Card */}
            <div className="p-8 sm:p-12 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.06)] relative overflow-hidden mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Visual Summary */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 text-slate-700 text-xs font-mono border border-slate-900/10">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                    IMAGE-FIRST SPECIALIZATION // {service.slug || 'clipping-path'}
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                    {service.h1_title || service.title}
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                    {service.subtitle ||
                      'Zero AI fringing. Hand-rolled Pen Tool vector paths crafted for luxury brands and catalog masters.'}
                  </p>

                  {/* 4 Frosted Spec Pills */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {[
                      { label: 'Pen Tool Accuracy', val: '0.1px Bezier curve' },
                      { label: 'Turnaround Speed', val: '6h to 24h express' },
                      { label: 'Delivery Formats', val: 'PSD • TIFF • Alpha PNG' },
                      { label: 'Revision Guarantee', val: 'Unlimited fine tuning' }
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-white/60 border border-white/90 shadow-sm backdrop-blur-md"
                      >
                        <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                          {spec.label}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                          {spec.val}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <a
                      href="#free-sample"
                      className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-slate-900/15 flex items-center gap-2"
                    >
                      <span>Get Sample Cutout Free</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                      className="px-6 py-3.5 rounded-full bg-white/80 hover:bg-white text-slate-800 font-semibold text-xs tracking-wider uppercase transition-all border border-slate-200 shadow-sm"
                    >
                      Book 15m Consultation
                    </button>
                  </div>
                </div>

                {/* Right Interactive Magnifier Stage */}
                <div className="lg:col-span-6">
                  <div className="relative rounded-3xl p-3 bg-gradient-to-b from-white/90 to-white/50 backdrop-blur-xl border border-white shadow-xl">
                    {/* View mode toggle */}
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setActiveTab('cutout')}
                        className={`px-3 py-1 rounded-full transition-all ${
                          activeTab === 'cutout'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Clean Vector Cutout
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('original')}
                        className={`px-3 py-1 rounded-full transition-all ${
                          activeTab === 'original'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Original Raw Photo
                      </button>
                    </div>

                    {/* Interactive Zoom Lens Notice */}
                    <div className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full bg-sky-500/15 text-sky-800 font-mono text-[10px] tracking-wider border border-sky-400/30 backdrop-blur-md flex items-center gap-1.5">
                      <ZoomIn className="w-3 h-3 text-sky-600" />
                      <span>HOVER FOR 3X VECTOR LOUPE</span>
                    </div>

                    {/* Image Stage Container */}
                    <div
                      ref={containerRef}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onMouseMove={handleMouseMove}
                      className="relative h-[420px] sm:h-[460px] rounded-2xl overflow-hidden cursor-crosshair bg-slate-100 select-none"
                    >
                      {/* Checkerboard Backdrop pattern if in Cutout mode */}
                      {activeTab === 'cutout' && (
                        <div
                          className="absolute inset-0 z-0 opacity-40"
                          style={{
                            backgroundImage:
                              'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                          }}
                        />
                      )}

                      {/* Display Image */}
                      <img
                        src={heroImage}
                        alt={service.title}
                        className={`relative z-10 w-full h-full object-cover transition-opacity duration-300 ${
                          activeTab === 'cutout' ? 'brightness-105' : 'filter'
                        }`}
                      />

                      {/* Floating Loupe / Magnifier Lens */}
                      {isHovered && (
                        <div
                          className="absolute z-30 w-44 h-44 rounded-full border-2 border-white pointer-events-none shadow-2xl backdrop-blur-none overflow-hidden"
                          style={{
                            left: `${lensPos.x}%`,
                            top: `${lensPos.y}%`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 0 4px rgba(15,23,42,0.1), 0 25px 50px -12px rgba(0,0,0,0.35)'
                          }}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage: `url(${heroImage})`,
                              backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                              backgroundSize: '350%',
                              backgroundRepeat: 'no-repeat'
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-3 h-3 rounded-full border border-sky-500/80" />
                          </div>
                          <div className="absolute bottom-2 inset-x-0 text-center font-mono text-[9px] font-bold text-white bg-slate-900/70 py-0.5 tracking-widest">
                            300% VECTOR PATH
                          </div>
                        </div>
                      )}

                      {/* Bottom Image Stats Strip */}
                      <div className="absolute bottom-3 inset-x-3 z-20 px-4 py-2.5 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-slate-800">100% Hand Vector Pen Pass</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">ZOOM: MOVE CURSOR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. UNDER-PORTFOLIO VISUAL ILLUSTRATION GRID (MINIMAL TEXT, HEAVY IMAGE BASE) */}
        <section className="py-12 px-4 sm:px-8 border-t border-slate-200/60 bg-white/40">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-sky-600 font-bold block mb-1">
                  VISUAL PROOF ARCHIVE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Precision Master Gallery
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>TAP ANY CARD TO PREVIEW DETAIL</span>
              </div>
            </div>

            {/* Visual Masonry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {GLASS_GALLERY.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxImg(item.img)}
                  className="group relative rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative h-72 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white font-mono text-[10px] font-bold tracking-wider">
                      {item.tag}
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Maximize2 className="w-4 h-4 text-slate-800" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Card Mini Info */}
                  <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-100">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-sky-600 font-bold">
                      {item.category}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5 group-hover:text-sky-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.zoomDetail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. LIGHTBOX MODAL */}
        {lightboxImg && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={lightboxImg}
                alt="Enlarged view"
                className="max-h-[82vh] w-auto object-contain rounded-2xl mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

