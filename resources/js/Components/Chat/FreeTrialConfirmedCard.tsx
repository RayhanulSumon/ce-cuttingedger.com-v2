import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Mail, Clock, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { TrialQuotaExhaustedCard } from './TrialQuotaExhaustedCard';

export interface FreeTrialConfirmedCardProps {
    card: {
        title?: string;
        images_count?: number;
        total_cost?: string;
        turnaround?: string;
        status?: string;
        deliverables?: string[];
        client_email?: string | null;
        images?: string[];
    };
    onSendPrompt?: (text: string) => void;
}

export function FreeTrialConfirmedCard({ card, onSendPrompt }: FreeTrialConfirmedCardProps) {
    const imagesCount = card.images_count || 1;
    const [email, setEmail] = useState('');
    const [confirmedEmail, setConfirmedEmail] = useState<string | null>(card.client_email || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quotaExceeded, setQuotaExceeded] = useState(false);
    const [quotaMessage, setQuotaMessage] = useState<string | null>(null);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) {
            setError('Please provide a valid email address.');
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/chat/lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();
            if (data.quota_exceeded) {
                setQuotaExceeded(true);
                setQuotaMessage(data.message);
                setConfirmedEmail(email.trim());
                return;
            }

            if (!res.ok) {
                throw new Error(data.message || 'Unable to save email');
            }

            setConfirmedEmail(email.trim());
            onSendPrompt?.(`My email is ${email.trim()}`);
        } catch (err: any) {
            setError(err?.message || 'Failed to link email. You can also type it in chat.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (quotaExceeded) {
        return (
            <TrialQuotaExhaustedCard
                card={{
                    title: 'Free Trial Quota Limit Reached',
                    client_email: confirmedEmail || email,
                    message: quotaMessage || undefined,
                }}
                onSendPrompt={onSendPrompt}
            />
        );
    }

    return (
        <div className="my-2.5 p-4 rounded-2xl bg-accent/10 border border-accent/40 shadow-2xl backdrop-blur-md text-left space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-accent text-black">
                        <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                            {card.title || '100% Free Trial Activated'}
                        </h4>
                        <span className="text-[10px] text-accent font-mono uppercase tracking-wider block">
                            Zero Cost • No Credit Card Required
                        </span>
                    </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30 shrink-0">
                    {card.status || 'In Production Queue'}
                </span>
            </div>

            {/* Image Previews if available */}
            {card.images && card.images.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {card.images.map((imgUrl, i) => (
                        <div
                            key={i}
                            className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/15 bg-black/40 shrink-0 group"
                        >
                            <img
                                src={imgUrl}
                                alt={`Sample ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono text-white/70 px-1 rounded-tl">
                                #{i + 1}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Trial Specs Grid */}
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-white/70">
                    <span className="text-white/40 text-[10px] uppercase">Sample Batch</span>
                    <span className="font-semibold text-white">
                        {imagesCount} {imagesCount === 1 ? 'image' : 'images'} submitted ({imagesCount} of 3 free trial quota)
                    </span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                    <span className="text-white/40 text-[10px] uppercase">Total Billing</span>
                    <span className="font-bold text-accent text-sm">$0.00 USD (FREE)</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                    <span className="text-white/40 text-[10px] uppercase">Turnaround SLA</span>
                    <span className="text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#00f5ff]" />
                        {card.turnaround || 'Sub-12 Hours Rapid SLA'}
                    </span>
                </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-1 text-[11px] font-mono text-white/80">
                <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block">
                    What You Will Receive
                </span>
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-white/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>100% Hand-Drawn Pen Tool Vector Clipping Paths</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>Layered Master PSD with Clipping Mask & Alpha Channel</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>High-Resolution Transparent Web PNG</span>
                    </div>
                </div>
            </div>

            {/* Delivery Destination Section */}
            {confirmedEmail ? (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-white/90 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <div>
                        <span className="text-[10px] text-white/40 uppercase block">Delivery Destination</span>
                        <span className="text-[#00f5ff] font-semibold">{confirmedEmail}</span>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleEmailSubmit}
                    className="p-3 rounded-xl bg-black/40 border border-[#00f5ff]/30 space-y-2 animate-in fade-in"
                >
                    <div className="flex items-center gap-1.5 text-xs text-[#00f5ff] font-mono">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="font-semibold">Where should we deliver your retouched master files?</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            required
                            placeholder="Enter your email (e.g. alex@brand.com)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff]"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="py-1.5 px-3 rounded-lg bg-[#00f5ff] hover:bg-[#00d8e6] text-black font-semibold text-xs font-mono whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <span>Confirm</span>
                                    <ArrowRight className="w-3 h-3" />
                                </>
                            )}
                        </button>
                    </div>
                    {error && (
                        <p className="text-[11px] text-red-400 font-mono">{error}</p>
                    )}
                </form>
            )}
        </div>
    );
}
