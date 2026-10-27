import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Star, Sparkles, ShieldCheck } from 'lucide-react';
import { Testimonial } from '@/types/models';

interface TestimonialsSliderProps {
    testimonials?: Testimonial[];
}

const AUTOPLAY_INTERVAL = 3500; // 3.5 seconds per slide - fast & dynamic

export function TestimonialsSlider({ testimonials = [] }: TestimonialsSliderProps) {
    const defaultTestimonials: Testimonial[] = [
        {
            id: 1,
            client_name: 'Markus Weber',
            client_role: 'Global Head of E-Commerce Production',
            client_company: 'Haglöfs Outerwear',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            quote: 'CuttingEdger processes our seasonal catalog of over 4,500 apparel SKUs with zero defect tolerance. Their ghost mannequin neck joints and symmetrical alignment have elevated our online store conversion rates dramatically.',
            rating: 5,
            featured: true,
        },
        {
            id: 2,
            client_name: 'Elena Rostova',
            client_role: 'Creative Operations Director',
            client_company: 'Veloce Studio Group',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            quote: 'The turnaround speed and fidelity are unmatched. What used to take our internal retouchers three full days of manual masking is delivered within 12 hours with immaculate clipping paths and standardized pantone color swatches.',
            rating: 5,
            featured: true,
        },
        {
            id: 3,
            client_name: 'David Vance',
            client_role: 'VP of Digital Merchandising',
            client_company: 'Lumina Eyewear & Timepieces',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            quote: 'High-end macro jewelry and luxury eyewear retouching requires surgical precision with zero blur or haloing. CuttingEdger is the only production partner that consistently achieves flawless reflection control at massive volume.',
            rating: 5,
            featured: true,
        },
    ];

    const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<number>(1);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    const goToSlide = (idx: number) => {
        setDirection(idx > currentIndex ? 1 : -1);
        setCurrentIndex(idx);
    };

    // Auto-advance timer (slides one-by-one automatically, pauses when user hovers)
    useEffect(() => {
        if (isPaused || items.length <= 1) return;

        timerRef.current = setInterval(() => {
            nextSlide();
        }, AUTOPLAY_INTERVAL);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentIndex, isPaused, items.length]);

    // Keyboard accessibility (ArrowLeft & ArrowRight)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [items.length]);

    const current = items[currentIndex];

    // Ultra-smooth, snappy sliding animation with zero lag
    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 40 : -40,
            opacity: 0,
            scale: 0.98,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: 'spring', stiffness: 420, damping: 32 },
                opacity: { duration: 0.18 },
                scale: { duration: 0.18 },
            },
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -40 : 40,
            opacity: 0,
            scale: 0.98,
            transition: {
                opacity: { duration: 0.12 },
            },
        }),
    };

    return (
        <section
            className="relative py-16 sm:py-22 lg:py-28 bg-[#090a0e] border-t border-white/10 overflow-hidden select-none"
            aria-label="Client Testimonials Slider"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-accent/5 rounded-full blur-[220px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 pb-6 border-b border-white/10 gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-mono uppercase tracking-[0.2em] text-accent font-semibold">
                            <Sparkles className="w-3 h-3" />
                            <span>Client Endorsements</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold uppercase text-white tracking-tight leading-none">
                            What Brands Say <span className="text-accent">About Our Craft</span>
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-neutral-400 font-sans leading-relaxed">
                            Verified performance reviews from e-commerce directors and high-volume studio leads.
                        </p>
                    </div>

                    {/* Navigation Buttons + Auto-play status */}
                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="Previous testimonial"
                            className="p-3 sm:p-3.5 rounded-full border border-white/15 bg-white/[0.03] hover:border-accent hover:bg-accent hover:text-black text-neutral-300 transition-all duration-300 shadow-sm cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </button>
                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Next testimonial"
                            className="p-3 sm:p-3.5 rounded-full border border-white/15 bg-white/[0.03] hover:border-accent hover:bg-accent hover:text-black text-neutral-300 transition-all duration-300 shadow-sm cursor-pointer"
                        >
                            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </button>
                    </div>
                </div>

                {/* Main Carousel Card Container */}
                <div
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="relative rounded-3xl p-6 sm:p-10 lg:p-14 border border-white/10 bg-gradient-to-b from-[#12141d] to-[#0b0c11] shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden"
                >
                    {/* Animated Auto-Slide Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
                        <motion.div
                            key={currentIndex}
                            initial={{ width: '0%' }}
                            animate={{ width: isPaused ? undefined : '100%' }}
                            transition={{
                                duration: isPaused ? 0 : AUTOPLAY_INTERVAL / 1000,
                                ease: 'linear',
                            }}
                            className="h-full bg-gradient-to-r from-accent via-[#ffe484] to-accent"
                        />
                    </div>

                    {/* Top Metadata Row: Rating + Verified Badge + Slide Counter */}
                    <div className="flex items-center justify-between mb-8 sm:mb-10">
                        {/* Rating Stars + Verified Pill */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {[...Array(current.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                                ))}
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Verified Partner</span>
                            </span>
                        </div>

                        {/* Numeric Counter */}
                        <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                            <span className="text-accent font-bold">0{currentIndex + 1}</span>
                            <span className="text-neutral-600">/</span>
                            <span>0{items.length}</span>
                        </div>
                    </div>

                    {/* Animated Quote Body */}
                    <div className="relative min-h-[140px] sm:min-h-[160px] lg:min-h-[140px] flex items-center mb-8 sm:mb-12">
                        <Quote className="w-10 h-10 sm:w-16 sm:h-16 text-accent/15 absolute -top-4 -left-2 sm:-top-8 sm:-left-6 pointer-events-none" />

                        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                            <motion.blockquote
                                key={current.id || currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full text-lg sm:text-2xl lg:text-[28px] font-display font-medium text-white/95 leading-relaxed tracking-tight break-words relative z-10"
                            >
                                "{current.quote}"
                            </motion.blockquote>
                        </AnimatePresence>
                    </div>

                    {/* Client Credential Details + Interactive Dot Indicators */}
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-5 pt-6 sm:pt-8 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            {current.avatar ? (
                                <img
                                    src={current.avatar}
                                    alt={current.client_name}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-accent/40 shadow-md shrink-0"
                                />
                            ) : (
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold font-mono text-sm flex items-center justify-center shrink-0">
                                    {current.client_name?.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h4 className="font-display font-bold text-base sm:text-lg text-white">
                                    {current.client_name}
                                </h4>
                                <p className="font-mono text-xs text-neutral-400 mt-0.5">
                                    {current.client_role} · <span className="text-accent font-semibold">{current.client_company}</span>
                                </p>
                            </div>
                        </div>

                        {/* Interactive Dot Indicators with Auto-Advance Visuals */}
                        <div className="flex items-center gap-2">
                            {items.map((_, dotIdx) => (
                                <button
                                    key={dotIdx}
                                    type="button"
                                    onClick={() => goToSlide(dotIdx)}
                                    aria-label={`Go to testimonial ${dotIdx + 1}`}
                                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                                        dotIdx === currentIndex
                                            ? 'w-8 bg-accent shadow-[0_0_12px_rgba(245,166,35,0.4)]'
                                            : 'w-2.5 bg-white/20 hover:bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
