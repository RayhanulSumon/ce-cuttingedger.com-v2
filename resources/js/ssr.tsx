import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { renderToString } from 'react-dom/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { LandingLayout } from '@/Layouts/LandingLayout';

type PageComponent = React.ComponentType<any> & {
    layout?: (page: React.ReactNode) => React.ReactNode;
};

const appName = 'CuttingEdger';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => (title ? `${title} — ${appName}` : `${appName} — Radical Digital Agency`),
        resolve: async (name) => {
            const resolvedPageModule = await resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob<{ default: PageComponent }>('./Pages/**/*.tsx')
            );
            const resolved = resolvedPageModule.default;
            if (
                resolved.layout === undefined &&
                !name.startsWith('Admin/') &&
                !name.startsWith('Client/')
            ) {
                resolved.layout = (pageElement: React.ReactNode) => (
                    <LandingLayout>{pageElement}</LandingLayout>
                );
            }
            return resolved;
        },
        setup: ({ App, props }) => <App {...props} />,
    })
);
