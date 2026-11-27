import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    Coins,
    ExternalLink,
    Layers,
    LayoutDashboard,
    LogOut,
    Scissors,
    Settings,
    Shirt,
    ShoppingBag,
    UserCheck,
    Users,
} from 'lucide-react';
import { ClientAvatar } from '@/Components/Client/ClientAvatar';
import { ClientUserMenu } from '@/Components/Client/ClientUserMenu';
import { Toaster, toast } from '@/Components/ui/sonner';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/Components/ui/sidebar';
import { TooltipProvider } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';

interface ClientLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const CAPABILITY_SERVICES = [
    {
        name: 'Background Removal',
        href: '/portal/capabilities/background-removal',
        icon: Scissors,
    },
    {
        name: 'Digital Twins',
        href: '/portal/capabilities/digital-twins',
        icon: Users,
    },
    {
        name: 'Virtual Try-On',
        href: '/portal/capabilities/virtual-try-on',
        icon: Shirt,
    },
] as const;

const PAGE_TITLES: Record<string, string> = {
    '/portal': 'Overview',
    '/portal/capabilities/background-removal': 'Background Removal',
    '/portal/capabilities/digital-twins': 'Digital Twins',
    '/portal/capabilities/virtual-try-on': 'Virtual Try-On',
    '/portal/orders': 'Orders',
    '/portal/credits': 'Credits & Plans',
    '/portal/settings': 'Profile & Settings',
};

