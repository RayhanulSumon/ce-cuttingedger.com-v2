import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, FileUp, Folder, ImagePlus, Plus, Trash2, X } from 'lucide-react';

export const DEFAULT_POSES = ['Front', 'Side', 'Close-Up', 'Back', 'Detail', 'Stride'] as const;

export const ADDITIONAL_POSES = [
    '3/4 Angle',
    'Walking',
    'Seated',
    'Over-the-Shoulder',
    'Full Profile',
    'Hands on Hips',
    'Studio Portrait',
    'Back 3/4',
    'Editorial Lean',
    'Dynamic Motion',
] as const;

interface DigitalTwinPoseReferenceSectionProps {
    stepLabel: string;
    selectedPoses: string[];
    onTogglePose: (pose: string) => void;
    onSelectAllDefaultPoses: () => void;
    poseFiles: Record<string, File>;
    onSetPoseFile: (pose: string, file: File | null) => void;
    onReassignPoseFile: (fromPose: string, toPose: string) => void;
    onBulkAddFiles: (files: File[]) => void;
    isReferenceRequired: boolean;
    referenceError?: string | null;
    cloudLink: string;
    onCloudLinkChange: (value: string) => void;
    instructions: string;
    onInstructionsChange: (value: string) => void;
    sectionRef?: React.RefObject<HTMLDivElement | null>;
}

interface PoseThumbnailCardProps {
    pose: string;
    file?: File;
    selectedPoses: string[];
    onSelectFile: (file: File | null) => void;
    onReassignPose: (toPose: string) => void;
}

