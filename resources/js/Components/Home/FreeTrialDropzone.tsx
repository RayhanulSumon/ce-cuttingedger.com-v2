import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import {
    UploadCloud,
    FileImage,
    X,
    CheckCircle2,
    ShieldCheck,
    Sparkles,
    Send,
    Loader2,
    Lock,
    Clock,
    Layers,
} from 'lucide-react';

const POPULAR_SERVICES = [
    'Background Removal & Clipping Path',
    'Ghost Mannequin & Neck Joint',
    'High-End Fashion & Model Retouching',
    'Fine Jewelry & Luxury Product',
    'Color Correction & Vector Masking',
    '3D CGI Modeling & Product Render',
];

export function FreeTrialDropzone() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        service: POPULAR_SERVICES[0],
        instructions: '',
        attachments: [] as File[],
        honeypot: '',
    });

    const handleFilesAdded = (files: FileList | null) => {
        if (!files) return;
        const validFiles = Array.from(files).filter(
            (file) => file.size <= 25 * 1024 * 1024
        );
        const combined = [...selectedFiles, ...validFiles].slice(0, 3);
        setSelectedFiles(combined);
        setData('attachments', combined);
    };

    const removeFile = (indexToRemove: number) => {
        const filtered = selectedFiles.filter((_, idx) => idx !== indexToRemove);
        setSelectedFiles(filtered);
        setData('attachments', filtered);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/free-trial', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setSubmitted(true);
                const flash = (page.props as any)?.flash;
                if (flash?.success) {
                    const match = flash.success.match(/#(\d+)/);
                    if (match) setCreatedOrderNumber(match[1]);
                }
                reset();
                setSelectedFiles([]);
            },
        });
    };

    return (
        <section
            id="free-trial"
            className="relative py-18 sm:py-24 lg:py-28 bg-[#07080a] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting Sheen */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[28rem] bg-[#d4ff00]/5 rounded-full blur-[240px] pointer-events-none" />

            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/25 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Zero Risk · 2 Free Sample Edits</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Clash_Display',_'Syne',_sans-serif] font-bold text-white uppercase tracking-tight leading-[1.08]">
                        TEST OUR CRAFT ON <br />
                        <span className="text-[#d4ff00]">YOUR ACTUAL IMAGES.</span>
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                        Upload up to 3 test photos. Our studio artists will edit and return production-ready files within 24 hours. No payment, no commitment.
                    </p>
                </div>

                {submitted ? (
                    /* Clean Success State */
                    <div className="max-w-lg mx-auto p-8 sm:p-10 rounded-3xl border border-[#d4ff00]/30 bg-[#12141c]/90 backdrop-blur-2xl text-center space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                        <div className="w-16 h-16 rounded-2xl bg-[#d4ff00]/15 border border-[#d4ff00]/40 text-[#d4ff00] mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(212,255,0,0.2)]">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-mono uppercase tracking-wider text-[#d4ff00] font-semibold">
                                {createdOrderNumber ? `Trial Order #${createdOrderNumber}` : 'Trial Request Transmitted'}
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-['Clash_Display',_'Syne',_sans-serif] font-bold text-white uppercase tracking-tight">
                                Test Batch Queued
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                                Your files are now in our production pipeline. Expect your high-resolution retouched assets delivered to your inbox within 24 hours.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
                            >
                                Submit Another Sample
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Streamlined, Minimalist Glass Card */
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl border border-white/10 bg-[#10121a]/85 backdrop-blur-2xl p-6 sm:p-9 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] space-y-6"
                    >
                        {/* Hidden Honeypot */}
                        <div className="hidden" aria-hidden="true">
                            <input
                                type="text"
                                name="honeypot"
                                tabIndex={-1}
                                value={data.honeypot}
                                onChange={(e) => setData('honeypot', e.target.value)}
                                autoComplete="off"
                            />
                        </div>

                        {/* 1. Sleek Dropzone */}
                        <div>
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(true);
                                }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(false);
                                    handleFilesAdded(e.dataTransfer.files);
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative rounded-2xl border-2 border-dashed p-7 sm:p-9 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] ${
                                    isDragOver
                                        ? 'border-[#d4ff00] bg-[#d4ff00]/10 scale-[1.005]'
                                        : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp,.tiff,.psd,.zip,.pdf"
                                    onChange={(e) => handleFilesAdded(e.target.files)}
                                    className="hidden"
                                />

                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#d4ff00] flex items-center justify-center mb-3 shadow-inner">
                                    <UploadCloud className="w-6 h-6" />
                                </div>

                                <p className="text-sm font-semibold text-white">
                                    <span className="text-[#d4ff00]">Click to upload</span> or drag test images here
                                </p>
                                <p className="text-xs text-neutral-400 mt-1 font-sans">
                                    JPG, PNG, PSD, TIFF, RAW, ZIP · Up to 3 sample files (25MB each)
                                </p>
                            </div>

                            {/* Selected File Chips */}
                            {selectedFiles.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                                    {selectedFiles.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-left"
                                        >
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileImage className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                                <div className="truncate">
                                                    <span className="text-xs text-neutral-200 font-mono block truncate">
                                                        {file.name}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-500 font-mono">
                                                        {formatFileSize(file.size)}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(idx);
                                                }}
                                                className="p-1 rounded-md text-neutral-400 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                                                aria-label="Remove file"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Streamlined Form Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4">
                            {/* Service Selector Dropdown */}
                            <div className="sm:col-span-12">
                                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 block mb-1.5 font-semibold">
                                    Service To Test
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.service}
                                        onChange={(e) => setData('service', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d4ff00] transition-colors cursor-pointer appearance-none"
                                    >
                                        {POPULAR_SERVICES.map((svc) => (
                                            <option key={svc} value={svc} className="bg-[#12141c] text-white">
                                                {svc}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                                        <Layers className="w-4 h-4 text-[#d4ff00]" />
                                    </div>
                                </div>
                            </div>

                            {/* Client Name */}
                            <div className="sm:col-span-6">
                                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 block mb-1.5 font-semibold">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Alex Jensen"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d4ff00] transition-colors"
                                />
                                {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                            </div>

                            {/* Client Email */}
                            <div className="sm:col-span-6">
                                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 block mb-1.5 font-semibold">
                                    Work Email *
                                </label>
                                <input
                                    type="email"
                                    placeholder="e.g. alex@studio.com"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d4ff00] transition-colors"
                                />
                                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                            </div>

                            {/* Optional Editing Notes */}
                            <div className="sm:col-span-12">
                                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                                    Editing Notes (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Transparent PNG, keep soft shadow, smooth wrinkles..."
                                    value={data.instructions}
                                    onChange={(e) => setData('instructions', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#d4ff00] transition-colors"
                                />
                            </div>
                        </div>

                        {/* 3. Action Button & Trust Signals */}
                        <div className="pt-2 space-y-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 px-6 rounded-full bg-[#d4ff00] hover:bg-[#bde600] text-black font-mono text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,255,0,0.25)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Submitting Trial Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit Free Trial Order</span>
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {/* Trust Signals */}
                            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-1 text-[11px] text-neutral-400 font-mono">
                                <span className="flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-[#d4ff00]" />
                                    <span>Strict NDA Protected</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#d4ff00]" />
                                    <span>Sub-24h Return</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" />
                                    <span>No Card Required</span>
                                </span>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
