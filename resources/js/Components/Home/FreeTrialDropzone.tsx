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
    Zap,
    SlidersHorizontal,
} from 'lucide-react';

export function FreeTrialDropzone() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [selectedService, setSelectedService] = useState<string>('Background Removal');
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        company: '',
        service_interest: 'Background Removal',
        turnaround_time: 'Standard 24h',
        output_format: 'Transparent PNG',
        message: '',
        inquiry_type: 'free_trial',
        attachments: [] as File[],
        honeypot: '',
    });

    const popularServices = [
        'Background Removal',
        'Ghost Mannequin',
        'Model Retouch',
        'Fine Jewelry',
        'Multipath & Clipping',
        'Color Correction',
    ];

    const turnaroundOptions = ['Standard 24h', 'Rush 12h', 'Relaxed 48h'];
    const outputFormats = [
        'Transparent PNG',
        'Pure White JPG',
        'Layered PSD with Paths',
        'High-Res TIFF',
    ];

    const handleFilesAdded = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).filter((file) => file.size <= 25 * 1024 * 1024);
        const combined = [...selectedFiles, ...newFiles].slice(0, 5);
        setSelectedFiles(combined);
        setData('attachments', combined);
    };

    const removeFile = (indexToRemove: number) => {
        const filtered = selectedFiles.filter((_, idx) => idx !== indexToRemove);
        setSelectedFiles(filtered);
        setData('attachments', filtered);
    };

    const handleSelectService = (svc: string) => {
        setSelectedService(svc);
        setData('service_interest', svc);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure message has meaningful content if left blank by visitor
        if (!data.message.trim()) {
            data.message = `Free trial request for ${selectedService}. Standard delivery: ${data.turnaround_time}, Export: ${data.output_format}.`;
        }

        post('/contact', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
                setSelectedFiles([]);
            },
        });
    };

    return (
        <section
            id="trial-uploader-section"
            className="relative py-20 sm:py-28 bg-[#07080a] border-t border-white/10 overflow-hidden"
        >
            {/* Subtle Ambient Backlight */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[42rem] h-[24rem] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none" />

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00] mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>2 Free Sample Edits · Zero Cost</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.1]">
                        Test Our Craft On <br />
                        <span className="text-[#d4ff00]">Your Actual Images.</span>
                    </h2>

                    <p className="mt-3.5 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                        Upload up to 3 sample photos. Our studio artists will perform hand-drawn clipping paths, ghost mannequin jointing, or high-end retouching and return production-ready files within 24 hours.
                    </p>
                </div>

                {submitted ? (
                    /* Celebratory Success State */
                    <div className="max-w-xl mx-auto p-8 sm:p-12 rounded-3xl border border-[#d4ff00]/40 bg-[#0d0e14] text-center space-y-6 shadow-[0_0_50px_rgba(212,255,0,0.15)] animate-in fade-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-[#d4ff00]/15 border-2 border-[#d4ff00] text-[#d4ff00] mx-auto flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                                Test Batch Received!
                            </h3>
                            <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                                Your files are now queued with our senior quality team. Expect your retouched high-resolution assets delivered straight to your email within 24 hours.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
                            >
                                Upload Another Sample
                            </button>
                        </div>
                    </div>
                ) : (
                    /* The Streamlined, Friction-Free 2-Column Card */
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl border border-white/10 bg-[#0c0d12]/95 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl"
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

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                            {/* LEFT COLUMN: Clean Drag & Drop File Zone */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-[#d4ff00] uppercase tracking-wider font-bold">
                                        Step 1 · Add Your Photos
                                    </span>
                                    <span className="text-neutral-500">Up to 3-5 images</span>
                                </div>

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
                                    className={`relative rounded-2xl border-2 border-dashed p-7 sm:p-9 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                                        isDragOver
                                            ? 'border-[#d4ff00] bg-[#d4ff00]/10 scale-[1.01]'
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

                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#d4ff00] flex items-center justify-center mb-3">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>

                                    <p className="text-sm font-semibold text-white">
                                        <span className="text-[#d4ff00]">Click to browse</span> or drop files here
                                    </p>
                                    <p className="text-xs text-neutral-400 mt-1 font-sans">
                                        JPG, PNG, PSD, TIFF, RAW, ZIP · Up to 25MB each
                                    </p>
                                </div>

                                {/* Selected File List */}
                                {selectedFiles.length > 0 && (
                                    <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
                                        {selectedFiles.map((file, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-left"
                                            >
                                                <div className="flex items-center gap-2.5 overflow-hidden">
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
                                                    className="p-1 rounded-md text-neutral-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                                                    aria-label="Remove file"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Security Badges */}
                                <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-neutral-400 font-mono">
                                    <span className="flex items-center gap-1.5">
                                        <Lock className="w-3 h-3 text-[#d4ff00]" />
                                        <span>Strict NDA Protection</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Zap className="w-3 h-3 text-[#d4ff00]" />
                                        <span>24h Turnaround</span>
                                    </span>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Service Choice & Destination Email */}
                            <div className="lg:col-span-7 space-y-5">
                                {/* Service Selection Chips */}
                                <div className="space-y-2.5">
                                    <label className="text-xs font-mono uppercase tracking-wider text-[#d4ff00] font-bold block">
                                        Step 2 · Select Service to Test
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {popularServices.map((svc) => {
                                            const isSelected = selectedService === svc;
                                            return (
                                                <button
                                                    type="button"
                                                    key={svc}
                                                    onClick={() => handleSelectService(svc)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wide transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-[#d4ff00] text-black font-bold shadow-[0_0_12px_rgba(212,255,0,0.25)]'
                                                            : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/10'
                                                    }`}
                                                >
                                                    {svc}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Contact Inputs */}
                                <div className="space-y-3">
                                    <label className="text-xs font-mono uppercase tracking-wider text-[#d4ff00] font-bold block">
                                        Step 3 · Delivery Details
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Your Name *"
                                                required
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#d4ff00] transition-colors font-sans"
                                            />
                                            {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Work Email (for results) *"
                                                required
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#d4ff00] transition-colors font-sans"
                                            />
                                            {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <textarea
                                            rows={2}
                                            placeholder="Editing instructions (optional: e.g. transparent background, keep drop shadow, remove dust)..."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#d4ff00] transition-colors font-sans resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Collapsible Preferences (Turnaround & Format) */}
                                <div className="pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="text-[11px] font-mono text-neutral-400 hover:text-[#d4ff00] flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <SlidersHorizontal className="w-3 h-3" />
                                        <span>{showAdvanced ? 'Hide format & SLA options' : '+ Format & turnaround options'}</span>
                                        <span className="text-neutral-500">
                                            (Default: Standard 24h · Transparent PNG)
                                        </span>
                                    </button>

                                    {showAdvanced && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/10 animate-in fade-in duration-200">
                                            <div>
                                                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                                                    Turnaround SLA
                                                </label>
                                                <select
                                                    value={data.turnaround_time}
                                                    onChange={(e) => setData('turnaround_time', e.target.value)}
                                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#12141c] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4ff00]"
                                                >
                                                    {turnaroundOptions.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                                                    Export Format
                                                </label>
                                                <select
                                                    value={data.output_format}
                                                    onChange={(e) => setData('output_format', e.target.value)}
                                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#12141c] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4ff00]"
                                                >
                                                    {outputFormats.map((fmt) => (
                                                        <option key={fmt} value={fmt}>
                                                            {fmt}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3.5 px-6 rounded-full bg-[#d4ff00] hover:bg-[#bde600] text-black font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,255,0,0.25)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Transmitting Files...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Get 2 Free Sample Edits</span>
                                                <Send className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] text-neutral-400 font-sans">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" />
                                        <span>No credit card required · Hand-crafted by senior artists</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
