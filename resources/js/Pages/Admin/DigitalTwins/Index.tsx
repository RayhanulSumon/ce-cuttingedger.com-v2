import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { AdminLayout } from '@/Layouts/Admin/AdminLayout';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/Components/ui/dialog';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import {
    DigitalTwinAttributeItem,
    DigitalTwinModel,
    TwinPosePreset,
} from '@/Components/Landing/DigitalTwins/twins';
import {
    Clock,
    Edit3,
    Plus,
    Settings2,
    Trash2,
    Users,
} from 'lucide-react';

interface AdminDigitalTwinItem extends DigitalTwinModel {
    isFeaturedOnHome?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}

interface PageProps {
    twins: AdminDigitalTwinItem[];
    attributes: DigitalTwinAttributeItem[];
    defaultPoses: TwinPosePreset[];
}

const LABEL_CLASS = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500';
const INPUT_CLASS =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15';
const FILE_INPUT_CLASS =
    'block w-full text-xs text-slate-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-3.5 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-primary-hover';

function checkIsUpcoming(twin: Pick<DigitalTwinModel, 'archetype' | 'presetPrice' | 'isUpcoming'>): boolean {
    return (
        Boolean(twin.isUpcoming) ||
        twin.archetype.trim().toLowerCase() === 'upcoming' ||
        twin.presetPrice.trim().toLowerCase() === 'upcoming'
    );
}

