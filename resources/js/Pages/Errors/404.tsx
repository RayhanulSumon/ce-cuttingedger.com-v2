import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <>
            <SeoHead
                title="404 — Void Trajectory"
                description="The requested coordinate does not exist in our digital perimeter."
            />

            <section className="min-h-[85vh] flex items-center justify-center py-20 px-4 bg-[#0a0b0e] relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute w-96 h-96 bg-[#d4ff00]/10 rounded-full blur-[160px] pointer-events-none" />

                <div className="text-center max-w-lg space-y-6 relative z-10">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block">
                        [ ERROR 404 // VOID ]
                    </span>

                    <h1 className="text-7xl sm:text-9xl font-display font-black text-white tracking-tighter">
                        404.
                    </h1>

                    <h2 className="text-2xl font-display font-bold text-neutral-200">
                        Signal Lost Beyond Perimeter.
                    </h2>

                    <p className="text-neutral-400 text-sm leading-relaxed">
                        The requested page has either migrated to another realm, been decommissioned, or never existed in this dimension.
                    </p>

                    <div className="pt-4 flex items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center gap-2 hover:bg-[#c2eb00] transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Return to Flagship</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="border border-white/20 text-white font-mono text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center gap-2 hover:border-[#d4ff00] hover:text-[#d4ff00] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Step Back</span>
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
