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
    Settings,
    Shirt,
    ShoppingBag,
    Sparkles,
    UserCheck,
    Wand2,
    X,
} from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import { DigitalTwinModel } from '@/Components/Landing/DigitalTwins/twins';
import { Look } from '@/Components/Landing/TryOn/looks';
import { digitalTwinOrderUrl, tryOnQuoteUrl } from '@/Components/Landing/shared';
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

type PortalView = 'overview' | 'orders' | 'studio' | 'settings';

export default function ClientDashboard({
    orders = [],
    stats,
    digitalTwins = [],
    tryOnLooks = [],
}: ClientDashboardProps) {
    const { auth, flash } = usePage<{
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
    }>().props;

    const user = auth?.user;
    const [activeView, setActiveView] = useState<PortalView>('overview');
    const [orderFilter, setOrderFilter] = useState<'all' | 'twins' | 'tryon'>('all');
    const [selectedOrder, setSelectedOrder] = useState<ClientOrderItem | null>(null);

    React.useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const filteredOrders = useMemo(() => {
        if (orderFilter === 'twins') {
            return orders.filter((o) => o.order_type.startsWith('digital_twin'));
        }
        if (orderFilter === 'tryon') {
            return orders.filter((o) => o.order_type === 'virtual_try_on_quote');
        }
        return orders;
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
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 size={12} />
                        Completed
                    </span>
                );
            case 'in_production':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700">
                        <Layers size={12} />
                        In Production
                    </span>
                );
            case 'review':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
                        <Eye size={12} />
                        Quality Review
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                        <Clock size={12} />
                        Pending Review
                    </span>
                );
        }
    };

    const navItems: {
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
            id: 'studio',
            name: 'Quick Order Studio',
            icon: Sparkles,
        },
        {
            id: 'settings',
            name: 'Account Settings',
            icon: Settings,
        },
    ];

    const viewTitles: Record<PortalView, string> = {
        overview: 'Client Dashboard',
        orders: 'My Orders & Quotes',
        studio: 'Quick Order Studio',
        settings: 'Account & Security Settings',
    };

    return (
        <TooltipProvider>
            <SeoHead
                title="Client Portal — Orders, Digital Twins & Virtual Try-On"
                description="Manage your CuttingEdger Digital Twin orders, Virtual Try-On quotes, and studio deliverables."
            />
            <SidebarProvider defaultOpen={true}>
                <div className="admin-shell min-h-screen w-full bg-[#f5f7fb] text-ink flex antialiased">
                    {/* Clean Light Editorial Client Sidebar */}
                    <Sidebar className="border-r border-slate-200/90 bg-white text-ink">
                        <SidebarHeader className="border-b border-slate-100 px-5 py-4">
                            <Link
                                href="/portal"
                                className="flex items-center justify-between gap-2 group cursor-pointer"
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
                                        <span className="text-[11px] font-medium text-primary block mt-0.5">
                                            Client Portal
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </SidebarHeader>

                        <SidebarContent className="px-3 py-4 space-y-6 bg-white">
                            {/* Main Portal Views */}
                            <SidebarGroup className="p-0">
                                <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2.5 mb-1">
                                    Client Workspace
                                </SidebarGroupLabel>
                                <SidebarMenu className="space-y-0.5">
                                    {navItems.map((item) => {
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

                            {/* Direct Order Studio Links */}
                            <SidebarGroup className="p-0">
                                <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2.5 mb-1">
                                    New Orders & Catalogs
                                </SidebarGroupLabel>
                                <SidebarMenu className="space-y-0.5">
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className="rounded-xl text-[13px] py-2 px-2.5 text-slate-600 font-medium hover:text-ink hover:bg-slate-100/80"
                                        >
                                            <Link
                                                href={digitalTwinOrderUrl({ mode: 'custom' })}
                                                className="flex items-center gap-2.5 w-full"
                                            >
                                                <Wand2 className="w-4 h-4 text-primary shrink-0" />
                                                <span className="truncate flex-1">
                                                    Order Digital Twin
                                                </span>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className="rounded-xl text-[13px] py-2 px-2.5 text-slate-600 font-medium hover:text-ink hover:bg-slate-100/80"
                                        >
                                            <Link
                                                href={tryOnQuoteUrl()}
                                                className="flex items-center gap-2.5 w-full"
                                            >
                                                <Shirt className="w-4 h-4 text-primary shrink-0" />
                                                <span className="truncate flex-1">
                                                    Virtual Try-On Quote
                                                </span>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className="rounded-xl text-[13px] py-2 px-2.5 text-slate-600 font-medium hover:text-ink hover:bg-slate-100/80"
                                        >
                                            <Link
                                                href="/digital-twins"
                                                className="flex items-center gap-2.5 w-full"
                                            >
                                                <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="truncate flex-1">
                                                    Browse Model Catalog
                                                </span>
                                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                            </Link>
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
                        {/* Sticky Top Bar */}
                        <header className="h-15 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="text-slate-500 hover:text-ink hover:bg-slate-100" />
                                <div className="h-4 w-px bg-slate-200" />
                                <span className="text-sm font-bold text-ink">
                                    {viewTitles[activeView]}
                                </span>
                                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                    <UserCheck className="w-3 h-3" />
                                    Verified Client
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={digitalTwinOrderUrl({ mode: 'custom' })}
                                    className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-ink text-white hover:bg-primary transition-colors"
                                >
                                    <Wand2 className="w-3.5 h-3.5" />
                                    <span>Order Digital Twin</span>
                                </Link>
                                <Link
                                    href={tryOnQuoteUrl()}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-primary text-white hover:brightness-110 transition-all shadow-2xs"
                                >
                                    <Shirt className="w-3.5 h-3.5" />
                                    <span>Try-On Quote</span>
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-ink transition-colors"
                                >
                                    <span>Website</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </header>

                        <Toaster />

                        {/* Main Portal Body */}
                        <div className="p-6 sm:p-8 flex-1 max-w-[1600px] w-full mx-auto space-y-8">
                            {/* VIEW 1: OVERVIEW */}
                            {activeView === 'overview' && (
                                <>
                                    {/* Welcome Banner */}
                                    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                                Welcome Back
                                            </span>
                                            <h1 className="text-xl sm:text-2xl font-extrabold text-ink mt-0.5">
                                                {user?.name}
                                                {user?.company ? (
                                                    <span className="text-slate-400 font-medium text-base">
                                                        {' '}
                                                        · {user.company}
                                                    </span>
                                                ) : null}
                                            </h1>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Track your Digital Twin productions, Virtual Try-On quotes, and studio deliverables in one place.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <button
                                                type="button"
                                                onClick={() => setActiveView('studio')}
                                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-ink transition-colors cursor-pointer"
                                            >
                                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                                Quick Studio Picker
                                            </button>
                                            <Link
                                                href={digitalTwinOrderUrl({ mode: 'custom' })}
                                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:brightness-110 transition-all shadow-xs"
                                            >
                                                <Wand2 className="w-3.5 h-3.5" />
                                                New Custom Twin
                                            </Link>
                                        </div>
                                    </div>

                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                                            <span className="text-xs font-semibold text-slate-500">
                                                Total Orders & Quotes
                                            </span>
                                            <p className="mt-2 text-2xl font-extrabold text-ink">
                                                {stats.total_orders}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                                            <span className="text-xs font-semibold text-amber-600">
                                                In Progress / Review
                                            </span>
                                            <p className="mt-2 text-2xl font-extrabold text-ink">
                                                {stats.in_progress}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                                            <span className="text-xs font-semibold text-emerald-600">
                                                Completed Deliverables
                                            </span>
                                            <p className="mt-2 text-2xl font-extrabold text-ink">
                                                {stats.completed}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                                            <span className="text-xs font-semibold text-primary">
                                                Twins / Try-On Quotes
                                            </span>
                                            <p className="mt-2 text-2xl font-extrabold text-ink">
                                                {stats.digital_twin_orders} / {stats.try_on_quotes}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Recent Orders Section */}
                                    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h2 className="text-base font-extrabold text-ink">
                                                    Recent Orders & Quotes
                                                </h2>
                                                <p className="text-xs text-slate-500">
                                                    Inspect specifications, uploaded garments, and production status.
                                                </p>
                                            </div>
                                            {orders.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveView('orders')}
                                                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                                                >
                                                    View All ({orders.length}) →
                                                </button>
                                            )}
                                        </div>

                                        {orders.length > 0 ? (
                                            <div className="space-y-3">
                                                {orders.slice(0, 5).map((order) => (
                                                    <div
                                                        key={order.id}
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-[#f8fafc] p-4 hover:border-primary/40 transition-colors"
                                                    >
                                                        <div className="space-y-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="rounded-md bg-ink px-2 py-0.5 text-xs font-bold text-white">
                                                                    #{order.order_number}
                                                                </span>
                                                                {getStatusBadge(order.status)}
                                                                <span className="text-xs text-slate-400">
                                                                    {order.created_at_formatted}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-sm font-bold text-ink">
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
                                                                    Amount
                                                                </span>
                                                                <span className="text-xs font-extrabold text-ink">
                                                                    {order.total_price > 0
                                                                        ? `$${order.total_price.toFixed(2)} ${order.currency}`
                                                                        : 'Custom Quote'}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-ink hover:border-primary hover:text-primary transition-colors cursor-pointer"
                                                            >
                                                                <Eye size={13} />
                                                                Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center">
                                                <ShoppingBag className="mx-auto h-8 w-8 text-primary" />
                                                <h3 className="mt-2 text-sm font-bold text-ink">
                                                    No orders or quotes yet
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                                                    Start by configuring a Custom AI Digital Twin, licensing a 6-pose preset, or requesting a Virtual Try-On quote.
                                                </p>
                                                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                                                    <Link
                                                        href={digitalTwinOrderUrl({ mode: 'custom' })}
                                                        className="px-4 py-2 rounded-xl bg-ink text-white text-xs font-bold hover:bg-primary"
                                                    >
                                                        Order Digital Twin
                                                    </Link>
                                                    <Link
                                                        href={tryOnQuoteUrl()}
                                                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:brightness-110"
                                                    >
                                                        Request Try-On Quote
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* VIEW 2: ALL ORDERS & QUOTES */}
                            {activeView === 'orders' && (
                                <div className="space-y-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
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
                                            <button
                                                type="button"
                                                onClick={() => setOrderFilter('twins')}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                                    orderFilter === 'twins'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:text-ink'
                                                }`}
                                            >
                                                Digital Twins ({stats.digital_twin_orders})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOrderFilter('tryon')}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                                    orderFilter === 'tryon'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:text-ink'
                                                }`}
                                            >
                                                Virtual Try-On ({stats.try_on_quotes})
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {filteredOrders.length > 0 ? (
                                            filteredOrders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-primary/40 transition-colors"
                                                >
                                                    <div className="space-y-1.5">
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
                                                                    : 'Custom Studio Quote'}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-primary text-xs font-bold text-ink hover:text-primary transition-colors cursor-pointer"
                                                        >
                                                            <Eye size={14} />
                                                            View Spec & Files
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
                                                <p className="text-sm font-bold text-ink">
                                                    No matching orders found.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* VIEW 3: QUICK ORDER STUDIO */}
                            {activeView === 'studio' && (
                                <div className="space-y-8">
                                    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                                    Section 01
                                                </span>
                                                <h2 className="text-lg font-extrabold text-ink">
                                                    Digital Twins — Select a Model
                                                </h2>
                                            </div>
                                            <Link
                                                href="/digital-twins"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
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
                                                            style={{ background: CARD_PREVIEW_BG }}
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
                                                            Preset: <strong>{twin.presetPrice}</strong>
                                                        </p>
                                                    </div>
                                                    <div className="mt-3 space-y-1.5">
                                                        <Link
                                                            href={digitalTwinOrderUrl({
                                                                mode: 'preset',
                                                                twin: twin.slug || twin.name,
                                                            })}
                                                            className="block w-full rounded-lg bg-ink py-1.5 text-center text-[11px] font-bold text-white hover:bg-primary"
                                                        >
                                                            Buy Preset ({twin.presetPrice})
                                                        </Link>
                                                        <Link
                                                            href={digitalTwinOrderUrl({
                                                                mode: 'custom',
                                                                twin: twin.slug || twin.name,
                                                            })}
                                                            className="block w-full rounded-lg border border-slate-300 bg-white py-1.5 text-center text-[11px] font-bold text-ink hover:border-primary hover:text-primary"
                                                        >
                                                            Customize Twin
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                                    Section 02
                                                </span>
                                                <h2 className="text-lg font-extrabold text-ink">
                                                    Virtual Try-On — Select a Studio Model
                                                </h2>
                                            </div>
                                            <Link
                                                href={tryOnQuoteUrl()}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                            >
                                                Or upload your own model <ArrowUpRight size={14} />
                                            </Link>
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
                                                        style={{ background: CARD_PREVIEW_BG }}
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
                                </div>
                            )}

                            {/* VIEW 4: ACCOUNT SETTINGS */}
                            {activeView === 'settings' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <form
                                        onSubmit={handleProfileSubmit}
                                        className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs"
                                    >
                                        <h2 className="text-base font-extrabold text-ink">
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
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
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
                                                    profileForm.setData('company', e.target.value)
                                                }
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
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
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:brightness-110 disabled:opacity-50"
                                        >
                                            {profileForm.processing ? 'Saving...' : 'Save Profile'}
                                        </button>
                                    </form>

                                    <form
                                        onSubmit={handlePasswordSubmit}
                                        className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs"
                                    >
                                        <h2 className="text-base font-extrabold text-ink">
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
                                                    passwordForm.setData('password', e.target.value)
                                                }
                                                placeholder="Min. 8 characters"
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
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
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        'password_confirmation',
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="cursor-pointer rounded-xl bg-ink px-5 py-2.5 text-xs font-bold text-white hover:bg-primary disabled:opacity-50"
                                        >
                                            {passwordForm.processing
                                                ? 'Updating...'
                                                : 'Update Password'}
                                        </button>
                                    </form>
                                </div>
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
