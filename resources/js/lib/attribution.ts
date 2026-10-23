/**
 * Lead Attribution & Traffic Source Engine
 * Captures first-touch landing URLs, UTM campaign parameters, and ad click identifiers.
 */

export interface AttributionData {
    landing_page_url: string;
    submission_page_url: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    click_id?: string;
}

const STORAGE_KEY = 'cuttingedger_lead_attribution';

export function initializeAttribution(): void {
    if (typeof window === 'undefined') return;

    try {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        // Check for click IDs
        const clickId =
            params.get('gclid') ||
            params.get('fbclid') ||
            params.get('msclkid') ||
            params.get('ttclid') ||
            params.get('irclickid') ||
            '';

        const existingRaw = sessionStorage.getItem(STORAGE_KEY);
        let existing: Partial<AttributionData> = {};

        if (existingRaw) {
            try {
                existing = JSON.parse(existingRaw);
            } catch (e) {
                existing = {};
            }
        }

        // Only record first-touch landing URL if not already captured in session
        const landingPage = existing.landing_page_url || window.location.href;

        const attribution: AttributionData = {
            landing_page_url: landingPage,
            submission_page_url: window.location.href,
            utm_source: params.get('utm_source') || existing.utm_source || (document.referrer ? new URL(document.referrer, window.location.origin).hostname : 'direct'),
            utm_medium: params.get('utm_medium') || existing.utm_medium || (params.get('utm_source') ? 'cpc' : 'organic'),
            utm_campaign: params.get('utm_campaign') || existing.utm_campaign || '',
            utm_term: params.get('utm_term') || existing.utm_term || '',
            utm_content: params.get('utm_content') || existing.utm_content || '',
            click_id: clickId || existing.click_id || '',
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    } catch (err) {
        // Silently fail if storage is restricted
    }
}

export function getAttributionData(): AttributionData {
    if (typeof window === 'undefined') {
        return {
            landing_page_url: '',
            submission_page_url: '',
        };
    }

    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                ...parsed,
                submission_page_url: window.location.href,
            };
        }
    } catch (e) {
        // Fallback
    }

    return {
        landing_page_url: window.location.href,
        submission_page_url: window.location.href,
    };
}
