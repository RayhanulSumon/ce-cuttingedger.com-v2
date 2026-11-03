import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  Compass,
  ArrowRight,
  ArrowUpRight,
  Sliders,
  Check,
  FileCode,
  Shield,
  Layers,
  Scissors,
  UserCheck,
  Shirt,
  Sparkles,
  Camera,
  Terminal,
  Cpu
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

const BLUEPRINT_DISCIPLINES = [
  {
    code: 'SPEC-01',
    name: 'AI Corporate Headshots',
    system: 'S1-HR/EXEC',
    tolerance: '100% Identity Lock',
    sla: '&lt; 120min',
    deliverables: '16-bit Master PSD, 300 DPI, CMYK & sRGB',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
    notes: 'Eliminates studio travel. Standardizes C-suite branding across global hubs.'
  },
  {
    code: 'SPEC-02',
    name: 'AI Fashion Runway Models',
    system: 'S2-APPAREL',
    tolerance: 'Anatomical Dynamic Drape',
    sla: 'Batch Auto-Stream',
    deliverables: 'Multi-angle WebP & 4K TIFF',
    beforeImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    notes: 'Replaces expensive casting calls. Preserves weave pattern and stitch fidelity.'
  },
  {
    code: 'SPEC-03',
    name: '3D Virtual Try-On Synthesis',
    system: 'S3-SIMULATION',
    tolerance: 'Physics Cloth Tension',
    sla: 'Real-Time 60FPS',
    deliverables: 'GLTF / USDZ / 4K JPG',
    beforeImg: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    notes: 'Decreases return rates up to 38% on e-commerce flagship storefronts.'
  },
  {
    code: 'SPEC-04',
    name: 'Product Scene Generation',
    system: 'S4-CAUSTICS',
    tolerance: 'Raytraced Shadow Alignment',
    sla: '4-Hour Bulk Pipeline',
    deliverables: 'Isolated Layered Alpha PSD',
    beforeImg: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    notes: 'Synthesizes realistic sunlight, travertine pedestals, and caustic water reflections.'
  },
  {
    code: 'SPEC-05',
    name: 'Precision Vector Paths',
    system: 'S5-MICROPOLISH',
    tolerance: '±0.25px Bézier Pen Tool',
    sla: '6-Hour Rush Available',
    deliverables: 'Vector Path Embedded TIFF & PSD',
    beforeImg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    notes: '100% human-drawn vector pen paths. Zero automated jagged fringe or halo artifacts.'
  }
];