function PoseThumbnailCard({
    pose,
    file,
    selectedPoses,
    onSelectFile,
    onReassignPose,
}: PoseThumbnailCardProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const previewUrl = useMemo(() => {
        if (!file || !file.type.startsWith('image/')) {
            return null;
        }
        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div
            className={`group flex flex-col overflow-hidden rounded-2xl border transition-all ${
                file
                    ? 'border-primary/45 bg-primary/[0.03] shadow-xs'
                    : 'border-ink/15 bg-surface-2/60 hover:border-primary/50'
            }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.tiff,.psd"
                onChange={(e) => {
                    const picked = e.target.files?.[0] ?? null;
                    if (picked) {
                        onSelectFile(picked);
                    }
                    e.target.value = '';
                }}
                className="hidden"
            />

            {/* Thumbnail Preview / Upload Trigger */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-2">
                {file && previewUrl ? (
                    <>
                        <img
                            src={previewUrl}
                            alt={`${pose} reference`}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-1.5 top-1.5 flex items-center justify-between gap-1">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                                <Check size={11} strokeWidth={3} />
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    className="cursor-pointer rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs transition-colors hover:bg-ink"
                                >
                                    Replace
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onSelectFile(null)}
                                    aria-label={`Remove ${pose} reference`}
                                    className="grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-danger/90 text-white transition-colors hover:bg-danger"
                                >
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : file ? (
                    <div className="flex h-full flex-col items-center justify-center p-2 text-center">
                        <FileUp className="h-6 w-6 text-primary" />
                        <span className="mt-1 line-clamp-2 text-[10px] font-semibold text-ink">
                            {file.name}
                        </span>
                        <button
                            type="button"
                            onClick={() => onSelectFile(null)}
                            className="mt-1.5 cursor-pointer text-[10px] font-bold text-danger hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 p-2 text-center transition-colors hover:bg-primary/5"
                    >
                        <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                            <ImagePlus size={16} />
                        </div>
                        <span className="text-[11px] font-bold text-ink">Upload</span>
                        <span className="text-[10px] leading-tight text-subtle">Reference pose</span>
                    </button>
                )}
            </div>

            {/* Label Underneath Thumbnail */}
            <div className="border-t border-ink/10 bg-surface px-2 py-1.5">
                {file && selectedPoses.length > 1 ? (
                    <select
                        aria-label={`Pose label for ${file.name}`}
                        value={pose}
                        onChange={(e) => onReassignPose(e.target.value)}
                        className="w-full cursor-pointer truncate bg-transparent text-center text-2xs font-bold text-ink focus:outline-none"
                    >
                        {selectedPoses.map((optionPose) => (
                            <option key={optionPose} value={optionPose}>
                                {optionPose}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p className="truncate text-center text-2xs font-bold text-ink">{pose}</p>
                )}
            </div>
        </div>
    );
}

/**
 * Shared Camera Poses (6 core poses + "Other" dropdown) and Required Reference Pose
 * Thumbnail Uploader for Digital Twin orders.
 */
export function DigitalTwinPoseReferenceSection({
    stepLabel,
    selectedPoses,
    onTogglePose,
    onSelectAllDefaultPoses,
    poseFiles,
    onSetPoseFile,
    onReassignPoseFile,
    onBulkAddFiles,
    isReferenceRequired,
    referenceError,
    cloudLink,
    onCloudLinkChange,
    instructions,
    onInstructionsChange,
    sectionRef,
}: DigitalTwinPoseReferenceSectionProps) {
    const bulkInputRef = useRef<HTMLInputElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [otherOpen, setOtherOpen] = useState(false);

    useEffect(() => {
        if (!otherOpen) {
            return;
        }
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOtherOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [otherOpen]);

    const selectedAdditionalPoses = useMemo(
        () => selectedPoses.filter((p) => !(DEFAULT_POSES as readonly string[]).includes(p)),
        [selectedPoses]
    );

    const uploadedCount = useMemo(
        () => selectedPoses.filter((pose) => Boolean(poseFiles[pose])).length,
        [selectedPoses, poseFiles]
    );

    const allDefaultSelected = DEFAULT_POSES.every((p) => selectedPoses.includes(p));

    return (
        <section
            ref={sectionRef}
            className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.12)] sm:p-6"
        >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/10 pb-3.5">
                <div>
                    <span className="text-2xs font-bold uppercase tracking-[0.2em] text-primary">
                        {stepLabel}
                    </span>
                    <h2 className="mt-0.5 text-base font-bold text-ink sm:text-lg">
                        Camera Poses &amp; Reference Pose Images
                    </h2>
                </div>
                <span className="text-2xs font-semibold text-subtle">
                    {selectedPoses.length} {selectedPoses.length === 1 ? 'pose' : 'poses'} selected ·{' '}
                    <span className={uploadedCount > 0 ? 'text-primary' : 'text-subtle'}>
                        {uploadedCount} uploaded
                    </span>
                </span>
            </div>

            {/* 1. Reference Pose Images (Above / Mapped Directly to Selected Poses) */}
            <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <label className="block text-xs font-bold text-ink">
                            Reference Pose Files{' '}
                            {isReferenceRequired ? (
                                <span className="text-primary">*</span>
                            ) : (
                                <span className="font-normal text-subtle">(Optional)</span>
                            )}
                        </label>
                        <p className="mt-0.5 text-2xs text-subtle">
                            Upload reference pose images for the selected poses below so we can generate your model accurately.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <input
                            ref={bulkInputRef}
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.webp,.tiff,.psd"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    onBulkAddFiles(Array.from(e.target.files));
                                }
                                e.target.value = '';
                            }}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => bulkInputRef.current?.click()}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-primary/35 bg-primary/5 px-3 py-1.5 text-2xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                            <FileUp size={13} />
                            <span>Upload Reference Files</span>
                        </button>
                    </div>
                </div>

                {/* Per-Selected-Pose Thumbnail Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
                    {selectedPoses.map((pose) => (
                        <PoseThumbnailCard
                            key={pose}
                            pose={pose}
                            file={poseFiles[pose]}
                            selectedPoses={selectedPoses}
                            onSelectFile={(file) => onSetPoseFile(pose, file)}
                            onReassignPose={(toPose) => onReassignPoseFile(pose, toPose)}
                        />
                    ))}
                </div>

                {referenceError && (
                    <p className="text-xs font-semibold text-danger">{referenceError}</p>
                )}
            </div>

            {/* 2. Included Camera Poses (6 Core Poses + Other Dropdown for Additional Poses) */}
            <div className="mt-5 border-t border-ink/10 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-ink">Included Camera Poses</label>
                    <div className="flex items-center gap-3">
                        {!allDefaultSelected && (
                            <button
                                type="button"
                                onClick={onSelectAllDefaultPoses}
                                className="cursor-pointer text-2xs font-semibold text-primary hover:underline"
                            >
                                Select all 6
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                    {DEFAULT_POSES.map((pose) => {
                        const active = selectedPoses.includes(pose);
                        return (
                            <button
                                key={pose}
                                type="button"
                                role="checkbox"
                                aria-checked={active}
                                onClick={() => onTogglePose(pose)}
                                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-all ${
                                    active
                                        ? 'border-primary/50 bg-primary/[0.07] font-bold text-ink'
                                        : 'border-ink/15 bg-surface-2 font-medium text-subtle hover:border-ink/35 hover:text-ink'
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border transition-colors ${
                                        active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-ink/30 bg-surface'
                                    }`}
                                >
                                    {active && <Check size={11} strokeWidth={3} />}
                                </span>
                                <span className="truncate">{pose}</span>
                            </button>
                        );
                    })}

                    {/* Other / Additional Poses Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setOtherOpen((open) => !open)}
                            aria-expanded={otherOpen}
                            className={`flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                                selectedAdditionalPoses.length > 0 || otherOpen
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-dashed border-ink/25 bg-surface-2 text-ink hover:border-primary hover:text-primary'
                            }`}
                        >
                            <span className="inline-flex items-center gap-1 truncate">
                                <Plus size={13} />
                                <span>
                                    Other
                                    {selectedAdditionalPoses.length > 0
                                        ? ` (${selectedAdditionalPoses.length})`
                                        : ''}
                                </span>
                            </span>
                            <ChevronDown
                                size={13}
                                className={`shrink-0 transition-transform ${otherOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {otherOpen && (
                            <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-line bg-surface p-2 shadow-xl">
                                <p className="px-2 pb-1.5 text-2xs font-bold uppercase tracking-wider text-subtle">
                                    Additional Poses
                                </p>
                                <div className="max-h-56 space-y-0.5 overflow-y-auto">
                                    {ADDITIONAL_POSES.map((extraPose) => {
                                        const active = selectedPoses.includes(extraPose);
                                        return (
                                            <button
                                                key={extraPose}
                                                type="button"
                                                onClick={() => onTogglePose(extraPose)}
                                                className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors ${
                                                    active
                                                        ? 'bg-primary/10 font-bold text-primary'
                                                        : 'text-ink hover:bg-surface-2'
                                                }`}
                                            >
                                                <span
                                                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border ${
                                                        active
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-ink/25 bg-surface'
                                                    }`}
                                                >
                                                    {active && <Check size={10} strokeWidth={3} />}
                                                </span>
                                                <span className="truncate">{extraPose}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Additional Poses Chips */}
                {selectedAdditionalPoses.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-2xs font-semibold text-subtle">Additional:</span>
                        {selectedAdditionalPoses.map((pose) => (
                            <span
                                key={pose}
                                className="inline-flex items-center gap-1 rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-2xs font-bold text-primary"
                            >
                                {pose}
                                <button
                                    type="button"
                                    onClick={() => onTogglePose(pose)}
                                    aria-label={`Remove ${pose}`}
                                    className="cursor-pointer rounded-full p-0.5 hover:bg-primary/15"
                                >
                                    <X size={11} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. Cloud Folder Link & Styling Notes */}
            <div className="mt-5 space-y-4 border-t border-ink/10 pt-4">
                <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                        <Folder size={13} className="text-primary" />
                        Cloud Folder Link (Optional)
                    </label>
                    <input
                        type="url"
                        value={cloudLink}
                        onChange={(e) => onCloudLinkChange(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="mt-1.5 h-10 w-full rounded-xl border border-ink/15 bg-surface-2 px-3 text-xs text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-surface focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-ink">
                        Styling &amp; Brand Notes (Optional)
                    </label>
                    <textarea
                        rows={1}
                        value={instructions}
                        onChange={(e) => {
                            onInstructionsChange(e.target.value);
                            e.currentTarget.style.height = 'auto';
                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                        }}
                        placeholder="Describe hair texture, makeup aesthetic, lighting mood, or campaign usage..."
                        className="mt-1.5 min-h-10 max-h-48 w-full resize-y rounded-xl border border-ink/15 bg-surface-2 px-3 py-2.5 text-xs leading-relaxed text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-surface focus:outline-none"
                    />
                </div>
            </div>
        </section>
    );
}
