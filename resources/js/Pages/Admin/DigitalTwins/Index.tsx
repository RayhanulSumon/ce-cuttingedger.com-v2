import React, { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { AdminLayout } from '@/Layouts/Admin/AdminLayout';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
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
    STUDIO_IMAGE_SPECS,
    StudioImageValidationResult,
    validateStudioImage,
} from '@/lib/studioImageValidation';
import {
    AlertCircle,
    AlertTriangle,
    Archive,
    CheckCircle2,
    Clock,
    Download,
    Edit3,
    Search,
    Settings2,
    Trash2,
    Upload,
    Users,
} from 'lucide-react';

interface AdminDigitalTwinItem extends DigitalTwinModel {
    isFeaturedOnHome?: boolean;
    isActive?: boolean;
    sortOrder?: number;
    hasSourceZip?: boolean;
    sourceZipName?: string | null;
    sourceZipSize?: number | null;
}

interface PageProps {
    twins: AdminDigitalTwinItem[];
    attributes: DigitalTwinAttributeItem[];
    defaultPoses: TwinPosePreset[];
}

type ModelFilter = 'all' | 'homepage' | 'available' | 'sold_out' | 'upcoming';

const LABEL_CLASS = 'mb-1.5 block text-xs font-semibold text-slate-700';
const INPUT_CLASS =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15';

