import React, { useMemo, useRef, useState } from 'react';
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
    ArrowRight,
    Crosshair,
    Edit3,
    Plus,
    Search,
    Trash2,
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

export default function AdminTryOnLooksIndex({ looks = [] }: PageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [homepageOnly, setHomepageOnly] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [lookModalTab, setLookModalTab] = useState<'info' | 'pins'>('info');
    const [editingLook, setEditingLook] = useState<AdminTryOnLookItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);

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
    const [pins, setPins] = useState<Pin[]>([]);
    const [activePinIndex, setActivePinIndex] = useState<number>(0);

    const previewBoxRef = useRef<HTMLDivElement | null>(null);

    const openCreateLook = () => {
        setEditingLook(null);
        setLookModalTab('info');
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
        setPins([
            { left: 50, top: 28 },
            { left: 50, top: 55 },
            { left: 50, top: 88 },
        ]);
        setActivePinIndex(0);
        setIsDialogOpen(true);
    };

    const openEditLook = (look: AdminTryOnLookItem) => {
        setEditingLook(look);
        setLookModalTab('info');
        setModelName(look.modelName);
        setDescription(look.description || '3 pieces · 1 shot');
        setSortOrder(look.sortOrder ?? 1);
        setIsFeaturedOnHome(look.isFeaturedOnHome ?? true);
        setIsActive(look.isActive ?? true);
        setModelImageFile(null);
        setModelPreviewUrl(look.modelHiRes || look.model);
        setPieces(look.pieces.map((p) => ({ ...p })));
        setPieceFiles({});
        setPins(look.pins.map((p) => ({ ...p })));
        setActivePinIndex(0);
        setIsDialogOpen(true);
    };

    const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setModelImageFile(file);
        if (file) {
            setModelPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAddPiece = () => {
        const nextIndex = pieces.length;
        setPieces((prev) => [
            ...prev,
            { name: `Piece #${prev.length + 1}`, brand: 'Brand', image: '', tag: 'Accessory' },
        ]);
        setPins((prev) => [...prev, { left: 50, top: 50 }]);
        setActivePinIndex(nextIndex);
    };

    const handleRemovePiece = (idx: number) => {
        if (pieces.length <= 1) return;
        setPieces((prev) => prev.filter((_, i) => i !== idx));
        setPins((prev) => prev.filter((_, i) => i !== idx));
        setActivePinIndex((prev) => (prev >= pieces.length - 1 ? 0 : prev));
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
                piece_images: pieceFiles as any,
                pins: pins as any,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => setIsDialogOpen(false),
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

                    <form onSubmit={handleSaveLook} className="space-y-4 pt-1 text-xs">
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
                                            required
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
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <label className="block text-xs font-bold text-ink">
                                            Model Cutout Image (PNG / WebP) {editingLook ? '' : '*'}
                                        </label>
                                        <p className="text-xs text-slate-500">
                                            Full-body portrait image used on the runway stage and pin editor.
                                        </p>
                                        <input
                                            type="file"
                                            required={!editingLook}
                                            accept=".png,.webp,.jpg,.jpeg"
                                            onChange={handleModelFileChange}
                                            className="block w-full text-xs text-slate-600 file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-3.5 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-primary-hover"
                                        />
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
                                            <div className="grid h-full place-items-center p-6 text-center text-xs text-slate-600">
                                                Upload a model image in Step 1 to place pins
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
                                        {pieces.map((piece, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActivePinIndex(idx)}
                                                className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                                    activePinIndex === idx
                                                        ? 'border-primary bg-primary text-white shadow-xs'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:text-ink'
                                                }`}
                                            >
                                                #{idx + 1} {piece.tag || piece.name}
                                            </button>
                                        ))}
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
                                                    required
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
                                                        required
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
                                                <label className={LABEL_CLASS}>Garment Image</label>
                                                <div className="flex items-center gap-3">
                                                    {activePiece.image && (
                                                        <img
                                                            src={activePiece.image}
                                                            alt={activePiece.name}
                                                            className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-0.5"
                                                        />
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept=".png,.webp,.jpg,.jpeg"
                                                        onChange={(e) =>
                                                            setPieceFiles((prev) => ({
                                                                ...prev,
                                                                [activePinIndex]: e.target.files?.[0] ?? null,
                                                            }))
                                                        }
                                                        className="block w-full text-xs text-slate-600 file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink hover:file:bg-slate-300"
                                                    />
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
                                    onClick={() => setIsDialogOpen(false)}
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
