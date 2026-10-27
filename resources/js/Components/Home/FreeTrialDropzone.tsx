import React, { useState, useRef, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
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
    AlertTriangle,
    ArrowRight,
    ArrowLeft,
    Building2,
    Briefcase,
    Globe,
    ShoppingBag,
    RotateCw,
} from 'lucide-react';
import { getAttributionData } from '@/lib/attribution';

const SERVICE_PILLARS = [
    'E-Commerce Catalog Optimization',
    'Clipping Path & Multipath Service',
    'Image Masking (Alpha / Hair)',
    'Ghost Mannequin & Neck Joint',
    'Color Standardization & Swatches',
    'White-Label Agency Extension',
    'Virtual Production & CGI Studio',
    '3D Furniture Modeling & AR',
];

const VOLUME_TIERS = [
    '50 – 200 SKUs / month',
    '200 – 1,000 SKUs / month',
    '1,000 – 5,000 SKUs / month',
    '5,000+ SKUs / month (Enterprise)',
];

const PLATFORMS = [
    'Shopify / Shopify Plus',
    'Amazon Storefront / Seller Central',
    'Magento / Adobe Commerce',
    'BigCommerce',
    'WooCommerce',
    'Custom Headless / Other',
];

export function FreeTrialDropzone() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        website: '',
        service: SERVICE_PILLARS[0],
        monthly_volume: VOLUME_TIERS[1],
        platform: PLATFORMS[0],
        instructions: '',
        attachments: [] as File[],
        honeypot: '',
        captcha_answer: '',
        captcha_token: '',
        // Attribution
        landing_page_url: '',
        submission_page_url: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_term: '',
        utm_content: '',
        click_id: '',
    });

    const [captchaQuestion, setCaptchaQuestion] = useState<string>('');

    const refreshCaptcha = () => {
        fetch('/api/captcha/math')
            .then((res) => res.json())
            .then((res) => {
                if (res.question && res.token) {
                    setCaptchaQuestion(res.question);
                    setData((prev) => ({
                        ...prev,
                        captcha_token: res.token,
                        captcha_answer: '',
                    }));
                }
            })
            .catch(() => {});
    };

    useEffect(() => {
        const attr = getAttributionData();
        setData((prev) => ({
            ...prev,
            landing_page_url: attr.landing_page_url,
            submission_page_url: attr.submission_page_url,
            utm_source: attr.utm_source || '',
            utm_medium: attr.utm_medium || '',
            utm_campaign: attr.utm_campaign || '',
            utm_term: attr.utm_term || '',
            utm_content: attr.utm_content || '',
            click_id: attr.click_id || '',
        }));

        refreshCaptcha();
    }, []);

    useEffect(() => {
        if (
            errors.email ||
            errors.name ||
            errors.trial_exhausted ||
            errors['captcha_answer'] ||
            errors.phone ||
            errors.company ||
            errors.website ||
            errors.service ||
            errors.monthly_volume ||
            errors.platform
        ) {
            setStep(2);
        } else if (errors['attachments'] || errors['attachments.0']) {
            setStep(1);
        }

        if (errors['captcha_answer']) {
            refreshCaptcha();
        }
    }, [errors]);

    const handleFilesAdded = (files: FileList | null) => {
        if (!files) return;
        const validFiles = Array.from(files).filter(
            (file) => file.size <= 25 * 1024 * 1024
        );
        const combined = [...selectedFiles, ...validFiles].slice(0, 3);
        setSelectedFiles(combined);
        setData('attachments', combined);
        if (errors['attachments']) clearErrors('attachments');
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
        const attr = getAttributionData();

        transform((currentData) => ({
            ...currentData,
            submission_page_url: window.location.href,
            landing_page_url: attr.landing_page_url || currentData.landing_page_url || window.location.href,
            utm_source: attr.utm_source || currentData.utm_source || '',
            utm_medium: attr.utm_medium || currentData.utm_medium || '',
            utm_campaign: attr.utm_campaign || currentData.utm_campaign || '',
            utm_term: attr.utm_term || currentData.utm_term || '',
            utm_content: attr.utm_content || currentData.utm_content || '',
            click_id: attr.click_id || currentData.click_id || '',
        }));

        post('/free-trial', {
            forceFormData: true,
            preserveScroll: true,
            onError: () => {
                setStep(2);
            },
        });
    };

    return (
        <section
            id="free-trial"
            className="relative py-20 sm:py-28 bg-[#07080a] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting Sheen */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[28rem] bg-accent/5 rounded-full blur-[240px] pointer-events-none" />

            <div className="w-full max-w-4xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-mono uppercase tracking-[0.2em] text-accent">
                        <Sparkles className="w-3 h-3" />
                        <span>Free 3-Asset Test Pilot</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight whitespace-normal sm:whitespace-nowrap">
                        Test our craft on <span className="text-accent">your raw files.</span>
                    </h2>

                    <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                        Upload up to 3 test files. Receive retouched master files in under 24 hours with zero commitment.
                    </p>

                    {/* Multi-Step Indicator */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 pt-3 font-mono text-xs">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                                step === 1
                                    ? 'bg-accent/15 border-accent text-accent font-bold'
                                    : 'border-white/10 text-neutral-400 hover:text-white'
                            }`}
                        >
                            <span>01. Sample Uploads</span>
                            {selectedFiles.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                        </button>
                        <span className="text-neutral-600">→</span>
                        <button
                            type="button"
                            onClick={() => {
                                if (selectedFiles.length > 0) setStep(2);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                                step === 2
                                    ? 'bg-accent/15 border-accent text-accent font-bold'
                                    : 'border-white/10 text-neutral-400'
                            }`}
                        >
                            <span>02. Brand & Specs</span>
                        </button>
                    </div>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-[#0f1117] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                >
                    {/* Honeypot */}
                    <input
                        type="text"
                        name="website_url"
                        value={data.honeypot}
                        onChange={(e) => setData('honeypot', e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                    />

                    {/* STEP 1: UPLOAD 3 ASSETS */}
                    {step === 1 && (
                        <div className="space-y-6">
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
                                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
                                    isDragOver
                                        ? 'border-accent bg-accent/10 scale-[0.99]'
                                        : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp,.tiff,.tif,.psd,.pdf,.zip"
                                    onChange={(e) => handleFilesAdded(e.target.files)}
                                    className="hidden"
                                />

                                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                                    <UploadCloud className="w-8 h-8" />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-white font-display font-bold text-base sm:text-lg">
                                        Drop your raw photos here, or <span className="text-accent underline">browse files</span>
                                    </p>
                                    <p className="text-neutral-400 text-xs font-mono">
                                        Upload up to 3 test files (Max 25MB each). Formats: PSD, TIFF, RAW, JPG, PNG, ZIP.
                                    </p>
                                </div>
                            </div>

                            {/* Selected Files List */}
                            {selectedFiles.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
                                        <span>Selected Assets ({selectedFiles.length} / 3)</span>
                                        <span>Ready for upload</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {selectedFiles.map((file, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 text-xs"
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileImage className="w-4 h-4 text-accent shrink-0" />
                                                    <span className="text-white truncate font-mono text-[11px]">{file.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(idx);
                                                    }}
                                                    className="text-neutral-400 hover:text-red-400 p-1"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                                    <Lock className="w-3.5 h-3.5 text-accent" />
                                    <span>Protected under Mutual Non-Disclosure</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all flex items-center gap-2 shadow-lg"
                                >
                                    <span>Next: Brand Coordinates</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: B2B BRAND & SPECIFICATION COORDINATES */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Hidden Captcha Token */}
                            <input type="hidden" name="captcha_token" value={data.captcha_token} />

                            {/* Trial Limit Notice Banner */}
                            {errors.trial_exhausted && (
                                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm space-y-3">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="font-bold text-amber-300">Free Pilot Quota Notice</p>
                                            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                                                {errors.trial_exhausted}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-amber-500/20">
                                        <Link
                                            href="/pricing"
                                            className="px-4 py-2 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all"
                                        >
                                            Explore Production Pricing ($0.49/img)
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="px-4 py-2 rounded-xl border border-white/20 text-white font-mono text-xs hover:border-white transition-colors"
                                        >
                                            Contact Studio Team
                                        </Link>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                                        <span>Full Name *</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Alex Mercer"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
                                    />
                                    {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                                        <span>Work Email Address *</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="alex@company.com"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
                                    />
                                    {(errors.email || errors.trial_exhausted) && (
                                        <p className="text-xs text-red-400 font-mono">
                                            {errors.email || errors.trial_exhausted}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-accent" />
                                        <span>Company Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.company}
                                        onChange={(e) => setData('company', e.target.value)}
                                        placeholder="Acme Footwear Co."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-accent" />
                                        <span>Your Role</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        placeholder="Head of Visual Production / Founder"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-accent" />
                                        <span>Store / Website URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="https://acme.com"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                                        <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                                        <span>Primary Platform</span>
                                    </label>
                                    <select
                                        value={data.platform}
                                        onChange={(e) => setData('platform', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent"
                                    >
                                        {PLATFORMS.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold">
                                        Primary Service Needed
                                    </label>
                                    <select
                                        value={data.service}
                                        onChange={(e) => setData('service', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent"
                                    >
                                        {SERVICE_PILLARS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold">
                                        Estimated Monthly Volume
                                    </label>
                                    <select
                                        value={data.monthly_volume}
                                        onChange={(e) => setData('monthly_volume', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent"
                                    >
                                        {VOLUME_TIERS.map((v) => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-300 font-bold">
                                    Retouching Instructions / Style Notes (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.instructions}
                                    onChange={(e) => setData('instructions', e.target.value)}
                                    placeholder="e.g. Pure white 255 background, subtle contact shadow, preserve natural fabric texture, crop 1000x1000."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
                                />
                            </div>

                            {/* Math Spam Protection (Doc §4.4) */}
                            {captchaQuestion && (
                                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-mono text-neutral-300 font-bold flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                                            <span>Security Verification: What is {captchaQuestion} ?</span>
                                            <button
                                                type="button"
                                                onClick={refreshCaptcha}
                                                title="Generate new question"
                                                className="p-1 text-neutral-500 hover:text-accent transition-colors"
                                            >
                                                <RotateCw className="w-3 h-3" />
                                            </button>
                                        </span>
                                        <span className="text-[11px] text-neutral-500 font-mono">Solve the math problem to submit.</span>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={data.captcha_answer}
                                        onChange={(e) => setData('captcha_answer', e.target.value)}
                                        placeholder="Answer"
                                        className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-center text-white focus:outline-none focus:border-accent"
                                    />
                                </div>
                            )}

                            {errors['captcha_answer'] && (
                                <p className="text-xs text-rose-400 font-mono">
                                    {errors['captcha_answer']}
                                </p>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-4 py-2.5 rounded-xl border border-white/10 text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-mono"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back to Files</span>
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3.5 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Transmitting Assets...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Submit Free 3-Asset Pilot</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}
