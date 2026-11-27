import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Check, FileUp, Trash2, UserCheck, UserPlus } from 'lucide-react';
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
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import {
    DIGITAL_TWINS,
    DigitalTwinAttributeItem,
    DigitalTwinModel,
} from '@/Components/Landing/DigitalTwins/twins';
import {
    DEFAULT_POSES,
    DigitalTwinPoseReferenceSection,
} from './DigitalTwinPoseReferenceSection';

export const TWIN_STAGE_BACKGROUND =
    'linear-gradient(90deg, var(--color-page) 0%, var(--color-surface-2) 55%, var(--color-surface) 100%)';

const DEFAULT_ATTRIBUTES: DigitalTwinAttributeItem[] = [
    {
        id: 1,
        name: 'Height',
        slug: 'height',
        inputType: 'unit_input',
        options: ['ft', 'in'],
        allowCustom: false,
        customLabel: 'Custom',
        placeholder: 'Enter height (e.g. 5\'9" or 69)',
        isRequired: true,
        isActive: true,
        sortOrder: 1,
    },
    {
        id: 2,
        name: 'Body Structure',
        slug: 'body_structure',
        inputType: 'select',
        options: ['Slim', 'Toned', 'Curvy', 'Plus Size'],
        allowCustom: true,
        customLabel: 'Other',
        placeholder: 'Describe custom body structure...',
        isRequired: true,
        isActive: true,
        sortOrder: 2,
    },
    {
        id: 3,
        name: 'Skin Tone',
        slug: 'skin_tone',
        inputType: 'select',
        options: ['Fair', 'Blonde', 'Brown', 'White', 'Dark'],
        allowCustom: true,
        customLabel: 'Custom',
        placeholder: 'Describe custom skin tone or undertone...',
        isRequired: true,
        isActive: true,
        sortOrder: 3,
    },
    {
        id: 4,
        name: 'Body Measurement',
        slug: 'body_measurement',
        inputType: 'multi_input',
        options: ['Shoulder', 'Chest', 'Hip'],
        allowCustom: false,
        customLabel: 'Custom',
        placeholder: 'in / cm',
        isRequired: true,
        isActive: true,
        sortOrder: 4,
    },
    {
        id: 5,
        name: 'Forehead',
        slug: 'forehead',
        inputType: 'select',
        options: ['Triangle', 'Round', 'Square', 'Diamond'],
        allowCustom: true,
        customLabel: 'Custom',
        placeholder: 'Describe custom forehead shape...',
        isRequired: false,
        isActive: true,
        sortOrder: 5,
    },
    {
        id: 6,
        name: 'Eye Shapes',
        slug: 'eye_shapes',
        inputType: 'select',
        options: ['Round', 'Almond', 'Upturned', 'Hooded'],
        allowCustom: true,
        customLabel: 'Custom',
        placeholder: 'Describe custom eye shape...',
        isRequired: false,
        isActive: true,
        sortOrder: 6,
    },
    {
        id: 7,
        name: 'Lip',
        slug: 'lip',
        inputType: 'select',
        options: ['Wide', 'Thin', 'Round', 'Full'],
        allowCustom: true,
        customLabel: 'Custom',
        placeholder: 'Describe custom lip shape...',
        isRequired: false,
        isActive: true,
        sortOrder: 7,
    },
];

export interface DigitalTwinOrderConfiguratorProps {
    digitalTwins?: DigitalTwinModel[];
    attributes?: DigitalTwinAttributeItem[];
    initialMode?: 'custom' | 'preset' | 'lifetime';
    initialTwinSlug?: string;
    initialReference?: string;
    /** True when rendered inside the Client Portal layout instead of the public frontend page. */
    embedded?: boolean;
    /** Optional controlled mode setter when the parent header renders mode tabs. */
    mode?: 'custom' | 'preset' | 'lifetime';
    onModeChange?: (mode: 'custom' | 'preset' | 'lifetime') => void;
    /** Optional callback reporting the currently selected twin to a parent header. */
    onActiveTwinChange?: (twin: DigitalTwinModel | null) => void;
    /** Optional externally selected twin (e.g. chosen from the in-portal Studio Twins modal). */
    externalSelectedTwin?: DigitalTwinModel | null;
}

/**
 * Shared Customize Your Digital Twin & Licensing configurator component.
 * Rendered identically on both the public frontend (/digital-twins/order)
 * and inside the Client Portal (/portal/capabilities/digital-twins).
 */
