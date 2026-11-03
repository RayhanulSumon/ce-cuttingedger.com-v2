import React, { useState } from 'react';
import { Sparkles, Check, Copy, CheckCircle2, ChevronUp, ChevronDown, Palette } from 'lucide-react';

export type ServicePageVariant =
  | 'glassmorphic'
  | 'editorial'
  | 'parallax'
  | 'slider-showcase'
  | 'obsidian'
  | 'bento-grid'
  | 'split-canvas'
  | 'perspective-3d'
  | 'visual-wall'
  | 'lookbook-stream';

export interface VariantOption {
  id: ServicePageVariant;
  num: string;
  name: string;
  tagline: string;
  badge: string;
  accent: string;
}

export const VARIANT_OPTIONS: VariantOption[] = [
  {
    id: 'glassmorphic',
    num: '01',
    name: 'Glassmorphic Pure',
    tagline: 'Lumina Atelier (Frosted Glass Banner, 3x Vector Loupe, Light Luxury)',
    badge: 'FROSTED GLASS',
    accent: '#0284C7'
  },
  {
    id: 'editorial',
    num: '02',
    name: 'Editorial Lookbook',
    tagline: 'Vogue / SSENSE High-Fashion (Editorial Typography, Atelier Dossier)',
    badge: 'FASHION ATELIER',
    accent: '#D97706'
  },
  {
    id: 'parallax',
    num: '03',
    name: 'Parallax Horizon',
    tagline: 'Kinetic Depth Studio (3-Layer Tilt Banner, Horizon Split Slider)',
    badge: 'PARALLAX DEPTH',
    accent: '#B45309'
  },
  {
    id: 'slider-showcase',
    num: '04',
    name: 'Cinematic Slider',
    tagline: 'Luxe Carousel Showcase (Auto-Play Hero Banner, Under-Portfolio Grid)',
    badge: 'VISUAL SLIDER',
    accent: '#2563EB'
  },
  {
    id: 'obsidian',
    num: '05',
    name: 'Dark Obsidian',
    tagline: 'Obsidian Velvet Craft (Ambient Radial Glow, Translucent Glass HUD)',
    badge: 'OBSIDIAN LUXURY',
    accent: '#8B5CF6'
  },
  {
    id: 'bento-grid',
    num: '06',
    name: 'Visual Bento Atelier',
    tagline: 'Modular Image Grid (Live Backdrop Color Switcher, Texture Archive)',
    badge: 'BENTO ARCHITECTURE',
    accent: '#7C3AED'
  },
  {
    id: 'split-canvas',
    num: '07',
    name: 'Interactive Split Canvas',
    tagline: 'Precision Workbench (0-100% Draggable Divider, Vector Nodes Overlay)',
    badge: 'SPLIT WORKBENCH',
    accent: '#0D9488'
  },
  {
    id: 'perspective-3d',
    num: '08',
    name: '3D Perspective Gallery',
    tagline: 'Spatial Depth Studio (Interactive 4-Layer 3D Exploder, Tilt Canvas)',
    badge: '3D EXPLODER',
    accent: '#4F46E5'
  },
  {
    id: 'visual-wall',
    num: '09',
    name: 'Minimalist Visual Wall',
    tagline: 'Exhibition Gallery (Wall-to-Wall Curated Photography, Minimal Text)',
    badge: 'GALLERY WALL',
    accent: '#475569'
  },
  {
    id: 'lookbook-stream',
    num: '10',
    name: 'Studio Lookbook Stream',
    tagline: 'Runway Lookbook Stream (Live Colorway Render Swatches, Instant Batch)',
    badge: 'RUNWAY STREAM',
    accent: '#E11D48'
  }
];

interface VariantSwitcherProps {
  currentVariant: ServicePageVariant;
  onSelectVariant: (variant: ServicePageVariant) => void;
  serviceTitle: string;
}

export const VariantSwitcher: React.FC<VariantSwitcherProps> = ({
  currentVariant,
  onSelectVariant,
  serviceTitle
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmedDesign, setConfirmedDesign] = useState<string | null>(null);

  const activeOption = VARIANT_OPTIONS.find((v) => v.id === currentVariant) || VARIANT_OPTIONS[0];

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('v', currentVariant);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleConfirmDesign = () => {
    setConfirmedDesign(activeOption.name);
    setTimeout(() => setConfirmedDesign(null), 3500);
  };

  return (
    <>
      {/* Floating Modern Pill Dock at Bottom */}
      <div className="fixed bottom-5 inset-x-0 z-50 flex flex-col items-center pointer-events-none px-4">
        {/* Confirmed Toast Notification */}
        {confirmedDesign && (
          <div className="mb-3 px-5 py-2.5 rounded-full bg-[#0F0F12] text-white border border-emerald-500/50 shadow-2xl flex items-center gap-2.5 text-xs font-bold pointer-events-auto animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Selected <span className="text-emerald-400 font-extrabold">{confirmedDesign}</span> as your preferred service layout!
            </span>
          </div>
        )}

        {/* The Dock Card */}
        <div className="pointer-events-auto max-w-5xl w-full bg-[#0F0F12]/95 backdrop-blur-2xl text-white rounded-2xl sm:rounded-full border border-white/15 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 py-1">
            {/* Left Status & Switcher Label */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-neutral-300">Layout Variant:</span>
                <span className="text-white bg-white/10 px-2 py-0.5 rounded-md font-mono text-[11px]">
                  {activeOption.num} / 10
                </span>
              </div>
            </div>

            {/* Middle Quick Option Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full py-1">
              {VARIANT_OPTIONS.map((opt) => {
                const isActive = opt.id === currentVariant;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSelectVariant(opt.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-black shadow-lg scale-105 font-bold'
                        : 'text-neutral-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-60">{opt.num}</span>
                    <span>{opt.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Tools: Expand Details & Copy Link */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors flex items-center gap-1 text-neutral-200"
                title="Copy shareable link with this variant active"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1"
                title="View full design breakdown & compare options"
              >
                <span>Compare</span>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expanded Drawer: All 10 Design Profiles */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-white/10 px-3 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-200 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center justify-between">
                <span>Select from 10 Production Layout Strategies:</span>
                <span className="text-emerald-400 font-bold">Image-Dominant & Interactive</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {VARIANT_OPTIONS.map((opt) => {
                  const isSelected = opt.id === currentVariant;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        onSelectVariant(opt.id);
                      }}
                      className={`cursor-pointer rounded-xl p-3 border transition-all text-left relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white/15 border-emerald-400/80 shadow-md ring-1 ring-emerald-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono text-[10px] text-neutral-400">{opt.num}</span>
                          <span
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider"
                            style={{ backgroundColor: `${opt.accent}25`, color: opt.accent }}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <div className="font-bold text-xs text-white mb-1">{opt.name}</div>
                        <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">{opt.tagline}</p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                        {isSelected ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> ACTIVE
                          </span>
                        ) : (
                          <span className="text-neutral-400 hover:text-white">Switch layout →</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span className="truncate">
                  Evaluating layout for: <span className="text-white font-semibold">{serviceTitle}</span>
                </span>
                <button
                  type="button"
                  onClick={handleConfirmDesign}
                  className="shrink-0 px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-md"
                >
                  Confirm Choice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
