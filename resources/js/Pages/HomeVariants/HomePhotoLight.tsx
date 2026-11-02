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
  CheckCircle2,
  ShieldCheck,
  Zap,
  Camera,
  Shirt,
  UserCheck,
  Image as ImageIcon,
  ChevronRight,
  Upload
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

const LUXURY_BRANDS = [
  'BALENCIAGA',
  'CARTIER',
  'SSENSE',
  'FARFETCH',
  'KITH',
  'JIL SANDER',
  'ACNE STUDIOS',
  'MONCLER'
];

const LIGHT_CATEGORIES = [
  'All Works',
  'AI Headshots',
  'Fashion Models',
  'Virtual Try-On',
  'Product Scenes',
  'High Jewelry'
] as const;

type LightCategory = (typeof LIGHT_CATEGORIES)[number];

interface LookbookItem {
  id: string;
  category: LightCategory;
  title: string;
  client: string;
  turnaround: string;
  beforeImg: string;
  afterImg: string;
  beforeLabel: string;
  afterLabel: string;
  accentTag: string;
  specs: string[];
}

const LOOKBOOK_WORKS: LookbookItem[] = [
  {
    id: 'lb-1',
    category: 'Fashion Models',
    title: 'Ghost Mannequin Cutout to Runway Living Model',
    client: 'Acne Studios Catalog',
    turnaround: '2-Hour Batch Pipeline',
    beforeImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    beforeLabel: 'Raw Studio Mannequin',
    afterLabel: 'Living Model Editorial',
    accentTag: 'S2 • APPAREL',
    specs: ['Zero model booking overhead', 'Organic fabric fold dynamics', '3 Body diversity presets']
  },
  {
    id: 'lb-2',
    category: 'AI Headshots',
    title: 'Phone Selfies to Branded Executive Portraits',
    client: 'Fintech Leadership (120 Seats)',
    turnaround: 'Same-Day Delivery',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Casual Phone Capture',
    afterLabel: 'Executive Studio Portrait',
    accentTag: 'S1 • HEADSHOTS',
    specs: ['Unified company lighting', 'Custom branded backdrop', 'Tailored business wardrobe']
  },
  {
    id: 'lb-3',
    category: 'Product Scenes',
    title: 'Raw Bottle Cutout to Architectural Sunlit Pedestal',
    client: 'Maison Francis Kurkdjian',
    turnaround: '4-Hour Express Ingest',
    beforeImg: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Plain Studio Isolation',
    afterLabel: 'Natural Morning Sun Scene',
    accentTag: 'S4 • SCENE GEN',
    specs: ['Raytraced contact shadows', 'Caustic glass refraction', 'Shopify & Amazon ready']
  },
  {
    id: 'lb-4',
    category: 'Virtual Try-On',
    title: 'Ghost Garment to Photorealistic Model Stretch Fit',
    client: 'SSENSE Menswear',
    turnaround: 'Real-Time Render Pipeline',
    beforeImg: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Flat SKU Garment',
    afterLabel: 'Anatomical Model Fit',
    accentTag: 'S3 • TRY-ON',
    specs: ['Seam & wrinkle alignment', 'Accurate fabric tension', '4K marketplace export']
  },
  {
    id: 'lb-5',
    category: 'High Jewelry',
    title: 'Diamond Micro-Dust Ablation & Specular Facets',
    client: 'Cartier Fine Timepieces',
    turnaround: '12-Hour Master SLA',
    beforeImg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Macro RAW Unretouched',
    afterLabel: 'Specular Master Polish',
    accentTag: 'S5 • JEWELRY',
    specs: ['±0.25px vector mask', 'Micro-dust removal', 'Brushed metal retention']
  },
  {
    id: 'lb-6',
    category: 'Product Scenes',
    title: 'Performance Sneaker Multi-Path Dynamic Shadow',
    client: 'Nike Global Catalog',
    turnaround: '6-Hour Rush SLA',
    beforeImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
    beforeLabel: 'Raw Product Plate',
    afterLabel: 'Dynamic Ground Shadow',
    accentTag: 'S4 • FOOTWEAR',
    specs: ['Hand-drawn pen paths', 'Multi-layer PSD alpha', '300% zoom edge accuracy']
  }
];

