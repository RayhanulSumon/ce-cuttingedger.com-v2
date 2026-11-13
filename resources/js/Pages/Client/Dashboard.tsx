import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Crown,
    Download,
    ExternalLink,
    Eye,
    Folder,
    Layers,
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
import { digitalTwinOrderUrl, PAD_X, tryOnQuoteUrl } from '@/Components/Landing/shared';
import { LandingLayout } from '@/Layouts/LandingLayout';

const PAGE_BACKGROUND =
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
    const [activeTab, setActiveTab] = useState<'orders' | 'studio' | 'settings'>('orders');
    const [selectedOrder, setSelectedOrder] = useState<ClientOrderItem | null>(null);

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
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 size={12} />
                        Completed
                    </span>
                );
            case 'in_production':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700">
                        <Layers size={12} />
                        In Production
                    </span>
                );
            case 'review':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700">
                        <Eye size={12} />
                        Quality Review
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        <Clock size={12} />
                        Pending Review
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white text-ink">
            <SeoHead
                title="Client Portal — Orders, Digital Twins & Virtual Try-On"
                description="Manage your CuttingEdger Digital Twin orders, Virtual Try-On quotes, and studio deliverables."
            />

            {/* Header Hero */}
            <section style={{ background: PAGE_BACKGROUND }} className={`pb-10 pt-28 sm:pt-32 ${PAD_X}`}>
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div className="flex items-start gap-4">
                            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary text-lg font-extrabold text-white shadow-md shadow-primary/20">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    (user?.name || 'C').charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                                        Client Studio Portal
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                        <UserCheck size={11} />
                                        Verified Account
                                    </span>
                                </div>
                                <h1 className="mt-1 font-michroma text-[clamp(22px,2.8vw,36px)] font-normal leading-tight tracking-[0.06em] text-ink">
                                    Welcome, {user?.name}
                                </h1>
                                <p className="mt-1 text-xs text-subtle sm:text-sm">
                                    {user?.email}
                                    {user?.company ? ` • ${user.company}` : ''}
                                </p>
                            </div>
                        </div>

                        {/* Quick Order Actions */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <Link
                                href={digitalTwinOrderUrl({ mode: 'custom' })}
                                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-primary"
                            >
                                <Wand2 size={14} />
                                Order Digital Twin
                            </Link>
                            <Link
                                href={tryOnQuoteUrl()}
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:brightness-110"
                            >
                                <Shirt size={14} />
                                Request Try-On Quote
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-xs font-bold text-subtle transition-colors hover:border-rose-300 hover:text-rose-600"
                            >
                                <LogOut size={13} />
                                Sign Out
                            </Link>
                        </div>
                    </div>

                    {/* KPI Summary Cards */}
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-subtle">
                                Total Orders & Quotes
                            </span>
                            <p className="mt-1 text-2xl font-extrabold text-ink">
                                {stats.total_orders}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                                In Progress / Review
                            </span>
                            <p className="mt-1 text-2xl font-extrabold text-ink">
                                {stats.in_progress}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                                Completed
                            </span>
                            <p className="mt-1 text-2xl font-extrabold text-ink">
                                {stats.completed}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                Twins / Try-On Quotes
                            </span>
                            <p className="mt-1 text-2xl font-extrabold text-ink">
                                {stats.digital_twin_orders} / {stats.try_on_quotes}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portal Navigation Tabs */}
            <div className={`border-y border-ink/10 bg-white ${PAD_X}`}>
                <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-3">
                    <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                            activeTab === 'orders'
                                ? 'bg-ink text-white'
                                : 'text-subtle hover:bg-ink/5 hover:text-ink'
                        }`}
                    >
                        <ShoppingBag size={14} />
                        My Orders & Quotes ({orders.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('studio')}
                        className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                            activeTab === 'studio'
                                ? 'bg-ink text-white'
                                : 'text-subtle hover:bg-ink/5 hover:text-ink'
                        }`}
                    >
                        <Sparkles size={14} />
                        Quick Order Studio
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                            activeTab === 'settings'
                                ? 'bg-ink text-white'
                                : 'text-subtle hover:bg-ink/5 hover:text-ink'
                        }`}
                    >
                        <Settings size={14} />
                        Account Settings
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className={`py-10 sm:py-14 ${PAD_X}`}>
                <div className="mx-auto max-w-7xl">
                    {flash?.success && (
                        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-emerald-950">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                            <p className="text-xs font-semibold leading-relaxed">{flash.success}</p>
                        </div>
                    )}

                    {/* TAB 1: MY ORDERS & QUOTES */}
                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex flex-col justify-between gap-4 rounded-3xl border border-ink/10 bg-[#f8fafc] p-5 transition-all hover:border-primary/40 sm:flex-row sm:items-center sm:p-6"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-lg bg-ink px-2.5 py-1 text-xs font-bold text-white">
                                                    #{order.order_number}
                                                </span>
                                                {getStatusBadge(order.status)}
                                                <span className="text-xs text-subtle">
                                                    {order.created_at_formatted}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold text-ink">
                                                {order.service_name}
                                            </h3>

                                            <p className="text-xs text-subtle">
                                                Turnaround: <strong>{order.turnaround}</strong> •{' '}
                                                {order.uploaded_count} file(s) attached
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
                                            <div className="text-left sm:text-right">
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-subtle">
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
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-bold text-ink transition-colors hover:border-primary hover:text-primary"
                                            >
                                                <Eye size={14} />
                                                View Spec & Files
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-3xl border border-ink/10 bg-[#f8fafc] p-12 text-center">
                                    <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
                                    <h3 className="mt-3 text-lg font-bold text-ink">
                                        No orders or quotes yet
                                    </h3>
                                    <p className="mx-auto mt-1 max-w-md text-xs text-subtle">
                                        Configure your first bespoke AI Digital Twin, license a 6-pose preset, or request a Virtual Try-On quote below.
                                    </p>
                                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                                        <Link
                                            href={digitalTwinOrderUrl({ mode: 'custom' })}
                                            className="rounded-full bg-ink px-6 py-3 text-xs font-bold text-white hover:bg-primary"
                                        >
                                            Order Custom Digital Twin
                                        </Link>
                                        <Link
                                            href={tryOnQuoteUrl()}
                                            className="rounded-full bg-primary px-6 py-3 text-xs font-bold text-white hover:brightness-110"
                                        >
                                            Request Virtual Try-On Quote
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: QUICK ORDER STUDIO */}
                    {activeTab === 'studio' && (
                        <div className="space-y-10">
                            {/* Digital Twins Quick Picker */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                                            Section 01
                                        </span>
                                        <h2 className="mt-0.5 text-xl font-bold text-ink">
                                            Digital Twins — Quick Order
                                        </h2>
                                    </div>
                                    <Link
                                        href="/digital-twins"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                    >
                                        Full Catalog <ArrowUpRight size={14} />
                                    </Link>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                                    {digitalTwins.map((twin) => (
                                        <div
                                            key={twin.id ?? twin.lookNumber}
                                            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-white p-3 shadow-xs"
                                        >
                                            <div>
                                                <div
                                                    className="relative aspect-[3/4] overflow-hidden rounded-xl"
                                                    style={{ background: PAGE_BACKGROUND }}
                                                >
                                                    <TwinSpriteCrop
                                                        twin={twin}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                                <h3 className="mt-2 truncate text-xs font-bold text-ink">
                                                    {twin.name}
                                                </h3>
                                                <p className="text-[11px] text-subtle">
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
                                                    className="block w-full rounded-lg border border-ink/15 py-1.5 text-center text-[11px] font-bold text-ink hover:border-primary hover:text-primary"
                                                >
                                                    Customize Twin
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Virtual Try-On Quick Picker */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                                            Section 02
                                        </span>
                                        <h2 className="mt-0.5 text-xl font-bold text-ink">
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

                                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                                    {tryOnLooks.map((look) => (
                                        <Link
                                            key={look.id ?? look.name}
                                            href={tryOnQuoteUrl({ look: look.name })}
                                            className="group overflow-hidden rounded-2xl border border-ink/10 bg-white p-3 shadow-xs transition-all hover:border-primary"
                                        >
                                            <div
                                                className="aspect-[3/4] overflow-hidden rounded-xl"
                                                style={{ background: PAGE_BACKGROUND }}
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
                                            <p className="truncate text-[11px] text-subtle">
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

                    {/* TAB 3: ACCOUNT SETTINGS */}
                    {activeTab === 'settings' && (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <form
                                onSubmit={handleProfileSubmit}
                                className="space-y-4 rounded-3xl border border-ink/10 bg-[#f8fafc] p-6 sm:p-8"
                            >
                                <h2 className="text-lg font-bold text-ink">Profile Information</h2>
                                <div>
                                    <label className="block text-xs font-bold text-ink">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-ink">
                                        Brand / Company
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.company}
                                        onChange={(e) =>
                                            profileForm.setData('company', e.target.value)
                                        }
                                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-ink">
                                        Phone / WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        value={profileForm.data.phone}
                                        onChange={(e) =>
                                            profileForm.setData('phone', e.target.value)
                                        }
                                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="cursor-pointer rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 disabled:opacity-50"
                                >
                                    {profileForm.processing ? 'Saving...' : 'Save Profile'}
                                </button>
                            </form>

                            <form
                                onSubmit={handlePasswordSubmit}
                                className="space-y-4 rounded-3xl border border-ink/10 bg-[#f8fafc] p-6 sm:p-8"
                            >
                                <h2 className="text-lg font-bold text-ink">Update Password</h2>
                                <div>
                                    <label className="block text-xs font-bold text-ink">
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
                                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                    />
                                    {passwordForm.errors.password && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {passwordForm.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-ink">
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
                                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="cursor-pointer rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary disabled:opacity-50"
                                >
                                    {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>

            {/* ORDER DETAIL MODAL */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-ink/10 bg-white p-6 text-ink shadow-2xl sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
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
                                <p className="text-xs text-subtle">
                                    Submitted on {selectedOrder.created_at_formatted}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-ink/5 text-ink hover:bg-ink/10"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="mt-5 space-y-5 text-xs">
                            {/* Specifications Summary */}
                            {selectedOrder.specifications &&
                                Object.keys(selectedOrder.specifications).length > 0 && (
                                    <div className="rounded-2xl border border-ink/10 bg-[#f8fafc] p-4 space-y-3">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                                            Order Specifications
                                        </span>

                                        {selectedOrder.specifications.reference_twin_name && (
                                            <div>
                                                <span className="text-subtle">Reference / Model: </span>
                                                <strong className="text-ink">
                                                    {selectedOrder.specifications.reference_twin_name}
                                                </strong>
                                            </div>
                                        )}

                                        {selectedOrder.specifications.selected_model_name && (
                                            <div>
                                                <span className="text-subtle">Try-On Model: </span>
                                                <strong className="text-ink">
                                                    {selectedOrder.specifications.selected_model_name} (
                                                    {selectedOrder.specifications.selected_look_name})
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
                                                            className="rounded-xl border border-ink/10 bg-white p-2.5"
                                                        >
                                                            <span className="block text-[10px] font-bold uppercase text-subtle">
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
                                <div className="rounded-2xl border border-ink/10 bg-[#f8fafc] p-4">
                                    <span className="block text-[10px] font-bold uppercase text-subtle">
                                        Notes / Description
                                    </span>
                                    <p className="mt-1 text-ink">{selectedOrder.instructions}</p>
                                </div>
                            )}

                            {/* Attached Images */}
                            {selectedOrder.images.length > 0 && (
                                <div>
                                    <span className="block text-[11px] font-bold uppercase tracking-wider text-subtle mb-2">
                                        Uploaded Files ({selectedOrder.images.length})
                                    </span>
                                    <div className="grid grid-cols-3 gap-3">
                                        {selectedOrder.images.map((imgUrl, idx) => (
                                            <a
                                                key={idx}
                                                href={imgUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="overflow-hidden rounded-xl border border-ink/10 bg-[#f8fafc]"
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`Attachment ${idx + 1}`}
                                                    className="aspect-square w-full object-cover"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

ClientDashboard.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;

