import React, { useMemo, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    Eye,
    Layers,
    LayoutDashboard,
    LogOut,
    Plus,
    Settings,
    ShoppingBag,
    Sparkles,
    UserCheck,
    X,
} from 'lucide-react';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { SeoHead } from '@/Components/Common/SeoHead';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import { DigitalTwinModel } from '@/Components/Landing/DigitalTwins/twins';
import { Look } from '@/Components/Landing/TryOn/looks';
import { digitalTwinOrderUrl, tryOnQuoteUrl } from '@/Components/Landing/shared';
import { Button } from '@/Components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/Components/ui/sidebar';
import { Toaster, toast } from '@/Components/ui/sonner';
import { TooltipProvider } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

const CARD_PREVIEW_BG =
    'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

interface ClientOrderItem {
    id: number;
    order_number: string;
    order_type: string;
    service_name: string;
    complexity: string;
    quantity: number;
    uploaded_count: number;
    total_price: number;
    currency: string;
    turnaround: string;
    images: string[];
    completed_files: string[];
    specifications: Record<string, any>;
    cloud_link?: string | null;
    instructions?: string | null;
    status: 'pending' | 'in_production' | 'review' | 'completed' | 'cancelled';
    payment_status: string;
    created_at_formatted: string;
}

interface CapabilityNavItem {
    id: number;
    title: string;
    slug: string;
    path: string;
    subtitle?: string | null;
    children?: {
        id: number;
        title: string;
        slug: string;
        path: string;
    }[];
}

interface ClientDashboardProps {
    orders: ClientOrderItem[];
    stats: {
        total_orders: number;
        in_progress: number;
        completed: number;
        digital_twin_orders: number;
        try_on_quotes: number;
    };
    digitalTwins?: DigitalTwinModel[];
    tryOnLooks?: Look[];
}

type PortalView = 'overview' | 'orders' | 'services' | 'settings';

