import React, { useState, useMemo } from 'react';
import {
    Calculator,
    Sparkles,
    ArrowUpRight,
    Check,
    Clock,
    Tag,
    TrendingDown,
    Scissors,
    Shirt,
    Gem,
    Box,
    BookOpen,
    Info,
    ShieldCheck,
    Palette,
    HeartHandshake,
    Gift,
    Coins,
    Layers,
    Plus,
    Minus,
} from 'lucide-react';

interface ServiceRate {
    id: string;
    name: string;
    category: '2D Image Editing' | '3D CGI' | 'Desktop Publishing';
    basePrice: number;
    unitNameSingular: string;
    unitNamePlural: string;
    unitDescription: string;
    description: string;
    icon: React.ElementType;
    minQty: number;
    maxQty: number;
    stepQty: number;
    defaultQty: number;
    presets: number[];
}

export function VolumePricingCalculator() {
    const services: ServiceRate[] = [
        {
            id: 'cutout',
            name: 'Background Removal',
            category: '2D Image Editing',
            basePrice: 0.40,
            unitNameSingular: 'Image',
            unitNamePlural: 'Images / SKUs',
            unitDescription: 'Processed Product Photos',
            description: '100% hand-drawn pen clipping paths & alpha channel isolation',
            icon: Scissors,
            minQty: 10,
            maxQty: 10000,
            stepQty: 25,
            defaultQty: 500,
            presets: [100, 250, 500, 1500, 3000, 10000],
        },
        {
            id: 'colour-correction',
            name: 'Color Correction',
            category: '2D Image Editing',
            basePrice: 0.31,
            unitNameSingular: 'Image',
            unitNamePlural: 'Images / SKUs',
            unitDescription: 'Color Balanced Photos',
            description: 'Pantone accuracy, white balance harmonization & product tone consistency',
            icon: Palette,
            minQty: 10,
            maxQty: 10000,
            stepQty: 25,
            defaultQty: 500,
            presets: [100, 250, 500, 1500, 3000, 10000],
        },
        {
            id: 'ghost-mannequin',
            name: 'Ghost Mannequin',
            category: '2D Image Editing',
            basePrice: 0.80,
            unitNameSingular: 'Image',
            unitNamePlural: 'Images / SKUs',
            unitDescription: 'Apparel Garment Photos',
            description: '3D apparel hollow neck & sleeve joint composite with natural drape',
            icon: Shirt,
            minQty: 10,
            maxQty: 5000,
            stepQty: 25,
            defaultQty: 500,
            presets: [50, 100, 250, 500, 1500, 3000],
        },
        {
            id: 'wedding-retouch',
            name: 'Wedding & Event',
            category: '2D Image Editing',
            basePrice: 2.50,
            unitNameSingular: 'Image',
            unitNamePlural: 'Images / SKUs',
            unitDescription: 'Ceremony Gallery Photos',
            description: 'Bulk gallery toning, veil smoothing, atmospheric color harmonization',
            icon: HeartHandshake,
            minQty: 10,
            maxQty: 5000,
            stepQty: 10,
            defaultQty: 300,
            presets: [50, 100, 300, 500, 1500],
        },
        {
            id: 'jewelry',
            name: 'Fine Jewelry',
            category: '2D Image Editing',
            basePrice: 3.00,
            unitNameSingular: 'Image',
            unitNamePlural: 'Images / SKUs',
            unitDescription: 'Luxury Jewelry Photos',
            description: 'Gemstone facet fire, micro-scratch removal & metallic luster balance',
            icon: Gem,
            minQty: 10,
            maxQty: 3000,
            stepQty: 10,
            defaultQty: 150,
            presets: [25, 50, 100, 250, 500, 1000],
        },
        {
            id: 'model-retouch',
            name: 'Model Retouch',
            category: '2D Image Editing',
            basePrice: 8.00,
            unitNameSingular: 'Image',
            unitNamePlural: 'Images / SKUs',
            unitDescription: 'Retouched Model Portraits',
            description: 'Frequency separation, micro dodge & burn, skin pore preservation',
            icon: Sparkles,
            minQty: 5,
            maxQty: 2000,
            stepQty: 5,
            defaultQty: 50,
            presets: [20, 50, 100, 250, 500],
        },
        {
            id: '3d-cgi',
            name: '3D CGI Product',
            category: '3D CGI',
            basePrice: 25.00,
            unitNameSingular: 'Model',
            unitNamePlural: '3D Models',
            unitDescription: 'Digital Twin Meshes',
            description: 'CAD-to-mesh digital twin, photorealistic PBR render & 360° spin',
            icon: Box,
            minQty: 1,
            maxQty: 150,
            stepQty: 1,
            defaultQty: 10,
            presets: [2, 5, 10, 25, 50],
        },
        {
            id: 'dtp',
            name: 'Desktop Publishing',
            category: 'Desktop Publishing',
            basePrice: 1.80,
            unitNameSingular: 'Page',
            unitNamePlural: 'Catalog Pages',
            unitDescription: 'Formatted InDesign Pages',
            description: 'Catalog formatting, multilingual typesetting & prepress press PDF',
            icon: BookOpen,
            minQty: 4,
            maxQty: 500,
            stepQty: 4,
            defaultQty: 32,
            presets: [8, 16, 32, 64, 120],
        },
    ];

    // Selected services set (allows multi-select combo mode or single select)
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['cutout']);
    const [quantity, setQuantity] = useState<number>(500);
    const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
    const [speedLabel, setSpeedLabel] = useState<string>('Standard 24h');
    const [categoryFilter, setCategoryFilter] = useState<'all' | '2d' | 'specialty'>('all');

    // Filtered services
    const filteredServices = useMemo(() => {
        if (categoryFilter === '2d') {
            return services.filter((s) => s.category === '2D Image Editing');
        }
        if (categoryFilter === 'specialty') {
            return services.filter((s) => s.category !== '2D Image Editing');
        }
        return services;
    }, [categoryFilter, services]);

    // Toggle service selection
    const handleToggleService = (serviceId: string) => {
        setSelectedServiceIds((prev) => {
            if (prev.includes(serviceId)) {
                // Keep at least one service selected
                if (prev.length === 1) return prev;
                return prev.filter((id) => id !== serviceId);
            } else {
                return [...prev, serviceId];
            }
        });
    };

    // Quick combo preset buttons
    const selectComboPlan1 = () => {
        setSelectedServiceIds(['cutout', 'colour-correction']);
        setQuantity(3000);
    };

    const selectSingleCutout = () => {
        setSelectedServiceIds(['cutout']);
        setQuantity(500);
    };

    // Check if Combo Perks are unlocked
    const isComboActive = selectedServiceIds.length > 1;
    const hasSameFlowFreeFinish = selectedServiceIds.includes('cutout') && selectedServiceIds.includes('colour-correction');

    // Selected primary service (for unit name / slider bounds)
    const primaryService = useMemo(() => {
        return services.find((s) => s.id === selectedServiceIds[0]) || services[0];
    }, [selectedServiceIds, services]);

    const activeServices = useMemo(() => {
        return services.filter((s) => selectedServiceIds.includes(s.id));
    }, [selectedServiceIds, services]);

    // Aggregate Base Unit Price across selected services
    const combinedBasePrice = useMemo(() => {
        return activeServices.reduce((sum, s) => sum + s.basePrice, 0);
    }, [activeServices]);

    // Dynamic Volume Discount Calculation
    const discountTier = useMemo(() => {
        if (selectedServiceIds.includes('3d-cgi') && selectedServiceIds.length === 1) {
            if (quantity >= 50) return { percent: 35, label: '35% Studio Batch Discount' };
            if (quantity >= 20) return { percent: 20, label: '20% Volume Discount' };
            if (quantity >= 5) return { percent: 10, label: '10% Multi-Model Discount' };
            return { percent: 0, label: 'Base Rate' };
        }

        if (selectedServiceIds.includes('dtp') && selectedServiceIds.length === 1) {
            if (quantity >= 120) return { percent: 40, label: '40% Catalog Volume Tier' };
            if (quantity >= 64) return { percent: 30, label: '30% Magazine Batch Tier' };
            if (quantity >= 32) return { percent: 20, label: '20% Lookbook Tier' };
            return { percent: 0, label: 'Base Rate' };
        }

        // Combo rules: Plan 1 (Cutout + Colour): $0.71 base -> 5% off at 3k ($0.67), 8% off at 10k ($0.65)
        if (hasSameFlowFreeFinish) {
            if (quantity >= 10000) return { percent: 8.5, label: '8% Large Volume Tier ($0.65/photo)' };
            if (quantity >= 3000) return { percent: 5.6, label: '5% Medium Volume Tier ($0.67/photo)' };
            if (quantity >= 1000) return { percent: 3.0, label: '3% Small Batch Tier' };
            return { percent: 0, label: 'Standard Combo Base ($0.71/photo)' };
        }

        // Standard 2D Image Retouching Tiers
        if (quantity >= 5000) return { percent: 35, label: '35% Enterprise Tier' };
        if (quantity >= 2500) return { percent: 25, label: '25% Production Tier' };
        if (quantity >= 1000) return { percent: 15, label: '15% High-Volume Tier' };
        if (quantity >= 500) return { percent: 10, label: '10% Catalog Tier' };
        return { percent: 0, label: 'Base Rate' };
    }, [quantity, selectedServiceIds, hasSameFlowFreeFinish]);

    // Live Calculation
    const calculation = useMemo(() => {
        const discountedBase = combinedBasePrice * (1 - discountTier.percent / 100);
        const finalUnitPrice = discountedBase * speedMultiplier;
        const totalCost = finalUnitPrice * quantity;
        const undiscountedTotal = combinedBasePrice * speedMultiplier * quantity;
        const volumeSaved = Math.max(0, undiscountedTotal - totalCost);

        // Free finish gift value ($0.15 free per image when Cutout + Colour are active)
        const freeFinishValue = hasSameFlowFreeFinish ? quantity * 0.15 : 0;
        const totalValueSaved = volumeSaved + freeFinishValue;

        // Free credits earned (if 2+ services and spend >= $150)
        let walletCreditPct = 0;
        if (isComboActive) {
            if (totalCost >= 1000) walletCreditPct = 14;
            else if (totalCost >= 400) walletCreditPct = 10;
            else if (totalCost >= 150) walletCreditPct = 6;
        }
        const walletCreditsEarned = (totalCost * walletCreditPct) / 100;

        return {
            unitPrice: finalUnitPrice.toFixed(2),
            totalCost: totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            volumeSaved: volumeSaved.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
            freeFinishValue: freeFinishValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
            totalValueSaved: totalValueSaved.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
            walletCreditPct,
            walletCreditsEarned: walletCreditsEarned.toFixed(0),
        };
    }, [combinedBasePrice, discountTier.percent, speedMultiplier, quantity, hasSameFlowFreeFinish, isComboActive]);

    const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (isNaN(val)) {
            setQuantity(primaryService.minQty);
        } else {
            setQuantity(Math.max(primaryService.minQty, Math.min(primaryService.maxQty, val)));
        }
    };

    const sliderMin = primaryService.minQty;
    const sliderMax = primaryService.maxQty;
    const progressPercent = Math.min(
        100,
        Math.max(0, ((quantity - sliderMin) / (sliderMax - sliderMin)) * 100)
    );

    return (
        <section
            id="volume-calculator-section"
            className="relative py-16 sm:py-20 lg:py-24 bg-[#090a0d] border-t border-white/10 overflow-hidden"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[45rem] h-[30rem] bg-accent/5 rounded-full blur-[220px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-[#00f5ff]/5 rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-accent mb-4">
                        <Calculator className="w-3.5 h-3.5" />
                        <span>[ LIVE PRODUCTION RATE ESTIMATOR ]</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08] sm:leading-[1.05]">
                        Calculate Your Rate <br />
                        <span className="text-accent">Down to the Penny.</span>
                    </h2>

                    <p className="mt-3.5 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                        Select a single service or combine multiple services for <strong>bundled volume discounts</strong>. Rates automatically scale down as your batch size grows.
                    </p>

                    {/* Quick Preset Combos */}
                    <div className="flex items-center justify-center gap-2.5 pt-4 flex-wrap">
                        <span className="text-xs font-mono text-neutral-500 uppercase mr-1">Quick Presets:</span>
                        <button
                            type="button"
                            onClick={selectSingleCutout}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                                selectedServiceIds.length === 1 && selectedServiceIds[0] === 'cutout'
                                    ? 'bg-white/20 text-white font-bold border border-white/30'
                                    : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                            }`}
                        >
                            Single Cutout ($0.40)
                        </button>
                        <button
                            type="button"
                            onClick={selectComboPlan1}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                                hasSameFlowFreeFinish
                                    ? 'bg-accent text-black font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]'
                                    : 'bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30'
                            }`}
                        >
                            <Gift className="w-3 h-3" />
                            <span>Cutout + Colour Combo (Free Shadow Included)</span>
                        </button>
                    </div>
                </div>

                {/* Calculator Interactive Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch max-w-6xl mx-auto">
                    {/* Left Column: Interactive Controls */}
                    <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0d0f15]/95 backdrop-blur-xl p-4 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
                        {/* 1. Service Selection */}
                        <div className="space-y-3.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-md bg-accent/15 text-accent font-mono text-xs font-bold flex items-center justify-center">
                                        1
                                    </span>
                                    <label className="text-sm font-semibold text-white tracking-wide">
                                        Select Services
                                    </label>
                                    <span className="text-xs font-mono text-neutral-400 ml-1">
                                        ({selectedServiceIds.length} active · ${combinedBasePrice.toFixed(2)} base)
                                    </span>
                                </div>

                                {/* Category Switcher Filter */}
                                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5 self-start sm:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => setCategoryFilter('all')}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                                            categoryFilter === 'all'
                                                ? 'bg-accent text-black font-bold shadow-sm'
                                                : 'text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        All ({services.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCategoryFilter('2d')}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                                            categoryFilter === '2d'
                                                ? 'bg-accent text-black font-bold shadow-sm'
                                                : 'text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        2D Retouch
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCategoryFilter('specialty')}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                                            categoryFilter === 'specialty'
                                                ? 'bg-accent text-black font-bold shadow-sm'
                                                : 'text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        3D & DTP
                                    </button>
                                </div>
                            </div>

                            {/* Service Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {filteredServices.map((svc) => {
                                    const isSelected = selectedServiceIds.includes(svc.id);
                                    const IconComponent = svc.icon;

                                    return (
                                        <button
                                            type="button"
                                            key={svc.id}
                                            onClick={() => handleToggleService(svc.id)}
                                            className={`group px-3 py-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none relative flex items-center justify-between gap-2.5 ${
                                                isSelected
                                                    ? 'border-accent bg-accent/10 text-white shadow-[0_0_15px_rgba(251, 183, 24, 0.12)] ring-1 ring-accent/40'
                                                    : 'border-white/[0.08] bg-white/[0.02] text-neutral-300 hover:border-white/20 hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                                        isSelected
                                                            ? 'bg-accent text-black shadow-sm'
                                                            : 'bg-white/5 text-neutral-400 group-hover:text-white border border-white/10'
                                                    }`}
                                                >
                                                    <IconComponent className="w-4 h-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <span className="text-xs font-semibold text-white block truncate leading-tight">
                                                        {svc.name}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-neutral-400 block mt-0.5">
                                                        ${svc.basePrice.toFixed(2)}
                                                        <span className="text-neutral-500 text-[10px]"> / {svc.unitNameSingular.toLowerCase()}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                                    isSelected
                                                        ? 'bg-accent text-black shadow-sm'
                                                        : 'border border-white/20 bg-white/5'
                                                }`}
                                            >
                                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* COMBO PERKS BANNER */}
                            {hasSameFlowFreeFinish && (
                                <div className="p-3 rounded-xl bg-accent/10 border border-accent/25 flex items-center gap-3 animate-in fade-in">
                                    <div className="w-7 h-7 rounded-lg bg-accent text-black flex items-center justify-center shrink-0">
                                        <Gift className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs leading-tight min-w-0">
                                        <span className="font-semibold text-accent block">
                                            Combo Deal Active: Free Natural Shadow & Resize
                                        </span>
                                        <span className="text-neutral-300 block text-[11px] mt-0.5">
                                            $0.15/photo value included free (<strong>+${calculation.freeFinishValue} bonus</strong> value)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Interactive Quantity Slider & Stepper */}
                        <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-md bg-accent/15 text-accent font-mono text-xs font-bold flex items-center justify-center">
                                        2
                                    </span>
                                    <label className="text-sm font-semibold text-white tracking-wide">
                                        Batch Volume
                                    </label>
                                    <span className="text-xs font-mono text-neutral-400">
                                        ({primaryService.unitNamePlural})
                                    </span>
                                </div>

                                {/* Direct Editable Numerical Stepper */}
                                <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-xl p-1">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(sliderMin, q - primaryService.stepQty))}
                                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer select-none"
                                        title="Decrease volume"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <input
                                        type="number"
                                        min={sliderMin}
                                        max={sliderMax}
                                        value={quantity}
                                        onChange={handleQuantityInputChange}
                                        className="w-16 sm:w-20 bg-transparent text-center text-white font-mono text-sm font-bold focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.min(sliderMax, q + primaryService.stepQty))}
                                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer select-none"
                                        title="Increase volume"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Range Slider with Active Fill */}
                            <div className="space-y-1.5">
                                <div className="relative flex items-center">
                                    <input
                                        type="range"
                                        min={sliderMin}
                                        max={sliderMax}
                                        step={primaryService.stepQty}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent relative z-10"
                                        style={{
                                            background: `linear-gradient(to right, #f5a623 0%, #f5a623 ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%, rgba(255,255,255,0.1) 100%)`,
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                                    <span>Min: {sliderMin.toLocaleString()}</span>
                                    <span>Max: {sliderMax.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] font-mono text-neutral-500 uppercase mr-1">Presets:</span>
                                {primaryService.presets.map((preset) => (
                                    <button
                                        type="button"
                                        key={preset}
                                        onClick={() => setQuantity(preset)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer select-none ${
                                            quantity === preset
                                                ? 'bg-accent text-black font-bold shadow-[0_0_10px_rgba(251, 183, 24, 0.3)]'
                                                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                                        }`}
                                    >
                                        {preset >= 1000 ? `${preset / 1000}k` : preset}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Turnaround SLA Speed Selector - Sleek Segmented Switch */}
                        <div className="space-y-2.5 pt-4 border-t border-white/[0.08]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-md bg-accent/15 text-accent font-mono text-xs font-bold flex items-center justify-center">
                                        3
                                    </span>
                                    <label className="text-sm font-semibold text-white tracking-wide">
                                        Turnaround Speed
                                    </label>
                                </div>
                                <span className="text-xs font-mono text-accent font-medium">
                                    {speedLabel}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10">
                                {[
                                    { multiplier: 1.0, label: 'Standard 24h', desc: 'Standard' },
                                    { multiplier: 1.25, label: 'Rush 12h', desc: '+25% Priority' },
                                    { multiplier: 1.5, label: 'Emergency 6h', desc: '+50% Dedicated' },
                                ].map((tier) => {
                                    const active = speedMultiplier === tier.multiplier;
                                    return (
                                        <button
                                            type="button"
                                            key={tier.label}
                                            onClick={() => {
                                                setSpeedMultiplier(tier.multiplier);
                                                setSpeedLabel(tier.label);
                                            }}
                                            className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer select-none ${
                                                active
                                                    ? 'bg-accent text-black font-bold shadow-md'
                                                    : 'text-neutral-400 hover:text-white hover:bg-white/5 font-medium'
                                            }`}
                                        >
                                            <div className="text-xs font-sans font-semibold leading-tight">
                                                {tier.label}
                                            </div>
                                            <div className={`text-[10px] font-mono mt-0.5 ${active ? 'text-black/70' : 'text-neutral-500'}`}>
                                                {tier.desc}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Instant Live Estimate Card */}
                    <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl border-2 border-accent bg-[#10121a]/95 backdrop-blur-2xl p-4 sm:p-10 flex flex-col justify-between shadow-[0_0_50px_rgba(251, 183, 24, 0.12)] relative overflow-hidden">
                        {/* Glow orb */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-[70px] pointer-events-none" />

                        <div className="space-y-6 relative z-10">
                            {/* Live Badge */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-accent" />
                                    <span>INSTANT LIVE ESTIMATE</span>
                                </span>
                                {discountTier.percent > 0 && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        <span>{discountTier.label}</span>
                                    </span>
                                )}
                            </div>

                            {/* Big Total Price */}
                            <div className="space-y-1">
                                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                                    Estimated Total Batch Cost
                                </span>
                                <div className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight tabular-nums">
                                    ${calculation.totalCost}
                                </div>
                            </div>

                            {/* Unit Cost & Total Savings Grid */}
                            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                                <div>
                                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                                        Effective Unit Cost
                                    </span>
                                    <div className="text-xl sm:text-2xl font-mono font-bold text-accent mt-0.5 tabular-nums">
                                        ${calculation.unitPrice}
                                        <span className="text-xs text-neutral-400 font-normal"> / {primaryService.unitNameSingular.toLowerCase()}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                                        {hasSameFlowFreeFinish ? 'Total Value Savings' : 'Volume Savings'}
                                    </span>
                                    <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-0.5 flex items-center gap-1 tabular-nums">
                                        <TrendingDown className="w-4 h-4" />
                                        <span>${calculation.totalValueSaved}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Wallet Cashback Perks if active */}
                            {calculation.walletCreditPct > 0 && (
                                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Coins className="w-4 h-4 text-amber-400" />
                                        <span>+{calculation.walletCreditPct}% Studio Wallet Cashback:</span>
                                    </div>
                                    <span className="font-bold tabular-nums">+${calculation.walletCreditsEarned} Credits</span>
                                </div>
                            )}

                            {/* Features Checklist */}
                            <ul className="space-y-2.5 text-xs font-mono text-neutral-300">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-accent shrink-0" />
                                    <span>Guaranteed Delivery SLA: <strong>{speedLabel}</strong></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-accent shrink-0" />
                                    <span>Free Unlimited Revisions until 100% Approved</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-accent shrink-0" />
                                    <span>Senior QA Double-Inspection Included</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                                    <span>Enterprise Encrypted TLS Cloud Storage</span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA Lock Rate Button */}
                        <div className="pt-6 mt-6 border-t border-white/10 relative z-10 space-y-2">
                            <a
                                href="#trial-uploader-section"
                                className="w-full py-4 px-6 rounded-2xl bg-accent text-black font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent-hover hover:shadow-[0_0_25px_rgba(251, 183, 24, 0.5)] transition-all duration-300 cursor-pointer select-none"
                            >
                                <span>Lock This Rate & Try 3 Free</span>
                                <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                            </a>
                            <p className="text-center text-[11px] font-mono text-neutral-500">
                                Zero upfront payment. We process your first 3 samples 100% free.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
