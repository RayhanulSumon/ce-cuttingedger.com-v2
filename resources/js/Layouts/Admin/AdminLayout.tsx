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
    MessageSquareText,
    Sparkles,
    ShoppingBag,
    Code2,
    ArrowLeftRight,
    Globe,
    Shirt,
    Coins,
    Inbox,
    ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster, toast } from "@/Components/ui/sonner";
import { AdminNotificationDropdown } from "@/Components/Admin/AdminNotificationDropdown";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
    badge?: string | null;
}

interface NavItem {
    name: string;
    href?: string;
    icon: React.ElementType;
    active: boolean;
    badge?: string | null;
    children?: NavChildItem[];
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
            pending_credit_purchases?: number;
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

    const isInboxActive =
        url.startsWith("/admin/messages") ||
        url.startsWith("/admin/chat-sessions") ||
        url.startsWith("/admin/subscribers");

    const isWebsiteActive =
        url.startsWith("/admin/capabilities") ||
        url.startsWith("/admin/pricing") ||
        url.startsWith("/admin/projects") ||
        url.startsWith("/admin/blogs") ||
        url.startsWith("/admin/blog-categories") ||
        url.startsWith("/admin/faqs") ||
        url.startsWith("/admin/clients") ||
        url.startsWith("/admin/testimonials") ||
        url.startsWith("/admin/team") ||
        url.startsWith("/admin/careers");

