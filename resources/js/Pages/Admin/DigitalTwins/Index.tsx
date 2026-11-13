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
    TwinPose,
} from '@/Components/Landing/DigitalTwins/twins';
import {
    CheckCircle2,
    Crown,
    Edit3,
    FileUp,
    Layers,
    Plus,
    Settings2,
    Sparkles,
    Trash2,
    Users,
    XCircle,
} from 'lucide-react';

interface AdminDigitalTwinItem extends DigitalTwinModel {
    isFeaturedOnHome?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}

interface PageProps {
    twins: AdminDigitalTwinItem[];
    attributes: DigitalTwinAttributeItem[];
    defaultPoses: TwinPose[];
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

    const [name, setName] = useState('');
    const [lookNumber, setLookNumber] = useState(1);
    const [archetype, setArchetype] = useState('');
    const [collection, setCollection] = useState('SS / 26 Studio Twin');
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
    const [poses, setPoses] = useState<TwinPose[]>(defaultPoses);
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
        setName('');
        setLookNumber(twins.length + 1);
        setArchetype('Editorial Tailoring');
        setCollection('SS / 26 Studio Twin');
        setDescription('');
        setPresetPrice('$149');
        setCustomOrderPrice('$290');
        setLifetimePrice('$490');
        setDownloadCount(0);
        setListedAt(new Date().toISOString().slice(0, 10));
        setSortOrder(twins.length + 1);
        setIsFeaturedOnHome(true);
        setIsActive(true);
        setIsCopyrightSold(false);
        setModelImageFile(null);
        setPoses(defaultPoses.map((p) => ({ ...p })));
        setPoseFiles({});
        setIsTwinDialogOpen(true);
    };

    const openEditTwin = (twin: AdminDigitalTwinItem) => {
        setEditingTwin(twin);
        setName(twin.name);
        setLookNumber(twin.lookNumber);
        setArchetype(twin.archetype);
        setCollection(twin.collection || 'SS / 26 Studio Twin');
        setDescription(twin.description);
        setPresetPrice(twin.presetPrice);
        setCustomOrderPrice(twin.customOrderPrice);
        setLifetimePrice(twin.lifetimePrice);
        setDownloadCount(twin.downloadCount);
        setListedAt(twin.listedAt);
        setSortOrder(twin.sortOrder ?? twin.lookNumber);
        setIsFeaturedOnHome(twin.isFeaturedOnHome ?? true);
        setIsActive(twin.isActive ?? true);
        setIsCopyrightSold(twin.isCopyrightSold);
        setModelImageFile(null);
        setPoses((twin.poses && twin.poses.length > 0 ? twin.poses : defaultPoses).map((p) => ({ ...p })));
        setPoseFiles({});
        setIsTwinDialogOpen(true);
    };

    const handlePoseTitleChange = (idx: number, field: keyof TwinPose, val: string) => {
        setPoses((prev) =>
            prev.map((pose, i) => (i === idx ? { ...pose, [field]: val } : pose))
        );
    };

    const handleSaveTwin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingTwin(true);

        const url = editingTwin?.id
            ? `/admin/digital-twins/${editingTwin.id}`
            : '/admin/digital-twins';

        router.post(
            url,
            {
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
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => setIsTwinDialogOpen(false),
                onFinish: () => setIsSavingTwin(false),
            }
        );
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
            }
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

                    <div className="flex items-center gap-2">
                        {activeTab === 'models' ? (
                            <Button
                                onClick={openCreateTwin}
                                className="bg-accent text-black hover:bg-accent/90 font-mono text-xs font-bold"
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Digital Twin
                            </Button>
                        ) : (
                            <Button
                                onClick={openCreateAttribute}
                                className="bg-accent text-black hover:bg-accent/90 font-mono text-xs font-bold"
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Configurator Attribute
                            </Button>
                        )}
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-white/10 bg-[#12141a] p-3.5">
                        <span className="block font-mono text-[10px] uppercase text-white/50">
                            Total Digital Twins
                        </span>
                        <span className="font-mono text-2xl font-bold text-white">{twins.length}</span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-[#12141a] p-3.5">
                        <span className="block font-mono text-[10px] uppercase text-emerald-400/70">
                            Homepage Runway Active
                        </span>
                        <span className="font-mono text-2xl font-bold text-emerald-400">{featuredCount}</span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-[#12141a] p-3.5">
                        <span className="block font-mono text-[10px] uppercase text-rose-400/70">
                            Sold Out Copyrights
                        </span>
                        <span className="font-mono text-2xl font-bold text-rose-400">{soldOutCount}</span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-[#12141a] p-3.5">
                        <span className="block font-mono text-[10px] uppercase text-[#00f5ff]/70">
                            Custom Order Attributes
                        </span>
                        <span className="font-mono text-2xl font-bold text-[#00f5ff]">{attributes.length}</span>
                    </div>
                </div>

                {/* Section Switcher Tabs */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <button
                        type="button"
                        onClick={() => setActiveTab('models')}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                            activeTab === 'models'
                                ? 'bg-accent text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <Users className="h-3.5 w-3.5" />
                        Digital Twin Models ({twins.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('attributes')}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                            activeTab === 'attributes'
                                ? 'bg-accent text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <Settings2 className="h-3.5 w-3.5" />
                        Custom Order Attributes ({attributes.length})
                    </button>
                </div>

                {/* TAB 1: DIGITAL TWIN MODELS */}
                {activeTab === 'models' && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {twins.map((twin) => (
                            <div
                                key={twin.id ?? twin.lookNumber}
                                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#12141a] p-4"
                            >
                                <div className="flex gap-4">
                                    <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#e8eff7]">
                                        <TwinSpriteCrop
                                            twin={twin}
                                            className="h-full w-full object-contain"
                                        />
                                        <span className="absolute left-1.5 top-1.5 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                                            LOOK {String(twin.lookNumber).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {twin.isCopyrightSold ? (
                                                <Badge className="border-rose-500/40 bg-rose-500/15 text-[10px] text-rose-400">
                                                    SOLD OUT
                                                </Badge>
                                            ) : (
                                                <Badge className="border-emerald-500/40 bg-emerald-500/15 text-[10px] text-emerald-400">
                                                    AVAILABLE
                                                </Badge>
                                            )}
                                            {twin.isFeaturedOnHome && (
                                                <Badge className="border-[#00f5ff]/40 bg-[#00f5ff]/10 text-[10px] text-[#00f5ff]">
                                                    HOMEPAGE
                                                </Badge>
                                            )}
                                        </div>

                                        <h3 className="truncate font-bold text-white">{twin.name}</h3>
                                        <p className="font-mono text-xs text-white/60">{twin.archetype}</p>
                                        <p className="line-clamp-2 text-xs text-white/50">{twin.description}</p>

                                        <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
                                            <span className="text-white/80">
                                                Preset: <strong className="text-accent">{twin.presetPrice}</strong>
                                            </span>
                                            <span className="text-white/80">
                                                Lifetime: <strong className="text-[#00f5ff]">{twin.lifetimePrice}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleSoldOut(twin)}
                                        className={`cursor-pointer rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
                                            twin.isCopyrightSold
                                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                                        }`}
                                    >
                                        {twin.isCopyrightSold ? 'Mark Available' : 'Mark Sold Out'}
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openEditTwin(twin)}
                                            className="h-8 border-white/10 bg-white/5 font-mono text-xs text-white hover:bg-white/10"
                                        >
                                            <Edit3 className="mr-1 h-3.5 w-3.5 text-[#00f5ff]" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteTwin(twin)}
                                            className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB 2: CUSTOM ORDER CONFIGURATOR ATTRIBUTES */}
                {activeTab === 'attributes' && (
                    <div className="space-y-3">
                        {attributes.map((attr, idx) => (
                            <div
                                key={attr.id ?? attr.slug}
                                className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#12141a] p-4 sm:flex-row sm:items-center"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-accent">
                                            #{idx + 1}
                                        </span>
                                        <h3 className="text-sm font-bold text-white">{attr.name}</h3>
                                        <Badge className="border-white/15 bg-white/5 font-mono text-[10px] text-white/80">
                                            {attr.inputType === 'unit_input' && 'Unit Selector + Input (ft/in)'}
                                            {attr.inputType === 'select' && 'Option Chips'}
                                            {attr.inputType === 'multi_input' && 'Multi-Input Boxes'}
                                        </Badge>
                                        {attr.allowCustom && (
                                            <Badge className="border-[#00f5ff]/30 bg-[#00f5ff]/10 font-mono text-[10px] text-[#00f5ff]">
                                                +{attr.customLabel} Text Input
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {attr.options.map((opt) => (
                                            <span
                                                key={opt}
                                                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-white/80"
                                            >
                                                {opt}
                                            </span>
                                        ))}
                                        {attr.allowCustom && (
                                            <span className="rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-xs text-accent">
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
                                        className="h-8 border-white/10 bg-white/5 font-mono text-xs text-white hover:bg-white/10"
                                    >
                                        <Edit3 className="mr-1 h-3.5 w-3.5 text-[#00f5ff]" />
                                        Edit Options
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteAttribute(attr)}
                                        className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10"
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
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-white/15 bg-[#0f1117] text-white">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-base font-bold">
                            {editingTwin ? `Edit Digital Twin — ${editingTwin.name}` : 'Create New Digital Twin'}
                        </DialogTitle>
                        <DialogDescription className="font-mono text-xs text-white/60">
                            Uploaded model images are automatically converted to alpha-preserving 800w &amp; 1600w WebP for instant runway loading.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveTwin} className="space-y-4 py-2 text-xs">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Model Name &amp; Style (e.g. Sora — Structured Wool) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Look Number *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    value={lookNumber}
                                    onChange={(e) => setLookNumber(Number(e.target.value))}
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Archetype / Category *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={archetype}
                                    onChange={(e) => setArchetype(e.target.value)}
                                    placeholder="Editorial Tailoring"
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Preset Price *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={presetPrice}
                                    onChange={(e) => setPresetPrice(e.target.value)}
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Lifetime Copyright Price *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={lifetimePrice}
                                    onChange={(e) => setLifetimePrice(e.target.value)}
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                Editorial Description *
                            </label>
                            <textarea
                                rows={2}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:border-accent focus:outline-none"
                            />
                        </div>

                        {/* Full-Body Model Image Upload */}
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                            <label className="block font-mono text-[11px] font-bold uppercase text-accent">
                                Full-Body Transparent PNG / WebP Image
                            </label>
                            <p className="mt-0.5 text-[11px] text-white/60">
                                Upload a transparent cutout of the model. If individual pose photos are not uploaded below, all 6 pose angles will automatically frame from this master cutout.
                            </p>
                            <input
                                type="file"
                                accept=".png,.webp,.jpg,.jpeg"
                                onChange={(e) => setModelImageFile(e.target.files?.[0] ?? null)}
                                className="mt-2 block w-full text-xs text-white file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-1.5 file:font-mono file:text-xs file:font-bold file:text-black"
                            />
                        </div>

                        {/* 6 Pose Presets Configuration */}
                        <div className="space-y-2 rounded-xl border border-white/10 bg-black/40 p-3.5">
                            <span className="block font-mono text-[11px] font-bold uppercase text-[#00f5ff]">
                                6 Pose Presets (Optional Individual Pose Photo Overrides)
                            </span>
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {poses.map((pose, idx) => (
                                    <div
                                        key={pose.id || idx}
                                        className="rounded-xl border border-white/10 bg-white/5 p-2.5 space-y-1.5"
                                    >
                                        <div className="flex items-center justify-between font-mono text-[11px]">
                                            <span className="font-bold text-accent">
                                                {pose.code}: {pose.shortName}
                                            </span>
                                            {pose.imageUrl && (
                                                <span className="text-[10px] text-emerald-400">Custom Image Set</span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={pose.title}
                                            onChange={(e) =>
                                                handlePoseTitleChange(idx, 'title', e.target.value)
                                            }
                                            placeholder="Pose title"
                                            className="w-full rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 text-xs text-white"
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
                                            className="block w-full text-[10px] text-white/70 file:mr-2 file:rounded file:border-0 file:bg-white/10 file:px-2 file:py-1 file:text-[10px] file:text-white"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Toggles & Metadata */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Downloads Count
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={downloadCount}
                                    onChange={(e) => setDownloadCount(Number(e.target.value))}
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(Number(e.target.value))}
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-white"
                                />
                            </div>
                            <label className="flex cursor-pointer items-center gap-2 pt-4 font-mono text-xs">
                                <input
                                    type="checkbox"
                                    checked={isFeaturedOnHome}
                                    onChange={(e) => setIsFeaturedOnHome(e.target.checked)}
                                />
                                Featured on Home
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 pt-4 font-mono text-xs text-rose-300">
                                <input
                                    type="checkbox"
                                    checked={isCopyrightSold}
                                    onChange={(e) => setIsCopyrightSold(e.target.checked)}
                                />
                                Copyright Sold Out
                            </label>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsTwinDialogOpen(false)}
                                className="font-mono text-xs text-white/60"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSavingTwin}
                                className="bg-accent font-mono text-xs font-bold text-black hover:bg-accent/90"
                            >
                                {isSavingTwin ? 'Saving...' : 'Save Digital Twin'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DIALOG 2: CREATE / EDIT CONFIGURATOR ATTRIBUTE */}
            <Dialog open={isAttrDialogOpen} onOpenChange={setIsAttrDialogOpen}>
                <DialogContent className="max-w-lg border-white/15 bg-[#0f1117] text-white">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-base font-bold">
                            {editingAttr
                                ? `Edit Attribute — ${editingAttr.name}`
                                : 'Add Custom Order Attribute'}
                        </DialogTitle>
                        <DialogDescription className="font-mono text-xs text-white/60">
                            Configure dynamic traits shown on the Custom Digital Twin Order page (/digital-twins/order).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveAttribute} className="space-y-4 py-2 text-xs">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Attribute Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={attrName}
                                    onChange={(e) => setAttrName(e.target.value)}
                                    placeholder="e.g. Skin Tone"
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Input Type *
                                </label>
                                <select
                                    value={attrInputType}
                                    onChange={(e) =>
                                        setAttrInputType(
                                            e.target.value as 'unit_input' | 'select' | 'multi_input'
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/15 bg-[#161922] px-3 py-2 text-white focus:border-accent focus:outline-none"
                                >
                                    <option value="select">Option Chips (Select)</option>
                                    <option value="unit_input">Unit Selector First + Input (e.g. ft / in)</option>
                                    <option value="multi_input">Multi-Input Boxes (e.g. Shoulder, Chest, Hip)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                Options / Sub-Fields (Comma Separated) *
                            </label>
                            <input
                                type="text"
                                required
                                value={attrOptionsText}
                                onChange={(e) => setAttrOptionsText(e.target.value)}
                                placeholder="Fair, Blonde, Brown, White, Dark"
                                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                            />
                        </div>

                        {attrInputType === 'select' && (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label className="flex cursor-pointer items-center gap-2 pt-4 font-mono text-xs">
                                    <input
                                        type="checkbox"
                                        checked={attrAllowCustom}
                                        onChange={(e) => setAttrAllowCustom(e.target.checked)}
                                    />
                                    Allow Custom / Other Input
                                </label>
                                <div>
                                    <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                        Custom Trigger Label
                                    </label>
                                    <input
                                        type="text"
                                        value={attrCustomLabel}
                                        onChange={(e) => setAttrCustomLabel(e.target.value)}
                                        placeholder="Custom or Other"
                                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Input Placeholder
                                </label>
                                <input
                                    type="text"
                                    value={attrPlaceholder}
                                    onChange={(e) => setAttrPlaceholder(e.target.value)}
                                    placeholder="Describe custom value..."
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={attrSortOrder}
                                    onChange={(e) => setAttrSortOrder(Number(e.target.value))}
                                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsAttrDialogOpen(false)}
                                className="font-mono text-xs text-white/60"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSavingAttr}
                                className="bg-accent font-mono text-xs font-bold text-black hover:bg-accent/90"
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

