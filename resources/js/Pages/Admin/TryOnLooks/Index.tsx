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
import { Look, OutfitPiece, Pin } from '@/Components/Landing/TryOn/looks';
import {
    Crosshair,
    Edit3,
    Plus,
    Shirt,
    Sparkles,
    Trash2,
} from 'lucide-react';

interface AdminTryOnLookItem extends Look {
    isFeaturedOnHome?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}

interface PageProps {
    looks: AdminTryOnLookItem[];
}

export default function AdminTryOnLooksIndex({ looks = [] }: PageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLook, setEditingLook] = useState<AdminTryOnLookItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [modelName, setModelName] = useState('');
    const [description, setDescription] = useState('');
    const [sortOrder, setSortOrder] = useState(1);
    const [isFeaturedOnHome, setIsFeaturedOnHome] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [modelImageFile, setModelImageFile] = useState<File | null>(null);
    const [modelPreviewUrl, setModelPreviewUrl] = useState<string>('');

    const [pieces, setPieces] = useState<OutfitPiece[]>([]);
    const [pieceFiles, setPieceFiles] = useState<Record<number, File | null>>({});
    const [pins, setPins] = useState<Pin[]>([]);
    const [activePinIndex, setActivePinIndex] = useState<number>(0);

    const previewBoxRef = useRef<HTMLDivElement | null>(null);

    const openCreateLook = () => {
        setEditingLook(null);
        setName('');
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
        setName(look.name);
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

    const handlePieceFieldChange = (idx: number, field: keyof OutfitPiece, val: string) => {
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
                name,
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
        if (!window.confirm(`Delete Virtual Try-On Look "${look.name}" (${look.modelName})?`)) {
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
                        description="Manage 3D ring-runway models, outfit pieces, and interactive callout pins for Section 02 & the Virtual Try-On Quote page."
                    />

                    <Button
                        onClick={openCreateLook}
                        className="bg-accent font-mono text-xs font-bold text-black hover:bg-accent/90"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Add Try-On Look
                    </Button>
                </div>

                {/* Looks Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {looks.map((look) => (
                        <div
                            key={look.id ?? look.name}
                            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#12141a] p-4"
                        >
                            <div className="flex gap-4">
                                <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#eef3f9]">
                                    <img
                                        src={look.model}
                                        alt={`${look.modelName} — ${look.name}`}
                                        className="h-full w-full object-contain object-bottom"
                                    />
                                    {/* Mini pin indicators */}
                                    {look.pins.map((pin, idx) => (
                                        <span
                                            key={idx}
                                            style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                                            className="absolute -translate-x-1/2 -translate-y-1/2 grid h-4 w-4 place-items-center rounded-full bg-black text-[9px] font-bold text-white ring-1 ring-white"
                                        >
                                            {idx + 1}
                                        </span>
                                    ))}
                                </div>

                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <Badge className="border-accent/40 bg-accent/15 font-mono text-[10px] text-accent">
                                            MODEL: {look.modelName}
                                        </Badge>
                                        {look.isFeaturedOnHome && (
                                            <Badge className="border-[#00f5ff]/40 bg-[#00f5ff]/10 font-mono text-[10px] text-[#00f5ff]">
                                                HOMEPAGE
                                            </Badge>
                                        )}
                                    </div>

                                    <h3 className="truncate text-base font-bold text-white">{look.name}</h3>
                                    <p className="font-mono text-xs text-white/50">{look.description}</p>

                                    {/* Pieces list */}
                                    <div className="space-y-1 pt-1">
                                        {look.pieces.map((piece, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2 py-1 text-[11px]"
                                            >
                                                <span className="font-mono font-bold text-accent">
                                                    #{i + 1}
                                                </span>
                                                <span className="truncate font-medium text-white">
                                                    {piece.name}
                                                </span>
                                                <span className="ml-auto shrink-0 font-mono text-[10px] text-white/50">
                                                    {piece.tag}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                                <span className="font-mono text-[11px] text-white/50">
                                    Sort #{look.sortOrder ?? 1} • {look.pieces.length} Pins
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditLook(look)}
                                        className="h-8 border-white/10 bg-white/5 font-mono text-xs text-white hover:bg-white/10"
                                    >
                                        <Edit3 className="mr-1 h-3.5 w-3.5 text-[#00f5ff]" />
                                        Edit &amp; Pins
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteLook(look)}
                                        className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10"
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
                <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto border-white/15 bg-[#0f1117] text-white">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-base font-bold">
                            {editingLook
                                ? `Edit Virtual Try-On Look — ${editingLook.modelName} (${editingLook.name})`
                                : 'Add New Virtual Try-On Look'}
                        </DialogTitle>
                        <DialogDescription className="font-mono text-xs text-white/60">
                            Select an outfit piece (#1, #2, #3) and click directly on the model image preview to place its callout pin.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveLook} className="grid grid-cols-1 gap-6 py-2 text-xs lg:grid-cols-12">
                        {/* Left 5 Columns: Visual Interactive Pin Editor */}
                        <div className="space-y-3 lg:col-span-5">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase text-accent">
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
                                        className={`cursor-pointer rounded-lg border px-2.5 py-1 font-mono text-[11px] font-bold transition-all ${
                                            activePinIndex === idx
                                                ? 'border-accent bg-accent text-black'
                                                : 'border-white/15 bg-white/5 text-white/70 hover:text-white'
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
                                className="relative aspect-[3/4] w-full cursor-crosshair select-none overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-[#eef3f9] to-[#dce6f2]"
                            >
                                {modelPreviewUrl ? (
                                    <img
                                        src={modelPreviewUrl}
                                        alt="Model Pin Placement Preview"
                                        className="pointer-events-none h-full w-full object-contain object-bottom"
                                    />
                                ) : (
                                    <div className="grid h-full place-items-center p-6 text-center font-mono text-xs text-slate-600">
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
                                            className={`absolute -translate-x-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full font-mono text-xs font-bold shadow-lg transition-transform ${
                                                isActivePin
                                                    ? 'scale-125 bg-accent text-black ring-2 ring-black'
                                                    : 'bg-black text-white ring-2 ring-white'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                    Model Cutout Image (PNG / WebP) {editingLook ? '' : '*'}
                                </label>
                                <input
                                    type="file"
                                    required={!editingLook}
                                    accept=".png,.webp,.jpg,.jpeg"
                                    onChange={handleModelFileChange}
                                    className="block w-full text-xs text-white file:mr-2 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-1.5 file:font-mono file:text-xs file:font-bold file:text-black"
                                />
                            </div>
                        </div>

                        {/* Right 7 Columns: Look Info & Garment Pieces Repeater */}
                        <div className="space-y-4 lg:col-span-7">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                        Model Name (Shown on Quote Selector) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={modelName}
                                        onChange={(e) => setModelName(e.target.value)}
                                        placeholder="e.g. Elena"
                                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                        Look Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Look 01 — Trench"
                                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block font-mono text-[10px] uppercase text-white/60">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
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
                                    Homepage Runway
                                </label>
                            </div>

                            {/* Outfit Pieces Repeater */}
                            <div className="space-y-2.5 rounded-xl border border-white/10 bg-black/40 p-3.5">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[11px] font-bold uppercase text-[#00f5ff]">
                                        Outfit Pieces &amp; Callout Cards ({pieces.length})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleAddPiece}
                                        className="cursor-pointer rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[11px] font-bold text-accent hover:bg-accent/20"
                                    >
                                        + Add Piece
                                    </button>
                                </div>

                                <div className="space-y-2.5 max-h-[42vh] overflow-y-auto pr-1">
                                    {pieces.map((piece, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActivePinIndex(idx)}
                                            className={`rounded-xl border p-3 transition-colors ${
                                                activePinIndex === idx
                                                    ? 'border-accent/60 bg-accent/5'
                                                    : 'border-white/10 bg-white/5'
                                            }`}
                                        >
                                            <div className="mb-2 flex items-center justify-between font-mono text-[11px]">
                                                <span className="font-bold text-accent">
                                                    Piece #{idx + 1} — Pin ({pins[idx]?.left ?? 50}%, {pins[idx]?.top ?? 50}%)
                                                </span>
                                                {pieces.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemovePiece(idx);
                                                        }}
                                                        className="cursor-pointer text-rose-400 hover:underline"
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
                                                    className="rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs text-white"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    value={piece.brand}
                                                    onChange={(e) =>
                                                        handlePieceFieldChange(idx, 'brand', e.target.value)
                                                    }
                                                    placeholder="Brand"
                                                    className="rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs text-white"
                                                />
                                                <input
                                                    type="text"
                                                    value={piece.tag || ''}
                                                    onChange={(e) =>
                                                        handlePieceFieldChange(idx, 'tag', e.target.value)
                                                    }
                                                    placeholder="Zone (Top / Bottom / Shoes)"
                                                    className="rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs text-white"
                                                />
                                            </div>

                                            <div className="mt-2 flex items-center gap-3">
                                                {piece.image && (
                                                    <img
                                                        src={piece.image}
                                                        alt={piece.name}
                                                        className="h-9 w-9 rounded border border-white/10 bg-white object-contain p-0.5"
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
                                                    className="block w-full text-[10px] text-white/70 file:mr-2 file:rounded file:border-0 file:bg-white/10 file:px-2 file:py-1 file:text-[10px] file:text-white"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="font-mono text-xs text-white/60"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-accent font-mono text-xs font-bold text-black hover:bg-accent/90"
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

