import React, { useMemo, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    FileUp,
    Folder,
    Footprints,
    ImagePlus,
    Layers,
    Shirt,
    Sparkles,
    Trash2,
    UserCheck,
    UserPlus,
} from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { LOOKS, Look } from '@/Components/Landing/TryOn/looks';
import { PAD_X } from '@/Components/Landing/shared';
import { LandingLayout } from '@/Layouts/LandingLayout';

const PAGE_BACKGROUND = 'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

const VOLUME_OPTIONS = [
    'Pilot Test (1–10 looks)',
    '10–50 looks / month',
    '50–200 looks / month',
    '200+ looks / Enterprise',
];

interface TryOnQuoteProps {
    tryOnLooks?: Look[];
    initialLook?: string;
    initialService?: string;
}

interface GarmentUploadSlotProps {
    stepNumber: string;
    title: string;
    subtitle: string;
    file: File | null;
    previewUrl: string | null;
    onSelectFile: (file: File | null) => void;
    icon: React.ReactNode;
    error?: string;
}

function GarmentUploadSlot({
    stepNumber,
    title,
    subtitle,
    file,
    previewUrl,
    onSelectFile,
    icon,
    error,
}: GarmentUploadSlotProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0] ?? null;
        if (picked) {
            onSelectFile(picked);
        }
    };

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-ink/12 bg-[#f8fafc] p-4 transition-all hover:border-primary/40">
            <div>
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                        {icon}
                        File {stepNumber}
                    </span>
                    {file && (
                        <button
                            type="button"
                            onClick={() => {
                                onSelectFile(null);
                                if (inputRef.current) inputRef.current.value = '';
                            }}
                            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700"
                        >
                            <Trash2 size={13} />
                            Remove
                        </button>
                    )}
                </div>

                <h3 className="mt-2.5 text-sm font-bold text-ink">{title}</h3>
                <p className="mt-0.5 text-[11px] text-subtle">{subtitle}</p>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.tiff,.psd"
                onChange={handleChange}
                className="hidden"
            />

            {previewUrl && file ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-ink/10 bg-white">
                    <div className="relative aspect-[4/3] w-full bg-[#eef3f8]">
                        <img
                            src={previewUrl}
                            alt={title}
                            className="h-full w-full object-contain p-2"
                        />
                    </div>
                    <div className="flex items-center justify-between border-t border-ink/10 px-3 py-2 text-[11px]">
                        <span className="truncate font-semibold text-ink">{file.name}</span>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="ml-2 shrink-0 cursor-pointer font-bold text-primary hover:underline"
                        >
                            Replace
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="mt-3 flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink/20 bg-white p-4 text-center transition-colors hover:border-primary hover:bg-primary/5"
                >
                    <FileUp className="h-6 w-6 text-primary" />
                    <span className="mt-2 text-xs font-bold text-ink">Upload {title}</span>
                    <span className="mt-0.5 text-[10px] text-subtle">
                        Flat-lay, mannequin, or hanger photo
                    </span>
                </button>
            )}

            {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
        </div>
    );
}

