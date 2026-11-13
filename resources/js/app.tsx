import '../css/app.css';

import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { LandingLayout } from '@/Layouts/LandingLayout';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'CuttingEdger';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : `${appName} — Radical Digital Agency`),
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        );

        // Apply persistent LandingLayout if not specified otherwise (skip for Admin and Client Portal pages)
        const resolvedPage = (page as any).default;
        if (
            resolvedPage.layout === undefined &&
            !name.startsWith('Admin/') &&
            !name.startsWith('Client/')
        ) {
            resolvedPage.layout = (pageElement: React.ReactNode) => (
                <LandingLayout>{pageElement}</LandingLayout>
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
        color: 'var(--color-primary)',
        showSpinner: false,
    },
});
