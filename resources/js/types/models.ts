export interface Category {
    id: number;
    name: string;
    slug: string;
    type: 'work' | 'blog';
    created_at?: string;
}

export interface Project {
    id: number;
    category_id: number;
    category?: Category;
    title: string;
    slug: string;
    client_name: string;
    year: string | number;
    summary: string;
    description: string;
    cover_image: string;
    gallery?: string[];
    deliverables: string[];
    featured: boolean;
    sort_order: number;
    metrics?: { label: string; value: string }[];
    meta_title?: string;
    meta_description?: string;
    live_url?: string;
}

export interface Service {
    id: number;
    title: string;
    slug: string;
    marquee_label: string;
    subtitle: string;
    description: string;
    features: string[];
    deliverables: string[];
    icon: string;
    sort_order: number;
    accent_color?: string;
}

export interface TeamMember {
    id: number;
    name: string;
    slug: string;
    role: string;
    since_year: number | string;
    bio: string;
    avatar: string;
    social_links: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        dribbble?: string;
    };
    featured: boolean;
    sort_order: number;
}

export interface Testimonial {
    id: number;
    client_name: string;
    client_role: string;
    client_company: string;
    avatar?: string;
    quote: string;
    rating: number;
    featured: boolean;
}

export interface Client {
    id: number;
    name: string;
    logo_dark?: string;
    logo_light?: string;
    url?: string;
    marquee_row: 1 | 2;
    sort_order: number;
}

export interface Post {
    id: number;
    category_id: number;
    category?: Category;
    author_id?: number;
    author?: TeamMember;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    cover_image: string;
    reading_time: number;
    published_at: string;
    meta_title?: string;
    meta_description?: string;
}

export interface Job {
    id: number;
    title: string;
    slug: string;
    department: string;
    location_type: 'Remote' | 'Hybrid' | 'On-site';
    experience_level: string;
    overview: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
    is_open: boolean;
}

export interface Faq {
    id: number;
    category: string;
    question: string;
    answer: string;
    sort_order: number;
}

export interface PricingPlan {
    id: number;
    name: string;
    slug: string;
    headline: string;
    price: string;
    billing_cycle: string;
    features: string[];
    is_popular: boolean;
    cta_text: string;
    sort_order: number;
}

export interface SiteSettings {
    brand_name: string;
    tagline: string;
    contact_email: string;
    contact_phone: string;
    office_address: string;
    socials: {
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        github?: string;
        dribbble?: string;
    };
}
