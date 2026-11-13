import React, { useMemo, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Crown,
    FileUp,
    Folder,
    Layers,
    Sparkles,
    Trash2,
    UserCheck,
    Wand2,
} from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import {
    DIGITAL_TWINS,
    DigitalTwinAttributeItem,
    DigitalTwinModel,
} from '@/Components/Landing/DigitalTwins/twins';
import { PAD_X } from '@/Components/Landing/shared';
import { LandingLayout } from '@/Layouts/LandingLayout';

const PAGE_BACKGROUND = 'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

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
    },
];

const DEFAULT_POSES = ['Front', 'Side', 'Close-Up', 'Back', 'Detail', 'Stride'];

interface DigitalTwinOrderProps {
    digitalTwins?: DigitalTwinModel[];
    attributes?: DigitalTwinAttributeItem[];
    initialMode?: 'custom' | 'preset' | 'lifetime';
    initialTwinSlug?: string;
    initialReference?: string;
}

export default function DigitalTwinOrder({
    digitalTwins,
    attributes,
    initialMode = 'custom',
    initialTwinSlug = '',
    initialReference = '',
}: DigitalTwinOrderProps) {
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

    const twins = digitalTwins && digitalTwins.length > 0 ? digitalTwins : DIGITAL_TWINS;
    const twinAttributes = attributes && attributes.length > 0 ? attributes : DEFAULT_ATTRIBUTES;

    // Resolve initial selected twin from query params (?twin=slug or ?ref=Name)
    const initialTwin = useMemo(() => {
        const needle = (initialTwinSlug || initialReference).trim().toLowerCase();
        if (!needle) {
            return initialMode === 'custom' ? null : twins.find((t) => !t.isCopyrightSold) ?? twins[0] ?? null;
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

    const [mode, setMode] = useState<'custom' | 'preset' | 'lifetime'>(initialMode);
    const [selectedTwinId, setSelectedTwinId] = useState<number | null>(initialTwin?.id ?? null);
    const [selectedTwinIndex, setSelectedTwinIndex] = useState<number | null>(initialTwin ? initialTwin.index : null);

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

    // Dynamic attribute states keyed by attribute.slug
    const [attrValues, setAttrValues] = useState<Record<string, any>>({});
    const [selectedPoses, setSelectedPoses] = useState<string[]>(DEFAULT_POSES);

    // Client & submission fields (pre-filled from authenticated client account)
    const [name, setName] = useState(auth?.user?.name || '');
    const [email, setEmail] = useState(auth?.user?.email || '');
    const [company, setCompany] = useState(auth?.user?.company || '');
    const [phone, setPhone] = useState(auth?.user?.phone || '');
    const [cloudLink, setCloudLink] = useState('');
    const [instructions, setInstructions] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        setSelectedPoses((prev) =>
            prev.includes(pose) ? (prev.length > 1 ? prev.filter((p) => p !== pose) : prev) : [...prev, pose]
        );
    };

    // Helpers for the 3 dynamic attribute types
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

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const nextFiles = Array.from(e.target.files);
        setAttachments((prev) => [...prev, ...nextFiles]);
    };

    const removeAttachment = (idx: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Normalize attributes payload for clean storage in specifications
        const formattedAttributes: Record<string, any> = {};
        if (mode === 'custom') {
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

        router.post(
            '/digital-twins/order',
            {
                mode,
                digital_twin_id: activeTwin?.id ?? null,
                reference_twin_name: activeTwin ? activeTwin.name : 'Build from scratch',
                name,
                email,
                company,
                phone,
                attributes: formattedAttributes,
                selected_poses: selectedPoses,
                cloud_link: cloudLink,
                instructions,
                attachments,
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
                title="Order Digital Twin — Custom AI Model Configurator & Licensing"
                description="Configure a bespoke AI Digital Twin for your fashion brand or license a ready-to-shoot 6-pose preset."
            />

            {/* Header Hero */}
            <section style={{ background: PAGE_BACKGROUND }} className={`pb-12 pt-28 sm:pt-32 ${PAD_X}`}>
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Link
                            href="/digital-twins"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-subtle transition-colors hover:text-ink"
                        >
                            <ArrowLeft size={14} />
                            Back to Digital Twins Catalog
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
                                Studio Twin Studio // Bespoke & Preset Licensing
                            </p>
                            <h1 className="mt-2 font-michroma text-[clamp(24px,3.2vw,44px)] font-normal leading-[1.15] tracking-[0.08em] text-ink">
                                Digital Twin Studio Order
                            </h1>
                            <p className="mt-3 max-w-[60ch] text-sm leading-[1.65] text-subtle sm:text-base">
                                Configure your own custom AI brand model with exact body &amp; facial measurements, or license an existing Digital Twin from our studio roster.
                            </p>
                        </div>

                        {/* Mode Selector Tabs */}
                        <div
                            role="tablist"
                            aria-label="Digital Twin Order Type"
                            className="inline-flex flex-wrap gap-2 rounded-2xl border border-ink/10 bg-white/90 p-1.5 shadow-sm"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={mode === 'custom'}
                                onClick={() => setMode('custom')}
                                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                                    mode === 'custom'
                                        ? 'bg-ink text-white shadow-sm'
                                        : 'text-subtle hover:bg-ink/5 hover:text-ink'
                                }`}
                            >
                                <Wand2 size={14} />
                                Custom Brand Twin (Quote)
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={mode === 'preset'}
                                onClick={() => {
                                    setMode('preset');
                                    if (!activeTwin || activeTwin.isCopyrightSold) {
                                        const firstAvailable = twins.find((t) => !t.isCopyrightSold) ?? twins[0];
                                        if (firstAvailable) handleSelectTwin(firstAvailable);
                                    }
                                }}
                                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                                    mode === 'preset'
                                        ? 'bg-ink text-white shadow-sm'
                                        : 'text-subtle hover:bg-ink/5 hover:text-ink'
                                }`}
                            >
                                <Layers size={14} />
                                Buy Pose Preset ({activeTwin?.presetPrice ?? '$149'})
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={mode === 'lifetime'}
                                onClick={() => {
                                    setMode('lifetime');
                                    if (!activeTwin || activeTwin.isCopyrightSold) {
                                        const firstAvailable = twins.find((t) => !t.isCopyrightSold) ?? twins[0];
                                        if (firstAvailable) handleSelectTwin(firstAvailable);
                                    }
                                }}
                                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                                    mode === 'lifetime'
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-subtle hover:bg-ink/5 hover:text-ink'
                                }`}
                            >
                                <Crown size={14} />
                                Lifetime Copyright ({activeTwin?.lifetimePrice ?? '$490'})
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className={`py-10 sm:py-14 ${PAD_X}`}>
                <div className="mx-auto max-w-7xl">
                    {flash?.success && (
                        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/90 p-5 text-emerald-950 shadow-sm">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                            <div>
                                <h3 className="text-sm font-bold">Request Submitted Successfully</h3>
                                <p className="mt-1 text-xs leading-relaxed text-emerald-800">{flash.success}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* Left Column: Configurator Steps */}
                        <div className="space-y-10 lg:col-span-8">
                            {/* STEP 1: Select Reference Model or Preset Model */}
                            <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_12px_34px_-18px_rgba(15,23,42,0.12)] sm:p-8">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                                            Step 01
                                        </span>
                                        <h2 className="mt-1 text-lg font-bold text-ink sm:text-xl">
                                            {mode === 'custom'
                                                ? 'Choose a Base Inspiration Twin (or Build from Scratch)'
                                                : 'Select Digital Twin Model'}
                                        </h2>
                                    </div>
                                    {activeTwin && (
                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                            Selected: {activeTwin.name.split(' — ')[0]}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1.5 text-xs text-subtle sm:text-sm">
                                    {mode === 'custom'
                                        ? 'Pick any existing model below as a visual starting reference, or select "Build from Scratch" to create a 100% new identity.'
                                        : 'Click the Digital Twin below that you want to license.'}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
                                    {mode === 'custom' && (
                                        <button
                                            type="button"
                                            onClick={() => handleSelectTwin(null)}
                                            className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                                                activeTwin === null
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                                                    : 'border-ink/15 bg-[#f8fafc] hover:border-ink/40'
                                            }`}
                                        >
                                            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                                                <Sparkles size={20} />
                                            </div>
                                            <span className="mt-2.5 text-xs font-bold text-ink">Build from Scratch</span>
                                            <span className="mt-0.5 text-[10px] text-subtle">100% Custom Spec</span>
                                        </button>
                                    )}

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
                                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                                                        : isDisabled
                                                          ? 'cursor-not-allowed border-ink/10 opacity-45'
                                                          : 'border-ink/10 bg-white hover:border-ink/35'
                                                }`}
                                            >
                                                <div
                                                    className="relative aspect-[3/4] w-full overflow-hidden"
                                                    style={{ background: PAGE_BACKGROUND }}
                                                >
                                                    <TwinSpriteCrop
                                                        twin={twin}
                                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    {twin.isCopyrightSold && (
                                                        <span className="absolute left-1.5 top-1.5 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                                                            Sold
                                                        </span>
                                                    )}
                                                    {isSelected && (
                                                        <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-white shadow">
                                                            <Check size={12} strokeWidth={3} />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-2">
                                                    <p className="truncate text-xs font-bold text-ink">{shortName}</p>
                                                    <p className="truncate text-[10px] text-subtle">{twin.archetype}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {errors?.digital_twin_id && (
                                    <p className="mt-3 text-xs font-semibold text-red-600">{errors.digital_twin_id}</p>
                                )}
                            </section>

                            {/* STEP 2 (CUSTOM MODE): 7 Dynamic Physical & Facial Attributes */}
                            {mode === 'custom' && (
                                <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_12px_34px_-18px_rgba(15,23,42,0.12)] sm:p-8">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                                            Step 02
                                        </span>
                                        <h2 className="mt-1 text-lg font-bold text-ink sm:text-xl">
                                            Physical &amp; Facial Attributes Specification
                                        </h2>
                                        <p className="mt-1 text-xs text-subtle sm:text-sm">
                                            Select your Digital Twin’s exact anatomical traits, skin tone, and measurements below.
                                        </p>
                                    </div>

                                    <div className="mt-6 space-y-6 divide-y divide-ink/10">
                                        {twinAttributes.map((attr, idx) => {
                                            const currentVal = attrValues[attr.slug] ?? {};

                                            return (
                                                <div key={attr.slug} className={idx > 0 ? 'pt-6' : ''}>
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-bold text-ink">
                                                            {idx + 1}. {attr.name}
                                                            {attr.isRequired && (
                                                                <span className="ml-1 text-primary">*</span>
                                                            )}
                                                        </label>
                                                    </div>

                                                    {/* 1. unit_input (e.g. Height: check ft or in first, then show input) */}
                                                    {attr.inputType === 'unit_input' && (
                                                        <div className="mt-3 space-y-3">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="text-xs text-subtle">
                                                                    Select unit first:
                                                                </span>
                                                                {attr.options.map((unitOption) => {
                                                                    const isUnitSelected =
                                                                        currentVal.unit === unitOption;
                                                                    return (
                                                                        <button
                                                                            key={unitOption}
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setUnitChoice(attr.slug, unitOption)
                                                                            }
                                                                            className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold uppercase transition-all ${
                                                                                isUnitSelected
                                                                                    ? 'border-ink bg-ink text-white'
                                                                                    : 'border-ink/20 bg-white text-ink hover:border-primary'
                                                                            }`}
                                                                        >
                                                                            {unitOption}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>

                                                            {currentVal.unit && (
                                                                <div className="flex max-w-sm items-center gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={currentVal.value ?? ''}
                                                                        onChange={(e) =>
                                                                            setUnitValue(attr.slug, e.target.value)
                                                                        }
                                                                        placeholder={
                                                                            currentVal.unit === 'ft'
                                                                                ? "e.g. 5' 9\""
                                                                                : 'e.g. 69 in'
                                                                        }
                                                                        className="w-full rounded-xl border border-ink/20 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle/60 focus:border-primary focus:bg-white focus:outline-none"
                                                                    />
                                                                    <span className="rounded-xl bg-ink/5 px-3 py-2.5 text-xs font-bold uppercase text-ink">
                                                                        {currentVal.unit}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* 2. select (e.g. Body Structure, Skin Tone, Forehead, Eye Shapes, Lip) */}
                                                    {attr.inputType === 'select' && (
                                                        <div className="mt-3 space-y-3">
                                                            <div className="flex flex-wrap gap-2">
                                                                {[
                                                                    ...attr.options,
                                                                    ...(attr.allowCustom
                                                                        ? [attr.customLabel || 'Custom']
                                                                        : []),
                                                                ].map((optionLabel) => {
                                                                    const isPicked =
                                                                        currentVal.selected === optionLabel;
                                                                    return (
                                                                        <button
                                                                            key={optionLabel}
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setSelectOption(attr.slug, optionLabel)
                                                                            }
                                                                            className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                                                                                isPicked
                                                                                    ? 'border-primary bg-primary text-white shadow-sm'
                                                                                    : 'border-ink/15 bg-[#f8fafc] text-ink hover:border-ink/40'
                                                                            }`}
                                                                        >
                                                                            {optionLabel}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>

                                                            {attr.allowCustom &&
                                                                currentVal.selected ===
                                                                    (attr.customLabel || 'Custom') && (
                                                                    <div className="max-w-md">
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
                                                                                `Enter your custom ${attr.name.toLowerCase()}...`
                                                                            }
                                                                            className="w-full rounded-xl border border-primary/50 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle/60 focus:border-primary focus:bg-white focus:outline-none"
                                                                        />
                                                                    </div>
                                                                )}
                                                        </div>
                                                    )}

                                                    {/* 3. multi_input (e.g. Body Measurement: Shoulder, Chest, Hip) */}
                                                    {attr.inputType === 'multi_input' && (
                                                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                            {attr.options.map((fieldLabel) => (
                                                                <div
                                                                    key={fieldLabel}
                                                                    className="rounded-2xl border border-ink/15 bg-[#f8fafc] p-3"
                                                                >
                                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-subtle">
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
                                                                        placeholder={
                                                                            attr.placeholder || `Enter ${fieldLabel}`
                                                                        }
                                                                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:outline-none"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* STEP 3: Pose Pack & Reference Moodboard Uploads */}
                            <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_12px_34px_-18px_rgba(15,23,42,0.12)] sm:p-8">
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                                    {mode === 'custom' ? 'Step 03' : 'Step 02'}
                                </span>
                                <h2 className="mt-1 text-lg font-bold text-ink sm:text-xl">
                                    Pose Angles &amp; Reference Assets
                                </h2>
                                <p className="mt-1 text-xs text-subtle sm:text-sm">
                                    Select the camera angles required for your production pack and attach any moodboards or reference photos.
                                </p>

                                <div className="mt-4">
                                    <label className="text-xs font-bold uppercase tracking-wider text-subtle">
                                        Included Camera Poses
                                    </label>
                                    <div className="mt-2.5 flex flex-wrap gap-2">
                                        {DEFAULT_POSES.map((pose) => {
                                            const active = selectedPoses.includes(pose);
                                            return (
                                                <button
                                                    key={pose}
                                                    type="button"
                                                    onClick={() => togglePose(pose)}
                                                    className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                                                        active
                                                            ? 'border-ink bg-ink text-white'
                                                            : 'border-ink/15 bg-white text-subtle hover:border-ink/40'
                                                    }`}
                                                >
                                                    {pose}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Reference Image Upload */}
                                <div className="mt-6">
                                    <label className="text-xs font-bold uppercase tracking-wider text-subtle">
                                        Reference Photos / Casting Moodboard (Optional)
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept=".jpg,.jpeg,.png,.webp,.pdf,.zip"
                                        onChange={handleFilesChange}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-2 flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 bg-[#f8fafc] p-6 text-center transition-colors hover:border-primary hover:bg-primary/5"
                                    >
                                        <FileUp className="h-6 w-6 text-primary" />
                                        <span className="mt-2 text-xs font-bold text-ink">
                                            Click to upload reference images, sketches, or lookbooks
                                        </span>
                                        <span className="mt-0.5 text-[11px] text-subtle">
                                            JPG, PNG, WEBP, PDF or ZIP (up to 25MB per file)
                                        </span>
                                    </button>

                                    {attachments.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {attachments.map((file, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between rounded-xl border border-ink/10 bg-[#f8fafc] px-3.5 py-2 text-xs"
                                                >
                                                    <span className="truncate font-medium text-ink">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(idx)}
                                                        className="cursor-pointer text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-subtle">
                                            <Folder size={13} />
                                            Google Drive / WeTransfer / Cloud Link (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={cloudLink}
                                            onChange={(e) => setCloudLink(e.target.value)}
                                            placeholder="https://drive.google.com/..."
                                            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-white focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-subtle">
                                            Additional Styling / Brand Direction Notes
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            placeholder="Describe hair texture, makeup aesthetic, lighting mood, or campaign usage..."
                                            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] p-3.5 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Sticky Order Summary & Client Details */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-28 space-y-6 rounded-3xl border border-ink/10 bg-[#f8fafc] p-6 shadow-[0_14px_38px_-18px_rgba(15,23,42,0.16)] sm:p-7">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                        Order Summary
                                    </p>
                                    <h3 className="mt-1 text-lg font-bold text-ink">
                                        {mode === 'custom' && 'Custom Brand Digital Twin'}
                                        {mode === 'preset' && '6-Pose Preset License'}
                                        {mode === 'lifetime' && 'Lifetime Exclusive Copyright'}
                                    </h3>
                                    <p className="mt-1 text-xs text-subtle">
                                        {mode === 'custom' &&
                                            'Custom Quote — Our producers will evaluate your specification and send a tailored studio quote.'}
                                        {mode === 'preset' &&
                                            'Ready-to-shoot 6-pose Digital Twin pack for commercial catalog & lookbook usage.'}
                                        {mode === 'lifetime' &&
                                            'Full exclusive copyright buyout. Model is immediately retired and marked Sold Out for all other brands.'}
                                    </p>
                                </div>

                                {/* Selected Model Preview Box */}
                                {activeTwin ? (
                                    <div className="flex items-center gap-3.5 rounded-2xl border border-ink/10 bg-white p-3">
                                        <div
                                            className="h-16 w-12 shrink-0 overflow-hidden rounded-xl"
                                            style={{ background: PAGE_BACKGROUND }}
                                        >
                                            <TwinSpriteCrop
                                                twin={activeTwin}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-subtle">
                                                {mode === 'custom' ? 'Reference Model' : 'Licensed Twin'}
                                            </p>
                                            <p className="truncate text-sm font-bold text-ink">{activeTwin.name}</p>
                                            <p className="text-xs text-subtle">
                                                Look {activeTwin.lookNumber} • {activeTwin.archetype}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-3.5">
                                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                            <UserCheck size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-ink">100% Bespoke Identity</p>
                                            <p className="text-[11px] text-subtle">Built from scratch to your traits</p>
                                        </div>
                                    </div>
                                )}

                                {/* Pricing Indicator (Hidden for Custom Mode per User Requirement) */}
                                {mode !== 'custom' ? (
                                    <div className="flex items-baseline justify-between rounded-2xl border border-ink/10 bg-white px-4 py-3">
                                        <span className="text-xs font-semibold text-subtle">License Total</span>
                                        <span className="font-michroma text-xl font-normal text-ink">
                                            {mode === 'preset'
                                                ? (activeTwin?.presetPrice ?? '$149')
                                                : (activeTwin?.lifetimePrice ?? '$490')}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs font-semibold text-primary">
                                        Custom Studio Quote — Priced to your specification
                                    </div>
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
                                    {isSubmitting
                                        ? 'Submitting Order...'
                                        : mode === 'custom'
                                          ? 'Request Custom Twin Quote'
                                          : mode === 'preset'
                                            ? `Order Pose Preset (${activeTwin?.presetPrice ?? '$149'})`
                                            : `Order Lifetime Copyright (${activeTwin?.lifetimePrice ?? '$490'})`}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

DigitalTwinOrder.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;

