import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight,
  ArrowUpRight,
  Sliders,
  ShieldCheck,
  Zap,
  Play,
  Layers,
  Sparkles,
  Scissors,
  CheckCircle2,
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

const CINEMATIC_SERVICES = [
  {
    num: '01',
    title: 'Precision Clipping Paths',
    tag: 'PEN-TOOL 300% ZOOM',
    desc: 'Bézier curves plotted with surgical mathematical accuracy for complex silhouettes.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
    href: '/services/ecommerce-catalog-optimization/clipping-path-service'
  },
  {
    num: '02',
    title: '3D Invisible Ghost Mannequin',
    tag: 'ANATOMICAL DRAPE',
    desc: 'Seamless neck joints and inner lining reconstructions maintaining natural garment volume.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    href: '/services/ghost-mannequin-service'
  },
  {
    num: '03',
    title: 'High-Jewelry Micro Stacking',
    tag: 'FOCUS REFLECTION',
    desc: 'Prong rebuilding, dust ablation, and specular highlight balancing for platinum and gems.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    href: '/services/ecommerce-catalog-optimization'
  },
  {
    num: '04',
    title: 'Colorway Standardization',
    tag: 'DELTA-E < 0.8',
    desc: 'Harmonize infinite SKU variations against physical lab swatches without secondary shoots.',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=85',
    href: '/services/apparel-colorway-generation'
  }
];

export function HomeCinematic({ clients = [] }: HomeProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#07080B] text-white selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#de4a2c]/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[160px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#de4a2c] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-300">
              CINEMATIC NOIR ATELIER // 24/7 PRODUCTION
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Where Precision Meets{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff7354] to-amber-400">
              Obsidian Craft
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl font-normal leading-relaxed">
            Enterprise-grade e-commerce post-production. Hand-drawn clipping paths, 3D ghost mannequin, and luxury jewelry retouching engineered for global fashion houses.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#test-drive"
              className="px-8 py-3.5 rounded-full bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold text-sm tracking-wide transition-all shadow-[0_4px_25px_rgba(222,74,44,0.4)] flex items-center gap-2"
            >
              <span>Test 3 Images Free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#services"
              className="px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/15 text-white font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <span>Explore Capabilities</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </a>
          </div>
        </div>

        {/* Hero Interactive Cinematic Frame */}
        <div className="mt-14 relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] bg-neutral-900/60 backdrop-blur-xl">
          <div className="relative h-[420px] sm:h-[540px] w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=85"
              alt="Cinematic Hero Product"
              className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
              style={{
                filter: 'brightness(1.05) contrast(1.1) drop-shadow(0 25px 25px rgba(0,0,0,0.6))'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-transparent to-black/30" />

            {/* Floating Glassmorphism Telemetry Cards */}
            <div className="absolute bottom-6 inset-x-6 sm:inset-x-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'DELIVERED ASSETS', val: '2.4M+', detail: 'Verified 100% QA' },
                { label: 'SLA COMMITMENT', val: '99.98%', detail: 'Strict Enterprise Tier' },
                { label: 'RAPID TURNAROUND', val: '4-12h', detail: 'Express Pipeline' },
                { label: 'COLOR DRIFT', val: 'ΔE < 0.8', detail: 'Pantone Calibrated' }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md"
                >
                  <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {stat.val}
                  </div>
                  <div className="text-[11px] text-[#de4a2c] font-medium mt-0.5">
                    {stat.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-8 border-y border-white/10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-6 opacity-60">
          {(clients.length > 0 ? clients.map((c) => c.name) : LUXURY_BRANDS).slice(0, 8).map((brand, i) => (
            <span key={i} className="text-xs sm:text-sm font-mono font-bold tracking-widest text-neutral-400 uppercase">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#de4a2c] uppercase tracking-widest mb-2">
              DISCIPLINARY PILLARS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Surgical Post-Production Suites
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Every file hand-inspected by dedicated master retouchers before automated cloud delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CINEMATIC_SERVICES.map((s, idx) => (
            <div
              key={idx}
              className="group rounded-3xl p-5 bg-white/[0.02] border border-white/10 hover:border-[#de4a2c]/50 transition-all duration-300 flex flex-col justify-between hover:bg-white/[0.04]"
            >
              <div>
                <div className="h-44 rounded-2xl overflow-hidden mb-5 relative">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#de4a2c] font-bold">
                    {s.tag}
                  </div>
                </div>
                <div className="text-xs font-mono text-neutral-500">{s.num}</div>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-[#de4a2c] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={s.href}
                  className="text-xs font-bold text-neutral-300 group-hover:text-white flex items-center gap-1"
                >
                  <span>Explore Specs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#de4a2c]" />
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-[#de4a2c]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free Sample Test Drive Dropzone */}
      <section id="test-drive" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="rounded-[32px] p-8 sm:p-12 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/15 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold text-[#de4a2c] uppercase tracking-wider">
                NO COMMITMENT TRIAL
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Submit 3 RAW Files for Free Retouching
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Experience our 300% zoom vector clipping, ghost mannequin draps, or jewelry polish directly on your catalog assets with zero obligation.
              </p>
              <div className="flex items-center gap-4 pt-2 text-xs text-neutral-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Strict NDA Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#de4a2c]" />
                  <span>4-12hr Turnaround</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              {!submitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-3 p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md"
                >
                  <div className="border-2 border-dashed border-white/20 hover:border-[#de4a2c] rounded-xl p-8 text-center cursor-pointer transition-colors bg-white/[0.02]">
                    <Upload className="w-8 h-8 text-[#de4a2c] mx-auto mb-2" />
                    <div className="text-sm font-bold text-white">Drop up to 3 RAW images</div>
                    <div className="text-xs text-neutral-500 mt-0.5">PSD, TIFF, CR3, RAW or JPG</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Brand or Studio Name"
                      className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#de4a2c]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Work Email"
                      className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#de4a2c]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold text-sm tracking-wide transition-colors shadow-lg"
                  >
                    Request Free Master Batch
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-white space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold">RAW Files Enqueued for Production</h3>
                  <p className="text-xs text-neutral-300">
                    Our lead retoucher will email your finished PSD and web files within guaranteed SLA.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

