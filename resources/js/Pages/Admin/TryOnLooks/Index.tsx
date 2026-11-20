import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { Look, LookPiece } from '@/Components/Landing/TryOn/looks';
import {
    AlertCircle,
    ArrowRight,
    Crosshair,
    Edit3,
    ImagePlus,
    Plus,
    Search,
    Trash2,
    Upload,
} from 'lucide-react';

interface Pin {
    left: number;
    top: number;
}

interface AdminTryOnLookItem extends Look {
    isFeaturedOnHome?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}

interface PageProps {
    looks: AdminTryOnLookItem[];
}

const LABEL_CLASS = 'mb-1.5 block text-xs font-semibold text-slate-700';
const INPUT_CLASS =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15';

function shiftIndexMap<T>(record: Record<number, T>, removedIdx: number): Record<number, T> {
    const next: Record<number, T> = {};
    Object.entries(record).forEach(([rawKey, val]) => {
        const key = Number(rawKey);
        if (key < removedIdx) {
            next[key] = val;
        } else if (key > removedIdx) {
            next[key - 1] = val;
        }
    });
    return next;
}

export default function AdminTryOnLooksIndex({ looks = [] }: PageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [homepageOnly, setHomepageOnly] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [lookModalTab, setLookModalTab] = useState<'info' | 'pins'>('info');
    const [editingLook, setEditingLook] = useState<AdminTryOnLookItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Form state
    const [modelName, setModelName] = useState('');
    const [description, setDescription] = useState('');
    const [sortOrder, setSortOrder] = useState(1);
    const [isFeaturedOnHome, setIsFeaturedOnHome] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [modelImageFile, setModelImageFile] = useState<File | null>(null);
    const [modelPreviewUrl, setModelPreviewUrl] = useState<string>('');

    const [pieces, setPieces] = useState<LookPiece[]>([]);
    const [pieceFiles, setPieceFiles] = useState<Record<number, File | null>>({});
    const [piecePreviews, setPiecePreviews] = useState<Record<number, string>>({});
    const [pins, setPins] = useState<Pin[]>([]);
    const [activePinIndex, setActivePinIndex] = useState<number>(0);

    const previewBoxRef = useRef<HTMLDivElement | null>(null);
    const blobUrlsRef = useRef<Set<string>>(new Set());

    const trackBlobUrl = (url: string): string => {
        blobUrlsRef.current.add(url);
        return url;
    };

    const revokeBlobUrl = (url?: string | null) => {
        if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
            blobUrlsRef.current.delete(url);
        }
    };

    const revokeAllManagedBlobs = () => {
        blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        blobUrlsRef.current.clear();
    };

    useEffect(() => {
        return () => {
            revokeAllManagedBlobs();
        };
    }, []);

    const handleDialogOpenChange = (open: boolean) => {
        if (!open) {
            revokeAllManagedBlobs();
            setPiecePreviews({});
            setPieceFiles({});
            setModelImageFile(null);
            setFormErrors({});
        }
        setIsDialogOpen(open);
    };

    const openCreateLook = () => {
        revokeAllManagedBlobs();
        setEditingLook(null);
        setLookModalTab('info');
        setFormErrors({});
        setModelName('');
        setDescription('3 pieces · 1 shot');
        setSortOrder(looks.length + 1);
        setIsFeaturedOnHome(true);
        setIsActive(true);
        setModelImageFile(null);
        setModelPreviewUrl('');
        setPieces([
            { name: 'Top Garment', brand: 'Studio Label', image: '', tag: 'Top' },
            { name: 'Bottom Garment', brand: 'Studio Label', image: '', tag: 'Bottom' },
            { name: 'Footwear', brand: 'Studio Label', image: '', tag: 'Shoes' },
        ]);
        setPieceFiles({});
        setPiecePreviews({});
        setPins([
            { left: 50, top: 28 },
            { left: 50, top: 55 },
            { left: 50, top: 88 },
        ]);
        setActivePinIndex(0);
        setIsDialogOpen(true);
    };

    const openEditLook = (look: AdminTryOnLookItem) => {
        revokeAllManagedBlobs();
        setEditingLook(look);
        setLookModalTab('info');
        setFormErrors({});
        setModelName(look.modelName);
        setDescription(look.description || '3 pieces · 1 shot');
        setSortOrder(look.sortOrder ?? 1);
        setIsFeaturedOnHome(look.isFeaturedOnHome ?? true);
        setIsActive(look.isActive ?? true);
        setModelImageFile(null);
        setModelPreviewUrl(look.modelHiRes || look.model);
        setPieces(look.pieces.map((p) => ({ ...p })));
        setPieceFiles({});
        setPiecePreviews({});
        setPins(look.pins.map((p) => ({ ...p })));
        setActivePinIndex(0);
        setIsDialogOpen(true);
    };

    const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = '';
        if (!file) return;

        revokeBlobUrl(modelPreviewUrl);
        setModelImageFile(file);
        setModelPreviewUrl(trackBlobUrl(URL.createObjectURL(file)));
        setFormErrors((prev) => {
            if (!prev.model_image) return prev;
            const { model_image: _, ...rest } = prev;
            return rest;
        });
    };

    const handlePieceFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = '';
        if (!file) return;

        revokeBlobUrl(piecePreviews[idx]);
        const nextPreview = trackBlobUrl(URL.createObjectURL(file));

        setPieceFiles((prev) => ({ ...prev, [idx]: file }));
        setPiecePreviews((prev) => ({ ...prev, [idx]: nextPreview }));
        setFormErrors((prev) => {
            const next = { ...prev };
            delete next[`piece_images.${idx}`];
            return next;
        });
    };

    const handleClearPieceFile = (idx: number) => {
        revokeBlobUrl(piecePreviews[idx]);
        setPieceFiles((prev) => {
            const next = { ...prev };
            delete next[idx];
            return next;
        });
        setPiecePreviews((prev) => {
            const next = { ...prev };
            delete next[idx];
            return next;
        });
    };

    const handleAddPiece = () => {
        const nextIndex = pieces.length;
        setPieces((prev) => [
            ...prev,
            { name: `Piece #${prev.length + 1}`, brand: 'Studio Label', image: '', tag: 'Accessory' },
        ]);
        setPins((prev) => [...prev, { left: 50, top: 50 }]);
        setActivePinIndex(nextIndex);
    };

    const handleRemovePiece = (idx: number) => {
        if (pieces.length <= 1) return;
        revokeBlobUrl(piecePreviews[idx]);
        setPieces((prev) => prev.filter((_, i) => i !== idx));
        setPins((prev) => prev.filter((_, i) => i !== idx));
        setPieceFiles((prev) => shiftIndexMap(prev, idx));
        setPiecePreviews((prev) => shiftIndexMap(prev, idx));
        setActivePinIndex((prev) => {
            if (prev === idx) return Math.max(0, idx - 1);
            if (prev > idx) return prev - 1;
            return prev;
        });
    };

    const handlePieceFieldChange = (idx: number, field: keyof LookPiece, val: string) => {
        setPieces((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
        );
    };

    const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!previewBoxRef.current) return;
        const rect = previewBoxRef.current.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 100;
        const clickY = ((e.clientY - rect.top) / rect.height) * 100;

        const clampedLeft = Math.max(2, Math.min(98, Number(clickX.toFixed(1))));
        const clampedTop = Math.max(2, Math.min(98, Number(clickY.toFixed(1))));

        setPins((prev) =>
            prev.map((pin, idx) =>
                idx === activePinIndex ? { left: clampedLeft, top: clampedTop } : pin,
            ),
        );
    };

    const handleSaveLook = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});

        if (!modelName.trim()) {
            setLookModalTab('info');
            setFormErrors({ model_name: 'Please enter a model name in Step 1.' });
            return;
        }

        if (!editingLook && !modelImageFile) {
            setLookModalTab('info');
            setFormErrors({ model_image: 'Please upload a model cutout image in Step 1.' });
            return;
        }

        const invalidPieceIdx = pieces.findIndex((p) => !p.name.trim() || !p.brand.trim());
        if (invalidPieceIdx !== -1) {
            setLookModalTab('pins');
            setActivePinIndex(invalidPieceIdx);
            setFormErrors({
                pieces: `Piece #${invalidPieceIdx + 1} requires both a garment name and a brand.`,
            });
            return;
        }

        const validPieceFiles = Object.fromEntries(
            Object.entries(pieceFiles).filter(([, file]) => file instanceof File),
        );

        setIsSaving(true);

        const url = editingLook?.id
            ? `/admin/try-on-looks/${editingLook.id}`
            : '/admin/try-on-looks';

        router.post(
            url,
            {
                model_name: modelName,
                description,
                sort_order: sortOrder,
                is_featured_on_home: isFeaturedOnHome,
                is_active: isActive,
                model_image: modelImageFile,
                pieces: pieces as any,
                piece_images: validPieceFiles as any,
                pins: pins as any,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => handleDialogOpenChange(false),
                onError: (errors) => {
                    const flatErrors: Record<string, string> = {};
                    Object.entries(errors).forEach(([k, v]) => {
                        if (typeof v === 'string') flatErrors[k] = v;
                    });
                    setFormErrors(flatErrors);
                    if (flatErrors.model_name || flatErrors.model_image) {
                        setLookModalTab('info');
                    } else if (Object.keys(flatErrors).length > 0) {
                        setLookModalTab('pins');
                    }
                },
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const handleDeleteLook = (look: AdminTryOnLookItem) => {
        if (!look.id) return;
        if (!window.confirm(`Delete Virtual Try-On Look "${look.modelName}"?`)) {
            return;
        }
        router.delete(`/admin/try-on-looks/${look.id}`, { preserveScroll: true });
    };

    const featuredCount = useMemo(
        () => looks.filter((look) => look.isFeaturedOnHome).length,
        [looks],
    );

    const filteredLooks = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return looks.filter((look) => {
            if (homepageOnly && !look.isFeaturedOnHome) return false;
            if (!q) return true;
            return (
                look.modelName.toLowerCase().includes(q) ||
                (look.description || '').toLowerCase().includes(q) ||
                look.pieces.some(
                    (p) =>
                        p.name.toLowerCase().includes(q) ||
                        (p.tag || '').toLowerCase().includes(q),
                )
            );
        });
    }, [looks, searchQuery, homepageOnly]);

    const activePiece = pieces[activePinIndex] ?? pieces[0];
    const activePin = pins[activePinIndex] ?? { left: 50, top: 50 };
    const activePieceFile = pieceFiles[activePinIndex] ?? null;
    const activePiecePreview = piecePreviews[activePinIndex] || activePiece?.image || '';
    const errorMessages = Object.values(formErrors).filter(Boolean);

    return (
        <AdminLayout title="Virtual Try-On">
            <AdminPageHeader
                title="Virtual Try-On"
                description="Manage runway models, garment pieces, and interactive hotspot pins."
                actionLabel="Add Try-On Look"
                onActionClick={openCreateLook}
            />

            <div className="space-y-5">
                {/* Compact Search & Filter Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setHomepageOnly(false)}
                            className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                !homepageOnly
                                    ? 'bg-ink text-white'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:text-ink'
                            }`}
                        >
                            All ({looks.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setHomepageOnly(true)}
                            className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                homepageOnly
                                    ? 'bg-ink text-white'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:text-ink'
                            }`}
                        >
                            Homepage ({featuredCount})
                        </button>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by model or garment..."
                            className="bg-white pl-9 border-slate-200 text-ink"
                        />
                    </div>
                </div>

                {/* Looks Grid */}
                {filteredLooks.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200/90 bg-white px-6 py-12 text-center shadow-xs">
                        <p className="text-sm font-bold text-ink">No matching Virtual Try-On looks</p>
                        <p className="mt-1 text-xs text-slate-500">
                            Try clearing your search or switching the filter above.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredLooks.map((look) => (
                            <div
                                key={look.id ?? look.modelName}
                                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-shadow hover:shadow-md"
                            >
                                <div className="flex gap-4">
                                    <div className="h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#eef3f9]">
                                        <img
                                            src={look.model}
                                            alt={look.modelName}
                                            className="h-full w-full object-contain object-bottom"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <h3 className="truncate text-base font-bold text-ink">
                                                {look.modelName}
                                            </h3>
                                            {look.isFeaturedOnHome && (
                                                <Badge className="border-sky-200 bg-sky-50 text-[10px] text-sky-700">
                                                    Homepage
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-500">{look.description}</p>

                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                            {look.pieces.map((piece, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                                                >
                                                    <span className="font-bold text-primary">#{i + 1}</span>
                                                    <span className="truncate max-w-[110px]">
                                                        {piece.tag || piece.name}
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                    <span className="text-xs font-medium text-slate-500">
                                        {look.pieces.length} pieces · Order #{look.sortOrder ?? 1}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openEditLook(look)}
                                            className="min-h-10 sm:min-h-8 cursor-pointer border-slate-200 bg-white text-xs text-ink hover:bg-slate-50"
                                        >
                                            <Edit3 className="mr-1 h-3.5 w-3.5 text-primary" />
                                            Edit Look
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteLook(look)}
                                            aria-label={`Delete ${look.modelName}`}
                                            className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 cursor-pointer p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CREATE / EDIT LOOK MODAL — 2 CLEAN STEPS */}
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingLook
                                ? `Edit ${editingLook.modelName}`
                                : 'Add Virtual Try-On Look'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure model info, garment pieces, and click-to-place hotspot pins.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveLook} noValidate className="space-y-4 pt-1 text-xs">
                        {/* Validation Error Banner */}
                        {errorMessages.length > 0 && (
                            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                                <div className="space-y-0.5">
                                    {errorMessages.map((msg, idx) => (
                                        <p key={idx} className="font-medium">
                                            {msg}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Clean 2-Step Segmented Tabs */}
                        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
                            <button
                                type="button"
                                onClick={() => setLookModalTab('info')}
                                className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                                    lookModalTab === 'info'
                                        ? 'bg-white text-ink shadow-xs'
                                        : 'text-slate-600 hover:text-ink'
                                }`}
                            >
                                1. Model Info
                            </button>
                            <button
                                type="button"
                                onClick={() => setLookModalTab('pins')}
                                className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                                    lookModalTab === 'pins'
                                        ? 'bg-white text-ink shadow-xs'
                                        : 'text-slate-600 hover:text-ink'
                                }`}
                            >
                                2. Outfit Pieces &amp; Pins ({pieces.length})
                            </button>
                        </div>

                        {/* STEP 1: MODEL INFO */}
                        {lookModalTab === 'info' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className={LABEL_CLASS}>Model Name *</label>
                                        <input
                                            type="text"
                                            value={modelName}
                                            onChange={(e) => setModelName(e.target.value)}
                                            placeholder="e.g. John"
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABEL_CLASS}>Subtitle</label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="e.g. 3 pieces · 1 shot"
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                                    <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-[#eef3f9]">
                                        {modelPreviewUrl ? (
                                            <img
                                                src={modelPreviewUrl}
                                                alt={modelName || 'Model preview'}
                                                className="h-full w-full object-contain object-bottom"
                                            />
                                        ) : (
                                            <div className="grid h-full place-items-center p-2 text-center text-[11px] text-slate-500">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div>
                                            <label className="block text-xs font-bold text-ink">
                                                Model Cutout Image (PNG / WebP) {editingLook ? '' : '*'}
                                            </label>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Full-body portrait image used on the runway stage and pin editor.
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <label className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover">
                                                <Upload className="h-3.5 w-3.5" />
                                                <span>
                                                    {modelPreviewUrl ? 'Change Model Image' : 'Upload Model Image'}
                                                </span>
                                                <input
                                                    key="tryon-model-file"
                                                    type="file"
                                                    accept=".png,.webp,.jpg,.jpeg"
                                                    onChange={handleModelFileChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <span className="max-w-[200px] truncate text-xs text-slate-600">
                                                {modelImageFile
                                                    ? modelImageFile.name
                                                    : editingLook
                                                      ? 'Current image saved'
                                                      : 'No file selected'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                                    <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink">
                                        <input
                                            type="checkbox"
                                            checked={isFeaturedOnHome}
                                            onChange={(e) => setIsFeaturedOnHome(e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
                                        />
                                        Show on Homepage Runway
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-semibold text-slate-700">Order</label>
                                        <input
                                            type="number"
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(Number(e.target.value))}
                                            className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-ink focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: OUTFIT PIECES & FOCUSED PIN EDITOR */}
                        {lookModalTab === 'pins' && (
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                                {/* Left: Interactive Photo Pin Placement */}
                                <div className="space-y-2.5 lg:col-span-5">
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                        <Crosshair className="h-3.5 w-3.5 text-primary" />
                                        Tap photo to move Pin #{activePinIndex + 1}
                                    </span>

                                    <div
                                        ref={previewBoxRef}
                                        onClick={handlePreviewClick}
                                        className="relative aspect-[3/4] w-full max-w-[260px] mx-auto cursor-crosshair select-none overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-[#eef3f9] to-[#dce6f2]"
                                    >
                                        {modelPreviewUrl ? (
                                            <img
                                                src={modelPreviewUrl}
                                                alt="Model Pin Placement Preview"
                                                className="pointer-events-none h-full w-full object-contain object-bottom"
                                            />
                                        ) : (
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex h-full flex-col items-center justify-center gap-2.5 p-5 text-center"
                                            >
                                                <p className="text-xs font-medium text-slate-600">
                                                    Upload a model image to preview and place pins accurately.
                                                </p>
                                                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover">
                                                    <Upload className="h-3.5 w-3.5" />
                                                    <span>Upload Model Photo</span>
                                                    <input
                                                        key="tryon-model-file-step2"
                                                        type="file"
                                                        accept=".png,.webp,.jpg,.jpeg"
                                                        onChange={handleModelFileChange}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                        )}

                                        {pins.map((pin, idx) => {
                                            const isActivePin = activePinIndex === idx;
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActivePinIndex(idx);
                                                    }}
                                                    style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                                                    className={`absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold shadow-md transition-transform ${
                                                        isActivePin
                                                            ? 'scale-120 bg-primary text-white ring-2 ring-white'
                                                            : 'bg-ink text-white ring-2 ring-white'
                                                    }`}
                                                >
                                                    {idx + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right: Focused Piece Switcher & Single Active Piece Form */}
                                <div className="space-y-3 lg:col-span-7">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {pieces.map((piece, idx) => {
                                            const hasImage = Boolean(piecePreviews[idx] || piece.image);
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setActivePinIndex(idx)}
                                                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                                        activePinIndex === idx
                                                            ? 'border-primary bg-primary text-white shadow-xs'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:text-ink'
                                                    }`}
                                                >
                                                    <span>
                                                        #{idx + 1} {piece.tag || piece.name}
                                                    </span>
                                                    {hasImage && (
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${
                                                                activePinIndex === idx
                                                                    ? 'bg-white'
                                                                    : 'bg-emerald-500'
                                                            }`}
                                                            title="Image attached"
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                        <button
                                            type="button"
                                            onClick={handleAddPiece}
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add Piece
                                        </button>
                                    </div>

                                    {activePiece && (
                                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-ink">
                                                    Piece #{activePinIndex + 1} · Pin ({activePin.left}%, {activePin.top}%)
                                                </span>
                                                {pieces.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePiece(activePinIndex)}
                                                        className="cursor-pointer text-xs font-semibold text-rose-600 hover:underline"
                                                    >
                                                        Remove Piece
                                                    </button>
                                                )}
                                            </div>

                                            <div>
                                                <label className={LABEL_CLASS}>Garment Name *</label>
                                                <input
                                                    type="text"
                                                    value={activePiece.name}
                                                    onChange={(e) =>
                                                        handlePieceFieldChange(activePinIndex, 'name', e.target.value)
                                                    }
                                                    placeholder="e.g. Tailored Wool Blazer"
                                                    className={INPUT_CLASS}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                <div>
                                                    <label className={LABEL_CLASS}>Brand *</label>
                                                    <input
                                                        type="text"
                                                        value={activePiece.brand}
                                                        onChange={(e) =>
                                                            handlePieceFieldChange(activePinIndex, 'brand', e.target.value)
                                                        }
                                                        placeholder="Brand"
                                                        className={INPUT_CLASS}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={LABEL_CLASS}>Zone Label</label>
                                                    <input
                                                        type="text"
                                                        value={activePiece.tag || ''}
                                                        onChange={(e) =>
                                                            handlePieceFieldChange(activePinIndex, 'tag', e.target.value)
                                                        }
                                                        placeholder="Top / Bottom / Shoes"
                                                        className={INPUT_CLASS}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={LABEL_CLASS}>
                                                    Garment Image (Piece #{activePinIndex + 1})
                                                </label>
                                                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
                                                    {activePiecePreview ? (
                                                        <img
                                                            src={activePiecePreview}
                                                            alt={activePiece.name}
                                                            className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-contain p-0.5"
                                                        />
                                                    ) : (
                                                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                                                            <ImagePlus className="h-4 w-4" />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-slate-200">
                                                                <Upload className="h-3.5 w-3.5 text-primary" />
                                                                <span>
                                                                    {activePiecePreview ? 'Replace Image' : 'Choose Image'}
                                                                </span>
                                                                <input
                                                                    key={`piece-file-${activePinIndex}`}
                                                                    type="file"
                                                                    accept=".png,.webp,.jpg,.jpeg"
                                                                    onChange={(e) =>
                                                                        handlePieceFileChange(activePinIndex, e)
                                                                    }
                                                                    className="sr-only"
                                                                />
                                                            </label>
                                                            {activePieceFile && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleClearPieceFile(activePinIndex)}
                                                                    className="cursor-pointer text-[11px] font-semibold text-slate-500 hover:text-rose-600"
                                                                >
                                                                    Clear
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="truncate text-[11px] text-slate-500">
                                                            {activePieceFile
                                                                ? activePieceFile.name
                                                                : activePiece.image
                                                                  ? 'Current garment image saved'
                                                                  : 'No garment image selected'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-3">
                            <div>
                                {lookModalTab === 'info' ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setLookModalTab('pins')}
                                        className="min-h-10 sm:min-h-9 cursor-pointer text-xs gap-1.5"
                                    >
                                        <span>Next: Outfit &amp; Pins</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setLookModalTab('info')}
                                        className="min-h-10 sm:min-h-9 cursor-pointer text-xs"
                                    >
                                        Back to Info
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => handleDialogOpenChange(false)}
                                    className="min-h-10 sm:min-h-9 cursor-pointer text-xs text-slate-600 hover:bg-slate-100 hover:text-ink"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="min-h-10 sm:min-h-9 cursor-pointer bg-primary text-xs font-semibold text-white hover:bg-primary-hover"
                                >
                                    {isSaving ? 'Saving...' : 'Save Look'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
