import React, { useState } from 'react';
import { Play, Sparkles, ArrowRight, X, Volume2, VolumeX, Eye } from 'lucide-react';

interface VideoItem {
    id: string;
    title: string;
    category: string;
    duration: string;
    poster: string;
    videoUrl?: string;
    tag: string;
}

export function VideoShowcase() {
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
    const [isMuted, setIsMuted] = useState(true);

    const videoReels: VideoItem[] = [
        {
            id: 'reel-1',
            title: 'Nordic Expedition Apparel',
            category: 'Commercial & Outdoor',
            duration: '0:15',
            tag: '4K CINEMATIC',
            poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        },
        {
            id: 'reel-2',
            title: 'Lumina Velvet Skincare',
            category: 'Beauty & Cosmetics',
            duration: '0:20',
            tag: 'MACRO GLOW',
            poster: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=720&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        },
        {
            id: 'reel-3',
            title: 'Citrus Splash High-Speed',
            category: 'Beverage & Slow-Mo',
            duration: '0:12',
            tag: '1000 FPS',
            poster: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=720&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        },
        {
            id: 'reel-4',
            title: 'Artisan Dining & Taste',
            category: 'Food & Culinary',
            duration: '0:25',
            tag: 'UGC ADS',
            poster: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=720&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        },
        {
            id: 'reel-5',
            title: 'Urban Velocity Rain Drive',
            category: 'Kinetic & Automotive',
            duration: '0:18',
            tag: 'NIGHT RUN',
            poster: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=720&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        },
        {
            id: 'reel-6',
            title: 'Haute Horlogerie & Diamonds',
            category: '3D Spatial CGI',
            duration: '0:16',
            tag: '3D CGI PRODUCT',
            poster: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=720&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        },
    ];

    return (
        <section
            id="video-showcase-section"
            className="relative py-16 sm:py-20 lg:py-24 bg-[#07080b] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting & Glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60rem] h-[22rem] bg-accent/[0.05] rounded-full blur-[220px] pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Header Container with Playful Arrows */}
                <div className="relative text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    {/* Floating Hand-Drawn Annotation Arrow (Left) */}
                    <div className="hidden md:flex items-center gap-2 absolute -top-4 -left-12 lg:-left-20 text-accent/80 select-none animate-bounce duration-1000">
                        <svg
                            className="w-10 h-10 -rotate-12 stroke-accent fill-none stroke-[2]"
                            viewBox="0 0 40 40"
                        >
                            <path d="M5,35 Q15,10 32,15 M32,15 L24,10 M32,15 L28,24" />
                        </svg>
                        <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
                            High Conversion
                        </span>
                    </div>

                    {/* Floating Hand-Drawn Annotation Arrow (Right) */}
                    <div className="hidden md:flex items-center gap-2 absolute -top-4 -right-12 lg:-right-20 text-accent/80 select-none">
                        <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
                            Elevate your brand
                        </span>
                        <svg
                            className="w-10 h-10 rotate-12 stroke-accent fill-none stroke-[2]"
                            viewBox="0 0 40 40"
                        >
                            <path d="M35,35 Q25,10 8,15 M8,15 L16,10 M8,15 L12,24" />
                        </svg>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-xs font-mono uppercase tracking-[0.2em] text-accent font-semibold mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>SHORT-FORM & SPATIAL REELS</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
                        ... with{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-accent to-amber-500">
                            Stunning Videos
                        </span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed max-w-2xl mx-auto">
                        Boost your brand with high-impact Short Videos from our expert content creators and 3D visual directors.
                        Our team is ready to propel your business forward!
                    </p>
                </div>

                {/* 3D Arc / Fan Curved Cards Carousel */}
                <div className="relative pb-6">
                    {/* Horizontal scroll track with smooth snap */}
                    <div className="flex items-center justify-start lg:justify-center gap-4 sm:gap-5 overflow-x-auto pb-8 pt-4 px-2 scrollbar-none snap-x snap-mandatory">
                        {videoReels.map((video, idx) => {
                            // Subtle curvature effect for central focus
                            const rotationClass =
                                idx === 0 ? 'lg:-rotate-3 lg:translate-y-2' :
                                idx === 1 ? 'lg:-rotate-1.5 lg:translate-y-0.5' :
                                idx === 2 ? 'lg:scale-105 lg:z-10 lg:-translate-y-1' :
                                idx === 3 ? 'lg:scale-105 lg:z-10 lg:-translate-y-1' :
                                idx === 4 ? 'lg:rotate-1.5 lg:translate-y-0.5' :
                                'lg:rotate-3 lg:translate-y-2';

                            return (
                                <div
                                    key={video.id}
                                    onClick={() => setActiveVideo(video)}
                                    className={`shrink-0 w-[200px] sm:w-[220px] md:w-[230px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden relative group cursor-pointer border border-white/10 hover:border-accent/60 bg-[#12141c] shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 hover:scale-105 hover:z-20 snap-center ${rotationClass}`}
                                >
                                    {/* Poster Image */}
                                    <img
                                        src={video.poster}
                                        alt={video.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:contrast-110"
                                    />

                                    {/* Dark Vignette Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 group-hover:from-black/95 transition-opacity" />

                                    {/* Top Tag Pill */}
                                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono font-bold tracking-wider uppercase">
                                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-neutral-300 group-hover:text-accent group-hover:border-accent/40 transition-colors">
                                            {video.tag}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-neutral-400 font-mono">
                                            {video.duration}
                                        </span>
                                    </div>

                                    {/* Center Play Button Ripple */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:scale-115 group-hover:bg-accent group-hover:text-black group-hover:border-accent transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5 transition-transform group-hover:scale-110" />
                                        </div>
                                    </div>

                                    {/* Bottom Title & Category */}
                                    <div className="absolute bottom-3 left-3 right-3 text-left space-y-0.5">
                                        <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold block">
                                            {video.category}
                                        </span>
                                        <h3 className="font-display text-sm font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
                                            {video.title}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom CTA with Hand-drawn Doodle Arrow */}
                <div className="relative mt-8 sm:mt-10 text-center">
                    {/* SVG Pointer Arrow to CTA */}
                    <div className="flex justify-center mb-3">
                        <svg
                            className="w-8 h-8 stroke-accent fill-none stroke-[2] animate-bounce"
                            viewBox="0 0 32 32"
                        >
                            <path d="M16,4 L16,26 M16,26 L9,19 M16,26 L23,19" />
                        </svg>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/contact?intent=video-production"
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(251,183,24,0.35)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] cursor-pointer"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>

                        <a
                            href="/#free-trial"
                            className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all duration-300"
                        >
                            <Eye className="w-3.5 h-3.5 text-accent" />
                            <span>Request Video Pilot</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Video Lightbox Modal */}
            {activeVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200"
                    onClick={() => setActiveVideo(null)}
                >
                    <div
                        className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[85vh] bg-[#0c0d12] rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Video Element */}
                        <video
                            src={activeVideo.videoUrl}
                            poster={activeVideo.poster}
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-cover"
                        />

                        {/* Top Controls Overlay */}
                        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-accent border border-white/10">
                                    {activeVideo.tag}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-accent border border-white/10 transition-colors"
                                    title={isMuted ? 'Unmute' : 'Mute'}
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setActiveVideo(null)}
                                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-accent hover:text-black border border-white/10 transition-all cursor-pointer"
                                title="Close Video"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Bottom Information */}
                        <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 z-20">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold block">
                                {activeVideo.category}
                            </span>
                            <h4 className="font-display text-base font-bold text-white">
                                {activeVideo.title}
                            </h4>
                            <p className="text-xs text-neutral-300 font-sans mt-1">
                                High-velocity short-form commercial production customized for your brand catalog.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

