import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  Shirt,
  User,
  Zap,
  RotateCcw,
  Maximize2,
  Check,
  RefreshCw,
  Layers,
  ScanLine
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

interface ModelProfile {
  id: string;
  name: string;
  ethnicity: string;
  height: string;
  size: string;
  avatar: string;
}

interface GarmentOption {
  id: string;
  name: string;
  type: string;
  fabric: string;
  flatImage: string;
  // Maps modelId -> on-model fitted try-on image
  renders: Record<string, string>;
  specs: {
    drapeScore: string;
    seamAccuracy: string;
  };
}

const MODELS: ModelProfile[] = [
  {
    id: 'maya',
    name: 'Maya V.',
    ethnicity: 'Scandinavian / Editorial',
    height: "5'11\" (180 cm)",
    size: 'Size Small',
    avatar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'amara',
    name: 'Amara K.',
    ethnicity: 'African / High Runway',
    height: "6'0\" (183 cm)",
    size: 'Size Medium',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'kenji',
    name: 'Kenji S.',
    ethnicity: 'East Asian / Streetwear',
    height: "6'1\" (185 cm)",
    size: 'Size Large',
    avatar: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80'
  }
];

const GARMENTS: GarmentOption[] = [
  {
    id: 'knit',
    name: 'Terracotta Ribbed Knit',
    type: 'Knitwear / 100% Merino',
    fabric: 'Heavy 7-Gauge Ribbed Wool',
    flatImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80',
    renders: {
      maya: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      amara: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      kenji: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85'
    },
    specs: {
      drapeScore: '99.4% physics match',
      seamAccuracy: 'Sub-millimeter collar & wrist ribs'
    }
  },
  {
    id: 'hoodie',
    name: 'Mineral Washed Hoodie',
    type: 'Streetwear / 420 GSM',
    fabric: 'Heavy Organic Loopback Cotton',
    flatImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80',
    renders: {
      maya: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
      amara: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
      kenji: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85'
    },
    specs: {
      drapeScore: '98.9% realistic slouch',
      seamAccuracy: 'Double-needle pouch & raglan shoulders'
    }
  },
  {
    id: 'trench',
    name: 'Desert Gabardine Trench',
    type: 'Outerwear / Atelier',
    fabric: 'Waterproof Cotton Gabardine',
    flatImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=80',
    renders: {
      maya: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      amara: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      kenji: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85'
    },
    specs: {
      drapeScore: '99.7% lapel physics',
      seamAccuracy: 'Horn button & shoulder epaulettes'
    }
  },
  {
    id: 'chore',
    name: 'Sage Canvas Chore Coat',
    type: 'Workwear / Heavy Canvas',
    fabric: '12oz Washed Duck Cotton',
    flatImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80',
    renders: {
      maya: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      amara: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      kenji: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85'
    },
    specs: {
      drapeScore: '99.1% canvas crease realism',
      seamAccuracy: 'Triple-needle felled stitching'
    }
  },
  {
    id: 'tee',
    name: 'Boxy Heavyweight Tee',
    type: 'Tops / 280 GSM',
    fabric: 'Combed Ring-Spun Cotton',
    flatImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
    renders: {
      maya: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      amara: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
      kenji: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85'
    },
    specs: {
      drapeScore: '98.8% dropped shoulder fit',
      seamAccuracy: 'Tight 1" ribbed collar & blind hems'
    }
  }
];