export default function AdminDigitalTwinsIndex({
    twins = [],
    attributes = [],
    defaultPoses = [],
}: PageProps) {
    const [activeTab, setActiveTab] = useState<'models' | 'attributes'>('models');

    // Digital Twin Create/Edit Dialog State
    const [isTwinDialogOpen, setIsTwinDialogOpen] = useState(false);
    const [editingTwin, setEditingTwin] = useState<AdminDigitalTwinItem | null>(null);
    const [isSavingTwin, setIsSavingTwin] = useState(false);

    const [isUpcomingModel, setIsUpcomingModel] = useState(false);
    const [name, setName] = useState('');
    const [lookNumber, setLookNumber] = useState(1);
    const [archetype, setArchetype] = useState('Female');
    const [collection, setCollection] = useState('Spring Summer 2027');
    const [description, setDescription] = useState('');
    const [presetPrice, setPresetPrice] = useState('$149');
    const [customOrderPrice, setCustomOrderPrice] = useState('$290');
    const [lifetimePrice, setLifetimePrice] = useState('$490');
    const [downloadCount, setDownloadCount] = useState(0);
    const [listedAt, setListedAt] = useState('2026-01-15');
    const [sortOrder, setSortOrder] = useState(1);
    const [isFeaturedOnHome, setIsFeaturedOnHome] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [isCopyrightSold, setIsCopyrightSold] = useState(false);
    const [modelImageFile, setModelImageFile] = useState<File | null>(null);
    const [poses, setPoses] = useState<TwinPosePreset[]>(defaultPoses);
    const [poseFiles, setPoseFiles] = useState<Record<number, File | null>>({});

    // Attribute Create/Edit Dialog State
    const [isAttrDialogOpen, setIsAttrDialogOpen] = useState(false);
    const [editingAttr, setEditingAttr] = useState<DigitalTwinAttributeItem | null>(null);
    const [isSavingAttr, setIsSavingAttr] = useState(false);

    const [attrName, setAttrName] = useState('');
    const [attrInputType, setAttrInputType] = useState<'unit_input' | 'select' | 'multi_input'>('select');
    const [attrOptionsText, setAttrOptionsText] = useState('');
    const [attrAllowCustom, setAttrAllowCustom] = useState(true);
    const [attrCustomLabel, setAttrCustomLabel] = useState('Custom');
    const [attrPlaceholder, setAttrPlaceholder] = useState('');
    const [attrIsRequired, setAttrIsRequired] = useState(true);
    const [attrIsActive, setAttrIsActive] = useState(true);
    const [attrSortOrder, setAttrSortOrder] = useState(1);

    const openCreateTwin = () => {
        setEditingTwin(null);
        setIsUpcomingModel(false);
        setName('');
        setLookNumber(twins.length + 1);
        setArchetype('Female');
        setCollection('Spring Summer 2027');
        setDescription('');
        setPresetPrice('$149');
        setCustomOrderPrice('$290');
        setLifetimePrice('$490');
        setDownloadCount(0);
        setListedAt(new Date().toISOString().slice(0, 10));
        setSortOrder(twins.length + 1);
        setIsFeaturedOnHome(false);
        setIsActive(true);
        setIsCopyrightSold(false);
        setModelImageFile(null);
        setPoses(defaultPoses.map((p) => ({ ...p })));
        setPoseFiles({});
        setIsTwinDialogOpen(true);
    };

    const openEditTwin = (twin: AdminDigitalTwinItem) => {
        const upcoming = checkIsUpcoming(twin);
        setEditingTwin(twin);
        setIsUpcomingModel(upcoming);
        setName(twin.name);
        setLookNumber(twin.lookNumber);
        setArchetype(twin.archetype || (upcoming ? 'Upcoming' : 'Female'));
        setCollection(twin.collection || 'Spring Summer 2027');
        setDescription(twin.description);
        setPresetPrice(twin.presetPrice);
        setCustomOrderPrice(twin.customOrderPrice);
        setLifetimePrice(twin.lifetimePrice);
        setDownloadCount(twin.downloadCount);
        setListedAt(twin.listedAt);
        setSortOrder(twin.sortOrder ?? twin.lookNumber);
        setIsFeaturedOnHome(upcoming ? false : (twin.isFeaturedOnHome ?? true));
        setIsActive(twin.isActive ?? true);
        setIsCopyrightSold(upcoming ? false : twin.isCopyrightSold);
        setModelImageFile(null);
        setPoses((twin.poses && twin.poses.length > 0 ? twin.poses : defaultPoses).map((p) => ({ ...p })));
        setPoseFiles({});
        setIsTwinDialogOpen(true);
    };

    const handleUpcomingToggle = (checked: boolean) => {
        setIsUpcomingModel(checked);

        if (checked) {
            setArchetype('Upcoming');
            setPresetPrice('Upcoming');
            setIsFeaturedOnHome(false);
            setIsCopyrightSold(false);
            return;
        }

        if (archetype.trim().toLowerCase() === 'upcoming') {
            setArchetype('Female');
        }
        if (presetPrice.trim().toLowerCase() === 'upcoming') {
            setPresetPrice('$149');
        }
    };

    const handlePoseTitleChange = (idx: number, field: keyof TwinPosePreset, val: string) => {
        setPoses((prev) =>
            prev.map((pose, i) => (i === idx ? { ...pose, [field]: val } : pose)),
        );
    };

    const handleSaveTwin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingTwin(true);

        const url = editingTwin?.id
            ? `/admin/digital-twins/${editingTwin.id}`
            : '/admin/digital-twins';

        const payload = isUpcomingModel
            ? {
                  name,
                  look_number: lookNumber,
                  archetype: 'Upcoming',
                  collection: 'Upcoming Drop · Preview',
                  description: description.trim() || 'Upcoming digital twin model preview.',
                  preset_price: 'Upcoming',
                  custom_order_price: customOrderPrice || '$290',
                  lifetime_price: lifetimePrice || '$490',
                  download_count: 0,
                  listed_at: listedAt,
                  sort_order: sortOrder,
                  is_featured_on_home: false,
                  is_active: isActive,
                  is_copyright_sold: false,
                  model_image: modelImageFile,
                  poses: defaultPoses as any,
              }
            : {
                  name,
                  look_number: lookNumber,
                  archetype,
                  collection,
                  description,
                  preset_price: presetPrice,
                  custom_order_price: customOrderPrice,
                  lifetime_price: lifetimePrice,
                  download_count: downloadCount,
                  listed_at: listedAt,
                  sort_order: sortOrder,
                  is_featured_on_home: isFeaturedOnHome,
                  is_active: isActive,
                  is_copyright_sold: isCopyrightSold,
                  model_image: modelImageFile,
                  poses: poses as any,
                  pose_images: poseFiles as any,
              };

        router.post(url, payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setIsTwinDialogOpen(false),
            onFinish: () => setIsSavingTwin(false),
        });
    };

    const handleToggleSoldOut = (twin: AdminDigitalTwinItem) => {
        if (!twin.id) return;
        router.post(`/admin/digital-twins/${twin.id}/toggle-sold-out`, {}, { preserveScroll: true });
    };

    const handleDeleteTwin = (twin: AdminDigitalTwinItem) => {
        if (!twin.id) return;
        if (!window.confirm(`Delete Digital Twin "${twin.name}"?`)) return;
        router.delete(`/admin/digital-twins/${twin.id}`, { preserveScroll: true });
    };

    // Attribute Handlers
    const openCreateAttribute = () => {
        setEditingAttr(null);
        setAttrName('');
        setAttrInputType('select');
        setAttrOptionsText('Option 1, Option 2, Option 3');
        setAttrAllowCustom(true);
        setAttrCustomLabel('Custom');
        setAttrPlaceholder('Enter custom value...');
        setAttrIsRequired(true);
        setAttrIsActive(true);
        setAttrSortOrder(attributes.length + 1);
        setIsAttrDialogOpen(true);
    };

    const openEditAttribute = (attr: DigitalTwinAttributeItem) => {
        setEditingAttr(attr);
        setAttrName(attr.name);
        setAttrInputType(attr.inputType);
        setAttrOptionsText(attr.options.join(', '));
        setAttrAllowCustom(attr.allowCustom);
        setAttrCustomLabel(attr.customLabel || 'Custom');
        setAttrPlaceholder(attr.placeholder || '');
        setAttrIsRequired(attr.isRequired ?? true);
        setAttrIsActive(attr.isActive ?? true);
        setAttrSortOrder(attr.sortOrder ?? 1);
        setIsAttrDialogOpen(true);
    };

    const handleSaveAttribute = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingAttr(true);

        const parsedOptions = attrOptionsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const url = editingAttr?.id
            ? `/admin/digital-twins/attributes/${editingAttr.id}`
            : '/admin/digital-twins/attributes';

        router.post(
            url,
            {
                name: attrName,
                input_type: attrInputType,
                options: parsedOptions,
                allow_custom: attrAllowCustom,
                custom_label: attrCustomLabel,
                placeholder: attrPlaceholder,
                is_required: attrIsRequired,
                is_active: attrIsActive,
                sort_order: attrSortOrder,
            },
            {
                preserveScroll: true,
                onSuccess: () => setIsAttrDialogOpen(false),
                onFinish: () => setIsSavingAttr(false),
            },
        );
    };

    const handleDeleteAttribute = (attr: DigitalTwinAttributeItem) => {
        if (!attr.id) return;
        if (!window.confirm(`Delete configurator attribute "${attr.name}"?`)) return;
        router.delete(`/admin/digital-twins/attributes/${attr.id}`, { preserveScroll: true });
    };

    const featuredCount = twins.filter((t) => t.isFeaturedOnHome).length;
    const soldOutCount = twins.filter((t) => t.isCopyrightSold).length;

    return (
        <AdminLayout title="Digital Twins Studio">
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <AdminPageHeader
                        title="Digital Twins & Custom Configurator"
                        description="Manage homepage & catalog AI Digital Twins, 6-pose presets, sold-out copyright locks, and custom order attributes."
                    />

                    <div className="flex shrink-0 items-center gap-2">
                        {activeTab === 'models' ? (
                            <Button
                                onClick={openCreateTwin}
                                className="cursor-pointer bg-primary font-semibold text-white shadow-xs hover:bg-primary-hover"
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Digital Twin
                            </Button>
                        ) : (
                            <Button
                                onClick={openCreateAttribute}
                                className="cursor-pointer bg-primary font-semibold text-white shadow-xs hover:bg-primary-hover"
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Configurator Attribute
                            </Button>
                        )}
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Total Digital Twins
                        </span>
                        <span className="mt-1 block text-2xl font-bold text-ink">{twins.length}</span>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                            Homepage Runway Active
                        </span>
                        <span className="mt-1 block text-2xl font-bold text-emerald-600">{featuredCount}</span>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-rose-700">
                            Sold Out Copyrights
                        </span>
                        <span className="mt-1 block text-2xl font-bold text-rose-600">{soldOutCount}</span>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                            Custom Order Attributes
                        </span>
                        <span className="mt-1 block text-2xl font-bold text-sky-600">{attributes.length}</span>
                    </div>
                </div>

                {/* Section Switcher Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <button
                        type="button"
                        onClick={() => setActiveTab('models')}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                            activeTab === 'models'
                                ? 'bg-primary text-white shadow-xs'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-ink'
                        }`}
                    >
                        <Users className="h-3.5 w-3.5" />
                        Digital Twin Models ({twins.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('attributes')}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                            activeTab === 'attributes'
                                ? 'bg-primary text-white shadow-xs'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-ink'
                        }`}
                    >
                        <Settings2 className="h-3.5 w-3.5" />
                        Custom Order Attributes ({attributes.length})
                    </button>
                </div>

                {/* TAB 1: DIGITAL TWIN MODELS */}
                {activeTab === 'models' && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {twins.map((twin) => {
                            const upcoming = checkIsUpcoming(twin);

                            return (
                                <div
                                    key={twin.id ?? twin.lookNumber}
                                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-md"
                                >
                                    <div className="flex gap-4">
                                        <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#e8eff7]">
                                            <TwinSpriteCrop
                                                twin={twin}
                                                className="h-full w-full object-contain"
                                            />
                                            <span className="absolute left-1.5 top-1.5 rounded bg-ink/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                                LOOK {String(twin.lookNumber).padStart(2, '0')}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {upcoming ? (
                                                    <Badge className="border-slate-300 bg-slate-100 text-[10px] text-slate-700">
                                                        UPCOMING
                                                    </Badge>
                                                ) : twin.isCopyrightSold ? (
                                                    <Badge variant="destructive" className="text-[10px]">
                                                        SOLD OUT
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="success" className="text-[10px]">
                                                        AVAILABLE
                                                    </Badge>
                                                )}
                                                {twin.isFeaturedOnHome && !upcoming && (
                                                    <Badge className="border-sky-200 bg-sky-50 text-[10px] text-sky-700">
                                                        HOMEPAGE
                                                    </Badge>
                                                )}
                                            </div>

                                            <h3 className="truncate text-base font-bold text-ink">{twin.name}</h3>
                                            <p className="text-xs font-medium text-slate-500">{twin.archetype}</p>
                                            <p className="line-clamp-2 text-xs text-slate-600">{twin.description}</p>

                                            {!upcoming && (
                                                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                                                    <span className="text-slate-600">
                                                        Preset: <strong className="text-primary">{twin.presetPrice}</strong>
                                                    </span>
                                                    <span className="text-slate-600">
                                                        Lifetime: <strong className="text-sky-700">{twin.lifetimePrice}</strong>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                        {upcoming ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                                <Clock className="h-3 w-3" />
                                                Preview Only
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleToggleSoldOut(twin)}
                                                className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                                                    twin.isCopyrightSold
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                        : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                }`}
                                            >
                                                {twin.isCopyrightSold ? 'Mark Available' : 'Mark Sold Out'}
                                            </button>
                                        )}

                                        <div className="flex items-center gap-1.5">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEditTwin(twin)}
                                                className="h-8 cursor-pointer border-slate-200 bg-white text-xs text-ink hover:bg-slate-50"
                                            >
                                                <Edit3 className="mr-1 h-3.5 w-3.5 text-primary" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeleteTwin(twin)}
                                                className="h-8 w-8 cursor-pointer p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* TAB 2: CUSTOM ORDER CONFIGURATOR ATTRIBUTES */}
                {activeTab === 'attributes' && (
                    <div className="space-y-3">
                        {attributes.map((attr, idx) => (
                            <div
                                key={attr.id ?? attr.slug}
                                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold text-primary">
                                            #{idx + 1}
                                        </span>
                                        <h3 className="text-sm font-bold text-ink">{attr.name}</h3>
                                        <Badge variant="secondary" className="text-[10px]">
                                            {attr.inputType === 'unit_input' && 'Unit Selector + Input (ft/in)'}
                                            {attr.inputType === 'select' && 'Option Chips'}
                                            {attr.inputType === 'multi_input' && 'Multi-Input Boxes'}
                                        </Badge>
                                        {attr.allowCustom && (
                                            <Badge className="border-sky-200 bg-sky-50 text-[10px] text-sky-700">
                                                +{attr.customLabel} Text Input
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {attr.options.map((opt) => (
                                            <span
                                                key={opt}
                                                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-700"
                                            >
                                                {opt}
                                            </span>
                                        ))}
                                        {attr.allowCustom && (
                                            <span className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                {attr.customLabel} (opens input)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditAttribute(attr)}
                                        className="h-8 cursor-pointer border-slate-200 bg-white text-xs text-ink hover:bg-slate-50"
                                    >
                                        <Edit3 className="mr-1 h-3.5 w-3.5 text-primary" />
                                        Edit Options
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteAttribute(attr)}
                                        className="h-8 w-8 cursor-pointer p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DIALOG 1: CREATE / EDIT DIGITAL TWIN MODEL */}
            <Dialog open={isTwinDialogOpen} onOpenChange={setIsTwinDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTwin ? `Edit Digital Twin — ${editingTwin.name}` : 'Create New Digital Twin'}
                        </DialogTitle>
                        <DialogDescription>
                            Uploaded model images are automatically converted to alpha-preserving 800w &amp; 1600w WebP for instant runway loading.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveTwin} className="space-y-4 pt-1 text-xs">
                        {/* Upcoming Model Simplification Toggle */}
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-colors hover:border-primary/40">
                            <input
                                type="checkbox"
                                checked={isUpcomingModel}
                                onChange={(e) => handleUpcomingToggle(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary accent-[var(--color-primary)]"
                            />
                            <div className="space-y-0.5">
                                <span className="block text-sm font-semibold text-ink">
                                    Upcoming Model (Simplified Upload)
                                </span>
                                <span className="block text-xs text-slate-500">
                                    {isUpcomingModel
                                        ? 'Only name, look number, and model image are needed. Uncheck to configure category, pricing, description, and all 6 pose presets.'
                                        : 'Check this to quickly upload an upcoming preview model without filling out pricing or pose details.'}
                                </span>
                            </div>
                        </label>

                        {/* Core Identity Fields (always shown) */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label className={LABEL_CLASS}>
                                    Model Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={isUpcomingModel ? 'e.g. Upcoming Model' : 'e.g. Laura'}
                                    className={INPUT_CLASS}
                                />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>
                                    Look Number *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    value={lookNumber}
                                    onChange={(e) => setLookNumber(Number(e.target.value))}
                                    className={INPUT_CLASS}
                                />
                            </div>
                        </div>

                        {/* Full Model Details (shown only when NOT an Upcoming preview) */}
                        {!isUpcomingModel && (
                            <>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div>
                                        <label className={LABEL_CLASS}>
                                            Category *
                                        </label>
                                        <input
                                            type="text"
                                            list="digital-twin-categories"
                                            required
                                            value={archetype}
                                            onChange={(e) => setArchetype(e.target.value)}
                                            placeholder="Female or Male"
                                            className={INPUT_CLASS}
                                        />
                                        <datalist id="digital-twin-categories">
                                            <option value="Female" />
                                            <option value="Male" />
                                        </datalist>
                                    </div>
                                    <div>
                                        <label className={LABEL_CLASS}>
                                            Preset Price *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={presetPrice}
                                            onChange={(e) => setPresetPrice(e.target.value)}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABEL_CLASS}>
                                            Lifetime Copyright Price *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={lifetimePrice}
                                            onChange={(e) => setLifetimePrice(e.target.value)}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LABEL_CLASS}>
                                        Editorial Description *
                                    </label>
                                    <textarea
                                        rows={2}
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe garments, lighting calibration, and pose style..."
                                        className={INPUT_CLASS}
                                    />
                                </div>
                            </>
                        )}

                        {/* Full-Body Model Image Upload (always shown) */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                                Full-Body Transparent PNG / WebP Image
                            </label>
                            <p className="mt-0.5 text-xs text-slate-600">
                                {isUpcomingModel
                                    ? 'Upload a single preview cutout for the Upcoming category card.'
                                    : 'Upload a transparent cutout of the model. If individual pose photos are not uploaded below, all 6 pose angles will automatically frame from this master cutout.'}
                            </p>
                            <input
                                type="file"
                                accept=".png,.webp,.jpg,.jpeg"
                                onChange={(e) => setModelImageFile(e.target.files?.[0] ?? null)}
                                className={`mt-2.5 ${FILE_INPUT_CLASS}`}
                            />
                        </div>

                        {isUpcomingModel ? (
                            <div className="max-w-[180px]">
                                <label className={LABEL_CLASS}>
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(Number(e.target.value))}
                                    className={INPUT_CLASS}
                                />
                            </div>
                        ) : (
                            <>
                                {/* 6 Pose Presets Configuration */}
                                <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-ink">
                                        6 Pose Presets (Optional Individual Pose Photo Overrides)
                                    </span>
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        {poses.map((pose, idx) => (
                                            <div
                                                key={pose.id || idx}
                                                className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-2.5"
                                            >
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="font-bold text-primary">
                                                        {pose.code}: {pose.shortName}
                                                    </span>
                                                    {pose.imageUrl && (
                                                        <span className="text-[10px] font-semibold text-emerald-700">
                                                            Custom Image Set
                                                        </span>
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={pose.title}
                                                    onChange={(e) =>
                                                        handlePoseTitleChange(idx, 'title', e.target.value)
                                                    }
                                                    placeholder="Pose title"
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                                                />
                                                <input
                                                    type="file"
                                                    accept=".png,.webp,.jpg,.jpeg"
                                                    onChange={(e) =>
                                                        setPoseFiles((prev) => ({
                                                            ...prev,
                                                            [idx]: e.target.files?.[0] ?? null,
                                                        }))
                                                    }
                                                    className="block w-full text-[11px] text-slate-600 file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-slate-100 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-ink hover:file:bg-slate-200"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Toggles & Metadata */}
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <div>
                                        <label className={LABEL_CLASS}>
                                            Downloads Count
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={downloadCount}
                                            onChange={(e) => setDownloadCount(Number(e.target.value))}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABEL_CLASS}>
                                            Sort Order
                                        </label>
                                        <input
                                            type="number"
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(Number(e.target.value))}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                    <label className="flex cursor-pointer items-center gap-2 pt-5 text-xs font-medium text-ink">
                                        <input
                                            type="checkbox"
                                            checked={isFeaturedOnHome}
                                            onChange={(e) => setIsFeaturedOnHome(e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
                                        />
                                        Featured on Home
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-2 pt-5 text-xs font-medium text-rose-700">
                                        <input
                                            type="checkbox"
                                            checked={isCopyrightSold}
                                            onChange={(e) => setIsCopyrightSold(e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 accent-rose-600"
                                        />
                                        Copyright Sold Out
                                    </label>
                                </div>
                            </>
                        )}

                        <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsTwinDialogOpen(false)}
                                className="cursor-pointer text-xs text-slate-600 hover:bg-slate-100 hover:text-ink"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSavingTwin}
                                className="cursor-pointer bg-primary text-xs font-semibold text-white hover:bg-primary-hover"
                            >
                                {isSavingTwin ? 'Saving...' : isUpcomingModel ? 'Save Upcoming Model' : 'Save Digital Twin'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DIALOG 2: CREATE / EDIT CONFIGURATOR ATTRIBUTE */}
            <Dialog open={isAttrDialogOpen} onOpenChange={setIsAttrDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAttr
                                ? `Edit Attribute — ${editingAttr.name}`
                                : 'Add Custom Order Attribute'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure dynamic traits shown on the Custom Digital Twin Order page (/digital-twins/order).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveAttribute} className="space-y-4 pt-1 text-xs">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className={LABEL_CLASS}>
                                    Attribute Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={attrName}
                                    onChange={(e) => setAttrName(e.target.value)}
                                    placeholder="e.g. Skin Tone"
                                    className={INPUT_CLASS}
                                />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>
                                    Input Type *
                                </label>
                                <select
                                    value={attrInputType}
                                    onChange={(e) =>
                                        setAttrInputType(
                                            e.target.value as 'unit_input' | 'select' | 'multi_input',
                                        )
                                    }
                                    className={INPUT_CLASS}
                                >
                                    <option value="select">Option Chips (Select)</option>
                                    <option value="unit_input">Unit Selector First + Input (e.g. ft / in)</option>
                                    <option value="multi_input">Multi-Input Boxes (e.g. Shoulder, Chest, Hip)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={LABEL_CLASS}>
                                Options / Sub-Fields (Comma Separated) *
                            </label>
                            <input
                                type="text"
                                required
                                value={attrOptionsText}
                                onChange={(e) => setAttrOptionsText(e.target.value)}
                                placeholder="Fair, Blonde, Brown, White, Dark"
                                className={INPUT_CLASS}
                            />
                        </div>

                        {attrInputType === 'select' && (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label className="flex cursor-pointer items-center gap-2 pt-5 text-xs font-medium text-ink">
                                    <input
                                        type="checkbox"
                                        checked={attrAllowCustom}
                                        onChange={(e) => setAttrAllowCustom(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
                                    />
                                    Allow Custom / Other Input
                                </label>
                                <div>
                                    <label className={LABEL_CLASS}>
                                        Custom Trigger Label
                                    </label>
                                    <input
                                        type="text"
                                        value={attrCustomLabel}
                                        onChange={(e) => setAttrCustomLabel(e.target.value)}
                                        placeholder="Custom or Other"
                                        className={INPUT_CLASS}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className={LABEL_CLASS}>
                                    Input Placeholder
                                </label>
                                <input
                                    type="text"
                                    value={attrPlaceholder}
                                    onChange={(e) => setAttrPlaceholder(e.target.value)}
                                    placeholder="Describe custom value..."
                                    className={INPUT_CLASS}
                                />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={attrSortOrder}
                                    onChange={(e) => setAttrSortOrder(Number(e.target.value))}
                                    className={INPUT_CLASS}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsAttrDialogOpen(false)}
                                className="cursor-pointer text-xs text-slate-600 hover:bg-slate-100 hover:text-ink"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSavingAttr}
                                className="cursor-pointer bg-primary text-xs font-semibold text-white hover:bg-primary-hover"
                            >
                                {isSavingAttr ? 'Saving...' : 'Save Attribute'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
