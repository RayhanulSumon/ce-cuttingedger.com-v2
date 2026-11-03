import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  Sparkles,
  ArrowUpRight,
  Layers,
  Box,
  Eye,
  CheckCircle2,
  Maximize2,
  X,
  Compass,
  Zap,
  Rotate3d
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

const PERSPECTIVE_GALLERY = [
  {
    id: 1,
    title: 'Monochrome Designer Sneaker',
    category: 'Spatial Sole Isolation',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    depth: '4-Layer Stack'
  },
  {
    id: 2,
    title: 'Swiss Titanium Chrono',
    category: 'Multi-Facet Separation',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    depth: 'Precision Nodes'
  },
  {
    id: 3,
    title: 'Bespoke Cashmere Coat',
    category: 'Contour Drape Masking',
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
    depth: 'Alpha Blended'
  },
  {
    id: 4,
    title: 'Sculptural Perfume Bottle',
    category: 'Liquid Boundary Cutout',
    img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
    depth: 'Refraction Preserved'
  }
];

export const VariantPerspective3D: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [isExploded, setIsExploded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const heroCutoutImg =
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 24;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-slate-900 antialiased selection:bg-slate-900 selection:text-white pb-32">
      {/* Top Banner Ticker */}
      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-600">
          <div className="flex items-center gap-3">
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
              08 // 3D PERSPECTIVE GALLERY
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">SPATIAL LAYER EXPLODER</span>
            <span className="font-bold text-slate-900">4-LAYER STACK</span>
          </div>
        </div>
      </div>

      {/* 1. 3D SPATIAL HERO BANNER */}
      <section className="pt-8 sm:pt-12 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block mb-1">
                SPATIAL LAYER ANATOMY
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {service.h1_title || service.title}
              </h1>
            </div>

            {/* Explode Toggle Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsExploded(!isExploded)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-sm ${
                  isExploded
                    ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                    : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Rotate3d className="w-4 h-4" />
                <span>{isExploded ? 'Collapse 3D Stack' : 'Explode 3D Layers'}</span>
              </button>
              <a
                href="#free-sample"
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>Sample Batch</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 3D Interactive Stage */}
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-white to-slate-100 border border-slate-200 shadow-xl overflow-hidden min-h-[480px] sm:min-h-[560px] flex items-center justify-center select-none"
            style={{ perspective: '1200px' }}
          >
            {/* Background 3D Perspective Grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: `rotateX(60deg) scale(1.5) translate(${tilt.x}px, ${tilt.y}px)`
              }}
            />

            {/* 3D Layer Stack Container */}
            <div
              className="relative w-72 sm:w-96 h-80 sm:h-96 transition-transform duration-300 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${tilt.x + (isExploded ? 20 : 0)}deg) rotateX(${
                  -tilt.y + (isExploded ? 15 : 0)
                }deg)`
              }}
            >
              {/* Layer 1: Background Plate / Raw Photo */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shadow-lg transition-all duration-700"
                style={{
                  transform: isExploded ? 'translateZ(-140px)' : 'translateZ(0px)',
                  opacity: isExploded ? 0.7 : 0
                }}
              >
                <img
                  src={heroCutoutImg}
                  alt="Raw Studio Plate"
                  className="w-full h-full object-cover filter brightness-90 grayscale"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[9px] font-bold">
                  LAYER 01: RAW CAPTURE
                </div>
              </div>

              {/* Layer 2: Vector Path Wireframe Layer */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-indigo-500/80 bg-indigo-50/20 backdrop-blur-[2px] transition-all duration-700 flex items-center justify-center"
                style={{
                  transform: isExploded ? 'translateZ(-40px)' : 'translateZ(0px)',
                  opacity: isExploded ? 0.9 : 0
                }}
              >
                <div className="font-mono text-xs text-indigo-700 font-bold bg-white/90 px-3 py-1 rounded-full shadow-sm">
                  LAYER 02: 100% BEZIER VECTOR PATH
                </div>
              </div>

              {/* Layer 3: Contact Shadow Plate */}
              <div
                className="absolute inset-0 rounded-2xl transition-all duration-700"
                style={{
                  transform: isExploded ? 'translateZ(40px)' : 'translateZ(0px)',
                  opacity: isExploded ? 0.8 : 1
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-4/5 h-16 bg-slate-900/30 rounded-full blur-xl translate-y-24" />
                </div>
              </div>

              {/* Layer 4: Final Vector Cutout Plate */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden transition-all duration-700 flex items-center justify-center"
                style={{
                  transform: isExploded ? 'translateZ(120px)' : 'translateZ(20px)'
                }}
              >
                <img
                  src={heroCutoutImg}
                  alt={service.title}
                  className="max-h-full max-w-full object-contain drop-shadow-2xl"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold shadow-md">
                  LAYER 04: STUDIO MASTER
                </div>
              </div>
            </div>

            {/* Bottom Helper Info */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs font-mono text-slate-500 pointer-events-none">
              <span className="hidden sm:inline">MOVE CURSOR TO TILT SPATIAL PERSPECTIVE</span>
              <span className="text-indigo-600 font-bold">CLICK "EXPLODE 3D LAYERS" TO INSPECT ANATOMY</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNDER-PORTFOLIO VISUAL GALLERY */}
      <section className="py-12 px-4 sm:px-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-indigo-600 font-bold block mb-1">
                SPATIAL PROOF GALLERY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Curated Commercial Asset Catalog
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-500">
              EXPLODED MULTI-PLANE ISOLATIONS
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERSPECTIVE_GALLERY.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxImg(item.img)}
                className="group relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-slate-900" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-4 inset-x-4 text-white">
                    <span className="font-mono text-[10px] uppercase text-indigo-300 font-semibold block">
                      {item.depth}
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
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center"
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

