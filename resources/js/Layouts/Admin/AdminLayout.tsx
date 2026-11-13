import React, { useState } from "react";
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
    ChevronDown,
    CalendarCheck2,
    MessageSquareText,
    Sparkles,
    ShoppingBag,
    Code2,
    ArrowLeftRight,
    Globe,
    Shirt,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

interface NavChildItem {
    name: string;
    href: string;
    icon: React.ElementType;
    active: boolean;
}

interface NavItem {
    name: string;
    href?: string;
    icon: React.ElementType;
    active: boolean;
    badge?: string | null;
    children?: NavChildItem[];
}

interface NavSection {
    title: string;
    items: NavItem[];
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    const { url } = usePage();
    const sidebarContentRef = React.useRef<HTMLDivElement>(null);

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

    const isBlogGroupActive =
        url.startsWith("/admin/blogs") || url.startsWith("/admin/blog-categories");
    const isSiteSectionsActive =
        url.startsWith("/admin/pricing") ||
        url.startsWith("/admin/faqs") ||
        url.startsWith("/admin/clients") ||
        url.startsWith("/admin/testimonials") ||
        url.startsWith("/admin/team") ||
        url.startsWith("/admin/careers");
    const isSeoGroupActive =
        url.startsWith("/admin/redirects") || url.startsWith("/admin/tracking-scripts");

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        Blog: isBlogGroupActive,
        "Page Sections": isSiteSectionsActive,
        "SEO & Redirects": isSeoGroupActive,
    });

    const toggleMenu = (menuName: string) => {
        setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    const navSections: NavSection[] = [
        {
            title: "Main",
            items: [
                {
                    name: "Dashboard",
                    href: "/admin",
                    icon: LayoutDashboard,
                    active: url === "/admin",
                },
                {
                    name: "Orders & Quotes",
                    href: "/admin/orders",
                    icon: ShoppingBag,
                    active: url.startsWith("/admin/orders"),
                    badge: admin_badges?.pending_orders
                        ? `${admin_badges.pending_orders}`
                        : null,
                },
            ],
        },
        {
            title: "AI Studio",
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
                    icon: Shirt,
                    active: url.startsWith("/admin/try-on-looks"),
                },
            ],
        },
        {
            title: "Customer Inbox",
            items: [
                {
                    name: "Messages",
                    href: "/admin/messages",
                    icon: Mail,
                    active: url.startsWith("/admin/messages"),
                    badge: admin_badges?.new_messages ? `${admin_badges.new_messages}` : null,
                },
                {
                    name: "Booked Calls",
                    href: "/admin/consultations",
                    icon: CalendarCheck2,
                    active: url.startsWith("/admin/consultations"),
                    badge: admin_badges?.pending_consultations
                        ? `${admin_badges.pending_consultations}`
                        : null,
                },
                {
                    name: "Live Chat",
                    href: "/admin/chat-sessions",
                    icon: MessageSquareText,
                    active: url.startsWith("/admin/chat-sessions"),
                    badge: admin_badges?.unread_leads ? `${admin_badges.unread_leads}` : null,
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
            title: "Website Content",
            items: [
                {
                    name: "Case Studies",
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
                    name: "Blog",
                    icon: Newspaper,
                    active: isBlogGroupActive,
                    children: [
                        {
                            name: "All Posts",
                            href: "/admin/blogs",
                            icon: Newspaper,
                            active: url.startsWith("/admin/blogs"),
                        },
                        {
                            name: "Categories",
                            href: "/admin/blog-categories",
                            icon: Tag,
                            active: url.startsWith("/admin/blog-categories"),
                        },
                    ],
                },
                {
                    name: "Page Sections",
                    icon: Globe,
                    active: isSiteSectionsActive,
                    children: [
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
                            name: "Client Logos",
                            href: "/admin/clients",
                            icon: Building2,
                            active: url.startsWith("/admin/clients"),
                        },
                        {
                            name: "Reviews",
                            href: "/admin/testimonials",
                            icon: MessageSquareQuote,
                            active: url.startsWith("/admin/testimonials"),
                        },
                        {
                            name: "Team Members",
                            href: "/admin/team",
                            icon: Users,
                            active: url.startsWith("/admin/team"),
                        },
                        {
                            name: "Careers",
                            href: "/admin/careers",
                            icon: Briefcase,
                            active: url.startsWith("/admin/careers"),
                        },
                    ],
                },
            ],
        },
        {
            title: "Settings",
            items: [
                ...(isSuperAdmin
                    ? [
                          {
                              name: "General Settings",
                              href: "/admin/settings",
                              icon: Settings,
                              active: url.startsWith("/admin/settings"),
                          },
                      ]
                    : []),
                {
                    name: "SEO & Redirects",
                    icon: ArrowLeftRight,
                    active: isSeoGroupActive,
                    children: [
                        {
                            name: "Redirects & 404s",
                            href: "/admin/redirects",
                            icon: ArrowLeftRight,
                            active: url.startsWith("/admin/redirects"),
                        },
                        {
                            name: "Tracking Pixels",
                            href: "/admin/tracking-scripts",
                            icon: Code2,
                            active: url.startsWith("/admin/tracking-scripts"),
                        },
                    ],
                },
                ...(isSuperAdmin
                    ? [
                          {
                              name: "Admin Users",
                              href: "/admin/users",
                              icon: Shield,
                              active: url.startsWith("/admin/users"),
                          },
                      ]
                    : []),
            ],
        },
    ];

    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen={true}>
                <div className="admin-shell min-h-screen w-full bg-[#f5f7fb] text-ink flex antialiased">
                    {/* Clean Light Editorial Sidebar */}
                    <Sidebar className="border-r border-slate-200/90 bg-white text-ink">
                        <SidebarHeader className="border-b border-slate-100 px-5 py-4">
                            <Link
                                href="/admin"
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
                                        <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                                            Admin Workspace
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </SidebarHeader>

                        <SidebarContent
                            ref={sidebarContentRef}
                            onScroll={handleSidebarScroll}
                            className="px-3 py-4 space-y-5 bg-white"
                        >
                            {navSections.map((section, idx) => (
                                <SidebarGroup key={idx} className="p-0">
                                    <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2.5 mb-1">
                                        {section.title}
                                    </SidebarGroupLabel>
                                    <SidebarMenu className="space-y-0.5">
                                        {section.items.map((item) => {
                                            const Icon = item.icon;

                                            // Collapsible Parent Menu Item
                                            if (item.children && item.children.length > 0) {
                                                const isOpen = !!openMenus[item.name];
                                                return (
                                                    <SidebarMenuItem key={item.name}>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleMenu(item.name)}
                                                            className={cn(
                                                                "w-full flex items-center gap-2.5 rounded-xl text-[13px] font-medium transition-colors py-2 px-2.5 cursor-pointer",
                                                                item.active
                                                                    ? "text-primary font-semibold bg-primary/5"
                                                                    : "text-slate-600 hover:text-ink hover:bg-slate-100/80"
                                                            )}
                                                        >
                                                            <Icon
                                                                className={cn(
                                                                    "w-4 h-4 shrink-0",
                                                                    item.active
                                                                        ? "text-primary"
                                                                        : "text-slate-400"
                                                                )}
                                                            />
                                                            <span className="truncate flex-1 text-left">
                                                                {item.name}
                                                            </span>
                                                            <ChevronDown
                                                                className={cn(
                                                                    "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
                                                                    isOpen ? "rotate-180" : ""
                                                                )}
                                                            />
                                                        </button>

                                                        {isOpen && (
                                                            <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-0.5">
                                                                {item.children.map((sub) => {
                                                                    const SubIcon = sub.icon;
                                                                    return (
                                                                        <Link
                                                                            key={sub.href}
                                                                            href={sub.href}
                                                                            preserveScroll
                                                                            className={cn(
                                                                                "flex items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs transition-colors",
                                                                                sub.active
                                                                                    ? "bg-primary text-white font-semibold shadow-xs"
                                                                                    : "text-slate-600 hover:text-ink hover:bg-slate-100/80"
                                                                            )}
                                                                        >
                                                                            <SubIcon
                                                                                className={cn(
                                                                                    "w-3.5 h-3.5 shrink-0",
                                                                                    sub.active
                                                                                        ? "text-white"
                                                                                        : "text-slate-400"
                                                                                )}
                                                                            />
                                                                            <span className="truncate">
                                                                                {sub.name}
                                                                            </span>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </SidebarMenuItem>
                                                );
                                            }

                                            // Standard Direct Link Item
                                            return (
                                                <SidebarMenuItem key={item.href}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={item.active}
                                                        tooltip={item.name}
                                                        className={cn(
                                                            "rounded-xl text-[13px] transition-all py-2 px-2.5",
                                                            item.active
                                                                ? "bg-primary text-white font-semibold shadow-xs hover:bg-primary-hover hover:text-white"
                                                                : "text-slate-600 font-medium hover:text-ink hover:bg-slate-100/80"
                                                        )}
                                                    >
                                                        <Link
                                                            href={item.href!}
                                                            preserveScroll
                                                            className="flex items-center gap-2.5 w-full"
                                                        >
                                                            <Icon
                                                                className={cn(
                                                                    "w-4 h-4 shrink-0",
                                                                    item.active
                                                                        ? "text-white"
                                                                        : "text-slate-400"
                                                                )}
                                                            />
                                                            <span className="truncate flex-1">
                                                                {item.name}
                                                            </span>
                                                            {item.badge && (
                                                                <span
                                                                    className={cn(
                                                                        "shrink-0 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-[11px] font-bold tracking-tight",
                                                                        item.active
                                                                            ? "bg-white text-primary"
                                                                            : "bg-primary/15 text-primary"
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

                        <SidebarFooter className="border-t border-slate-100 p-3.5 bg-[#f8fafc]">
                            <div className="flex items-center justify-between gap-2 min-w-0 group-data-[collapsible=icon]:hidden">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                        {(user?.name || "A").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs font-bold text-ink truncate">
                                            {user?.name || "Admin"}
                                        </span>
                                        <span className="text-[11px] text-slate-500 truncate">
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/admin/logout"
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
                        {/* Clean Top Bar */}
                        <header className="h-15 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="text-slate-500 hover:text-ink hover:bg-slate-100" />
                                <div className="h-4 w-px bg-slate-200" />
                                <span className="text-sm font-bold text-ink">
                                    {title || "Dashboard"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-ink transition-colors"
                                >
                                    <span>View Website</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <AdminNotificationDropdown />
                            </div>
                        </header>

                        <Toaster />

                        {/* Main Page Content */}
                        <div className="p-6 sm:p-8 flex-1 max-w-[1600px] w-full mx-auto">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}
