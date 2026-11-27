import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    Check,
    FileUp,
    Folder,
    Footprints,
    ImagePlus,
    Layers,
    Shirt,
    Trash2,
    UserCheck,
    UserPlus,
} from 'lucide-react';
import { AiPreviewPanel } from '@/Components/Common/AiPreviewPanel';
import { isClientUser, isVerifiedClient, OrderAuthNotice } from '@/Components/Common/OrderAuthNotice';
import { OrderSuccessCard } from '@/Components/Common/OrderSuccessCard';
import {
    clearOrderDraft,
    clearOrderDraftFiles,
    consumeAuthReturn,
    currentRedirectUrl,
    markAuthReturn,
    readOrderDraft,
    readOrderDraftFiles,
    writeOrderDraft,
    writeOrderDraftFiles,
} from '@/lib/orderDraft';
import { LOOKS, Look } from '@/Components/Landing/TryOn/looks';

export const TRY_ON_STAGE_BACKGROUND =
    'linear-gradient(90deg, var(--color-page) 0%, var(--color-surface-2) 55%, var(--color-surface) 100%)';

const VOLUME_OPTIONS = [
    'Pilot Test (1–10 looks)',
    '10–50 looks / month',
    '50–200 looks / month',
    '200+ looks / Enterprise',
];

