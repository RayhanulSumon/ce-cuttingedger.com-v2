import '../css/app.css';

import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { LandingLayout } from '@/Layouts/LandingLayout';
import { configureEcho } from '@laravel/echo-react';

type PageComponent = React.ComponentType<any> & {
    layout?: (page: React.ReactNode) => React.ReactNode;
};

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'CuttingEdger';

const getLandingLayout = (pageElement: React.ReactNode) => (
    <LandingLayout>{pageElement}</LandingLayout>
);

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : `${appName} — Radical Digital Agency`),
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob<{ default: PageComponent }>('./Pages/**/*.tsx')
        );

        // Apply persistent LandingLayout if not specified otherwise (skip for Admin and Client Portal pages)
        const resolvedPage = page.default;
        if (
            resolvedPage.layout === undefined &&
            !name.startsWith('Admin/') &&
            !name.startsWith('Client/')
        ) {
            resolvedPage.layout = getLandingLayout;
        }

        return resolvedPage;
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
        showSpinner: true,
    },
});
