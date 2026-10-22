import { route as routeFn } from 'ziggy-js';
import { SiteSettings } from './models';

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    settings: SiteSettings;
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
