import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

const CONSENT_KEY = 'cuttingedger_cookie_consent_v1';

export function CookieConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const consent = localStorage.getItem(CONSENT_KEY);
            if (!consent) {
                // Delay slightly to prevent any initial paint interference
                const timer = setTimeout(() => setIsVisible(true), 1200);
                return () => clearTimeout(timer);
            }
        } catch (e) {
            // Storage unavailable
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: true, marketing: true, timestamp: Date.now() }));
            window.dispatchEvent(new CustomEvent('ce_cookie_consent_updated', { detail: { analytics: true, marketing: true } }));
        } catch (e) {}
        setIsVisible(false);
    };

    const handleDecline = () => {
        try {
            localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: false, marketing: false, timestamp: Date.now() }));
            window.dispatchEvent(new CustomEvent('ce_cookie_consent_updated', { detail: { analytics: false, marketing: false } }));
        } catch (e) {}
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <aside
            aria-label="Cookie and Privacy Consent"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[999] bg-[#0e1017]/95 border border-white/15 p-5 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300 select-none"
        >
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 flex items-center justify-center shrink-0 text-[#d4ff00]">
                    <Cookie className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-1 text-xs">
                    <p className="font-display font-bold text-white text-sm">
                        Privacy & Consent Protocol
                    </p>
                    <p className="text-neutral-300 leading-relaxed">
                        We deploy privacy-preserving cookies and analytics to calibrate visual pipeline performance. No intrusive third-party cross-tracking.
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-neutral-400">
                        <Link href="/cookie-policy" className="underline hover:text-[#d4ff00] transition-colors">
                            Cookie Policy
                        </Link>
                        <span>·</span>
                        <Link href="/privacy" className="underline hover:text-[#d4ff00] transition-colors">
                            Privacy Terms
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-white/10 font-mono text-xs">
                <button
                    type="button"
                    onClick={handleDecline}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
                >
                    Essential Only
                </button>
                <button
                    type="button"
                    onClick={handleAccept}
                    className="px-4 py-1.5 rounded-lg bg-[#d4ff00] text-black font-bold hover:bg-[#bfe600] transition-all shadow-md"
                >
                    Accept All
                </button>
            </div>
        </aside>
    );
}