export function HomeOmniStudio({ clients = [] }: HomeProps) {
  const [selectedModelId, setSelectedModelId] = useState('maya');
  const [selectedGarmentId, setSelectedGarmentId] = useState('knit');
  const [sliderPosition, setSliderPosition] = useState(65); // Check by slide position
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showStatusToast, setShowStatusToast] = useState(false);

  const activeModel = MODELS.find(m => m.id === selectedModelId) || MODELS[0];
  const activeGarment = GARMENTS.find(g => g.id === selectedGarmentId) || GARMENTS[0];

  // Current on-model image render
  const currentRenderImage = activeGarment.renders[selectedModelId] || activeGarment.renders['maya'];

  // Handle dress selection with smooth animation
  const handleSelectGarment = (garmentId: string) => {
    if (garmentId === selectedGarmentId) return;
    setIsSynthesizing(true);
    setShowStatusToast(true);
    setSelectedGarmentId(garmentId);

    // Animation duration for smooth synthetic draping
    setTimeout(() => {
      setIsSynthesizing(false);
    }, 450);

    setTimeout(() => {
      setShowStatusToast(false);
    }, 2800);
  };

  // Handle model selection
  const handleSelectModel = (modelId: string) => {
    if (modelId === selectedModelId) return;
    setIsSynthesizing(true);
    setSelectedModelId(modelId);
    setTimeout(() => {
      setIsSynthesizing(false);
    }, 400);
  };

  // Handle slider drag
  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#111318] selection:bg-black selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Subtle Live Toast when a dress is dynamically set */}
      {showStatusToast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#111318]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2.5 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span className="font-bold">Synthetic Drape Applied:</span>
            <span className="text-neutral-300">{activeGarment.name} on {activeModel.name}</span>
          </div>
        </div>
      )}

      {/* Minimal Studio Top Bar */}
      <header className="border-b border-black/[0.06] bg-white/70 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#de4a2c]" />
          <span className="font-display text-base font-bold tracking-tight text-neutral-900">
            CUTTING EDGER
          </span>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            S3 Virtual Try-On Studio
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="hidden sm:inline text-neutral-400">
            Physical Photoshoot Cost: <strong className="text-neutral-900 line-through">$8,500</strong> $\rightarrow$ <strong className="text-[#10b981]">$0</strong>
          </span>
          <Link
            href="/#free-sample"
            className="px-3 py-1.5 rounded-full bg-black hover:bg-[#de4a2c] text-white font-bold transition-colors flex items-center gap-1.5"
          >
            <span>Test Your SKUs Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* CORE FOCUSED VIRTUAL TRY-ON STUDIO HERO */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        
        {/* Studio Header: Minimal & Clear */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-black/5 text-[11px] font-mono text-neutral-600 mb-3">
            <Sparkles className="w-3 h-3 text-[#de4a2c]" />
            <span>Interactive Fitting Room</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-800 font-bold">Pick Model & Dress</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 leading-none">
            Virtual Try-On.
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-neutral-600 font-sans">
            Select a model. Pick any dress. Watch the garment smoothly set and drape onto the body in 4K resolution.
          </p>
        </div>

        {/* 3-COLUMN PURE FOCUS INTERACTIVE STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          
          {/* COLUMN 1: SELECT MODEL (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between px-1 text-xs font-mono text-neutral-500 uppercase tracking-wider font-bold">
              <span>1. Choose Model</span>
              <span>{MODELS.length} Castings</span>
            </div>

            <div className="space-y-2.5">
              {MODELS.map((model) => {
                const isSelected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    onClick={() => handleSelectModel(model.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 group ${
                      isSelected
                        ? 'border-black bg-white shadow-md ring-2 ring-black'
                        : 'border-black/5 bg-white/70 hover:bg-white hover:border-black/20'
                    }`}
                  >
                    {/* Model Avatar */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-black/10 bg-neutral-100">
                      <img
                        src={model.avatar}
                        alt={model.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-sm font-bold text-neutral-900 truncate">
                          {model.name}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">
                        {model.ethnicity}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                        {model.height} • {model.size}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Model Calibration Chip */}
            <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-sm text-xs font-mono space-y-1.5">
              <div className="font-bold text-neutral-800">Active Casting:</div>
              <div className="text-neutral-500 text-[11px]">{activeModel.name} ({activeModel.ethnicity})</div>
              <div className="text-[#10b981] text-[11px] flex items-center gap-1 font-semibold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Anatomical Skeleton Synced</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: THE INTERACTIVE VIRTUAL TRY-ON STAGE ("CHECK BY SLIDE") (6.5 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-4 sm:p-6 border border-black/10 shadow-xl flex flex-col justify-between">
            {/* Top Preview Controls */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#de4a2c] animate-pulse" />
                <span className="font-bold text-neutral-900">Virtual Fitting Room</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-600">Slide to compare</span>
              </div>
              <div className="text-[11px] text-neutral-500">
                Slider: <strong className="text-neutral-900">{sliderPosition}%</strong>
              </div>
            </div>

            {/* Central Try-On Display with Scanning Animation & Drag Slider */}
            <div
              className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 select-none shadow-inner border border-black/10 cursor-ew-resize group"
              onMouseMove={handleSliderMove}
              onTouchMove={handleSliderMove}
            >
              {/* Dynamic Laser Scanning Line Animation when dress changes */}
              {isSynthesizing && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#de4a2c] to-transparent shadow-[0_0_15px_#de4a2c] z-40 animate-pulse top-1/2 -translate-y-1/2" />
              )}

              {/* RIGHT LAYER: On-Model Fitted Living Render */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${isSynthesizing ? 'opacity-70 scale-[0.99]' : 'opacity-100 scale-100'}`}>
                <img
                  src={currentRenderImage}
                  alt={`${activeModel.name} wearing ${activeGarment.name}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500"
                />

                {/* Right Floating Badge */}
                <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[11px] font-bold shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>{activeModel.name} (Fitted)</span>
                </div>
              </div>

              {/* LEFT LAYER: Raw Flat SKU Garment (Clipped with slider position) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <div className="w-full h-full bg-neutral-50 flex items-center justify-center p-6 sm:p-10">
                  <img
                    src={activeGarment.flatImage}
                    alt={activeGarment.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)]"
                  />
                </div>

                {/* Left Floating Badge */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-black font-mono text-[11px] font-bold shadow-lg border border-black/10 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Flat SKU Plate</span>
                </div>
              </div>

              {/* Vertical Slider Handle Line */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-30 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-black shadow-xl border border-black/10 flex items-center justify-center font-mono text-[11px] font-bold">
                  ⟷
                </div>
              </div>

              {/* Bottom Drag Instruction Pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] pointer-events-none">
                <span>Drag slider to inspect seam & drape</span>
              </div>
            </div>

            {/* Slider Scrubber Quick Toggles */}
            <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSliderPosition(0)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    sliderPosition === 0 ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  Flat SKU
                </button>
                <button
                  onClick={() => setSliderPosition(50)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    sliderPosition === 50 ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  50 / 50 Split
                </button>
                <button
                  onClick={() => setSliderPosition(100)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    sliderPosition === 100 ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  Full Try-On
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="w-24 sm:w-32 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>
            </div>
          </div>

          {/* COLUMN 3: SELECT DRESS / GARMENT WARDROBE (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between px-1 text-xs font-mono text-neutral-500 uppercase tracking-wider font-bold">
              <span>2. Pick Garment to Try</span>
              <span>{GARMENTS.length} Outfits</span>
            </div>

            <div className="space-y-2.5">
              {GARMENTS.map((garment) => {
                const isSelected = garment.id === selectedGarmentId;
                return (
                  <button
                    key={garment.id}
                    onClick={() => handleSelectGarment(garment.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 group ${
                      isSelected
                        ? 'border-[#de4a2c] bg-white shadow-md ring-2 ring-[#de4a2c]'
                        : 'border-black/5 bg-white/70 hover:bg-white hover:border-black/20'
                    }`}
                  >
                    {/* Garment Flat Thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-100 p-1 border border-black/5 flex items-center justify-center">
                      <img
                        src={garment.flatImage}
                        alt={garment.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-bold text-neutral-900 truncate">
                          {garment.name}
                        </span>
                        {isSelected ? (
                          <span className="w-4 h-4 rounded-full bg-[#de4a2c] text-white flex items-center justify-center text-[10px] shrink-0">
                            ✓
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-400 group-hover:text-black">
                            Try on
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">
                        {garment.fabric}
                      </div>
                      <div className="text-[9px] font-mono text-neutral-400 mt-0.5">
                        {garment.specs.drapeScore}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Direct Free Pilot Call-to-Action Card */}
            <div className="p-4 rounded-2xl bg-neutral-900 text-white shadow-lg space-y-3">
              <div className="text-xs font-mono font-bold text-[#de4a2c] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deploy on Your Brand</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Upload 3 flat-lay or mannequin garment photos. We will generate 4K on-model virtual try-on renders within 24 hours.
              </p>
              <Link
                href="/#free-sample"
                className="w-full py-2.5 px-3 rounded-xl bg-[#de4a2c] hover:bg-[#c93f24] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Upload 3 Test Garments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* MINIMAL FOOTER SPEC STRIP */}
        <div className="mt-12 pt-8 border-t border-black/[0.06] grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-white border border-black/5">
            <div className="text-sm font-bold font-display text-neutral-900">4096 $\times$ 4096 4K</div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">Marketplace Print Spec</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-black/5">
            <div className="text-sm font-bold font-display text-[#10b981]">-38% Returns</div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">Proven Conversion Lift</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-black/5">
            <div className="text-sm font-bold font-display text-neutral-900">24h Guaranteed SLA</div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">Cloud Batch Pipeline</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-black/5">
            <div className="text-sm font-bold font-display text-[#de4a2c]">100% Retoucher QC</div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">Human Verification</div>
          </div>
        </div>
      </main>
    </div>
  );
}
