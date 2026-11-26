import React, { useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Coins,
    Download,
    Eraser,
    ImagePlus,
    Loader2,
    Plus,
    RefreshCw,
    Shirt,
    Sparkles,
    UserRound,
} from 'lucide-react';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { BuyCreditsModal, CreditPack } from '@/Components/Client/BuyCreditsModal';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { toast } from '@/Components/ui/sonner';
import { getClientLayout } from '@/Layouts/Client/ClientLayout';
import { PageProps } from '@/types';

interface TwinPose {
    id: string;
    code: string;
    shortName: string;
    title: string;
    imageUrl?: string | null;
}

interface CatalogDigitalTwin {
    id: number;
    slug: string;
    name: string;
    archetype: string;
    runwayImage?: string | null;
    hiResImage?: string | null;
    poses: TwinPose[];
}

interface AiJobItem {
    id: number;
    provider: string;
    service_type: 'bg_remove' | 'try_on';
    credits_charged: number;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    input_payload?: Record<string, unknown> | null;
    output_urls?: string[] | null;
    error_message?: string | null;
    created_at: string;
    completed_at?: string | null;
}

interface AiStudioProps {
    initialJobs: AiJobItem[];
    digitalTwins: CatalogDigitalTwin[];
    creditPacks: CreditPack[];
    serviceCosts: {
        bg_remove: number;
        try_on: number;
    };
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function uploadImageDirect(file: File, purpose: 'inputs' | 'garments' | 'models'): Promise<string> {
    const presignRes = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({
            filename: file.name,
            content_type: file.type || 'image/png',
            purpose,
        }),
    });

    const presignData = await presignRes.json();
    if (!presignRes.ok) {
        throw new Error(presignData.message || 'Could not initialize image upload.');
    }

    const uploadHeaders: Record<string, string> = {
        ...(presignData.headers || {}),
    };
    if (presignData.driver === 'local') {
        uploadHeaders['X-XSRF-TOKEN'] = getCsrfToken();
    }

    const uploadRes = await fetch(presignData.upload_url, {
        method: presignData.method || 'PUT',
        headers: uploadHeaders,
        body: file,
    });

    if (!uploadRes.ok) {
        throw new Error('Failed to upload image file.');
    }

    return presignData.public_url as string;
}

