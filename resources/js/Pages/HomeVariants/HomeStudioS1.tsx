import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Upload,
  Sliders,
  Sparkles,
  Camera,
  Users,
  Briefcase,
  Layers,
  ChevronRight,
  Check
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

const PRESETS = [
  {
    id: 'executive-slate',
    name: 'Executive Slate & Navy',
    backdropDesc: 'Architectural Charcoal & Soft Keylight',
    attire: 'Bespoke Tailored Blazer',
    tag: 'BOARDROOM GRADE',
    outputImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
    selfieInput: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    personName: 'Elena Vance',
    personRole: 'Chief Operating Officer'
  },
  {
    id: 'modern-white',
    name: 'Silicon Valley Minimal',
    backdropDesc: 'High-Key Studio Diffused White',
    attire: 'Merino Wool Crewneck',
    tag: 'TECH LEADERSHIP',
    outputImg: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=85',
    selfieInput: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    personName: 'David Marcus',
    personRole: 'Head of Engineering'
  },
  {
    id: 'warm-loft',
    name: 'Natural Sunlit Loft',
    backdropDesc: 'Warm Bokeh Daylight & Organic Wood',
    attire: 'Smart Casual Structured Linen',
    tag: 'CREATIVE DIRECTOR',
    outputImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200&q=85',
    selfieInput: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    personName: 'Amina Diallo',
    personRole: 'VP of Global Brand'
  }
];

