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
    interface Window {
        route: any;
    }
}