export interface TryOnOrderConfiguratorProps {
    tryOnLooks?: Look[];
    initialLook?: string;
    /** True when rendered inside the Client Portal layout instead of the public frontend page. */
    embedded?: boolean;
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
    title,
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
        <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface-2 p-3 transition-all hover:border-primary/40">
            <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink">
                    <span className="text-primary">{icon}</span>
                    {title}
                </span>
                {file && (
                    <button
                        type="button"
                        onClick={() => {
                            onSelectFile(null);
                            if (inputRef.current) inputRef.current.value = '';
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 text-2xs font-semibold text-danger hover:text-danger-hover"
                    >
                        <Trash2 size={12} />
                        Remove
                    </button>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.tiff,.psd"
                onChange={handleChange}
                className="hidden"
            />

            {previewUrl && file ? (
                <div className="mt-2.5 overflow-hidden rounded-xl border border-ink/10 bg-surface">
                    <div className="relative h-28 w-full bg-surface-2">
                        <img
                            src={previewUrl}
                            alt={title}
                            className="h-full w-full object-contain p-1.5"
                        />
                    </div>
                    <div className="flex items-center justify-between border-t border-ink/10 px-2.5 py-1.5 text-2xs">
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
                    className="mt-2.5 flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-ink/20 bg-surface px-3 text-center transition-colors hover:border-primary hover:bg-primary/5"
                >
                    <FileUp className="h-5 w-5 text-primary" />
                    <span className="mt-1.5 text-xs font-bold text-ink">Upload Photo</span>
                    <span className="mt-0.5 text-2xs text-subtle">Flat-lay, mannequin, or hanger</span>
                </button>
            )}

            {error && <p className="mt-1.5 text-2xs font-semibold text-danger">{error}</p>}
        </div>
    );
}

/**
 * Shared Virtual Try-On Order Configurator component.
 * Rendered identically on both the public frontend (/virtual-try-on/order)
 * and inside the Client Portal (/portal/capabilities/2d/virtual-try-on).
 */
export function TryOnOrderConfigurator({
    tryOnLooks,
    initialLook = '',
    embedded = false,
}: TryOnOrderConfiguratorProps) {
    const { auth, flash, errors } = usePage<{
        auth?: {
            user?: {
                name: string;
                email: string;
                company?: string | null;
                phone?: string | null;
                email_verified_at?: string | null;
                role?: string | null;
            } | null;
        };
        flash?: { success?: string; error?: string };
        errors?: Record<string, string>;
    }>().props;
    const clientUser = isClientUser(auth?.user) ? (auth?.user ?? null) : null;

    const looks = tryOnLooks && tryOnLooks.length > 0 ? tryOnLooks : LOOKS;

    const matchedInitialLook = useMemo(() => {
        const needle = initialLook.trim().toLowerCase();
        if (!needle) return looks[0] ?? null;
        return (
            looks.find(
                (l) =>
                    l.slug?.toLowerCase() === needle ||
                    l.modelName.toLowerCase() === needle ||
                    l.modelName.toLowerCase().includes(needle)
            ) ??
            looks[0] ??
            null
        );
    }, [initialLook, looks]);

    const DRAFT_KEY = 'ce_draft_try_on_order';
    const FILES_DRAFT_KEY = 'ce_draft_try_on_order_files';
    const filesHydratedRef = useRef(false);
    const initialDraft = useMemo(
        () =>
            readOrderDraft<{
                modelSource: 'our_model' | 'custom_model';
                selectedLookId: number | null;
                selectedLookName: string;
                instructions: string;
                cloudLink: string;
                monthlyVolume: string;
                name: string;
                email: string;
                company: string;
                phone: string;
            }>(DRAFT_KEY),
        []
    );

    const [modelSource, setModelSource] = useState<'our_model' | 'custom_model'>(
        initialDraft?.modelSource ?? 'our_model'
    );
    const [selectedLookId, setSelectedLookId] = useState<number | null>(
        initialDraft?.selectedLookId !== undefined ? initialDraft.selectedLookId : (matchedInitialLook?.id ?? null)
    );
    const [selectedLookName, setSelectedLookName] = useState<string>(
        initialDraft?.selectedLookName ?? matchedInitialLook?.modelName ?? looks[0]?.modelName ?? ''
    );

    const activeLook = useMemo(() => {
        if (selectedLookId !== null) {
            const byId = looks.find((l) => l.id === selectedLookId);
            if (byId) return byId;
        }
        return looks.find((l) => l.modelName === selectedLookName) ?? looks[0] ?? null;
    }, [selectedLookId, selectedLookName, looks]);

    const [modelFile, setModelFile] = useState<File | null>(null);
    const [modelPreview, setModelPreview] = useState<string | null>(null);
    const customModelInputRef = useRef<HTMLInputElement | null>(null);
    const submitCardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!embedded && isVerifiedClient(clientUser) && consumeAuthReturn()) {
            requestAnimationFrame(() => {
                submitCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }, [embedded, clientUser?.email_verified_at]);

    const [garmentTop, setGarmentTop] = useState<File | null>(null);
    const [topPreview, setTopPreview] = useState<string | null>(null);

    const [garmentBottom, setGarmentBottom] = useState<File | null>(null);
    const [bottomPreview, setBottomPreview] = useState<string | null>(null);

    const [garmentShoes, setGarmentShoes] = useState<File | null>(null);
    const [shoesPreview, setShoesPreview] = useState<string | null>(null);

    const [instructions, setInstructions] = useState(initialDraft?.instructions ?? '');
    const [cloudLink, setCloudLink] = useState(initialDraft?.cloudLink ?? '');
    const [monthlyVolume, setMonthlyVolume] = useState(initialDraft?.monthlyVolume ?? VOLUME_OPTIONS[0]);
    const [name, setName] = useState(initialDraft?.name || clientUser?.name || '');
    const [email, setEmail] = useState(initialDraft?.email || clientUser?.email || '');
    const [company, setCompany] = useState(initialDraft?.company || clientUser?.company || '');
    const [phone, setPhone] = useState(initialDraft?.phone || clientUser?.phone || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(flash?.success ?? null);

    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [flash?.success]);

    const saveDraft = useCallback(() => {
        writeOrderDraft(DRAFT_KEY, {
            modelSource,
            selectedLookId,
            selectedLookName,
            instructions,
            cloudLink,
            monthlyVolume,
            name,
            email,
            company,
            phone,
        });
    }, [
        modelSource,
        selectedLookId,
        selectedLookName,
        instructions,
        cloudLink,
        monthlyVolume,
        name,
        email,
        company,
        phone,
    ]);

    useEffect(() => {
        saveDraft();
    }, [saveDraft]);

    useEffect(() => {
        let active = true;
        readOrderDraftFiles<{
            modelFile?: File | null;
            garmentTop?: File | null;
            garmentBottom?: File | null;
            garmentShoes?: File | null;
        }>(FILES_DRAFT_KEY).then((saved) => {
            if (!active) return;
            if (saved?.modelFile instanceof File) {
                setModelFile(saved.modelFile);
                setModelPreview(URL.createObjectURL(saved.modelFile));
            }
            if (saved?.garmentTop instanceof File) {
                setGarmentTop(saved.garmentTop);
                setTopPreview(URL.createObjectURL(saved.garmentTop));
            }
            if (saved?.garmentBottom instanceof File) {
                setGarmentBottom(saved.garmentBottom);
                setBottomPreview(URL.createObjectURL(saved.garmentBottom));
            }
            if (saved?.garmentShoes instanceof File) {
                setGarmentShoes(saved.garmentShoes);
                setShoesPreview(URL.createObjectURL(saved.garmentShoes));
            }
            filesHydratedRef.current = true;
        });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!filesHydratedRef.current) return;
        writeOrderDraftFiles(FILES_DRAFT_KEY, {
            modelFile,
            garmentTop,
            garmentBottom,
            garmentShoes,
        });
    }, [modelFile, garmentTop, garmentBottom, garmentShoes]);

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
        setSelectedLookName(look.modelName);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!clientUser) {
            saveDraft();
            markAuthReturn();
            router.visit(`/login?redirect=${encodeURIComponent(currentRedirectUrl('/virtual-try-on/order'))}`);
            return;
        }

        if (!isVerifiedClient(clientUser)) {
            saveDraft();
            markAuthReturn();
            router.visit('/verify-email');
            return;
        }

        setIsSubmitting(true);

        router.post(
            '/virtual-try-on/order',
            {
                model_source: modelSource,
                try_on_look_id: modelSource === 'our_model' ? (activeLook?.id ?? null) : null,
                selected_look_name:
                    modelSource === 'our_model' ? (activeLook?.modelName ?? '') : 'Client Uploaded Model',
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
                onSuccess: () => {
                    setModelFile(null);
                    setModelPreview(null);
                    setGarmentTop(null);
                    setTopPreview(null);
                    setGarmentBottom(null);
                    setBottomPreview(null);
                    setGarmentShoes(null);
                    setShoesPreview(null);
                    setInstructions('');
                    setCloudLink('');
                    setMonthlyVolume(VOLUME_OPTIONS[0]);
                    if (customModelInputRef.current) {
                        customModelInputRef.current.value = '';
                    }
                    clearOrderDraft(DRAFT_KEY);
                    clearOrderDraftFiles(FILES_DRAFT_KEY);
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    if (successMessage) {
        return (
            <OrderSuccessCard
                title="Virtual Try-On Order Submitted"
                message={successMessage}
                onReset={() => setSuccessMessage(null)}
                resetLabel="Submit Another Try-On Order"
                inPortal={embedded}
            />
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 lg:grid-cols-12">
            {/* Left 8 Columns: Step 1 (Model), Step 2 (3 Garment Slots + Notes) */}
            <div className="space-y-6 lg:col-span-8">
                {/* STEP 1: Select Model Source (Our Model vs Your Model) */}
                <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.12)] sm:p-6">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <span className="text-2xs font-bold uppercase tracking-[0.2em] text-primary">
                                Step 01
                            </span>
                            <h2 className="mt-0.5 text-base font-bold text-ink sm:text-lg">
                                Choose Model Source
                            </h2>
                        </div>

                        <div
                            role="tablist"
                            aria-label="Model Source"
                            className="inline-flex rounded-full border border-ink/15 bg-surface-2 p-1"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={modelSource === 'our_model'}
                                onClick={() => setModelSource('our_model')}
                                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                                    modelSource === 'our_model'
                                        ? 'bg-ink text-white shadow-xs'
                                        : 'text-subtle hover:text-ink'
                                }`}
                            >
                                <UserCheck size={13} />
                                Use Our Model
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={modelSource === 'custom_model'}
                                onClick={() => setModelSource('custom_model')}
                                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                                    modelSource === 'custom_model'
                                        ? 'bg-ink text-white shadow-xs'
                                        : 'text-subtle hover:text-ink'
                                }`}
                            >
                                <UserPlus size={13} />
                                Use My Model
                            </button>
                        </div>
                    </div>

                    {modelSource === 'our_model' ? (
                        <div className="mt-4">
                            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
                                {looks.map((look) => {
                                    const isSelected =
                                        (activeLook?.id && activeLook.id === look.id) ||
                                        activeLook?.modelName === look.modelName;

                                    return (
                                        <button
                                            key={look.id ?? look.modelName}
                                            type="button"
                                            onClick={() => handleSelectLook(look)}
                                            className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-all ${
                                                isSelected
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/25'
                                                    : 'border-ink/10 bg-surface hover:border-ink/35'
                                            }`}
                                        >
                                            <div
                                                className="relative aspect-[4/5] w-full overflow-hidden"
                                                style={{ background: TRY_ON_STAGE_BACKGROUND }}
                                            >
                                                <img
                                                    src={look.model}
                                                    alt={look.modelName}
                                                    className="h-full w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
                                                />
                                                {isSelected && (
                                                    <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground shadow">
                                                        <Check size={11} strokeWidth={3} />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="px-2 py-1.5">
                                                <p className="truncate text-2xs font-bold text-ink">
                                                    {look.modelName}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4">
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
                                <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/[0.04] p-3">
                                    <div className="flex min-w-0 items-center gap-3.5">
                                        <img
                                            src={modelPreview}
                                            alt="Uploaded client model"
                                            className="h-16 w-14 shrink-0 rounded-xl border border-ink/10 object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-ink">
                                                {modelFile.name}
                                            </p>
                                            <p className="mt-0.5 text-2xs text-subtle">
                                                {(modelFile.size / (1024 * 1024)).toFixed(2)} MB • High-res model photo attached
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => customModelInputRef.current?.click()}
                                            className="cursor-pointer rounded-full border border-ink/15 bg-surface px-3 py-1.5 text-2xs font-bold text-ink hover:border-primary hover:text-primary"
                                        >
                                            Replace
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleFileWithPreview(null, setModelFile, setModelPreview);
                                                if (customModelInputRef.current) {
                                                    customModelInputRef.current.value = '';
                                                }
                                            }}
                                            className="cursor-pointer rounded-full p-1.5 text-danger hover:bg-danger-soft"
                                            aria-label="Remove model photo"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => customModelInputRef.current?.click()}
                                    className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-ink/20 bg-surface-2 px-4 py-3.5 text-left transition-colors hover:border-primary hover:bg-primary/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                            <ImagePlus size={18} />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold text-ink">
                                                Upload Your Model Photo
                                            </span>
                                            <span className="block text-2xs text-subtle">
                                                High-quality full-body photo (JPG, PNG, WEBP, TIFF, PSD • Max 25MB)
                                            </span>
                                        </div>
                                    </div>
                                    <span className="hidden shrink-0 rounded-full border border-ink/15 bg-surface px-3 py-1.5 text-2xs font-bold text-ink sm:inline-flex">
                                        Choose File
                                    </span>
                                </button>
                            )}

                            {errors?.model_file && (
                                <p className="mt-2 text-xs font-semibold text-danger">
                                    {errors.model_file}
                                </p>
                            )}
                        </div>
                    )}
                </section>

                {/* STEP 2: 3 Garment Upload Slots */}
                <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.12)] sm:p-6">
                    <div className="border-b border-ink/10 pb-3.5">
                        <span className="text-2xs font-bold uppercase tracking-[0.2em] text-primary">
                            Step 02
                        </span>
                        <h2 className="mt-0.5 text-base font-bold text-ink sm:text-lg">
                            Upload Garment Pieces
                        </h2>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                        <GarmentUploadSlot
                            stepNumber="01"
                            title="Top Garment"
                            subtitle="Shirt, Jacket, Blouse, Knitwear, or Dress"
                            file={garmentTop}
                            previewUrl={topPreview}
                            onSelectFile={(f) => handleFileWithPreview(f, setGarmentTop, setTopPreview)}
                            icon={<Shirt size={12} />}
                            error={errors?.garment_top}
                        />

                        <GarmentUploadSlot
                            stepNumber="02"
                            title="Below / Bottom"
                            subtitle="Trousers, Skirt, Denim, Shorts, or Leggings"
                            file={garmentBottom}
                            previewUrl={bottomPreview}
                            onSelectFile={(f) => handleFileWithPreview(f, setGarmentBottom, setBottomPreview)}
                            icon={<Layers size={12} />}
                            error={errors?.garment_bottom}
                        />

                        <GarmentUploadSlot
                            stepNumber="03"
                            title="Shoes / Footwear"
                            subtitle="Heels, Boots, Sneakers, Loafers, or Sandals"
                            file={garmentShoes}
                            previewUrl={shoesPreview}
                            onSelectFile={(f) => handleFileWithPreview(f, setGarmentShoes, setShoesPreview)}
                            icon={<Footprints size={12} />}
                            error={errors?.garment_shoes}
                        />
                    </div>

                    <div className="mt-5 space-y-4 border-t border-ink/10 pt-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                <Folder size={13} className="text-primary" />
                                Cloud Folder Link (Optional)
                            </label>
                            <input
                                type="url"
                                value={cloudLink}
                                onChange={(e) => setCloudLink(e.target.value)}
                                placeholder="https://drive.google.com/..."
                                className="mt-1.5 h-10 w-full rounded-xl border border-ink/15 bg-surface-2 px-3 text-xs text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-surface focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-ink">
                                Styling &amp; Fit Notes (Optional)
                            </label>
                            <textarea
                                rows={1}
                                value={instructions}
                                onChange={(e) => {
                                    setInstructions(e.target.value);
                                    e.currentTarget.style.height = 'auto';
                                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                }}
                                placeholder="e.g. Tuck the top into the trousers, relaxed sleeve drape, neutral studio lighting..."
                                className="mt-1.5 min-h-10 max-h-48 w-full resize-y rounded-xl border border-ink/15 bg-surface-2 px-3 py-2.5 text-xs leading-relaxed text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-surface focus:outline-none"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Right 4 Columns: Sticky Order Summary & Contact Form */}
            <div className="lg:col-span-4">
                <div
                    ref={submitCardRef}
                    className={`sticky space-y-4 rounded-3xl border border-ink/10 bg-surface-2 p-5 shadow-[0_14px_38px_-18px_rgba(15,23,42,0.16)] sm:p-6 ${
                        embedded ? 'top-20' : 'top-28'
                    }`}
                >
                    <div>
                        <p className="text-2xs font-bold uppercase tracking-[0.2em] text-primary">
                            Order Summary
                        </p>
                        <h3 className="mt-0.5 text-base font-bold text-ink">
                            Custom Virtual Try-On Order
                        </h3>
                    </div>

                    {modelSource === 'our_model' && activeLook ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface p-2.5">
                            <div
                                className="h-14 w-11 shrink-0 overflow-hidden rounded-xl"
                                style={{ background: TRY_ON_STAGE_BACKGROUND }}
                            >
                                <img
                                    src={activeLook.model}
                                    alt={activeLook.modelName}
                                    className="h-full w-full object-contain object-bottom"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-2xs font-bold uppercase tracking-wider text-primary">
                                    Studio Model
                                </p>
                                <p className="truncate text-xs font-bold text-ink">
                                    {activeLook.modelName}
                                </p>
                            </div>
                        </div>
                    ) : modelPreview && modelFile ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface p-2.5">
                            <img
                                src={modelPreview}
                                alt="Your uploaded model"
                                className="h-14 w-11 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-2xs font-bold uppercase tracking-wider text-primary">
                                    Your Model
                                </p>
                                <p className="truncate text-xs font-bold text-ink">{modelFile.name}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface p-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <UserPlus size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-2xs font-bold uppercase tracking-wider text-primary">
                                    Your Model
                                </p>
                                <p className="truncate text-xs font-semibold text-subtle">
                                    Upload your model in Step 01
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-1.5 text-center text-2xs">
                        {[
                            { label: 'Top', attached: Boolean(garmentTop) },
                            { label: 'Bottom', attached: Boolean(garmentBottom) },
                            { label: 'Shoes', attached: Boolean(garmentShoes) },
                        ].map((slot) => (
                            <div
                                key={slot.label}
                                className={`rounded-xl border px-2 py-1.5 font-semibold ${
                                    slot.attached
                                        ? 'border-primary/35 bg-primary/[0.06] text-ink'
                                        : 'border-ink/10 bg-surface text-subtle'
                                }`}
                            >
                                {slot.label} {slot.attached ? '✓' : ''}
                            </div>
                        ))}
                    </div>

                    <AiPreviewPanel
                        feature="virtual_try_on"
                        disabledReason={
                            !garmentTop && !garmentBottom && !garmentShoes
                                ? 'Upload at least 1 garment photo to preview.'
                                : modelSource === 'custom_model' && !modelFile
                                  ? 'Upload your model photo in Step 01.'
                                  : null
                        }
                        buildFormData={() => {
                            const fd = new FormData();
                            if (modelSource === 'our_model' && activeLook?.id) {
                                fd.set('try_on_look_id', String(activeLook.id));
                            }
                            if (modelSource === 'custom_model' && modelFile) {
                                fd.set('model_file', modelFile);
                            }
                            if (garmentTop) fd.set('garment_top', garmentTop);
                            if (garmentBottom) fd.set('garment_bottom', garmentBottom);
                            if (garmentShoes) fd.set('garment_shoes', garmentShoes);
                            if (instructions) fd.set('instructions', instructions);
                            return fd;
                        }}
                    />

                    <div>
                        <label className="block text-xs font-bold text-ink">
                            Estimated Volume
                        </label>
                        <select
                            value={monthlyVolume}
                            onChange={(e) => setMonthlyVolume(e.target.value)}
                            className="mt-1 h-10 w-full rounded-xl border border-ink/15 bg-surface px-3 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                        >
                            {VOLUME_OPTIONS.map((vol) => (
                                <option key={vol} value={vol}>
                                    {vol}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3 border-t border-ink/10 pt-4">
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
                                className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                            />
                            {errors?.name && (
                                <p className="mt-1 text-xs text-danger">{errors.name}</p>
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
                                className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                            />
                            {errors?.email && (
                                <p className="mt-1 text-xs text-danger">{errors.email}</p>
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
                                    className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-ink">Phone / WhatsApp</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {!embedded && (
                        <OrderAuthNotice
                            user={auth?.user}
                            fallbackPath="/virtual-try-on/order"
                            onBeforeNavigate={saveDraft}
                        />
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
                    >
                        {isSubmitting
                            ? 'Submitting Order...'
                            : !clientUser
                              ? 'Sign in & Submit Order'
                              : 'Submit Order'}
                    </button>
                </div>
            </div>
        </form>
    );
}
