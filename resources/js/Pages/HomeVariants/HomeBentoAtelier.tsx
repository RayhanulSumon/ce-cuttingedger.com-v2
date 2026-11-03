import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Shirt,
  UserCheck,
  Camera,
  Scissors,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  Zap,
  ShieldCheck,
  Layers,
  Upload,
  Sun,
  Moon,
  Compass
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

export function HomeBentoAtelier({ clients = [] }: HomeProps) {
  // Tile 1: 3D Try-On Garment State
  const [activeGarment, setActiveGarment] = useState<'coat' | 'blouse' | 'jacket'>('coat');
  const garmentImages = {
    coat: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    blouse: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    jacket: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85'
  };

  // Tile 2: S1 Headshot Slider
  const [headshotSplit, setHeadshotSplit] = useState(50);

  // Tile 3: S4 Scene Environment State
  const [activeEnv, setActiveEnv] = useState<'marble' | 'sand' | 'neon'>('marble');
  const envImages = {
    marble: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
    sand: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80',
    neon: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85'
  };

  // Tile 4: S2 Fashion Model Pose
  const [modelPose, setModelPose] = useState<'runway' | 'editorial'>('runway');

  // Tile 5: S5 Vector Wireframe toggle
  const [showWireframe, setShowWireframe] = useState(false);

  const [trialEmail, setTrialEmail] = useState('');
  const [trialSubmitted, setTrialSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Top Floating Bento Header */}
      <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4">
        <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-xs px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#de4a2c] text-white flex items-center justify-center font-bold text-xs">
              CE
            </span>
            <span className="font-extrabold text-sm tracking-tight text-neutral-900">
              CUTTING EDGER <span className="font-mono text-neutral-400 font-normal text-xs ml-1">Bento Atelier</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-neutral-500">
            <span>5 INTERACTIVE TILES</span>
            <span>&lt; 2H BATCH SLA</span>
            <span className="text-[#de4a2c] font-bold">● 100% VECTOR PATHS</span>
          </div>

          <Link
            href="/contact"
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-[#de4a2c] text-white text-xs font-semibold transition-colors"
          >
            Start Free Test
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO: TITLE & BENTO WORKBENCH
      ========================================================= */}
      <main className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold inline-block mb-2">
            INTERACTIVE BENTO WORKBENCH
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 mb-3">
            Touch The Craft. Inspect The Output.
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Every bento block below is a live simulation of our 5 production engines. Click toggles and drag handles to test precision.
          </p>
        </div>

        {/* Master Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* TILE 1: 3D Virtual Try-On (Large 2-col, 2-row) */}
          <div className="md:col-span-2 lg:col-span-2 md:row-span-2 rounded-3xl bg-white p-6 border border-neutral-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold border border-indigo-100 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> S3 • 3D VIRTUAL TRY-ON
                </span>
                <span className="text-xs font-mono text-neutral-400">4K WebGL Render</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
                Anatomical Garment Fit Synthesis
              </h2>
              <p className="text-xs text-neutral-500 mb-4">
                Toggle garments to witness dynamic seam tension and fabric drape on avatar.
              </p>

              {/* Interactive Garment Switcher Pills */}
              <div className="flex items-center gap-2 mb-4">
                {(['coat', 'blouse', 'jacket'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveGarment(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      activeGarment === item
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100 shadow-inner">
              <img
                src={garmentImages[activeGarment]}
                alt="3D Try on"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[11px] font-mono font-bold text-neutral-800 shadow-xs">
                Active SKU: {activeGarment.toUpperCase()} // 0.2s Real-Time
              </div>
            </div>
          </div>

          {/* TILE 2: S1 AI Headshot Split (1-col) */}
          <div className="rounded-3xl bg-white p-5 border border-neutral-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-100">
                  S1 • AI HEADSHOTS
                </span>
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">
                Selfie to Executive Studio
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 mb-3">
                Drag slider to inspect lighting lock.
              </p>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden bg-neutral-100 select-none">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85"
                alt="Executive"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${headshotSplit}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Selfie"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ width: '280px', maxWidth: 'none' }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={headshotSplit}
                onChange={(e) => setHeadshotSplit(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Headshot slider"
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none"
                style={{ left: `${headshotSplit}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-2">
              <span>RAW SELFIE</span>
              <span>STUDIO GRADE</span>
            </div>
          </div>

          {/* TILE 3: S4 Product Scene Generator (1-col) */}
          <div className="rounded-3xl bg-white p-5 border border-neutral-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-100">
                  S4 • SCENE GEN
                </span>
                <Camera className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">
                Atmosphere Switcher
              </h3>
              <div className="flex gap-1.5 my-2">
                {(['marble', 'sand', 'neon'] as const).map((env) => (
                  <button
                    key={env}
                    onClick={() => setActiveEnv(env)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                      activeEnv === env
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src={envImages[activeEnv]}
                alt="Product scene"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[9px] uppercase">
                {activeEnv} Setup
              </div>
            </div>
          </div>

          {/* TILE 4: S2 AI Fashion Runway Models (1-col) */}
          <div className="rounded-3xl bg-white p-5 border border-neutral-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-mono text-[10px] font-bold border border-rose-100">
                  S2 • RUNWAY
                </span>
                <Shirt className="w-4 h-4 text-rose-600" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">
                Living Runway Diversity
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 mb-3">
                No casting or studio logistics needed.
              </p>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85"
                alt="Runway model"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-mono text-neutral-800 flex justify-between items-center">
                <span>ETHNICITY: ADAPTIVE</span>
                <span className="text-emerald-600 font-bold">100% DRAPE</span>
              </div>
            </div>
          </div>

          {/* TILE 5: S5 Pen Tool Vector Path (1-col) */}
          <div className="rounded-3xl bg-white p-5 border border-neutral-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-100">
                  S5 • PEN TOOL
                </span>
                <Scissors className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">
                ±0.25px Vector Paths
              </h3>
              <div className="flex items-center gap-2 my-2">
                <button
                  onClick={() => setShowWireframe(!showWireframe)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-mono uppercase font-bold flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  {showWireframe ? 'Show Polished' : 'Inspect Path'}
                </button>
              </div>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden bg-neutral-900">
              <img
                src={
                  showWireframe
                    ? 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
                    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=85'
                }
                alt="Jewelry"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white font-mono text-[9px]">
                {showWireframe ? 'RAW BÉZIER' : '16-BIT RETOUCH'}
              </div>
            </div>
          </div>

          {/* TILE 6: Quick Free Trial Upload Form (2-col or wide) */}
          <div className="md:col-span-2 lg:col-span-2 rounded-3xl bg-neutral-900 text-white p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider">
                  RAPID FREE TRIAL LAB
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Send 3 Test Images. Delivered In 2 Hours.
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm mb-4">
                No payment or commitment required. Test our human pen tool artists and neural engines on your real inventory.
              </p>
            </div>

            {trialSubmitted ? (
              <div className="p-3.5 rounded-xl bg-white/10 text-emerald-400 font-mono text-xs font-bold">
                ✓ Check your inbox: upload link sent.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTrialSubmitted(true);
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  required
                  value={trialEmail}
                  onChange={(e) => setTrialEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#de4a2c]"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#de4a2c] hover:bg-white hover:text-neutral-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Start Test
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-10 border-t border-neutral-200 text-center font-mono text-xs text-neutral-400">
        © 2026 CUTTING EDGER ATELIER. BENTO ATELIER PROTOTYPE 12.
      </footer>
    </div>
  );
}

