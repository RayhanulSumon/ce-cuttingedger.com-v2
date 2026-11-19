import React, { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Coins,
    ExternalLink,
    LayoutDashboard,
    LogOut,
    Settings,
    ShoppingBag,
    UserCheck,
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

/** Persistent workspace shell shared across all Client Portal Inertia pages. */
export function ClientLayout({ children, title = 'Overview' }: ClientLayoutProps) {
    const { url, props } = usePage<PageProps>();
    const { auth, flash, client_badges } = props;
    const user = auth?.user ?? null;
    const pathname = url.split('?')[0];

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

    const navItems = [
        {
            name: 'Overview',
            href: '/portal',
            icon: LayoutDashboard,
            active: pathname === '/portal',
            badge: null as string | null,
        },
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
                <div className="admin-shell flex min-h-screen w-full bg-[#f5f7fb] text-ink antialiased">
                    <Sidebar className="border-r border-slate-200/90 bg-white text-ink">
                        <SidebarHeader className="border-b border-slate-100 bg-white px-5 py-4">
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
                                        <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
                                            Client Workspace
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </SidebarHeader>

                        <SidebarContent className="bg-white px-3 py-4">
                            <SidebarGroup className="p-0">
                                <SidebarMenu className="space-y-1">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={item.active}
                                                    tooltip={item.name}
                                                    className={cn(
                                                        'cursor-pointer rounded-xl px-2.5 py-2 text-[13px] transition-all',
                                                        item.active
                                                            ? 'bg-primary font-semibold text-white shadow-xs hover:bg-primary-hover hover:text-white'
                                                            : 'font-medium text-slate-600 hover:bg-slate-100/80 hover:text-ink'
                                                    )}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        preserveScroll
                                                        prefetch
                                                        className="flex w-full items-center gap-2.5"
                                                    >
                                                        <Icon
                                                            className={cn(
                                                                'h-4 w-4 shrink-0',
                                                                item.active ? 'text-white' : 'text-slate-400'
                                                            )}
                                                        />
                                                        <span className="flex-1 truncate text-left">
                                                            {item.name}
                                                        </span>
                                                        {item.badge && (
                                                            <span
                                                                className={cn(
                                                                    'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tracking-tight',
                                                                    item.active
                                                                        ? 'bg-white text-primary'
                                                                        : 'bg-primary/15 text-primary'
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

                        <SidebarFooter className="border-t border-slate-100 bg-[#f8fafc] p-3.5">
                            <div className="flex min-w-0 items-center justify-between gap-2 group-data-[collapsible=icon]:hidden">
                                <Link
                                    href="/portal/settings"
                                    preserveScroll
                                    prefetch
                                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-xl p-1 text-left transition-colors hover:bg-slate-100/80"
                                >
                                    <ClientAvatar src={user?.avatar} name={user?.name} size="sm" />
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="truncate text-xs font-bold text-ink">
                                            {user?.name || 'Client'}
                                        </span>
                                        <span className="truncate text-[11px] text-slate-500">
                                            {user?.company || user?.email}
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    title="Sign Out"
                                    className="shrink-0 cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    <SidebarInset className="flex min-w-0 flex-1 flex-col bg-[#f5f7fb] text-ink">
                        <header className="sticky top-0 z-20 flex h-15 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="text-slate-500 hover:bg-slate-100 hover:text-ink" />
                                <div className="h-4 w-px bg-slate-200" />
                                <span className="text-sm font-bold text-ink">{title}</span>
                                <span className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
                                    <UserCheck className="h-3 w-3" />
                                    Verified Account
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Link
                                    href="/portal/credits"
                                    preserveScroll
                                    prefetch
                                    className="hidden cursor-pointer items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-ink transition-colors hover:bg-primary/15 sm:inline-flex"
                                >
                                    <Coins className="h-3.5 w-3.5 text-primary" />
                                    <span className="tabular-nums">
                                        Account Credits: {availableCredits.toLocaleString()}
                                    </span>
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200/80 hover:text-ink"
                                >
                                    <span>View Website</span>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                                <div className="hidden h-5 w-px bg-slate-200 sm:block" />
                                <ClientUserMenu user={user} availableCredits={availableCredits} />
                            </div>
                        </header>

                        <Toaster />

                        <div className="mx-auto w-full max-w-[1600px] flex-1 p-6 sm:p-8">{children}</div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}
