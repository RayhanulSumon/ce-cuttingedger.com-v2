import React, { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { ImagePlus, Loader2, Shirt, Sparkles, UserRound } from 'lucide-react';
import { DigitalTwinModel } from '@/Components/Landing/DigitalTwins/twins';
import { Button } from '@/Components/ui/button';
import { toast } from '@/Components/ui/sonner';
import { AiJobGallery } from './AiJobGallery';
import { AiJobItem, getCsrfToken, uploadImageDirect, useAiJobPolling } from './aiStudioApi';

interface AiTryOnWorkspaceProps {
    initialJobs: AiJobItem[];
    digitalTwins: DigitalTwinModel[];
    onBalanceUpdate?: (balance: number) => void;
}

export function AiTryOnWorkspace({
    initialJobs,
    digitalTwins,
    onBalanceUpdate,
}: AiTryOnWorkspaceProps) {
    const [jobs, setJobs] = useState<AiJobItem[]>(initialJobs);
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

    useAiJobPolling(jobs, setJobs, onBalanceUpdate);

    const selectedTwin = useMemo(
        () => digitalTwins.find((t) => t.id === selectedTwinId) ?? null,
        [digitalTwins, selectedTwinId]
    );

    const handleFileSelect = async (
        e: React.ChangeEvent<HTMLInputElement>,
        target: 'custom_model' | 'garment'
    ) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        setUploadingField(target);
        try {
            const purpose = target === 'garment' ? 'garments' : 'models';
            const url = await uploadImageDirect(file, purpose);
            if (target === 'custom_model') {
                setCustomModelUrl(url);
            } else {
                setGarmentUrl(url);
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
                onBalanceUpdate?.(data.credit_balance);
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

    const refreshGallery = async () => {
        try {
            const res = await fetch('/api/ai/jobs', { headers: { Accept: 'application/json' } });
            if (res.ok) {
                const data = await res.json();
                const filtered = (data.jobs || []).filter(
                    (job: AiJobItem) => job.service_type === 'try_on'
                );
                setJobs(filtered);
                if (typeof data.credit_balance === 'number') {
                    onBalanceUpdate?.(data.credit_balance);
                }
            }
        } catch {
            // ignore
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Step 1: Select Digital Twin & Pose OR Upload Custom Model */}
                <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-xs lg:col-span-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-bold text-ink">1. Choose Model &amp; Pose</h2>
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
                                                    key={twin.id ?? twin.lookNumber}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedTwinId(twin.id ?? null);
                                                        setSelectedPoseId(twin.poses?.[0]?.id ?? 'pose-01');
                                                    }}
                                                    className={`group cursor-pointer overflow-hidden rounded-xl border text-left transition-all ${
                                                        active
                                                            ? 'border-primary ring-2 ring-primary/25'
                                                            : 'border-line hover:border-line-strong'
                                                    }`}
                                                >
                                                    <div className="aspect-[3/4] w-full bg-surface-2">
                                                        {twin.hiResImage || twin.runwayImage ? (
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
                                    <span className="mt-1 text-2xs text-subtle">JPG, PNG, or WebP</span>
                                </>
                            )}
                        </label>
                    )}
                </div>

                {/* Step 2: Upload Garment & Generate */}
                <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-xs lg:col-span-5">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-sm font-bold text-ink">2. Upload Garment &amp; Generate</h2>
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
                                    <span className="mt-1 text-2xs text-subtle">JPG, PNG, or WebP</span>
                                </>
                            )}
                        </label>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-ink">Garment Category</label>
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
                        <span>Generate Try-On Look</span>
                    </Button>
                </div>
            </div>

            <AiJobGallery
                title="Your Virtual Try-On Gallery"
                emptyText="No Virtual Try-On generations yet. Pick a Digital Twin model and upload a garment above to create your first look."
                jobs={jobs}
                onRefresh={refreshGallery}
            />
        </div>
    );
}