export function DigitalTwinOrderConfigurator({
    digitalTwins,
    attributes,
    initialMode = 'custom',
    initialTwinSlug = '',
    initialReference = '',
    embedded = false,
    mode: controlledMode,
    onModeChange,
    onActiveTwinChange,
    externalSelectedTwin,
}: DigitalTwinOrderConfiguratorProps) {
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

    const twins = digitalTwins && digitalTwins.length > 0 ? digitalTwins : DIGITAL_TWINS;
    const twinAttributes = attributes && attributes.length > 0 ? attributes : DEFAULT_ATTRIBUTES;

    const initialTwin = useMemo(() => {
        const needle = (initialTwinSlug || initialReference).trim().toLowerCase();
        if (!needle) {
            return initialMode === 'custom'
                ? null
                : (twins.find((t) => !t.isCopyrightSold) ?? twins[0] ?? null);
        }
        return (
            twins.find(
                (t) =>
                    t.slug?.toLowerCase() === needle ||
                    t.name.toLowerCase() === needle ||
                    t.name.toLowerCase().includes(needle) ||
                    `look ${t.lookNumber}` === needle
            ) ?? null
        );
    }, [initialTwinSlug, initialReference, initialMode, twins]);

    const DRAFT_KEY = 'ce_draft_digital_twin_order';
    const FILES_DRAFT_KEY = 'ce_draft_digital_twin_order_files';
    const filesHydratedRef = useRef(false);
    const initialDraft = useMemo(
        () =>
            readOrderDraft<{
                mode: 'custom' | 'preset' | 'lifetime';
                selectedTwinId: number | null;
                selectedTwinIndex: number | null;
                attrValues: Record<string, any>;
                selectedPoses: string[];
                name: string;
                email: string;
                company: string;
                phone: string;
                cloudLink: string;
                instructions: string;
            }>(DRAFT_KEY),
        []
    );

    const hasExplicitTwin = Boolean((initialTwinSlug.trim() || initialReference.trim()) && initialTwin);

    const [internalMode, setInternalMode] = useState<'custom' | 'preset' | 'lifetime'>(
        embedded ? 'custom' : initialMode === 'custom' ? 'custom' : (initialDraft?.mode ?? initialMode)
    );
    const mode = embedded ? 'custom' : (controlledMode ?? internalMode);
    const setMode = useCallback(
        (next: 'custom' | 'preset' | 'lifetime') => {
            setInternalMode(next);
            onModeChange?.(next);
        },
        [onModeChange]
    );

    const [selectedTwinId, setSelectedTwinId] = useState<number | null>(
        hasExplicitTwin
            ? (initialTwin?.id ?? null)
            : initialDraft?.selectedTwinId !== undefined
              ? initialDraft.selectedTwinId
              : (initialTwin?.id ?? null)
    );
    const [selectedTwinIndex, setSelectedTwinIndex] = useState<number | null>(
        hasExplicitTwin
            ? (initialTwin?.index ?? null)
            : initialDraft?.selectedTwinIndex !== undefined
              ? initialDraft.selectedTwinIndex
              : initialTwin
                ? initialTwin.index
                : null
    );
    const [showStudioModels, setShowStudioModels] = useState<boolean>(
        hasExplicitTwin
            ? true
            : initialDraft?.selectedTwinId !== undefined
              ? initialDraft.selectedTwinId !== null || (initialDraft.selectedTwinIndex ?? null) !== null
              : Boolean(initialTwin)
    );

    useEffect(() => {
        if (externalSelectedTwin) {
            setMode('custom');
            setShowStudioModels(true);
            setSelectedTwinId(externalSelectedTwin.id ?? null);
            setSelectedTwinIndex(externalSelectedTwin.index);
        }
    }, [externalSelectedTwin, setMode]);

    const activeTwin = useMemo(() => {
        if (selectedTwinId !== null) {
            const byId = twins.find((t) => t.id === selectedTwinId);
            if (byId) return byId;
        }
        if (selectedTwinIndex !== null) {
            return twins.find((t) => t.index === selectedTwinIndex) ?? null;
        }
        return null;
    }, [selectedTwinId, selectedTwinIndex, twins]);

    useEffect(() => {
        onActiveTwinChange?.(activeTwin);
    }, [activeTwin, onActiveTwinChange]);

    useEffect(() => {
        if (mode !== 'custom' && (!activeTwin || activeTwin.isCopyrightSold)) {
            const firstAvailable = twins.find((t) => !t.isCopyrightSold) ?? twins[0] ?? null;
            if (firstAvailable) {
                setSelectedTwinId(firstAvailable.id ?? null);
                setSelectedTwinIndex(firstAvailable.index);
            }
        }
    }, [mode, activeTwin, twins]);

    const [attrValues, setAttrValues] = useState<Record<string, any>>(initialDraft?.attrValues ?? {});
    const [selectedPoses, setSelectedPoses] = useState<string[]>(
        initialDraft?.selectedPoses && initialDraft.selectedPoses.length > 0
            ? initialDraft.selectedPoses
            : [...DEFAULT_POSES]
    );
    const [poseFiles, setPoseFiles] = useState<Record<string, File>>({});
    const [referenceError, setReferenceError] = useState<string | null>(null);

    const [name, setName] = useState(initialDraft?.name || clientUser?.name || '');
    const [email, setEmail] = useState(initialDraft?.email || clientUser?.email || '');
    const [company, setCompany] = useState(initialDraft?.company || clientUser?.company || '');
    const [phone, setPhone] = useState(initialDraft?.phone || clientUser?.phone || '');
    const [cloudLink, setCloudLink] = useState(initialDraft?.cloudLink ?? '');
    const [instructions, setInstructions] = useState(initialDraft?.instructions ?? '');
    const [customModelFile, setCustomModelFile] = useState<File | null>(null);
    const [customModelPreview, setCustomModelPreview] = useState<string | null>(null);
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
            mode,
            selectedTwinId,
            selectedTwinIndex,
            attrValues,
            selectedPoses,
            name,
            email,
            company,
            phone,
            cloudLink,
            instructions,
        });
    }, [
        mode,
        selectedTwinId,
        selectedTwinIndex,
        attrValues,
        selectedPoses,
        name,
        email,
        company,
        phone,
        cloudLink,
        instructions,
    ]);

    useEffect(() => {
        saveDraft();
    }, [saveDraft]);

    useEffect(() => {
        let active = true;
        readOrderDraftFiles<{
            poseFiles?: Record<string, File>;
            customModelFile?: File | null;
        }>(FILES_DRAFT_KEY).then((saved) => {
            if (!active) return;
            if (saved?.poseFiles && typeof saved.poseFiles === 'object') {
                const validPoseFiles: Record<string, File> = {};
                Object.entries(saved.poseFiles).forEach(([pose, file]) => {
                    if (file instanceof File) {
                        validPoseFiles[pose] = file;
                    }
                });
                if (Object.keys(validPoseFiles).length > 0) {
                    setPoseFiles(validPoseFiles);
                }
            }
            if (saved?.customModelFile instanceof File) {
                setCustomModelFile(saved.customModelFile);
                setCustomModelPreview(URL.createObjectURL(saved.customModelFile));
            }
            filesHydratedRef.current = true;
        });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!filesHydratedRef.current) return;
        writeOrderDraftFiles(FILES_DRAFT_KEY, { poseFiles, customModelFile });
    }, [poseFiles, customModelFile]);

    const customModelInputRef = useRef<HTMLInputElement | null>(null);
    const submitCardRef = useRef<HTMLDivElement | null>(null);
    const poseSectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!embedded && isVerifiedClient(clientUser) && consumeAuthReturn()) {
            requestAnimationFrame(() => {
                submitCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }, [embedded, clientUser?.email_verified_at]);

    const handleSelectTwin = (twin: DigitalTwinModel | null) => {
        if (!twin) {
            setSelectedTwinId(null);
            setSelectedTwinIndex(null);
            return;
        }
        setSelectedTwinId(twin.id ?? null);
        setSelectedTwinIndex(twin.index);
    };

    const togglePose = (pose: string) => {
        setSelectedPoses((prev) => {
            if (prev.includes(pose)) {
                if (prev.length <= 1) {
                    return prev;
                }
                setPoseFiles((currentFiles) => {
                    if (!(pose in currentFiles)) return currentFiles;
                    const next = { ...currentFiles };
                    delete next[pose];
                    return next;
                });
                return prev.filter((p) => p !== pose);
            }
            return [...prev, pose];
        });
    };

    const handleSelectAllDefaultPoses = () => {
        setSelectedPoses((prev) => {
            const extras = prev.filter((p) => !(DEFAULT_POSES as readonly string[]).includes(p));
            return [...DEFAULT_POSES, ...extras];
        });
    };

    const handleSetPoseFile = (pose: string, file: File | null) => {
        setReferenceError(null);
        setPoseFiles((prev) => {
            const next = { ...prev };
            if (!file) {
                delete next[pose];
            } else {
                next[pose] = file;
            }
            return next;
        });
    };

    const handleReassignPoseFile = (fromPose: string, toPose: string) => {
        if (fromPose === toPose) return;
        setPoseFiles((prev) => {
            const next = { ...prev };
            const movedFile = next[fromPose];
            const existingTarget = next[toPose];
            if (!movedFile) return prev;
            next[toPose] = movedFile;
            if (existingTarget) {
                next[fromPose] = existingTarget;
            } else {
                delete next[fromPose];
            }
            return next;
        });
    };

    const handleBulkAddFiles = (files: File[]) => {
        if (files.length === 0) return;
        setReferenceError(null);
        setPoseFiles((prev) => {
            const next = { ...prev };
            let fileIdx = 0;
            // First fill empty selected poses
            for (const pose of selectedPoses) {
                if (fileIdx >= files.length) break;
                if (!next[pose]) {
                    next[pose] = files[fileIdx++];
                }
            }
            // If more files remain, overwrite from first selected pose onward
            let slotIdx = 0;
            while (fileIdx < files.length && slotIdx < selectedPoses.length) {
                next[selectedPoses[slotIdx++]] = files[fileIdx++];
            }
            return next;
        });
    };

    const setUnitChoice = (slug: string, unit: string) => {
        setAttrValues((prev) => ({
            ...prev,
            [slug]: {
                ...(typeof prev[slug] === 'object' && prev[slug] !== null ? prev[slug] : {}),
                unit,
                value: prev[slug]?.value ?? '',
            },
        }));
    };

    const setUnitValue = (slug: string, value: string) => {
        setAttrValues((prev) => ({
            ...prev,
            [slug]: {
                ...(typeof prev[slug] === 'object' && prev[slug] !== null ? prev[slug] : {}),
                value,
            },
        }));
    };

    const setSelectOption = (slug: string, selected: string) => {
        setAttrValues((prev) => ({
            ...prev,
            [slug]: {
                selected,
                customValue: prev[slug]?.customValue ?? '',
            },
        }));
    };

    const setSelectCustomValue = (slug: string, customValue: string) => {
        setAttrValues((prev) => ({
            ...prev,
            [slug]: {
                ...(typeof prev[slug] === 'object' && prev[slug] !== null ? prev[slug] : {}),
                customValue,
            },
        }));
    };

    const setMultiFieldValue = (slug: string, fieldName: string, val: string) => {
        setAttrValues((prev) => ({
            ...prev,
            [slug]: {
                ...(typeof prev[slug] === 'object' && prev[slug] !== null ? prev[slug] : {}),
                [fieldName]: val,
            },
        }));
    };

    const handleCustomModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0] ?? null;
        setCustomModelFile(picked);
        setCustomModelPreview(picked ? URL.createObjectURL(picked) : null);
    };

    const uploadedPoseEntries = useMemo(
        () =>
            selectedPoses
                .filter((pose) => Boolean(poseFiles[pose]))
                .map((pose) => [pose, poseFiles[pose]] as const),
        [selectedPoses, poseFiles]
    );

    // Show Model Traits & Measurements ONLY when "Use My Model" is selected in custom mode
    const showTraitsStep = mode === 'custom' && !showStudioModels;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'custom' && uploadedPoseEntries.length === 0) {
            setReferenceError('Please upload at least one reference pose image so we can generate your Digital Twin model.');
            poseSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (!clientUser) {
            saveDraft();
            markAuthReturn();
            router.visit(`/login?redirect=${encodeURIComponent(currentRedirectUrl('/digital-twins/order'))}`);
            return;
        }

        if (!isVerifiedClient(clientUser)) {
            saveDraft();
            markAuthReturn();
            router.visit('/verify-email');
            return;
        }

        setIsSubmitting(true);
        setReferenceError(null);

        const formattedAttributes: Record<string, any> = {};
        if (showTraitsStep) {
            twinAttributes.forEach((attr) => {
                const raw = attrValues[attr.slug];
                if (!raw) return;
                if (attr.inputType === 'unit_input') {
                    if (raw.unit || raw.value) {
                        formattedAttributes[attr.name] = `${raw.value || ''} ${raw.unit || ''}`.trim();
                    }
                } else if (attr.inputType === 'select') {
                    if (raw.selected === attr.customLabel && raw.customValue) {
                        formattedAttributes[attr.name] = `${raw.selected}: ${raw.customValue}`;
                    } else if (raw.selected) {
                        formattedAttributes[attr.name] = raw.selected;
                    }
                } else if (attr.inputType === 'multi_input') {
                    formattedAttributes[attr.name] = raw;
                }
            });
        }

        const poseReferencesPayload: Record<string, File> = {};
        uploadedPoseEntries.forEach(([pose, file]) => {
            poseReferencesPayload[pose] = file;
        });

        const attachmentsPayload: File[] = [
            ...(mode === 'custom' && !showStudioModels && customModelFile ? [customModelFile] : []),
        ];

        router.post(
            '/digital-twins/order',
            {
                mode,
                digital_twin_id: showStudioModels || mode !== 'custom' ? (activeTwin?.id ?? null) : null,
                reference_twin_name:
                    showStudioModels && activeTwin
                        ? activeTwin.name
                        : customModelFile
                          ? 'Client Uploaded Model'
                          : 'Use My Model',
                name,
                email,
                company,
                phone,
                attributes: formattedAttributes,
                selected_poses: selectedPoses,
                pose_references: poseReferencesPayload,
                cloud_link: cloudLink,
                instructions,
                attachments: attachmentsPayload,
                submission_page_url: typeof window !== 'undefined' ? window.location.href : '',
            },
            {
                forceFormData: true,
                preserveScroll: embedded,
                onSuccess: () => {
                    setAttrValues({});
                    setSelectedPoses([...DEFAULT_POSES]);
                    setPoseFiles({});
                    setCloudLink('');
                    setInstructions('');
                    setCustomModelFile(null);
                    setCustomModelPreview(null);
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
                title="Digital Twin Order Submitted"
                message={successMessage}
                onReset={() => setSuccessMessage(null)}
                resetLabel="Submit Another Digital Twin Order"
                inPortal={embedded}
            />
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 lg:grid-cols-12">
            {/* Left Column: Configurator Steps */}
            <div className="space-y-6 lg:col-span-8">
                {/* STEP 1: Select Reference Model or Preset Model */}
                <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.12)] sm:p-6">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <span className="text-2xs font-bold uppercase tracking-[0.2em] text-primary">
                                Step 01
                            </span>
                            <h2 className="mt-0.5 text-base font-bold text-ink sm:text-lg">
                                {mode === 'custom'
                                    ? 'Choose Model Starting Point'
                                    : 'Select Digital Twin Model'}
                            </h2>
                        </div>

                        {mode === 'custom' ? (
                            <div className="inline-flex rounded-full border border-ink/15 bg-surface-2 p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowStudioModels(false);
                                        handleSelectTwin(null);
                                    }}
                                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                                        !showStudioModels
                                            ? 'bg-ink text-white shadow-xs'
                                            : 'text-subtle hover:text-ink'
                                    }`}
                                >
                                    <UserPlus size={13} />
                                    Use My Model
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowStudioModels(true);
                                        if (!activeTwin && twins[0]) {
                                            handleSelectTwin(twins[0]);
                                        }
                                    }}
                                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                                        showStudioModels
                                            ? 'bg-ink text-white shadow-xs'
                                            : 'text-subtle hover:text-ink'
                                    }`}
                                >
                                    <UserCheck size={13} />
                                    Use Our Model
                                </button>
                            </div>
                        ) : (
                            activeTwin && (
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                    {activeTwin.name.split(' — ')[0]}
                                </span>
                            )
                        )}
                    </div>

                    {mode === 'custom' && !showStudioModels && (
                        <div className="mt-4">
                            <input
                                ref={customModelInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,.tiff,.psd"
                                onChange={handleCustomModelChange}
                                className="hidden"
                            />
                            {customModelPreview && customModelFile ? (
                                <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/[0.04] p-3">
                                    <div className="flex min-w-0 items-center gap-3.5">
                                        <img
                                            src={customModelPreview}
                                            alt="Uploaded model preview"
                                            className="h-16 w-14 shrink-0 rounded-xl border border-ink/10 object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-ink">
                                                {customModelFile.name}
                                            </p>
                                            <p className="mt-0.5 text-2xs text-subtle">
                                                {(customModelFile.size / (1024 * 1024)).toFixed(2)} MB • High-res model photo attached
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
                                                setCustomModelFile(null);
                                                setCustomModelPreview(null);
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
                                            <FileUp size={18} />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold text-ink">
                                                Upload Your Model Photo (Optional)
                                            </span>
                                            <span className="block text-2xs text-subtle">
                                                Provide a high-quality full-body image (JPG, PNG, WEBP, TIFF, PSD • Max 25MB)
                                            </span>
                                        </div>
                                    </div>
                                    <span className="hidden shrink-0 rounded-full border border-ink/15 bg-surface px-3 py-1.5 text-2xs font-bold text-ink sm:inline-flex">
                                        Choose File
                                    </span>
                                </button>
                            )}
                        </div>
                    )}

                    {(mode !== 'custom' || showStudioModels) && (
                        <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
                            {twins.map((twin) => {
                                const [shortName] = twin.name.split(' — ');
                                const isSelected =
                                    (activeTwin?.id && activeTwin.id === twin.id) ||
                                    activeTwin?.lookNumber === twin.lookNumber;
                                const isDisabled = mode !== 'custom' && twin.isCopyrightSold;

                                return (
                                    <button
                                        key={twin.id ?? twin.lookNumber}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => handleSelectTwin(twin)}
                                        className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-all ${
                                            isSelected
                                                ? 'border-primary bg-primary/5 ring-2 ring-primary/25'
                                                : isDisabled
                                                  ? 'cursor-not-allowed border-ink/10 opacity-45'
                                                  : 'border-ink/10 bg-surface hover:border-ink/35'
                                        }`}
                                    >
                                        <div
                                            className="relative aspect-[4/5] w-full overflow-hidden"
                                            style={{ background: TWIN_STAGE_BACKGROUND }}
                                        >
                                            <TwinSpriteCrop
                                                twin={twin}
                                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {twin.isCopyrightSold && (
                                                <span className="absolute left-1.5 top-1.5 rounded-full bg-danger px-1.5 py-0.5 text-2xs font-bold uppercase text-white">
                                                    Sold
                                                </span>
                                            )}
                                            {isSelected && (
                                                <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground shadow">
                                                    <Check size={11} strokeWidth={3} />
                                                </span>
                                            )}
                                        </div>
                                        <div className="px-2 py-1.5">
                                            <p className="truncate text-2xs font-bold text-ink">{shortName}</p>
                                            <p className="truncate text-2xs text-subtle">{twin.archetype}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {errors?.digital_twin_id && (
                        <p className="mt-3 text-xs font-semibold text-danger">{errors.digital_twin_id}</p>
                    )}
                </section>

                {/* STEP 2 (ONLY WHEN "Use My Model" IS SELECTED): Model Traits & Measurements */}
                {showTraitsStep && (
                    <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.12)] sm:p-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/10 pb-3.5">
                            <div>
                                <span className="text-2xs font-bold uppercase tracking-[0.2em] text-primary">
                                    Step 02
                                </span>
                                <h2 className="mt-0.5 text-base font-bold text-ink sm:text-lg">
                                    Model Traits &amp; Measurements
                                </h2>
                            </div>
                            <span className="text-2xs text-subtle">
                                Required fields marked with <span className="text-primary">*</span>
                            </span>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {twinAttributes
                                .filter((attr) => attr.inputType !== 'multi_input')
                                .map((attr) => {
                                    const currentVal = attrValues[attr.slug] ?? {};
                                    const activeUnit = currentVal.unit || attr.options[0] || 'ft';
                                    const customOption = attr.customLabel || 'Custom';

                                    return (
                                        <div key={attr.slug}>
                                            <label className="block text-xs font-bold text-ink">
                                                {attr.name}
                                                {attr.isRequired && (
                                                    <span className="ml-1 text-primary">*</span>
                                                )}
                                            </label>

                                            {attr.inputType === 'unit_input' && (
                                                <div className="mt-1.5 flex items-center gap-1.5">
                                                    <input
                                                        type="text"
                                                        value={currentVal.value ?? ''}
                                                        onChange={(e) => {
                                                            if (!currentVal.unit) {
                                                                setUnitChoice(attr.slug, activeUnit);
                                                            }
                                                            setUnitValue(attr.slug, e.target.value);
                                                        }}
                                                        placeholder={
                                                            activeUnit === 'ft'
                                                                ? "e.g. 5' 9\""
                                                                : 'e.g. 69 in'
                                                        }
                                                        className="h-10 min-w-0 flex-1 rounded-xl border border-ink/15 bg-surface-2 px-3 text-xs text-ink placeholder:text-subtle/60 focus:border-primary focus:bg-surface focus:outline-none"
                                                    />
                                                    <div className="inline-flex h-10 shrink-0 items-center rounded-xl border border-ink/15 bg-surface-2 p-0.5">
                                                        {attr.options.map((unitOption) => (
                                                            <button
                                                                key={unitOption}
                                                                type="button"
                                                                onClick={() =>
                                                                    setUnitChoice(attr.slug, unitOption)
                                                                }
                                                                className={`h-full cursor-pointer rounded-lg px-2.5 text-2xs font-bold uppercase transition-all ${
                                                                    activeUnit === unitOption
                                                                        ? 'bg-ink text-white'
                                                                        : 'text-subtle hover:text-ink'
                                                                }`}
                                                            >
                                                                {unitOption}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {attr.inputType === 'select' && (
                                                <div className="mt-1.5 space-y-2">
                                                    <select
                                                        value={currentVal.selected ?? ''}
                                                        onChange={(e) =>
                                                            setSelectOption(attr.slug, e.target.value)
                                                        }
                                                        className="h-10 w-full cursor-pointer rounded-xl border border-ink/15 bg-surface-2 px-3 text-xs font-medium text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                    >
                                                        <option value="">
                                                            Select {attr.name.toLowerCase()}...
                                                        </option>
                                                        {attr.options.map((optionLabel) => (
                                                            <option key={optionLabel} value={optionLabel}>
                                                                {optionLabel}
                                                            </option>
                                                        ))}
                                                        {attr.allowCustom && (
                                                            <option value={customOption}>
                                                                {customOption}
                                                            </option>
                                                        )}
                                                    </select>

                                                    {attr.allowCustom &&
                                                        currentVal.selected === customOption && (
                                                            <input
                                                                type="text"
                                                                value={currentVal.customValue ?? ''}
                                                                onChange={(e) =>
                                                                    setSelectCustomValue(
                                                                        attr.slug,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder={
                                                                    attr.placeholder ||
                                                                    `Enter custom ${attr.name.toLowerCase()}...`
                                                                }
                                                                className="h-9 w-full rounded-xl border border-primary/40 bg-surface-2 px-3 text-xs text-ink placeholder:text-subtle/60 focus:border-primary focus:bg-surface focus:outline-none"
                                                            />
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>

                        {twinAttributes
                            .filter((attr) => attr.inputType === 'multi_input')
                            .map((attr) => {
                                const currentVal = attrValues[attr.slug] ?? {};
                                return (
                                    <div key={attr.slug} className="mt-5 border-t border-ink/10 pt-4">
                                        <label className="block text-xs font-bold text-ink">
                                            {attr.name}
                                            {attr.isRequired && (
                                                <span className="ml-1 text-primary">*</span>
                                            )}
                                        </label>
                                        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                            {attr.options.map((fieldLabel) => (
                                                <div key={fieldLabel}>
                                                    <label className="block text-2xs font-bold uppercase tracking-wider text-subtle">
                                                        {fieldLabel}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={currentVal[fieldLabel] ?? ''}
                                                        onChange={(e) =>
                                                            setMultiFieldValue(
                                                                attr.slug,
                                                                fieldLabel,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={attr.placeholder || 'in / cm'}
                                                        className="mt-1 h-10 w-full rounded-xl border border-ink/15 bg-surface-2 px-3 text-xs text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-surface focus:outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                    </section>
                )}

                {/* STEP 2 or 3: Camera Poses (6 Core + Other Dropdown) & Required Reference Pose Thumbnails */}
                <DigitalTwinPoseReferenceSection
                    stepLabel={showTraitsStep ? 'Step 03' : 'Step 02'}
                    selectedPoses={selectedPoses}
                    onTogglePose={togglePose}
                    onSelectAllDefaultPoses={handleSelectAllDefaultPoses}
                    poseFiles={poseFiles}
                    onSetPoseFile={handleSetPoseFile}
                    onReassignPoseFile={handleReassignPoseFile}
                    onBulkAddFiles={handleBulkAddFiles}
                    isReferenceRequired={mode === 'custom'}
                    referenceError={referenceError || errors?.pose_references || errors?.attachments || null}
                    cloudLink={cloudLink}
                    onCloudLinkChange={setCloudLink}
                    instructions={instructions}
                    onInstructionsChange={setInstructions}
                    sectionRef={poseSectionRef}
                />
            </div>

            {/* Right Column: Sticky Order Summary & Client Details */}
            <div className="lg:col-span-4">
                <div
                    ref={submitCardRef}
                    className={`sticky space-y-6 rounded-3xl border border-ink/10 bg-surface-2 p-6 shadow-[0_14px_38px_-18px_rgba(15,23,42,0.16)] sm:p-7 ${
                        embedded ? 'top-20' : 'top-28'
                    }`}
                >
                    <div>
                        <p className="text-2xs font-bold uppercase tracking-[0.2em] text-primary">
                            Order Summary
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-ink">
                            {mode === 'custom' && 'Custom Brand Digital Twin'}
                            {mode === 'preset' && '6-Pose Preset License'}
                            {mode === 'lifetime' && 'Lifetime Exclusive Copyright'}
                        </h3>
                        <p className="mt-1 text-xs text-subtle">
                            {mode === 'custom' &&
                                'Submit your pose references and specifications to generate your custom Digital Twin.'}
                            {mode === 'preset' &&
                                'Ready-to-shoot 6-pose Digital Twin pack for commercial catalog & lookbook usage.'}
                            {mode === 'lifetime' &&
                                'Full exclusive copyright buyout. Model is immediately retired and marked Sold Out for all other brands.'}
                        </p>
                    </div>

                    {activeTwin ? (
                        <div className="flex items-center gap-3.5 rounded-2xl border border-ink/10 bg-surface p-3">
                            <div
                                className="h-16 w-12 shrink-0 overflow-hidden rounded-xl"
                                style={{ background: TWIN_STAGE_BACKGROUND }}
                            >
                                <TwinSpriteCrop
                                    twin={activeTwin}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-2xs font-bold uppercase tracking-wider text-subtle">
                                    {mode === 'custom' ? 'Reference Model' : 'Licensed Twin'}
                                </p>
                                <p className="truncate text-sm font-bold text-ink">{activeTwin.name}</p>
                                <p className="text-xs text-subtle">
                                    Look {activeTwin.lookNumber} • {activeTwin.archetype}
                                </p>
                            </div>
                        </div>
                    ) : customModelPreview && customModelFile ? (
                        <div className="flex items-center gap-3.5 rounded-2xl border border-ink/10 bg-surface p-3">
                            <img
                                src={customModelPreview}
                                alt="Your uploaded model"
                                className="h-14 w-12 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-2xs font-bold uppercase tracking-wider text-subtle">
                                    Your Uploaded Model
                                </p>
                                <p className="truncate text-xs font-bold text-ink">{customModelFile.name}</p>
                                <p className="text-2xs text-subtle">Custom Digital Twin</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface p-3.5">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <UserPlus size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-ink">Use My Model</p>
                                <p className="text-2xs text-subtle">Built to your uploaded references &amp; traits</p>
                            </div>
                        </div>
                    )}

                    {/* Pose Reference Upload Status Pill */}
                    {mode === 'custom' && (
                        <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-surface px-3.5 py-2.5 text-xs">
                            <span className="font-semibold text-subtle">Pose References</span>
                            <span
                                className={`font-bold ${
                                    uploadedPoseEntries.length > 0 ? 'text-primary' : 'text-danger'
                                }`}
                            >
                                {uploadedPoseEntries.length} / {selectedPoses.length} uploaded
                            </span>
                        </div>
                    )}

                    {mode !== 'custom' ? (
                        <div className="flex items-baseline justify-between rounded-2xl border border-ink/10 bg-surface px-4 py-3">
                            <span className="text-xs font-semibold text-subtle">License Total</span>
                            <span className="font-display text-xl font-bold tracking-[-0.02em] text-ink tabular-nums">
                                {mode === 'preset'
                                    ? (activeTwin?.presetPrice ?? '$149')
                                    : (activeTwin?.lifetimePrice ?? '$490')}
                            </span>
                        </div>
                    ) : (
                        <AiPreviewPanel
                            feature="digital_twin"
                            disabledReason={
                                uploadedPoseEntries.length === 0
                                    ? 'Upload at least 1 reference pose image to preview.'
                                    : null
                            }
                            buildFormData={() => {
                                const fd = new FormData();
                                if (showStudioModels && activeTwin?.id) {
                                    fd.set('digital_twin_id', String(activeTwin.id));
                                }
                                const previewModelFile =
                                    (!showStudioModels && customModelFile) || uploadedPoseEntries[0]?.[1];
                                if (previewModelFile) {
                                    fd.set('model_file', previewModelFile);
                                }
                                if (instructions) {
                                    fd.set('instructions', instructions);
                                }
                                if (showTraitsStep) {
                                    twinAttributes.forEach((attr) => {
                                        const raw = attrValues[attr.slug];
                                        if (!raw) return;
                                        if (attr.inputType === 'unit_input' && raw.value) {
                                            fd.set(`attributes[${attr.name}]`, `${raw.value} ${raw.unit || ''}`.trim());
                                        } else if (attr.inputType === 'select' && raw.selected) {
                                            const val =
                                                raw.selected === attr.customLabel && raw.customValue
                                                    ? `${raw.selected}: ${raw.customValue}`
                                                    : raw.selected;
                                            fd.set(`attributes[${attr.name}]`, val);
                                        } else if (attr.inputType === 'multi_input' && typeof raw === 'object') {
                                            Object.entries(raw).forEach(([k, v]) => {
                                                if (v) fd.set(`attributes[${attr.name}][${k}]`, String(v));
                                            });
                                        }
                                    });
                                }
                                return fd;
                            }}
                        />
                    )}

                    {/* Contact Details */}
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
                            fallbackPath="/digital-twins/order"
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
                              : mode === 'custom'
                                ? 'Submit Order'
                                : mode === 'preset'
                                  ? `Order Pose Preset (${activeTwin?.presetPrice ?? '$149'})`
                                  : `Order Lifetime Copyright (${activeTwin?.lifetimePrice ?? '$490'})`}
                    </button>
                </div>
            </div>
        </form>
    );
}
