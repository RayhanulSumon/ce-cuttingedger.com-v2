import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowUpRight,
  ArrowRight,
  SlidersHorizontal,
  Upload,
  CheckCircle2,
  Maximize2,
  X,
  Check,
  Wand2,
  Palette,
  Sun,
  Scissors,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  FileCode,
  Eye,
  EyeOff,
  ChevronDown,
  HelpCircle,
  Clock,
  Sparkle
} from 'lucide-react';

// ==========================================
// 1. FULL-WIDTH ROUNDED HERO SHOWCASE DATA (NO PRICES)
// ==========================================
const HERO_SHOWCASE_PLATES = [
  {
    id: 'footwear',
    category: 'Footwear',
    badge: 'PRECISION PEN-TOOL PATH',
    title: 'Multi-Path Cutout & Ground Shadow',
    metric: '300% Zoom Edge Accuracy • Dynamic Studio Shadow',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=85',
    rawFilter: 'brightness(0.78) contrast(0.8) saturate(0.45) sepia(0.15)',
    doneFilter: 'brightness(1.05) contrast(1.1) saturate(1.14) drop-shadow(0 28px 26px rgba(15,15,18,0.22))',
    tintColor: '#EEF2FF',
    href: '/services/ecommerce-catalog-optimization/clipping-path-service'
  },
  {
    id: 'apparel',
    category: 'Apparel',
    badge: '3D GHOST MANNEQUIN',
    title: 'Invisible Mannequin & Garment Drape',
    metric: 'Natural Volume • Zero Halo Cutout',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85',
    rawFilter: 'brightness(0.75) contrast(0.82) saturate(0.5) sepia(0.12)',
    doneFilter: 'brightness(1.04) contrast(1.08) saturate(1.1)',
    tintColor: '#EAE6DF',
    href: '/services/ghost-mannequin-service'
  },
  {
    id: 'jewelry',
    category: 'Jewelry',
    badge: 'MACRO FOCUS STACKING',
    title: 'Micro-Dust Removal & Gem Brilliance',
    metric: 'Prong Rebuild • Metal Specular Polish',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1800&q=85',
    rawFilter: 'brightness(0.7) contrast(0.78) grayscale(0.45)',
    doneFilter: 'brightness(1.08) contrast(1.15) saturate(1.08)',
    tintColor: '#F3F4F6',
    href: '/services/ecommerce-catalog-optimization'
  },
  {
    id: 'hardgoods',
    category: 'Cosmetics',
    badge: 'SPECULAR & REFLECTION GRADE',
    title: 'Glass Reflection & Label Rebuild',
    metric: 'Clean Highlights • Exact Color Match',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1800&q=85',
    rawFilter: 'brightness(0.76) contrast(0.82) saturate(0.5)',
    doneFilter: 'brightness(1.06) contrast(1.12) saturate(1.1)',
    tintColor: '#FDF2F8',
    href: '/services/color-standardization'
  }
];

// Fallback Luxury Client Logotypes
const LUXURY_BRAND_SILHOUETTES = [
  'BALENCIAGA',
  'CARTIER',
  'SSENSE',
  'FARFETCH',
  'KITH',
  'JIL SANDER',
  'ACNE STUDIOS',
  'MONCLER'
];

// ==========================================
// 2. 5-PANEL EXPANDING IMAGE ACCORDION
// ==========================================
const ACCORDION_PANELS = [
  {
    id: 'acc-1',
    tag: 'PRECISION PATH',
    title: 'Precision Clipping',
    metric: '100% Hand-Drawn Pen Tool Paths',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.75) contrast(0.82) saturate(0.45) sepia(0.2)',
    href: '/services/ecommerce-catalog-optimization/clipping-path-service'
  },
  {
    id: 'acc-2',
    tag: 'APPAREL STUDIO',
    title: '3D Ghost Mannequin',
    metric: 'Symmetrical Drape',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.74) contrast(0.8) saturate(0.5)',
    href: '/services/ghost-mannequin-service'
  },
  {
    id: 'acc-3',
    tag: 'LUXURY MACRO',
    title: 'Fine Jewelry Polish',
    metric: 'Gem & Metal Clarity',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.72) contrast(0.78) grayscale(0.45)',
    href: '/services/ecommerce-catalog-optimization'
  },
  {
    id: 'acc-4',
    tag: 'COLOR ACCURACY',
    title: 'Multi-SKU Recolor',
    metric: 'Zero Reshoot Needed',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'hue-rotate(140deg) brightness(0.82) saturate(0.75)',
    href: '/services/apparel-colorway-generation'
  },
  {
    id: 'acc-5',
    tag: 'SPECULAR FINISH',
    title: 'Cosmetics & Glass',
    metric: 'Specular Highlights',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.75) contrast(0.82) saturate(0.55)',
    href: '/services/color-standardization'
  }
];

// ==========================================
// 3. CURATED BENTO LOOKBOOK CARDS
// ==========================================
const BENTO_PORTFOLIO = [
  {
    id: 'bento-1',
    span: 'lg:col-span-7',
    height: 'h-[420px]',
    tag: 'FOOTWEAR COMPOSITE',
    title: 'Dynamic Levitation & Floor Shadow',
    turnaround: '6h Express Turnaround',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85',
    rawFilter: 'brightness(0.76) contrast(0.82) saturate(0.45) sepia(0.15)',
    href: '/services/ecommerce-catalog-optimization/clipping-path-service'
  },
  {
    id: 'bento-2',
    span: 'lg:col-span-5',
    height: 'h-[420px]',
    tag: 'HOROLOGY & METALS',
    title: 'Chronograph Anti-Glare Polish',
    turnaround: '12h Studio SLA',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.72) contrast(0.78) saturate(0.4)',
    href: '/services/ecommerce-catalog-optimization'
  },
  {
    id: 'bento-3',
    span: 'lg:col-span-5',
    height: 'h-[420px]',
    tag: 'BOTANICAL & GLASS',
    title: 'Translucent Glass & Drop Refraction',
    turnaround: '12h Studio SLA',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.75) contrast(0.8) grayscale(0.45)',
    href: '/services/color-standardization'
  },
  {
    id: 'bento-4',
    span: 'lg:col-span-7',
    height: 'h-[420px]',
    tag: 'HIGH-FASHION EDITORIAL',
    title: 'Color Grading & Fabric Texture Recovery',
    turnaround: 'Custom Campaign SLA',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
    rawFilter: 'brightness(0.74) contrast(0.8) saturate(0.5)',
    href: '/services/ghost-mannequin-service'
  }
];

