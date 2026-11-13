export interface Category {
    id: number;
    name: string;
    slug: string;
    type: 'work';
    created_at?: string;
}

export interface BlogCategory {
    id: number;
    parent_id?: number | null;
    parent?: BlogCategory | null;
    subcategories?: BlogCategory[];
    name: string;
    slug: string;
    description?: string;
    blogs_count?: number;
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

export interface Capability {
    id: number;
    parent_id: number | null;
    parent?: Capability | null;
    children?: Capability[];
    title: string;
    slug: string;
    tag: string | null;
    subtitle: string;
    description: string;
    icon: string;
    features: string[] | null;
    deliverables: string[] | null;
    process_steps: { title: string; description: string }[] | null;
    faqs: { question: string; answer: string }[] | null;
    meta_title: string | null;
    meta_description: string | null;
    is_active: boolean;
    sort_order: number;
    path?: string;
}

export interface TeamMember {
    id: number;
    name: string;
    email?: string;
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

export interface Blog {
    id: number;
    blog_category_id: number;
    category?: BlogCategory;
    subcategory_id?: number | null;
    subcategory?: BlogCategory | null;
    author_id?: number;
    author?: TeamMember;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    cover_image: string;
    reading_time: number;
    published_at: string;
    is_featured?: boolean;
    status: 'draft' | 'published' | 'archived';
    tags?: string[];
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    canonical_url?: string;
    og_image?: string;
    robots?: string;
    deleted_at?: string | null;
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

export type CareerOpening = Job;

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
    /** Phone numbers per country or office, managed in the admin settings. */
    contact_phones: { label: string; number: string }[];
    /** The first phone number, for places that show only one. */
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
