import { n as Toaster, r as toast } from "../ssr.js";
import { t as cn$1 } from "./utils-BVTyW6jK.js";
import { n as Button } from "./input-lL3MBuxn.js";
import * as React$1 from "react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { ArrowLeftRight, Bell, Briefcase, Building2, CalendarCheck2, Check, CheckCheck, CheckCircle2, ChevronRight, Code2, CreditCard, ExternalLink, FolderKanban, HelpCircle, Layers, LayoutDashboard, LogOut, Mail, MessageSquareQuote, MessageSquareText, Newspaper, PanelLeftIcon, Plus, Send, Settings, Shield, ShoppingBag, Sparkles, Tag, Terminal, Trash2, Users, X, XIcon } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import { Dialog, Slot, Tooltip } from "radix-ui";
//#region resources/js/Components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React$1.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn$1("flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-white/10 data-[state=open]:bg-white/10 text-neutral-200", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn$1("z-50 min-w-[8rem] overflow-hidden rounded-xl border border-white/10 bg-[#12141c] p-1 text-white shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React$1.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn$1("z-50 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-[#12141c] p-1 text-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React$1.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn$1("relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors focus:bg-white/10 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-neutral-300 hover:text-white", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React$1.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn$1("relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-white/10 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-accent" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuLabel = React$1.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn$1("px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn$1("-mx-1 my-1 h-px bg-white/10", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
//#endregion
//#region resources/js/Components/Admin/AdminNotificationDropdown.tsx
function AdminNotificationDropdown() {
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fetchNotifications = useCallback(async () => {
		try {
			const res = await fetch("/admin/notifications", { headers: {
				Accept: "application/json",
				"X-Requested-With": "XMLHttpRequest"
			} });
			if (res.ok) {
				const data = await res.json();
				setNotifications(data.notifications || []);
				setUnreadCount(data.unread_count || 0);
			}
		} catch (err) {}
	}, []);
	useEffect(() => {
		fetchNotifications();
		const interval = setInterval(fetchNotifications, 25e3);
		return () => clearInterval(interval);
	}, [fetchNotifications]);
	useEffect(() => {
		if (isOpen) fetchNotifications();
	}, [isOpen, fetchNotifications]);
	const markAsRead = async (id, url) => {
		try {
			await fetch(`/admin/notifications/${id}/read`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.content || ""
				}
			});
			setNotifications((prev) => prev.map((n) => n.id === id ? {
				...n,
				is_read: true
			} : n));
			setUnreadCount((c) => Math.max(0, c - 1));
			if (url) {
				setIsOpen(false);
				router.visit(url);
			}
		} catch (err) {}
	};
	const markAllRead = async () => {
		try {
			await fetch("/admin/notifications/mark-all-read", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.content || ""
				}
			});
			setNotifications((prev) => prev.map((n) => ({
				...n,
				is_read: true
			})));
			setUnreadCount(0);
		} catch (err) {}
	};
	const deleteNotification = async (e, id) => {
		e.stopPropagation();
		try {
			await fetch(`/admin/notifications/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.content || ""
				}
			});
			setNotifications((prev) => {
				const target = prev.find((n) => n.id === id);
				if (target && !target.is_read) setUnreadCount((c) => Math.max(0, c - 1));
				return prev.filter((n) => n.id !== id);
			});
		} catch (err) {}
	};
	const clearAll = async () => {
		try {
			await fetch("/admin/notifications/clear-all", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.content || ""
				}
			});
			setNotifications([]);
			setUnreadCount(0);
		} catch (err) {}
	};
	const getNotificationIcon = (type) => {
		if (type.includes("consultation")) return /* @__PURE__ */ jsx("div", {
			className: "w-8 h-8 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] flex items-center justify-center shrink-0",
			children: /* @__PURE__ */ jsx(CalendarCheck2, { className: "w-4 h-4" })
		});
		if (type.includes("lead")) return /* @__PURE__ */ jsx("div", {
			className: "w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 text-accent flex items-center justify-center shrink-0",
			children: /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" })
		});
		if (type.includes("chat")) return /* @__PURE__ */ jsx("div", {
			className: "w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0",
			children: /* @__PURE__ */ jsx(MessageSquareText, { className: "w-4 h-4" })
		});
		return /* @__PURE__ */ jsx("div", {
			className: "w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-neutral-300 flex items-center justify-center shrink-0",
			children: /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" })
		});
	};
	return /* @__PURE__ */ jsxs(DropdownMenu, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer focus:outline-hidden",
				title: "Real-time Admin Notifications",
				children: [/* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }), unreadCount > 0 && /* @__PURE__ */ jsx("span", {
					className: "absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-accent text-black font-mono font-bold text-[10px] shadow-sm animate-pulse",
					children: unreadCount > 9 ? "9+" : unreadCount
				})]
			})
		}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
			align: "end",
			sideOffset: 8,
			className: "w-84 sm:w-96 bg-[#0c0e14] border border-white/10 rounded-2xl shadow-2xl p-0 overflow-hidden text-white z-50 flex flex-col",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "p-3.5 px-4 border-b border-white/10 bg-[#12141c] flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-bold text-sm text-white",
							children: "Notifications"
						}), unreadCount > 0 ? /* @__PURE__ */ jsxs("span", {
							className: "px-1.5 py-0.2 rounded-full bg-accent/15 text-accent text-[10px] font-mono font-bold border border-accent/30",
							children: [unreadCount, " new"]
						}) : /* @__PURE__ */ jsx("span", {
							className: "text-xs text-neutral-500 font-mono",
							children: "All read"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1",
						children: [unreadCount > 0 && /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							onClick: markAllRead,
							className: "h-7 px-2 text-[11px] font-mono text-neutral-400 hover:text-white hover:bg-white/5 gap-1",
							title: "Mark all as read",
							children: [/* @__PURE__ */ jsx(CheckCheck, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Mark read" })]
						}), notifications.length > 0 && /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: clearAll,
							className: "h-7 w-7 p-0 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10",
							title: "Clear all notifications",
							children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "max-h-[380px] overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/10",
					children: notifications.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "py-12 px-6 text-center space-y-2",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-full bg-white/5 border border-white/10 text-neutral-500 flex items-center justify-center mx-auto",
								children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-neutral-400" })
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold text-neutral-300",
								children: "All caught up!"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-neutral-500",
								children: "No unread client consultations or captured leads at this moment."
							})
						]
					}) : notifications.map((n) => /* @__PURE__ */ jsxs("div", {
						onClick: () => markAsRead(n.id, n.url),
						className: cn$1("p-3.5 px-4 flex items-start gap-3 transition-colors cursor-pointer group relative", n.is_read ? "bg-transparent hover:bg-white/5 text-neutral-400" : "bg-accent/5 hover:bg-accent/10 text-white"),
						children: [
							getNotificationIcon(n.type),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0 pr-5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 mb-0.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-semibold text-xs text-white truncate block",
											children: n.title
										}), !n.is_read && /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent shrink-0" })]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400 line-clamp-2 leading-relaxed",
										children: n.message
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 mt-1.5 text-[10px] font-mono text-neutral-500",
										children: [/* @__PURE__ */ jsx("span", { children: n.created_at_formatted }), n.url && /* @__PURE__ */ jsxs("span", {
											className: "text-[#00f5ff] flex items-center gap-0.5 group-hover:underline",
											children: [/* @__PURE__ */ jsx("span", { children: "View details" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-2.5 h-2.5" })]
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: (e) => deleteNotification(e, n.id),
								className: "absolute top-3 right-3 p-1 rounded-md text-neutral-600 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity",
								title: "Delete notification",
								children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
							})
						]
					}, n.id))
				}),
				notifications.length > 0 && /* @__PURE__ */ jsxs("div", {
					className: "p-2.5 px-4 border-t border-white/10 bg-[#10121a] flex items-center justify-between text-[11px] font-mono text-neutral-500",
					children: [/* @__PURE__ */ jsx("span", { children: "Real-time ops monitoring active" }), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							setIsOpen(false);
							router.visit("/admin/consultations");
						},
						className: "text-accent hover:underline",
						children: "View Bookings →"
					})]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/hooks/use-mobile.ts
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React$1.useState(void 0);
	React$1.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
//#endregion
//#region resources/js/Components/ui/sheet.tsx
function Sheet({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Root, {
		"data-slot": "sheet",
		...props
	});
}
function SheetPortal({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Portal, {
		"data-slot": "sheet-portal",
		...props
	});
}
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Overlay, {
		"data-slot": "sheet-overlay",
		className: cn("fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", className),
		...props
	});
}
function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }) {
	return /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(Dialog.Content, {
		"data-slot": "sheet-content",
		className: cn("fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500", side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm", side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm", side === "top" && "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top", side === "bottom" && "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ jsxs(Dialog.Close, {
			className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary",
			children: [/* @__PURE__ */ jsx(XIcon, { className: "size-4" }), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-header",
		className: cn("flex flex-col gap-1.5 p-4", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Title, {
		"data-slot": "sheet-title",
		className: cn("font-semibold text-foreground", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Description, {
		"data-slot": "sheet-description",
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
//#endregion
//#region resources/js/Components/ui/tooltip.tsx
function TooltipProvider({ delayDuration = 0, ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		...props
	});
}
function Tooltip$1({ ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Root, {
		"data-slot": "tooltip",
		...props
	});
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Trigger, {
		"data-slot": "tooltip-trigger",
		...props
	});
}
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Portal, { children: /* @__PURE__ */ jsxs(Tooltip.Content, {
		"data-slot": "tooltip-content",
		sideOffset,
		className: cn("z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(Tooltip.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" })]
	}) });
}
//#endregion
//#region resources/js/Components/ui/sidebar.tsx
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 604800;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React$1.createContext(null);
function useSidebar() {
	const context = React$1.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
function SidebarProvider({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }) {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React$1.useState(false);
	const [_open, _setOpen] = React$1.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React$1.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = React$1.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	React$1.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = React$1.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ jsx(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ jsx(TooltipProvider, {
			delayDuration: 0,
			children: /* @__PURE__ */ jsx("div", {
				"data-slot": "sidebar-wrapper",
				style: {
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					...style
				},
				className: cn("group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar", className),
				...props,
				children
			})
		})
	});
}
function Sidebar({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }) {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar",
		className: cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className),
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ jsx(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ jsxs(SheetContent, {
			"data-sidebar": "sidebar",
			"data-slot": "sidebar",
			"data-mobile": "true",
			className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ jsxs(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex h-full w-full flex-col",
				children
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "group peer hidden text-sidebar-foreground md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		"data-slot": "sidebar",
		children: [/* @__PURE__ */ jsx("div", {
			"data-slot": "sidebar-gap",
			className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)")
		}), /* @__PURE__ */ jsx("div", {
			"data-slot": "sidebar-container",
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ jsx("div", {
				"data-sidebar": "sidebar",
				"data-slot": "sidebar-inner",
				className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm",
				children
			})
		})]
	});
}
function SidebarTrigger({ className, onClick, ...props }) {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsxs(Button, {
		"data-sidebar": "trigger",
		"data-slot": "sidebar-trigger",
		variant: "ghost",
		size: "icon",
		className: cn("size-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ jsx(PanelLeftIcon, {}), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		})]
	});
}
function SidebarInset({ className, ...props }) {
	return /* @__PURE__ */ jsx("main", {
		"data-slot": "sidebar-inset",
		className: cn("relative flex w-full flex-1 flex-col bg-background", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2", className),
		...props
	});
}
function SidebarHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-header",
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
}
function SidebarFooter({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-footer",
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
}
function SidebarContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-content",
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
}
function SidebarGroup({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-group",
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
}
function SidebarGroupLabel({ className, asChild = false, ...props }) {
	const Comp = asChild ? Slot.Root : "div";
	return /* @__PURE__ */ jsx(Comp, {
		"data-slot": "sidebar-group-label",
		"data-sidebar": "group-label",
		className: cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
		...props
	});
}
function SidebarMenu({ className, ...props }) {
	return /* @__PURE__ */ jsx("ul", {
		"data-slot": "sidebar-menu",
		"data-sidebar": "menu",
		className: cn("flex w-full min-w-0 flex-col gap-1", className),
		...props
	});
}
function SidebarMenuItem({ className, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		"data-slot": "sidebar-menu-item",
		"data-sidebar": "menu-item",
		className: cn("group/menu-item relative", className),
		...props
	});
}
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function SidebarMenuButton({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }) {
	const Comp = asChild ? Slot.Root : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ jsx(Comp, {
		"data-slot": "sidebar-menu-button",
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	});
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ jsxs(Tooltip$1, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ jsx(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
}
//#endregion
//#region resources/js/Layouts/Admin/AdminLayout.tsx
function AdminLayout({ children, title }) {
	const { url } = usePage();
	const sidebarContentRef = React.useRef(null);
	React.useLayoutEffect(() => {
		const saved = sessionStorage.getItem("admin_sidebar_scroll");
		if (saved && sidebarContentRef.current) sidebarContentRef.current.scrollTop = parseInt(saved, 10);
	}, [url]);
	const handleSidebarScroll = (e) => {
		sessionStorage.setItem("admin_sidebar_scroll", String(e.currentTarget.scrollTop));
	};
	const { auth, flash, admin_badges } = usePage().props;
	React.useEffect(() => {
		if (flash?.success) toast.success(flash.success);
		if (flash?.error) toast.error(flash.error);
	}, [flash]);
	const user = auth?.user;
	const isSuperAdmin = user?.role === "super_admin";
	const getRoleBadge = (roleName) => {
		if (roleName === "super_admin") return /* @__PURE__ */ jsx("span", {
			className: "shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-accent/30 bg-accent/10 text-accent whitespace-nowrap shadow-xs",
			children: "SUPER ADMIN"
		});
		if (roleName === "admin") return /* @__PURE__ */ jsx("span", {
			className: "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 whitespace-nowrap",
			children: "ADMIN"
		});
		return /* @__PURE__ */ jsx("span", {
			className: "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-white/10 bg-white/5 text-neutral-400 whitespace-nowrap",
			children: "USER"
		});
	};
	const navSections = [
		{
			title: "OVERVIEW",
			items: [{
				name: "Command Center",
				href: "/admin",
				icon: LayoutDashboard,
				active: url === "/admin"
			}]
		},
		{
			title: "PORTFOLIO & CORE",
			items: [
				{
					name: "Projects",
					href: "/admin/projects",
					icon: FolderKanban,
					active: url.startsWith("/admin/projects")
				},
				{
					name: "Services",
					href: "/admin/services",
					icon: Layers,
					active: url.startsWith("/admin/services")
				},
				{
					name: "Blogs",
					href: "/admin/blogs",
					icon: Newspaper,
					active: url.startsWith("/admin/blogs")
				},
				{
					name: "Blog Categories",
					href: "/admin/blog-categories",
					icon: Tag,
					active: url.startsWith("/admin/blog-categories")
				}
			]
		},
		{
			title: "AGENCY & CREW",
			items: [
				{
					name: "Team Members",
					href: "/admin/team",
					icon: Users,
					active: url.startsWith("/admin/team")
				},
				{
					name: "Clients & Logos",
					href: "/admin/clients",
					icon: Building2,
					active: url.startsWith("/admin/clients")
				},
				{
					name: "Testimonials",
					href: "/admin/testimonials",
					icon: MessageSquareQuote,
					active: url.startsWith("/admin/testimonials")
				},
				{
					name: "Career Openings",
					href: "/admin/careers",
					icon: Briefcase,
					active: url.startsWith("/admin/careers")
				}
			]
		},
		{
			title: "COMMERCIAL & ENGAGEMENT",
			items: [
				{
					name: "Pricing Plans",
					href: "/admin/pricing",
					icon: CreditCard,
					active: url.startsWith("/admin/pricing")
				},
				{
					name: "FAQs",
					href: "/admin/faqs",
					icon: HelpCircle,
					active: url.startsWith("/admin/faqs")
				},
				{
					name: "Inquiries Inbox",
					href: "/admin/messages",
					icon: Mail,
					active: url.startsWith("/admin/messages"),
					badge: admin_badges?.new_messages ? `${admin_badges.new_messages}` : null,
					badgeColor: "bg-amber-400 text-black"
				},
				{
					name: "Subscribers",
					href: "/admin/subscribers",
					icon: Send,
					active: url.startsWith("/admin/subscribers")
				}
			]
		},
		{
			title: "AI ASSISTANT & LEADS",
			items: [
				{
					name: "Client Orders",
					href: "/admin/orders",
					icon: ShoppingBag,
					active: url.startsWith("/admin/orders"),
					badge: admin_badges?.pending_orders ? `${admin_badges.pending_orders}` : null,
					badgeColor: "bg-accent text-black"
				},
				{
					name: "Free Trial Orders",
					href: "/admin/free-trials",
					icon: Sparkles,
					active: url.startsWith("/admin/free-trials"),
					badge: admin_badges?.pending_trials ? `${admin_badges.pending_trials}` : null,
					badgeColor: "bg-accent text-black"
				},
				{
					name: "Calendar Bookings",
					href: "/admin/consultations",
					icon: CalendarCheck2,
					active: url.startsWith("/admin/consultations"),
					badge: admin_badges?.pending_consultations ? `${admin_badges.pending_consultations}` : null,
					badgeColor: "bg-[#00f5ff] text-black"
				},
				{
					name: "Chat Transcripts & Leads",
					href: "/admin/chat-sessions",
					icon: MessageSquareText,
					active: url.startsWith("/admin/chat-sessions"),
					badge: admin_badges?.unread_leads ? `${admin_badges.unread_leads}` : null,
					badgeColor: "bg-amber-400 text-black"
				}
			]
		},
		{
			title: "SEO & TRAFFIC ENGINE",
			items: [{
				name: "Tracking & Pixels",
				href: "/admin/tracking-scripts",
				icon: Code2,
				active: url.startsWith("/admin/tracking-scripts")
			}, {
				name: "Redirects & 404s",
				href: "/admin/redirects",
				icon: ArrowLeftRight,
				active: url.startsWith("/admin/redirects")
			}]
		},
		...isSuperAdmin ? [{
			title: "SYSTEM & ACCESS",
			items: [{
				name: "User Management",
				href: "/admin/users",
				icon: Shield,
				active: url.startsWith("/admin/users")
			}, {
				name: "Settings",
				href: "/admin/settings",
				icon: Settings,
				active: url.startsWith("/admin/settings")
			}]
		}] : []
	];
	return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(SidebarProvider, {
		defaultOpen: true,
		children: /* @__PURE__ */ jsxs("div", {
			className: "dark admin-shell min-h-screen w-full bg-[#08090c] text-white flex antialiased",
			children: [/* @__PURE__ */ jsxs(Sidebar, {
				className: "border-r border-white/10 bg-[#0c0e14] text-white",
				children: [
					/* @__PURE__ */ jsx(SidebarHeader, {
						className: "border-b border-white/10 p-4",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/admin",
							className: "flex items-center gap-2.5 group cursor-pointer",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-accent text-black font-black flex items-center justify-center font-mono text-sm tracking-tighter",
								children: "CE"
							}), /* @__PURE__ */ jsxs("div", {
								className: "group-data-[collapsible=icon]:hidden",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-bold text-sm tracking-tight text-white block",
									children: "CUTTING EDGER"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono tracking-widest text-accent uppercase block",
									children: "OPS PORTAL"
								})]
							})]
						})
					}),
					/* @__PURE__ */ jsx(SidebarContent, {
						ref: sidebarContentRef,
						onScroll: handleSidebarScroll,
						className: "px-2 py-4 space-y-4",
						children: navSections.map((section, idx) => /* @__PURE__ */ jsxs(SidebarGroup, { children: [/* @__PURE__ */ jsx(SidebarGroupLabel, {
							className: "text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-semibold px-2",
							children: section.title
						}), /* @__PURE__ */ jsx(SidebarMenu, { children: section.items.map((item) => {
							const Icon = item.icon;
							return /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {
								asChild: true,
								isActive: item.active,
								tooltip: item.name,
								className: cn$1("rounded-xl text-xs transition-colors py-2 px-3", item.active ? "bg-[#181b24] text-accent font-semibold border border-white/10" : "text-neutral-400 hover:text-white hover:bg-white/5"),
								children: /* @__PURE__ */ jsxs(Link, {
									href: item.href,
									preserveScroll: true,
									className: "flex items-center gap-2.5 w-full",
									children: [
										/* @__PURE__ */ jsx(Icon, { className: cn$1("w-4 h-4", item.active ? "text-accent" : "text-neutral-500 group-hover:text-white") }),
										/* @__PURE__ */ jsx("span", {
											className: "truncate flex-1",
											children: item.name
										}),
										"badge" in item && item.badge && /* @__PURE__ */ jsx("span", {
											className: cn$1("shrink-0 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold tracking-tight shadow-xs", "badgeColor" in item && item.badgeColor || "bg-accent text-black"),
											children: item.badge
										})
									]
								})
							}) }, item.href);
						}) })] }, idx))
					}),
					/* @__PURE__ */ jsxs(SidebarFooter, {
						className: "border-t border-white/10 p-4 bg-[#0a0b0f] space-y-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-2 min-w-0 group-data-[collapsible=icon]:hidden",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-white truncate",
									children: user?.name || "Architect"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-neutral-400 truncate",
									children: user?.email
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "shrink-0",
								children: getRoleBadge(user?.role)
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 pt-2 border-t border-white/5 group-data-[collapsible=icon]:hidden",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/",
								target: "_blank",
								className: "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors",
								children: [/* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Live Site" })]
							}), /* @__PURE__ */ jsxs(Link, {
								href: "/admin/logout",
								method: "post",
								as: "button",
								className: "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ jsx(LogOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Sign Out" })]
							})]
						})]
					})
				]
			}), /* @__PURE__ */ jsxs(SidebarInset, {
				className: "bg-[#08090c] text-white flex-1 flex flex-col min-w-0",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "h-16 border-b border-white/10 bg-[#0c0e14]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ jsx(SidebarTrigger, { className: "text-neutral-400 hover:text-white hover:bg-white/10" }),
								/* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-white/10" }),
								/* @__PURE__ */ jsx(Terminal, { className: "w-4 h-4 text-accent" }),
								/* @__PURE__ */ jsxs("span", {
									className: "text-xs font-mono uppercase tracking-widest text-neutral-400",
									children: ["OPS // ", title || "SYSTEM ACTIVE"]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx(AdminNotificationDropdown, {}), /* @__PURE__ */ jsxs("span", {
								className: "px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ jsx("span", { children: "Connected" })]
							})]
						})]
					}),
					/* @__PURE__ */ jsx(Toaster, {}),
					/* @__PURE__ */ jsx("div", {
						className: "p-8 flex-1",
						children
					})
				]
			})]
		})
	}) });
}
//#endregion
//#region resources/js/Components/Admin/UI/AdminPageHeader.tsx
function AdminPageHeader({ title, description, badge, eyebrow, actionLabel, actionHref, onActionClick, createLabel, onCreate, children }) {
	const finalActionLabel = actionLabel || createLabel;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-1",
			children: [
				eyebrow && /* @__PURE__ */ jsx("div", {
					className: "font-mono text-xs uppercase tracking-widest text-accent",
					children: eyebrow
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl sm:text-3xl font-bold text-white tracking-tight",
						children: title
					}), badge && /* @__PURE__ */ jsx("span", {
						className: "px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold",
						children: badge
					})]
				}),
				description && /* @__PURE__ */ jsx("p", {
					className: "text-sm text-neutral-400",
					children: description
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [children, finalActionLabel && (actionHref ? /* @__PURE__ */ jsx(Link, {
				href: actionHref,
				children: /* @__PURE__ */ jsxs(Button, {
					className: "gap-2 bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold",
					children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: finalActionLabel })]
				})
			}) : /* @__PURE__ */ jsxs(Button, {
				onClick: onActionClick || onCreate,
				className: "gap-2 bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold cursor-pointer",
				children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: finalActionLabel })]
			}))]
		})]
	});
}
//#endregion
export { DropdownMenuItem as a, DropdownMenuContent as i, AdminLayout as n, DropdownMenuTrigger as o, DropdownMenu as r, AdminPageHeader as t };