// ==========================================
// 3B. INTERACTIVE PRODUCTION GALLERY ITEMS
// ==========================================
interface GalleryItem {
  id: string;
  category: 'headshots' | 'fashion' | 'tryon' | 'product' | 'retouch';
  categoryLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  turnaround: string;
  beforeImg: string;
  afterImg: string;
  specs: string[];
  rawLabel: string;
  editedLabel: string;
  href: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-headshot-1',
    category: 'headshots',
    categoryLabel: 'AI Corporate Headshots',
    badge: 'C-SUITE EXECUTIVE',
    title: 'Executive Studio Portrait From 5 Mobile Selfies',
    subtitle: 'Casual smartphone photos transformed into high-tier editorial corporate portraits with matching brand lighting.',
    turnaround: '4h Studio SLA',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
    specs: ['Studio Rim Lighting', 'Tailored Blazer Drape', 'Natural Micro-Skin Texture'],
    rawLabel: 'Unedited Smartphone Capture',
    editedLabel: '8K Editorial Studio Master',
    href: '/services/ecommerce-catalog-optimization'
  },
  {
    id: 'gal-fashion-1',
    category: 'fashion',
    categoryLabel: 'AI Fashion Runway',
    badge: 'HAUTE COUTURE CATWALK',
    title: 'Runway Lookbook & Volumetric Silk Drape',
    subtitle: 'Flat-lay ghost mannequin garment converted into a Paris Fashion Week runway model with fluid textile physics.',
    turnaround: '6h Studio SLA',
    beforeImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    specs: ['Volumetric Fabric Drape', 'Catwalk Lighting', 'Preserved Seam Stitches'],
    rawLabel: 'Flat-Lay Mannequin Input',
    editedLabel: 'High-Fashion Catwalk Render',
    href: '/services/ghost-mannequin-service'
  },
  {
    id: 'gal-tryon-1',
    category: 'tryon',
    categoryLabel: '3D Virtual Try-On',
    badge: 'DENIM & JACKET FITTING',
    title: 'Multi-Body Garment Mesh & Wrinkle Simulation',
    subtitle: 'Flat garment technical packs dynamically simulated onto diverse 3D human silhouettes with real physical tension.',
    turnaround: '8h Studio SLA',
    beforeImg: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    specs: ['Tension & Crease Map', 'Multi-Size Geometry', 'Realistic Drop Shadow'],
    rawLabel: 'Ghost Cutout Garment',
    editedLabel: '3D Physics Drape Fit',
    href: '/services/ghost-mannequin-service'
  },
  {
    id: 'gal-product-1',
    category: 'product',
    categoryLabel: 'Product Scene Gen',
    badge: 'LUXURY FRAGRANCE & CAUSTICS',
    title: 'Hyper-Real Botanical Wet Plate Environment',
    subtitle: 'Isolated fragrance bottle composited into a photorealistic botanical studio scene with optical glass caustics.',
    turnaround: '4h Studio SLA',
    beforeImg: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    specs: ['Raytraced Refraction', 'Optical Dispersion', 'Specular Balance'],
    rawLabel: 'White Cyc Raw Plate',
    editedLabel: 'Raytraced Botanical Scene',
    href: '/services/color-standardization'
  },
  {
    id: 'gal-retouch-1',
    category: 'retouch',
    categoryLabel: 'Precision Pen Retouch',
    badge: '100% HAND-DRAWN BÉZIER',
    title: 'Multi-Material Sneaker & Dynamic Studio Shadow',
    subtitle: 'Pixel-perfect sub-pixel pen paths isolating mesh, leather, and eyelets with realistic floating ground shadow.',
    turnaround: '2h Rush SLA',
    beforeImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=70',
    afterImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=95',
    specs: ['Sub-Pixel Anchor Curves', 'Dedicated Path Layers', 'Multi-Layer PSD'],
    rawLabel: 'Raw Studio Sensor Capture',
    editedLabel: 'Vector Cutout & Custom Shadow',
    href: '/services/ecommerce-catalog-optimization/clipping-path-service'
  },
  {
    id: 'gal-retouch-2',
    category: 'retouch',
    categoryLabel: 'Precision Pen Retouch',
    badge: 'STEEL & SAPPHIRE POLISH',
    title: 'Anti-Glare Chronograph Micro-Scratch Removal',
    subtitle: 'Brushed stainless steel bezel restored to flawless factory luster while preserving genuine brushed grain.',
    turnaround: '6h Studio SLA',
    beforeImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=75',
    afterImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=95',
    specs: ['Bezel Glare Suppression', 'Preserved Brush Grain', 'Dial Contrast Enhancement'],
    rawLabel: 'Scratched Unpolished Sample',
    editedLabel: 'Flawless Sapphire Studio Finish',
    href: '/services/ecommerce-catalog-optimization'
  }
];

// ==========================================
// 3C. ENTERPRISE FREQUENTLY ASKED QUESTIONS
// ==========================================
const FAQ_ITEMS = [
  {
    id: 'faq-turnaround',
    category: 'Turnaround & Volume',
    question: 'What turnaround SLAs do you guarantee for large-volume e-commerce catalogs?',
    answer: 'Standard enterprise production runs are delivered within 12 to 24 hours depending on batch volume. For high-urgency editorial launches, runway drops, or daily commercial shoots, our 6-Hour Express Desk operates around the clock with dedicated senior retouchers assigned to your account.'
  },
  {
    id: 'faq-clipping',
    category: 'Technical Precision',
    question: 'Are all clipping paths truly 100% hand-drawn with the Photoshop Pen Tool?',
    answer: 'Yes, without exception. Every single vector clipping path is plotted manually by seasoned digital artists at 300% zoom using Photoshop’s Pen Tool with smooth Bézier anchor points. We never use automated wand tools, quick selection, or AI masks that produce ragged, amateur edges.'
  },
  {
    id: 'faq-security',
    category: 'Confidentiality & NDA',
    question: 'How does CuttingEdger safeguard unreleased product lines and proprietary prototypes?',
    answer: 'We operate under strict bilateral enterprise NDAs. All client assets are transferred via TLS-encrypted connections directly into isolated staging buckets with role-based access control. No client imagery is ever fed into public generative model training pools or shared with third parties.'
  },
  {
    id: 'faq-artdirection',
    category: 'Color & Grading',
    question: 'Can your team match our in-house art direction and calibrated LUT profiles?',
    answer: 'Absolutely. During brand onboarding, we ingest your calibrated color profiles (Display P3, Adobe RGB 1998, sRGB), 3D LUTs, lighting cheat-sheets, and master layer templates to guarantee 100% visual consistency across every single SKU and campaign.'
  },
  {
    id: 'faq-deliverables',
    category: 'File Formats',
    question: 'What master layer structures and deliverable formats do you provide?',
    answer: 'We deliver layered Master PSDs with cleanly labeled non-destructive adjustment groups, alpha masks, and vector paths. We also export calibrated 16-bit TIFFs, transparent PNGs, and compressed WebP / JPEG files formatted to your custom naming conventions and e-commerce CMS requirements.'
  },
  {
    id: 'faq-trial',
    category: 'Onboarding & Pilot',
    question: 'How does the complimentary 3-image production test work?',
    answer: 'Any commercial brand, creative agency, or high-volume e-commerce seller can submit up to 3 RAW images for a free proof. Our team will execute the complete retouching or AI generation workflow according to your guidelines and return production-ready masters within 6 hours—completely free and with zero obligation.'
  }
];

