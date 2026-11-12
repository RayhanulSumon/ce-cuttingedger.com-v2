const BASE = 'https://reel-ref-try-the-look.vercel.app/assets';

export interface LookPiece {
    name: string;
    brand: string;
    image: string;
    tag?: string;
}

export interface Look {
    name: string;
    description: string;
    model: string;
    modelHiRes: string;
    pieces: LookPiece[];
    pins: { left: number; top: number }[];
}

const piece = (name: string, image: string, brand = 'Nike', tag?: string): LookPiece => ({
    name,
    brand,
    image: `${BASE}/source-${image}.webp`,
    tag,
});

export const LOOKS: Look[] = [
    {
        name: 'The City Edit',
        description: 'A charcoal knit and easy denim.',
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
        name: 'Gallery Opening',
        description: 'A clean white tee and relaxed denim.',
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
        name: 'Gallery Opening',
        description: 'Olive knitwear. A grounded palette.',
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
        name: 'Studio Day',
        description: 'Black, white and laid-back denim.',
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
        name: 'Studio Day',
        description: 'Burgundy layers. A tailored perspective.',
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
        name: 'Studio Day',
        description: 'A grey crew and your favourite denim.',
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
