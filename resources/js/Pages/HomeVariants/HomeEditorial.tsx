import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Scissors,
  Layers,
  CheckCircle2,
  BookOpen
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

const EDITORIAL_STORIES = [
  {
    edition: 'STORY 01',
    category: 'Haute Horlogerie',
    title: 'The Geometry of Specular Reflections',
    excerpt:
      'Macro bezel isolation and anti-reflective crystal balance for master chronographs, preserving authentic metal grain while eliminating stray studio glare.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    href: '/services/ecommerce-catalog-optimization'
  },
  {
    edition: 'STORY 02',
    category: 'Haute Couture & Knits',
    title: 'Ghost Mannequin & Sculptural Drape',
    excerpt:
      'Anatomical 3D inner neckline compositing that honors garment weight and natural fabric elasticity without the artificial flatness of basic cutout masks.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    href: '/services/ghost-mannequin-service'
  },
  {
    edition: 'STORY 03',
    category: 'Fine Leather Goods',
    title: 'Surgical Pen-Tool Silhouetting',
    excerpt:
      'Every stitch, handle contour, and brass clasp manually outlined with high-order Bézier curves at 300% zoom to guarantee zero halo on high-res displays.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    href: '/services/ecommerce-catalog-optimization/clipping-path-service'
  }
];

export function HomeEditorial({ clients = [] }: HomeProps) {
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1D1B16] selection:bg-[#de4a2c] selection:text-white font-serif antialiased overflow-x-hidden">
      {/* Editorial Top Masthead Bar */}
      <header className="border-b border-[#E2DED4] pt-8 pb-4 px-6 sm:px-12 max-w-7xl mx-auto font-sans">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#787367]">
          <span>Issue No. 04 — Global Digital Atelier</span>
          <span className="hidden md:inline">Post-Production • Retouching • Catalog Art</span>
          <span className="text-[#de4a2c] font-bold">Accent: #DE4A2C</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Editorial Statement */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#de4a2c] inline-block">
              ATELIER PHILOSOPHY & DISCIPLINE
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#16140F] leading-[1.05]">
              The Art of Visual{' '}
              <em className="italic font-serif text-[#de4a2c]">Refinement</em>.
            </h1>
            <p className="text-base sm:text-lg text-[#5A564C] font-sans leading-relaxed max-w-xl">
              Where high-fashion artisanal standards merge seamlessly with enterprise catalog scale. Hand-crafted pen-tool paths and invisible mannequin compositing for discerning digital ateliers.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4 font-sans">
              <a
                href="#trial"
                className="px-7 py-3.5 rounded-full bg-[#16140F] hover:bg-[#de4a2c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
              >
                <span>Request Sample Batch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="#stories"
                className="px-6 py-3.5 rounded-full border border-[#D5D0C2] hover:border-[#16140F] text-[#16140F] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Read Stories
              </a>
            </div>
          </div>

          {/* Right Column: Featured Still Life Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E5E0D4] bg-white">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85"
                alt="Editorial Still Life Product"
                className="w-full h-[460px] object-cover"
              />
              <div className="p-5 font-sans border-t border-[#E5E0D4] bg-[#F7F5F0]/90 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#de4a2c] uppercase font-bold tracking-wider">
                    PLATE REF. 01 — RUNNER
                  </div>
                  <div className="text-xs font-bold text-[#16140F] mt-0.5">
                    Multi-Layer Studio Cutout & Ground Shadow
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#787367]">12H EXPRESS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Client Logotype Rule */}
      <section className="border-y border-[#E2DED4] py-6 font-sans">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-6 text-[#787367] text-xs font-mono font-bold tracking-widest uppercase">
          {(clients.length > 0 ? clients.map((c) => c.name) : LUXURY_BRANDS).slice(0, 8).map((b, i) => (
            <span key={i} className="hover:text-[#16140F] transition-colors">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Editorial Stories Section */}
      <section id="stories" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto font-sans">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold block mb-2">
            CURATED TECHNIQUES
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#16140F]">
            The Atelier Chronicles
          </h2>
          <p className="text-sm text-[#5A564C] mt-3 leading-relaxed">
            A closer examination of the rigorous standards we apply across apparel, timepieces, and accessories.
          </p>
        </div>

        <div className="space-y-16">
          {EDITORIAL_STORIES.map((story, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-16 border-b border-[#E2DED4] ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-[#E2DED4]">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-[360px] sm:h-[400px] object-cover hover:scale-102 transition-transform duration-700"
                  />
                </div>
              </div>

              <div className={`lg:col-span-6 space-y-4 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#de4a2c] font-bold uppercase tracking-wider">
                  <span>{story.edition}</span>
                  <span>•</span>
                  <span>{story.category}</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-serif text-[#16140F] leading-snug">
                  {story.title}
                </h3>
                <p className="text-sm text-[#5A564C] leading-relaxed">
                  {story.excerpt}
                </p>
                <div className="pt-2">
                  <Link
                    href={story.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#16140F] hover:text-[#de4a2c] transition-colors"
                  >
                    <span>Inspect Service Layout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trial Ingestion Card */}
      <section id="trial" className="py-20 px-6 sm:px-12 max-w-4xl mx-auto font-sans">
        <div className="rounded-3xl p-8 sm:p-12 bg-white border border-[#E2DED4] shadow-lg text-center space-y-5">
          <span className="text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold">
            COMPLIMENTARY WORKSHOP
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#16140F]">
            Commission Your Atelier Sample
          </h2>
          <p className="text-sm text-[#5A564C] max-w-lg mx-auto leading-relaxed">
            Forward your most challenging RAW product file. Our senior retouchers will hand-craft vector paths and return master print-ready assets within 12 hours.
          </p>

          {!emailSubmitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmailSubmitted(true);
              }}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter direct studio email..."
                className="flex-1 px-4 py-3 rounded-full bg-[#F7F5F0] border border-[#D5D0C2] text-sm text-[#16140F] placeholder-[#8C877A] focus:outline-none focus:border-[#de4a2c]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#16140F] hover:bg-[#de4a2c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Begin Trial
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Invitation dispatched. Our production director will reply shortly.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

