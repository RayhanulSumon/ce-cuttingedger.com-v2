import React, { useState } from 'react';
import { Package, CheckCircle2, AlertTriangle, UploadCloud, Mail, Clock, ArrowRight, Loader2, Sparkles, Image as ImageIcon, Link2, ExternalLink, Folder } from 'lucide-react';

export interface OrderConfirmedCardProps {
    card: {
        order_number?: string;
        service_name?: string;
        service_slug?: string;
        complexity?: string;
        quantity?: number;
        uploaded_count?: number;
        remaining_count?: number;
        discrepancy_status?: 'under' | 'over' | 'complete';
        unit_price?: string;
        total_price?: string;
        discount_applied?: string;
        turnaround?: string;
        status?: string;
        client_email?: string | null;
        cloud_link?: string | null;
        images?: string[];
    };
    onSendPrompt?: (text: string) => void;
    onUploadClick?: () => void;
}

export function OrderConfirmedCard({ card, onSendPrompt, onUploadClick }: OrderConfirmedCardProps) {
    const orderNumber = card.order_number || 'CE-ORD-NEW';
    const quantity = card.quantity || 1;
    const uploadedCount = card.uploaded_count || 0;
    const remainingCount = card.remaining_count ?? Math.max(0, quantity - uploadedCount);
    const discrepancyStatus = card.cloud_link
        ? 'complete'
        : (card.discrepancy_status || (uploadedCount < quantity ? 'under' : uploadedCount > quantity ? 'over' : 'complete'));

    const [email, setEmail] = useState('');
    const [confirmedEmail, setConfirmedEmail] = useState<string | null>(
        card.client_email && !card.client_email.includes('temp.local') ? card.client_email : null
    );
    const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const [cloudLinkInput, setCloudLinkInput] = useState('');
    const [confirmedCloudLink, setConfirmedCloudLink] = useState<string | null>(card.cloud_link || null);
    const [showCloudInput, setShowCloudInput] = useState(false);
    const [isSubmittingCloud, setIsSubmittingCloud] = useState(false);
    const [cloudError, setCloudError] = useState<string | null>(null);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setEmailError(null);
        setIsSubmittingEmail(true);
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
            if (!res.ok) {
                throw new Error(data.message || 'Unable to save email');
            }

            setConfirmedEmail(email.trim());
            onSendPrompt?.(`My email is ${email.trim()}`);
        } catch (err: any) {
            setEmailError(err?.message || 'Failed to link email. You can also type it in chat.');
        } finally {
            setIsSubmittingEmail(false);
        }
    };

    const handleCloudLinkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = cloudLinkInput.trim();
        if (!trimmed || !trimmed.startsWith('http')) {
            setCloudError('Please enter a valid URL (e.g. https://drive.google.com/...)');
            return;
        }

        setCloudError(null);
        setIsSubmittingCloud(true);
        try {
            const res = await fetch('/api/chat/cloud-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ link: trimmed }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Unable to link cloud storage');
            }

            setConfirmedCloudLink(trimmed);
            setShowCloudInput(false);
            onSendPrompt?.(`Here is my drive folder: ${trimmed}`);
        } catch (err: any) {
            setCloudError(err?.message || 'Failed to save link. You can also paste it directly in chat.');
        } finally {
            setIsSubmittingCloud(false);
        }
    };

    const progressPercent = confirmedCloudLink ? 100 : Math.min(100, Math.round((uploadedCount / Math.max(1, quantity)) * 100));

    return (
        <div className="my-2.5 p-4 rounded-2xl bg-[#12141c]/95 border border-accent/40 shadow-2xl backdrop-blur-md text-left space-y-3.5">
            {/* Header: Order Number & Status */}
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-accent text-black">
                        <Package className="w-4 h-4" />
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white tracking-tight font-mono">{orderNumber}</h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 font-semibold">
                                Queued
                            </span>
                        </div>
                        <p className="text-[11px] text-white/60">
                            {card.service_name || 'Commercial Retouching'} • <span className="capitalize">{card.complexity || 'Simple'}</span>
                        </p>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-accent font-mono block">
                        ${card.total_price || '0.00'}
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                        {card.unit_price ? `$${card.unit_price}/img` : 'USD'}
                    </span>
                </div>
            </div>

            {/* Validation & Discrepancy Status */}
            <div className="rounded-xl p-3 bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60 text-[11px]">Upload Validation:</span>
                    {confirmedCloudLink ? (
                        <span className="text-purple-300 font-bold flex items-center gap-1">
                            <Folder className="w-3.5 h-3.5" />
                            Drive Folder Linked
                        </span>
                    ) : discrepancyStatus === 'under' ? (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {uploadedCount} of {quantity} files ({remainingCount} pending)
                        </span>
                    ) : discrepancyStatus === 'over' ? (
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            {uploadedCount} files (Batch Expanded)
                        </span>
                    ) : (
                        <span className="text-accent font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            All {quantity} files uploaded
                        </span>
                    )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 rounded-full ${
                            confirmedCloudLink ? 'bg-purple-400' : discrepancyStatus === 'under' ? 'bg-amber-400' : 'bg-accent'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Upload Actions / Cloud Drive Toggle */}
                {!confirmedCloudLink && discrepancyStatus === 'under' && (
                    <div className="flex flex-col sm:flex-row gap-1.5 pt-1">
                        {onUploadClick && (
                            <button
                                type="button"
                                onClick={onUploadClick}
                                className="flex-1 py-1.5 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>Upload ({remainingCount} left)</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowCloudInput(!showCloudInput)}
                            className="py-1.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                            <Folder className="w-3.5 h-3.5" />
                            <span>Share Drive Link</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Cloud Drive Link Display or Input */}
            {confirmedCloudLink ? (
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Folder className="w-4 h-4 text-purple-400 shrink-0" />
                        <div className="min-w-0">
                            <span className="text-[10px] font-mono text-purple-300 block uppercase tracking-wider font-semibold">
                                Cloud Drive Folder
                            </span>
                            <span className="text-xs font-mono text-white/90 truncate block">
                                {confirmedCloudLink}
                            </span>
                        </div>
                    </div>
                    <a
                        href={confirmedCloudLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-mono text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
                    >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            ) : showCloudInput ? (
                <form onSubmit={handleCloudLinkSubmit} className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2 animate-in fade-in">
                    <label className="text-[11px] text-purple-200 block font-mono">
                        Paste Google Drive, Dropbox, or WeTransfer link:
                    </label>
                    <div className="flex gap-1.5">
                        <input
                            type="url"
                            value={cloudLinkInput}
                            onChange={(e) => setCloudLinkInput(e.target.value)}
                            placeholder="https://drive.google.com/drive/folders/..."
                            disabled={isSubmittingCloud}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-purple-400/30 text-white placeholder-white/30 text-xs focus:outline-none focus:border-purple-400 transition-colors font-mono"
                        />
                        <button
                            type="submit"
                            disabled={isSubmittingCloud || !cloudLinkInput.trim()}
                            className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-40 text-white font-semibold text-xs font-mono flex items-center gap-1 transition-all cursor-pointer shrink-0"
                        >
                            {isSubmittingCloud ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Attach</span>}
                        </button>
                    </div>
                    {cloudError && <p className="text-[10px] text-red-400 font-mono">{cloudError}</p>}
                </form>
            ) : null}

            {/* Uploaded Images Preview Thumbnails */}
            {card.images && card.images.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-white/50 font-mono flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-accent" />
                            Received Files ({card.images.length}):
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                        {card.images.slice(0, 8).map((imgUrl, i) => (
                            <a
                                key={i}
                                href={imgUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black/40 shrink-0 hover:border-accent transition-colors"
                            >
                                <img
                                    src={imgUrl}
                                    alt={`File ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </a>
                        ))}
                        {card.images.length > 8 && (
                            <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 shrink-0 flex items-center justify-center text-[10px] font-mono text-white/70">
                                +{card.images.length - 8}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Email Capture / Confirmation */}
            <div className="pt-2 border-t border-white/10">
                {confirmedEmail ? (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-accent/10 border border-accent/30 text-xs text-white">
                        <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="truncate">
                            Files & invoice will be sent to: <strong className="text-accent">{confirmedEmail}</strong>
                        </span>
                    </div>
                ) : (
                    <form onSubmit={handleEmailSubmit} className="space-y-1.5">
                        <label className="text-[11px] text-white/70 block">
                            Where should we email your completed files and invoice?
                        </label>
                        <div className="flex gap-1.5">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                disabled={isSubmittingEmail}
                                className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/30 text-xs focus:outline-none focus:border-accent transition-colors font-mono"
                            />
                            <button
                                type="submit"
                                disabled={isSubmittingEmail || !email.trim()}
                                className="px-3 py-1.5 rounded-xl bg-accent hover:bg-[#b8dd00] disabled:opacity-40 text-black font-semibold text-xs font-mono flex items-center gap-1 transition-all cursor-pointer shrink-0"
                            >
                                {isSubmittingEmail ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Save</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </>
                                )}
                            </button>
                        </div>
                        {emailError && <p className="text-[10px] text-red-400 font-mono">{emailError}</p>}
                    </form>
                )}
            </div>

            {/* Footer SLAs */}
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 pt-1">
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-accent" />
                    {card.turnaround || '24h Standard Turnaround'}
                </span>
                <span>Max 25MB/img (Or Cloud Drive)</span>
            </div>
        </div>
    );
}
