import { route as routeFn } from 'ziggy-js';
import { SiteSettings } from './models';

export interface CapabilityNavChild {
    id: number;
    title: string;
    slug: string;
    path: string;
    subtitle: string;
    icon: string;
    image?: string | null;
}

export interface CapabilityNavItem extends CapabilityNavChild {
    tag: string | null;
    children: CapabilityNavChild[];
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    phone?: string | null;
    avatar?: string | null;
    email_verified_at?: string | null;
    status?: string | null;
    role?: string | null;
    permissions?: string[];
    credits_balance?: number;
    active_plan_name?: string | null;
    credits_expires_at?: string | null;
    credits_expires_at_formatted?: string | null;
}

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    auth?: {
        user?: AuthUser | null;
    };
    settings: SiteSettings;
    capabilities_nav?: CapabilityNavItem[];
    flash?: {
        success?: string;
        error?: string;
    };
    client_badges?: {
        orders_count: number;
        available_credits: number;
    } | null;
    ziggy?: {
        location: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

declare global {
    var route: typeof routeFn;
    interface Window {
        route: typeof routeFn;
    }
}
