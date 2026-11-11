const BASE = 'https://reel-ref-try-the-look.vercel.app/assets';

export interface LookPiece {
    name: string;
    brand: string;
    image: string;
}

export interface Look {
    name: string;
    description: string;
    model: string;
    pieces: LookPiece[];
    pins: { left: number; top: number }[];
}

const piece = (name: string, image: string, brand = 'Nike'): LookPiece => ({
    name,
    brand,
    image: `${BASE}/source-${image}.webp`,
});

const PINS = [
    { left: 49, top: 27 },
    { left: 48, top: 58 },
    { left: 45, top: 90 },
];

export const LOOKS: Look[] = [
    {
        name: 'The City Edit',
        description: 'A charcoal knit and easy denim.',
        model: `${BASE}/model-1-640.webp`,
        pieces: [piece('Air Jordan 12 Retro', 'tatum-5-orbit-copy'), piece('Tshirt', 'tshirt'), piece('Sweatshirt', 'sweatshirt')],
        pins: PINS,
    },
    {
        name: 'Gallery Opening',
        description: 'A clean white tee and relaxed denim.',
        model: `${BASE}/model-5-640.webp`,
        pieces: [piece('Tatum 5 Orbit', 'tatum-5-orbit'), piece('Hoodie Black', 'hoodie-black'), piece('Tshirt', 'tshirt')],
        pins: PINS,
    },
    {
        name: 'Quiet Luxury',
        description: 'Olive knitwear. A grounded palette.',
        model: `${BASE}/model-4-640.webp`,
        pieces: [piece('Sweatshirt Plus', 'sweatshirt-plus'), piece('Tatum 5 Orbit', 'tatum-5-orbit'), piece('Tshirt', 'tshirt')],
        pins: PINS,
    },
    {
        name: 'Studio Day',
        description: 'Black, white and laid-back denim.',
        model: `${BASE}/model-6-640.webp`,
        pieces: [piece('Hoodie Black', 'hoodie-black'), piece('Air Jordan 12 Retro', 'tatum-5-orbit-copy'), piece('Tshirt', 'tshirt')],
        pins: PINS,
    },
    {
        name: 'After Hours',
        description: 'Burgundy layers. A tailored perspective.',
        model: `${BASE}/model-3-640.webp`,
        pieces: [piece('Sweatshirt', 'sweatshirt'), piece('Tatum 5 Orbit', 'tatum-5-orbit'), piece('Tshirt', 'tshirt')],
        pins: PINS,
    },
    {
        name: 'Weekend Off',
        description: 'A grey crew and your favourite denim.',
        model: `${BASE}/model-2-640.webp`,
        pieces: [piece('Hoodie', 'hoodie'), piece('Luka 5', 'air-jordan-12-retro-copy'), piece('Tshirt', 'tshirt')],
        pins: PINS,
    },
];

