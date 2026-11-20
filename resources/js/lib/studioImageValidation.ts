export interface StudioImageSpec {
    label: string;
    ratioLabel: string;
    recommendedSize: string;
    minWidth: number;
    minHeight: number;
    minRatio: number;
    maxRatio: number;
    maxBytes: number;
}

export interface StudioImageValidationResult {
    valid: boolean;
    error?: string;
    warning?: string;
    width?: number;
    height?: number;
    hasTransparency?: boolean;
}

const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['png', 'webp']);

export const STUDIO_IMAGE_SPECS = {
    tryOnModel: {
        label: 'Full-body model photo',
        ratioLabel: '9:16 portrait',
        recommendedSize: '1080×1920',
        minWidth: 540,
        minHeight: 960,
        minRatio: 0.5,
        maxRatio: 0.63,
        maxBytes: MAX_BYTES,
    },
    tryOnPiece: {
        label: 'Garment cutout image',
        ratioLabel: '1:1 or 3:4',
        recommendedSize: '800×800',
        minWidth: 400,
        minHeight: 400,
        minRatio: 0.65,
        maxRatio: 1.15,
        maxBytes: MAX_BYTES,
    },
    twinModel: {
        label: 'Main model image',
        ratioLabel: '9:16 portrait',
        recommendedSize: '1080×1920',
        minWidth: 450,
        minHeight: 900,
        minRatio: 0.3,
        maxRatio: 0.65,
        maxBytes: MAX_BYTES,
    },
    twinPose: {
        label: 'Pose image',
        ratioLabel: '3:4 or 9:16',
        recommendedSize: '900×1200',
        minWidth: 450,
        minHeight: 600,
        minRatio: 0.4,
        maxRatio: 0.85,
        maxBytes: MAX_BYTES,
    },
} satisfies Record<string, StudioImageSpec>;

function hasAllowedFormat(file: File): boolean {
    const type = file.type.toLowerCase();
    if (type && ALLOWED_MIME_TYPES.has(type)) {
        return true;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    return ALLOWED_EXTENSIONS.has(ext);
}

function loadImageElement(objectUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Could not decode image file.'));
        img.src = objectUrl;
    });
}

function detectCornerTransparency(img: HTMLImageElement): boolean {
    try {
        const sampleWidth = Math.min(64, Math.max(2, img.naturalWidth));
        const sampleHeight = Math.max(
            2,
            Math.round((img.naturalHeight / Math.max(1, img.naturalWidth)) * sampleWidth),
        );
        const canvas = document.createElement('canvas');
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
            return true;
        }

        ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

        const corners: [number, number][] = [
            [0, 0],
            [sampleWidth - 1, 0],
            [0, sampleHeight - 1],
            [sampleWidth - 1, sampleHeight - 1],
        ];

        const alphas = corners.map(([x, y]) => ctx.getImageData(x, y, 1, 1).data[3]);
        const allCornersOpaque = alphas.every((alpha) => alpha >= 250);
        return !allCornersOpaque;
    } catch {
        return true;
    }
}

/**
 * Validates format (PNG/WebP), file size, minimum resolution, aspect ratio,
 * and checks corners for transparency before accepting studio uploads.
 */
export async function validateStudioImage(
    file: File,
    spec: StudioImageSpec,
): Promise<StudioImageValidationResult> {
    if (!hasAllowedFormat(file)) {
        return {
            valid: false,
            error: 'PNG or WebP only (transparent background).',
        };
    }

    if (file.size > spec.maxBytes) {
        const maxMb = Math.round(spec.maxBytes / (1024 * 1024));
        return {
            valid: false,
            error: `Max file size is ${maxMb} MB.`,
        };
    }

    const objectUrl = URL.createObjectURL(file);

    try {
        const img = await loadImageElement(objectUrl);
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (width <= 0 || height <= 0) {
            return {
                valid: false,
                error: 'Invalid PNG or WebP image.',
            };
        }

        const ratio = width / height;
        if (spec.maxRatio < 1 && width > height) {
            return {
                valid: false,
                width,
                height,
                error: `Use a vertical portrait — landscape (${width}×${height}) is not allowed.`,
            };
        }

        if (ratio < spec.minRatio || ratio > spec.maxRatio) {
            return {
                valid: false,
                width,
                height,
                error: `Wrong ratio (${width}×${height}). Use ${spec.ratioLabel} (${spec.recommendedSize}).`,
            };
        }

        if (width < spec.minWidth || height < spec.minHeight) {
            return {
                valid: false,
                width,
                height,
                error: `Too small (${width}×${height}). Min ${spec.minWidth}×${spec.minHeight} px.`,
            };
        }

        const hasTransparency = detectCornerTransparency(img);

        return {
            valid: true,
            width,
            height,
            hasTransparency,
            warning: hasTransparency
                ? undefined
                : 'Solid background detected — transparent PNG/WebP looks best.',
        };
    } catch {
        return {
            valid: false,
            error: 'Invalid PNG or WebP image.',
        };
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}
