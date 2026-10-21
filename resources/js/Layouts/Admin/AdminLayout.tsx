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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { Toaster, toast } from "@/Components/ui/sonner";
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
    const { auth, flash } = usePage<{
        auth: { user: { name: string; email: string; role: string } | null };
        flash: { success?: string; error?: string };
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
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-[#d4ff00]/30 bg-[#d4ff00]/10 text-[#d4ff00] whitespace-nowrap shadow-xs">
                    SUPER ADMIN
                </span>
            );
        }
        if (roleName === "admin") {
            return (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 whitespace-nowrap">
                    ADMIN
                </span>
            );
        }
        return (
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-white/10 bg-white/5 text-neutral-400 whitespace-nowrap">
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
                    name: "Projects",
                    href: "/admin/projects",
                    icon: FolderKanban,
                    active: url.startsWith("/admin/projects"),
                },
                {
                    name: "Services",
                    href: "/admin/services",
                    icon: Layers,
                    active: url.startsWith("/admin/services"),
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
                },
                {
                    name: "Subscribers",
                    href: "/admin/subscribers",
                    icon: Send,
                    active: url.startsWith("/admin/subscribers"),
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
                <div className="dark admin-shell min-h-screen w-full bg-[#08090c] text-white flex antialiased">
                    {/* Official shadcn Sidebar */}
                    <Sidebar className="border-r border-white/10 bg-[#0c0e14] text-white">
                        <SidebarHeader className="border-b border-white/10 p-4">
                            <Link
                                href="/admin"
                                className="flex items-center gap-2.5 group cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-[#d4ff00] text-black font-black flex items-center justify-center font-mono text-sm tracking-tighter">
                                    CE
                                </div>
                                <div className="group-data-[collapsible=icon]:hidden">
                                    <span className="font-bold text-sm tracking-tight text-white block">
                                        CUTTING EDGER
                                    </span>
                                    <span className="text-[10px] font-mono tracking-widest text-[#d4ff00] uppercase block">
                                        OPS PORTAL
                                    </span>
                                </div>
                            </Link>
                        </SidebarHeader>

                        <SidebarContent className="px-2 py-4 space-y-4">
                            {navSections.map((section, idx) => (
                                <SidebarGroup key={idx}>
                                    <SidebarGroupLabel className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-semibold px-2">
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
                                                                ? "bg-[#181b24] text-[#d4ff00] font-semibold border border-white/10"
                                                                : "text-neutral-400 hover:text-white hover:bg-white/5"
                                                        )}
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            className="flex items-center gap-2.5 w-full"
                                                        >
                                                            <Icon
                                                                className={cn(
                                                                    "w-4 h-4",
                                                                    item.active
                                                                        ? "text-[#d4ff00]"
                                                                        : "text-neutral-500 group-hover:text-white"
                                                                )}
                                                            />
                                                            <span className="truncate">
                                                                {item.name}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroup>
                            ))}
                        </SidebarContent>

                        <SidebarFooter className="border-t border-white/10 p-4 bg-[#0a0b0f] space-y-3">
                            <div className="flex items-center justify-between gap-2 min-w-0 group-data-[collapsible=icon]:hidden">
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-xs font-semibold text-white truncate">
                                        {user?.name || "Architect"}
                                    </span>
                                    <span className="text-[11px] text-neutral-400 truncate">
                                        {user?.email}
                                    </span>
                                </div>
                                <div className="shrink-0">
                                    {getRoleBadge(user?.role)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-white/5 group-data-[collapsible=icon]:hidden">
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Live Site</span>
                                </Link>
                                <Link
                                    href="/admin/logout"
                                    method="post"
                                    as="button"
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Sign Out</span>
                                </Link>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    {/* Main Inset Content Area */}
                    <SidebarInset className="bg-[#08090c] text-white flex-1 flex flex-col min-w-0">
                        {/* Header with shadcn SidebarTrigger */}
                        <header className="h-16 border-b border-white/10 bg-[#0c0e14]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="text-neutral-400 hover:text-white hover:bg-white/10" />
                                <div className="h-4 w-px bg-white/10" />
                                <Terminal className="w-4 h-4 text-[#d4ff00]" />
                                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                                    OPS // {title || "SYSTEM ACTIVE"}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
