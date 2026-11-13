import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Layers,
    FolderKanban,
    Users,
    Briefcase,
    Building2,
    MessageSquareQuote,
    Newspaper,
    Tag,
    HelpCircle,
    CreditCard,
    Mail,
    Send,
    Settings,
    Shield,
    LogOut,
    ExternalLink,
    ChevronRight,
    Terminal,
    CheckCircle2,
    AlertCircle,
    X,
    CalendarCheck2,
    MessageSquareText,
    Sparkles,
    ShoppingBag,
    Code2,
    ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { Toaster, toast } from "@/Components/ui/sonner";
import { AdminNotificationDropdown } from "@/Components/Admin/AdminNotificationDropdown";
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
} from "@/Components/ui/sidebar";
import { TooltipProvider } from "@/Components/ui/tooltip";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    const { url } = usePage();
    const sidebarContentRef = React.useRef<HTMLDivElement>(null);

    // Restore sidebar scroll position on mount & page navigation
    React.useLayoutEffect(() => {
        const saved = sessionStorage.getItem("admin_sidebar_scroll");
        if (saved && sidebarContentRef.current) {
            sidebarContentRef.current.scrollTop = parseInt(saved, 10);
        }
    }, [url]);

    const handleSidebarScroll = (e: React.UIEvent<HTMLDivElement>) => {
        sessionStorage.setItem("admin_sidebar_scroll", String(e.currentTarget.scrollTop));
    };

    const { auth, flash, admin_badges } = usePage<{
        auth: { user: { name: string; email: string; role: string } | null };
        flash: { success?: string; error?: string };
        admin_badges?: {
            pending_orders?: number;
            pending_consultations: number;
            pending_trials?: number;
            unread_leads: number;
            new_messages: number;
        };
    }>().props;

    React.useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const user = auth?.user;
    const isSuperAdmin = user?.role === "super_admin";

    const getRoleBadge = (roleName?: string) => {
        if (roleName === "super_admin") {
            return (
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-primary/30 bg-primary/10 text-primary whitespace-nowrap shadow-xs">
                    SUPER ADMIN
                </span>
            );
        }
        if (roleName === "admin") {
            return (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-600/30 bg-emerald-50 text-emerald-700 whitespace-nowrap">
                    ADMIN
                </span>
            );
        }
        return (
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-slate-200 bg-slate-100 text-slate-600 whitespace-nowrap">
                USER
            </span>
        );
    };

    const navSections = [
        {
            title: "OVERVIEW",
            items: [
                {
                    name: "Command Center",
                    href: "/admin",
                    icon: LayoutDashboard,
                    active: url === "/admin",
                },
            ],
        },
        {
            title: "PORTFOLIO & CORE",
            items: [
                {
                    name: "Digital Twins",
                    href: "/admin/digital-twins",
                    icon: Sparkles,
                    active: url.startsWith("/admin/digital-twins"),
                },
                {
                    name: "Virtual Try-On",
                    href: "/admin/try-on-looks",
                    icon: Layers,
                    active: url.startsWith("/admin/try-on-looks"),
                },
                {
                    name: "Projects",
                    href: "/admin/projects",
                    icon: FolderKanban,
                    active: url.startsWith("/admin/projects"),
                },
                {
                    name: "Capabilities",
                    href: "/admin/capabilities",
                    icon: Layers,
                    active: url.startsWith("/admin/capabilities"),
                },
                {
                    name: "Blogs",
                    href: "/admin/blogs",
                    icon: Newspaper,
                    active: url.startsWith("/admin/blogs"),
                },
                {
                    name: "Blog Categories",
                    href: "/admin/blog-categories",
                    icon: Tag,
                    active: url.startsWith("/admin/blog-categories"),
                },
            ],
        },
        {
            title: "AGENCY & CREW",
            items: [
                {
                    name: "Team Members",
                    href: "/admin/team",
                    icon: Users,
                    active: url.startsWith("/admin/team"),
                },
                {
                    name: "Clients & Logos",
                    href: "/admin/clients",
                    icon: Building2,
                    active: url.startsWith("/admin/clients"),
                },
                {
                    name: "Testimonials",
                    href: "/admin/testimonials",
                    icon: MessageSquareQuote,
                    active: url.startsWith("/admin/testimonials"),
                },
                {
                    name: "Career Openings",
                    href: "/admin/careers",
                    icon: Briefcase,
                    active: url.startsWith("/admin/careers"),
                },
            ],
        },
        {
            title: "COMMERCIAL & ENGAGEMENT",
            items: [
                {
                    name: "Pricing Plans",
                    href: "/admin/pricing",
                    icon: CreditCard,
                    active: url.startsWith("/admin/pricing"),
                },
                {
                    name: "FAQs",
                    href: "/admin/faqs",
                    icon: HelpCircle,
                    active: url.startsWith("/admin/faqs"),
                },
                {
                    name: "Inquiries Inbox",
                    href: "/admin/messages",
                    icon: Mail,
                    active: url.startsWith("/admin/messages"),
                    badge: admin_badges?.new_messages ? `${admin_badges.new_messages}` : null,
                    badgeColor: "bg-amber-400 text-black",
                },
                {
                    name: "Subscribers",
                    href: "/admin/subscribers",
                    icon: Send,
                    active: url.startsWith("/admin/subscribers"),
                },
            ],
        },
        {
            title: "AI ASSISTANT & LEADS",
            items: [
                {
                    name: "Client Orders",
                    href: "/admin/orders",
                    icon: ShoppingBag,
                    active: url.startsWith("/admin/orders"),
                    badge: admin_badges?.pending_orders
                        ? `${admin_badges.pending_orders}`
                        : null,
                    badgeColor: "bg-accent text-black",
                },
                {
                    name: "Calendar Bookings",
                    href: "/admin/consultations",
                    icon: CalendarCheck2,
                    active: url.startsWith("/admin/consultations"),
                    badge: admin_badges?.pending_consultations
                        ? `${admin_badges.pending_consultations}`
                        : null,
                    badgeColor: "bg-[#00f5ff] text-black",
                },
                {
                    name: "Chat Transcripts & Leads",
                    href: "/admin/chat-sessions",
                    icon: MessageSquareText,
                    active: url.startsWith("/admin/chat-sessions"),
                    badge: admin_badges?.unread_leads ? `${admin_badges.unread_leads}` : null,
                    badgeColor: "bg-amber-400 text-black",
                },
            ],
        },
        {
            title: "SEO & TRAFFIC ENGINE",
            items: [
                {
                    name: "Tracking & Pixels",
                    href: "/admin/tracking-scripts",
                    icon: Code2,
                    active: url.startsWith("/admin/tracking-scripts"),
                },
                {
                    name: "Redirects & 404s",
                    href: "/admin/redirects",
                    icon: ArrowLeftRight,
                    active: url.startsWith("/admin/redirects"),
                },
            ],
        },
        ...(isSuperAdmin
            ? [
                {
                    title: "SYSTEM & ACCESS",
                    items: [
                        {
                            name: "User Management",
                            href: "/admin/users",
                            icon: Shield,
                            active: url.startsWith("/admin/users"),
                        },
                        {
                            name: "Settings",
                            href: "/admin/settings",
                            icon: Settings,
                            active: url.startsWith("/admin/settings"),
                        },
                    ],
                },
            ]
            : []),
    ];

    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen={true}>
                <div className="admin-shell min-h-screen w-full bg-[#f4f7fb] text-ink flex antialiased">
                    {/* Official shadcn Sidebar — Light Editorial Theme */}
                    <Sidebar className="border-r border-slate-200/90 bg-white text-ink">
                        <SidebarHeader className="border-b border-slate-200/80 p-4">
                            <Link
                                href="/admin"
                                className="flex items-center gap-2.5 group cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary text-white font-black flex items-center justify-center font-mono text-sm tracking-tighter shadow-xs">
                                    CE
                                </div>
                                <div className="group-data-[collapsible=icon]:hidden">
                                    <span className="font-bold text-sm tracking-tight text-ink block">
                                        CUTTING EDGER
                                    </span>
                                    <span className="text-[10px] font-mono tracking-widest text-primary uppercase block">
                                        OPS PORTAL
                                    </span>
                                </div>
                            </Link>
                        </SidebarHeader>

                        <SidebarContent
                            ref={sidebarContentRef}
                            onScroll={handleSidebarScroll}
                            className="px-2 py-4 space-y-4 bg-white"
                        >
                            {navSections.map((section, idx) => (
                                <SidebarGroup key={idx}>
                                    <SidebarGroupLabel className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold px-2">
                                        {section.title}
                                    </SidebarGroupLabel>
                                    <SidebarMenu>
                                        {section.items.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <SidebarMenuItem key={item.href}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={item.active}
                                                        tooltip={item.name}
                                                        className={cn(
                                                            "rounded-xl text-xs transition-colors py-2 px-3",
                                                            item.active
                                                                ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                                                                : "text-slate-600 hover:text-ink hover:bg-slate-100/80"
                                                        )}
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            preserveScroll
                                                            className="flex items-center gap-2.5 w-full"
                                                        >
                                                            <Icon
                                                                className={cn(
                                                                    "w-4 h-4",
                                                                    item.active
                                                                        ? "text-primary"
                                                                        : "text-slate-400 group-hover:text-ink"
                                                                )}
                                                            />
                                                            <span className="truncate flex-1">
                                                                {item.name}
                                                            </span>
                                                            {"badge" in item && item.badge && (
                                                                <span
                                                                    className={cn(
                                                                        "shrink-0 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold tracking-tight shadow-xs bg-primary text-white"
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
                            ))}
                        </SidebarContent>

                        <SidebarFooter className="border-t border-slate-200/80 p-4 bg-[#f8fafc] space-y-3">
                            <div className="flex items-center justify-between gap-2 min-w-0 group-data-[collapsible=icon]:hidden">
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-xs font-semibold text-ink truncate">
                                        {user?.name || "Architect"}
                                    </span>
                                    <span className="text-[11px] text-slate-500 truncate">
                                        {user?.email}
                                    </span>
                                </div>
                                <div className="shrink-0">
                                    {getRoleBadge(user?.role)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70 group-data-[collapsible=icon]:hidden">
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-ink border border-slate-200 transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Live Site</span>
                                </Link>
                                <Link
                                    href="/admin/logout"
                                    method="post"
                                    as="button"
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Sign Out</span>
                                </Link>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    {/* Main Inset Content Area */}
                    <SidebarInset className="bg-[#f4f7fb] text-ink flex-1 flex flex-col min-w-0">
                        {/* Header with shadcn SidebarTrigger */}
                        <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="text-slate-500 hover:text-ink hover:bg-slate-100" />
                                <div className="h-4 w-px bg-slate-200" />
                                <Terminal className="w-4 h-4 text-primary" />
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                                    OPS // {title || "SYSTEM ACTIVE"}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <AdminNotificationDropdown />
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Connected</span>
                                </span>
                            </div>
                        </header>

                        {/* Shadcn Sonner Toaster */}
                        <Toaster />

                        {/* Main Page Children */}
                        <div className="p-8 flex-1">{children}</div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}