function formatFileSize(bytes?: number | null): string {
    if (!bytes || bytes <= 0) {
        return '';
    }
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

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
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ModelFilter>('all');

    // Digital Twin Create/Edit Dialog State
    const [isTwinDialogOpen, setIsTwinDialogOpen] = useState(false);
    const [twinModalTab, setTwinModalTab] = useState<'basic' | 'poses'>('basic');
    const [editingTwin, setEditingTwin] = useState<AdminDigitalTwinItem | null>(null);
    const [isSavingTwin, setIsSavingTwin] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [isUpcomingModel, setIsUpcomingModel] = useState(false);
    const [name, setName] = useState('');
    const [lookNumber, setLookNumber] = useState(1);
    const [archetype, setArchetype] = useState('Female');
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
    const [modelImagePreviewUrl, setModelImagePreviewUrl] = useState<string>('');
    const [modelImageMeta, setModelImageMeta] = useState<StudioImageValidationResult | null>(null);
    const [sourceZipFile, setSourceZipFile] = useState<File | null>(null);
    const [removeSourceZip, setRemoveSourceZip] = useState(false);
    const [poses, setPoses] = useState<TwinPosePreset[]>(defaultPoses);
    const [poseFiles, setPoseFiles] = useState<Record<number, File | null>>({});
    const [poseMeta, setPoseMeta] = useState<Record<number, StudioImageValidationResult>>({});

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

    useEffect(() => {
        if (!modelImageFile) {
            return;
        }
        const objectUrl = URL.createObjectURL(modelImageFile);
        setModelImagePreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [modelImageFile]);

    const openCreateTwin = () => {
        setEditingTwin(null);
        setTwinModalTab('basic');
        setFormErrors({});
        setIsUpcomingModel(false);
        setName('');
        setLookNumber(twins.length + 1);
        setArchetype('Female');
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
        setModelImagePreviewUrl('');
        setModelImageMeta(null);
        setSourceZipFile(null);
        setRemoveSourceZip(false);
        setPoses(defaultPoses.map((p) => ({ ...p })));
        setPoseFiles({});
        setPoseMeta({});
        setIsTwinDialogOpen(true);
    };

    const openEditTwin = (twin: AdminDigitalTwinItem) => {
        const upcoming = checkIsUpcoming(twin);
        setEditingTwin(twin);
        setTwinModalTab('basic');
        setFormErrors({});
        setIsUpcomingModel(upcoming);
        setName(twin.name);
        setLookNumber(twin.lookNumber);
        setArchetype(twin.archetype || (upcoming ? 'Upcoming' : 'Female'));
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
        setModelImagePreviewUrl(twin.hiResImage || twin.runwayImage || '');
        setModelImageMeta(null);
        setSourceZipFile(null);
        setRemoveSourceZip(false);
        setPoses((twin.poses && twin.poses.length > 0 ? twin.poses : defaultPoses).map((p) => ({ ...p })));
        setPoseFiles({});
        setPoseMeta({});
        setIsTwinDialogOpen(true);
    };

    const handleSourceZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = '';
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.zip')) {
            setFormErrors((prev) => ({
                ...prev,
                source_zip: 'Raw package must be a .zip file.',
            }));
            return;
        }

        setSourceZipFile(file);
        setRemoveSourceZip(false);
        setFormErrors((prev) => {
            if (!prev.source_zip) return prev;
            const { source_zip: _, ...rest } = prev;
            return rest;
        });
    };

    const handleTwinModelFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = '';
        if (!file) return;

        const result = await validateStudioImage(file, STUDIO_IMAGE_SPECS.twinModel);
        if (!result.valid) {
            setFormErrors((prev) => ({
                ...prev,
                model_image: result.error ?? 'Invalid model image.',
            }));
            return;
        }

        setModelImageFile(file);
        setModelImageMeta(result);
        setFormErrors((prev) => {
            if (!prev.model_image) return prev;
            const { model_image: _, ...rest } = prev;
            return rest;
        });
    };

    const handleTwinPoseFileChange = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = '';
        if (!file) return;

        const result = await validateStudioImage(file, STUDIO_IMAGE_SPECS.twinPose);
        if (!result.valid) {
            setFormErrors((prev) => ({
                ...prev,
                [`pose_images.${idx}`]: result.error ?? 'Invalid pose image.',
            }));
            return;
        }

        setPoseFiles((prev) => ({ ...prev, [idx]: file }));
        setPoseMeta((prev) => ({ ...prev, [idx]: result }));
        setFormErrors((prev) => {
            const next = { ...prev };
            delete next[`pose_images.${idx}`];
            return next;
        });
    };

    const handleUpcomingToggle = (checked: boolean) => {
        setIsUpcomingModel(checked);

        if (checked) {
            setArchetype('Upcoming');
            setPresetPrice('Upcoming');
            setIsFeaturedOnHome(false);
            setIsCopyrightSold(false);
            setTwinModalTab('basic');
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
        setFormErrors({});

        if (!name.trim()) {
            setTwinModalTab('basic');
            setFormErrors({ name: 'Please enter a model name in Basic Info.' });
            return;
        }

        if (!isUpcomingModel && !description.trim()) {
            setTwinModalTab('basic');
            setFormErrors({ description: 'Please enter a short description in Basic Info.' });
            return;
        }

        const validPoseFiles = Object.fromEntries(
            Object.entries(poseFiles).filter(([, file]) => file instanceof File),
        );

        setIsSavingTwin(true);

        const url = editingTwin?.id
            ? `/admin/digital-twins/${editingTwin.id}`
            : '/admin/digital-twins';

        const payload = isUpcomingModel
            ? {
                  name,
                  look_number: lookNumber,
                  archetype: 'Upcoming',
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
                  source_zip: sourceZipFile,
                  remove_source_zip: removeSourceZip,
                  poses: poses as any,
                  pose_images: validPoseFiles as any,
              };

        router.post(url, payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setIsTwinDialogOpen(false),
            onError: (errors) => {
                const flatErrors: Record<string, string> = {};
                Object.entries(errors).forEach(([k, v]) => {
                    if (typeof v === 'string') flatErrors[k] = v;
                });
                setFormErrors(flatErrors);
                if (
                    flatErrors.name ||
                    flatErrors.look_number ||
                    flatErrors.description ||
                    flatErrors.model_image ||
                    flatErrors.source_zip
                ) {
                    setTwinModalTab('basic');
                } else if (
                    !isUpcomingModel &&
                    Object.keys(flatErrors).some((key) => key.startsWith('pose_images'))
                ) {
                    setTwinModalTab('poses');
                }
            },
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
        if (!window.confirm(`Delete order option "${attr.name}"?`)) return;
        router.delete(`/admin/digital-twins/attributes/${attr.id}`, { preserveScroll: true });
    };

    const counts = useMemo(() => {
        let homepage = 0;
        let available = 0;
        let soldOut = 0;
        let upcoming = 0;
        twins.forEach((t) => {
            const isUp = checkIsUpcoming(t);
            if (isUp) {
                upcoming += 1;
                return;
            }
            if (t.isFeaturedOnHome) homepage += 1;
            if (t.isCopyrightSold) soldOut += 1;
            else available += 1;
        });
        return { homepage, available, soldOut, upcoming };
    }, [twins]);

    const filteredTwins = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return twins.filter((twin) => {
            const isUp = checkIsUpcoming(twin);
            if (statusFilter === 'homepage' && (!twin.isFeaturedOnHome || isUp)) return false;
            if (statusFilter === 'available' && (isUp || twin.isCopyrightSold)) return false;
            if (statusFilter === 'sold_out' && (isUp || !twin.isCopyrightSold)) return false;
            if (statusFilter === 'upcoming' && !isUp) return false;

            if (!q) return true;
            const lookTag = `#${String(twin.lookNumber).padStart(2, '0')}`;
            return (
                twin.name.toLowerCase().includes(q) ||
                twin.archetype.toLowerCase().includes(q) ||
                lookTag.includes(q) ||
                String(twin.lookNumber).includes(q)
            );
        });
    }, [twins, searchQuery, statusFilter]);

    const showingBasicTab = isUpcomingModel || twinModalTab === 'basic';
    const twinBannerErrors = Object.entries(formErrors)
        .filter(([key, msg]) => {
            if (!msg) return false;
            if (showingBasicTab && (key === 'model_image' || key === 'source_zip')) return false;
            if (!showingBasicTab && key.startsWith('pose_images.')) return false;
            return true;
        })
        .map(([, msg]) => msg);

    return (
        <AdminLayout title="Digital Twins">
            <AdminPageHeader
                title="Digital Twins"
                description="Manage AI Digital Twin models, copyright availability, and custom order options."
                actionLabel={activeTab === 'models' ? 'Add Model' : 'Add Option'}
                onActionClick={activeTab === 'models' ? openCreateTwin : openCreateAttribute}
            />

            <div className="space-y-5">
                {/* Clean Section Switcher Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
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
                        Models ({twins.length})
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
                        Order Options ({attributes.length})
                    </button>
                </div>

                {/* TAB 1: DIGITAL TWIN MODELS */}
                {activeTab === 'models' && (
                    <>
                        {/* Compact Search & Filter Bar */}
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap items-center gap-1.5">
                                {(
                                    [
                                        { id: 'all', label: `All (${twins.length})` },
                                        { id: 'homepage', label: `Homepage (${counts.homepage})` },
                                        { id: 'available', label: `Available (${counts.available})` },
                                        { id: 'sold_out', label: `Sold Out (${counts.soldOut})` },
                                        { id: 'upcoming', label: `Upcoming (${counts.upcoming})` },
                                    ] as { id: ModelFilter; label: string }[]
                                ).map((pill) => (
                                    <button
                                        key={pill.id}
                                        type="button"
                                        onClick={() => setStatusFilter(pill.id)}
                                        className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                                            statusFilter === pill.id
                                                ? 'bg-ink text-white'
                                                : 'border border-slate-200 bg-white text-slate-600 hover:text-ink'
                                        }`}
                                    >
                                        {pill.label}
                                    </button>
                                ))}
                            </div>

                            <div className="relative w-full lg:w-72">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name, look #, or category..."
                                    className="bg-white pl-9 border-slate-200 text-ink"
                                />
                            </div>
                        </div>

                        {filteredTwins.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200/90 bg-white px-6 py-12 text-center shadow-xs">
                                <p className="text-sm font-bold text-ink">No matching Digital Twins</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Try clearing your search or switching the status filter.
                                </p>
                                {(searchQuery || statusFilter !== 'all') && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('all');
                                        }}
                                        className="mt-4 min-h-10 sm:min-h-8 text-xs font-semibold"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {filteredTwins.map((twin) => {
                                    const upcoming = checkIsUpcoming(twin);

                                    return (
                                        <div
                                            key={twin.id ?? twin.lookNumber}
                                            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex gap-4">
                                                <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#eef3f9]">
                                                    <TwinSpriteCrop
                                                        twin={twin}
                                                        className="h-full w-full object-contain"
                                                    />
                                                    <span className="absolute bottom-1.5 left-1.5 rounded-md border border-slate-200/90 bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-ink shadow-xs">
                                                        #{String(twin.lookNumber).padStart(2, '0')}
                                                    </span>
                                                </div>

                                                <div className="min-w-0 flex-1 space-y-1.5">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {upcoming ? (
                                                            <Badge className="border-slate-300 bg-slate-100 text-[10px] text-slate-700">
                                                                Upcoming
                                                            </Badge>
                                                        ) : twin.isCopyrightSold ? (
                                                            <Badge variant="destructive" className="text-[10px]">
                                                                Sold Out
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="success" className="text-[10px]">
                                                                Available
                                                            </Badge>
                                                        )}
                                                        {twin.isFeaturedOnHome && !upcoming && (
                                                            <Badge className="border-sky-200 bg-sky-50 text-[10px] text-sky-700">
                                                                Homepage
                                                            </Badge>
                                                        )}
                                                        {twin.hasSourceZip && (
                                                            <Badge className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700">
                                                                ZIP
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <h3 className="truncate text-base font-bold text-ink">{twin.name}</h3>
                                                    <p className="text-xs font-medium text-slate-500">{twin.archetype}</p>

                                                    {!upcoming && (
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-slate-600">
                                                            <span>
                                                                Preset <strong className="text-ink">{twin.presetPrice}</strong>
                                                            </span>
                                                            <span>
                                                                Lifetime <strong className="text-primary">{twin.lifetimePrice}</strong>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                                {upcoming ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                                        <Clock className="h-3 w-3" />
                                                        Preview Only
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleSoldOut(twin)}
                                                        className={`min-h-10 sm:min-h-8 cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
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
                                                        className="min-h-10 sm:min-h-8 cursor-pointer border-slate-200 bg-white text-xs text-ink hover:bg-slate-50"
                                                    >
                                                        <Edit3 className="mr-1 h-3.5 w-3.5 text-primary" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteTwin(twin)}
                                                        aria-label={`Delete ${twin.name}`}
                                                        className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 cursor-pointer p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
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
                    </>
                )}

                {/* TAB 2: ORDER CONFIGURATOR OPTIONS */}
                {activeTab === 'attributes' && (
                    <div className="space-y-3">
                        {attributes.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200/90 bg-white px-6 py-12 text-center shadow-xs">
                                <p className="text-sm font-bold text-ink">No order options configured</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Add attributes like Skin Tone, Body Type, or Height to customize orders.
                                </p>
                            </div>
                        ) : (
                            attributes.map((attr, idx) => (
                                <div
                                    key={attr.id ?? attr.slug}
                                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
                                >
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-primary">#{idx + 1}</span>
                                            <h3 className="text-sm font-bold text-ink">{attr.name}</h3>
                                            <Badge variant="secondary" className="text-[11px]">
                                                {attr.inputType === 'unit_input' && 'Unit + Value (ft/in)'}
                                                {attr.inputType === 'select' && 'Option Chips'}
                                                {attr.inputType === 'multi_input' && 'Multiple Inputs'}
                                            </Badge>
                                            {attr.allowCustom && (
                                                <Badge className="border-sky-200 bg-sky-50 text-[11px] text-sky-700">
                                                    Allows {attr.customLabel || 'Custom'} Input
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
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openEditAttribute(attr)}
                                            className="min-h-10 sm:min-h-8 cursor-pointer border-slate-200 bg-white text-xs text-ink hover:bg-slate-50"
                                        >
                                            <Edit3 className="mr-1 h-3.5 w-3.5 text-primary" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteAttribute(attr)}
                                            aria-label={`Delete ${attr.name}`}
                                            className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 cursor-pointer p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* DIALOG 1: CREATE / EDIT DIGITAL TWIN MODEL */}
            <Dialog
                open={isTwinDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setFormErrors({});
                        setModelImageMeta(null);
                        setPoseMeta({});
                    }
                    setIsTwinDialogOpen(open);
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTwin ? `Edit ${editingTwin.name}` : 'Add Digital Twin Model'}
                        </DialogTitle>
                        <DialogDescription>
                            Images are automatically optimized for instant catalog display.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveTwin} noValidate className="space-y-4 pt-1 text-xs">
                        {twinBannerErrors.length > 0 && (
                            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                                <div className="space-y-0.5">
                                    {twinBannerErrors.map((msg, idx) => (
                                        <p key={idx} className="font-medium">
                                            {msg}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
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
                                    Upcoming Preview (Quick Upload)
                                </span>
                                <span className="block text-xs text-slate-500">
                                    {isUpcomingModel
                                        ? 'Only Model Name, Look #, and Preview Image are required.'
                                        : 'Check this to upload a quick preview card without pricing or pose settings.'}
                                </span>
                            </div>
                        </label>

                        {/* Two Clean Modal Tabs for Standard Models */}
                        {!isUpcomingModel && (
                            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => setTwinModalTab('basic')}
                                    className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                                        twinModalTab === 'basic'
                                            ? 'bg-white text-ink shadow-xs'
                                            : 'text-slate-600 hover:text-ink'
                                    }`}
                                >
                                    1. Basic Info &amp; Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTwinModalTab('poses')}
                                    className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                                        twinModalTab === 'poses'
                                            ? 'bg-white text-ink shadow-xs'
                                            : 'text-slate-600 hover:text-ink'
                                    }`}
                                >
                                    2. 6 Poses &amp; Advanced
                                </button>
                            </div>
                        )}

                        {/* TAB: BASIC INFO (always shown for Upcoming preview) */}
                        {(isUpcomingModel || twinModalTab === 'basic') && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="sm:col-span-2">
                                        <label className={LABEL_CLASS}>Model Name *</label>
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
                                        <label className={LABEL_CLASS}>Look Number *</label>
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

                                {!isUpcomingModel && (
                                    <>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                            <div>
                                                <label className={LABEL_CLASS}>Category *</label>
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
                                                <label className={LABEL_CLASS}>Preset Price *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={presetPrice}
                                                    onChange={(e) => setPresetPrice(e.target.value)}
                                                    className={INPUT_CLASS}
                                                />
                                            </div>
                                            <div>
                                                <label className={LABEL_CLASS}>Lifetime Price *</label>
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
                                            <label className={LABEL_CLASS}>Short Description *</label>
                                            <textarea
                                                rows={2}
                                                required
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Describe garments, lighting calibration, and style..."
                                                className={INPUT_CLASS}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Model Image Upload with Live Preview */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                                    {(modelImagePreviewUrl || editingTwin) && (
                                        <div className="h-24 w-18 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-[#eef3f9]">
                                            {modelImagePreviewUrl ? (
                                                <img
                                                    src={modelImagePreviewUrl}
                                                    alt={name || 'Model preview'}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : editingTwin ? (
                                                <TwinSpriteCrop
                                                    twin={editingTwin}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : null}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div>
                                            <label className="block text-xs font-bold text-ink">
                                                Model Image
                                            </label>
                                            <p className="mt-0.5 text-[11px] text-slate-500">
                                                Transparent PNG/WebP · 9:16 portrait (1080×1920 px)
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <label className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover">
                                                <Upload className="h-3.5 w-3.5" />
                                                <span>
                                                    {modelImagePreviewUrl || editingTwin
                                                        ? 'Change Model Image'
                                                        : 'Upload Model Image'}
                                                </span>
                                                <input
                                                    key="twin-model-file"
                                                    type="file"
                                                    accept="image/png,image/webp,.png,.webp"
                                                    onChange={handleTwinModelFileChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <span className="max-w-[200px] truncate text-xs text-slate-600">
                                                {modelImageFile
                                                    ? modelImageFile.name
                                                    : editingTwin
                                                      ? 'Current image saved'
                                                      : 'No file selected'}
                                            </span>
                                        </div>

                                        {modelImageMeta?.valid && (
                                            <p
                                                className={`flex items-center gap-1.5 text-[11px] font-medium ${
                                                    modelImageMeta.warning ? 'text-amber-700' : 'text-emerald-700'
                                                }`}
                                            >
                                                {modelImageMeta.warning ? (
                                                    <>
                                                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                                        <span>
                                                            {modelImageMeta.width}×{modelImageMeta.height} px ·{' '}
                                                            {modelImageMeta.warning}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                                        <span>
                                                            {modelImageMeta.width}×{modelImageMeta.height} px · Transparent
                                                        </span>
                                                    </>
                                                )}
                                            </p>
                                        )}

                                        {formErrors.model_image && (
                                            <p className="text-[11px] font-semibold text-rose-600">
                                                {formErrors.model_image}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {!isUpcomingModel && (
                                    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3.5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                                    <Archive className="h-3.5 w-3.5 text-primary" />
                                                    Raw Source Package (ZIP)
                                                </label>
                                                <p className="mt-0.5 text-[11px] text-slate-500">
                                                    Private ZIP delivered after purchase (never public).
                                                </p>
                                            </div>
                                            {editingTwin?.hasSourceZip && !removeSourceZip && editingTwin.id && (
                                                <a
                                                    href={`/admin/digital-twins/${editingTwin.id}/download-package`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-slate-100"
                                                >
                                                    <Download className="h-3 w-3 text-primary" />
                                                    Download
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <label className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-slate-100">
                                                <Upload className="h-3.5 w-3.5 text-primary" />
                                                <span>
                                                    {sourceZipFile || (editingTwin?.hasSourceZip && !removeSourceZip)
                                                        ? 'Replace ZIP'
                                                        : 'Upload ZIP'}
                                                </span>
                                                <input
                                                    key="twin-source-zip"
                                                    type="file"
                                                    accept=".zip,application/zip,application/x-zip-compressed"
                                                    onChange={handleSourceZipChange}
                                                    className="sr-only"
                                                />
                                            </label>

                                            <span className="max-w-[260px] truncate text-xs text-slate-600">
                                                {sourceZipFile
                                                    ? `${sourceZipFile.name} (${formatFileSize(sourceZipFile.size)})`
                                                    : removeSourceZip
                                                      ? 'Removed on save'
                                                      : editingTwin?.hasSourceZip
                                                        ? `${editingTwin.sourceZipName || 'raw-pack.zip'}${
                                                              editingTwin.sourceZipSize
                                                                  ? ` (${formatFileSize(editingTwin.sourceZipSize)})`
                                                                  : ''
                                                          }`
                                                        : 'No ZIP uploaded'}
                                            </span>

                                            {(sourceZipFile || (editingTwin?.hasSourceZip && !removeSourceZip)) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSourceZipFile(null);
                                                        if (editingTwin?.hasSourceZip) {
                                                            setRemoveSourceZip(true);
                                                        }
                                                    }}
                                                    className="cursor-pointer text-[11px] font-semibold text-rose-600 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        {formErrors.source_zip && (
                                            <p className="text-[11px] font-semibold text-rose-600">
                                                {formErrors.source_zip}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {!isUpcomingModel ? (
                                    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-slate-200 bg-white px-4 py-3">
                                        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink">
                                            <input
                                                type="checkbox"
                                                checked={isFeaturedOnHome}
                                                onChange={(e) => setIsFeaturedOnHome(e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
                                            />
                                            Show on Homepage
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-rose-700">
                                            <input
                                                type="checkbox"
                                                checked={isCopyrightSold}
                                                onChange={(e) => setIsCopyrightSold(e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 accent-rose-600"
                                            />
                                            Copyright Sold Out
                                        </label>
                                    </div>
                                ) : (
                                    <div className="max-w-[180px]">
                                        <label className={LABEL_CLASS}>Sort Order</label>
                                        <input
                                            type="number"
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(Number(e.target.value))}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: 6 POSES & ADVANCED */}
                        {!isUpcomingModel && twinModalTab === 'poses' && (
                            <div className="space-y-4">
                                <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                                    <div>
                                        <span className="block text-xs font-bold text-ink">
                                            6 Pose Presets (Optional)
                                        </span>
                                        <p className="mt-0.5 text-[11px] text-slate-500">
                                            Transparent PNG/WebP · 3:4 or 9:16 (900×1200 px)
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        {poses.map((pose, idx) => {
                                            const meta = poseMeta[idx];
                                            const poseErr = formErrors[`pose_images.${idx}`];
                                            return (
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
                                                                Custom Set
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
                                                        key={`twin-pose-file-${idx}`}
                                                        type="file"
                                                        accept="image/png,image/webp,.png,.webp"
                                                        onChange={(e) => handleTwinPoseFileChange(idx, e)}
                                                        className="block w-full text-[11px] text-slate-600 file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-slate-100 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-ink hover:file:bg-slate-200"
                                                    />
                                                    {meta?.valid && (
                                                        <p
                                                            className={`flex items-center gap-1 text-[10px] font-medium ${
                                                                meta.warning ? 'text-amber-700' : 'text-emerald-700'
                                                            }`}
                                                        >
                                                            {meta.warning ? (
                                                                <AlertTriangle className="h-3 w-3 shrink-0" />
                                                            ) : (
                                                                <CheckCircle2 className="h-3 w-3 shrink-0" />
                                                            )}
                                                            <span>
                                                                {meta.width}×{meta.height} px ·{' '}
                                                                {meta.warning ? 'Solid background' : 'Transparent'}
                                                            </span>
                                                        </p>
                                                    )}
                                                    {poseErr && (
                                                        <p className="text-[10px] font-semibold text-rose-600">
                                                            {poseErr}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <label className={LABEL_CLASS}>Custom Order Price</label>
                                        <input
                                            type="text"
                                            value={customOrderPrice}
                                            onChange={(e) => setCustomOrderPrice(e.target.value)}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABEL_CLASS}>Downloads Count</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={downloadCount}
                                            onChange={(e) => setDownloadCount(Number(e.target.value))}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABEL_CLASS}>Sort Order</label>
                                        <input
                                            type="number"
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(Number(e.target.value))}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABEL_CLASS}>Listed Date</label>
                                        <input
                                            type="text"
                                            value={listedAt}
                                            onChange={(e) => setListedAt(e.target.value)}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-3">
                            <div>
                                {!isUpcomingModel && twinModalTab === 'basic' && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setTwinModalTab('poses')}
                                        className="min-h-10 sm:min-h-9 cursor-pointer text-xs"
                                    >
                                        Edit 6 Poses &amp; Advanced
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsTwinDialogOpen(false)}
                                    className="min-h-10 sm:min-h-9 cursor-pointer text-xs text-slate-600 hover:bg-slate-100 hover:text-ink"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSavingTwin}
                                    className="min-h-10 sm:min-h-9 cursor-pointer bg-primary text-xs font-semibold text-white hover:bg-primary-hover"
                                >
                                    {isSavingTwin
                                        ? 'Saving...'
                                        : isUpcomingModel
                                          ? 'Save Preview'
                                          : 'Save Model'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DIALOG 2: CREATE / EDIT CONFIGURATOR ATTRIBUTE */}
            <Dialog open={isAttrDialogOpen} onOpenChange={setIsAttrDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAttr ? `Edit Option — ${editingAttr.name}` : 'Add Order Option'}
                        </DialogTitle>
                        <DialogDescription>
                            Options shown to clients on the Custom Digital Twin order page.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveAttribute} className="space-y-4 pt-1 text-xs">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className={LABEL_CLASS}>Option Name *</label>
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
                                <label className={LABEL_CLASS}>Field Type *</label>
                                <select
                                    value={attrInputType}
                                    onChange={(e) =>
                                        setAttrInputType(
                                            e.target.value as 'unit_input' | 'select' | 'multi_input',
                                        )
                                    }
                                    className={INPUT_CLASS}
                                >
                                    <option value="select">Option Chips</option>
                                    <option value="unit_input">Unit + Value (ft / in)</option>
                                    <option value="multi_input">Multiple Inputs (Chest, Waist)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={LABEL_CLASS}>Choices / Sub-Fields (Comma Separated) *</label>
                            <input
                                type="text"
                                required
                                value={attrOptionsText}
                                onChange={(e) => setAttrOptionsText(e.target.value)}
                                placeholder="Fair, Blonde, Brown, Dark"
                                className={INPUT_CLASS}
                            />
                        </div>

                        {attrInputType === 'select' && (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label className="flex cursor-pointer items-center gap-2 pt-4 text-xs font-semibold text-ink">
                                    <input
                                        type="checkbox"
                                        checked={attrAllowCustom}
                                        onChange={(e) => setAttrAllowCustom(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-primary accent-[var(--color-primary)]"
                                    />
                                    Allow Custom Text Input
                                </label>
                                <div>
                                    <label className={LABEL_CLASS}>Custom Button Label</label>
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
                                <label className={LABEL_CLASS}>Placeholder Text</label>
                                <input
                                    type="text"
                                    value={attrPlaceholder}
                                    onChange={(e) => setAttrPlaceholder(e.target.value)}
                                    placeholder="Describe custom value..."
                                    className={INPUT_CLASS}
                                />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Sort Order</label>
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
                                className="min-h-10 sm:min-h-9 cursor-pointer text-xs text-slate-600 hover:bg-slate-100 hover:text-ink"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSavingAttr}
                                className="min-h-10 sm:min-h-9 cursor-pointer bg-primary text-xs font-semibold text-white hover:bg-primary-hover"
                            >
                                {isSavingAttr ? 'Saving...' : 'Save Option'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
