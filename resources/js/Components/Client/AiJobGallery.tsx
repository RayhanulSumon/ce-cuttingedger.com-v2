import React from 'react';
import { AlertCircle, CheckCircle2, Download, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { AiJobItem } from './aiStudioApi';

interface AiJobGalleryProps {
    title: string;
    emptyText: string;
    jobs: AiJobItem[];
    onRefresh: () => void;
}

export function AiJobGallery({ title, emptyText, jobs, onRefresh }: AiJobGalleryProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold text-ink">{title}</h2>
                    <p className="text-xs text-subtle">
                        Active jobs update automatically every 2.5 seconds and are stored permanently.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    className="cursor-pointer gap-1.5 border-line text-xs font-semibold"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Refresh</span>
                </Button>
            </div>

            {jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-xs text-subtle">
                    {emptyText}
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
                                        <Badge variant="outline" className="text-2xs capitalize">
                                            {job.status}
                                        </Badge>
                                    </div>
                                    <span className="text-2xs text-subtle">Job #{job.id}</span>
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
    );
}
