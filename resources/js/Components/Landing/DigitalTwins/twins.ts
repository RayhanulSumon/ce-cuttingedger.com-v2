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
    shortName?: string;
    title: string;
    angle: string;
    lens: string;
    /** Optional dedicated uploaded image for this specific pose. Falls back to smart crop of the model image when null. */
    imageUrl?: string | null;
    /** Normalized crop within the model's bounding box [yStartFrac, yEndFrac] and optional mirror/scale */
    yStartFrac: number;
    yEndFrac: number;
    xPadFrac?: number;
    mirror?: boolean;
    tiltDeg?: number;
    backdrop: string;
}

export interface DigitalTwinModel {
    id?: number;
    slug?: string;
    index: number;
    lookNumber: number;
    x0: number;
    x1: number;
    aspectRatio?: number;
    runwayImage?: string | null;
    hiResImage?: string | null;
    name: string;
    archetype: string;
    collection: string;
    presetPrice: string;
    customOrderPrice: string;
    lifetimePrice: string;
    /** True once the full copyright has been bought — the model is no longer available for lifetime purchase. */
    isCopyrightSold: boolean;
    /** ISO date the twin was first listed. */
    listedAt: string;
    /** Total preset downloads so far. */
    downloadCount: number;
    description: string;
    deliverables: string[];
    featuredPieces: { name: string; price: string; box: [number, number, number, number] }[];
    poses: TwinPosePreset[];
    isFeaturedOnHome?: boolean;
    isUpcoming?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}

export interface DigitalTwinAttributeItem {
    id: number;
    name: string;
    slug: string;
    inputType: 'unit_input' | 'select' | 'multi_input';
    options: string[];
    allowCustom: boolean;
    customLabel: string;
    placeholder?: string | null;
    isRequired: boolean;
    isActive: boolean;
    sortOrder: number;
}

export const DEFAULT_POSES: TwinPosePreset[] = [
    {
        id: 'pose-01',
        code: 'POSE 01',
        shortName: 'Front',
        title: 'Full-Length Runway Walk',
        angle: 'Eye-Level Front · Full Body',
        lens: '85mm f/2.0 Studio Prime',
        imageUrl: null,
        yStartFrac: 0,
        yEndFrac: 1,
        xPadFrac: 0.04,
        backdrop: 'linear-gradient(180deg, #eef3f9 0%, #dde7f2 65%, #f7f9fc 100%)',
    },
    {
        id: 'pose-02',
        code: 'POSE 02',
        shortName: 'Side',
        title: 'Three-Quarter Editorial',
        angle: 'Three-Quarter Mid-Length',
        lens: '70mm f/2.8 Soft Key',
        imageUrl: null,
        yStartFrac: 0.01,
        yEndFrac: 0.72,
        xPadFrac: 0.02,
        backdrop: 'linear-gradient(180deg, #f3efe9 0%, #e5dfd5 68%, #faf8f5 100%)',
    },
    {
        id: 'pose-03',
        code: 'POSE 03',
        shortName: 'Close-Up',
        title: 'Portrait & Collar Drape',
        angle: 'Close-Up Bust & Neckline',
        lens: '105mm f/2.8 Macro Portrait',
        imageUrl: null,
        yStartFrac: 0.0,
        yEndFrac: 0.44,
        xPadFrac: 0.08,
        backdrop: 'linear-gradient(180deg, #e9eff6 0%, #d7e2ee 70%, #f4f7fb 100%)',
    },
    {
        id: 'pose-04',
        code: 'POSE 04',
        shortName: 'Back',
        title: 'Counter-Turn Silhouette',
        angle: 'Mirrored Studio Stance',
        lens: '85mm f/2.0 Contre-Jour',
        imageUrl: null,
        yStartFrac: 0,
        yEndFrac: 1,
        xPadFrac: 0.04,
        mirror: true,
        backdrop: 'linear-gradient(180deg, #edf1f5 0%, #dce3ec 65%, #f8fafc 100%)',
    },
    {
        id: 'pose-05',
        code: 'POSE 05',
        shortName: 'Detail',
        title: 'Waist & Garment Detail',
        angle: 'Mid-Torso & Tailoring Crop',
        lens: '90mm f/4.0 Studio Strobe',
        imageUrl: null,
        yStartFrac: 0.16,
        yEndFrac: 0.68,
        xPadFrac: 0.05,
        backdrop: 'linear-gradient(180deg, #f0f4f8 0%, #dfe7f0 68%, #f9fbfd 100%)',
    },
    {
        id: 'pose-06',
        code: 'POSE 06',
        shortName: 'Stride',
        title: 'Dynamic Runway Stride',
        angle: 'Low-Angle Full-Body Motion',
        lens: '50mm f/1.8 Editorial Wide',
        imageUrl: null,
        yStartFrac: 0.08,
        yEndFrac: 1.0,
        xPadFrac: 0.03,
        mirror: true,
        tiltDeg: -1.5,
        backdrop: 'linear-gradient(180deg, #eaeff5 0%, #d8e2ee 65%, #f5f8fc 100%)',
    },
];

