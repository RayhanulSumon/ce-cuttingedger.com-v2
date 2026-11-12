export const TWIN_MODELS_SPRITE =
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042056_1a704ff7-b0e5-4a9f-bbda-62392b819fb6.png&w=3840&q=85';

export const TWIN_PIECES_SPRITE =
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042057_080e85b0-b4aa-4072-8eb9-2304c7baf42b.png&w=2400&q=85';

export const TWIN_Y0 = 48;
export const TWIN_Y1 = 496;
export const TWIN_FIRST_LOOK = 15;

export interface TwinPosePreset {
    id: string;
    code: string;
    title: string;
    angle: string;
    lens: string;
    /** Normalized crop within the model's bounding box [yStartFrac, yEndFrac] and optional mirror/scale */
    yStartFrac: number;
    yEndFrac: number;
    xPadFrac?: number;
    mirror?: boolean;
    tiltDeg?: number;
    backdrop: string;
}

export interface DigitalTwinModel {
    index: number;
    lookNumber: number;
    x0: number;
    x1: number;
    name: string;
    archetype: string;
    collection: string;
    presetPrice: string;
    customOrderPrice: string;
    lifetimePrice: string;
    /** True once the full copyright has been bought — the model is no longer available for lifetime purchase. */
    isCopyrightSold: boolean;
    /** ISO date the twin was first listed (mock data). */
    listedAt: string;
    /** Total preset downloads so far (mock data). */
    downloadCount: number;
    description: string;
    deliverables: string[];
    featuredPieces: { name: string; price: string; box: [number, number, number, number] }[];
    poses: TwinPosePreset[];
}

const DEFAULT_POSES: TwinPosePreset[] = [
    {
        id: 'pose-01',
        code: 'POSE 01',
        title: 'Full-Length Runway Walk',
        angle: 'Eye-Level Front · Full Body',
        lens: '85mm f/2.0 Studio Prime',
        yStartFrac: 0,
        yEndFrac: 1,
        xPadFrac: 0.04,
        backdrop: 'linear-gradient(180deg, #eef3f9 0%, #dde7f2 65%, #f7f9fc 100%)',
    },
    {
        id: 'pose-02',
        code: 'POSE 02',
        title: 'Three-Quarter Editorial',
        angle: 'Three-Quarter Mid-Length',
        lens: '70mm f/2.8 Soft Key',
        yStartFrac: 0.01,
        yEndFrac: 0.72,
        xPadFrac: 0.02,
        backdrop: 'linear-gradient(180deg, #f3efe9 0%, #e5dfd5 68%, #faf8f5 100%)',
    },
    {
        id: 'pose-03',
        code: 'POSE 03',
        title: 'Portrait & Collar Drape',
        angle: 'Close-Up Bust & Neckline',
        lens: '105mm f/2.8 Macro Portrait',
        yStartFrac: 0.0,
        yEndFrac: 0.44,
        xPadFrac: 0.08,
        backdrop: 'linear-gradient(180deg, #e9eff6 0%, #d7e2ee 70%, #f4f7fb 100%)',
    },
    {
        id: 'pose-04',
        code: 'POSE 04',
        title: 'Counter-Turn Silhouette',
        angle: 'Mirrored Studio Stance',
        lens: '85mm f/2.0 Contre-Jour',
        yStartFrac: 0,
        yEndFrac: 1,
        xPadFrac: 0.04,
        mirror: true,
        backdrop: 'linear-gradient(180deg, #edf1f5 0%, #dce3ec 65%, #f8fafc 100%)',
    },
    {
        id: 'pose-05',
        code: 'POSE 05',
        title: 'Waist & Garment Detail',
        angle: 'Mid-Torso & Tailoring Crop',
        lens: '90mm f/4.0 Studio Strobe',
        yStartFrac: 0.16,
        yEndFrac: 0.68,
        xPadFrac: 0.05,
        backdrop: 'linear-gradient(180deg, #f0f4f8 0%, #dfe7f0 68%, #f9fbfd 100%)',
    },
    {
        id: 'pose-06',
        code: 'POSE 06',
        title: 'Dynamic Runway Stride',
        angle: 'Low-Angle Full-Body Motion',
        lens: '50mm f/1.8 Editorial Wide',
        yStartFrac: 0.08,
        yEndFrac: 1.0,
        xPadFrac: 0.03,
        mirror: true,
        tiltDeg: -1.5,
        backdrop: 'linear-gradient(180deg, #eaeff5 0%, #d8e2ee 65%, #f5f8fc 100%)',
    },
];

