export interface FaqEntry {
    question: string;
    answer: string;
}

export interface CaseStudyEntry {
    client: string;
    category: string;
    title: string;
    summary: string;
    image: string;
    background: string;
    metrics: { value: string; label: string }[];
}

export const FAQS: FaqEntry[] = [
    {
        question: 'How fast can you turn around an order?',
        answer: 'Standard retouching is delivered within 24 hours. Rush queues, large batches and 3D / video projects are scoped with a fixed delivery date before we start.',
    },
    {
        question: 'What is a digital twin and how is it different from a photo shoot?',
        answer: 'A digital twin is a photoreal AI or CGI model of your garment or product. After one capture, we render it in new poses, colours and settings without booking another shoot.',
    },
    {
        question: 'Which file formats can I send you?',
        answer: 'JPG, PNG, WebP, TIFF, PSD, PDF and ZIP archives up to 25 MB per file. Larger batches can be shared through a cloud link.',
    },
    {
        question: 'Do you offer a free test?',
        answer: 'Yes. Send a few images through the Book a Demo form and we will return them retouched, free of charge, so you can judge the quality first.',
    },
    {
        question: 'Is my content confidential?',
        answer: 'Every project is covered by an NDA on request, files are stored on encrypted storage, and your images are never used to train public models.',
    },
    {
        question: 'How does pricing work?',
        answer: 'Retouching is priced per image with volume discounts, digital twins per preset or as lifetime copyright, and custom projects as a fixed quote within one business day. There are no hidden fees.',
    },
    {
        question: 'Can you match our existing style guide?',
        answer: 'Yes. We build a brand preset from your guidelines and sample files so every batch is consistent across retouchers and over time.',
    },
];

export const CASE_STUDIES: CaseStudyEntry[] = [
    {
        client: 'Fashion e-commerce',
        category: '2D · Retouching',
        title: '12,000 SKUs retouched in six weeks',
        summary: 'A multi-brand apparel retailer moved to a consistent ghost-mannequin look across its whole catalog with 24-hour batches.',
        image: '/images/portfolio/portfolio-1.jpg',
        background: '#141A26',
        metrics: [
            { value: '12k', label: 'images' },
            { value: '24h', label: 'turnaround' },
            { value: '-38%', label: 'cost per image' },
        ],
    },
    {
        client: 'Footwear brand',
        category: '3D · Digital twins',
        title: 'Seasonal launch without a studio',
        summary: 'Digital twins of 140 sneakers replaced two physical shoots and shipped the campaign three weeks early.',
        image: '/images/portfolio/portfolio-3.jpg',
        background: '#2B4BFF',
        metrics: [
            { value: '140', label: 'products' },
            { value: '3 wks', label: 'saved' },
            { value: '2x', label: 'more variants' },
        ],
    },
    {
        client: 'Jewelry house',
        category: 'DTP · Video',
        title: 'Print and motion from one source',
        summary: 'High-end jewelry retouching, catalog layout and short-form video cut-downs delivered as one workflow.',
        image: '/images/portfolio/portfolio-2.jpg',
        background: '#0A0D14',
        metrics: [
            { value: '96', label: 'catalog pages' },
            { value: '30', label: 'video cut-downs' },
            { value: '1', label: 'workflow' },
        ],
    },
];

export interface ReviewEntry {
    quote: string;
    name: string;
    role: string;
}

/** Shown until real testimonials exist in the admin panel. */
export const REVIEW_FALLBACK: ReviewEntry[] = [
    {
        quote: 'They turned 12,000 SKUs around in six weeks and every image matched our style guide. Our catalog has never looked this consistent.',
        name: 'Head of E-commerce',
        role: 'Multi-brand apparel retailer',
    },
    {
        quote: 'Digital twins replaced two physical shoots. We launched the season three weeks early and with twice the variants.',
        name: 'Creative Director',
        role: 'Footwear brand',
    },
    {
        quote: 'The free sample sold us. Same quality on the full batch, delivered overnight, every time.',
        name: 'Production Manager',
        role: 'Jewelry house',
    },
    {
        quote: 'Retouching, layout and video from one team. It removed three vendors from our workflow.',
        name: 'Marketing Lead',
        role: 'Fashion marketplace',
    },
];
