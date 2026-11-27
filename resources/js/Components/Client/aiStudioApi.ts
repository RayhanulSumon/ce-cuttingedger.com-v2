import { useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { toast } from '@/Components/ui/sonner';

export interface AiJobItem {
    id: number;
    provider: string;
    service_type: 'bg_remove' | 'try_on';
    status: 'queued' | 'processing' | 'completed' | 'failed';
    input_payload?: Record<string, unknown> | null;
    output_urls?: string[] | null;
    error_message?: string | null;
    created_at: string;
    completed_at?: string | null;
}

export function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export async function uploadImageDirect(
    file: File,
    purpose: 'inputs' | 'garments' | 'models'
): Promise<string> {
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

/**
 * Polls active (queued/processing) AI jobs every 2.5s and updates job list & credit balance.
 */
export function useAiJobPolling(
    jobs: AiJobItem[],
    setJobs: React.Dispatch<React.SetStateAction<AiJobItem[]>>,
    onCreditBalanceChange?: (balance: number) => void
) {
    const activeJobIds = useMemo(
        () =>
            jobs
                .filter((j) => j.status === 'queued' || j.status === 'processing')
                .map((j) => j.id),
        [jobs]
    );

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
                        onCreditBalanceChange?.(data.credit_balance);
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
    }, [activeJobIds, setJobs, onCreditBalanceChange]);
}
