import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { renderToString } from 'react-dom/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { LandingLayout } from '@/Layouts/LandingLayout';

const appName = 'CuttingEdger';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => (title ? `${title} — ${appName}` : `${appName} — Radical Digital Agency`),
        resolve: async (name) => {
            const resolvedPageModule = await resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx')
            );
            const resolved = (resolvedPageModule as any).default;
            if (resolved.layout === undefined) {
                resolved.layout = (pageElement: React.ReactNode) => (
                    <LandingLayout>{pageElement}</LandingLayout>
                );
            }
            return resolvedPageModule;
        },
        setup: ({ App, props }) => <App {...props} />,
    })
);
