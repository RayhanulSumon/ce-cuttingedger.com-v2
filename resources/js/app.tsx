import 'lenis/dist/lenis.css';
import '../css/app.css';

import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { AppLayout } from '@/Layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'CuttingEdger';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : `${appName} — Radical Digital Agency`),
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        );

        // Apply persistent AppLayout if not specified otherwise (skip for Admin pages)
        const resolvedPage = (page as any).default;
        if (resolvedPage.layout === undefined && !name.startsWith('Admin/')) {
            resolvedPage.layout = (pageElement: React.ReactNode) => (
                <AppLayout>{pageElement}</AppLayout>
            );
        }

        return page;
    },
    setup({ el, App, props }) {
        if (el.dataset.serverRendered) {
            hydrateRoot(el, <App {...props} />);
        } else {
            createRoot(el).render(<App {...props} />);
        }
    },
    progress: {
        color: '#fbb718',
        showSpinner: false,
    },
});
