const BASE = '/images/try-on';

export interface LookPiece {
    name: string;
    brand: string;
    image: string;
    tag?: string | null;
}

export interface Look {
    id?: number;
    slug?: string;
    /** Unique name of the model wearing the look. */
    modelName: string;
    model: string;
    modelHiRes: string;
    pieces: LookPiece[];
    pins: { left: number; top: number }[];
    isFeaturedOnHome?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}

const piece = (name: string, image: string, brand = 'Nike', tag?: string): LookPiece => ({
    name,
    brand,
    image: `${BASE}/source-${image}.webp`,
    tag,
});

export const LOOKS: Look[] = [
    {
        modelName: 'John',
        model: `${BASE}/model-1-640.webp`,
        modelHiRes: `${BASE}/original-look-1.webp`,
        pieces: [
            piece('Sweatshirt', 'sweatshirt', 'Nike'),
            piece('Tshirt', 'tshirt', 'Nike'),
            piece('Air Jordan 12 Retro', 'tatum-5-orbit-copy', 'Nikey | Password: 1'),
        ],
        pins: [
            { left: 47, top: 27 },
            { left: 48, top: 58 },
            { left: 45, top: 92 },
        ],
    },
    {
        modelName: 'Paul',
        model: `${BASE}/model-5-640.webp`,
        modelHiRes: `${BASE}/original-look-5.webp`,
        pieces: [
            piece('Hoodie Black', 'hoodie-black', 'Nike', 'New'),
            piece('Tshirt', 'tshirt', 'Nike'),
            piece('Tatum 5 Orbit', 'tatum-5-orbit', 'Nikey | Password: 1'),
        ],
        pins: [
            { left: 50, top: 28 },
            { left: 48, top: 58 },
            { left: 45, top: 88 },
        ],
    },
    {
        modelName: 'Nooh',
        model: `${BASE}/model-4-640.webp`,
        modelHiRes: `${BASE}/original-look-4.webp`,
        pieces: [
            piece('Sweatshirt Plus', 'sweatshirt-plus', 'Nike'),
            piece('Tshirt', 'tshirt', 'Nike'),
            piece('Tatum 5 Orbit', 'tatum-5-orbit', 'Nikey | Password: 1', 'New'),
        ],
        pins: [
            { left: 50, top: 28 },
            { left: 48, top: 58 },
            { left: 45, top: 88 },
        ],
    },
    {
        modelName: 'David',
        model: `${BASE}/model-6-640.webp`,
        modelHiRes: `${BASE}/original-look-6.webp`,
        pieces: [
            piece('Hoodie Black', 'hoodie-black', 'Nike'),
            piece('Tshirt', 'tshirt', 'Nike'),
            piece('Air Jordan 12 Retro', 'tatum-5-orbit-copy', 'Nikey | Password: 1'),
        ],
        pins: [
            { left: 50, top: 28 },
            { left: 48, top: 58 },
            { left: 45, top: 88 },
        ],
    },
    {
        modelName: 'Joseph',
        model: `${BASE}/model-3-640.webp`,
        modelHiRes: `${BASE}/original-look-3.webp`,
        pieces: [
            piece('Sweatshirt', 'sweatshirt', 'Nike'),
            piece('Tshirt', 'tshirt', 'Nike'),
            piece('Tatum 5 Orbit', 'tatum-5-orbit', 'Nikey | Password: 1'),
        ],
        pins: [
            { left: 50, top: 28 },
            { left: 48, top: 58 },
            { left: 45, top: 88 },
        ],
    },
    {
        modelName: 'Issac',
        model: `${BASE}/model-2-640.webp`,
        modelHiRes: `${BASE}/original-look-2.webp`,
        pieces: [
            piece('Hoodie', 'hoodie', 'Nike'),
            piece('Tshirt', 'tshirt', 'Nike'),
            piece('Luka 5', 'air-jordan-12-retro-copy', 'Nikey | Password: 1'),
        ],
        pins: [
            { left: 50, top: 28 },
            { left: 48, top: 58 },
            { left: 45, top: 88 },
        ],
    },
];
