import { route as routeFn } from 'ziggy-js';
import { SiteSettings } from './models';

export interface ServiceNavChild {
    id: number | null;
    title: string;
    slug: string | null;
    path: string;
    subtitle?: string | null;
    icon?: string;
}

export interface ServiceNavItem {
    id: number;
    title: string;
    slug: string;
    path: string;
    subtitle?: string;
    icon?: string;
    accent_color?: string;
    children: ServiceNavChild[];
}

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    settings: SiteSettings;
    services_nav?: ServiceNavItem[];
    flash?: {
        success?: string;
        error?: string;
    };
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