// ==========================================
// 4. STUDIO PRODUCTS & SWATCHES FOR LIVE STUDIO TESTER
// ==========================================
const STUDIO_PRODUCTS = [
  {
    id: 'footwear',
    label: 'Footwear',
    badge: 'ATHLETIC RUNNER',
    title: 'Performance Multi-Material Sneaker',
    turnaround: '12h Studio SLA',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.82) contrast(0.85) saturate(0.6)',
    swatches: [
      { name: 'Volt Mint', hue: 0, hex: '#10B981', code: 'SKU-VLT-01' },
      { name: 'Cobalt Blue', hue: 200, hex: '#2563EB', code: 'SKU-CBL-02' },
      { name: 'Crimson Pulse', hue: -120, hex: '#EF4444', code: 'SKU-CRM-03' },
      { name: 'Solar Amber', hue: 50, hex: '#F59E0B', code: 'SKU-AMB-04' },
      { name: 'Obsidian Noir', hue: 240, hex: '#374151', code: 'SKU-OBS-05' }
    ]
  },
  {
    id: 'timepiece',
    label: 'Horology',
    badge: 'LUXURY WATCH',
    title: 'Minimalist Steel Chronograph',
    turnaround: '12h Studio SLA',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.78) contrast(0.8) saturate(0.5)',
    swatches: [
      { name: 'Pure Platinum', hue: 0, hex: '#94A3B8', code: 'SKU-PLT-01' },
      { name: 'Midnight Navy', hue: 210, hex: '#1E3A8A', code: 'SKU-NVY-02' },
      { name: 'Rose Metallic', hue: -45, hex: '#FB7185', code: 'SKU-RSG-03' },
      { name: 'Emerald Sunray', hue: 130, hex: '#047857', code: 'SKU-EMR-04' },
      { name: 'Obsidian Black', hue: 0, hex: '#18181B', code: 'SKU-OBS-05' }
    ]
  },
  {
    id: 'fragrance',
    label: 'Cosmetics',
    badge: 'GLASS & LIQUID',
    title: 'Refractive Glass & Gold Atomizer',
    turnaround: '6h Express Pilot',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85',
    rawFilter: 'brightness(0.8) contrast(0.82) saturate(0.55)',
    swatches: [
      { name: 'Solar Amber', hue: 0, hex: '#F59E0B', code: 'SKU-AMB-01' },
      { name: 'Rose Petal', hue: 320, hex: '#EC4899', code: 'SKU-ROS-02' },
      { name: 'Glacier Mist', hue: 190, hex: '#06B6D4', code: 'SKU-GLC-03' },
      { name: 'Verdant Herbal', hue: 120, hex: '#10B981', code: 'SKU-VRD-04' },
      { name: 'Royal Plum', hue: 275, hex: '#8B5CF6', code: 'SKU-PLM-05' }
    ]
  }
];

const STUDIO_BACKDROPS = [
  { id: 'transparent', label: 'Alpha PNG', bgClass: 'checkerboard-subtle', dotColor: 'bg-neutral-300' },
  { id: 'white', label: 'E-Com #FFF', bgClass: 'bg-white', dotColor: 'bg-white border border-neutral-300' },
  { id: 'gray', label: 'Studio Neutral', bgClass: 'bg-[#F1F3F5]', dotColor: 'bg-neutral-300' },
  { id: 'dark', label: 'Charcoal Noir', bgClass: 'bg-[#0F0F12]', dotColor: 'bg-[#0F0F12]' }
] as const;

type StudioCanvasBackdrop = (typeof STUDIO_BACKDROPS)[number]['id'];

type StudioBackdropMode = 'master' | 'white' | 'gray' | 'black' | 'checker' | 'tint' | 'raw';

interface HomeProps {
  featuredProjects?: any[];
  services?: any[];
  teamMembers?: any[];
  testimonials?: any[];
  clients?: Array<{
    id: number;
    name: string;
    logo_dark?: string;
    logo_light?: string;
    url?: string;
  }>;
}