const DEFAULT_DELIVERABLES = [
    '6 Multi-Angle Pose Presets (8K PNG/TIFF)',
    'Layered PSD + Garment UV Smart Masks',
    'Commercial Global Campaign License',
];

const SPRITE_SLOTS: {
    x0: number;
    x1: number;
    featuredPieces: { name: string; price: string; box: [number, number, number, number] }[];
}[] = [
    {
        x0: 12,
        x1: 176,
        featuredPieces: [
            { name: 'Feather Jacket', price: '$2,900', box: [26, 224, 28, 214] },
            { name: 'Satin Wide Leg Trousers', price: '$1,450', box: [304, 412, 22, 236] },
        ],
    },
    {
        x0: 178,
        x1: 330,
        featuredPieces: [
            { name: 'Pleated Dress', price: '$2,200', box: [530, 666, 12, 242] },
            { name: 'Gold Waist Belt', price: '$420', box: [752, 922, 100, 146] },
        ],
    },
    {
        x0: 331,
        x1: 470,
        featuredPieces: [
            { name: 'Satin Trench Dress', price: '$2,350', box: [70, 176, 246, 466] },
            { name: 'Top Handle Bag', price: '$980', box: [294, 422, 294, 432] },
        ],
    },
    {
        x0: 476,
        x1: 633,
        featuredPieces: [
            { name: 'Billow Sleeve Blouse', price: '$860', box: [508, 688, 240, 452] },
            { name: 'Tie Waist Trousers', price: '$740', box: [780, 890, 252, 466] },
        ],
    },
    {
        x0: 634,
        x1: 767,
        featuredPieces: [
            { name: 'Powder Long Coat', price: '$1,980', box: [64, 178, 484, 698] },
            { name: 'Ivory Straight Trousers', price: '$690', box: [316, 396, 482, 698] },
        ],
    },
    {
        x0: 767,
        x1: 956,
        featuredPieces: [
            { name: 'Sculpted Ruffle Top', price: '$1,120', box: [530, 672, 508, 682] },
            { name: 'Pleated Maxi Skirt', price: '$1,340', box: [754, 916, 484, 700] },
        ],
    },
];

interface TwinSeedEntry {
    name: string;
    archetype: 'Female' | 'Male' | 'Upcoming';
    isCopyrightSold?: boolean;
    listedAt: string;
    downloadCount: number;
    description: string;
    presetPrice?: string;
    isUpcoming?: boolean;
}

