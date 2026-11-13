import { route as routeFn } from 'ziggy-js';
import { SiteSettings } from './models';

export interface CapabilityNavChild {
    id: number;
    title: string;
    slug: string;
    path: string;
    subtitle: string;
    icon: string;
}

export interface CapabilityNavItem extends CapabilityNavChild {
    tag: string | null;
    children: CapabilityNavChild[];
}

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    settings: SiteSettings;
    capabilities_nav?: CapabilityNavItem[];
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