/** Persistent workspace shell shared across all Client Portal Inertia pages. */
export function ClientLayout({ children, title }: ClientLayoutProps) {
    const { url, props } = usePage<PageProps>();
    const { auth, flash, client_badges } = props;
    const user = auth?.user ?? null;
    const pathname = url.split('?')[0];
    const sidebarContentRef = useRef<HTMLDivElement>(null);

    const isCapabilitiesActive = pathname.startsWith('/portal/capabilities');
    const [capabilitiesOpen, setCapabilitiesOpen] = useState<boolean>(true);

    useEffect(() => {
        if (isCapabilitiesActive) {
            setCapabilitiesOpen(true);
        }
    }, [isCapabilitiesActive]);

    useLayoutEffect(() => {
        const saved = sessionStorage.getItem('client_sidebar_scroll');
        if (saved && sidebarContentRef.current) {
            sidebarContentRef.current.scrollTop = parseInt(saved, 10);
        }
    }, [url]);

    const handleSidebarScroll = (e: React.UIEvent<HTMLDivElement>) => {
        sessionStorage.setItem('client_sidebar_scroll', String(e.currentTarget.scrollTop));
    };

    const activeTitle = title || PAGE_TITLES[pathname] || 'Overview';
    const availableCredits = client_badges?.available_credits ?? user?.credits_balance ?? 0;
    const ordersCount = client_badges?.orders_count ?? 0;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, { id: 'portal-flash-success' });
        }
        if (flash?.error) {
            toast.error(flash.error, { id: 'portal-flash-error' });
        }
    }, [flash?.success, flash?.error]);

    // Silently prefetch remaining portal tab bundles in browser idle time so the first click is instantaneous
    useEffect(() => {
        const schedule =
            typeof window !== 'undefined' && 'requestIdleCallback' in window
                ? window.requestIdleCallback
                : (cb: () => void) => setTimeout(cb, 120);

        schedule(() => {
            if (!pathname.startsWith('/portal/capabilities')) import('@/Pages/Client/CapabilityShow');
            if (pathname !== '/portal/orders') import('@/Pages/Client/Orders');
            if (pathname !== '/portal/credits') import('@/Pages/Client/Credits');
            if (pathname !== '/portal/settings') import('@/Pages/Client/Settings');
            if (pathname !== '/portal') import('@/Pages/Client/Dashboard');
        });
    }, [pathname]);

    const bottomNavItems = [
        {
            name: 'Orders',
            href: '/portal/orders',
            icon: ShoppingBag,
            active: pathname.startsWith('/portal/orders'),
            badge: ordersCount > 0 ? `${ordersCount}` : null,
        },
        {
            name: 'Credits & Plans',
            href: '/portal/credits',
            icon: Coins,
            active: pathname.startsWith('/portal/credits'),
            badge: `${availableCredits.toLocaleString()}`,
        },
        {
            name: 'Settings',
            href: '/portal/settings',
            icon: Settings,
            active: pathname.startsWith('/portal/settings'),
            badge: null as string | null,
        },
    ];

    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen={true}>
                <div className="flex min-h-screen w-full bg-page text-ink antialiased">
                    <Sidebar className="border-r border-line bg-surface text-ink">
                        <SidebarHeader className="border-b border-line bg-surface px-5 py-4">
                            <Link
                                href="/portal"
                                preserveScroll
                                prefetch
                                className="group flex w-full cursor-pointer items-center justify-between gap-2 text-left"
                            >
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src="/images/ce/ce_icon.png"
                                        alt="CuttingEdger"
                                        className="h-7 w-7 shrink-0 object-contain"
                                    />
                                    <div className="group-data-[collapsible=icon]:hidden">
                                        <span className="block text-sm font-extrabold leading-none tracking-tight text-ink">
                                            CuttingEdger
                                        </span>
                                        <span className="mt-0.5 block text-2xs font-medium text-subtle">
                                            Client Workspace
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </SidebarHeader>

                        <SidebarContent
                            ref={sidebarContentRef}
                            onScroll={handleSidebarScroll}
                            className="bg-surface px-3 py-4"
                        >
                            <SidebarGroup className="p-0">
                                <SidebarMenu className="space-y-1">
                                    {/* Overview */}
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === '/portal'}
                                            tooltip="Overview"
                                            className={cn(
                                                'cursor-pointer rounded-xl px-2.5 py-2 text-sm transition-all',
                                                pathname === '/portal'
                                                    ? 'bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover hover:text-primary-foreground'
                                                    : 'font-medium text-muted hover:bg-surface-2 hover:text-ink'
                                            )}
                                        >
                                            <Link
                                                href="/portal"
                                                preserveScroll
                                                prefetch
                                                cacheFor="1m"
                                                className="flex w-full items-center gap-2.5"
                                            >
                                                <LayoutDashboard
                                                    className={cn(
                                                        'h-4 w-4 shrink-0',
                                                        pathname === '/portal' ? 'text-primary-foreground' : 'text-faint'
                                                    )}
                                                />
                                                <span className="flex-1 truncate text-left">Overview</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    {/* Capabilities Collapsible Sub-Menu */}
                                    <SidebarMenuItem>
                                        <button
                                            type="button"
                                            onClick={() => setCapabilitiesOpen((open) => !open)}
                                            className={cn(
                                                'flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
                                                isCapabilitiesActive
                                                    ? 'bg-primary-soft font-semibold text-primary-ink'
                                                    : 'text-muted hover:bg-surface-2 hover:text-ink'
                                            )}
                                        >
                                            <Layers
                                                className={cn(
                                                    'h-4 w-4 shrink-0',
                                                    isCapabilitiesActive ? 'text-primary' : 'text-faint'
                                                )}
                                            />
                                            <span className="flex-1 truncate text-left">Capabilities</span>
                                            <ChevronDown
                                                className={cn(
                                                    'h-3.5 w-3.5 text-faint transition-transform duration-200',
                                                    capabilitiesOpen ? 'rotate-180' : ''
                                                )}
                                            />
                                        </button>

                                        {capabilitiesOpen && (
                                            <div className="mt-1 ml-4 space-y-0.5 border-l border-line pl-3">
                                                {CAPABILITY_SERVICES.map((service) => {
                                                    const ServiceIcon = service.icon;
                                                    const isActive = pathname === service.href;

                                                    return (
                                                        <Link
                                                            key={service.href}
                                                            href={service.href}
                                                            preserveScroll
                                                            prefetch
                                                            cacheFor="1m"
                                                            className={cn(
                                                                'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                                                                isActive
                                                                    ? 'bg-primary font-semibold text-primary-foreground shadow-xs'
                                                                    : 'text-muted hover:bg-surface-2 hover:text-ink'
                                                            )}
                                                        >
                                                            <ServiceIcon
                                                                className={cn(
                                                                    'h-3.5 w-3.5 shrink-0',
                                                                    isActive ? 'text-primary-foreground' : 'text-faint'
                                                                )}
                                                            />
                                                            <span className="flex-1 truncate">
                                                                {service.name}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </SidebarMenuItem>

                                    <div className="my-2 border-t border-line" />

                                    {/* Orders, Credits, Settings */}
                                    {bottomNavItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={item.active}
                                                    tooltip={item.name}
                                                    className={cn(
                                                        'cursor-pointer rounded-xl px-2.5 py-2 text-sm transition-all',
                                                        item.active
                                                            ? 'bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover hover:text-primary-foreground'
                                                            : 'font-medium text-muted hover:bg-surface-2 hover:text-ink'
                                                    )}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        preserveScroll
                                                        prefetch
                                                        cacheFor="1m"
                                                        className="flex w-full items-center gap-2.5"
                                                    >
                                                        <Icon
                                                            className={cn(
                                                                'h-4 w-4 shrink-0',
                                                                item.active ? 'text-primary-foreground' : 'text-faint'
                                                            )}
                                                        />
                                                        <span className="flex-1 truncate text-left">
                                                            {item.name}
                                                        </span>
                                                        {item.badge && (
                                                            <span
                                                                className={cn(
                                                                    'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-2xs font-bold tracking-tight',
                                                                    item.active
                                                                        ? 'bg-surface text-primary-ink'
                                                                        : 'bg-primary-soft text-primary-ink'
                                                                )}
                                                            >
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroup>
                        </SidebarContent>

                        <SidebarFooter className="border-t border-line bg-surface-2 p-3.5">
                            <div className="flex min-w-0 items-center justify-between gap-2 group-data-[collapsible=icon]:hidden">
                                <Link
                                    href="/portal/settings"
                                    preserveScroll
                                    prefetch
                                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-xl p-1 text-left transition-colors hover:bg-surface-3"
                                >
                                    <ClientAvatar src={user?.avatar} name={user?.name} size="sm" />
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="truncate text-xs font-bold text-ink">
                                            {user?.name || 'Client'}
                                        </span>
                                        <span className="truncate text-2xs text-subtle">
                                            {user?.company || user?.email}
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    title="Sign Out"
                                    className="shrink-0 cursor-pointer rounded-lg p-2 text-faint transition-colors hover:bg-danger-soft hover:text-danger"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    <SidebarInset className="flex min-w-0 flex-1 flex-col bg-page text-ink">
                        <header className="sticky top-0 z-20 flex h-15 items-center justify-between gap-2 border-b border-line bg-surface/95 px-4 sm:px-6 backdrop-blur-md">
                            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                                <SidebarTrigger className="shrink-0 text-subtle hover:bg-surface-2 hover:text-ink" />
                                <div className="h-4 w-px shrink-0 bg-line" />
                                <span className="truncate text-sm font-bold text-ink">{activeTitle}</span>
                                <span className="hidden shrink-0 items-center gap-1 rounded-full border border-success/25 bg-success-soft px-2.5 py-0.5 text-2xs font-semibold text-success sm:inline-flex">
                                    <UserCheck className="h-3 w-3" />
                                    Verified Account
                                </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                                <Link
                                    href="/portal/credits"
                                    preserveScroll
                                    prefetch
                                    className="hidden cursor-pointer items-center gap-1.5 rounded-xl border border-primary/25 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-ink transition-colors hover:bg-primary/15 sm:inline-flex"
                                >
                                    <Coins className="h-3.5 w-3.5 text-primary" />
                                    <span className="tabular-nums">
                                        Account Credits: {availableCredits.toLocaleString()}
                                    </span>
                                </Link>
                                <Link
                                    href="/"
                                    aria-label="View Website"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 px-2.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink sm:px-3"
                                >
                                    <span className="hidden sm:inline">View Website</span>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                                <div className="hidden h-5 w-px bg-line sm:block" />
                                <ClientUserMenu user={user} availableCredits={availableCredits} />
                            </div>
                        </header>

                        <Toaster />

                        <div className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}

/** Persistent layout wrapper ensuring the client portal shell never unmounts between tab visits. */
export const getClientLayout = (page: React.ReactNode) => (
    <ClientLayout>{page}</ClientLayout>
);
