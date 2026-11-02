import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Sparkles, Eye, Grid, BookOpen, Camera, Check } from 'lucide-react';

interface HomeVariantSwitcherProps {
  currentVariant: string;
  onVariantChange?: (variantId: string) => void;
}

export const HOME_VARIANTS = [
  {
    id: '1',
    name: 'Original Studio',
    badge: 'DEFAULT',
    tagline: 'Full original studio homepage with interactive lab, split-slider & bento',
    accentColor: '#10b981',
    bgTone: 'Studio Light #F8F9FA',
    icon: Sparkles
  },
  {
    id: '2',
    name: 'AI Visual Engine',
    badge: 'IMAGE FIRST',
    tagline: 'Image-first illustration of the 5 AI & retouching services with live before/after stages',
    accentColor: '#de4a2c',
    bgTone: 'Dark Stage #08090C',
    icon: Eye
  },
  {
    id: '3',
    name: 'Portfolio Dark',
    badge: 'DARK MASONRY',
    tagline: 'Filterable case studies gallery with peek raw overlay & full-screen comparison modal',
    accentColor: '#de4a2c',
    bgTone: 'Obsidian Gallery #07080B',
    icon: Grid
  },
  {
    id: '4',
    name: 'Editorial Atelier',
    badge: 'SSENSE / VOGUE',
    tagline: 'Warm paper editorial with serif typography, story cards & masthead styling',
    accentColor: '#de4a2c',
    bgTone: 'Warm Paper #F7F5F0',
    icon: BookOpen
  },
  {
    id: '5',
    name: 'Photo Lookbook',
    badge: 'LIGHT LUXE',
    tagline: 'Clean white photo-first portfolio lookbook with live comparison slider modal',
    accentColor: '#de4a2c',
    bgTone: 'Pure Light #FBFBFA',
    icon: Camera
  }
];

export function HomeVariantSwitcher({ currentVariant, onVariantChange }: HomeVariantSwitcherProps) {
  const [selected, setSelected] = useState(currentVariant || '1');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentVariant) {
      setSelected(currentVariant);
    }
  }, [currentVariant]);

  const handleSelect = (id: string) => {
    setSelected(id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ce_home_variant', id);
      } catch (e) {
        // Ignore storage errors
      }
    }
    if (onVariantChange) {
      onVariantChange(id);
    } else {
      router.get(window.location.pathname, { v: id }, {
        preserveState: false,
        preserveScroll: true,
        replace: true
      });
    }
  };

  const currentVariantObj = HOME_VARIANTS.find((v) => v.id === selected) || HOME_VARIANTS[0];

  return (
    <aside
      aria-label="Homepage prototype layout switcher"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-[95vw] pointer-events-auto"
    >
      {/* Expanded Variant Drawer */}
      {isExpanded && (
        <div className="w-[660px] max-w-[95vw] rounded-2xl p-4 bg-[#0d0e14]/95 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 text-white mb-1">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#de4a2c] animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                5 Homepage Prototype Layouts
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              Active: <code className="text-[#de4a2c] font-bold">0{currentVariantObj.id} {currentVariantObj.name}</code>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {HOME_VARIANTS.map((variant) => {
              const isCurrent = variant.id === selected;
              const IconComp = variant.icon;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => handleSelect(variant.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                    isCurrent
                      ? 'bg-white/10 border-[#de4a2c] shadow-[0_0_20px_rgba(222,74,44,0.3)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06]'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#de4a2c] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 text-neutral-300 mb-2">
                    <IconComp className="w-3.5 h-3.5" style={{ color: '#de4a2c' }} />
                    <span className="text-[10px] font-mono font-bold">0{variant.id}</span>
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white leading-tight">
                      {variant.name}
                    </div>
                    <div className="text-[9px] font-mono text-neutral-400 mt-1 line-clamp-1">
                      {variant.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Dock Capsule */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0d0e14]/90 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl text-white">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/10 transition-colors text-xs font-mono"
          title="Click to toggle prototype menu"
        >
          <span className="w-2 h-2 rounded-full bg-[#de4a2c] animate-pulse" />
          <span className="font-bold text-neutral-200">
            Home 0{currentVariantObj.id}:
          </span>
          <span className="text-[#de4a2c] font-semibold hidden sm:inline">
            {currentVariantObj.name}
          </span>
        </button>

        <div className="h-4 w-[1px] bg-white/15" />

        <div className="flex items-center gap-1">
          {HOME_VARIANTS.map((v) => {
            const isCurrent = v.id === selected;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelect(v.id)}
                className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-[#de4a2c] text-white shadow-[0_0_12px_rgba(222,74,44,0.6)] scale-105'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title={`${v.name} - ${v.tagline}`}
              >
                0{v.id}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
