import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  Check,
  Shirt,
  ScanLine,
  Layers,
  Zap,
  Camera,
  RefreshCw,
  MoveHorizontal
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

interface Outfit {
  id: string;
  name: string;
  category: string;
  fabric: string;
  flatImage: string;
  modelImage: string;
  hotspot: { x: number; y: number; label: string };
  specs: {
    drape: string;
    seam: string;
  };
}

interface ModelData {
  gender: 'female' | 'male';
  name: string;
  specs: string;
  avatar: string;
  outfits: Outfit[];
}

const MODELS_DATA: Record<'female' | 'male', ModelData> = {
  female: {
    gender: 'female',
    name: 'Maya V.',
    specs: "5'11\" (180 cm) • Size Small • Editorial Fashion",
    avatar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
    outfits: [
      {
        id: 'f-1',
        name: 'Terracotta Ribbed Knit',
        category: 'Knitwear',
        fabric: 'Heavy 7-Gauge 100% Merino Wool',
        flatImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 52, y: 36, label: 'Ribbed Knit Drape' },
        specs: { drape: '99.4% physics match', seam: 'Sub-millimeter collar ribbing' }
      },
      {
        id: 'f-2',
        name: 'Gabardine Double Trench',
        category: 'Outerwear',
        fabric: 'Weatherproof Cotton Gabardine',
        flatImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 50, y: 38, label: 'Tailored Lapel Fit' },
        specs: { drape: '99.7% fluid movement', seam: 'Epaulette & horn button alignment' }
      },
      {
        id: 'f-3',
        name: 'Streetwear Loopback Hoodie',
        category: 'Streetwear',
        fabric: 'Heavy 420 GSM Loopback Fleece',
        flatImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 50, y: 34, label: 'Oversized Silhouette' },
        specs: { drape: '98.9% natural slouch', seam: 'Double-needle kangaroo pocket' }
      },
      {
        id: 'f-4',
        name: 'Editorial Tailored Blazer',
        category: 'Tailoring',
        fabric: '14oz High-Twist Wool Crepe',
        flatImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 50, y: 42, label: 'Structured Waistline' },
        specs: { drape: '99.5% canvas form', seam: 'Flap pocket & peaked lapel' }
      },
      {
        id: 'f-5',
        name: 'Boxy Heavyweight Top',
        category: 'Tops',
        fabric: '280 GSM Combed Cotton',
        flatImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 50, y: 38, label: 'Drop Shoulder Fit' },
        specs: { drape: '98.8% relaxed drape', seam: '1" high-density collar band' }
      }
    ]
  },
  male: {
    gender: 'male',
    name: 'Leo S.',
    specs: "6'1\" (185 cm) • Size Large • Athletic Modern",
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=300&q=80',
    outfits: [
      {
        id: 'm-1',
        name: 'French Terry Street Hoodie',
        category: 'Streetwear',
        fabric: 'Heavy 450 GSM Organic Cotton',
        flatImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 50, y: 35, label: 'Chest Tension Fit' },
        specs: { drape: '99.1% athletic drape', seam: 'Reinforced ribbed cuffs & hem' }
      },
      {
        id: 'm-2',
        name: 'Tailored Wool Overcoat',
        category: 'Outerwear',
        fabric: 'Double-Faced Wool Melange',
        flatImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 50, y: 40, label: 'Shoulder Pad Architecture' },
        specs: { drape: '99.8% razor sharp drop', seam: 'Hand-finished pick-stitch lapels' }
      },
      {
        id: 'm-3',
        name: 'Terracotta Ribbed Knit',
        category: 'Knitwear',
        fabric: '100% Extrafine Merino Wool',
        flatImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 50, y: 37, label: 'Textured Knit Drape' },
        specs: { drape: '99.5% elastic memory', seam: 'Seamless linked armholes' }
      },
      {
        id: 'm-4',
        name: 'Casual Denim & Heavy Shirt',
        category: 'Casual',
        fabric: '12oz Slub Indigo Denim',
        flatImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 50, y: 44, label: 'Relaxed Waist & Seams' },
        specs: { drape: '99.0% natural break', seam: 'Chainstitched hem & copper rivets' }
      },
      {
        id: 'm-5',
        name: 'Urban Canvas Chore Jacket',
        category: 'Workwear',
        fabric: '12oz Washed Duck Canvas',
        flatImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
        modelImage: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1400&q=90',
        hotspot: { x: 50, y: 38, label: 'Boxy Workwear Cut' },
        specs: { drape: '99.3% canvas fold physics', seam: 'Triple-needle felled chainstitch' }
      }
    ]
  }
};