export function HomePhotoLight({ clients = [] }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState<LightCategory>('All Works');
  const [peekRawId, setPeekRawId] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<LookbookItem | null>(null);
  const [modalSplit, setModalSplit] = useState(50);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const filteredWorks =
    activeCategory === 'All Works'
      ? LOOKBOOK_WORKS
      : LOOKBOOK_WORKS.filter((w) => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111215] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Top Studio Bar */}
      <div className="border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wide text-neutral-800">
              Studio Visual Lookbook:
            </span>
            <span className="text-neutral-500 hidden sm:inline">Photo-Based Retouching & AI Synthesis Archive</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-500">
            <span>2.4M+ ASSETS DELIVERED</span>
            <span className="text-[#de4a2c] font-bold">12H SLA</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          HERO SECTION: CLEAN LIGHT PHOTO-FIRST SHOWCASE
      ========================================================= */}
      <section className="pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-800 shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#de4a2c]" />
            <span className="font-mono tracking-wider uppercase">CLEAN LIGHT LOOKBOOK</span>
            <span className="text-neutral-300">•</span>
            <span className="text-[#de4a2c]">REAL PRODUCTION PROOF</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#111215] leading-[1.08]">
            E-Commerce Imagery{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] to-[#c2381c]">
              Perfected at Scale
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Browse real catalog transformations. Inspect raw files against high-fashion AI models, corporate headshots, and luxury jewelry polish.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#lookbook-grid"
              className="px-7 py-3.5 rounded-full bg-[#111215] hover:bg-[#de4a2c] text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore Photo Lookbook</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#test-sample"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-[#111215] font-bold text-sm transition-all border border-neutral-200 shadow-xs"
            >
              Test 3 Images Free
            </a>
          </div>
        </div>

        {/* Category Filter Pills (Light Luxe Style) */}
        <div id="lookbook-grid" className="pt-6 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {LIGHT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeCategory === cat
                  ? 'bg-[#111215] text-white shadow-md font-extrabold scale-102'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 hover:bg-neutral-50 shadow-xs'
              }`}
            >
              <span>{cat}</span>
              {cat !== 'All Works' && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                  {LOOKBOOK_WORKS.filter((w) => w.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================
          LIGHT PHOTO GALLERY: 3-COL CLEAN MASONRY CARDS
      ========================================================= */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredWorks.map((item) => {
            const isPeeking = peekRawId === item.id;

            return (
              <div
                key={item.id}
                className="group rounded-3xl overflow-hidden border border-neutral-200/90 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Stage */}
                <div className="relative h-[360px] sm:h-[400px] w-full overflow-hidden select-none bg-neutral-100">
                  {/* Master Deliverable Image */}
                  <img
                    src={item.afterImg}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />

                  {/* Overlaid Raw Input (Triggered on hold) */}
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
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                      {item.beforeLabel}
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-extrabold text-neutral-800 border border-neutral-200 shadow-xs">
                      {item.accentTag}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-extrabold">
                      {item.turnaround}
                    </span>
                  </div>

                  {/* Peek Controls & Maximize Trigger */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onMouseDown={() => setPeekRawId(item.id)}
                      onMouseUp={() => setPeekRawId(null)}
                      onTouchStart={() => setPeekRawId(item.id)}
                      onTouchEnd={() => setPeekRawId(null)}
                      className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-[#de4a2c] hover:text-white text-neutral-900 text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 transition-colors shadow-md border border-neutral-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isPeeking ? 'Showing Raw Input' : 'Hold to Peek Raw'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalItem(item);
                        setModalSplit(50);
                      }}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-[#de4a2c] text-neutral-900 hover:text-white flex items-center justify-center transition-colors shadow-md border border-neutral-200"
                      title="Inspect interactive split slider"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-6 bg-white border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1.5">
                    <span>Client: <strong className="text-neutral-800">{item.client}</strong></span>
                    <span className="text-[#de4a2c] font-bold">100% Studio QA</span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#de4a2c] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Specs Pill Strip */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {item.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] text-neutral-600 font-medium"
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
          CLIENT MARQUEE STRIP
      ========================================================= */}
      <section className="py-10 border-y border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
            Enterprise Post-Production Partner to Global Luxury Brands
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 sm:gap-14 flex-wrap text-neutral-400 font-mono font-bold text-xs uppercase tracking-widest">
          {(clients.length > 0 ? clients.map((c) => c.name) : LUXURY_BRANDS).slice(0, 8).map((b, i) => (
            <span key={i} className="hover:text-neutral-900 transition-colors">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* =========================================================
          LIGHT TEST DRIVE DROPZONE SECTION
      ========================================================= */}
      <section id="test-sample" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[36px] p-8 sm:p-14 bg-white border border-neutral-200/90 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#de4a2c]/10 text-[#de4a2c] text-xs font-mono font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMPLIMENTARY CATALOG PILOT</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#111215] leading-tight">
                Test 3 Product Images or Selfies Free
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                Send us your unedited camera RAW, mannequin shots, or casual team selfies. We return production-ready assets with vector paths or AI scene environments in hours.
              </p>
              <div className="flex items-center gap-6 pt-2 text-xs text-neutral-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Strict NDA Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#de4a2c]" />
                  <span>Same-Day 12H SLA</span>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-6">
              {!formSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  className="space-y-4 p-6 sm:p-8 rounded-3xl bg-[#FBFBFA] border border-neutral-200 shadow-sm"
                >
                  <div className="border-2 border-dashed border-neutral-300 hover:border-[#de4a2c] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white">
                    <Upload className="w-8 h-8 text-[#de4a2c] mx-auto mb-2" />
                    <div className="text-sm font-bold text-neutral-800">
                      Drop 1–3 RAW images or selfies here
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      PSD, TIFF, CR3, JPG or PNG • Up to 50MB
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Brand or Studio Name"
                      className="px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#de4a2c]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Work Email Address"
                      className="px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#de4a2c]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold text-sm tracking-wide transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Free Sample Batch</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center rounded-3xl bg-emerald-50 border border-emerald-200 text-neutral-900 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold">Sample Request Received</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                    Our lead retoucher is processing your sample assets. Master files will be transmitted to your email within our 12-hour SLA.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs font-bold text-[#de4a2c] underline pt-2 inline-block cursor-pointer"
                  >
                    Upload another batch
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          LIGHTBOX MODAL (SPLIT SLIDER)
      ========================================================= */}
      {modalItem && (
        <div
          onClick={() => setModalItem(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full rounded-3xl overflow-hidden bg-white shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <span className="text-xs font-mono font-bold text-[#de4a2c] uppercase">
                  {modalItem.accentTag} // LOOKBOOK CASE STUDY
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 mt-0.5">
                  {modalItem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="w-10 h-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 flex items-center justify-center transition-colors border border-neutral-200 shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Slider Canvas */}
            <div className="relative h-[420px] sm:h-[520px] w-full select-none cursor-ew-resize bg-neutral-900 overflow-hidden">
              <img
                src={modalItem.afterImg}
                alt="Edited"
                className="w-full h-full object-cover"
              />

              {/* Clipped Before */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - modalSplit}% 0 0)` }}
              >
                <img
                  src={modalItem.beforeImg}
                  alt="Raw"
                  className="w-full h-full object-cover filter brightness-90"
                />
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold">
                  {modalItem.beforeLabel}
                </span>
              </div>

              {/* Split Bar */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                style={{ left: `${modalSplit}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#de4a2c] text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-xl flex items-center gap-1 border border-white">
                  <span>RAW</span>
                  <span className="opacity-40">|</span>
                  <span>EDITED</span>
                </div>
              </div>

              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#de4a2c] text-white text-xs font-mono font-bold shadow-md">
                {modalItem.afterLabel}
              </span>
            </div>

            {/* Modal Bottom Drag Control */}
            <div className="p-4 sm:p-6 bg-white border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-neutral-500 font-bold">Drag slider to compare:</span>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={modalSplit}
                  onChange={(e) => setModalSplit(Number(e.target.value))}
                  className="accent-[#de4a2c] cursor-pointer w-44 h-2 bg-neutral-200 rounded-lg"
                />
              </div>

              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="px-4 py-2 rounded-xl bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