export default function ClientDashboard({
    orders = [],
    stats,
    digitalTwins = [],
    tryOnLooks = [],
}: ClientDashboardProps) {
    const { auth, flash, capabilities_nav } = usePage<{
        auth?: {
            user?: {
                id: number;
                name: string;
                email: string;
                company?: string | null;
                phone?: string | null;
                avatar?: string | null;
            } | null;
        };
        flash?: { success?: string; error?: string };
        capabilities_nav?: CapabilityNavItem[];
    }>().props;

    const user = auth?.user;
    const [activeView, setActiveView] = useState<PortalView>('overview');
    const [orderFilter, setOrderFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<ClientOrderItem | null>(null);

    React.useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Dynamic service categories derived from existing orders so any future service type works automatically
    const orderServiceFilters = useMemo(() => {
        const types = Array.from(new Set(orders.map((o) => o.service_name))).filter(Boolean);
        return types;
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (orderFilter === 'all') {
            return orders;
        }
        return orders.filter((o) => o.service_name === orderFilter);
    }, [orders, orderFilter]);

    // Profile Update Form
    const profileForm = useForm({
        name: user?.name || '',
        company: user?.company || '',
        phone: user?.phone || '',
    });

    // Password Update Form
    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(route('client.portal.profile'), { preserveScroll: true });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post(route('client.portal.password'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const getStatusBadge = (status: ClientOrderItem['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 size={12} />
                        Completed
                    </span>
                );
            case 'in_production':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700">
                        <Layers size={12} />
                        In Production
                    </span>
                );
            case 'review':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                        <Eye size={12} />
                        Quality Review
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                        <Clock size={12} />
                        Pending Review
                    </span>
                );
        }
    };

    const mainNavItems: {
        id: PortalView;
        name: string;
        icon: React.ElementType;
        badge?: string | null;
    }[] = [
        {
            id: 'overview',
            name: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            id: 'orders',
            name: 'My Orders & Quotes',
            icon: ShoppingBag,
            badge: orders.length > 0 ? `${orders.length}` : null,
        },
        {
            id: 'services',
            name: 'Services & New Order',
            icon: Sparkles,
        },
    ];

    const viewTitles: Record<PortalView, string> = {
        overview: 'Dashboard',
        orders: 'My Orders & Quotes',
        services: 'Services & New Order',
        settings: 'Account Settings',
    };

    return (
        <TooltipProvider>
            <SeoHead
                title="Client Workspace — CuttingEdger"
                description="Manage your CuttingEdger studio orders, quotes, and account deliverables."
            />
            <SidebarProvider defaultOpen={true}>
                <div className="admin-shell min-h-screen w-full bg-[#f5f7fb] text-ink flex antialiased">
                    {/* Clean Light Editorial Sidebar — Identical to Admin Layout */}
                    <Sidebar className="border-r border-slate-200/90 bg-white text-ink">
                        <SidebarHeader className="border-b border-slate-100 bg-white px-5 py-4">
                            <button
                                type="button"
                                onClick={() => setActiveView('overview')}
                                className="flex items-center justify-between gap-2 group cursor-pointer text-left w-full"
                            >
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src="/images/ce/ce_icon.png"
                                        alt="CuttingEdger"
                                        className="w-7 h-7 object-contain shrink-0"
                                    />
                                    <div className="group-data-[collapsible=icon]:hidden">
                                        <span className="font-extrabold text-sm tracking-tight text-ink block leading-none">
                                            CuttingEdger
                                        </span>
                                        <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                                            Client Workspace
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </SidebarHeader>

                        <SidebarContent className="px-3 py-4 space-y-5 bg-white">
                            {/* Main Workspace Section */}
                            <SidebarGroup className="p-0">
                                <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2.5 mb-1">
                                    Main
                                </SidebarGroupLabel>
                                <SidebarMenu className="space-y-0.5">
                                    {mainNavItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeView === item.id;
                                        return (
                                            <SidebarMenuItem key={item.id}>
                                                <SidebarMenuButton
                                                    isActive={isActive}
                                                    tooltip={item.name}
                                                    onClick={() => setActiveView(item.id)}
                                                    className={cn(
                                                        'rounded-xl text-[13px] transition-all py-2 px-2.5 cursor-pointer',
                                                        isActive
                                                            ? 'bg-primary text-white font-semibold shadow-xs hover:bg-primary-hover hover:text-white'
                                                            : 'text-slate-600 font-medium hover:text-ink hover:bg-slate-100/80'
                                                    )}
                                                >
                                                    <Icon
                                                        className={cn(
                                                            'w-4 h-4 shrink-0',
                                                            isActive
                                                                ? 'text-white'
                                                                : 'text-slate-400'
                                                        )}
                                                    />
                                                    <span className="truncate flex-1 text-left">
                                                        {item.name}
                                                    </span>
                                                    {item.badge && (
                                                        <span
                                                            className={cn(
                                                                'shrink-0 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-[11px] font-bold tracking-tight',
                                                                isActive
                                                                    ? 'bg-white text-primary'
                                                                    : 'bg-primary/15 text-primary'
                                                            )}
                                                        >
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroup>

                            {/* Account Section */}
                            <SidebarGroup className="p-0">
                                <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2.5 mb-1">
                                    Account
                                </SidebarGroupLabel>
                                <SidebarMenu className="space-y-0.5">
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            isActive={activeView === 'settings'}
                                            tooltip="Account Settings"
                                            onClick={() => setActiveView('settings')}
                                            className={cn(
                                                'rounded-xl text-[13px] transition-all py-2 px-2.5 cursor-pointer',
                                                activeView === 'settings'
                                                    ? 'bg-primary text-white font-semibold shadow-xs hover:bg-primary-hover hover:text-white'
                                                    : 'text-slate-600 font-medium hover:text-ink hover:bg-slate-100/80'
                                            )}
                                        >
                                            <Settings
                                                className={cn(
                                                    'w-4 h-4 shrink-0',
                                                    activeView === 'settings'
                                                        ? 'text-white'
                                                        : 'text-slate-400'
                                                )}
                                            />
                                            <span className="truncate flex-1 text-left">
                                                Profile & Password
                                            </span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroup>
                        </SidebarContent>

                        <SidebarFooter className="border-t border-slate-100 p-3.5 bg-[#f8fafc]">
                            <div className="flex items-center justify-between gap-2 min-w-0 group-data-[collapsible=icon]:hidden">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                            {(user?.name || 'C').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs font-bold text-ink truncate">
                                            {user?.name || 'Client'}
                                        </span>
                                        <span className="text-[11px] text-slate-500 truncate">
                                            {user?.company || user?.email}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    title="Sign Out"
                                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Link>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    {/* Main Inset Content Area */}
                    <SidebarInset className="bg-[#f5f7fb] text-ink flex-1 flex flex-col min-w-0">
                        {/* Clean Top Bar — Matches AdminLayout */}
                        <header className="h-15 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="text-slate-500 hover:text-ink hover:bg-slate-100" />
                                <div className="h-4 w-px bg-slate-200" />
                                <span className="text-sm font-bold text-ink">
                                    {viewTitles[activeView]}
                                </span>
                                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                    <UserCheck className="w-3 h-3" />
                                    Verified Account
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setActiveView('services')}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer shadow-2xs"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>New Order / Quote</span>
                                </button>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-ink transition-colors"
                                >
                                    <span>View Website</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </header>

                        <Toaster />

                        {/* Main Page Content */}
                        <div className="p-6 sm:p-8 flex-1 max-w-[1600px] w-full mx-auto">
                            {/* VIEW 1: DASHBOARD OVERVIEW */}
                            {activeView === 'overview' && (
                                <>
                                    <AdminPageHeader
                                        title={`Welcome, ${user?.name || 'Client'}`}
                                        description="Track your active orders, quotes, studio productions, and deliverables."
                                    >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setActiveView('orders')}
                                                className="gap-2 bg-white border-slate-200 text-ink hover:bg-slate-50 font-semibold text-xs cursor-pointer"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                                                <span>My Orders ({orders.length})</span>
                                            </Button>
                                            <Button
                                                onClick={() => setActiveView('services')}
                                                className="gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-xs cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>New Order / Quote</span>
                                            </Button>
                                        </div>
                                    </AdminPageHeader>

                                    <div className="space-y-8">
                                        {/* KPI Cards — Matching Admin Dashboard Style */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setActiveView('orders')}
                                                className="text-left p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary/40 transition-all group space-y-2 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between text-slate-500">
                                                    <span className="text-xs font-semibold">
                                                        Total Orders & Quotes
                                                    </span>
                                                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                        <ShoppingBag className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-extrabold text-ink tracking-tight">
                                                    {stats.total_orders}
                                                </div>
                                                <div className="flex items-center justify-between text-xs pt-1">
                                                    <span className="text-slate-500">
                                                        All submitted orders
                                                    </span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setActiveView('orders')}
                                                className="text-left p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary/40 transition-all group space-y-2 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between text-slate-500">
                                                    <span className="text-xs font-semibold">
                                                        In Progress / Review
                                                    </span>
                                                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-extrabold text-ink tracking-tight">
                                                    {stats.in_progress}
                                                </div>
                                                <div className="flex items-center justify-between text-xs pt-1">
                                                    <span className="text-amber-600 font-semibold">
                                                        Active studio production
                                                    </span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setActiveView('orders')}
                                                className="text-left p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary/40 transition-all group space-y-2 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between text-slate-500">
                                                    <span className="text-xs font-semibold">
                                                        Completed Deliverables
                                                    </span>
                                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-extrabold text-ink tracking-tight">
                                                    {stats.completed}
                                                </div>
                                                <div className="flex items-center justify-between text-xs pt-1">
                                                    <span className="text-emerald-600 font-semibold">
                                                        Ready for download
                                                    </span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setActiveView('services')}
                                                className="text-left p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary/40 transition-all group space-y-2 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between text-slate-500">
                                                    <span className="text-xs font-semibold">
                                                        Explore Services
                                                    </span>
                                                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                                                        <Sparkles className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <div className="text-xl font-extrabold text-ink tracking-tight pt-1">
                                                    Start New Order
                                                </div>
                                                <div className="flex items-center justify-between text-xs pt-1">
                                                    <span className="text-primary font-semibold">
                                                        Browse studio services
                                                    </span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                                                </div>
                                            </button>
                                        </div>

                                        {/* Recent Orders & Quotes Card */}
                                        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                                <div>
                                                    <h2 className="text-base font-bold text-ink">
                                                        Recent Orders & Quotes
                                                    </h2>
                                                    <p className="text-xs text-slate-500">
                                                        Inspect specifications, uploaded files, and production status
                                                    </p>
                                                </div>
                                                {orders.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveView('orders')}
                                                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <span>View all ({orders.length})</span>
                                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-2.5">
                                                {orders.length > 0 ? (
                                                    orders.slice(0, 6).map((order) => (
                                                        <div
                                                            key={order.id}
                                                            className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200/70 hover:border-primary/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                                        >
                                                            <div className="min-w-0 flex-1 space-y-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="font-bold text-xs text-ink">
                                                                        #{order.order_number}
                                                                    </span>
                                                                    {getStatusBadge(order.status)}
                                                                    <span className="text-xs text-slate-400">
                                                                        {order.created_at_formatted}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm font-bold text-ink">
                                                                    {order.service_name}
                                                                </div>
                                                                <div className="text-xs text-slate-500">
                                                                    Turnaround:{' '}
                                                                    <strong>{order.turnaround}</strong> •{' '}
                                                                    {order.uploaded_count} file(s) attached
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-3 shrink-0">
                                                                <div className="text-left sm:text-right">
                                                                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                                        Amount
                                                                    </span>
                                                                    <span className="text-xs font-bold text-ink">
                                                                        {order.total_price > 0
                                                                            ? `$${order.total_price.toFixed(2)} ${order.currency}`
                                                                            : 'Custom Quote'}
                                                                    </span>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setSelectedOrder(order)
                                                                    }
                                                                    className="gap-1.5 text-xs"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                    <span>View Details</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-12 text-center space-y-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                                            <ShoppingBag className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-ink">
                                                                No orders or quotes yet
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-0.5 max-w-md mx-auto">
                                                                Explore our studio services to place a new order or request a custom project quote.
                                                            </p>
                                                        </div>
                                                        <Button
                                                            onClick={() => setActiveView('services')}
                                                            className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold"
                                                        >
                                                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                                                            Browse Services & Start Order
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* VIEW 2: MY ORDERS & QUOTES */}
                            {activeView === 'orders' && (
                                <>
                                    <AdminPageHeader
                                        title="My Orders & Quotes"
                                        description="View all your submitted orders, custom quotes, specifications, and downloadable deliverables."
                                        actionLabel="New Order / Quote"
                                        onActionClick={() => setActiveView('services')}
                                    />

                                    {orderServiceFilters.length > 1 && (
                                        <div className="flex flex-wrap items-center gap-2 mb-6">
                                            <button
                                                type="button"
                                                onClick={() => setOrderFilter('all')}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                                    orderFilter === 'all'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:text-ink'
                                                }`}
                                            >
                                                All ({orders.length})
                                            </button>
                                            {orderServiceFilters.map((srv) => (
                                                <button
                                                    key={srv}
                                                    type="button"
                                                    onClick={() => setOrderFilter(srv)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                                        orderFilter === srv
                                                            ? 'bg-primary text-white'
                                                            : 'bg-white border border-slate-200 text-slate-600 hover:text-ink'
                                                    }`}
                                                >
                                                    {srv}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {filteredOrders.length > 0 ? (
                                            filteredOrders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-primary/40 transition-colors"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="rounded-lg bg-ink px-2.5 py-0.5 text-xs font-bold text-white">
                                                                #{order.order_number}
                                                            </span>
                                                            {getStatusBadge(order.status)}
                                                            <span className="text-xs text-slate-400">
                                                                {order.created_at_formatted}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-base font-bold text-ink">
                                                            {order.service_name}
                                                        </h3>
                                                        <p className="text-xs text-slate-500">
                                                            Turnaround: <strong>{order.turnaround}</strong> ·{' '}
                                                            {order.uploaded_count} file(s) attached
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="text-left sm:text-right">
                                                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                                Total / Estimate
                                                            </span>
                                                            <span className="text-sm font-extrabold text-ink">
                                                                {order.total_price > 0
                                                                    ? `$${order.total_price.toFixed(2)} ${order.currency}`
                                                                    : 'Custom Quote'}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="gap-1.5 text-xs"
                                                        >
                                                            <Eye size={14} />
                                                            <span>View Spec & Files</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3">
                                                <p className="text-sm font-bold text-ink">
                                                    No orders found.
                                                </p>
                                                <Button
                                                    onClick={() => setActiveView('services')}
                                                    className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold"
                                                >
                                                    Browse Services & Start Order
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* VIEW 3: UNIFIED SERVICES & NEW ORDER CATALOG */}
                            {activeView === 'services' && (
                                <>
                                    <AdminPageHeader
                                        title="Services & New Order"
                                        description="Select any studio service or model below to configure your order or request a custom quote."
                                    />

                                    <div className="space-y-8">
                                        {/* Dynamic Studio Capabilities / Services Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Link
                                                href={digitalTwinOrderUrl({ mode: 'custom' })}
                                                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary transition-all group flex flex-col justify-between"
                                            >
                                                <div>
                                                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                                                        AI Model Production
                                                    </span>
                                                    <h3 className="text-lg font-extrabold text-ink">
                                                        AI Digital Twins
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        Order a custom digital twin with your exact body & facial attributes, license a 6-pose preset ($200), or acquire lifetime exclusive copyright ($490).
                                                    </p>
                                                </div>
                                                <div className="mt-5 flex items-center justify-between text-xs font-bold text-primary">
                                                    <span>Configure Digital Twin</span>
                                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </div>
                                            </Link>

                                            <Link
                                                href={tryOnQuoteUrl()}
                                                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary transition-all group flex flex-col justify-between"
                                            >
                                                <div>
                                                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                                                        Garment Draping
                                                    </span>
                                                    <h3 className="text-lg font-extrabold text-ink">
                                                        Virtual Try-On Studio
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        Select from our studio models or upload your own talent alongside Top, Below/Bottom, and Shoes references for a tailored quote.
                                                    </p>
                                                </div>
                                                <div className="mt-5 flex items-center justify-between text-xs font-bold text-primary">
                                                    <span>Request Try-On Quote</span>
                                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </div>
                                            </Link>

                                            <Link
                                                href="/contact"
                                                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary transition-all group flex flex-col justify-between"
                                            >
                                                <div>
                                                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                                                        2D / 3D / Video / Post-Production
                                                    </span>
                                                    <h3 className="text-lg font-extrabold text-ink">
                                                        Custom Production & Retouching
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        Need high-volume e-commerce retouching, 3D CGI rendering, or video post-production? Submit a custom project brief.
                                                    </p>
                                                </div>
                                                <div className="mt-5 flex items-center justify-between text-xs font-bold text-primary">
                                                    <span>Submit Custom Brief</span>
                                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Dynamic Capabilities from Admin */}
                                        {capabilities_nav && capabilities_nav.length > 0 && (
                                            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                                                <h2 className="text-base font-bold text-ink mb-1">
                                                    All Studio Capabilities
                                                </h2>
                                                <p className="text-xs text-slate-500 mb-4">
                                                    Explore all active services managed by the studio
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                    {capabilities_nav.map((cap) => (
                                                        <Link
                                                            key={cap.id}
                                                            href={cap.path}
                                                            className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200/80 hover:border-primary transition-all group"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-bold text-ink group-hover:text-primary">
                                                                    {cap.title}
                                                                </span>
                                                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" />
                                                            </div>
                                                            {cap.subtitle && (
                                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                                    {cap.subtitle}
                                                                </p>
                                                            )}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Digital Twins Quick Catalog */}
                                        {digitalTwins.length > 0 && (
                                            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h2 className="text-base font-bold text-ink">
                                                            Ready-to-License Digital Twins
                                                        </h2>
                                                        <p className="text-xs text-slate-500">
                                                            Pick a model to buy its 6-pose preset or customize attributes
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href="/digital-twins"
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                                    >
                                                        Full Catalog <ArrowUpRight size={14} />
                                                    </Link>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                                    {digitalTwins.map((twin) => (
                                                        <div
                                                            key={twin.id ?? twin.lookNumber}
                                                            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-[#f8fafc] p-3"
                                                        >
                                                            <div>
                                                                <div
                                                                    className="relative aspect-[3/4] overflow-hidden rounded-lg"
                                                                    style={{
                                                                        background: CARD_PREVIEW_BG,
                                                                    }}
                                                                >
                                                                    <TwinSpriteCrop
                                                                        twin={twin}
                                                                        className="h-full w-full object-contain"
                                                                    />
                                                                </div>
                                                                <h3 className="mt-2 truncate text-xs font-bold text-ink">
                                                                    {twin.name}
                                                                </h3>
                                                                <p className="text-[11px] text-slate-500">
                                                                    Preset:{' '}
                                                                    <strong>{twin.presetPrice}</strong>
                                                                </p>
                                                            </div>
                                                            <div className="mt-3 space-y-1.5">
                                                                <Link
                                                                    href={digitalTwinOrderUrl({
                                                                        mode: 'preset',
                                                                        twin: twin.slug || twin.name,
                                                                    })}
                                                                    className="block w-full rounded-lg bg-primary py-1.5 text-center text-[11px] font-bold text-white hover:bg-primary-hover"
                                                                >
                                                                    Order ({twin.presetPrice})
                                                                </Link>
                                                                <Link
                                                                    href={digitalTwinOrderUrl({
                                                                        mode: 'custom',
                                                                        twin: twin.slug || twin.name,
                                                                    })}
                                                                    className="block w-full rounded-lg border border-slate-300 bg-white py-1.5 text-center text-[11px] font-bold text-ink hover:border-primary hover:text-primary"
                                                                >
                                                                    Customize
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Virtual Try-On Models */}
                                        {tryOnLooks.length > 0 && (
                                            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h2 className="text-base font-bold text-ink">
                                                            Virtual Try-On Studio Models
                                                        </h2>
                                                        <p className="text-xs text-slate-500">
                                                            Click a model to pre-select for your Virtual Try-On quote
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                                    {tryOnLooks.map((look) => (
                                                        <Link
                                                            key={look.id ?? look.name}
                                                            href={tryOnQuoteUrl({ look: look.name })}
                                                            className="group rounded-xl border border-slate-200 bg-[#f8fafc] p-3 hover:border-primary transition-all"
                                                        >
                                                            <div
                                                                className="aspect-[3/4] overflow-hidden rounded-lg"
                                                                style={{
                                                                    background: CARD_PREVIEW_BG,
                                                                }}
                                                            >
                                                                <img
                                                                    src={look.model}
                                                                    alt={look.modelName}
                                                                    className="h-full w-full object-contain object-bottom transition-transform group-hover:scale-105"
                                                                />
                                                            </div>
                                                            <h3 className="mt-2 truncate text-xs font-bold text-ink">
                                                                {look.modelName}
                                                            </h3>
                                                            <p className="truncate text-[11px] text-slate-500">
                                                                {look.name}
                                                            </p>
                                                            <span className="mt-2 block rounded-lg bg-primary/10 py-1.5 text-center text-[11px] font-bold text-primary group-hover:bg-primary group-hover:text-white">
                                                                Select Model →
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* VIEW 4: ACCOUNT SETTINGS */}
                            {activeView === 'settings' && (
                                <>
                                    <AdminPageHeader
                                        title="Profile & Security"
                                        description="Update your contact information, company details, or account password."
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <form
                                            onSubmit={handleProfileSubmit}
                                            className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs"
                                        >
                                            <h2 className="text-base font-bold text-ink">
                                                Profile Information
                                            </h2>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={profileForm.data.name}
                                                    onChange={(e) =>
                                                        profileForm.setData('name', e.target.value)
                                                    }
                                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700">
                                                    Brand / Company
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.company}
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'company',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700">
                                                    Phone / WhatsApp
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={profileForm.data.phone}
                                                    onChange={(e) =>
                                                        profileForm.setData('phone', e.target.value)
                                                    }
                                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={profileForm.processing}
                                                className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold"
                                            >
                                                {profileForm.processing
                                                    ? 'Saving...'
                                                    : 'Save Profile'}
                                            </Button>
                                        </form>

                                        <form
                                            onSubmit={handlePasswordSubmit}
                                            className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs"
                                        >
                                            <h2 className="text-base font-bold text-ink">
                                                Update Password
                                            </h2>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwordForm.data.password}
                                                    onChange={(e) =>
                                                        passwordForm.setData(
                                                            'password',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Min. 8 characters"
                                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                                />
                                                {passwordForm.errors.password && (
                                                    <p className="mt-1 text-xs text-rose-600">
                                                        {passwordForm.errors.password}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={
                                                        passwordForm.data.password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        passwordForm.setData(
                                                            'password_confirmation',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={passwordForm.processing}
                                                className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold"
                                            >
                                                {passwordForm.processing
                                                    ? 'Updating...'
                                                    : 'Update Password'}
                                            </Button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>

            {/* ORDER DETAIL MODAL */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-ink shadow-2xl sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="rounded-lg bg-ink px-2.5 py-0.5 text-xs font-bold text-white">
                                        #{selectedOrder.order_number}
                                    </span>
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                                <h3 className="mt-2 text-lg font-bold text-ink">
                                    {selectedOrder.service_name}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Submitted on {selectedOrder.created_at_formatted}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-slate-100 text-ink hover:bg-slate-200"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="mt-5 space-y-5 text-xs">
                            {selectedOrder.specifications &&
                                Object.keys(selectedOrder.specifications).length > 0 && (
                                    <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 space-y-3">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                                            Order Specifications
                                        </span>

                                        {selectedOrder.specifications.reference_twin_name && (
                                            <div>
                                                <span className="text-slate-500">
                                                    Reference / Model:{' '}
                                                </span>
                                                <strong className="text-ink">
                                                    {selectedOrder.specifications.reference_twin_name}
                                                </strong>
                                            </div>
                                        )}

                                        {selectedOrder.specifications.selected_model_name && (
                                            <div>
                                                <span className="text-slate-500">Try-On Model: </span>
                                                <strong className="text-ink">
                                                    {selectedOrder.specifications.selected_model_name}{' '}
                                                    ({selectedOrder.specifications.selected_look_name})
                                                </strong>
                                            </div>
                                        )}

                                        {selectedOrder.specifications.attributes &&
                                            Object.keys(selectedOrder.specifications.attributes)
                                                .length > 0 && (
                                                <div className="grid grid-cols-2 gap-2 pt-2">
                                                    {Object.entries(
                                                        selectedOrder.specifications.attributes
                                                    ).map(([k, v]) => (
                                                        <div
                                                            key={k}
                                                            className="rounded-xl border border-slate-200 bg-white p-2.5"
                                                        >
                                                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                                {k}
                                                            </span>
                                                            <span className="font-bold text-ink">
                                                                {typeof v === 'object' && v !== null
                                                                    ? Object.entries(v)
                                                                          .map(
                                                                              ([subK, subV]) =>
                                                                                  `${subK}: ${subV}`
                                                                          )
                                                                          .join(' | ')
                                                                    : String(v)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
                                )}

                            {selectedOrder.instructions && (
                                <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                                        Notes / Description
                                    </span>
                                    <p className="mt-1 text-ink">{selectedOrder.instructions}</p>
                                </div>
                            )}

                            {selectedOrder.images.length > 0 && (
                                <div>
                                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                                        Uploaded Files ({selectedOrder.images.length})
                                    </span>
                                    <div className="grid grid-cols-3 gap-3">
                                        {selectedOrder.images.map((imgUrl, idx) => (
                                            <a
                                                key={idx}
                                                href={imgUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc]"
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`Attachment ${idx + 1}`}
                                                    className="h-28 w-full object-cover"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedOrder.completed_files &&
                                selectedOrder.completed_files.length > 0 && (
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                        <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-2">
                                            Completed Studio Deliverables
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedOrder.completed_files.map((fileUrl, idx) => (
                                                <a
                                                    key={idx}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                                                >
                                                    <Download size={13} />
                                                    Download Deliverable #{idx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </TooltipProvider>
    );
}
