/**
 * Session-scoped draft persistence for public order configurators so
 * unauthenticated visitors can configure their order, sign in, and resume
 * without losing their selections or selected files.
 */

export function readOrderDraft<T>(key: string): Partial<T> | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const raw = window.sessionStorage.getItem(key);
        if (!raw) {
            return null;
        }
        return JSON.parse(raw) as Partial<T>;
    } catch {
        return null;
    }
}

export function writeOrderDraft<T>(key: string, data: T): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.sessionStorage.setItem(key, JSON.stringify(data));
    } catch {
        // Ignore storage quota or private browsing errors
    }
}

export function clearOrderDraft(key: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.sessionStorage.removeItem(key);
    } catch {
        // Ignore storage errors
    }
}

export function currentRedirectUrl(fallback: string): string {
    if (typeof window === 'undefined') {
        return fallback;
    }

    return `${window.location.pathname}${window.location.search}`;
}

const AUTH_RETURN_KEY = 'ce_order_auth_return';

export function markAuthReturn(): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.sessionStorage.setItem(AUTH_RETURN_KEY, '1');
    } catch {
        // Ignore storage errors
    }
}

export function consumeAuthReturn(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        const val = window.sessionStorage.getItem(AUTH_RETURN_KEY);
        if (val === '1') {
            window.sessionStorage.removeItem(AUTH_RETURN_KEY);
            return true;
        }
    } catch {
        // Ignore storage errors
    }

    return false;
}

const DB_NAME = 'ce_order_drafts';
const STORE_NAME = 'files';

function openFilesDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            reject(new Error('IndexedDB unavailable'));
            return;
        }
        const request = window.indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
    });
}

export async function readOrderDraftFiles<T>(key: string): Promise<T | null> {
    try {
        const db = await openFilesDb();
        return await new Promise<T | null>((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(key);
            req.onsuccess = () => resolve((req.result as T | undefined) ?? null);
            req.onerror = () => resolve(null);
            tx.oncomplete = () => db.close();
        });
    } catch {
        return null;
    }
}

export async function writeOrderDraftFiles<T>(key: string, files: T): Promise<void> {
    try {
        const db = await openFilesDb();
        await new Promise<void>((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put(files, key);
            tx.oncomplete = () => {
                db.close();
                resolve();
            };
            tx.onerror = () => {
                db.close();
                resolve();
            };
        });
    } catch {
        // Ignore IndexedDB errors
    }
}

export async function clearOrderDraftFiles(key: string): Promise<void> {
    try {
        const db = await openFilesDb();
        await new Promise<void>((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).delete(key);
            tx.oncomplete = () => {
                db.close();
                resolve();
            };
            tx.onerror = () => {
                db.close();
                resolve();
            };
        });
    } catch {
        // Ignore IndexedDB errors
    }
}