export const DIGITAL_TWINS: DigitalTwinModel[] = [
    {
        index: 0,
        lookNumber: 15,
        x0: 12,
        x1: 176,
        name: 'Aurelia V. — Feather & Satin Twin',
        archetype: 'High-Fashion Editorial Twin',
        collection: 'Spring Summer 2027 · Look 15',
        presetPrice: '$149',
        customOrderPrice: '$290',
        lifetimePrice: '$490',
        isCopyrightSold: false,
        listedAt: '2026-06-20',
        downloadCount: 1284,
        description:
            'Photoreal AI digital twin trained for structured outerwear, feather textures, and fluid satin trousers with 6 pre-lit studio pose rigs.',
        deliverables: ['6 Multi-Angle Pose Presets (8K PNG/TIFF)', 'Layered PSD + Garment UV Smart Masks', 'Commercial Global Campaign License'],
        featuredPieces: [
            { name: 'Feather Jacket', price: '$2,900', box: [26, 224, 28, 214] },
            { name: 'Satin Wide Leg Trousers', price: '$1,450', box: [304, 412, 22, 236] },
        ],
        poses: DEFAULT_POSES,
    },
    {
        index: 1,
        lookNumber: 16,
        x0: 178,
        x1: 330,
        name: 'Celeste M. — Pleated Couture Twin',
        archetype: 'Runway & Lookbook Twin',
        collection: 'Spring Summer 2027 · Look 16',
        presetPrice: '$149',
        customOrderPrice: '$290',
        lifetimePrice: '$490',
        isCopyrightSold: true,
        listedAt: '2026-03-09',
        downloadCount: 3416,
        description:
            'Engineered for micro-pleated dresses, metallic waist accents, and soft evening movement across e-commerce and lookbook campaigns.',
        deliverables: ['6 Multi-Angle Pose Presets (8K PNG/TIFF)', 'Layered PSD + Garment UV Smart Masks', 'Commercial Global Campaign License'],
        featuredPieces: [
            { name: 'Pleated Dress', price: '$2,200', box: [530, 666, 12, 242] },
            { name: 'Gold Waist Belt', price: '$420', box: [752, 922, 100, 146] },
        ],
        poses: DEFAULT_POSES,
    },
    {
        index: 2,
        lookNumber: 17,
        x0: 331,
        x1: 470,
        name: 'Sora K. — Trench & Leather Twin',
        archetype: 'Luxury Tailoring Twin',
        collection: 'Spring Summer 2027 · Look 17',
        presetPrice: '$149',
        customOrderPrice: '$290',
        lifetimePrice: '$490',
        isCopyrightSold: false,
        listedAt: '2026-09-02',
        downloadCount: 542,
        description:
            'Calibrated for satin trench silhouettes, structured leather accessories, and crisp architectural shadows in full-frame studio lighting.',
        deliverables: ['6 Multi-Angle Pose Presets (8K PNG/TIFF)', 'Layered PSD + Garment UV Smart Masks', 'Commercial Global Campaign License'],
        featuredPieces: [
            { name: 'Satin Trench Dress', price: '$2,350', box: [70, 176, 246, 466] },
            { name: 'Top Handle Bag', price: '$980', box: [294, 422, 294, 432] },
        ],
        poses: DEFAULT_POSES,
    },
    {
        index: 3,
        lookNumber: 18,
        x0: 476,
        x1: 633,
        name: 'Elena R. — Silk & Drape Twin',
        archetype: 'Soft Silhouette Twin',
        collection: 'Spring Summer 2027 · Look 18',
        presetPrice: '$149',
        customOrderPrice: '$290',
        lifetimePrice: '$490',
        isCopyrightSold: false,
        listedAt: '2026-01-15',
        downloadCount: 2871,
        description:
            'Designed for billow-sleeve organza, sheer silk blouses, and tie-waist resort trousers with natural skin-to-fabric subsurface scattering.',
        deliverables: ['6 Multi-Angle Pose Presets (8K PNG/TIFF)', 'Layered PSD + Garment UV Smart Masks', 'Commercial Global Campaign License'],
        featuredPieces: [
            { name: 'Billow Sleeve Blouse', price: '$860', box: [508, 688, 240, 452] },
            { name: 'Tie Waist Trousers', price: '$740', box: [780, 890, 252, 466] },
        ],
        poses: DEFAULT_POSES,
    },
    {
        index: 4,
        lookNumber: 19,
        x0: 634,
        x1: 767,
        name: 'Noemi L. — Overcoat & Tailored Twin',
        archetype: 'Minimalist Runway Twin',
        collection: 'Spring Summer 2027 · Look 19',
        presetPrice: '$149',
        customOrderPrice: '$290',
        lifetimePrice: '$490',
        isCopyrightSold: true,
        listedAt: '2025-11-28',
        downloadCount: 4903,
        description:
            'Built for longline powder coats, ivory straight-leg tailoring, and clean Scandinavian studio aesthetics with zero reshoot overhead.',
        deliverables: ['6 Multi-Angle Pose Presets (8K PNG/TIFF)', 'Layered PSD + Garment UV Smart Masks', 'Commercial Global Campaign License'],
        featuredPieces: [
            { name: 'Powder Long Coat', price: '$1,980', box: [64, 178, 484, 698] },
            { name: 'Ivory Straight Trousers', price: '$690', box: [316, 396, 482, 698] },
        ],
        poses: DEFAULT_POSES,
    },
    {
        index: 5,
        lookNumber: 20,
        x0: 767,
        x1: 956,
        name: 'Valentina D. — Sculpted Ruffle Twin',
        archetype: 'Avant-Garde Campaign Twin',
        collection: 'Spring Summer 2027 · Look 20',
        presetPrice: '$149',
        customOrderPrice: '$290',
        lifetimePrice: '$490',
        isCopyrightSold: false,
        listedAt: '2026-10-05',
        downloadCount: 187,
        description:
            'Optimized for voluminous ruffle tops, pleated maxi skirts, and wide-stance hero campaign framing across web, print, and lookbooks.',
        deliverables: ['6 Multi-Angle Pose Presets (8K PNG/TIFF)', 'Layered PSD + Garment UV Smart Masks', 'Commercial Global Campaign License'],
        featuredPieces: [
            { name: 'Sculpted Ruffle Top', price: '$1,120', box: [530, 672, 508, 682] },
            { name: 'Pleated Maxi Skirt', price: '$1,340', box: [754, 916, 484, 700] },
        ],
        poses: DEFAULT_POSES,
    },
];

/** Human-readable time since a twin was listed, e.g. "5 months" or "12 days". */
export function formatTwinAge(listedAt: string, now: Date = new Date()): string {
    const days = Math.max(1, Math.floor((now.getTime() - new Date(listedAt).getTime()) / 86_400_000));

    if (days < 30) {
        return `${days} ${days === 1 ? 'day' : 'days'}`;
    }

    if (days < 365) {
        const months = Math.floor(days / 30);

        return `${months} ${months === 1 ? 'month' : 'months'}`;
    }

    const years = Math.floor(days / 365);

    return `${years} ${years === 1 ? 'year' : 'years'}`;
}

export function formatDownloadCount(count: number): string {
    return count.toLocaleString('en-US');
}