    const isSettingsActive =
        url.startsWith("/admin/settings") ||
        url.startsWith("/admin/redirects") ||
        url.startsWith("/admin/tracking-scripts") ||
        url.startsWith("/admin/users") ||
        url.startsWith("/admin/system-logs");

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        Inbox: isInboxActive,
        Website: isWebsiteActive,
        Settings: isSettingsActive,
    });

    React.useEffect(() => {
        setOpenMenus((prev) => ({
            Inbox: isInboxActive ? true : prev.Inbox,
            Website: isWebsiteActive ? true : prev.Website,
            Settings: isSettingsActive ? true : prev.Settings,
        }));
    }, [isInboxActive, isWebsiteActive, isSettingsActive]);

    const toggleMenu = (menuName: string) => {
        setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    const inboxTotal =
        (admin_badges?.new_messages ?? 0) +
        (admin_badges?.unread_leads ?? 0);

    const coreNavItems: NavItem[] = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
            active: url === "/admin",
        },
        {
            name: "Orders",
            href: "/admin/orders",
            icon: ShoppingBag,
            active: url.startsWith("/admin/orders"),
            badge: admin_badges?.pending_orders ? `${admin_badges.pending_orders}` : null,
        },
        {
            name: "Credit Purchases",
            href: "/admin/credit-purchases",
            icon: Coins,
            active: url.startsWith("/admin/credit-purchases"),
            badge: admin_badges?.pending_credit_purchases
                ? `${admin_badges.pending_credit_purchases}`
                : null,
        },
        {
            name: "AI Usage & Profit",
            href: "/admin/ai-usage",
            icon: Sparkles,
            active: url.startsWith("/admin/ai-usage"),
        },
        {
            name: "Clients",
            href: "/admin/client-accounts",
            icon: Users,
            active: url.startsWith("/admin/client-accounts"),
        },
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
    ];

    const folderItems: NavItem[] = [
        {
            name: "Inbox",
            icon: Inbox,
            active: isInboxActive,
            badge: inboxTotal > 0 ? `${inboxTotal}` : null,
            children: [
                {
                    name: "Messages",
                    href: "/admin/messages",
                    icon: Mail,
                    active: url.startsWith("/admin/messages"),
                    badge: admin_badges?.new_messages ? `${admin_badges.new_messages}` : null,
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
            name: "Website",
            icon: Globe,
            active: isWebsiteActive,
            children: [
                {
                    name: "Capabilities",
                    href: "/admin/capabilities",
                    icon: Layers,
                    active: url.startsWith("/admin/capabilities"),
                },
                {
                    name: "Pricing Plans",
                    href: "/admin/pricing",
                    icon: CreditCard,
                    active: url.startsWith("/admin/pricing"),
                },
                {
                    name: "Case Studies",
                    href: "/admin/projects",
                    icon: FolderKanban,
                    active: url.startsWith("/admin/projects"),
                },
                {
                    name: "Blog Posts",
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
                    name: "Team",
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
        {
            name: "Settings",
            icon: Settings,
            active: isSettingsActive,
            children: [
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
                ...(isSuperAdmin
                    ? [
                          {
                              name: "Admin Users",
                              href: "/admin/users",
                              icon: Shield,
                              active: url.startsWith("/admin/users"),
                          },
                          {
                              name: "System Logs",
                              href: "/admin/system-logs",
                              icon: ScrollText,
                              active: url.startsWith("/admin/system-logs"),
                          },
                      ]
                    : []),
            ],
        },
    ];

    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen w-full bg-page text-ink flex antialiased">
                    {/* Clean Light Editorial Sidebar */}
                    <Sidebar className="border-r border-line bg-surface text-ink">
                        <SidebarHeader className="border-b border-line bg-surface px-5 py-4">
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
                                        <span className="text-2xs font-medium text-subtle block mt-0.5">
                                            Admin Workspace
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </SidebarHeader>

                        <SidebarContent
                            ref={sidebarContentRef}
                            onScroll={handleSidebarScroll}
                            className="px-3 py-3 space-y-1 bg-surface"
                        >
                            {/* Core Direct Links */}
                            <SidebarMenu className="space-y-0.5">
                                {coreNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={item.active}
                                                tooltip={item.name}
                                                className={cn(
                                                    "rounded-xl text-sm transition-all py-2 px-2.5",
                                                    item.active
                                                        ? "bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary-hover hover:text-primary-foreground"
                                                        : "text-muted font-medium hover:text-ink hover:bg-surface-2"
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
                                                            item.active ? "text-primary-foreground" : "text-faint"
                                                        )}
                                                    />
                                                    <span className="truncate flex-1">{item.name}</span>
                                                    {item.badge && (
                                                        <span
                                                            className={cn(
                                                                "shrink-0 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-2xs font-bold tracking-tight",
                                                                item.active
                                                                    ? "bg-surface text-primary-ink"
                                                                    : "bg-primary-soft text-primary-ink"
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

                            <div className="my-2 border-t border-line" />

                            {/* 3 Clean Collapsible Folders */}
                            <SidebarMenu className="space-y-0.5">
                                {folderItems.map((folder) => {
                                    const Icon = folder.icon;
                                    const isOpen = !!openMenus[folder.name];
                                    return (
                                        <SidebarMenuItem key={folder.name}>
                                            <button
                                                type="button"
                                                onClick={() => toggleMenu(folder.name)}
                                                className={cn(
                                                    "w-full flex items-center gap-2.5 rounded-xl text-sm font-medium transition-colors py-2 px-2.5 cursor-pointer",
                                                    folder.active
                                                        ? "text-primary-ink font-semibold bg-primary-soft"
                                                        : "text-muted hover:text-ink hover:bg-surface-2"
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "w-4 h-4 shrink-0",
                                                        folder.active ? "text-primary" : "text-faint"
                                                    )}
                                                />
                                                <span className="truncate flex-1 text-left">
                                                    {folder.name}
                                                </span>
                                                {folder.badge && (
                                                    <span className="shrink-0 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-2xs font-bold bg-primary-soft text-primary-ink">
                                                        {folder.badge}
                                                    </span>
                                                )}
                                                <ChevronDown
                                                    className={cn(
                                                        "w-3.5 h-3.5 text-faint transition-transform duration-200",
                                                        isOpen ? "rotate-180" : ""
                                                    )}
                                                />
                                            </button>

                                            {isOpen && folder.children && (
                                                <div className="mt-1 ml-4 pl-3 border-l border-line space-y-0.5">
                                                    {folder.children.map((sub) => {
                                                        const SubIcon = sub.icon;
                                                        return (
                                                            <Link
                                                                key={sub.href}
                                                                href={sub.href}
                                                                preserveScroll
                                                                className={cn(
                                                                    "flex items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs transition-colors",
                                                                    sub.active
                                                                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                                                        : "text-muted hover:text-ink hover:bg-surface-2"
                                                                )}
                                                            >
                                                                <SubIcon
                                                                    className={cn(
                                                                        "w-3.5 h-3.5 shrink-0",
                                                                        sub.active
                                                                            ? "text-primary-foreground"
                                                                            : "text-faint"
                                                                    )}
                                                                />
                                                                <span className="truncate flex-1">
                                                                    {sub.name}
                                                                </span>
                                                                {sub.badge && (
                                                                    <span
                                                                        className={cn(
                                                                            "shrink-0 min-w-4 h-4 px-1.5 flex items-center justify-center rounded-full text-2xs font-bold",
                                                                            sub.active
                                                                                ? "bg-surface text-primary-ink"
                                                                                : "bg-primary-soft text-primary-ink"
                                                                        )}
                                                                    >
                                                                        {sub.badge}
                                                                    </span>
                                                                )}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarContent>

                        <SidebarFooter className="border-t border-line p-3.5 bg-surface-2">
                            <div className="flex items-center justify-between gap-2 min-w-0 group-data-[collapsible=icon]:hidden">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="w-8 h-8 rounded-full bg-primary-soft text-primary-ink font-bold text-xs flex items-center justify-center shrink-0">
                                        {(user?.name || "A").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs font-bold text-ink truncate">
                                            {user?.name || "Admin"}
                                        </span>
                                        <span className="text-2xs text-subtle truncate">
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/admin/logout"
                                    method="post"
                                    as="button"
                                    title="Sign Out"
                                    className="p-2 rounded-lg text-faint hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer shrink-0"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Link>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    {/* Main Inset Content Area */}
                    <SidebarInset className="bg-page text-ink flex-1 flex flex-col min-w-0">
                        {/* Clean Top Bar */}
                        <header className="h-15 border-b border-line bg-surface/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-2 sticky top-0 z-20">
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                <SidebarTrigger className="text-subtle hover:text-ink hover:bg-surface-2 shrink-0" />
                                <div className="h-4 w-px bg-line shrink-0" />
                                <span className="text-sm font-bold text-ink truncate">
                                    {title || "Dashboard"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="View Website"
                                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-surface-2 hover:bg-surface-3 text-ink-2 hover:text-ink transition-colors"
                                >
                                    <span className="hidden sm:inline">View Website</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <AdminNotificationDropdown />
                            </div>
                        </header>

                        <Toaster />

                        {/* Main Page Content */}
                        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1600px] w-full mx-auto">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}
