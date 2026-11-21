import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2, Sparkles, Wand2 } from 'lucide-react';

interface QuotaState {
    used: number;
    remaining: number;
    limit: number;
}

interface AiPreviewPanelProps {
    feature: 'digital_twin' | 'virtual_try_on';
    buildFormData: () => FormData;
    disabledReason?: string | null;
}

/**
 * Compact real-time AI preview generator widget for Digital Twins & Virtual Try-On.
 * Enforces a 2-free-preview quota per account / IP via /ai-preview/generate.
 */
export function AiPreviewPanel({ feature, buildFormData, disabledReason }: AiPreviewPanelProps) {
    const [quota, setQuota] = useState<QuotaState>({ used: 0, remaining: 2, limit: 2 });
    const [generating, setGenerating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        fetch('/ai-preview/quota', { headers: { Accept: 'application/json' } })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (active && data && typeof data.remaining === 'number') {
                    setQuota(data);
                }
            })
            .catch(() => {});

        return () => {
            active = false;
        };
    }, []);

    const handleGenerate = async () => {
        if (generating || quota.remaining <= 0 || disabledReason) {
            return;
        }

        setGenerating(true);
        setError(null);

        try {
            const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
            const formData = buildFormData();
            formData.set('feature', feature);

            const response = await fetch('/ai-preview/generate', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: formData,
            });

            const data = await response.json().catch(() => ({}));
            if (data?.quota) {
                setQuota(data.quota);
            }

            if (!response.ok) {
                setError(data?.message || 'Could not generate preview. Please try again.');
                return;
            }

            if (data?.preview_url) {
                setPreviewUrl(data.preview_url);
            }
        } catch {
            setError('Network error while generating preview.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="rounded-2xl border border-ink/10 bg-surface p-3.5">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-xs font-bold text-ink">Instant AI Preview</span>
                </div>
                <span
                    className={`rounded-full px-2.5 py-0.5 text-2xs font-bold ${
                        quota.remaining > 0
                            ? 'bg-primary/10 text-primary'
                            : 'bg-ink/10 text-subtle'
                    }`}
                >
                    {quota.remaining}/{quota.limit} Free Left
                </span>
            </div>

            {previewUrl && (
                <div className="mt-3 overflow-hidden rounded-xl border border-ink/10 bg-surface-2">
                    <img
                        src={previewUrl}
                        alt="Real-time AI generated preview"
                        className="max-h-64 w-full object-contain"
                    />
                    <div className="flex items-center justify-between border-t border-ink/10 bg-surface px-3 py-1.5 text-2xs">
                        <span className="font-semibold text-ink">AI Generated Preview</span>
                        <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                        >
                            Open Full Size
                            <ExternalLink size={11} />
                        </a>
                    </div>
                </div>
            )}

            {error && <p className="mt-2 text-2xs font-medium text-danger">{error}</p>}

            <button
                type="button"
                disabled={generating || quota.remaining <= 0 || Boolean(disabledReason)}
                onClick={handleGenerate}
                className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-ink/15 bg-surface-2 px-3 py-2 text-xs font-bold text-ink transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
                {generating ? (
                    <>
                        <Loader2 size={13} className="animate-spin text-primary" />
                        Generating Preview...
                    </>
                ) : quota.remaining <= 0 ? (
                    '2 Free Previews Used — Submit Order Below'
                ) : (
                    <>
                        <Wand2 size={13} className="text-primary" />
                        {previewUrl ? 'Regenerate Preview' : 'Generate Free Preview'}
                    </>
                )}
            </button>

            {disabledReason && quota.remaining > 0 && (
                <p className="mt-1.5 text-center text-2xs text-subtle">{disabledReason}</p>
            )}
        </div>
    );
}
