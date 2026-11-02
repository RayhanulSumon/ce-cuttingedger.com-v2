import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Maximize2,
  X,
  Eye,
  SlidersHorizontal,
  Layers,
  Camera,
  Shirt,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Filter
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

const CATEGORIES = [
  'All Works',
  'AI Headshots',
  'Fashion Models',
  'Virtual Try-On',
  'Product Scenes',
  'High Jewelry'
] as const;

type Category = (typeof CATEGORIES)[number];

interface PortfolioItem {
  id: string;
  category: Category;
  title: string;
  client: string;
  turnaround: string;
  aspect: string; // for masonry
  beforeImg: string;
  afterImg: string;
  beforeLabel: string;
  afterLabel: string;
  specs: string[];
}

const PORTFOLIO_WORKS: PortfolioItem[] = [
  {
    id: 'work-1',
    category: 'Fashion Models',
    title: 'Ghost Mannequin to Catwalk Living Model',
    client: 'Acne Studios Catalog',
    turnaround: 'Instant Multi-Angle Batch',
    aspect: 'row-span-2 col-span-1 h-[560px]',
    beforeImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    beforeLabel: 'Raw Studio Mannequin',
    afterLabel: 'Living Model Editorial',
    specs: ['Zero model booking fees', 'Full drape preservation', 'Natural stride motion']
  },
  {
    id: 'work-2',
    category: 'AI Headshots',
    title: 'Selfies to Executive C-Suite Suite',
    client: 'Fintech Scale-Up (120 Seats)',
    turnaround: '2-Hour Batch Turnaround',
    aspect: 'h-[380px]',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Casual Phone Selfie',
    afterLabel: 'Studio Executive Portrait',
    specs: ['Consistent corporate lighting', 'Custom branded backdrop', 'Tailored wardrobe']
  },
  {
    id: 'work-3',
    category: 'Product Scenes',
    title: 'Perfume Extraction & Natural Sunlit Stone Scene',
    client: 'Maison Francis Kurkdjian',
    turnaround: '4-Hour Express Ingest',
    aspect: 'h-[380px]',
    beforeImg: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Plain Studio Isolation',
    afterLabel: 'Generative Sunlight Caustics',
    specs: ['Raytraced contact shadows', 'Caustic glass refraction', '300 DPI PSD']
  },
  {
    id: 'work-4',
    category: 'Virtual Try-On',
    title: 'Outerwear Synthesis & High-Res Try-On Fit',
    client: 'SSENSE Menswear',
    turnaround: 'Real-Time Render Pipeline',
    aspect: 'h-[440px]',
    beforeImg: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Ghost Garment Plate',
    afterLabel: 'Anatomical Model Fit',
    specs: ['Wrinkle & seam alignment', 'Accurate fabric tension', 'Marketplace 4K export']
  },
  {
    id: 'work-5',
    category: 'High Jewelry',
    title: 'Diamond Micro-Dust Polish & Specular Facets',
    client: 'Cartier Fine Timepieces',
    turnaround: '12-Hour Master SLA',
    aspect: 'h-[440px]',
    beforeImg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Macro RAW Unretouched',
    afterLabel: 'Specular Master Finish',
    specs: ['±0.25px vector mask', 'Micro-dust ablation', 'Preserved metal brushed texture']
  },
  {
    id: 'work-6',
    category: 'Product Scenes',
    title: 'Performance Sneaker Floating Studio Composite',
    client: 'Nike Global Catalog',
    turnaround: '6-Hour Rush SLA',
    aspect: 'h-[400px]',
    beforeImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Raw Product Plate',
    afterLabel: 'Dynamic Ground Shadow',
    specs: ['Hand-drawn pen paths', 'Multi-layer PSD alpha', '300% zoom edge accuracy']
  }
];

