import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  Sparkles,
  ArrowUpRight,
  Layers,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  Maximize2,
  X,
  PenTool,
  Sun,
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

const SPLIT_PORTFOLIO = [
  {
    id: 1,
    title: 'Monochrome Designer Sneaker',
    category: 'Tread & Eyelet Separation',
    img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
    stat: '142 Vector Nodes'
  },
  {
    id: 2,
    title: 'Haute Joaillerie Diamond Ring',
    category: 'Facet Reflection Isolation',
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    stat: 'Prong Zero Halo'
  },
  {
    id: 3,
    title: 'Hand-Stitched Suede Oxford',
    category: 'Organic Leather Texture',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
    stat: 'Cast Contact Shadow'
  },
  {
    id: 4,
    title: 'Minimalist Acetate Sunglasses',
    category: 'Lens Alpha Blending',
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
    stat: 'Transparent Gradient'
  }
];

export const VariantSplitCanvas: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [splitPos, setSplitPos] = useState(50);
  const [showPenOverlay, setShowPenOverlay] = useState(true);
  const [activeShadow, setActiveShadow] = useState(true);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const heroImage =
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85';

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 antialiased selection:bg-gray-900 selection:text-white pb-32">
      {/* Top Banner Ticker */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-wider text-gray-600">
          <div className="flex items-center gap-3">
            <span className="font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
              07 // INTERACTIVE SPLIT CANVAS
            </span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">LIVE COMPARISON WORKBENCH</span>
            <span className="font-bold text-gray-900">0.1px RESOLUTION</span>
          </div>
        </div>
      </div>

      {/* 1. SPLIT COMPARISON HERO BANNER */}
      <section className="pt-8 sm:pt-12 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-teal-600 font-bold block mb-1">
                VECTOR INSPECTION WORKBENCH
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                {service.h1_title || service.title}
              </h1>
            </div>

            {/* Precision Controls */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-gray-200 shadow-sm text-xs font-mono">
              <button
                type="button"
                onClick={() => setShowPenOverlay(!showPenOverlay)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  showPenOverlay
                    ? 'bg-teal-600 text-white font-bold shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Vector Nodes: {showPenOverlay ? 'ON' : 'OFF'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveShadow(!activeShadow)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeShadow
                    ? 'bg-gray-900 text-white font-bold shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Contact Shadow</span>
              </button>
            </div>
          </div>

          {/* Interactive Split Screen Stage */}
          <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-xl h-[460px] sm:h-[540px] select-none">
            {/* Underlying Right Plate: Hand-drawn Vector Cutout on pure transparent/studio background */}
            <div className="absolute inset-0 bg-[#F4F4F6] flex items-center justify-center">
              {/* Checkerboard Pattern */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    'repeating-conic-gradient(#cbd5e1 0% 25%, #f8fafc 0% 50%) 50% / 20px 20px'
                }}
              />
              <img
                src={heroImage}
                alt="Clean Vector Cutout"
                className={`w-full h-full object-cover relative z-10 transition-all ${
                  activeShadow ? 'drop-shadow-[0_25px_30px_rgba(0,0,0,0.25)]' : ''
                }`}
              />

              {/* Animated Vector Pen Nodes Overlay */}
              {showPenOverlay && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <svg className="w-full h-full">
                    {/* Simulated Bezier Line */}
                    <path
                      d="M 200,100 C 400,150 450,350 350,480"
                      fill="none"
                      stroke="#0D9488"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <circle cx="200" cy="100" r="4" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="350" cy="480" r="4" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-teal-900/80 backdrop-blur-md text-teal-200 font-mono text-[10px] font-bold">
                    VECTOR PATH ACTIVE: 100% BEZIER
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-gray-900/80 backdrop-blur-md text-white font-mono text-xs font-bold">
                STUDIO VECTOR PLATE
              </div>
            </div>

            {/* Overlying Left Plate: Raw Capture */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)` }}
            >
              <img
                src={heroImage}
                alt="Raw E-commerce capture"
                className="w-full h-full object-cover filter contrast-90 brightness-95"
              />
              <div className="absolute bottom-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-gray-900 font-mono text-xs font-bold border border-gray-200">
                RAW CAPTURE
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              style={{ left: `${splitPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xl border-2 border-white text-xs font-bold">
                ↔
              </div>
            </div>

            {/* Native Range Slider Overlay */}
            <input
              type="range"
              min="5"
              max="95"
              value={splitPos}
              onChange={(e) => setSplitPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
            />
          </div>

          {/* Quick Action Bar under Split Stage */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-gray-600">Drag center handle to inspect edge sharpness</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#free-sample"
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>Request Sample Batch</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNDER-PORTFOLIO VISUAL GALLERY */}
      <section className="py-12 px-4 sm:px-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold block mb-1">
                EDGE INTEGRITY PROOF
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Studio Turnaround Archive
              </h2>
            </div>
            <div className="text-xs font-mono text-gray-500">
              SUB-PIXEL VECTOR MASKING ON ALL COMMERCE VERTICALS
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPLIT_PORTFOLIO.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxImg(item.img)}
                className="group relative rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-gray-900" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-4 inset-x-4 text-white">
                    <span className="font-mono text-[10px] uppercase text-teal-300 font-semibold block">
                      {item.stat}
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
          className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center"
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