export function HomeArchitectBlueprint({ clients = [] }: HomeProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isXray, setIsXray] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const active = BLUEPRINT_DISCIPLINES[activeIdx];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#0A0D14] selection:bg-[#de4a2c] selection:text-white font-mono antialiased overflow-x-hidden">
      {/* Blueprint Grid Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Technical Top Header */}
      <header className="border-b border-neutral-300 bg-white/95 sticky top-0 z-40 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-black text-sm tracking-tighter text-neutral-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#de4a2c]" />
              CUTTING_EDGER.SYS // V13
            </Link>
            <span className="text-[10px] text-neutral-400 hidden sm:inline">
              [LAT: 40.7128° N // LON: 74.0060° W]
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] text-neutral-500">
            <span>PIPELINE: ACTIVE</span>
            <span>TOLERANCE: ±0.25PX</span>
            <span className="text-emerald-600 font-bold">● NODE READY</span>
          </div>

          <Link
            href="/contact"
            className="px-4 py-1.5 border border-neutral-900 bg-neutral-900 text-white hover:bg-[#de4a2c] hover:border-[#de4a2c] text-xs font-bold transition-colors"
          >
            EXECUTE_TEST_ORDER
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO: TECHNICAL BLUEPRINT CONSOLE
      ========================================================= */}
      <section className="py-12 px-6 max-w-7xl mx-auto border-b border-neutral-300">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Spec Sheet Index */}
          <div className="w-full lg:w-5/12 space-y-4">
            <div className="border border-neutral-300 bg-white p-5 shadow-xs">
              <div className="text-[10px] text-[#de4a2c] font-bold uppercase mb-1">
                // SYSTEM ARCHITECTURE
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight mb-2">
                Precision Post-Production Engine
              </h1>
              <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                Industrial-grade digital image manufacturing. 5 core disciplines operating under strict SLA tolerance standards.
              </p>

              {/* Technical Selector Index */}
              <div className="space-y-1.5">
                {BLUEPRINT_DISCIPLINES.map((d, idx) => (
                  <button
                    key={d.code}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full text-left p-3 border transition-all flex items-center justify-between text-xs ${
                      activeIdx === idx
                        ? 'border-neutral-950 bg-neutral-950 text-white font-bold'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] opacity-70 block">{d.code} // {d.system}</span>
                      <span>{d.name}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80">{d.sla}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Spec Sheet Parameters */}
            <div className="border border-neutral-300 bg-white p-4 text-xs space-y-2">
              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="text-neutral-500">TOLERANCE SPEC:</span>
                <span className="font-bold text-neutral-900">{active.tolerance}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="text-neutral-500">DELIVERABLES:</span>
                <span className="font-bold text-neutral-900">{active.deliverables}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">HUMAN QA PASS:</span>
                <span className="text-emerald-600 font-bold">PASS (DUAL OVERSIGHT)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Blueprint Canvas */}
          <div className="w-full lg:w-7/12 border border-neutral-300 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-100 border border-neutral-200 text-xs mb-3">
              <span className="text-[11px] font-bold text-neutral-800">
                FRAME_BUFFER: {active.code} // {active.name.toUpperCase()}
              </span>
              <button
                onClick={() => setIsXray(!isXray)}
                className={`px-3 py-1 text-[10px] font-bold uppercase transition-colors border ${
                  isXray
                    ? 'bg-[#de4a2c] text-white border-[#de4a2c]'
                    : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {isXray ? '● X-RAY_RAW_ACTIVE' : '○ TOGGLE_X-RAY_RAW'}
              </button>
            </div>

            <div className="relative h-[380px] sm:h-[480px] overflow-hidden border border-neutral-200 bg-neutral-900">
              <img
                src={isXray ? active.beforeImg : active.afterImg}
                alt={active.name}
                className="w-full h-full object-cover"
              />

              {/* Crosshair Overlay Marks */}
              <div className="absolute top-4 left-4 text-[10px] bg-black/70 text-emerald-400 p-2 font-mono border border-emerald-500/30">
                [X: 1920, Y: 1080] <br />
                CALIBRATION: DELTA_E &lt; 1.0 <br />
                STATUS: {isXray ? 'RAW_SOURCE_INGEST' : 'RENDER_MASTER_VERIFIED'}
              </div>

              <div className="absolute bottom-4 right-4 text-[10px] bg-white/90 text-neutral-900 px-3 py-1 font-bold border border-neutral-400">
                {active.tolerance}
              </div>
            </div>

            <div className="p-3 text-xs text-neutral-600 border-t border-neutral-200 mt-2">
              <span className="font-bold text-neutral-900">SYSTEM NOTE:</span> {active.notes}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: 5-PIPELINE SPECIFICATION MATRIX
      ========================================================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[10px] text-[#de4a2c] font-bold uppercase mb-0.5">
              // PRODUCTION CAPABILITIES
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase">
              Automated & Manual Pipeline Matrix
            </h2>
          </div>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            5 DEDICATED ATELIER STATIONS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {BLUEPRINT_DISCIPLINES.map((d) => (
            <div
              key={d.code}
              className="border border-neutral-300 bg-white p-4 flex flex-col justify-between hover:border-neutral-900 transition-colors"
            >
              <div>
                <span className="text-[10px] text-[#de4a2c] font-bold block mb-1">
                  {d.code}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 mb-2 leading-tight">
                  {d.name}
                </h3>
                <div className="text-[11px] text-neutral-500 mb-4 line-clamp-3">
                  {d.notes}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-3 text-[10px] space-y-1 text-neutral-600">
                <div>SLA: <span className="font-bold text-neutral-900">{d.sla}</span></div>
                <div>ACC: <span className="font-bold text-neutral-900">{d.tolerance}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 3: TERMINAL INGEST ORDER
      ========================================================= */}
      <footer className="border-t border-neutral-300 bg-white py-14 px-6 text-xs">
        <div className="max-w-3xl mx-auto border border-neutral-300 bg-neutral-50 p-6 shadow-xs text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-neutral-500 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-[#de4a2c]" />
            <span>TERMINAL COMMAND // INGEST FREE TEST BATCH</span>
          </div>
          <h2 className="text-xl font-black text-neutral-950 uppercase mb-2">
            Submit Test Specification Under NDA
          </h2>
          <p className="text-neutral-600 mb-6 text-xs max-w-md mx-auto">
            Input enterprise email to receive secure encrypted ingest credentials. First 3 master files processed complimentary.
          </p>

          {submitted ? (
            <div className="p-3 bg-neutral-900 text-white font-mono text-xs">
              &gt; STATUS 200 OK: Ingest token generated. Check email protocol.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="ENTER_WORK_EMAIL"
                className="flex-1 px-4 py-2.5 bg-white border border-neutral-400 text-xs focus:outline-none focus:border-neutral-950"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-950 hover:bg-[#de4a2c] text-white font-bold uppercase transition-colors"
              >
                EXECUTE_TOKEN
              </button>
            </form>
          )}

          <div className="mt-8 text-[10px] text-neutral-400 border-t border-neutral-200 pt-4">
            © 2026 CUTTING EDGER DIGITAL SYSTEMS. ARCHITECT BLUEPRINT PROTOTYPE 13.
          </div>
        </div>
      </footer>
    </div>
  );
}

