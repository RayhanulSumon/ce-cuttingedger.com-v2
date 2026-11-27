import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Eraser, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { toast } from '@/Components/ui/sonner';
import { AiJobGallery } from './AiJobGallery';
import { AiJobItem, getCsrfToken, uploadImageDirect, useAiJobPolling } from './aiStudioApi';

interface AiBgRemoveWorkspaceProps {
    initialJobs: AiJobItem[];
    onBalanceUpdate?: (balance: number) => void;
}

export function AiBgRemoveWorkspace({ initialJobs, onBalanceUpdate }: AiBgRemoveWorkspaceProps) {
    const [jobs, setJobs] = useState<AiJobItem[]>(initialJobs);
    const [bgInputUrl, setBgInputUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useAiJobPolling(jobs, setJobs, onBalanceUpdate);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        setUploading(true);
        try {
            const url = await uploadImageDirect(file, 'inputs');
            setBgInputUrl(url);
            toast.success('Image uploaded.');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Upload failed.');
        } finally {
            setUploading(false);
            e.target.value = '';
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
                onBalanceUpdate?.(data.credit_balance);
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
                const filtered = (data.jobs || []).filter(
                    (job: AiJobItem) => job.service_type === 'bg_remove'
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
            <div className="max-w-xl space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-xs">
                <div>
                    <h2 className="text-sm font-bold text-ink">Instant AI Background Remover</h2>
                    <p className="text-2xs text-subtle">
                        Upload any garment, product, or model image to remove its background cleanly in seconds.
                    </p>
                </div>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface-2/40 p-8 text-center transition-colors hover:border-primary">
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    {uploading ? (
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
                            <span className="text-xs font-semibold text-ink">Click to upload image</span>
                            <span className="mt-1 text-2xs text-subtle">JPG, PNG, or WebP</span>
                        </>
                    )}
                </label>

                <Button
                    type="button"
                    disabled={submitting || uploading}
                    onClick={handleBgRemove}
                    className="w-full cursor-pointer gap-2 bg-primary py-5 text-xs font-bold text-primary-foreground hover:bg-primary-hover"
                >
                    {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Eraser className="h-4 w-4" />
                    )}
                    <span>Remove Background</span>
                </Button>
            </div>

            <AiJobGallery
                title="Your Background Removal Gallery"
                emptyText="No background removal cutouts yet. Upload an image above to generate your first transparent PNG."
                jobs={jobs}
                onRefresh={refreshGallery}
            />
        </div>
    );
}