const TWIN_SEED_ENTRIES: TwinSeedEntry[] = [
    // Female (11 models — first 6 featured on Home runway)
    {
        name: 'Laura',
        archetype: 'Female',
        listedAt: '2026-06-20',
        downloadCount: 1284,
        description:
            'Photoreal AI digital twin trained for structured outerwear, feather textures, and fluid satin trousers with 6 pre-lit studio pose rigs.',
    },
    {
        name: 'Pamela',
        archetype: 'Female',
        isCopyrightSold: true,
        listedAt: '2026-03-09',
        downloadCount: 3416,
        description:
            'Engineered for micro-pleated dresses, metallic waist accents, and soft evening movement across e-commerce and lookbook campaigns.',
    },
    {
        name: 'Moon',
        archetype: 'Female',
        listedAt: '2026-09-02',
        downloadCount: 542,
        description:
            'Calibrated for satin trench silhouettes, structured leather accessories, and crisp architectural shadows in full-frame studio lighting.',
    },
    {
        name: 'Jia',
        archetype: 'Female',
        listedAt: '2026-01-15',
        downloadCount: 2871,
        description:
            'Designed for billow-sleeve organza, sheer silk blouses, and tie-waist resort trousers with natural skin-to-fabric subsurface scattering.',
    },
    {
        name: 'Aumo',
        archetype: 'Female',
        isCopyrightSold: true,
        listedAt: '2025-11-28',
        downloadCount: 4903,
        description:
            'Built for longline powder coats, ivory straight-leg tailoring, and clean Scandinavian studio aesthetics with zero reshoot overhead.',
    },
    {
        name: 'Pauli',
        archetype: 'Female',
        listedAt: '2026-10-05',
        downloadCount: 187,
        description:
            'Optimized for voluminous ruffle tops, pleated maxi skirts, and wide-stance hero campaign framing across web, print, and lookbooks.',
    },
    {
        name: 'Mooha',
        archetype: 'Female',
        listedAt: '2026-07-14',
        downloadCount: 912,
        description:
            'Versatile studio digital twin tuned for contemporary womenswear, draped knitwear, and high-key editorial lookbooks.',
    },
    {
        name: 'Jolly',
        archetype: 'Female',
        listedAt: '2026-08-03',
        downloadCount: 745,
        description:
            'Balanced full-body proportion rig calibrated for resortwear, tailored separates, and crisp color-accurate e-commerce PDP shots.',
    },
    {
        name: 'Lily',
        archetype: 'Female',
        listedAt: '2026-08-19',
        downloadCount: 1104,
        description:
            'Soft-lit studio model trained for delicate silk, lace overlays, and multi-angle runway lookbook production.',
    },
    {
        name: 'Roza',
        archetype: 'Female',
        listedAt: '2026-09-11',
        downloadCount: 628,
        description:
            'Poised campaign digital twin tailored for structured blazers, luxury leather goods, and refined seasonal lookbooks.',
    },
    {
        name: 'Julia',
        archetype: 'Female',
        listedAt: '2026-09-25',
        downloadCount: 830,
        description:
            'Expressive editorial digital twin crafted for evening silhouettes, layered coats, and seamless multi-pose garment fitting.',
    },
    // Male (12 models)
    {
        name: 'John',
        archetype: 'Male',
        listedAt: '2026-05-18',
        downloadCount: 1420,
        description:
            'Classic menswear digital twin built for structured suiting, wool overcoats, and razor-sharp tailoring presentations.',
    },
    {
        name: 'Paul',
        archetype: 'Male',
        listedAt: '2026-06-04',
        downloadCount: 1085,
        description:
            'Editorial menswear model calibrated for relaxed shirting, linen resort sets, and clean studio e-commerce poses.',
    },
    {
        name: 'Nooh',
        archetype: 'Male',
        listedAt: '2026-06-29',
        downloadCount: 760,
        description:
            'Contemporary runway digital twin tuned for layered outerwear, utility cargo silhouettes, and dynamic stride framing.',
    },
    {
        name: 'David',
        archetype: 'Male',
        listedAt: '2026-07-08',
        downloadCount: 1590,
        description:
            'Refined athletic menswear rig designed for performance knitwear, denim jackets, and consistent front-to-back SKU renders.',
    },
    {
        name: 'Joseph',
        archetype: 'Male',
        listedAt: '2026-07-22',
        downloadCount: 695,
        description:
            'Minimalist campaign twin tailored for monochrome suiting, cashmere sweaters, and high-contrast luxury lookbooks.',
    },
    {
        name: 'Issac',
        archetype: 'Male',
        listedAt: '2026-08-10',
        downloadCount: 840,
        description:
            'Precision studio twin optimized for tailored trousers, leather trench silhouettes, and macro collar detail views.',
    },
    {
        name: 'Luke',
        archetype: 'Male',
        listedAt: '2026-08-24',
        downloadCount: 512,
        description:
            'Modern streetwear and outerwear twin engineered for puffer jackets, hoodies, and crisp 3/4 editorial stances.',
    },
    {
        name: 'Elijah',
        archetype: 'Male',
        listedAt: '2026-09-05',
        downloadCount: 930,
        description:
            'Sculptural menswear digital twin ready for avant-garde layering, longline coats, and global campaign assets.',
    },
    {
        name: 'Andrew',
        archetype: 'Male',
        listedAt: '2026-09-17',
        downloadCount: 418,
        description:
            'Studio-calibrated twin built for crisp dress shirts, lightweight tailoring, and consistent multi-angle catalog shoots.',
    },
    {
        name: 'Top',
        archetype: 'Male',
        listedAt: '2026-09-29',
        downloadCount: 604,
        description:
            'Sharp runway posture digital twin tailored for contemporary jackets, structured knits, and hero product drops.',
    },
    {
        name: 'Asher',
        archetype: 'Male',
        listedAt: '2026-10-08',
        downloadCount: 375,
        description:
            'Effortless editorial model trained for relaxed tailoring, tonal separates, and natural drape across 6 studio poses.',
    },
    {
        name: 'Sam',
        archetype: 'Male',
        listedAt: '2026-10-14',
        downloadCount: 289,
        description:
            'Clean e-commerce menswear twin engineered for everyday essentials, overshirts, and rapid seasonal catalog scaling.',
    },
    // Upcoming (1 model)
    {
        name: 'Upcoming Model',
        archetype: 'Upcoming',
        listedAt: '2026-11-19',
        downloadCount: 0,
        presetPrice: 'Upcoming',
        isUpcoming: true,
        description:
            'Next-generation digital twin currently in final studio lighting calibration and multi-angle pose verification.',
    },
];

export const DIGITAL_TWINS: DigitalTwinModel[] = TWIN_SEED_ENTRIES.map((entry, index) => {
    const slot = SPRITE_SLOTS[index % SPRITE_SLOTS.length];
    const lookNumber = TWIN_FIRST_LOOK + index;

    return {
        index,
        slug: entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        lookNumber,
        x0: slot.x0,
        x1: slot.x1,
        name: entry.name,
        archetype: entry.archetype,
        collection: entry.isUpcoming ? 'Upcoming Drop · Preview' : `Spring Summer 2027 · Look ${lookNumber}`,
        presetPrice: entry.presetPrice ?? '$149',
        customOrderPrice: '$290',
        lifetimePrice: '$490',
        isCopyrightSold: Boolean(entry.isCopyrightSold),
        listedAt: entry.listedAt,
        downloadCount: entry.downloadCount,
        description: entry.description,
        deliverables: DEFAULT_DELIVERABLES,
        featuredPieces: slot.featuredPieces,
        poses: DEFAULT_POSES,
        isFeaturedOnHome: index < 6,
        isUpcoming: Boolean(entry.isUpcoming),
        isActive: true,
        sortOrder: index + 1,
    };
});

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