export function HomeOriginal({ clients = [] }: HomeProps) {
  // 1. Hero Interactive State
  const [heroTabIdx, setHeroTabIdx] = useState(0);
  const currentHero = HERO_SHOWCASE_PLATES[heroTabIdx] || HERO_SHOWCASE_PLATES[0];
  const [splitPos, setSplitPos] = useState(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [heroFinishMode, setHeroFinishMode] = useState<StudioBackdropMode>('master');
  const heroStageRef = useRef<HTMLDivElement>(null);

  // 2. Core Studio Capabilities (5-Panel Accordion State)
  const [expandedAccordion, setExpandedAccordion] = useState(1);
  const [accordionRawMap, setAccordionRawMap] = useState<Record<string, boolean>>({});

  // 3. Interactive Live Retouching Playground State
  const [activeStudioProductIdx, setActiveStudioProductIdx] = useState(0);
  const [activeStudioBackdrop, setActiveStudioBackdrop] = useState<StudioCanvasBackdrop>('transparent');
  const [layerCutout, setLayerCutout] = useState(true);
  const [layerShadow, setLayerShadow] = useState(true);
  const [shadowIntensity, setShadowIntensity] = useState(85);
  const [layerPolish, setLayerPolish] = useState(true);
  const [polishIntensity, setPolishIntensity] = useState(90);
  const [activeSwatchIdx, setActiveSwatchIdx] = useState(0);
  const [showVectorPath, setShowVectorPath] = useState(false);
  const [isPeekingRaw, setIsPeekingRaw] = useState(false);

  // 4. Bento Lookbook State
  const [globalRawMode, setGlobalRawMode] = useState(false);
  const [hoveredBentoId, setHoveredBentoId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<(typeof BENTO_PORTFOLIO)[number] | null>(null);

  // 5. Interactive Production Gallery & FAQ State
  const [activeGalleryCategory, setActiveGalleryCategory] = useState<string>('all');
  const [galleryRawCards, setGalleryRawCards] = useState<Record<string, boolean>>({});
  const [galleryLightbox, setGalleryLightbox] = useState<GalleryItem | null>(null);
  const [lightboxSplitPos, setLightboxSplitPos] = useState<number>(50);
  const [isDraggingLightboxSplit, setIsDraggingLightboxSplit] = useState(false);
  const lightboxStageRef = useRef<HTMLDivElement>(null);
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-turnaround', 'faq-clipping']);

  const toggleGalleryRaw = (id: string) => {
    setGalleryRawCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Lightbox Split Slider Dragging Logic
  const updateLightboxSplit = (clientX: number) => {
    if (!lightboxStageRef.current) return;
    const rect = lightboxStageRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(clientX - rect.left, rect.width - 10));
    setLightboxSplitPos((x / rect.width) * 100);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDraggingLightboxSplit) updateLightboxSplit(e.clientX);
    };
    const onTouch = (e: TouchEvent) => {
      if (isDraggingLightboxSplit && e.touches[0]) updateLightboxSplit(e.touches[0].clientX);
    };
    const onUp = () => setIsDraggingLightboxSplit(false);

    if (isDraggingLightboxSplit) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onTouch);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDraggingLightboxSplit]);

  // Filtered Gallery Items
  const filteredGalleryItems = useMemo(() => {
    if (activeGalleryCategory === 'all') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === activeGalleryCategory);
  }, [activeGalleryCategory]);

  // Intro Slider Glide Demo (Visually signals interactivity on load without text)
  useEffect(() => {
    let frameId: number;
    let start: number | null = null;
    const duration = 1400;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const offset = Math.sin(progress * Math.PI * 2) * 12;
        setSplitPos(50 + offset);
        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setSplitPos(50);
        }
      };
      frameId = requestAnimationFrame(step);
    }, 900);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // Handle Split Slider Dragging
  const updateSplitPosition = (clientX: number) => {
    if (!heroStageRef.current) return;
    const rect = heroStageRef.current.getBoundingClientRect();
    const x = Math.max(12, Math.min(clientX - rect.left, rect.width - 12));
    setSplitPos((x / rect.width) * 100);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDraggingSplit) updateSplitPosition(e.clientX);
    };
    const onTouch = (e: TouchEvent) => {
      if (isDraggingSplit && e.touches[0]) updateSplitPosition(e.touches[0].clientX);
    };
    const onUp = () => setIsDraggingSplit(false);

    if (isDraggingSplit) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onTouch);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDraggingSplit]);

  // Compute Live Playground Filter
  const currentStudioProduct =
    STUDIO_PRODUCTS[activeStudioProductIdx] || STUDIO_PRODUCTS[0];
  const currentStudioSwatch =
    currentStudioProduct.swatches[activeSwatchIdx] || currentStudioProduct.swatches[0];

  const getPlaygroundFilter = () => {
    if (isPeekingRaw) {
      return currentStudioProduct.rawFilter;
    }
    const hue = currentStudioSwatch.hue;

    let polishPart = 'brightness(1.0) contrast(1.0) saturate(1.0)';
    if (layerPolish) {
      const pScale = polishIntensity / 100;
      const b = (1 + 0.06 * pScale).toFixed(2);
      const c = (1 + 0.12 * pScale).toFixed(2);
      const s = (1 + 0.14 * pScale).toFixed(2);
      polishPart = `brightness(${b}) contrast(${c}) saturate(${s})`;
    } else {
      polishPart = 'brightness(0.85) contrast(0.86) saturate(0.65)';
    }

    let shadowPart = '';
    if (layerShadow) {
      const sScale = shadowIntensity / 100;
      const blur = Math.round(28 * sScale);
      const yOffset = Math.round(24 * sScale);
      const alpha = (0.28 * sScale).toFixed(2);
      shadowPart = `drop-shadow(0 ${yOffset}px ${blur}px rgba(15,15,18,${alpha}))`;
    }

    return `hue-rotate(${hue}deg) ${polishPart} ${shadowPart}`.trim();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F0F12] antialiased selection:bg-[#0F0F12] selection:text-white">
      <Head>
        <title>CuttingEdger — Creative Digital Post-Production Studio</title>
        <meta
          name="description"
          content="Visual post-production for modern brands. 3D ghost mannequin, precision clipping, jewelry polish, cosmetics, and multi-SKU colorways."
        />
      </Head>

      {/* ==========================================
          2. CLEAN ROUNDED VISUAL HERO STAGE
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-14">
        {/* 5 Single Page Design Layouts Live Showcase Ribbon */}
        <div className="mb-8 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold text-[#0F0F12]">5 Service Single Page Layouts:</span>
            <span className="text-neutral-500 hidden md:inline">Click to preview:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <Link
              href="/services/ecommerce-catalog-optimization/clipping-path-service?v=1"
              className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#0F0F12] text-neutral-700 hover:text-white font-bold transition-all text-[11px] flex items-center gap-1.5 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>01. Minimalist</span>
            </Link>
            <Link
              href="/services/ecommerce-catalog-optimization/clipping-path-service?v=2"
              className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#0F0F12] text-neutral-700 hover:text-white font-bold transition-all text-[11px] flex items-center gap-1.5 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>02. Editorial</span>
            </Link>
            <Link
              href="/services/ecommerce-catalog-optimization/clipping-path-service?v=3"
              className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#0F0F12] text-neutral-700 hover:text-white font-bold transition-all text-[11px] flex items-center gap-1.5 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>03. Technical</span>
            </Link>
            <Link
              href="/services/ecommerce-catalog-optimization/clipping-path-service?v=4"
              className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#0F0F12] text-neutral-700 hover:text-white font-bold transition-all text-[11px] flex items-center gap-1.5 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>04. Conversion</span>
            </Link>
            <Link
              href="/services/ecommerce-catalog-optimization/clipping-path-service?v=5"
              className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#0F0F12] text-neutral-700 hover:text-white font-bold transition-all text-[11px] flex items-center gap-1.5 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>05. Obsidian</span>
            </Link>
          </div>
        </div>

        {/* Editorial Centered Hero Header (Apple / Linear Luxury Design) */}
        <div className="text-center max-w-3xl mx-auto mb-9">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/80 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0F0F12]">
              DIGITAL POST-PRODUCTION STUDIO
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F0F12] leading-[1.08]">
            Visual Post-Production for Modern Brands.
          </h1>

          <p className="text-xs sm:text-base text-neutral-500 font-medium mt-3.5 max-w-xl mx-auto leading-relaxed">
            100% hand-drawn pen-tool vector paths, invisible ghost mannequin drape, and colorways with guaranteed 12-hour turnaround.
          </p>

          {/* Balanced Luxury Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="#gallery"
              className="px-6 py-3.5 rounded-full bg-[#0F0F12] text-white text-xs sm:text-sm font-extrabold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-[0_4px_16px_rgba(15,15,18,0.12)] hover:shadow-[0_8px_24px_rgba(15,15,18,0.2)]"
            >
              <span>Explore Production Gallery</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              href="/services/ecommerce-catalog-optimization/clipping-path-service?v=1"
              className="px-5 py-3.5 rounded-full bg-white text-neutral-700 hover:text-[#0F0F12] border border-neutral-200/80 text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <span>Explore 5 Service Layouts</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </Link>
          </div>
        </div>

        {/* Cinematic Rounded Visual Hero Stage (Pure Uncluttered Showcase) */}
        <div
          ref={heroStageRef}
          onMouseDown={(e) => {
            setIsDraggingSplit(true);
            updateSplitPosition(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDraggingSplit(true);
            if (e.touches[0]) updateSplitPosition(e.touches[0].clientX);
          }}
          className="relative w-full h-[470px] sm:h-[550px] rounded-[32px] overflow-hidden select-none cursor-ew-resize border border-neutral-200/80 shadow-[0_25px_60px_rgba(15,15,18,0.08)] bg-white"
        >
          {/* AFTER / STUDIO MASTER LAYER */}
          <div className="absolute inset-0 bg-[#F4F4F6]">
            <img
              key={`hero-after-${currentHero.id}`}
              src={currentHero.image}
              alt={currentHero.title}
              draggable="false"
              className="w-full h-full object-cover object-center transition-all duration-700"
              style={{ filter: currentHero.doneFilter }}
            />
          </div>

          {/* BEFORE / RAW CAPTURE LAYER (Clipped by Split Slider) */}
          <div
            className="absolute inset-0 overflow-hidden bg-[#D6D3CD]"
            style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
          >
            <img
              key={`hero-before-${currentHero.id}`}
              src={currentHero.image}
              alt="Unedited Raw"
              draggable="false"
              className="w-full h-full object-cover object-center transition-all duration-700"
              style={{ filter: currentHero.rawFilter }}
            />
            <span className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-extrabold tracking-wide">
              RAW CAPTURE
            </span>
          </div>

          {/* Center Tactile Split Divider with RAW | MASTER Badge */}
          <div
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.4)] pointer-events-none"
            style={{ left: `${splitPos}%` }}
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-white text-[#0F0F12] shadow-2xl flex items-center gap-1.5 border border-neutral-200 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
              <span>RAW</span>
              <span className="opacity-30">|</span>
              <span className="text-emerald-600 font-extrabold">MASTER</span>
            </div>
          </div>

          {/* Bottom Gradient & Typography Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white z-20"
          >
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                {currentHero.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                {currentHero.title}
              </h2>
              <span className="text-xs text-neutral-300 font-medium mt-1 flex flex-wrap items-center gap-2">
                <span>{currentHero.metric}</span>
                <span>•</span>
                <Link
                  href={currentHero.href}
                  className="text-emerald-300 hover:text-white font-extrabold underline flex items-center gap-0.5 transition-colors"
                >
                  <span>View Single Page</span>
                  <ArrowUpRight className="w-3 h-3 inline" />
                </Link>
              </span>
            </div>

            {/* Discreet Plate Switcher in Bottom Corner */}
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/20 self-start sm:self-auto">
              {HERO_SHOWCASE_PLATES.map((plate, index) => (
                <button
                  key={plate.id}
                  onClick={() => setHeroTabIdx(index)}
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                    heroTabIdx === index
                      ? 'bg-white text-[#0F0F12] shadow-sm'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {plate.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. CORE STUDIO CAPABILITIES (EXACT ACCORDION)
      ========================================== */}
      <section id="capabilities" className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]">
                Core Studio Capabilities
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-neutral-500">
              Hover or tap any vertical panel to expand • Click badge to flip RAW / DONE
            </p>
          </div>

          {/* 5-Panel Horizontal Expanding Strip */}
          <div className="flex flex-col lg:flex-row gap-3.5 h-auto lg:h-[500px]">
            {ACCORDION_PANELS.map((panel, idx) => {
              const isExpanded = expandedAccordion === idx;
              const isRaw = !!accordionRawMap[panel.id];

              return (
                <div
                  key={panel.id}
                  onMouseEnter={() => setExpandedAccordion(idx)}
                  onClick={() => setExpandedAccordion(idx)}
                  className={`relative rounded-[28px] overflow-hidden cursor-pointer transition-all duration-500 ease-out border border-neutral-200/80 bg-white ${
                    isExpanded
                      ? 'lg:flex-[3.5] h-[380px] lg:h-full shadow-xl'
                      : 'lg:flex-[1] h-[120px] lg:h-full opacity-95 hover:opacity-100'
                  }`}
                >
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className="w-full h-full object-cover object-center transition-all duration-500"
                    style={{
                      filter: isRaw ? panel.rawFilter : 'brightness(1.04) contrast(1.06)'
                    }}
                  />

                  {/* Smooth Dark Bottom Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  {/* Top-Right Interactive Pill */}
                  {isExpanded && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAccordionRawMap((prev) => ({
                          ...prev,
                          [panel.id]: !prev[panel.id]
                        }));
                      }}
                      className={`absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-md ${
                        isRaw
                          ? 'bg-amber-400 text-[#0F0F12]'
                          : 'bg-white text-[#0F0F12] hover:bg-neutral-100'
                      }`}
                    >
                      {isRaw ? 'Viewing: RAW' : 'Viewing: EDITED'}
                    </button>
                  )}

                  {/* Bottom Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                        {panel.tag}
                      </span>
                      <h3
                        className={`font-extrabold tracking-tight transition-all ${
                          isExpanded ? 'text-xl sm:text-2xl mt-0.5' : 'text-base'
                        }`}
                      >
                        {panel.title}
                      </h3>
                      {isExpanded && (
                        <span className="text-xs text-neutral-300 font-medium mt-1 block">
                          {panel.metric}
                        </span>
                      )}
                    </div>

                    {isExpanded && (
                      <Link
                        href={panel.href}
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-white text-[#0F0F12] flex items-center justify-center hover:bg-emerald-400 transition-colors shrink-0 shadow-md"
                        title={`Explore ${panel.title} Single Page`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. INTERACTIVE LIVE RETOUCHING PLAYGROUND
      ========================================== */}
      <section id="interactive-studio" className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600">
                  REAL-TIME POST-PRODUCTION PLAYGROUND
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]">
                Interactive Retouching Studio
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium text-neutral-500 max-w-md">
              Toggle non-destructive studio layers, test marketplace backdrops, and preview live SKU colorways in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Visual Canvas Card (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col rounded-[28px] bg-white border border-neutral-200/80 shadow-sm overflow-hidden">
              {/* Studio Canvas Top HUD Toolbar */}
              <div className="px-4 sm:px-6 py-3 border-b border-neutral-200/70 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md">
                {/* Product Category Switcher */}
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                  {STUDIO_PRODUCTS.map((prod, idx) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        setActiveStudioProductIdx(idx);
                        setActiveSwatchIdx(0);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                        activeStudioProductIdx === idx
                          ? 'bg-[#0F0F12] text-white shadow-xs'
                          : 'text-neutral-500 hover:text-[#0F0F12]'
                      }`}
                    >
                      {prod.label}
                    </button>
                  ))}
                </div>

                {/* Backdrop Switcher (Marketplace QA) */}
                <div className="flex items-center gap-1.5">
                  <span className="hidden sm:inline text-[11px] font-bold text-neutral-400 mr-0.5">
                    Stage:
                  </span>
                  {STUDIO_BACKDROPS.map((bd) => (
                    <button
                      key={bd.id}
                      type="button"
                      onClick={() => setActiveStudioBackdrop(bd.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                        activeStudioBackdrop === bd.id
                          ? 'bg-[#0F0F12] text-white border-[#0F0F12] shadow-xs'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                      }`}
                      title={bd.label}
                    >
                      <span className={`w-2 h-2 rounded-full ${bd.dotColor}`} />
                      <span className="hidden md:inline">{bd.label}</span>
                    </button>
                  ))}
                </div>

                {/* Compare RAW & Reset Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onMouseDown={() => setIsPeekingRaw(true)}
                    onMouseUp={() => setIsPeekingRaw(false)}
                    onTouchStart={() => setIsPeekingRaw(true)}
                    onTouchEnd={() => setIsPeekingRaw(false)}
                    onClick={() => setIsPeekingRaw((prev) => !prev)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      isPeekingRaw
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                    title="Click or hold to view unretouched RAW exposure"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {isPeekingRaw ? 'Viewing RAW' : 'Peek RAW'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLayerCutout(true);
                      setLayerShadow(true);
                      setLayerPolish(true);
                      setShadowIntensity(85);
                      setPolishIntensity(90);
                      setActiveSwatchIdx(0);
                      setShowVectorPath(false);
                      setIsPeekingRaw(false);
                      setActiveStudioBackdrop('transparent');
                    }}
                    className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-[#0F0F12] hover:bg-neutral-50 transition-colors"
                    title="Reset Studio Layers"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Visual Viewport Stage */}
              <div
                className={`relative h-[380px] sm:h-[440px] flex items-center justify-center p-6 overflow-hidden transition-colors duration-500 ${
                  isPeekingRaw
                    ? 'bg-[#D6D3CD]'
                    : layerCutout
                    ? STUDIO_BACKDROPS.find((b) => b.id === activeStudioBackdrop)?.bgClass || 'checkerboard-subtle'
                    : 'bg-[#D8D5CE]'
                }`}
              >
                {/* Product Image Stage */}
                <div className="relative max-w-full max-h-full flex items-center justify-center">
                  <img
                    src={currentStudioProduct.image}
                    alt={currentStudioProduct.title}
                    className={`max-h-[290px] sm:max-h-[340px] w-auto object-contain transition-all duration-300 ${
                      isPeekingRaw
                        ? 'scale-95'
                        : layerCutout
                        ? activeStudioBackdrop === 'dark'
                          ? 'scale-95'
                          : 'mix-blend-multiply scale-95'
                        : 'scale-100'
                    }`}
                    style={{ filter: getPlaygroundFilter() }}
                  />

                  {/* SVG Vector Path & Anchor Points Overlay */}
                  {showVectorPath && !isPeekingRaw && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
                      viewBox="0 0 400 300"
                      fill="none"
                    >
                      <path
                        d="M 60 170 C 60 120, 110 90, 190 85 C 260 80, 310 115, 340 160 C 355 185, 335 225, 290 230 C 220 235, 120 235, 75 220 C 65 210, 60 190, 60 170 Z"
                        stroke="#06B6D4"
                        strokeWidth="1.75"
                        strokeDasharray="4 3"
                      />
                      {[
                        { cx: 60, cy: 170 },
                        { cx: 120, cy: 92 },
                        { cx: 190, cy: 85 },
                        { cx: 260, cy: 110 },
                        { cx: 340, cy: 160 },
                        { cx: 330, cy: 215 },
                        { cx: 290, cy: 230 },
                        { cx: 180, cy: 233 },
                        { cx: 75, cy: 220 }
                      ].map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.cx} cy={pt.cy} r="4" fill="#06B6D4" stroke="#ffffff" strokeWidth="1.5" />
                          <circle cx={pt.cx} cy={pt.cy} r="6" fill="transparent" stroke="#06B6D4" strokeWidth="0.75" opacity="0.6" />
                        </g>
                      ))}
                      <line x1="190" y1="85" x2="160" y2="85" stroke="#06B6D4" strokeWidth="1" />
                      <line x1="190" y1="85" x2="220" y2="85" stroke="#06B6D4" strokeWidth="1" />
                      <circle cx="160" cy="85" r="2.5" fill="#ffffff" stroke="#06B6D4" strokeWidth="1" />
                      <circle cx="220" cy="85" r="2.5" fill="#ffffff" stroke="#06B6D4" strokeWidth="1" />
                    </svg>
                  )}
                </div>

                {/* RAW Mode Alert Banner */}
                {isPeekingRaw && (
                  <div className="absolute top-4 inset-x-0 mx-auto w-fit px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 animate-pulse">
                    <Eye className="w-3.5 h-3.5" />
                    <span>RAW Unretouched Exposure • All Filters Bypassed</span>
                  </div>
                )}

                {/* Bottom Canvas Specs Strip */}
                <div className="absolute inset-x-0 bottom-0 px-5 py-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-between text-white text-xs pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span className="font-extrabold text-white">
                      {currentStudioProduct.title}
                    </span>
                    <span className="hidden sm:inline text-white/70">• {currentStudioSwatch.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-white/80">
                    <span className="hidden md:inline">16-Bit ProPhoto RGB</span>
                    <span className="hidden sm:inline">300 DPI PSD</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold backdrop-blur-xs">
                      {layerCutout ? 'Vector Isolated' : 'Original Background'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Clean Layer Inspector Card (4 Cols) */}
            <div className="lg:col-span-4 rounded-[28px] bg-white border border-neutral-200/80 p-5 sm:p-6 flex flex-col justify-between shadow-sm space-y-4">
              <div className="space-y-3.5">
                {/* Inspector Header */}
                <div className="flex items-center justify-between pb-1 border-b border-neutral-200/60">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">
                      STUDIO INSPECTOR
                    </span>
                    <h3 className="text-base font-extrabold text-[#0F0F12] -mt-0.5">
                      Non-Destructive Layers
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{[layerCutout, layerShadow, layerPolish].filter(Boolean).length}/3 Active</span>
                  </div>
                </div>

                {/* Layer 1: Pen-Tool Background Cutout */}
                <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 transition-all hover:border-neutral-300/80">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        layerCutout ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-200/60 text-neutral-400'
                      }`}>
                        <Scissors className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-[#0F0F12] truncate">
                          Pen-Tool Vector Cutout
                        </div>
                        <div className="text-[11px] font-medium text-neutral-500">
                          300% zoom hand-drawn path
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLayerCutout(!layerCutout)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                        layerCutout ? 'bg-emerald-500' : 'bg-neutral-300'
                      }`}
                      aria-label="Toggle Pen Tool Cutout"
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${
                          layerCutout ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {layerCutout && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500 font-medium">Bézier Vector Anchors</span>
                      <button
                        type="button"
                        onClick={() => setShowVectorPath(!showVectorPath)}
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-all ${
                          showVectorPath
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {showVectorPath ? 'Overlay Active' : 'Inspect Path'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Layer 2: Natural Drop Shadow */}
                <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 transition-all hover:border-neutral-300/80">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        layerShadow ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-200/60 text-neutral-400'
                      }`}>
                        <Sun className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-[#0F0F12] truncate">
                          Natural Floor Shadow
                        </div>
                        <div className="text-[11px] font-medium text-neutral-500">
                          Dual-pass grounded depth
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLayerShadow(!layerShadow)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                        layerShadow ? 'bg-emerald-500' : 'bg-neutral-300'
                      }`}
                      aria-label="Toggle Floor Shadow"
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${
                          layerShadow ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {layerShadow && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
                        Depth
                      </span>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={shadowIntensity}
                        onChange={(e) => setShadowIntensity(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-[11px] font-mono font-bold text-neutral-600 shrink-0 w-8 text-right">
                        {shadowIntensity}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Layer 3: Studio Polish & Contrast */}
                <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 transition-all hover:border-neutral-300/80">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        layerPolish ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-200/60 text-neutral-400'
                      }`}>
                        <Wand2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-[#0F0F12] truncate">
                          Studio Polish & Clarity
                        </div>
                        <div className="text-[11px] font-medium text-neutral-500">
                          Dust, glue & reflection cleanup
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLayerPolish(!layerPolish)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                        layerPolish ? 'bg-emerald-500' : 'bg-neutral-300'
                      }`}
                      aria-label="Toggle Polish"
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${
                          layerPolish ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {layerPolish && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
                        Clarity
                      </span>
                      <input
                        type="range"
                        min="30"
                        max="100"
                        value={polishIntensity}
                        onChange={(e) => setPolishIntensity(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-[11px] font-mono font-bold text-neutral-600 shrink-0 w-8 text-right">
                        {polishIntensity}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Layer 4: Multi-SKU Color Match */}
                <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 transition-all hover:border-neutral-300/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#0F0F12]">
                          Instant SKU Color Match
                        </div>
                        <div className="text-[11px] font-medium text-neutral-500">
                          Delta-E calibrated colorways
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral-600 bg-white px-2 py-0.5 rounded-md border border-neutral-200/80">
                      {currentStudioSwatch.code}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      {currentStudioProduct.swatches.map((swatch, idx) => (
                        <button
                          key={swatch.code}
                          type="button"
                          onClick={() => setActiveSwatchIdx(idx)}
                          className={`relative w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                            activeSwatchIdx === idx
                              ? 'scale-110 ring-2 ring-[#0F0F12] ring-offset-2 shadow-xs'
                              : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                          title={`${swatch.name} (${swatch.code})`}
                        >
                          {activeSwatchIdx === idx && (
                            <Check className="w-3 h-3 text-white stroke-[3] drop-shadow-sm" />
                          )}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-neutral-700 truncate max-w-[110px]">
                      {currentStudioSwatch.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inspector Bottom Actions */}
              <div className="pt-2 border-t border-neutral-200/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-semibold">Turnaround SLA:</span>
                  <span className="font-extrabold text-[#0F0F12]">{currentStudioProduct.turnaround}</span>
                </div>
                <a
                  href="#gallery"
                  className="w-full py-3.5 rounded-full bg-[#0F0F12] text-white text-xs font-extrabold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-xs group"
                >
                  <span>Inspect 5 Services In Gallery</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. CURATED BENTO LOOKBOOK
      ========================================== */}
      <section id="portfolio" className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]">
                Curated Studio Lookbook
              </h2>
            </div>

            {/* Global Toggle Pill */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-neutral-200/80 self-start sm:self-auto shadow-sm">
              <button
                type="button"
                onClick={() => setGlobalRawMode(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  !globalRawMode
                    ? 'bg-[#0F0F12] text-white'
                    : 'text-neutral-500 hover:text-[#0F0F12]'
                }`}
              >
                Viewing: ALL EDITED
              </button>
              <button
                type="button"
                onClick={() => setGlobalRawMode(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  globalRawMode
                    ? 'bg-amber-400 text-[#0F0F12]'
                    : 'text-neutral-500 hover:text-[#0F0F12]'
                }`}
              >
                Viewing: ALL RAW
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {BENTO_PORTFOLIO.map((card) => {
              const isHovered = hoveredBentoId === card.id;
              const showRaw = globalRawMode ? !isHovered : isHovered;

              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredBentoId(card.id)}
                  onMouseLeave={() => setHoveredBentoId(null)}
                  onClick={() => setLightboxItem(card)}
                  className={`${card.span} ${card.height} relative rounded-[28px] overflow-hidden cursor-pointer border border-neutral-200/80 bg-white group shadow-sm hover:shadow-xl transition-all duration-500`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                    style={{
                      filter: showRaw
                        ? card.rawFilter
                        : 'brightness(1.04) contrast(1.08)'
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  {/* Top-Right Pill Badge */}
                  <span
                    className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-md transition-colors ${
                      showRaw
                        ? 'bg-amber-400 text-[#0F0F12]'
                        : 'bg-white text-[#0F0F12]'
                    }`}
                  >
                    {showRaw ? 'Viewing: RAW (Hover for Edited)' : 'Viewing: EDITED (Hover for Raw)'}
                  </span>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                        {card.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                        {card.title}
                      </h3>
                      <span className="text-xs text-neutral-300 font-medium mt-1 block">
                        {card.turnaround}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={card.href}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-2 rounded-full bg-white/20 hover:bg-emerald-400 text-white hover:text-[#0F0F12] text-xs font-bold transition-all backdrop-blur-md flex items-center gap-1 shadow-sm"
                        title="View Dedicated Service Page"
                      >
                        <span>Single Page</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <div className="w-10 h-10 rounded-full bg-white text-[#0F0F12] flex items-center justify-center group-hover:bg-emerald-400 transition-colors shrink-0 shadow-md">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. INTERACTIVE PRODUCTION GALLERY
      ========================================== */}
      <section id="gallery" className="py-16 px-4 sm:px-8 border-t border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-9 gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-emerald-600">
                  PRODUCTION ARCHIVE // 05 DISCIPLINES
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0F0F12]">
                Interactive Production Gallery
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
                Experience real before/after fidelity across executive corporate portraits, haute couture runway models, 3D garment physics, and sub-pixel hand clipping.
              </p>
            </div>

            {/* Category Filter Pills (no scrollbar) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: 'all', label: 'All Works' },
                { id: 'headshots', label: 'AI Headshots' },
                { id: 'fashion', label: 'Runway Models' },
                { id: 'tryon', label: '3D Try-On' },
                { id: 'product', label: 'Product Scenes' },
                { id: 'retouch', label: 'Precision Paths' }
              ].map((cat) => {
                const isActive = activeGalleryCategory === cat.id;
                const count = cat.id === 'all'
                  ? GALLERY_ITEMS.length
                  : GALLERY_ITEMS.filter((i) => i.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveGalleryCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#0F0F12] text-white shadow-sm'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-[#0F0F12] border border-neutral-200/80 hover:border-neutral-300'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleryItems.map((item) => {
              const showRaw = !!galleryRawCards[item.id];
              return (
                <div
                  key={item.id}
                  className="rounded-[28px] overflow-hidden border border-neutral-200/80 bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Card Visual Stage */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img
                      src={showRaw ? item.beforeImg : item.afterImg}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Badge Top Left */}
                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {item.badge}
                      </span>
                    </div>

                    {/* SLA Badge Top Right */}
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#0F0F12] shadow-xs flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{item.turnaround}</span>
                      </span>
                    </div>

                    {/* Quick Raw Toggle & Inspect Pills at Bottom of Image */}
                    <div className="absolute inset-x-3.5 bottom-3.5 z-10 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGalleryRaw(item.id);
                        }}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all shadow-md backdrop-blur-md flex items-center gap-1.5 cursor-pointer ${
                          showRaw
                            ? 'bg-amber-400 text-[#0F0F12]'
                            : 'bg-white/95 hover:bg-white text-[#0F0F12]'
                        }`}
                        title="Toggle RAW unedited input vs studio master"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showRaw ? 'Showing: RAW' : 'Showing: MASTER'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setGalleryLightbox(item);
                          setLightboxSplitPos(50);
                        }}
                        className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#0F0F12] flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
                        title="Open interactive A/B comparison slider"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-base font-extrabold text-[#0F0F12] mt-1 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.subtitle}
                      </p>

                      {/* Technical Specs Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.specs.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryLightbox(item);
                          setLightboxSplitPos(50);
                        }}
                        className="text-xs font-extrabold text-[#0F0F12] hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Compare A/B Slider</span>
                        <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
                      </button>

                      <Link
                        href={item.href}
                        className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-[#0F0F12] text-neutral-600 hover:text-white flex items-center justify-center transition-all shadow-2xs"
                        title="View dedicated service"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FREQUENTLY ASKED QUESTIONS (FAQ)
      ========================================== */}
      <section id="faq" className="py-16 px-4 sm:px-8 bg-neutral-50/70 border-t border-neutral-200/80">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-extrabold tracking-wider uppercase mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0F0F12]">
              Commercial Production & Workflow Answers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-2 leading-relaxed">
              Clear technical details on turnarounds, precision Bézier clipping, enterprise NDAs, and our complimentary 3-image trial process.
            </p>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3.5">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-neutral-300 shadow-md ring-1 ring-black/5'
                      : 'bg-white border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/50 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#0F0F12] leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#0F0F12] text-white rotate-180'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 mt-1">
                      <p className="pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Technical Inquiry Strip */}
          <div className="mt-10 p-6 sm:p-8 rounded-[28px] bg-white border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                HAVE CUSTOM ART DIRECTION SPECS?
              </span>
              <h4 className="text-base sm:text-lg font-extrabold text-[#0F0F12]">
                Talk Directly With Our Studio Technical Director
              </h4>
              <p className="text-xs text-neutral-500">
                Discuss custom batch integrations, automated FTP/API sync, or calibrated color grading workflows.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-5 py-3 rounded-full bg-[#0F0F12] text-white text-xs font-extrabold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Schedule Discovery Call</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. LIGHTBOX MODAL FOR BENTO LOOKBOOK
      ========================================== */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-[28px] overflow-hidden bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-[#0F0F12] flex items-center justify-center shadow-md hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-[480px] sm:h-[540px] relative">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                  {lightboxItem.tag}
                </span>
                <h3 className="text-2xl font-extrabold mt-0.5">{lightboxItem.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          8. INTERACTIVE A/B SLIDER MODAL FOR GALLERY
      ========================================== */}
      {galleryLightbox && (
        <div
          onClick={() => setGalleryLightbox(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full rounded-[28px] overflow-hidden bg-[#0F0F12] text-white border border-neutral-800 shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  {galleryLightbox.categoryLabel} // {galleryLightbox.badge}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {galleryLightbox.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGalleryLightbox(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Split Stage */}
            <div
              className="relative h-[380px] sm:h-[500px] w-full select-none cursor-ew-resize overflow-hidden bg-black"
              onMouseDown={() => setIsDraggingLightboxSplit(true)}
              onTouchStart={() => setIsDraggingLightboxSplit(true)}
              ref={lightboxStageRef}
            >
              {/* After / Master Image (Full Background) */}
              <img
                src={galleryLightbox.afterImg}
                alt={galleryLightbox.title}
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />

              {/* Before / Raw Image (Clipped Left Side) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                style={{ width: `${lightboxSplitPos}%` }}
              >
                <img
                  src={galleryLightbox.beforeImg}
                  alt="Raw Input"
                  className="absolute inset-y-0 left-0 h-full max-w-none object-cover object-center"
                  style={{
                    width: lightboxStageRef.current ? `${lightboxStageRef.current.clientWidth}px` : '100%'
                  }}
                />
              </div>

              {/* Split Slider Handle */}
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center justify-center"
                style={{ left: `${lightboxSplitPos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-0.5 h-full bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)]" />
                <div className="absolute w-8 h-8 rounded-full bg-white text-[#0F0F12] shadow-xl flex items-center justify-center">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
                  {galleryLightbox.rawLabel}
                </span>
              </div>
              <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-black/60 backdrop-blur-md text-emerald-400 border border-white/10">
                  {galleryLightbox.editedLabel}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
                <span className="font-bold text-white">SLA: {galleryLightbox.turnaround}</span>
                <span>•</span>
                <span>Specs: {galleryLightbox.specs.join(' • ')}</span>
              </div>
              <Link
                href={galleryLightbox.href}
                className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#0F0F12] text-xs font-extrabold transition-colors flex items-center gap-1.5"
              >
                <span>View Dedicated Service</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