export function HomeOmniStudio({ clients = [] }: HomeProps) {
  const [selectedGender, setSelectedGender] = useState<'female' | 'male'>('female');
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // Split slider 0 to 100%
  const [isDressingUp, setIsDressingUp] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showToast, setShowToast] = useState(false);

  // 60 FPS Mouse 3D Parallax & Dynamic Light State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, pctX: 50, pctY: 50 });
  const stageRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentModel = MODELS_DATA[selectedGender];
  const activeOutfit = currentModel.outfits[selectedOutfitIndex] || currentModel.outfits[0];

  // Garment Category Filter List
  const categories = ['All', ...Array.from(new Set(currentModel.outfits.map((o) => o.category)))];
  const filteredOutfits = activeTab === 'All'
    ? currentModel.outfits
    : currentModel.outfits.filter((o) => o.category === activeTab);

  // Smooth Dress-Up Handler
  const handleSelectOutfit = (outfitId: string) => {
    const idx = currentModel.outfits.findIndex((o) => o.id === outfitId);
    if (idx === -1 || idx === selectedOutfitIndex) return;

    setIsDressingUp(true);
    setSelectedOutfitIndex(idx);
    setShowToast(true);

    setTimeout(() => {
      setIsDressingUp(false);
    }, 400);

    setTimeout(() => {
      setShowToast(false);
    }, 3200);
  };

  // Switch Model Gender (Female / Male)
  const handleSwitchGender = (g: 'female' | 'male') => {
    if (g === selectedGender) return;
    setIsDressingUp(true);
    setSelectedGender(g);
    setSelectedOutfitIndex(0);
    setActiveTab('All');

    setTimeout(() => {
      setIsDressingUp(false);
    }, 400);
  };

  // 60 FPS Mouse Parallax & Dynamic Light Calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => {
      setMousePos({ x, y, pctX, pctY });
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0, pctX: 50, pctY: 50 });
  };

  // Interactive Slider Drag
  const handleSliderMove = (clientX: number, target: HTMLDivElement) => {
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#111318] selection:bg-black selection:text-white font-sans antialiased flex flex-col justify-between overflow-x-hidden">
      
      {/* Toast Notification when fitting new dress */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none">
          <div className="bg-[#111318]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
            <div>
              <span className="font-bold text-white">4K AI Try-On Fitted: </span>
              <span className="text-neutral-300">{activeOutfit.name} on {currentModel.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* 1. MINIMAL ATELIER HEADER: Model Selector & Free Pilot Action */}
      <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#de4a2c] animate-pulse" />
          <span className="font-display text-sm sm:text-base font-bold tracking-tight text-neutral-900">
            CUTTING EDGER
          </span>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 hidden sm:inline">
            Virtual Try-On Studio (S3)
          </span>
        </div>

        {/* TWO MODEL TOGGLE (Female & Male) */}
        <div className="inline-flex rounded-full bg-neutral-100 p-1 border border-black/5 text-xs font-mono shadow-inner">
          <button
            onClick={() => handleSwitchGender('female')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${
              selectedGender === 'female'
                ? 'bg-black text-white font-bold shadow-sm'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <span>♀ Female Model</span>
            <span className="text-[10px] text-neutral-400">Maya</span>
          </button>
          <button
            onClick={() => handleSwitchGender('male')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${
              selectedGender === 'male'
                ? 'bg-black text-white font-bold shadow-sm'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <span>♂ Male Model</span>
            <span className="text-[10px] text-neutral-400">Leo</span>
          </button>
        </div>

        {/* Quick Pilot Action */}
        <div className="flex items-center gap-3">
          <Link
            href="/#free-sample"
            className="px-4 py-2 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Test 3 SKUs Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. MAIN LARGE PHOTOREALISTIC STAGE & WARDROBE RACK */}
      <main className="flex-1 max-w-[1520px] mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-center">
        
        {/* Model Specs & Current Garment Bar */}
        <div className="flex items-center justify-between mb-4 px-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-600">
            <span className="font-bold text-neutral-900 uppercase">Casting:</span>
            <span className="font-bold text-black">{currentModel.name}</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-500 hidden sm:inline">{currentModel.specs}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <span className="font-bold text-neutral-900 uppercase">Dressed In:</span>
            <span className="text-[#de4a2c] font-bold">{activeOutfit.name}</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-400 hidden sm:inline">{activeOutfit.specs.drape}</span>
          </div>
        </div>

        {/* Main Stage Grid: Large Realistic Viewport (8 Cols) + Wardrobe Rack (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-stretch">
          
          {/* CENTER PREVIEW: LARGE PHOTOREALISTIC MODEL WITH 60FPS MOUSE PARALLAX & SLIDER */}
          <div className="lg:col-span-8 xl:col-span-8 bg-white rounded-3xl border border-black/10 shadow-2xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
            
            {/* Stage Controls Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06] text-xs font-mono">
              <div className="flex items-center gap-2 text-neutral-600">
                <Sliders className="w-4 h-4 text-[#de4a2c]" />
                <span className="font-bold text-neutral-900 uppercase">Drape & Fabric Inspection:</span>
                <span className="hidden sm:inline">Drag split slider or move mouse for 60fps 3D depth</span>
              </div>
              <div className="text-[11px] font-bold text-[#de4a2c] flex items-center gap-1.5">
                <MoveHorizontal className="w-3.5 h-3.5" />
                <span>Split: {sliderPosition}%</span>
              </div>
            </div>

            {/* LARGE HERO VIEWPORT (TALL, IMMERSIVE PHOTOREALISTIC FITTING ROOM) */}
            <div
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-[580px] sm:h-[680px] md:h-[740px] xl:h-[780px] rounded-2xl overflow-hidden bg-neutral-900 select-none shadow-2xl border border-black/10 cursor-ew-resize group"
              onMouseDown={(e) => handleSliderMove(e.clientX, stageRef.current!)}
              onTouchMove={(e) => {
                if (e.touches[0] && stageRef.current) {
                  handleSliderMove(e.touches[0].clientX, stageRef.current);
                }
              }}
            >
              {/* Dynamic 60 FPS Studio Spotlight that tracks mouse cursor */}
              <div
                className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 420px at ${mousePos.pctX}% ${mousePos.pctY}%, rgba(255,255,255,0.22) 0%, transparent 70%)`
                }}
              />

              {/* Dynamic Laser Scan Beam when dressing new garment */}
              {isDressingUp && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#de4a2c] to-transparent shadow-[0_0_24px_#de4a2c] z-40 animate-pulse top-1/2 -translate-y-1/2 pointer-events-none" />
              )}

              {/* RIGHT LAYER: LARGE PHOTOREALISTIC HUMAN MODEL WEARING THE OUTFIT */}
              <div
                style={{
                  transform: `perspective(1200px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 4}deg) scale(1.02)`,
                  transition: 'transform 0.15s ease-out'
                }}
                className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                  isDressingUp ? 'opacity-40 scale-[0.99] filter blur-sm' : 'opacity-100 scale-100 filter blur-0'
                }`}
              >
                <img
                  src={activeOutfit.modelImage}
                  alt={`${currentModel.name} dressed in ${activeOutfit.name}`}
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                  draggable={false}
                />

                {/* Hotspot Badge on the model */}
                <div
                  style={{ left: `${activeOutfit.hotspot.x}%`, top: `${activeOutfit.hotspot.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full bg-white/70 animate-ping absolute" />
                    <span className="px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-[11px] font-bold shadow-2xl border border-white/20">
                      {activeOutfit.hotspot.label}
                    </span>
                  </div>
                </div>

                {/* Top Right Floating Badge */}
                <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs font-bold shadow-lg flex items-center gap-1.5 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>4K AI On-Model Fit</span>
                </div>
              </div>

              {/* LEFT LAYER: FLAT-LAY PRODUCT SKU (Clips dynamically with slider position) */}
              <div
                className="absolute inset-0 overflow-hidden z-20"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <div className="w-full h-full bg-[#f4f4f2] flex items-center justify-center p-8 sm:p-14">
                  <img
                    src={activeOutfit.flatImage}
                    alt={activeOutfit.name}
                    className="max-w-[85%] max-h-[85%] object-contain filter drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)] select-none pointer-events-none"
                    draggable={false}
                  />
                </div>

                {/* Top Left Floating Badge */}
                <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-black font-mono text-xs font-bold shadow-lg border border-black/10 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Raw Flat SKU</span>
                </div>
              </div>

              {/* VERTICAL DIVIDER HANDLE */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.8)] z-30 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/15 flex items-center justify-center font-mono text-xs font-bold">
                  ⟷
                </div>
              </div>

              {/* Bottom Drag Instruction */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-xl border border-white/10">
                <span>Drag left / right to compare flat SKU vs on-model drape</span>
              </div>
            </div>

            {/* Quick Slider Position Buttons Below */}
            <div className="mt-4 pt-2.5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSliderPosition(0)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    sliderPosition === 0 ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  Flat SKU
                </button>
                <button
                  onClick={() => setSliderPosition(50)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    sliderPosition === 50 ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  50 / 50 Split
                </button>
                <button
                  onClick={() => setSliderPosition(100)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    sliderPosition === 100 ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  Full Fitted
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[11px]">Slide:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="w-28 sm:w-48 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT WARDROBE RACK: SELECT DRESS / OUTFIT TO FIT ON THE MODEL (4 COLS) */}
          <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-3xl border border-black/10 shadow-xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Rack Header */}
              <div className="pb-3 border-b border-black/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-neutral-900 tracking-tight">
                    Dress Up Wardrobe
                  </h2>
                  <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                    Click any garment to dress {currentModel.name}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-mono text-xs font-bold border border-black/5">
                  {currentModel.outfits.length} Outfits
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar text-xs font-mono">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                      activeTab === cat
                        ? 'bg-black text-white font-bold shadow-sm'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Large Attractive Garment Cards */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredOutfits.map((outfit) => {
                  const isSelected = outfit.id === activeOutfit.id;
                  return (
                    <button
                      key={outfit.id}
                      onClick={() => handleSelectOutfit(outfit.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 group ${
                        isSelected
                          ? 'border-[#de4a2c] bg-orange-50/30 shadow-md ring-2 ring-[#de4a2c]'
                          : 'border-black/5 bg-white hover:bg-neutral-50 hover:border-black/20'
                      }`}
                    >
                      {/* Crisp Flat Product Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-100 p-1 border border-black/5 flex items-center justify-center">
                        <img
                          src={outfit.flatImage}
                          alt={outfit.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xs sm:text-sm font-bold text-neutral-900 truncate">
                            {outfit.name}
                          </span>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-[#de4a2c] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              ✓
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-neutral-400 group-hover:text-black">
                              Fit on
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">
                          {outfit.fabric}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400 mt-0.5 flex items-center gap-1.5">
                          <span className="text-[#10b981] font-semibold">{outfit.specs.drape}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Free Pilot Call-to-Action */}
            <div className="mt-6 pt-4 border-t border-black/[0.06]">
              <div className="mb-3 px-1 text-xs font-mono text-neutral-500 flex items-center justify-between">
                <span>Enterprise SLA:</span>
                <span className="font-bold text-neutral-900">24-Hour Batch Turnaround</span>
              </div>
              <Link
                href="/#free-sample"
                className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-[#de4a2c] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md group"
              >
                <span>Upload 3 Garments for Free Try-On</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 3. MINIMAL FOOTER */}
      <footer className="border-t border-black/[0.06] py-3.5 px-6 text-center text-xs font-mono text-neutral-400">
        Cutting Edger S3 Virtual Try-On Studio • 60 FPS Photorealistic Rendering • Zero Physical Photoshoot Overhead
      </footer>
    </div>
  );
}
