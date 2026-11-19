import React, { useRef, useState } from 'react';
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
import { Look, LookPiece } from '@/Components/Landing/TryOn/looks';
import {
    Crosshair,
    Edit3,
    Plus,
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

const LABEL_CLASS = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500';
const INPUT_CLASS =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15';
const SMALL_INPUT_CLASS =
    'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none';

export default function AdminTryOnLooksIndex({ looks = [] }: PageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        setPieces((prev) => [
            ...prev,
            { name: `Piece #${prev.length + 1}`, brand: 'Brand', image: '', tag: 'Accessory' },
        ]);
        setPins((prev) => [...prev, { left: 50, top: 50 }]);
        setActivePinIndex(pieces.length);
    };

    const handleRemovePiece = (idx: number) => {
        if (pieces.length <= 1) return;
        setPieces((prev) => prev.filter((_, i) => i !== idx));
        setPins((prev) => prev.filter((_, i) => i !== idx));
        if (activePinIndex >= pieces.length - 1) {
            setActivePinIndex(0);
        }
    };

    const handlePieceFieldChange = (idx: number, field: keyof LookPiece, val: string) => {
        setPieces((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
        );
    };

    // Visual Click-to-Pin Handler on the Model Preview Box
    const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!previewBoxRef.current) return;
        const rect = previewBoxRef.current.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 100;
        const clickY = ((e.clientY - rect.top) / rect.height) * 100;

        const clampedLeft = Math.max(2, Math.min(98, Number(clickX.toFixed(1))));
        const clampedTop = Math.max(2, Math.min(98, Number(clickY.toFixed(1))));

        setPins((prev) =>
            prev.map((pin, idx) =>
                idx === activePinIndex ? { left: clampedLeft, top: clampedTop } : pin
            )
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
            }
        );
    };

    const handleDeleteLook = (look: AdminTryOnLookItem) => {
        if (!look.id) return;
        if (!window.confirm(`Delete Virtual Try-On Look "${look.modelName}"?`)) {
            return;
        }
        router.delete(`/admin/try-on-looks/${look.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Virtual Try-On Looks">
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <AdminPageHeader
                        title="Virtual Try-On Runway & Models"
                        description="Manage 2D Virtual Try-On runway models, outfit pieces, and interactive callout pins for Section 02 & the Virtual Try-On Quote page."
                    />

                    <Button
                        onClick={openCreateLook}
                        className="cursor-pointer bg-primary text-xs font-semibold text-white shadow-xs hover:bg-primary-hover"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Add Try-On Look
                    </Button>
                </div>

                {/* Looks Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {looks.map((look) => (
                        <div
                            key={look.id ?? look.modelName}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-md"
                        >
                            <div className="flex gap-4">
                                <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#eef3f9]">
                                    <img
                                        src={look.model}
                                        alt={look.modelName}
                                        className="h-full w-full object-contain object-bottom"
                                    />
                                    {/* Mini pin indicators */}
                                    {look.pins.map((pin, idx) => (
                                        <span
                                            key={idx}
                                            style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                                            className="absolute grid h-4 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-[9px] font-bold text-white ring-1 ring-white"
                                        >
                                            {idx + 1}
                                        </span>
                                    ))}
                                </div>

                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <Badge variant="accent" className="text-[10px]">
                                            MODEL: {look.modelName}
                                        </Badge>
                                        {look.isFeaturedOnHome && (
                                            <Badge className="border-sky-200 bg-sky-50 text-[10px] text-sky-700">
                                                HOMEPAGE
                                            </Badge>
                                        )}
                                    </div>

                                    <h3 className="truncate text-base font-bold text-ink">{look.modelName}</h3>
                                    <p className="text-xs text-slate-500">{look.description}</p>

                                    {/* Pieces list */}
                                    <div className="space-y-1 pt-1">
                                        {look.pieces.map((piece, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-1 text-[11px]"
                                            >
                                                <span className="font-bold text-primary">
                                                    #{i + 1}
                                                </span>
                                                <span className="truncate font-medium text-ink">
                                                    {piece.name}
                                                </span>
                                                <span className="ml-auto shrink-0 text-[10px] text-slate-500">
                                                    {piece.tag}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className="text-[11px] font-medium text-slate-500">
                                    Sort #{look.sortOrder ?? 1} • {look.pieces.length} Pins
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditLook(look)}
                                        className="h-8 cursor-pointer border-slate-200 bg-white text-xs text-ink hover:bg-slate-50"
                                    >
                                        <Edit3 className="mr-1 h-3.5 w-3.5 text-primary" />
                                        Edit &amp; Pins
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteLook(look)}
                                        className="h-8 w-8 cursor-pointer p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CREATE / EDIT VIRTUAL TRY-ON LOOK + VISUAL CLICK-TO-PIN DIALOG */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[88vh] sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingLook
                                ? `Edit Virtual Try-On Look — ${editingLook.modelName}`
                                : 'Add New Virtual Try-On Look'}
                        </DialogTitle>
                        <DialogDescription>
                            Select an outfit piece (#1, #2, #3) and click directly on the model image preview to place its callout pin.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveLook} className="grid grid-cols-1 gap-6 pt-1 text-xs lg:grid-cols-12">
                        {/* Left 5 Columns: Visual Interactive Pin Editor */}
                        <div className="space-y-3 lg:col-span-5">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                                    <Crosshair className="h-3.5 w-3.5" />
                                    Click Model to Place Pin #{activePinIndex + 1}
                                </span>
                            </div>

                            {/* Pin Switcher Pills */}
                            <div className="flex flex-wrap gap-1.5">
                                {pieces.map((piece, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActivePinIndex(idx)}
                                        className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                            activePinIndex === idx
                                                ? 'border-primary bg-primary text-white shadow-xs'
                                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-ink'
                                        }`}
                                    >
                                        Pin #{idx + 1}: {piece.tag || piece.name}
                                    </button>
                                ))}
                            </div>

                            {/* Interactive Preview Box */}
                            <div
                                ref={previewBoxRef}
                                onClick={handlePreviewClick}
                                className="relative aspect-[3/4] w-full cursor-crosshair select-none overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-[#eef3f9] to-[#dce6f2]"
                            >
                                {modelPreviewUrl ? (
                                    <img
                                        src={modelPreviewUrl}
                                        alt="Model Pin Placement Preview"
                                        className="pointer-events-none h-full w-full object-contain object-bottom"
                                    />
                                ) : (
                                    <div className="grid h-full place-items-center p-6 text-center text-xs text-slate-600">
                                        Upload a Model Cutout Image on the right to preview &amp; place pins
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
                                            className={`absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold shadow-lg transition-transform ${
                                                isActivePin
                                                    ? 'scale-125 bg-primary text-white ring-2 ring-white'
                                                    : 'bg-ink text-white ring-2 ring-white'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <label className={LABEL_CLASS}>
                                    Model Cutout Image (PNG / WebP) {editingLook ? '' : '*'}
                                </label>
                                <input
                                    type="file"
                                    required={!editingLook}
                                    accept=".png,.webp,.jpg,.jpeg"
                                    onChange={handleModelFileChange}
                                    className="block w-full text-xs text-slate-600 file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-primary-hover"
                                />
                            </div>
                        </div>

                        {/* Right 7 Columns: Look Info & Garment Pieces Repeater */}
                        <div className="space-y-4 lg:col-span-7">
                            <div>
                                <label className={LABEL_CLASS}>
                                    Model Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                    placeholder="e.g. John"
                                    className={INPUT_CLASS}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className={LABEL_CLASS}>
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
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
                                    Homepage Runway
                                </label>
                            </div>

                            {/* Outfit Pieces Repeater */}
                            <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink">
                                        Outfit Pieces &amp; Callout Cards ({pieces.length})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleAddPiece}
                                        className="cursor-pointer rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-primary/15"
                                    >
                                        + Add Piece
                                    </button>
                                </div>

                                <div className="max-h-[42vh] space-y-2.5 overflow-y-auto pr-1">
                                    {pieces.map((piece, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActivePinIndex(idx)}
                                            className={`rounded-xl border p-3 transition-colors ${
                                                activePinIndex === idx
                                                    ? 'border-primary/50 bg-primary/5'
                                                    : 'border-slate-200 bg-white'
                                            }`}
                                        >
                                            <div className="mb-2 flex items-center justify-between text-[11px]">
                                                <span className="font-bold text-primary">
                                                    Piece #{idx + 1} — Pin ({pins[idx]?.left ?? 50}%, {pins[idx]?.top ?? 50}%)
                                                </span>
                                                {pieces.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemovePiece(idx);
                                                        }}
                                                        className="cursor-pointer font-semibold text-rose-600 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                                <input
                                                    type="text"
                                                    required
                                                    value={piece.name}
                                                    onChange={(e) =>
                                                        handlePieceFieldChange(idx, 'name', e.target.value)
                                                    }
                                                    placeholder="Garment Name"
                                                    className={SMALL_INPUT_CLASS}
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    value={piece.brand}
                                                    onChange={(e) =>
                                                        handlePieceFieldChange(idx, 'brand', e.target.value)
                                                    }
                                                    placeholder="Brand"
                                                    className={SMALL_INPUT_CLASS}
                                                />
                                                <input
                                                    type="text"
                                                    value={piece.tag || ''}
                                                    onChange={(e) =>
                                                        handlePieceFieldChange(idx, 'tag', e.target.value)
                                                    }
                                                    placeholder="Zone (Top / Bottom / Shoes)"
                                                    className={SMALL_INPUT_CLASS}
                                                />
                                            </div>

                                            <div className="mt-2 flex items-center gap-3">
                                                {piece.image && (
                                                    <img
                                                        src={piece.image}
                                                        alt={piece.name}
                                                        className="h-9 w-9 rounded border border-slate-200 bg-white object-contain p-0.5"
                                                    />
                                                )}
                                                <input
                                                    type="file"
                                                    accept=".png,.webp,.jpg,.jpeg"
                                                    onChange={(e) =>
                                                        setPieceFiles((prev) => ({
                                                            ...prev,
                                                            [idx]: e.target.files?.[0] ?? null,
                                                        }))
                                                    }
                                                    className="block w-full text-[11px] text-slate-600 file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-slate-100 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-ink hover:file:bg-slate-200"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="cursor-pointer text-xs text-slate-600 hover:bg-slate-100 hover:text-ink"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="cursor-pointer bg-primary text-xs font-semibold text-white hover:bg-primary-hover"
                                >
                                    {isSaving ? 'Saving...' : 'Save Try-On Look'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