export function HomeStudioS1({ clients = [] }: HomeProps) {
  const [activePresetId, setActivePresetId] = useState('executive-slate');
  const [sliderPos, setSliderPos] = useState(50);
  const [teamSeats, setTeamSeats] = useState(50);
  const [isHoldingSelfie, setIsHoldingSelfie] = useState(false);

  const activePreset = PRESETS.find((p) => p.id === activePresetId) || PRESETS[0];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111215] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Top Protocol Indicator */}
      <div className="border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#de4a2c] animate-pulse" />
            <span className="font-mono font-bold tracking-wider text-neutral-800 uppercase">
              SERVICE S1 // AI CORPORATE HEADSHOTS
            </span>
            <span className="hidden md:inline text-neutral-400">• HR & Marketing Teams (20–500 Seats)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-500 font-bold">
            <span className="hidden sm:inline">6–10 SELFIES PER PERSON</span>
            <span className="text-[#de4a2c]">UNIFIED PRESET IN 2H</span>
          </div>
        </div>
      </div>

      {/* Hero: Modern Minimalist Interactive Transformation Stage */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-800 shadow-xs mb-4">
            <UserCheck className="w-3.5 h-3.5 text-[#de4a2c]" />
            <span className="font-mono uppercase">ZERO STUDIO VISITS</span>
            <span className="text-neutral-300">•</span>
            <span className="text-[#de4a2c]">100% IDENTITY FIDELITY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#111215] leading-[1.08]">
            Turn Phone Selfies into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff6b4a] to-[#de4a2c]">
              Unified Executive Headshots
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate photographer booking, physical studio logistics, and uneven lighting for distributed teams. Upload 6–10 casual selfies per employee to receive uniform, company-branded executive portraits.
          </p>
        </div>

        {/* Interactive Morph Stage Card */}
        <div className="rounded-[32px] p-6 sm:p-10 bg-white border border-neutral-200 shadow-xl max-w-5xl mx-auto">
          {/* Preset Selector Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <span className="text-[10px] font-mono font-extrabold text-[#de4a2c] uppercase tracking-wider block">
                STEP 1 // SELECT COMPANY PRESET
              </span>
              <h2 className="text-lg font-bold text-neutral-900 mt-0.5">
                Brand Attire & Backdrop Presets
              </h2>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESETS.map((preset) => {
                const isActive = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActivePresetId(preset.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#111215] text-white shadow-md'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#de4a2c]' : 'bg-neutral-400'}`} />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Morph Canvas: Left Inputs & Right Interactive Split */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Input Camera Roll Stack (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                    INPUT: 6–10 PHONE SELFIES
                  </span>
                  <span className="text-[10px] font-mono text-[#de4a2c] font-bold">ANY CASUAL ANGLE</span>
                </div>

                <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-inner">
                  <img
                    src={activePreset.selfieInput}
                    alt="Phone selfie"
                    className="w-full h-full object-cover filter contrast-90"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] font-mono">
                    <div>{activePreset.personName}</div>
                    <div className="text-neutral-300 text-[10px]">{activePreset.personRole}</div>
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-white">
                    RAW SELFIE 01/08
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-neutral-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Preserves exact facial structure & likeness</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Swaps casual t-shirt for company wardrobe</span>
                  </div>
                </div>
              </div>

              {/* Active Preset Metadata */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Backdrop:</span>
                  <span className="font-bold text-neutral-900">{activePreset.backdropDesc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Attire:</span>
                  <span className="font-bold text-neutral-900">{activePreset.attire}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Standardization:</span>
                  <span className="font-bold text-emerald-600">Company-Wide Preset Lock</span>
                </div>
              </div>
            </div>

            {/* Right: Output Executive Portrait with Split Slider (8 Cols) */}
            <div className="lg:col-span-8">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-md h-[440px] sm:h-[500px] bg-neutral-900 select-none">
                {/* Result Image */}
                <img
                  src={activePreset.outputImg}
                  alt={activePreset.name}
                  className="w-full h-full object-cover object-top"
                />

                {/* Overlaid Raw Selfie for Split Comparison */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - (isHoldingSelfie ? 100 : sliderPos)}% 0 0)` }}
                >
                  <img
                    src={activePreset.selfieInput}
                    alt="Raw Phone Selfie"
                    className="w-full h-full object-cover object-top filter brightness-95"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                    RAW SMARTPHONE SELFIE
                  </div>
                </div>

                {/* Split Handle */}
                {!isHoldingSelfie && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#de4a2c] text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-xl flex items-center gap-1 border border-white">
                      <span>SELFIE</span>
                      <span className="opacity-40">|</span>
                      <span>PORTRAIT</span>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#111215] text-white text-[11px] font-mono font-bold shadow-md">
                  {activePreset.tag}
                </div>

                {/* Bottom Control Bar */}
                <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/90 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-800 shadow-lg">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onMouseDown={() => setIsHoldingSelfie(true)}
                      onMouseUp={() => setIsHoldingSelfie(false)}
                      onTouchStart={() => setIsHoldingSelfie(true)}
                      onTouchEnd={() => setIsHoldingSelfie(false)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                        isHoldingSelfie ? 'bg-amber-400 text-black' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      <span>{isHoldingSelfie ? 'Viewing Raw Selfie' : 'Hold to View Selfie'}</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-2">
                      <span className="font-mono text-neutral-500 font-bold">Slide:</span>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={sliderPos}
                        onChange={(e) => setSliderPos(Number(e.target.value))}
                        className="accent-[#de4a2c] cursor-pointer w-28 h-1.5 bg-neutral-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <span className="text-[#de4a2c] font-bold font-mono">
                    ⚡ Under 2-Hour Batch Turnaround
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Team Seat Calculator & ROI Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-white border border-neutral-200 text-center space-y-8 shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold text-[#de4a2c] uppercase tracking-wider block mb-1">
              BUDGET & SCHEDULING ROI CALCULATOR
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900">
              Calculate Your Enterprise Headshot Savings
            </h2>
            <p className="text-sm text-neutral-600 max-w-lg mx-auto mt-2">
              Compare the cost and turnaround of traditional studio bookings against our AI employee onboarding pipeline.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
              <span>Team Seats (HR Roster):</span>
              <span className="px-3.5 py-1 rounded-full bg-[#de4a2c]/10 text-[#de4a2c] font-mono text-sm">
                {teamSeats} Team Members
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={teamSeats}
              onChange={(e) => setTeamSeats(Number(e.target.value))}
              className="w-full accent-[#de4a2c] cursor-pointer h-2 bg-neutral-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
              <span>20 Seats</span>
              <span>250 Seats</span>
              <span>500 Seats (Enterprise)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Traditional Photographer</span>
              <div className="text-2xl font-bold text-neutral-400 line-through mt-1">${teamSeats * 250}</div>
              <div className="text-xs text-neutral-500 mt-1">3–4 weeks scheduling delay</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#de4a2c]/5 border border-[#de4a2c]/30">
              <span className="text-[10px] font-mono text-[#de4a2c] uppercase font-bold">CuttingEdger S1 Pipeline</span>
              <div className="text-3xl font-black text-[#de4a2c] mt-1">${teamSeats * 25}</div>
              <div className="text-xs text-emerald-700 font-bold mt-1">Guaranteed 2-hour delivery</div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Total Budget Saved</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">${teamSeats * 225}</div>
              <div className="text-xs text-emerald-800 font-bold mt-1">90% Direct Cost Reduction</div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-[#111215] hover:bg-[#de4a2c] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md"
            >
              <span>Onboard Your {teamSeats}-Seat Team Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