export default function TryOnQuote({
    tryOnLooks,
    initialLook = '',
}: TryOnQuoteProps) {
    const { auth, flash, errors } = usePage<{
        auth?: {
            user?: {
                name: string;
                email: string;
                company?: string | null;
                phone?: string | null;
            } | null;
        };
        flash?: { success?: string; error?: string };
        errors?: Record<string, string>;
    }>().props;

    const looks = tryOnLooks && tryOnLooks.length > 0 ? tryOnLooks : LOOKS;

    // Resolve initial look from ?look=... query parameter
    const matchedInitialLook = useMemo(() => {
        const needle = initialLook.trim().toLowerCase();
        if (!needle) return looks[0] ?? null;
        return (
            looks.find(
                (l) =>
                    l.slug?.toLowerCase() === needle ||
                    l.name.toLowerCase() === needle ||
                    l.modelName.toLowerCase() === needle ||
                    l.name.toLowerCase().includes(needle)
            ) ??
            looks[0] ??
            null
        );
    }, [initialLook, looks]);

    const [modelSource, setModelSource] = useState<'our_model' | 'custom_model'>('our_model');
    const [selectedLookId, setSelectedLookId] = useState<number | null>(matchedInitialLook?.id ?? null);
    const [selectedLookName, setSelectedLookName] = useState<string>(
        matchedInitialLook?.name ?? looks[0]?.name ?? ''
    );

    const activeLook = useMemo(() => {
        if (selectedLookId !== null) {
            const byId = looks.find((l) => l.id === selectedLookId);
            if (byId) return byId;
        }
        return looks.find((l) => l.name === selectedLookName) ?? looks[0] ?? null;
    }, [selectedLookId, selectedLookName, looks]);

    // Custom Model file state (when modelSource === 'custom_model')
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [modelPreview, setModelPreview] = useState<string | null>(null);
    const customModelInputRef = useRef<HTMLInputElement | null>(null);

    // 3 Dedicated Garment Upload Slots: 1. Top, 2. Bottom / Below, 3. Shoes
    const [garmentTop, setGarmentTop] = useState<File | null>(null);
    const [topPreview, setTopPreview] = useState<string | null>(null);

    const [garmentBottom, setGarmentBottom] = useState<File | null>(null);
    const [bottomPreview, setBottomPreview] = useState<string | null>(null);

    const [garmentShoes, setGarmentShoes] = useState<File | null>(null);
    const [shoesPreview, setShoesPreview] = useState<string | null>(null);

    // Description for Other + Contact Fields (pre-filled from authenticated client account)
    const [instructions, setInstructions] = useState('');
    const [cloudLink, setCloudLink] = useState('');
    const [monthlyVolume, setMonthlyVolume] = useState(VOLUME_OPTIONS[0]);
    const [name, setName] = useState(auth?.user?.name || '');
    const [email, setEmail] = useState(auth?.user?.email || '');
    const [company, setCompany] = useState(auth?.user?.company || '');
    const [phone, setPhone] = useState(auth?.user?.phone || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileWithPreview = (
        file: File | null,
        setFile: (f: File | null) => void,
        setPreview: (url: string | null) => void
    ) => {
        setFile(file);
        if (!file) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
    };

    const handleSelectLook = (look: Look) => {
        setSelectedLookId(look.id ?? null);
        setSelectedLookName(look.name);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            '/virtual-try-on/quote',
            {
                model_source: modelSource,
                try_on_look_id: modelSource === 'our_model' ? (activeLook?.id ?? null) : null,
                selected_look_name: modelSource === 'our_model' ? (activeLook?.name ?? '') : 'Client Uploaded Model',
                model_file: modelSource === 'custom_model' ? modelFile : null,
                garment_top: garmentTop,
                garment_bottom: garmentBottom,
                garment_shoes: garmentShoes,
                instructions,
                cloud_link: cloudLink,
                monthly_volume: monthlyVolume,
                name,
                email,
                company,
                phone,
                submission_page_url: typeof window !== 'undefined' ? window.location.href : '',
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <div className="min-h-screen bg-white text-ink">
            <SeoHead
                title="Request a Virtual Try-On Quote — AI Garment Draping & Fitting"
                description="Select one of our studio models or upload your own model, attach your Top, Bottom, and Shoes garment photos, and receive a custom Virtual Try-On quote."
            />

            {/* Header Hero */}
            <section style={{ background: PAGE_BACKGROUND }} className={`pb-12 pt-28 sm:pt-32 ${PAD_X}`}>
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Link
                            href="/#try-on"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-subtle transition-colors hover:text-ink"
                        >
                            <ArrowLeft size={14} />
                            Back to Virtual Try-On Runway
                        </Link>
                        {auth?.user && (
                            <Link
                                href="/portal"
                                className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-1.5 text-xs font-bold text-ink transition-colors hover:border-primary hover:text-primary"
                            >
                                <UserCheck size={13} className="text-primary" />
                                My Client Portal ({auth.user.name})
                            </Link>
                        )}
                    </div>

                    <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                                Capability 02 // AI Virtual Try-On Studio
                            </p>
                            <h1 className="mt-2 font-michroma text-[clamp(24px,3.2vw,44px)] font-normal leading-[1.15] tracking-[0.08em] text-ink">
                                Request a Virtual Try-On Quote
                            </h1>
                            <p className="mt-3 max-w-[62ch] text-sm leading-[1.65] text-subtle sm:text-base">
                                Choose one of our photoreal runway models or upload your own model photo, then attach your Top, Below/Bottom, and Shoe garments for seamless AI fitting.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Form Content */}
            <main className={`py-10 sm:py-14 ${PAD_X}`}>
                <div className="mx-auto max-w-7xl">
                    {flash?.success && (
                        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/90 p-5 text-emerald-950 shadow-sm">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                            <div>
                                <h3 className="text-sm font-bold">Virtual Try-On Quote Submitted</h3>
                                <p className="mt-1 text-xs leading-relaxed text-emerald-800">{flash.success}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* Left 8 Columns: Step 1 (Model), Step 2 (3 Garment Slots), Step 3 (Other Description) */}
                        <div className="space-y-10 lg:col-span-8">
                            {/* STEP 1: Select Model Source (Our Model vs Your Model) */}
                            <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_12px_34px_-18px_rgba(15,23,42,0.12)] sm:p-8">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                                            Step 01
                                        </span>
                                        <h2 className="mt-1 text-lg font-bold text-ink sm:text-xl">
                                            Choose Model Source
                                        </h2>
                                        <p className="mt-0.5 text-xs text-subtle">
                                            Select one of our studio runway models or upload your own model photo.
                                        </p>
                                    </div>

                                    {/* Toggle: Our Model vs Your Own Model */}
                                    <div
                                        role="tablist"
                                        aria-label="Model Source"
                                        className="inline-flex rounded-2xl border border-ink/10 bg-[#f8fafc] p-1"
                                    >
                                        <button
                                            type="button"
                                            role="tab"
                                            aria-selected={modelSource === 'our_model'}
                                            onClick={() => setModelSource('our_model')}
                                            className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                                modelSource === 'our_model'
                                                    ? 'bg-ink text-white shadow-sm'
                                                    : 'text-subtle hover:text-ink'
                                            }`}
                                        >
                                            <UserCheck size={14} />
                                            Use Our Model
                                        </button>
                                        <button
                                            type="button"
                                            role="tab"
                                            aria-selected={modelSource === 'custom_model'}
                                            onClick={() => setModelSource('custom_model')}
                                            className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                                modelSource === 'custom_model'
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'text-subtle hover:text-ink'
                                            }`}
                                        >
                                            <UserPlus size={14} />
                                            Use Your Own Model
                                        </button>
                                    </div>
                                </div>

                                {/* Option A: Our Model Grid (Model Name + Image, Click to Select) */}
                                {modelSource === 'our_model' ? (
                                    <div className="mt-6">
                                        <p className="mb-3 text-xs font-semibold text-subtle">
                                            Click a model below to select them for your Virtual Try-On:
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                                            {looks.map((look) => {
                                                const isSelected =
                                                    (activeLook?.id && activeLook.id === look.id) ||
                                                    activeLook?.name === look.name;

                                                return (
                                                    <button
                                                        key={look.id ?? look.name}
                                                        type="button"
                                                        onClick={() => handleSelectLook(look)}
                                                        className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-all ${
                                                            isSelected
                                                                ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                                                                : 'border-ink/10 bg-white hover:border-ink/35'
                                                        }`}
                                                    >
                                                        <div
                                                            className="relative aspect-[3/4] w-full overflow-hidden"
                                                            style={{ background: PAGE_BACKGROUND }}
                                                        >
                                                            <img
                                                                src={look.model}
                                                                alt={`${look.modelName} — ${look.name}`}
                                                                className="h-full w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                            {isSelected && (
                                                                <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-white shadow">
                                                                    <Check size={12} strokeWidth={3} />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="p-2.5">
                                                            <p className="truncate text-xs font-bold text-ink">
                                                                {look.modelName}
                                                            </p>
                                                            <p className="truncate text-[10px] text-subtle">
                                                                {look.name}
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    /* Option B: Upload Client's Own Model Photo */
                                    <div className="mt-6">
                                        <input
                                            ref={customModelInputRef}
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,.tiff,.psd"
                                            onChange={(e) =>
                                                handleFileWithPreview(
                                                    e.target.files?.[0] ?? null,
                                                    setModelFile,
                                                    setModelPreview
                                                )
                                            }
                                            className="hidden"
                                        />

                                        {modelFile && modelPreview ? (
                                            <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:flex-row">
                                                <div className="h-32 w-24 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-white">
                                                    <img
                                                        src={modelPreview}
                                                        alt="Uploaded client model"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 text-center sm:text-left">
                                                    <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                                                        Your Model Photo Attached
                                                    </span>
                                                    <p className="mt-1.5 text-sm font-bold text-ink">
                                                        {modelFile.name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-subtle">
                                                        Our retouchers &amp; AI pipeline will drape your garments onto this exact model.
                                                    </p>
                                                    <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
                                                        <button
                                                            type="button"
                                                            onClick={() => customModelInputRef.current?.click()}
                                                            className="cursor-pointer rounded-full border border-ink/20 bg-white px-3.5 py-1.5 text-xs font-bold text-ink hover:border-primary"
                                                        >
                                                            Replace Model Photo
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                handleFileWithPreview(null, setModelFile, setModelPreview);
                                                                if (customModelInputRef.current) {
                                                                    customModelInputRef.current.value = '';
                                                                }
                                                            }}
                                                            className="cursor-pointer text-xs font-bold text-red-600 hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => customModelInputRef.current?.click()}
                                                className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-[#f8fafc] p-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
                                            >
                                                <ImagePlus className="h-8 w-8 text-primary" />
                                                <span className="mt-2.5 text-sm font-bold text-ink">
                                                    Upload Your Model Photo
                                                </span>
                                                <span className="mt-1 max-w-md text-xs text-subtle">
                                                    Upload a full-body or 3/4-length photo of your talent or mannequin (JPG, PNG, WEBP, TIFF, or PSD).
                                                </span>
                                            </button>
                                        )}

                                        {errors?.model_file && (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.model_file}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </section>

                            {/* STEP 2: 3 Garment Upload Slots (1. Top, 2. Bottom / Below, 3. Shoes) */}
                            <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_12px_34px_-18px_rgba(15,23,42,0.12)] sm:p-8">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                                        Step 02
                                    </span>
                                    <h2 className="mt-1 text-lg font-bold text-ink sm:text-xl">
                                        Upload Garment Pieces (Top, Below &amp; Shoes)
                                    </h2>
                                    <p className="mt-1 text-xs text-subtle sm:text-sm">
                                        Upload the garment files you want fitted onto the model across the 3 outfit zones below.
                                    </p>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    {/* Slot 1: Top */}
                                    <GarmentUploadSlot
                                        stepNumber="01"
                                        title="Top Garment"
                                        subtitle="Shirt, Jacket, Blouse, Knitwear, or Dress"
                                        file={garmentTop}
                                        previewUrl={topPreview}
                                        onSelectFile={(f) =>
                                            handleFileWithPreview(f, setGarmentTop, setTopPreview)
                                        }
                                        icon={<Shirt size={12} />}
                                        error={errors?.garment_top}
                                    />

                                    {/* Slot 2: Below / Bottom */}
                                    <GarmentUploadSlot
                                        stepNumber="02"
                                        title="Below / Bottom"
                                        subtitle="Trousers, Skirt, Denim, Shorts, or Leggings"
                                        file={garmentBottom}
                                        previewUrl={bottomPreview}
                                        onSelectFile={(f) =>
                                            handleFileWithPreview(f, setGarmentBottom, setBottomPreview)
                                        }
                                        icon={<Layers size={12} />}
                                        error={errors?.garment_bottom}
                                    />

                                    {/* Slot 3: Shoes */}
                                    <GarmentUploadSlot
                                        stepNumber="03"
                                        title="Shoes / Footwear"
                                        subtitle="Heels, Boots, Sneakers, Loafers, or Sandals"
                                        file={garmentShoes}
                                        previewUrl={shoesPreview}
                                        onSelectFile={(f) =>
                                            handleFileWithPreview(f, setGarmentShoes, setShoesPreview)
                                        }
                                        icon={<Footprints size={12} />}
                                        error={errors?.garment_shoes}
                                    />
                                </div>

                                {/* STEP 3: Description Under for Other */}
                                <div className="mt-6 space-y-4 border-t border-ink/10 pt-6">
                                    <div>
                                        <label className="block text-sm font-bold text-ink">
                                            Other Garments / Styling &amp; Fit Description
                                        </label>
                                        <p className="mt-0.5 text-xs text-subtle">
                                            Describe any additional accessories, tuck/drape preferences, fabric weight, or special instructions.
                                        </p>
                                        <textarea
                                            rows={4}
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            placeholder="e.g. Tuck the top into the trousers, keep relaxed oversized drape on the sleeves, match studio neutral lighting..."
                                            className="mt-2 w-full rounded-2xl border border-ink/15 bg-[#f8fafc] p-3.5 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-white focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-subtle">
                                            <Folder size={13} />
                                            Or Share a Bulk Garment Folder Link (Google Drive / WeTransfer / Dropbox)
                                        </label>
                                        <input
                                            type="url"
                                            value={cloudLink}
                                            onChange={(e) => setCloudLink(e.target.value)}
                                            placeholder="https://drive.google.com/..."
                                            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right 4 Columns: Sticky Quote Summary & Contact Form */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-28 space-y-6 rounded-3xl border border-ink/10 bg-[#f8fafc] p-6 shadow-[0_14px_38px_-18px_rgba(15,23,42,0.16)] sm:p-7">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                        Virtual Try-On Summary
                                    </p>
                                    <h3 className="mt-1 text-lg font-bold text-ink">
                                        Custom Try-On Quote
                                    </h3>
                                    <p className="mt-1 text-xs text-subtle">
                                        Our team will review your garments and return a quote and pilot proof within 1 business day.
                                    </p>
                                </div>

                                {/* Selected Model Preview */}
                                {modelSource === 'our_model' && activeLook ? (
                                    <div className="flex items-center gap-3.5 rounded-2xl border border-ink/10 bg-white p-3">
                                        <div
                                            className="h-16 w-12 shrink-0 overflow-hidden rounded-xl"
                                            style={{ background: PAGE_BACKGROUND }}
                                        >
                                            <img
                                                src={activeLook.model}
                                                alt={activeLook.modelName}
                                                className="h-full w-full object-contain object-bottom"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                                Our Studio Model
                                            </p>
                                            <p className="truncate text-sm font-bold text-ink">
                                                {activeLook.modelName}
                                            </p>
                                            <p className="truncate text-xs text-subtle">{activeLook.name}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-white p-3.5">
                                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                            <Sparkles size={18} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                                Client Model
                                            </p>
                                            <p className="truncate text-xs font-bold text-ink">
                                                {modelFile ? modelFile.name : 'Upload your model in Step 01'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Attached Garments Checklist */}
                                <div className="space-y-2 rounded-2xl border border-ink/10 bg-white p-3.5 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-subtle">1. Top Garment:</span>
                                        <span className="font-bold text-ink">
                                            {garmentTop ? 'Attached ✓' : 'Optional'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-subtle">2. Below / Bottom:</span>
                                        <span className="font-bold text-ink">
                                            {garmentBottom ? 'Attached ✓' : 'Optional'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-subtle">3. Shoes:</span>
                                        <span className="font-bold text-ink">
                                            {garmentShoes ? 'Attached ✓' : 'Optional'}
                                        </span>
                                    </div>
                                </div>

                                {/* Monthly Volume */}
                                <div>
                                    <label className="block text-xs font-bold text-ink">
                                        Estimated Collection Volume
                                    </label>
                                    <select
                                        value={monthlyVolume}
                                        onChange={(e) => setMonthlyVolume(e.target.value)}
                                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                                    >
                                        {VOLUME_OPTIONS.map((vol) => (
                                            <option key={vol} value={vol}>
                                                {vol}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Client Contact Fields */}
                                <div className="space-y-3.5 border-t border-ink/10 pt-5">
                                    <div>
                                        <label className="block text-xs font-bold text-ink">
                                            Your Name <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Alex Rivera"
                                            className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                        />
                                        {errors?.name && (
                                            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-ink">
                                            Work Email <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="alex@brand.com"
                                            className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                        />
                                        {errors?.email && (
                                            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold text-ink">Brand / Company</label>
                                            <input
                                                type="text"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                placeholder="Atelier Studio"
                                                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-ink">Phone / WhatsApp</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full cursor-pointer rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting Request...' : 'Request Virtual Try-On Quote'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

TryOnQuote.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;

