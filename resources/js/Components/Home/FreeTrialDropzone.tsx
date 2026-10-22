import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import {
    UploadCloud,
    FileImage,
    X,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Sparkles,
    Send,
    Loader2,
    FileCheck,
} from 'lucide-react';

export function FreeTrialDropzone() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [selectedServices, setSelectedServices] = useState<string[]>(['Background Removal']);
    const [turnaround, setTurnaround] = useState<string>('Standard 24h');
    const [outputFormat, setOutputFormat] = useState<string>('Transparent PNG');
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

    const availableServices = [
        'Background Removal',
        'Ghost Mannequin',
        'High-End Model Retouch',
        'Fine Jewelry Retouch',
        '3D CGI Modeling',
        'Multipath & Clipping',
        'Shadow & Reflection',
        'Color Correction',
    ];

    const turnaroundOptions = [
        { label: 'Rush 12h', desc: 'Emergency turnaround for active launches' },
        { label: 'Standard 24h', desc: 'Recommended turnaround for batch testing' },
        { label: 'Relaxed 48h', desc: 'Extended review with multiple sample variants' },
    ];

    const outputFormats = [
        'Transparent PNG',
        'Pure White JPG',
        'Layered PSD with Paths',
        'High-Res TIFF',
    ];

    const handleFilesAdded = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).filter((file) => {
            // max 25MB per file
            return file.size <= 25 * 1024 * 1024;
        });

        const combined = [...selectedFiles, ...newFiles].slice(0, 5); // Allow up to 5 trial images
        setSelectedFiles(combined);
        setData('attachments', combined);
    };

    const removeFile = (indexToRemove: number) => {
        const filtered = selectedFiles.filter((_, idx) => idx !== indexToRemove);
        setSelectedFiles(filtered);
        setData('attachments', filtered);
    };

    const toggleService = (svc: string) => {
        let updated: string[];
        if (selectedServices.includes(svc)) {
            updated = selectedServices.filter((s) => s !== svc);
            if (updated.length === 0) updated = [svc];
        } else {
            updated = [...selectedServices, svc];
        }
        setSelectedServices(updated);
        setData('service_interest', updated.join(', '));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

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
            className="relative py-28 sm:py-36 bg-[#07080a] border-t border-white/10 overflow-hidden"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[50rem] h-[30rem] bg-[#d4ff00]/5 rounded-full blur-[220px] pointer-events-none" />

            <div className="w-full max-w-[96%] xl:max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00] mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>[ NO RISK · ZERO UPFRONT COST ]</span>
                    </div>

                    <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.05]">
                        Test Our Craft On <br />
                        <span className="text-[#d4ff00]">Your Actual Images.</span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                        Upload up to 3 sample photos. Our studio artists will perform hand-drawn clipping paths, ghost mannequin jointing, or high-end retouching and return production-ready files within 24 hours.
                    </p>
                </div>

                {submitted ? (
                    /* Celebratory Success State */
                    <div className="max-w-2xl mx-auto p-10 sm:p-14 rounded-3xl border border-[#d4ff00]/40 bg-[#0d0e14] text-center space-y-6 shadow-[0_0_50px_rgba(212,255,0,0.15)] animate-in fade-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-[#d4ff00]/15 border-2 border-[#d4ff00] text-[#d4ff00] mx-auto flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <h3 className="text-3xl font-display font-bold text-white tracking-tight">
                            Sample Batch Received!
                        </h3>

                        <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                            Your test files have entered our high-precision production queue. Our Quality Assurance director is assigning them to a dedicated senior artist. Expect your finished retouched assets via email within your requested window.
                        </p>

                        <div className="pt-4 flex justify-center gap-4">
                            <button
                                onClick={() => setSubmitted(false)}
                                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest transition-colors"
                            >
                                Submit Another Batch
                            </button>
                        </div>
                    </div>
                ) : (
                    /* The High-Conversion Trial Uploader Form */
                    <form
                        onSubmit={handleSubmit}
                        className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#0c0d12]/90 backdrop-blur-xl p-6 sm:p-10 lg:p-12 shadow-2xl space-y-10"
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

                        {/* Step 1: Drag & Drop Zone */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold flex items-center gap-2">
                                    <span>01.</span>
                                    <span>Upload Test Images (Max 3-5 Images · up to 25MB each)</span>
                                </label>
                                <span className="text-[11px] font-mono text-neutral-500 uppercase">
                                    JPG, PNG, PSD, TIFF, ZIP
                                </span>
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
                                className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
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

                                <div className="space-y-3">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-[#d4ff00] mx-auto flex items-center justify-center">
                                        <UploadCloud className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-medium text-white">
                                            <span className="text-[#d4ff00] font-bold">Click to browse</span> or drag and drop files here
                                        </p>
                                        <p className="text-xs text-neutral-400 font-sans">
                                            Strict NDA confidential handling. Files transmitted via 256-bit TLS encryption.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Selected File Previews */}
                            {selectedFiles.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    {selectedFiles.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03] text-left"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FileImage className="w-5 h-5 text-[#d4ff00] shrink-0" />
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
                                                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                                                aria-label="Remove file"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Step 2: Desired Services */}
                        <div className="space-y-4">
                            <label className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold flex items-center gap-2">
                                <span>02.</span>
                                <span>Select Desired Services to Test</span>
                            </label>

                            <div className="flex flex-wrap gap-2.5">
                                {availableServices.map((svc) => {
                                    const isSelected = selectedServices.includes(svc);
                                    return (
                                        <button
                                            type="button"
                                            key={svc}
                                            onClick={() => toggleService(svc)}
                                            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-[#d4ff00] text-black font-bold border border-[#d4ff00] shadow-[0_0_12px_rgba(212,255,0,0.25)]'
                                                    : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/10'
                                            }`}
                                        >
                                            {svc}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step 3: Turnaround SLA & Output Preference */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Turnaround SLA */}
                            <div className="space-y-3">
                                <label className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold flex items-center gap-2">
                                    <span>03.</span>
                                    <span>Turnaround SLA</span>
                                </label>

                                <div className="space-y-2">
                                    {turnaroundOptions.map((opt) => (
                                        <div
                                            key={opt.label}
                                            onClick={() => {
                                                setTurnaround(opt.label);
                                                setData('turnaround_time', opt.label);
                                            }}
                                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                turnaround === opt.label
                                                    ? 'border-[#d4ff00] bg-[#d4ff00]/10 text-white'
                                                    : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                                                    {opt.label}
                                                </span>
                                                <Clock className={`w-3.5 h-3.5 ${turnaround === opt.label ? 'text-[#d4ff00]' : 'text-neutral-500'}`} />
                                            </div>
                                            <span className="text-[11px] text-neutral-400 block pt-0.5 font-sans">
                                                {opt.desc}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Output Format */}
                            <div className="space-y-3">
                                <label className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold flex items-center gap-2">
                                    <span>04.</span>
                                    <span>Export Format</span>
                                </label>

                                <div className="space-y-2">
                                    {outputFormats.map((fmt) => (
                                        <div
                                            key={fmt}
                                            onClick={() => {
                                                setOutputFormat(fmt);
                                                setData('output_format', fmt);
                                            }}
                                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                outputFormat === fmt
                                                    ? 'border-[#d4ff00] bg-[#d4ff00]/10 text-white'
                                                    : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20'
                                            }`}
                                        >
                                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                                                {fmt}
                                            </span>
                                            <FileCheck className={`w-4 h-4 ${outputFormat === fmt ? 'text-[#d4ff00]' : 'text-neutral-500'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Contact & Instructions */}
                        <div className="space-y-4 pt-2">
                            <label className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold flex items-center gap-2">
                                <span>05.</span>
                                <span>Delivery Information & Notes</span>
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Full Name *"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#d4ff00] transition-colors font-sans"
                                    />
                                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        placeholder="Business Email *"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#d4ff00] transition-colors font-sans"
                                    />
                                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="Company / Brand Name or Website"
                                        value={data.company}
                                        onChange={(e) => setData('company', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#d4ff00] transition-colors font-sans"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <textarea
                                        rows={3}
                                        placeholder="Specific instructions (e.g. keep inner collar visible, create soft floor shadow, add pure white background)..."
                                        required
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#d4ff00] transition-colors font-sans resize-none"
                                    />
                                    {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-neutral-400 text-xs">
                                <ShieldCheck className="w-4 h-4 text-[#d4ff00]" />
                                <span>100% Free · No Payment Required · Unlimited Revisions</span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#d4ff00] hover:bg-[#bde600] text-black font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,255,0,0.3)] transition-all duration-300 disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Transmitting Files...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit Free Trial Batch</span>
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