export default function AiStudio({
    initialJobs = [],
    digitalTwins = [],
    creditPacks = [],
    serviceCosts,
}: AiStudioProps) {
    const { auth } = usePage<PageProps>().props;
    const [creditBalance, setCreditBalance] = useState<number>(auth?.user?.credits_balance ?? 0);
    const [jobs, setJobs] = useState<AiJobItem[]>(initialJobs);
    const [activeTab, setActiveTab] = useState<'try_on' | 'bg_remove'>('try_on');
    const [buyModalOpen, setBuyModalOpen] = useState(false);

    // Virtual Try-On state
    const [modelMode, setModelMode] = useState<'twin' | 'custom'>(
        digitalTwins.length > 0 ? 'twin' : 'custom'
    );
    const [selectedTwinId, setSelectedTwinId] = useState<number | null>(
        digitalTwins[0]?.id ?? null
    );
    const [selectedPoseId, setSelectedPoseId] = useState<string>(
        digitalTwins[0]?.poses?.[0]?.id ?? 'pose-01'
    );
    const [customModelUrl, setCustomModelUrl] = useState<string | null>(null);
    const [garmentUrl, setGarmentUrl] = useState<string | null>(null);
    const [garmentCategory, setGarmentCategory] = useState<'auto' | 'tops' | 'bottoms' | 'one-pieces'>('auto');
    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Background Remover state
    const [bgInputUrl, setBgInputUrl] = useState<string | null>(null);

    const selectedTwin = useMemo(
        () => digitalTwins.find((t) => t.id === selectedTwinId) ?? null,
        [digitalTwins, selectedTwinId]
    );

    const activeJobIds = useMemo(
        () =>
            jobs
                .filter((j) => j.status === 'queued' || j.status === 'processing')
                .map((j) => j.id),
        [jobs]
    );

    // Poll active jobs every 2.5 seconds
    useEffect(() => {
        if (activeJobIds.length === 0) {
            return;
        }

        const interval = window.setInterval(async () => {
            for (const jobId of activeJobIds) {
                try {
                    const res = await fetch(`/api/ai/jobs/${jobId}`, {
                        headers: { Accept: 'application/json' },
                    });
                    if (!res.ok) {
                        continue;
                    }
                    const data = await res.json();
                    if (typeof data.credit_balance === 'number') {
                        setCreditBalance(data.credit_balance);
                    }
                    if (data.job) {
                        setJobs((prev) =>
                            prev.map((item) => (item.id === data.job.id ? data.job : item))
                        );
                        if (data.job.status === 'completed') {
                            toast.success(`Job #${data.job.id} completed!`);
                            router.reload({ only: ['auth', 'client_badges'] });
                        } else if (data.job.status === 'failed') {
                            toast.error(`Job #${data.job.id} failed — credits refunded.`);
                            router.reload({ only: ['auth', 'client_badges'] });
                        }
                    }
                } catch {
                    // Ignore transient polling errors
                }
            }
        }, 2500);

        return () => window.clearInterval(interval);
    }, [activeJobIds]);

    const handleFileSelect = async (
        e: React.ChangeEvent<HTMLInputElement>,
        target: 'custom_model' | 'garment' | 'bg_input'
    ) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        setUploadingField(target);
        try {
            const purpose = target === 'garment' ? 'garments' : target === 'custom_model' ? 'models' : 'inputs';
            const url = await uploadImageDirect(file, purpose);
            if (target === 'custom_model') {
                setCustomModelUrl(url);
            } else if (target === 'garment') {
                setGarmentUrl(url);
            } else {
                setBgInputUrl(url);
            }
            toast.success('Image uploaded.');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Upload failed.');
        } finally {
            setUploadingField(null);
            e.target.value = '';
        }
    };

    const handleGenerateTryOn = async () => {
        if (!garmentUrl) {
            toast.error('Please upload a garment image first.');
            return;
        }
        if (modelMode === 'twin' && !selectedTwinId) {
            toast.error('Please select a Digital Twin model.');
            return;
        }
        if (modelMode === 'custom' && !customModelUrl) {
            toast.error('Please upload a model photo.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/ai/try-on', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    digital_twin_id: modelMode === 'twin' ? selectedTwinId : null,
                    pose_id: modelMode === 'twin' ? selectedPoseId : null,
                    person_image_url: modelMode === 'custom' ? customModelUrl : null,
                    garment_image_url: garmentUrl,
                    category: garmentCategory,
                }),
            });

            const data = await res.json();
            if (typeof data.credit_balance === 'number') {
                setCreditBalance(data.credit_balance);
            }
            if (!res.ok) {
                throw new Error(data.message || 'Failed to start Virtual Try-On.');
            }

            setJobs((prev) => [data.job, ...prev]);
            toast.success('Virtual Try-On queued! Generating your look…');
            router.reload({ only: ['auth', 'client_badges'] });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Generation failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBgRemove = async () => {
        if (!bgInputUrl) {
            toast.error('Please upload an image first.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/ai/bg-remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ image_url: bgInputUrl }),
            });

            const data = await res.json();
            if (typeof data.credit_balance === 'number') {
                setCreditBalance(data.credit_balance);
            }
            if (!res.ok) {
                throw new Error(data.message || 'Failed to start Background Removal.');
            }

            setJobs((prev) => [data.job, ...prev]);
            toast.success('Background Removal queued!');
            router.reload({ only: ['auth', 'client_badges'] });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Generation failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const refreshGallery = async () => {
        try {
            const res = await fetch('/api/ai/jobs', { headers: { Accept: 'application/json' } });
            if (res.ok) {
                const data = await res.json();
                setJobs(data.jobs || []);
                if (typeof data.credit_balance === 'number') {
                    setCreditBalance(data.credit_balance);
                }
            }
        } catch {
            // ignore
        }
    };

    return (
        <>
            <SeoHead
                title="AI Studio — CuttingEdger"
                description="Generate Virtual Try-On looks with CuttingEdger Digital Twins and instant Background Removal."
            />

            <AdminPageHeader
                title="AI Image Studio"
                description="Select a CuttingEdger Digital Twin model & pose, upload your garment, and generate studio-grade visuals in seconds."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary-soft px-3 py-2 text-xs font-bold text-primary-ink">
                        <Coins className="h-3.5 w-3.5 text-primary" />
                        <span className="tabular-nums">{creditBalance.toLocaleString()} Credits</span>
                    </div>
                    <Button
                        type="button"
                        onClick={() => setBuyModalOpen(true)}
                        className="cursor-pointer gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Buy Credits</span>
                    </Button>
                </div>
            </AdminPageHeader>

            <div className="space-y-8">
                {/* Tool Tabs */}
                <div className="inline-flex rounded-2xl border border-line bg-surface p-1.5 shadow-xs">
                    <button
                        type="button"
                        onClick={() => setActiveTab('try_on')}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                            activeTab === 'try_on'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'text-muted hover:text-ink'
                        }`}
                    >
                        <Shirt className="h-4 w-4" />
                        <span>Virtual Try-On</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('bg_remove')}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                            activeTab === 'bg_remove'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'text-muted hover:text-ink'
                        }`}
                    >
                        <Eraser className="h-4 w-4" />
                        <span>Background Remover</span>
                    </button>
                </div>

                {/* Virtual Try-On Workspace */}
                {activeTab === 'try_on' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Step 1: Select Digital Twin & Pose OR Upload Custom Model */}
                        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-xs lg:col-span-7">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-sm font-bold text-ink">
                                        1. Choose Model &amp; Pose
                                    </h2>
                                    <p className="text-2xs text-subtle">
                                        Pick one of CuttingEdger&apos;s Digital Twins or upload your own model photo.
                                    </p>
                                </div>
                                <div className="inline-flex rounded-xl border border-line bg-surface-2 p-1 text-2xs font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => setModelMode('twin')}
                                        className={`cursor-pointer rounded-lg px-2.5 py-1 ${
                                            modelMode === 'twin' ? 'bg-surface text-ink shadow-xs' : 'text-subtle'
                                        }`}
                                    >
                                        Digital Twins
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModelMode('custom')}
                                        className={`cursor-pointer rounded-lg px-2.5 py-1 ${
                                            modelMode === 'custom' ? 'bg-surface text-ink shadow-xs' : 'text-subtle'
                                        }`}
                                    >
                                        Upload Model
                                    </button>
                                </div>
                            </div>

                            {modelMode === 'twin' ? (
                                <div className="space-y-4">
                                    {digitalTwins.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-line p-6 text-center text-xs text-subtle">
                                            No active Digital Twins found. Switch to &ldquo;Upload Model&rdquo; to upload a model photo.
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                {digitalTwins.map((twin) => {
                                                    const active = twin.id === selectedTwinId;
                                                    return (
                                                        <button
                                                            key={twin.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedTwinId(twin.id);
                                                                setSelectedPoseId(twin.poses?.[0]?.id ?? 'pose-01');
                                                            }}
                                                            className={`group cursor-pointer overflow-hidden rounded-xl border text-left transition-all ${
                                                                active
                                                                    ? 'border-primary ring-2 ring-primary/25'
                                                                    : 'border-line hover:border-line-strong'
                                                            }`}
                                                        >
                                                            <div className="aspect-[3/4] w-full bg-surface-2">
                                                                {(twin.hiResImage || twin.runwayImage) ? (
                                                                    <img
                                                                        src={twin.hiResImage || twin.runwayImage || ''}
                                                                        alt={twin.name}
                                                                        className="h-full w-full object-cover object-top"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full items-center justify-center text-faint">
                                                                        <UserRound className="h-8 w-8" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-2">
                                                                <p className="truncate text-xs font-bold text-ink">
                                                                    {twin.name}
                                                                </p>
                                                                <p className="truncate text-2xs text-subtle">
                                                                    {twin.archetype}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {selectedTwin && selectedTwin.poses.length > 0 && (
                                                <div className="space-y-2 border-t border-line pt-4">
                                                    <span className="block text-xs font-semibold text-ink">
                                                        Select Pose for {selectedTwin.name}
                                                    </span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTwin.poses.map((pose) => (
                                                            <button
                                                                key={pose.id}
                                                                type="button"
                                                                onClick={() => setSelectedPoseId(pose.id)}
                                                                className={`cursor-pointer rounded-xl border px-3 py-1.5 text-2xs font-semibold transition-all ${
                                                                    selectedPoseId === pose.id
                                                                        ? 'border-primary bg-primary-soft text-primary-ink'
                                                                        : 'border-line bg-surface-2 text-muted hover:text-ink'
                                                                }`}
                                                            >
                                                                {pose.shortName} · {pose.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface-2/40 p-8 text-center transition-colors hover:border-primary">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => handleFileSelect(e, 'custom_model')}
                                    />
                                    {uploadingField === 'custom_model' ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    ) : customModelUrl ? (
                                        <img
                                            src={customModelUrl}
                                            alt="Uploaded model"
                                            className="max-h-56 rounded-xl object-contain"
                                        />
                                    ) : (
                                        <>
                                            <ImagePlus className="mb-2 h-8 w-8 text-faint" />
                                            <span className="text-xs font-semibold text-ink">
                                                Click to upload your model photo
                                            </span>
                                            <span className="mt-1 text-2xs text-subtle">
                                                JPG, PNG, or WebP
                                            </span>
                                        </>
                                    )}
                                </label>
                            )}
                        </div>

                        {/* Step 2: Upload Garment & Generate */}
                        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-xs lg:col-span-5">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-sm font-bold text-ink">
                                        2. Upload Garment &amp; Generate
                                    </h2>
                                    <p className="text-2xs text-subtle">
                                        Upload a flat-lay, ghost mannequin, or product photo of your garment.
                                    </p>
                                </div>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface-2/40 p-6 text-center transition-colors hover:border-primary">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => handleFileSelect(e, 'garment')}
                                    />
                                    {uploadingField === 'garment' ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    ) : garmentUrl ? (
                                        <img
                                            src={garmentUrl}
                                            alt="Uploaded garment"
                                            className="max-h-48 rounded-xl object-contain"
                                        />
                                    ) : (
                                        <>
                                            <Shirt className="mb-2 h-8 w-8 text-faint" />
                                            <span className="text-xs font-semibold text-ink">
                                                Click to upload garment photo
                                            </span>
                                            <span className="mt-1 text-2xs text-subtle">
                                                JPG, PNG, or WebP
                                            </span>
                                        </>
                                    )}
                                </label>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-ink">
                                        Garment Category
                                    </label>
                                    <select
                                        value={garmentCategory}
                                        onChange={(e) =>
                                            setGarmentCategory(
                                                e.target.value as 'auto' | 'tops' | 'bottoms' | 'one-pieces'
                                            )
                                        }
                                        className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                                    >
                                        <option value="auto">Auto Detect</option>
                                        <option value="tops">Tops / Jackets / Shirts</option>
                                        <option value="bottoms">Bottoms / Pants / Skirts</option>
                                        <option value="one-pieces">Dresses / One-Pieces</option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                type="button"
                                disabled={submitting || uploadingField !== null}
                                onClick={handleGenerateTryOn}
                                className="w-full cursor-pointer gap-2 bg-primary py-5 text-xs font-bold text-primary-foreground hover:bg-primary-hover"
                            >
                                {submitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                                <span>
                                    Generate Try-On Look
                                </span>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Background Remover Workspace */}
                {activeTab === 'bg_remove' && (
                    <div className="max-w-xl space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-xs">
                        <div>
                            <h2 className="text-sm font-bold text-ink">
                                Instant Background Remover
                            </h2>
                            <p className="text-2xs text-subtle">
                                Upload any garment, product, or model image to remove its background cleanly.
                            </p>
                        </div>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface-2/40 p-8 text-center transition-colors hover:border-primary">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e, 'bg_input')}
                            />
                            {uploadingField === 'bg_input' ? (
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            ) : bgInputUrl ? (
                                <img
                                    src={bgInputUrl}
                                    alt="Background removal input"
                                    className="max-h-56 rounded-xl object-contain"
                                />
                            ) : (
                                <>
                                    <ImagePlus className="mb-2 h-8 w-8 text-faint" />
                                    <span className="text-xs font-semibold text-ink">
                                        Click to upload image
                                    </span>
                                    <span className="mt-1 text-2xs text-subtle">
                                        JPG, PNG, or WebP
                                    </span>
                                </>
                            )}
                        </label>

                        <Button
                            type="button"
                            disabled={submitting || uploadingField !== null}
                            onClick={handleBgRemove}
                            className="w-full cursor-pointer gap-2 bg-primary py-5 text-xs font-bold text-primary-foreground hover:bg-primary-hover"
                        >
                            {submitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Eraser className="h-4 w-4" />
                            )}
                            <span>
                                Remove Background
                            </span>
                        </Button>
                    </div>
                )}

                {/* Result Gallery */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-ink">Your AI Studio Gallery</h2>
                            <p className="text-xs text-subtle">
                                Active jobs update automatically every 2.5 seconds and are stored permanently.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={refreshGallery}
                            className="cursor-pointer gap-1.5 border-line text-xs font-semibold"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Refresh</span>
                        </Button>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-xs text-subtle">
                            No generations yet. Pick a Digital Twin model and upload a garment above to create your first look!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-xs"
                                >
                                    <div className="relative aspect-[3/4] w-full bg-surface-2">
                                        {job.status === 'completed' && job.output_urls?.[0] ? (
                                            <img
                                                src={job.output_urls[0]}
                                                alt={`AI Job #${job.id}`}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : job.status === 'failed' ? (
                                            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                                                <AlertCircle className="mb-2 h-8 w-8 text-danger" />
                                                <span className="text-xs font-bold text-danger">
                                                    Generation Failed
                                                </span>
                                                <span className="mt-1 text-2xs text-subtle">
                                                    {job.error_message || 'Credits refunded automatically.'}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                                                <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
                                                <span className="text-xs font-semibold text-ink">
                                                    {job.status === 'queued' ? 'Queued…' : 'Generating…'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-t border-line p-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-ink">
                                                    {job.service_type === 'try_on'
                                                        ? 'Virtual Try-On'
                                                        : 'BG Removal'}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="text-2xs capitalize"
                                                >
                                                    {job.status}
                                                </Badge>
                                            </div>
                                            <span className="text-2xs text-subtle">
                                                Job #{job.id}
                                            </span>
                                        </div>

                                        {job.status === 'completed' && job.output_urls?.[0] && (
                                            <a
                                                href={job.output_urls[0]}
                                                download={`cuttingedger-ai-${job.id}.png`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-2xs font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                <span>Save</span>
                                            </a>
                                        )}
                                        {job.status === 'completed' && (
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <BuyCreditsModal
                open={buyModalOpen}
                onOpenChange={setBuyModalOpen}
                packs={creditPacks}
                currentBalance={creditBalance}
            />
        </>
    );
}

AiStudio.layout = getClientLayout;
