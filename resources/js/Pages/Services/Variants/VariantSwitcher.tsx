import React, { useState } from 'react';
import { Sparkles, Check, Copy, CheckCircle2, ChevronUp, ChevronDown, Palette } from 'lucide-react';

export type ServicePageVariant = 'minimalist' | 'editorial' | 'technical' | 'conversion' | 'obsidian';

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
    id: 'minimalist',
    num: '01',
    name: 'Minimalist Studio',
    tagline: 'Apple Pro / Aesop Studio Luxury (Airy #F8F9FA, Clean Cards)',
    badge: 'LUXURY CLEAN',
    accent: '#10B981'
  },
  {
    id: 'editorial',
    num: '02',
    name: 'Editorial Lookbook',
    tagline: 'Vogue / SSENSE High-Fashion (Editorial Typography, Serif Pull Quotes)',
    badge: 'FASHION ATELIER',
    accent: '#D97706'
  },
  {
    id: 'technical',
    num: '03',
    name: 'Technical Lab',
    tagline: 'Linear / Figma Workbench (Blueprint Grid, Monospace Specs HUD)',
    badge: 'SPEC WORKBENCH',
    accent: '#06B6D4'
  },
  {
    id: 'conversion',
    num: '04',
    name: 'High-Conversion',
    tagline: 'Shopify Plus / SaaS Engine (Dropzone Hero, Trust Scores, SLA Guarantee)',
    badge: 'HIGH-VELOCITY E-COM',
    accent: '#2563EB'
  },
  {
    id: 'obsidian',
    num: '05',
    name: 'Dark Obsidian',
    tagline: 'Obsidian Velvet Craft (Ambient Radial Glow, Translucent Glass Cards)',
    badge: 'OBSIDIAN LUXURY',
    accent: '#8B5CF6'
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
        <div className="pointer-events-auto max-w-4xl w-full bg-[#0F0F12]/95 backdrop-blur-2xl text-white rounded-2xl sm:rounded-full border border-white/15 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 py-1">
            {/* Left Status & Switcher Label */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-neutral-300">Layout Variant:</span>
                <span className="text-white bg-white/10 px-2 py-0.5 rounded-md font-mono text-[11px]">
                  {activeOption.num} / 05
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
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-[#0F0F12] shadow-md scale-105'
                        : 'text-neutral-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: opt.accent }}
                    />
                    <span>{opt.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Action Tools: Copy & Select */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Copy shareable link with this layout variant"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{copied ? 'Copied' : 'Share Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmDesign}
                className="px-3.5 py-1.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#0F0F12] text-xs font-extrabold transition-all shadow-sm flex items-center gap-1"
                title="Select this layout style"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Select This</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