export function HomePortfolio({ clients = [] }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All Works');
  const [hoveredWorkId, setHoveredWorkId] = useState<string | null>(null);
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const [modalSliderPos, setModalSliderPos] = useState(50);
  const [peekRawWorkId, setPeekRawWorkId] = useState<string | null>(null);

  const filteredWorks =
    activeCategory === 'All Works'
      ? PORTFOLIO_WORKS
      : PORTFOLIO_WORKS.filter((w) => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#07080B] text-white selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Editorial Header */}
      <header className="border-b border-white/10 pt-28 pb-14 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-bold tracking-widest text-[#de4a2c] uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SELECTED ARCHIVE // 2024–2026</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
              Visual Case Studies &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff7354] to-amber-300">
                Client Proof
              </span>
            </h1>
          </div>
          <p className="text-sm text-neutral-400 max-w-md font-normal leading-relaxed">
            Every image is a real before/after proof. Hover any showcase card to peel the AI layer and inspect the unedited raw input.
          </p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="mt-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeCategory === cat
                  ? 'bg-white text-[#07080B] shadow-lg scale-102 font-extrabold'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span>{cat}</span>
              {cat !== 'All Works' && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeCategory === cat ? 'bg-[#07080B] text-white' : 'bg-white/10 text-neutral-400'}`}>
                  {PORTFOLIO_WORKS.filter((w) => w.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* =========================================================
          PORTFOLIO INTERACTIVE MASONRY GALLERY
      ========================================================= */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((item) => {
            const isHovered = hoveredWorkId === item.id;
            const isPeeking = peekRawWorkId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredWorkId(item.id)}
                onMouseLeave={() => setHoveredWorkId(null)}
                className="group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/60 shadow-xl transition-all duration-500 hover:border-[#de4a2c]/60 flex flex-col justify-between"
              >
                {/* Visual Viewport */}
                <div className="relative h-[360px] sm:h-[400px] w-full overflow-hidden select-none bg-black">
                  {/* Master Production Output */}
                  <img
                    src={item.afterImg}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />

                  {/* Overlaid Raw Input (Peeking or Hover) */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isPeeking ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={item.beforeImg}
                      alt={item.beforeLabel}
                      className="w-full h-full object-cover filter brightness-90 contrast-95"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-mono font-black uppercase tracking-wider shadow-lg">
                      {item.beforeLabel}
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-neutral-300 border border-white/10">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                      {item.turnaround}
                    </span>
                  </div>

                  {/* Peek Controls & Maximize Trigger */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onMouseDown={() => setPeekRawWorkId(item.id)}
                      onMouseUp={() => setPeekRawWorkId(null)}
                      onTouchStart={() => setPeekRawWorkId(item.id)}
                      onTouchEnd={() => setPeekRawWorkId(null)}
                      className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-[#de4a2c] text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 transition-colors border border-white/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Hold to Peek Raw</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalItem(item);
                        setModalSliderPos(50);
                      }}
                      className="w-9 h-9 rounded-xl bg-white text-black hover:bg-[#de4a2c] hover:text-white flex items-center justify-center transition-colors shadow-lg"
                      title="Inspect interactive before/after split slider"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-6 bg-gradient-to-b from-transparent to-black/60 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1">
                    <span>Client: <strong className="text-white">{item.client}</strong></span>
                    <span className="text-[#de4a2c] font-bold">Verified Production</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#de4a2c] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Specs Pill Strip */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] text-neutral-300 font-mono"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          INTERACTIVE BEFORE/AFTER LIGHTBOX MODAL
      ========================================================= */}
      {activeModalItem && (
        <div
          onClick={() => setActiveModalItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full rounded-3xl overflow-hidden bg-neutral-900 border border-white/20 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/60">
              <div>
                <span className="text-xs font-mono font-bold text-[#de4a2c] uppercase">
                  {activeModalItem.category} // CASE STUDY
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {activeModalItem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Slider Canvas */}
            <div className="relative h-[420px] sm:h-[520px] w-full select-none cursor-ew-resize bg-black overflow-hidden">
              <img
                src={activeModalItem.afterImg}
                alt="Edited"
                className="w-full h-full object-cover"
              />

              {/* Clipped Before */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - modalSliderPos}% 0 0)` }}
              >
                <img
                  src={activeModalItem.beforeImg}
                  alt="Raw"
                  className="w-full h-full object-cover filter brightness-90"
                />
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold">
                  {activeModalItem.beforeLabel}
                </span>
              </div>

              {/* Split Bar */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                style={{ left: `${modalSliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#de4a2c] text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-xl flex items-center gap-1 border border-white">
                  <span>RAW</span>
                  <span className="opacity-40">|</span>
                  <span>DELIVERABLE</span>
                </div>
              </div>

              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#de4a2c] text-white text-xs font-mono font-bold shadow-md">
                {activeModalItem.afterLabel}
              </span>
            </div>

            {/* Modal Bottom Drag Control */}
            <div className="p-4 sm:p-6 bg-black/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-neutral-400">Drag to compare:</span>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={modalSliderPos}
                  onChange={(e) => setModalSliderPos(Number(e.target.value))}
                  className="accent-[#de4a2c] cursor-pointer w-44 h-2 bg-white/20 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-neutral-400">Turnaround: <strong className="text-white">{activeModalItem.turnaround}</strong></span>
                <a
                  href="#cta"
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold transition-colors"
                >
                  Test This Service Free
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PORTFOLIO TRIAL CTA STRIP
      ========================================================= */}
      <section id="cta" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="rounded-[32px] p-8 sm:p-14 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/15 text-center max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#de4a2c]">
            READY TO SCALE YOUR VISUAL PIPELINE?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Send 3 Images from Your Catalog
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            We will process them through the matching service pipeline and return production PSDs and web assets within 4–12 hours. Zero cost, zero commitment.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold text-sm tracking-wide transition-colors shadow-lg flex items-center gap-2"
            >
              <span>Upload Sample Batch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors border border-white/15"
            >
              View Volume Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

