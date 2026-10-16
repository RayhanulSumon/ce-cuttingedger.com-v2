import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { Testimonial } from '@/types/models';

interface TestimonialsSliderProps {
    testimonials: Testimonial[];
}

export function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

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
    }, [testimonials.length]);

    if (!testimonials || testimonials.length === 0) return null;

    const current = testimonials[currentIndex];

    return (
        <section
            className="relative py-28 bg-[#0c0d12] border-t border-white/10 overflow-hidden"
            aria-label="Client Testimonials Carousel"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3">
                            [ 06 // CLIENT ENDORSEMENTS ]
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
                            WHAT THEY SAY.
                        </h2>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="Previous testimonial"
                            className="p-3.5 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-neutral-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Next testimonial"
                            className="p-3.5 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-neutral-300 transition-colors"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Carousel Card */}
                <div
                    key={currentIndex}
                    className="relative rounded-3xl p-8 sm:p-14 border border-white/10 bg-[#12141c] backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-500"
                >
                    <div className="flex items-center justify-between mb-8">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1">
                            {[...Array(current.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-[#d4ff00] text-[#d4ff00]" />
                            ))}
                        </div>

                        <span className="font-mono text-xs text-neutral-500">
                            0{currentIndex + 1} / 0{testimonials.length}
                        </span>
                    </div>

                    {/* Quote */}
                    <div className="relative mb-10">
                        <Quote className="w-12 h-12 text-[#d4ff00]/20 absolute -top-6 -left-4 -z-10" />
                        <blockquote className="text-xl sm:text-3xl lg:text-4xl font-display font-medium text-white leading-relaxed">
                            "{current.quote}"
                        </blockquote>
                    </div>

                    {/* Client Credential Details */}
                    <div className="flex items-center justify-between pt-8 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            {current.avatar && (
                                <img
                                    src={current.avatar}
                                    alt={current.client_name}
                                    className="w-12 h-12 rounded-full object-cover border border-[#d4ff00]/40"
                                />
                            )}
                            <div>
                                <h4 className="font-display font-bold text-lg text-white">
                                    {current.client_name}
                                </h4>
                                <p className="font-mono text-xs text-neutral-400">
                                    {current.client_role} · <span className="text-[#d4ff00]">{current.client_company}</span>
                                </p>
                            </div>
                        </div>

                        {/* Dot indicators */}
                        <div className="hidden sm:flex items-center gap-2">
                            {testimonials.map((_, dotIdx) => (
                                <button
                                    key={dotIdx}
                                    type="button"
                                    onClick={() => setCurrentIndex(dotIdx)}
                                    aria-label={`Go to slide ${dotIdx + 1}`}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                        dotIdx === currentIndex
                                            ? 'w-8 bg-[#d4ff00]'
                                            : 'bg-white/20 hover:bg-white/40'
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
