import React, { useEffect, useRef, useState } from "react";
import { Link, createInertiaApp, router, useForm, usePage } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
import { AlertCircle, AlertTriangle, ArrowRight, ArrowUpRight, BookOpen, Bot, Box, Calculator, Calendar, CalendarCheck2, CalendarClock, CheckCircle2, ChevronDown, ChevronUp, Clock, Cookie, ExternalLink, FileSpreadsheet, Folder, Gem, Image, Layers, Loader2, LogIn, Mail, MapPin, Maximize2, Menu, MessageSquare, Minimize2, Moon, Package, Palette, Paperclip, Pencil, Phone, Plus, RefreshCw, RotateCcw, Scissors, Send, Shield, Shirt, Sparkles, Sun, Tag, Trash2, UploadCloud, User, UserPlus, Video, X } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import Lenis from "lenis";
//#region node_modules/laravel-vite-plugin/inertia-helpers/index.js
async function resolvePageComponent(path, pages) {
	for (const p of Array.isArray(path) ? path : [path]) {
		const page = pages[p];
		if (typeof page === "undefined") continue;
		return typeof page === "function" ? page() : page;
	}
	throw new Error(`Page not found: ${path}`);
}
//#endregion
//#region resources/js/hooks/useTheme.ts
function useTheme() {
	const [theme, setTheme] = useState("dark");
	useEffect(() => {
		try {
			const saved = localStorage.getItem("cuttingedger_theme");
			if (saved === "light" || saved === "dark") {
				setTheme(saved);
				applyTheme(saved);
			} else {
				const initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "dark";
				setTheme(initialTheme);
				applyTheme(initialTheme);
			}
		} catch {
			applyTheme("dark");
		}
	}, []);
	const applyTheme = (newTheme) => {
		const root = document.documentElement;
		if (newTheme === "dark") {
			root.classList.add("dark");
			root.classList.remove("light");
		} else {
			root.classList.remove("dark");
			root.classList.add("light");
		}
	};
	const toggleTheme = () => {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		applyTheme(next);
		try {
			localStorage.setItem("cuttingedger_theme", next);
		} catch {}
	};
	return {
		theme,
		toggleTheme,
		isDark: theme === "dark"
	};
}
//#endregion
//#region resources/js/Components/ui/ThemeToggle.tsx
function ThemeToggle({ className = "" }) {
	const { isDark, toggleTheme } = useTheme();
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: toggleTheme,
		"aria-label": isDark ? "Switch to light theme" : "Switch to dark theme",
		className: `relative inline-flex items-center justify-center p-2 rounded-full border border-white/10 dark:border-white/15 bg-white/5 dark:bg-[#12141a] hover:border-accent/60 hover:text-accent text-neutral-300 dark:text-neutral-200 transition-all duration-300 ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Toggle theme"
		}), isDark ? /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4 text-accent transition-transform duration-300 hover:rotate-90" }) : /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4 text-neutral-800 transition-transform duration-300 hover:-rotate-12" })]
	});
}
//#endregion
//#region resources/js/Layouts/Header.tsx
var resolveServiceIcon = (iconName) => {
	switch (iconName) {
		case "Scissors": return Scissors;
		case "Shirt": return Shirt;
		case "Sparkles": return Sparkles;
		case "Palette": return Palette;
		case "Shield": return Shield;
		case "Box": return Box;
		case "Gem": return Gem;
		case "BookOpen": return BookOpen;
		default: return Layers;
	}
};
function Header({ onOpenContact, onOpenDiscoveryCall, onOpenMobileMenu, settings }) {
	const { url } = usePage();
	const { services_nav = [], auth } = usePage().props;
	const [isScrolled, setIsScrolled] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(null);
	const headerRef = React.useRef(null);
	settings?.calendly_url;
	const servicesList = services_nav || [];
	useEffect(() => {
		const updateHeaderHeight = () => {
			if (headerRef.current) {
				const height = headerRef.current.getBoundingClientRect().height;
				if (height > 0) document.documentElement.style.setProperty("--header-height", `${height}px`);
			}
		};
		const handleScroll = () => {
			if (window.scrollY > 15) setIsScrolled(true);
			else setIsScrolled(false);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", updateHeaderHeight);
		handleScroll();
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", updateHeaderHeight);
		};
	}, []);
	const navItems = [
		{
			label: "Services",
			href: "/services",
			isMegaMenu: true
		},
		{
			label: "Case Studies",
			href: "/case-studies"
		},
		{
			label: "Pricing",
			href: "/pricing"
		},
		{
			label: "Company",
			href: "/about",
			children: [
				{
					label: "About Studio",
					href: "/about"
				},
				{
					label: "Creative Leadership Team",
					href: "/team"
				},
				{
					label: "Career Openings",
					href: "/careers"
				},
				{
					label: "NDA & Security Compliance",
					href: "/nda-compliance"
				},
				{
					label: "ESG & Sustainability Charter",
					href: "/esg-policy"
				},
				{
					label: "Studio FAQ",
					href: "/faq"
				}
			]
		},
		{
			label: "Careers",
			href: "/careers"
		},
		{
			label: "Blog",
			href: "/blog"
		},
		{
			label: "Contact",
			href: "/contact"
		}
	];
	const isActive = (href) => {
		if (href === "/") return url === "/";
		return url.startsWith(href);
	};
	return /* @__PURE__ */ jsx("header", {
		ref: headerRef,
		className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-3 bg-[#0c0d12]/95 backdrop-blur-xl border-b border-white/10 shadow-lg" : "py-4 lg:py-5 bg-[#090a0d]/80 backdrop-blur-md border-b border-white/5"}`,
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-4",
				children: [
					/* @__PURE__ */ jsxs(Link, {
						href: "/",
						className: "group shrink-0 flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-accent/60 group-hover:bg-accent/10 transition-all duration-300",
							children: /* @__PURE__ */ jsx("img", {
								src: "/images/ce/ce_icon_neon.png",
								alt: "Cutting Edger",
								className: "w-5 h-5 object-contain group-hover:scale-110 transition-transform duration-300"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline tracking-tight",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-display text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-accent transition-colors",
								children: "CUTTING"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-display text-lg sm:text-xl font-bold tracking-tight text-accent ml-1",
								children: "EDGER"
							})]
						})]
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "hidden lg:flex items-center gap-0.5 xl:gap-1 font-mono text-[11px] xl:text-xs shrink-0",
						children: navItems.map((item) => {
							const isCurrent = isActive(item.href);
							const hasDropdown = item.isMegaMenu || item.children && item.children.length > 0;
							return /* @__PURE__ */ jsxs("div", {
								className: "relative",
								onMouseEnter: () => hasDropdown && setOpenDropdown(item.label),
								onMouseLeave: () => hasDropdown && setOpenDropdown(null),
								children: [/* @__PURE__ */ jsxs(Link, {
									href: item.href,
									className: `px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg transition-colors flex items-center gap-1 uppercase tracking-wider whitespace-nowrap shrink-0 ${isCurrent ? "text-accent font-semibold bg-accent/10" : "text-neutral-300 hover:text-white hover:bg-white/5"}`,
									children: [/* @__PURE__ */ jsx("span", {
										className: "whitespace-nowrap",
										children: item.label
									}), hasDropdown && /* @__PURE__ */ jsx(ChevronDown, { className: `w-3 h-3 text-neutral-400 group-hover:text-white transition-transform shrink-0 ${openDropdown === item.label ? "rotate-180 text-accent" : ""}` })]
								}), hasDropdown && openDropdown === item.label && (item.isMegaMenu ? /* @__PURE__ */ jsx("div", {
									className: "absolute top-full -left-20 w-[1040px] max-w-[96vw] pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200",
									children: /* @__PURE__ */ jsxs("div", {
										className: "rounded-3xl p-6 sm:p-7 bg-[#0b0d13]/98 border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-2xl relative overflow-hidden",
										children: [
											/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" }),
											/* @__PURE__ */ jsx("div", {
												className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
												children: servicesList.map((pillar, pIdx) => {
													const IconComponent = resolveServiceIcon(pillar.icon);
													return /* @__PURE__ */ jsx("div", {
														className: "flex flex-col justify-between lg:border-r lg:border-white/10 lg:pr-5 lg:last:border-r-0 lg:last:pr-0",
														children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Link, {
															href: pillar.path,
															className: "group/pillar flex items-center justify-between gap-2.5 pb-3.5 border-b border-white/10 hover:border-accent/50 transition-colors",
															children: [/* @__PURE__ */ jsxs("div", {
																className: "flex items-center gap-2.5 min-w-0",
																children: [/* @__PURE__ */ jsx("div", {
																	className: "w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent group-hover/pillar:bg-accent group-hover/pillar:text-black group-hover/pillar:border-accent transition-all duration-300 shadow-sm shrink-0",
																	children: /* @__PURE__ */ jsx(IconComponent, { className: "w-4 h-4 transition-transform group-hover/pillar:scale-110" })
																}), /* @__PURE__ */ jsx("h3", {
																	className: "text-xs font-display font-bold text-white group-hover/pillar:text-accent transition-colors leading-snug",
																	children: pillar.title
																})]
															}), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5 text-neutral-500 group-hover/pillar:text-accent group-hover/pillar:translate-x-0.5 group-hover/pillar:-translate-y-0.5 transition-all shrink-0" })]
														}), /* @__PURE__ */ jsx("ul", {
															className: "mt-3 space-y-1.5",
															children: pillar.children.map((sub, sIdx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
																href: sub.path,
																className: "group/sub flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all text-xs",
																children: [/* @__PURE__ */ jsxs("div", {
																	className: "flex items-center gap-2 min-w-0",
																	children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover/sub:bg-accent group-hover/sub:scale-125 transition-all shrink-0" }), /* @__PURE__ */ jsx("span", {
																		className: "truncate group-hover/sub:translate-x-0.5 transition-transform text-[12px] font-medium text-neutral-300 group-hover/sub:text-white",
																		children: sub.title
																	})]
																}), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3 text-neutral-500 group-hover/sub:text-accent shrink-0 opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all ml-1.5" })]
															}) }, sIdx))
														})] })
													}, pillar.slug || pIdx);
												})
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono bg-white/[0.02] -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-3.5",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2 text-neutral-400 text-[11px]",
													children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent animate-pulse" }), /* @__PURE__ */ jsx("span", { children: "Guaranteed 24h SLA · 100% Hand-Drawn Paths · Strict NDA" })]
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-4 text-xs font-mono",
													children: [/* @__PURE__ */ jsxs(Link, {
														href: "/services",
														className: "text-neutral-400 hover:text-white flex items-center gap-1 font-semibold transition-colors",
														children: [/* @__PURE__ */ jsx("span", { children: "All Disciplines" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })]
													}), /* @__PURE__ */ jsx(Link, {
														href: "/#free-trial",
														className: "px-2.5 py-1 rounded-md bg-accent text-black font-bold uppercase text-[10px] tracking-wider hover:bg-accent-hover transition-colors",
														children: "Free 3-Asset Pilot"
													})]
												})]
											})
										]
									})
								}) : /* @__PURE__ */ jsx("div", {
									className: "absolute top-full left-0 w-60 pt-2 z-50",
									children: /* @__PURE__ */ jsx("div", {
										className: "rounded-2xl p-2 bg-[#0c0d12]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1",
										children: item.children?.map((child, idx) => /* @__PURE__ */ jsx(Link, {
											href: child.href,
											className: "block px-3 py-2 text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all",
											children: child.label
										}, idx))
									})
								}))]
							}, item.label);
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 xl:gap-3 shrink-0",
						children: [
							/* @__PURE__ */ jsx(ThemeToggle, {}),
							auth?.user ? /* @__PURE__ */ jsxs(Link, {
								href: "/admin",
								className: "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 text-xs font-mono text-neutral-200 hover:text-white transition-all shrink-0",
								title: "Go to Command Clearance Portal",
								children: [/* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", {
									className: "max-w-[90px] truncate",
									children: auth.user.name?.split(" ")[0] || "Portal"
								})]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "hidden sm:flex items-center gap-1 xl:gap-1.5 font-mono text-xs shrink-0",
								children: [/* @__PURE__ */ jsxs(Link, {
									href: "/login",
									className: "px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center gap-1.5 shrink-0",
									children: [/* @__PURE__ */ jsx(LogIn, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Sign In" })]
								}), /* @__PURE__ */ jsxs("a", {
									href: "/#free-trial",
									onClick: (e) => {
										if (window.location.pathname === "/") {
											e.preventDefault();
											const el = document.getElementById("free-trial");
											if (el) el.scrollIntoView({ behavior: "smooth" });
										}
									},
									className: "px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-full text-accent hover:text-white bg-accent/10 hover:bg-accent/20 border border-accent/25 hover:border-accent/50 transition-all flex items-center gap-1.5 shrink-0 font-medium",
									children: [/* @__PURE__ */ jsx(UserPlus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Sign Up" })]
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => {
									if (onOpenDiscoveryCall) onOpenDiscoveryCall();
									else window.dispatchEvent(new CustomEvent("ce:open-discovery-call"));
								},
								className: "hidden md:inline-flex items-center gap-1.5 xl:gap-2 px-3.5 py-2 xl:px-5 xl:py-2.5 rounded-full bg-gradient-to-b from-[#fcd34d] via-accent to-[#e09214] text-black font-bold text-xs uppercase tracking-wider shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_4px_16px_rgba(245,166,35,0.25)] hover:brightness-105 hover:shadow-[0_4px_24px_rgba(245,166,35,0.4)] transition-all duration-300 cursor-pointer select-none shrink-0 whitespace-nowrap",
								children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-black stroke-[2.5] shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Discovery Call" })]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onOpenMobileMenu,
								"aria-label": "Open mobile navigation menu",
								className: "p-2.5 rounded-full border border-white/15 bg-white/5 text-neutral-200 hover:text-accent hover:border-accent lg:hidden transition-colors",
								children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
							})
						]
					})
				]
			})
		})
	});
}
//#endregion
//#region resources/js/Layouts/Footer.tsx
function Footer({ settings, onOpenContact, compact }) {
	const { url } = usePage();
	const { services_nav = [] } = usePage().props;
	const isHomePage = url === "/" || url.split("?")[0] === "";
	const isCompact = compact !== void 0 ? compact : !isHomePage;
	const letters = Array.from("CONTACT US");
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const { data, setData, post, processing, recentlySuccessful, reset } = useForm({ email: "" });
	const handleNewsletterSubmit = (e) => {
		e.preventDefault();
		if (!data.email) return;
		post("/newsletter", {
			preserveScroll: true,
			onSuccess: () => reset()
		});
	};
	const scrollToTop = () => {
		if (typeof window !== "undefined" && window.lenis) window.lenis.scrollTo(0);
		else window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const socials = [
		{
			name: "Twitter",
			url: settings?.social_twitter || "https://twitter.com/cutting_edger"
		},
		{
			name: "Instagram",
			url: settings?.social_instagram || "https://instagram.com/cuttingedgerinc"
		},
		{
			name: "LinkedIn",
			url: settings?.social_linkedin || "https://linkedin.com/company/cutting-edger"
		},
		{
			name: "Facebook",
			url: "https://facebook.com/CuttingEdgerInc"
		},
		{
			name: "YouTube",
			url: "https://youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ"
		}
	];
	const dynamicServiceLinks = services_nav.length > 0 ? services_nav.flatMap((pillar) => [{
		label: pillar.title,
		href: pillar.path
	}, ...(pillar.children || []).slice(0, 1).map((child) => ({
		label: child.title,
		href: child.path
	}))]).slice(0, 8) : [
		{
			label: "E-Commerce Catalog Optimization",
			href: "/services/ecommerce-catalog-optimization"
		},
		{
			label: "Color Standardization",
			href: "/services/color-standardization"
		},
		{
			label: "White-Label Agency Extension",
			href: "/services/white-label-agency-extension"
		},
		{
			label: "Virtual Production & CGI Studio",
			href: "/services/virtual-production-cgi"
		}
	];
	const agencyLinks = [
		{
			label: "Case Studies",
			href: "/case-studies"
		},
		{
			label: "Verified Reviews & Proof",
			href: "/reviews"
		},
		{
			label: "Studio Philosophy & About",
			href: "/about"
		},
		{
			label: "Creative Leadership Team",
			href: "/team"
		},
		{
			label: "Career Openings",
			href: "/careers"
		},
		{
			label: "Transparent Pricing Plans",
			href: "/pricing"
		},
		{
			label: "NDA & Security Compliance",
			href: "/nda-compliance"
		},
		{
			label: "ESG & Sustainability Charter",
			href: "/esg-policy"
		},
		{
			label: "Cookie Policy",
			href: "/cookie-policy"
		},
		{
			label: "Studio FAQ",
			href: "/faq"
		}
	];
	if (isCompact) return /* @__PURE__ */ jsxs("footer", {
		id: "site-footer",
		className: "relative bg-[#07080b] text-white border-t border-white/10 select-none overflow-hidden w-full",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-16 sm:pt-20 pb-12",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-4 space-y-6",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								href: "/",
								className: "group inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-accent rounded-lg",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-accent/60 group-hover:bg-accent/10 transition-all duration-300",
									children: /* @__PURE__ */ jsx("img", {
										src: "/images/ce/ce_icon_neon.png",
										alt: "Cutting Edger",
										className: "w-5 h-5 object-contain group-hover:scale-110 transition-transform duration-300"
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-baseline tracking-tight",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-display text-2xl sm:text-[26px] font-black tracking-tight text-white transition-colors",
										children: "CUTTING"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-display text-2xl sm:text-[26px] font-black tracking-tight text-accent ml-1",
										children: "EDGER"
									})]
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-sm",
								children: "AI-driven visual performance agency engineered for high-volume catalog retouching, swatch color standardization, white-label production, and 3D CGI virtual staging."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2 text-xs font-mono text-neutral-400",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Artisan Center, Level-7, West Panthapath, Dhaka 1215" })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("a", {
										href: "mailto:hello@cuttingedger.com",
										className: "hover:text-white transition-colors",
										children: "hello@cuttingedger.com"
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-3 space-y-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
							children: "Visual Disciplines"
						}), /* @__PURE__ */ jsx("ul", {
							className: "space-y-2 text-xs text-neutral-400 font-sans",
							children: dynamicServiceLinks.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
								href: item.href,
								className: "hover:text-white transition-colors block py-0.5",
								children: item.label
							}) }, item.label))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-2 space-y-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
							children: "Agency & Trust"
						}), /* @__PURE__ */ jsx("ul", {
							className: "space-y-2 text-xs text-neutral-400 font-sans",
							children: agencyLinks.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
								href: item.href,
								className: "hover:text-white transition-colors block py-0.5",
								children: item.label
							}) }, item.label))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-3 space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
									children: "Visual Intelligence"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400 font-sans leading-relaxed",
									children: "Quarterly briefs on catalog velocity, Delta-E color science, and 3D CGI conversion lift."
								})]
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleNewsletterSubmit,
								className: "space-y-2.5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative flex items-center",
									children: [/* @__PURE__ */ jsx("input", {
										type: "email",
										value: data.email,
										onChange: (e) => setData("email", e.target.value),
										placeholder: "director@brand.com",
										required: true,
										className: "w-full bg-[#12141c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors pr-24 font-sans"
									}), /* @__PURE__ */ jsxs("button", {
										type: "submit",
										disabled: processing,
										className: "absolute right-1.5 px-3 py-1.5 rounded-lg bg-accent text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50",
										children: [/* @__PURE__ */ jsx("span", { children: "Join" }), /* @__PURE__ */ jsx(Send, { className: "w-3 h-3" })]
									})]
								}), recentlySuccessful && /* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-accent font-mono flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Subscribed to Cutting Edger Brief." })]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "pt-1",
								children: /* @__PURE__ */ jsxs(Link, {
									href: "/#free-trial",
									className: "group inline-flex items-center justify-between w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-accent hover:text-black hover:border-accent transition-all duration-300",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono uppercase tracking-wider font-semibold",
										children: "Test Us On 3 Raw Assets"
									}), /* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1 text-xs font-mono font-bold uppercase text-accent group-hover:text-black transition-colors",
										children: ["Free Pilot", /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
									})]
								})
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-400 font-sans",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-4 sm:gap-6 order-2 sm:order-1 font-mono text-[11px]",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" Cutting Edger Inc."
							] }),
							/* @__PURE__ */ jsx(Link, {
								href: "/privacy",
								className: "hover:text-white transition-colors",
								children: "Privacy Policy"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/terms",
								className: "hover:text-white transition-colors",
								children: "Terms of Service"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/cookie-policy",
								className: "hover:text-white transition-colors",
								children: "Cookie Policy"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/nda-compliance",
								className: "hover:text-white transition-colors",
								children: "NDA Compliance"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/esg-policy",
								className: "hover:text-white transition-colors",
								children: "ESG Charter"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap items-center gap-5 sm:gap-6 order-1 sm:order-2",
						children: socials.map((social) => /* @__PURE__ */ jsx("a", {
							href: social.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "relative text-[#f9f4e8]/80 hover:text-white transition-colors font-medium tracking-wide after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-accent after:transition-all after:duration-300 text-xs",
							children: social.name
						}, social.name))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "order-3",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: scrollToTop,
							"aria-label": "Scroll back to top",
							className: "w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-black text-white flex items-center justify-center transition-all duration-300 cursor-pointer",
							children: /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 stroke-[2.5]" })
						})
					})
				]
			})]
		})]
	});
	return /* @__PURE__ */ jsx("footer", {
		id: "site-footer",
		className: "relative bg-[#090a0d] px-3 sm:px-5 pb-4 pt-12 sm:pt-16 select-none",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative rounded-[24px] sm:rounded-[36px] overflow-hidden border border-white/10 min-h-[75vh] flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.95)]",
			style: {
				backgroundColor: "#080302",
				backgroundImage: "url('/images/footer-bg.jpg')",
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover"
			},
			children: [
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-sans text-[#f9f4e8]",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-normal text-[#f9f4e8]/90 tracking-wide order-2 sm:order-1 font-mono text-xs",
							children: "AI-Driven Visual Performance Agency"
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "order-1 sm:order-2 inline-flex items-center gap-2.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase hover:text-accent transition-colors",
							children: [/* @__PURE__ */ jsx("img", {
								src: "/images/ce/ce_icon_neon.png",
								alt: "Cutting Edger",
								className: "w-7 h-7 sm:w-8 sm:h-8 object-contain"
							}), /* @__PURE__ */ jsx("span", { children: "cutting edger" })]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "font-normal text-[#f9f4e8]/90 tracking-wide order-3 hidden sm:inline-block font-mono text-xs",
							children: "Dhaka · London · San Francisco"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 w-full px-2 sm:px-4 py-10 sm:py-16 md:py-20 flex flex-col items-center justify-center text-center my-auto",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-[0.25em] text-accent font-bold mb-4 sm:mb-6 select-none",
						children: "READY TO ELEVATE YOUR CATALOG CRAFT & VELOCITY?"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/contact",
						onPointerLeave: () => setHoveredIndex(null),
						className: "cursor-pointer group flex items-center justify-center select-none w-full max-w-[98%] mx-auto focus:outline-none",
						title: "Navigate to Contact Page",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex items-center justify-center flex-nowrap w-full overflow-visible py-4 sm:py-8",
							children: letters.map((char, index) => {
								if (char === " ") return /* @__PURE__ */ jsx("span", { className: "w-[2.4vw] sm:w-[2.8vw] lg:w-[3.2vw] inline-block pointer-events-none" }, `space-${index}`);
								const isHovered = hoveredIndex === index;
								return /* @__PURE__ */ jsx(motion.span, {
									onPointerEnter: (e) => {
										e.stopPropagation();
										setHoveredIndex(index);
									},
									onPointerLeave: (e) => {
										e.stopPropagation();
										setHoveredIndex((prev) => prev === index ? null : prev);
									},
									animate: {
										scaleY: isHovered ? 1.15 : 1,
										y: isHovered ? "-2%" : "0%"
									},
									transition: {
										duration: .2,
										ease: [
											.39,
											.575,
											.565,
											1
										]
									},
									style: { transformOrigin: "center bottom" },
									className: "inline-block font-display font-black uppercase text-[9vw] sm:text-[10.5vw] md:text-[11.5vw] lg:text-[12.5vw] xl:text-[13.5vw] leading-none text-[#f9f4e8] tracking-[-0.04em] will-change-transform select-none cursor-pointer group-hover:text-white transition-colors",
									children: char
								}, `char-${index}`);
							})
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 w-full pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-[#f9f4e8] border-t border-white/10",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-4 text-xs",
							children: [
								/* @__PURE__ */ jsxs("span", { children: [
									"© ",
									(/* @__PURE__ */ new Date()).getFullYear(),
									" Cutting Edger"
								] }),
								/* @__PURE__ */ jsx(Link, {
									href: "/privacy",
									className: "text-[#f9f4e8]/70 hover:text-white transition-colors",
									children: "Privacy"
								}),
								/* @__PURE__ */ jsx(Link, {
									href: "/terms",
									className: "text-[#f9f4e8]/70 hover:text-white transition-colors",
									children: "Terms"
								}),
								/* @__PURE__ */ jsx(Link, {
									href: "/cookie-policy",
									className: "text-[#f9f4e8]/70 hover:text-white transition-colors",
									children: "Cookies"
								}),
								/* @__PURE__ */ jsx(Link, {
									href: "/nda-compliance",
									className: "text-[#f9f4e8]/70 hover:text-white transition-colors",
									children: "NDA"
								}),
								/* @__PURE__ */ jsx(Link, {
									href: "/esg-policy",
									className: "text-[#f9f4e8]/70 hover:text-white transition-colors",
									children: "ESG"
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-6 sm:gap-8",
							children: socials.map((social) => /* @__PURE__ */ jsx("a", {
								href: social.url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "relative text-[#f9f4e8]/80 hover:text-white transition-colors font-medium tracking-wide text-xs",
								children: social.name
							}, social.name))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-4",
							children: /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: scrollToTop,
								"aria-label": "Scroll back to top",
								className: "w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-accent transition-all duration-300 shadow-xl cursor-pointer shrink-0",
								children: /* @__PURE__ */ jsx(ChevronUp, { className: "w-5 h-5 stroke-[2.5]" })
							})
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Layouts/MobileMenu.tsx
function MobileMenu({ isOpen, onClose, onOpenContact, settings }) {
	const { auth } = usePage().props;
	useEffect(() => {
		if (isOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);
	const navLinks = [
		{
			label: "Services",
			href: "/services",
			count: "04"
		},
		{
			label: "Case Studies",
			href: "/case-studies",
			count: "08"
		},
		{
			label: "About",
			href: "/about",
			count: "01"
		},
		{
			label: "Team",
			href: "/team",
			count: "05"
		},
		{
			label: "Careers",
			href: "/careers",
			count: "03"
		},
		{
			label: "Pricing",
			href: "/pricing",
			count: "03"
		},
		{
			label: "Blog",
			href: "/blog",
			count: "06"
		},
		{
			label: "Contact",
			href: "/contact",
			count: "01"
		}
	];
	if (!isOpen) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[120] bg-[#0a0b0e] text-white flex flex-col justify-between p-6 sm:p-12 overflow-y-auto animate-in fade-in duration-300",
		role: "dialog",
		"aria-modal": "true",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-white/10 pb-6",
				children: [/* @__PURE__ */ jsxs(Link, {
					href: "/",
					onClick: onClose,
					className: "font-display font-extrabold text-2xl tracking-tighter flex items-center gap-1",
					children: [/* @__PURE__ */ jsx("span", { children: "CUTTING" }), /* @__PURE__ */ jsx("span", {
						className: "text-accent",
						children: "EDGER."
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsx(ThemeToggle, {}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close mobile navigation",
						className: "p-3 rounded-full border border-white/20 text-neutral-300 hover:text-accent hover:border-accent transition-colors",
						children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
					})]
				})]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "my-auto py-8",
				children: /* @__PURE__ */ jsx("ul", {
					className: "space-y-4 sm:space-y-6",
					children: navLinks.map((item, index) => /* @__PURE__ */ jsx("li", {
						className: "overflow-hidden",
						children: /* @__PURE__ */ jsxs(Link, {
							href: item.href,
							onClick: onClose,
							className: "group flex items-baseline justify-between py-2 border-b border-white/5 hover:border-accent/40 transition-colors",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-300 group-hover:text-accent group-hover:translate-x-3 transition-all duration-300",
								children: item.label
							}), /* @__PURE__ */ jsxs("span", {
								className: "font-mono text-xs sm:text-sm text-neutral-500 group-hover:text-accent",
								children: [
									"(",
									item.count,
									")"
								]
							})]
						})
					}, item.href))
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-4 border-t border-white/10",
				children: auth?.user ? /* @__PURE__ */ jsxs(Link, {
					href: "/admin",
					onClick: onClose,
					className: "w-full py-3 px-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors",
					children: [/* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsxs("span", { children: [
						"Command Clearance (",
						auth.user.name?.split(" ")[0],
						")"
					] })]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3 w-full",
					children: [/* @__PURE__ */ jsxs(Link, {
						href: "/login",
						onClick: onClose,
						className: "py-3 px-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors",
						children: [/* @__PURE__ */ jsx(LogIn, { className: "w-4 h-4 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Sign In" })]
					}), /* @__PURE__ */ jsxs("a", {
						href: "/#free-trial",
						onClick: (e) => {
							onClose();
							if (window.location.pathname === "/") {
								e.preventDefault();
								const el = document.getElementById("free-trial");
								if (el) el.scrollIntoView({ behavior: "smooth" });
							}
						},
						className: "py-3 px-4 rounded-2xl border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors font-medium",
						children: [/* @__PURE__ */ jsx(UserPlus, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Sign Up" })]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "font-mono text-xs uppercase text-neutral-400 block mb-1",
					children: "Direct Line"
				}), /* @__PURE__ */ jsx("a", {
					href: `mailto:${settings?.contact_email || "hello@cuttingedger.com"}`,
					className: "text-sm font-semibold hover:text-accent transition-colors",
					children: settings?.contact_email || "hello@cuttingedger.com"
				})] }), /* @__PURE__ */ jsxs(Link, {
					href: "/contact",
					onClick: onClose,
					className: "bg-accent text-black px-6 py-3.5 rounded-full font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors",
					children: [/* @__PURE__ */ jsx("span", { children: "Initiate Project" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Layouts/SlideOverContact.tsx
function SlideOverContact({ isOpen, onClose, settings }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { data, setData, post, processing, reset, wasSuccessful } = useForm({
		name: "",
		email: "",
		message: "",
		service_interest: "General Inquiry",
		honeypot: ""
	});
	const isBusy = processing || isSubmitting;
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		if (isOpen) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);
		} else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isBusy) return;
		setIsSubmitting(true);
		post("/contact", {
			preserveScroll: true,
			onSuccess: () => {
				reset();
				onClose();
			},
			onFinish: () => setIsSubmitting(false)
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
		"aria-modal": "true",
		role: "dialog",
		"aria-labelledby": "slideover-title",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity",
			onClick: onClose
		}), /* @__PURE__ */ jsxs("div", {
			className: `absolute top-0 right-0 h-full w-full max-w-xl bg-[#0e1017] dark:bg-[#0c0d12] border-l border-white/10 text-white shadow-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`,
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-6 border-b border-white/10",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-accent",
						children: "Direct Agency Channel"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close contact drawer",
						className: "p-2 rounded-full border border-white/10 hover:border-accent hover:text-accent text-neutral-400 transition-colors",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ jsxs("h2", {
						id: "slideover-title",
						className: "text-3xl sm:text-4xl font-display font-bold leading-tight",
						children: ["Have a wild project in mind? ", /* @__PURE__ */ jsx("span", {
							className: "text-accent",
							children: "Let's talk."
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-neutral-400 text-sm",
						children: "We collaborate with ambitious innovators worldwide. Drop us a note or call our studio directly."
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "mt-8 space-y-4",
					children: [
						/* @__PURE__ */ jsx("input", {
							type: "text",
							name: "website_url",
							value: data.honeypot,
							onChange: (e) => setData("honeypot", e.target.value),
							tabIndex: -1,
							autoComplete: "off",
							className: "hidden",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-mono uppercase text-neutral-400 mb-1",
							children: "Your Name"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							required: true,
							value: data.name,
							onChange: (e) => setData("name", e.target.value),
							placeholder: "Elon Musk",
							className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-accent transition-colors"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-mono uppercase text-neutral-400 mb-1",
							children: "Email Address"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							required: true,
							value: data.email,
							onChange: (e) => setData("email", e.target.value),
							placeholder: "hello@company.com",
							className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-accent transition-colors"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-mono uppercase text-neutral-400 mb-1",
							children: "Message"
						}), /* @__PURE__ */ jsx("textarea", {
							required: true,
							rows: 3,
							value: data.message,
							onChange: (e) => setData("message", e.target.value),
							placeholder: "Tell us about the scope, timeline, and vision...",
							className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-accent transition-colors"
						})] }),
						wasSuccessful && /* @__PURE__ */ jsx("div", {
							className: "p-3 rounded-lg bg-accent/10 border border-accent/40 text-accent text-xs font-mono",
							children: "Inbound message transmitted. We will reply within 24 hours."
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: isBusy,
							className: "w-full bg-accent text-black font-display font-bold py-3.5 px-6 rounded-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
							children: [/* @__PURE__ */ jsx("span", { children: isBusy ? "Sending..." : "Transmit Inquiry" }), /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 transition-transform group-hover:translate-x-1" })]
						})
					]
				})
			] }), /* @__PURE__ */ jsxs("div", {
				className: "mt-10 pt-8 border-t border-white/10 space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: `mailto:${settings?.contact_email || "studio@cuttingedger.com"}`,
							className: "flex items-center gap-2.5 text-neutral-300 hover:text-accent transition-colors",
							children: [/* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: settings?.contact_email || "studio@cuttingedger.com" })]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: `tel:${settings?.contact_phone || "+18005553343"}`,
							className: "flex items-center gap-2.5 text-neutral-300 hover:text-accent transition-colors",
							children: [/* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: settings?.contact_phone || "+1 (800) 555-EDGE" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 text-neutral-400 sm:col-span-2",
							children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: settings?.office_address || "742 Evergreen Terrace, Creative District, SF" })]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-4 pt-2",
					children: [
						"Twitter",
						"LinkedIn",
						"Instagram",
						"Dribbble"
					].map((social) => /* @__PURE__ */ jsxs("a", {
						href: "#",
						className: "text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-accent transition-colors flex items-center gap-1",
						children: [/* @__PURE__ */ jsx("span", { children: social }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })]
					}, social))
				})]
			})]
		})]
	});
}
//#endregion
//#region resources/js/Components/Common/DiscoveryCallModal.tsx
function DiscoveryCallModal({ isOpen, onClose }) {
	const [days, setDays] = useState([]);
	const [selectedDayIndex, setSelectedDayIndex] = useState(0);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [service, setService] = useState("Catalog Optimization & Retouching");
	const [notes, setNotes] = useState("");
	const [isLoadingSlots, setIsLoadingSlots] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [confirmedBooking, setConfirmedBooking] = useState(null);
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		if (isOpen) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);
		} else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);
	useEffect(() => {
		if (!isOpen) {
			setConfirmedBooking(null);
			setErrorMessage(null);
			return;
		}
		setIsLoadingSlots(true);
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
		fetch(`/api/chat/available-slots?timezone=${encodeURIComponent(timezone)}`, { headers: {
			"Content-Type": "application/json",
			"X-Requested-With": "XMLHttpRequest"
		} }).then((res) => res.json()).then((data) => {
			if (data.days && Array.isArray(data.days) && data.days.length > 0) {
				setDays(data.days);
				setSelectedDayIndex(0);
				if (data.days[0].slots && data.days[0].slots.length > 0) setSelectedSlot(data.days[0].slots[0]);
			}
		}).catch((err) => {
			console.error("Failed to load consultation slots:", err);
			const now = /* @__PURE__ */ new Date();
			const fallbackDays = [];
			for (let i = 1; i <= 4; i++) {
				const d = new Date(now);
				d.setDate(d.getDate() + i);
				if (d.getDay() === 0 || d.getDay() === 6) continue;
				fallbackDays.push({
					date: d.toISOString().split("T")[0],
					label: d.toLocaleDateString("en-US", {
						weekday: "short",
						month: "short",
						day: "numeric"
					}),
					slots: [
						{
							time: "10:00 AM",
							iso: new Date(d.setHours(10, 0, 0, 0)).toISOString()
						},
						{
							time: "11:30 AM",
							iso: new Date(d.setHours(11, 30, 0, 0)).toISOString()
						},
						{
							time: "02:00 PM",
							iso: new Date(d.setHours(14, 0, 0, 0)).toISOString()
						},
						{
							time: "03:30 PM",
							iso: new Date(d.setHours(15, 30, 0, 0)).toISOString()
						}
					]
				});
			}
			setDays(fallbackDays);
			if (fallbackDays[0]?.slots[0]) setSelectedSlot(fallbackDays[0].slots[0]);
		}).finally(() => {
			setIsLoadingSlots(false);
		});
	}, [isOpen]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(null);
		if (!selectedSlot) {
			setErrorMessage("Please pick an available time slot.");
			return;
		}
		if (!name.trim() || !email.trim()) {
			setErrorMessage("Please enter your full name and work email.");
			return;
		}
		setIsSubmitting(true);
		try {
			const storedSession = localStorage.getItem("ce_chat_session_id");
			const res = await fetch("/api/chat/book-slot", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					...storedSession ? { "X-Chat-Session-Id": storedSession } : {}
				},
				body: JSON.stringify({
					slot_datetime: selectedSlot.iso,
					name: name.trim(),
					email: email.trim(),
					phone: phone.trim() || null,
					service,
					notes: notes.trim() || null
				})
			});
			const data = await res.json();
			if (!res.ok) {
				setErrorMessage(data.message || "Unable to confirm appointment. Please try another slot.");
				return;
			}
			setConfirmedBooking({
				datetime_formatted: data.datetime_formatted || selectedSlot.time,
				name: name.trim(),
				email: email.trim()
			});
		} catch (err) {
			console.error("Booking submission error:", err);
			setErrorMessage("Connection error. Please try again or reach us at contact@cuttingedger.com.");
		} finally {
			setIsSubmitting(false);
		}
	};
	if (!isOpen) return null;
	const activeDay = days[selectedDayIndex] || days[0];
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50 duration-200",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-2xl bg-[#0e1017] border border-white/15 rounded-3xl shadow-2xl overflow-hidden relative text-white animate-in zoom-in-95 duration-200",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "p-2 rounded-xl bg-accent/10 border border-accent/30 text-accent",
						children: /* @__PURE__ */ jsx(Video, { className: "w-4 h-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
						className: "font-display font-bold text-sm tracking-tight text-white flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", { children: "Schedule a Visual Performance Discovery Call" }), /* @__PURE__ */ jsx("span", {
							className: "px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent/15 text-accent border border-accent/30 font-semibold",
							children: "15-Min Live Screen Share"
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-neutral-400",
						children: "Review catalog standards, SLA turnaround, and custom volume pricing."
					})] })]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					className: "p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors",
					"aria-label": "Close modal",
					children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "p-6",
				children: confirmedBooking ? /* @__PURE__ */ jsxs("div", {
					className: "py-8 text-center space-y-4 animate-in fade-in-50 duration-300",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400",
							children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-8 h-8" })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xl font-display font-bold text-white",
								children: "Consultation Call Confirmed!"
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-neutral-300 max-w-md mx-auto",
								children: [
									"We have reserved your slot for ",
									/* @__PURE__ */ jsx("span", {
										className: "text-accent font-mono font-semibold",
										children: confirmedBooking.datetime_formatted
									}),
									". A calendar invitation with screen-share details has been queued for ",
									/* @__PURE__ */ jsx("span", {
										className: "text-white font-mono",
										children: confirmedBooking.email
									}),
									"."
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-sm mx-auto text-left text-xs font-mono space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-neutral-400",
									children: [/* @__PURE__ */ jsx("span", { children: "Host:" }), /* @__PURE__ */ jsx("span", {
										className: "text-white",
										children: "Cutting Edger Studio Leads"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-neutral-400",
									children: [/* @__PURE__ */ jsx("span", { children: "Client Name:" }), /* @__PURE__ */ jsx("span", {
										className: "text-white",
										children: confirmedBooking.name
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-neutral-400",
									children: [/* @__PURE__ */ jsx("span", { children: "Duration:" }), /* @__PURE__ */ jsx("span", {
										className: "text-emerald-400 font-semibold",
										children: "15 Minutes (Google Meet / Zoom)"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "pt-4",
							children: /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onClose,
								className: "px-8 py-3 rounded-xl bg-accent text-black font-semibold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors",
								children: "Done"
							})
						})
					]
				}) : /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-5",
					children: [
						errorMessage && /* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: errorMessage })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-mono uppercase text-accent font-bold flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "1. Select Preferred Date & Time" })]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-mono text-neutral-400",
									children: "All times auto-adjusted to your local timezone"
								})]
							}), isLoadingSlots ? /* @__PURE__ */ jsxs("div", {
								className: "p-8 text-center text-xs text-neutral-400 font-mono flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-accent" }), /* @__PURE__ */ jsx("span", { children: "Loading live calendar availability..." })]
							}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
								children: days.map((day, idx) => {
									return /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => {
											setSelectedDayIndex(idx);
											if (day.slots && day.slots.length > 0) setSelectedSlot(day.slots[0]);
										},
										className: `px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${idx === selectedDayIndex ? "bg-accent text-black font-bold shadow-md shadow-accent/10" : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5"}`,
										children: day.label
									}, day.date);
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1",
								children: activeDay?.slots.map((slot) => {
									const isSlotSelected = selectedSlot?.iso === slot.iso;
									return /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setSelectedSlot(slot),
										className: `px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isSlotSelected ? "bg-accent/15 text-accent border-2 border-accent font-bold shadow-sm" : "bg-white/[0.04] text-neutral-300 hover:bg-white/10 hover:text-white border border-white/10"}`,
										children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: slot.time })]
									}, slot.iso);
								})
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-3 pt-2 border-t border-white/10",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-accent font-bold block",
									children: "2. Your Information & Brief"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-[11px] font-mono uppercase text-neutral-400",
											children: "Full Name *"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: name,
											onChange: (e) => setName(e.target.value),
											placeholder: "e.g. Sarah Jenkins",
											required: true,
											className: "w-full h-9 rounded-xl bg-neutral-900 border border-white/10 text-xs px-3 text-white focus:outline-none focus:border-accent"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-[11px] font-mono uppercase text-neutral-400",
											children: "Work Email *"
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											value: email,
											onChange: (e) => setEmail(e.target.value),
											placeholder: "sarah@brand.com",
											required: true,
											className: "w-full h-9 rounded-xl bg-neutral-900 border border-white/10 text-xs px-3 text-white focus:outline-none focus:border-accent"
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-[11px] font-mono uppercase text-neutral-400",
											children: "Phone / WhatsApp (Optional)"
										}), /* @__PURE__ */ jsx("input", {
											type: "tel",
											value: phone,
											onChange: (e) => setPhone(e.target.value),
											placeholder: "+1 (555) 000-0000",
											className: "w-full h-9 rounded-xl bg-neutral-900 border border-white/10 text-xs px-3 text-white focus:outline-none focus:border-accent"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-[11px] font-mono uppercase text-neutral-400",
											children: "Service Discipline"
										}), /* @__PURE__ */ jsxs("select", {
											value: service,
											onChange: (e) => setService(e.target.value),
											className: "w-full h-9 rounded-xl bg-neutral-900 border border-white/10 text-xs px-3 text-white focus:outline-none focus:border-accent",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "Catalog Optimization & Retouching",
													children: "1. Catalog Optimization & Retouching"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Color Standardization",
													children: "2. Color Standardization & Multi-Colorways"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "White-Label Studio Extension",
													children: "3. White-Label Agency Extension"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Virtual Production & 3D CGI",
													children: "4. Virtual Production & 3D CGI"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Custom High-Volume Enterprise SLA",
													children: "Enterprise High-Volume Retouching"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-[11px] font-mono uppercase text-neutral-400",
										children: "Project Scope or Questions (Optional)"
									}), /* @__PURE__ */ jsx("textarea", {
										value: notes,
										onChange: (e) => setNotes(e.target.value),
										placeholder: "e.g. We have ~2,500 apparel SKUs per month requiring ghost mannequin and delta-E matching...",
										rows: 2,
										className: "w-full rounded-xl bg-neutral-900 border border-white/10 text-xs p-3 text-white focus:outline-none focus:border-accent resize-none"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono",
								children: [/* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Protected under Strict Mutual NDA" })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: onClose,
									className: "px-4 py-2.5 rounded-xl text-xs font-mono text-neutral-400 hover:text-white transition-colors",
									children: "Cancel"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: isSubmitting || !selectedSlot,
									className: "px-6 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-lg shadow-accent/15 disabled:opacity-50 cursor-pointer",
									children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Confirming..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Confirm Call Slot" })] })
								})]
							})]
						})
					]
				})
			})]
		})
	});
}
//#endregion
//#region resources/js/Components/Chat/QuoteCard.tsx
var SERVICE_OPTIONS = {
	"background-removal": {
		title: "Clipping Path / Cutout",
		rates: {
			simple: .45,
			medium: .85,
			complex: 1.75
		}
	},
	"ghost-mannequin": {
		title: "Ghost Mannequin Joint",
		rates: {
			simple: .95,
			medium: 1.45,
			complex: 2.4
		}
	},
	"high-end-model-retouch": {
		title: "Model & Skin Retouch",
		rates: {
			simple: 1.8,
			medium: 3.2,
			complex: 5.5
		}
	},
	"jewelry-retouch": {
		title: "Fine Jewelry Retouch",
		rates: {
			simple: 1.95,
			medium: 3.6,
			complex: 6.2
		}
	},
	"3d-modeling": {
		title: "3D CGI Product Modeling",
		rates: {
			simple: 25,
			medium: 55,
			complex: 110
		}
	}
};
function QuoteCard({ card, onSelectReply, onUploadClick }) {
	const initialSlug = card.service_slug && SERVICE_OPTIONS[card.service_slug] ? card.service_slug : "background-removal";
	const [serviceKey, setServiceKey] = useState(initialSlug);
	const currentService = SERVICE_OPTIONS[serviceKey] || SERVICE_OPTIONS["background-removal"];
	const rates = currentService.rates;
	const initialComplexity = card.complexity?.toLowerCase().includes("complex") ? "complex" : card.complexity?.toLowerCase().includes("medium") ? "medium" : "simple";
	const [complexity, setComplexity] = useState(initialComplexity);
	const [quantity, setQuantity] = useState(card.quantity && card.quantity > 3 ? card.quantity : 3);
	const baseRate = rates[complexity] ?? rates.simple ?? .45;
	const isFreeTrial = quantity <= 3;
	const unitPrice = Math.round(baseRate * (1 - (quantity >= 100 ? 20 : quantity >= 25 ? 10 : 0) / 100) * 100) / 100;
	const totalPrice = isFreeTrial ? "0.00" : (unitPrice * quantity).toFixed(2);
	return /* @__PURE__ */ jsxs("div", {
		className: "my-2 p-3.5 rounded-2xl bg-[#14161f] border border-white/10 shadow-xl text-left space-y-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-2 border-b border-white/5 pb-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 flex-1 min-w-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "p-1.5 rounded-lg bg-accent/10 text-accent shrink-0",
						children: /* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx("select", {
								value: serviceKey,
								onChange: (e) => setServiceKey(e.target.value),
								className: "w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2 py-1 pr-6 text-xs font-bold text-white focus:outline-none focus:border-accent cursor-pointer appearance-none transition-colors",
								children: Object.entries(SERVICE_OPTIONS).map(([key, item]) => /* @__PURE__ */ jsx("option", {
									value: key,
									className: "bg-[#14161f] text-white",
									children: item.title
								}, key))
							}), /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5 text-white/50 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" })]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-white/50 font-mono block mt-0.5 px-0.5",
							children: card.turnaround || "24h Studio Turnaround"
						})]
					})]
				}), isFreeTrial && /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent text-black shrink-0 self-start mt-1",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-2.5 h-2.5" }), " Free ($0)"]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] text-white/50 font-mono shrink-0",
					children: "Complexity:"
				}), /* @__PURE__ */ jsx("div", {
					className: "flex gap-1",
					children: [
						{
							key: "simple",
							label: "Simple",
							price: rates.simple ?? .45
						},
						{
							key: "medium",
							label: "Medium",
							price: rates.medium ?? .85
						},
						{
							key: "complex",
							label: "Complex",
							price: rates.complex ?? 1.75
						}
					].map((c) => {
						const active = complexity === c.key;
						return /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setComplexity(c.key),
							className: `px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${active ? "bg-accent text-black font-bold border-accent" : "bg-white/5 text-white/70 border-white/5 hover:bg-white/10"}`,
							children: [
								c.label,
								" ",
								/* @__PURE__ */ jsxs("span", {
									className: active ? "text-black/80 font-normal" : "text-accent",
									children: ["$", c.price.toFixed(2)]
								})
							]
						}, c.key);
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] text-white/50 font-mono shrink-0",
					children: "Quantity:"
				}), /* @__PURE__ */ jsx("div", {
					className: "flex gap-1",
					children: [
						{
							qty: 3,
							label: "3 (Free)"
						},
						{
							qty: 25,
							label: "25"
						},
						{
							qty: 100,
							label: "100+ (-20%)"
						}
					].map((q) => {
						const active = quantity === q.qty;
						return /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setQuantity(q.qty),
							className: `px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${active ? "bg-white text-black font-bold border-white" : "bg-white/5 text-white/70 border-white/5 hover:bg-white/10"}`,
							children: q.label
						}, q.qty);
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pt-2 border-t border-white/5 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] text-white/50 block font-mono",
					children: "Estimate:"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-baseline gap-1",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-base font-bold text-accent font-mono",
						children: ["$", totalPrice]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-white/50 font-mono",
						children: isFreeTrial ? "USD (Free)" : `($${unitPrice.toFixed(2)}/img)`
					})]
				})] }), isFreeTrial ? /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => onSelectReply("Claim 3 Free Sample Edits"),
					className: "py-1.5 px-3 rounded-xl bg-accent hover:bg-[#bce600] text-black font-semibold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0",
					children: [/* @__PURE__ */ jsx("span", { children: "Test 3 Free" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
				}) : /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => onSelectReply(`Proceed with order for ${quantity} ${currentService.title} images (${complexity} complexity, $${totalPrice})`),
					className: "py-1.5 px-3 rounded-xl bg-accent hover:bg-[#bce600] text-black font-semibold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0",
					children: [/* @__PURE__ */ jsx("span", { children: "Proceed to Order" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Chat/CalendarSlotPicker.tsx
function CalendarSlotPicker({ card, onBookSlot }) {
	const isReschedule = Boolean(card.is_reschedule || card.existing_booking);
	const existing = card.existing_booking;
	const [selectedDayIndex, setSelectedDayIndex] = useState(0);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [name, setName] = useState(existing?.client_name || "");
	const [email, setEmail] = useState(existing?.client_email || "");
	const [phone, setPhone] = useState("");
	const [notes, setNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const activeDay = card.days[selectedDayIndex] || card.days[0];
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedSlot) {
			setError("Please choose a time slot.");
			return;
		}
		if (!email.trim() || !name.trim()) {
			setError("Please provide your name and email.");
			return;
		}
		setError(null);
		setIsSubmitting(true);
		try {
			await onBookSlot({
				slot_datetime: selectedSlot.iso,
				name: name.trim(),
				email: email.trim(),
				phone: phone.trim() || void 0,
				notes: notes.trim() || void 0,
				consultation_id: existing?.consultation_id,
				is_reschedule: isReschedule
			});
			setSelectedSlot(null);
		} catch (err) {
			setError(err?.message || "Booking failed. Please try another slot.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `my-2 p-4 rounded-2xl border shadow-2xl backdrop-blur-md text-left transition-all ${isReschedule ? "bg-[#12141a]/95 border-accent/40" : "bg-[#12141a]/95 border-[#00f5ff]/30"}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mb-2 pb-2 border-b border-white/10",
				children: [/* @__PURE__ */ jsx("span", {
					className: `p-1.5 rounded-lg ${isReschedule ? "bg-accent/15 text-accent" : "bg-[#00f5ff]/10 text-[#00f5ff]"}`,
					children: isReschedule ? /* @__PURE__ */ jsx(CalendarClock, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-sm font-bold text-white tracking-tight",
					children: card.title
				}), /* @__PURE__ */ jsxs("span", {
					className: "text-[10px] text-white/50 font-mono",
					children: [
						"Timezone: ",
						card.timezone,
						" • 15 min duration"
					]
				})] })]
			}),
			isReschedule && existing?.current_time_formatted && /* @__PURE__ */ jsxs("div", {
				className: "mb-3 p-2.5 rounded-xl bg-accent/10 border border-accent/20 flex items-start gap-2 text-xs font-mono",
				children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
					className: "text-white/80",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-accent font-bold block",
						children: "Rescheduling Current Booking"
					}), /* @__PURE__ */ jsxs("span", { children: ["Currently booked for: ", existing.current_time_formatted] })]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none",
				children: card.days.map((day, idx) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => {
						setSelectedDayIndex(idx);
						setSelectedSlot(null);
					},
					className: `px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${selectedDayIndex === idx ? isReschedule ? "bg-accent text-black font-bold shadow-md" : "bg-[#00f5ff] text-black shadow-md" : "bg-white/5 text-white/70 hover:bg-white/10"}`,
					children: day.label
				}, day.date))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-3 gap-1.5 my-3",
				children: activeDay?.slots.map((slot) => {
					const isSelected = selectedSlot?.iso === slot.iso;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setSelectedSlot(slot),
						className: `py-2 px-1 text-center rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer ${isSelected ? "bg-accent text-black font-bold shadow-md scale-102" : "bg-white/5 text-white hover:bg-white/10 border border-white/5"}`,
						children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 opacity-60" }), /* @__PURE__ */ jsx("span", { children: slot.time })]
					}, slot.iso);
				})
			}),
			selectedSlot && /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "mt-3 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 animate-in fade-in slide-in-from-top-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "text-[11px] font-mono text-accent flex items-center gap-1 pb-1",
						children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsxs("span", { children: [
							isReschedule ? "New Slot:" : "Selected:",
							" ",
							activeDay.label,
							" at ",
							selectedSlot.time
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
						children: [/* @__PURE__ */ jsx("input", {
							type: "text",
							required: true,
							placeholder: "Your Name *",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff]"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							required: true,
							placeholder: "Your Email *",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff]"
						})]
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "WhatsApp / Phone (Optional)",
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						className: "w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff]"
					}),
					/* @__PURE__ */ jsx("textarea", {
						rows: 2,
						placeholder: "What would you like to discuss? (e.g. ghost mannequin, turnaround, 3D specs) (Optional)",
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						className: "w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff] resize-none"
					}),
					error && /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-red-400 font-mono",
						children: error
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: isSubmitting,
						className: `w-full py-2 px-3 rounded-lg text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer ${isReschedule ? "bg-accent hover:bg-accent-hover" : "bg-[#00f5ff] hover:bg-[#00d8e6]"}`,
						children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ jsx("span", { children: isReschedule ? "Rescheduling Slot..." : "Reserving Slot..." })] }) : /* @__PURE__ */ jsx(Fragment, { children: isReschedule ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Confirm Rescheduled Time" })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "Confirm Consultation" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })] }) })
					})
				]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Chat/CompactSlotProposalCard.tsx
function CompactSlotProposalCard({ card, onBookSlot, onShowAllTimes, initialName = "", initialEmail = "" }) {
	const [name, setName] = useState(initialName);
	const [email, setEmail] = useState(initialEmail);
	const [selectedTime, setSelectedTime] = useState(card.selected_time);
	const [selectedIso, setSelectedIso] = useState(card.slot_datetime);
	const [showForm, setShowForm] = useState(!initialEmail);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const handleConfirm = async (e) => {
		if (e) e.preventDefault();
		if (!name.trim()) {
			setError("Please provide your name.");
			setShowForm(true);
			return;
		}
		if (!email.trim() || !email.includes("@")) {
			setError("Please enter a valid work or business email.");
			setShowForm(true);
			return;
		}
		setError(null);
		setIsSubmitting(true);
		try {
			await onBookSlot({
				slot_datetime: selectedIso || card.slot_datetime,
				name: name.trim(),
				email: email.trim(),
				notes: card.requested_time ? `Requested: ${card.requested_time}` : void 0
			});
			setIsConfirmed(true);
		} catch (err) {
			setError(err?.message || "Unable to confirm booking. Please try another slot or check your email.");
		} finally {
			setIsSubmitting(false);
		}
	};
	if (isConfirmed) return /* @__PURE__ */ jsx("div", {
		className: "my-2 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-xl text-left animate-in fade-in",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 text-emerald-400",
			children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ jsxs("span", {
				className: "text-xs font-semibold font-mono",
				children: [
					"Session Confirmed for ",
					card.date_label,
					" at ",
					selectedTime,
					"!"
				]
			})]
		})
	});
	const formatHeaderTime = () => {
		if (!selectedIso) return `${card.date_label} at ${selectedTime}`;
		try {
			const d = new Date(selectedIso);
			if (isNaN(d.getTime())) return `${card.date_label} at ${selectedTime}`;
			const userLocale = navigator.language || "en-US";
			const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			return `${new Intl.DateTimeFormat(userLocale, {
				weekday: "short",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: true
			}).format(d)} (${userTz}) • ${selectedTime} UTC`;
		} catch {
			return `${card.date_label} at ${selectedTime}`;
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "my-2 p-3.5 rounded-2xl bg-[#151720] border border-[#00f5ff]/30 shadow-xl text-left",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "p-1.5 rounded-lg bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/30",
					children: /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-xs font-bold text-white tracking-tight",
					children: formatHeaderTime()
				}), /* @__PURE__ */ jsx("span", {
					className: "text-[10px] text-[#00f5ff] font-mono",
					children: "15-min Technical Intake Call"
				})] })]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-[11px] text-white/80 mb-2.5 leading-relaxed",
				children: card.message
			}),
			card.available_slots && card.available_slots.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "my-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-[10px] text-white/50 uppercase font-mono tracking-wider block",
					children: [
						"Available Times for ",
						card.date_label,
						":"
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-1.5",
					children: card.available_slots.map((slot) => {
						const isSelected = selectedTime === slot.time;
						return /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => {
								setSelectedTime(slot.time);
								setSelectedIso(slot.iso);
							},
							className: `px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${isSelected ? "bg-[#00f5ff] text-black font-bold shadow-md shadow-[#00f5ff]/20 scale-[1.02]" : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10"}`,
							children: slot.time
						}, slot.time);
					})
				})]
			}),
			error && /* @__PURE__ */ jsx("div", {
				className: "mb-3 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-mono",
				children: error
			}),
			showForm ? /* @__PURE__ */ jsxs("form", {
				onSubmit: handleConfirm,
				className: "space-y-2 mb-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/40" }), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Your Name",
							value: name,
							onChange: (e) => {
								setName(e.target.value);
								if (error) setError(null);
							},
							required: true,
							className: "w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#00f5ff]"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/40" }), /* @__PURE__ */ jsx("input", {
							type: "email",
							placeholder: "Work Email",
							value: email,
							onChange: (e) => {
								setEmail(e.target.value);
								if (error) setError(null);
							},
							required: true,
							className: "w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#00f5ff]"
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 pt-1",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: isSubmitting,
						className: "flex-1 py-2 px-3 rounded-xl bg-[#00f5ff] hover:bg-[#00d0db] disabled:opacity-50 text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00f5ff]/20",
						children: [isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsxs("span", { children: ["Confirm & Book ", selectedTime] })]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onShowAllTimes,
						className: "py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-all border border-white/10 cursor-pointer",
						children: "All Dates"
					})]
				})]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => handleConfirm(),
					disabled: isSubmitting,
					className: "flex-1 py-2 px-3 rounded-xl bg-[#00f5ff] hover:bg-[#00d0db] disabled:opacity-50 text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00f5ff]/20",
					children: [isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsxs("span", { children: ["Confirm ", selectedTime] })]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onShowAllTimes,
					className: "py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-all border border-white/10 cursor-pointer",
					children: "All Dates"
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Chat/BookingConfirmedCard.tsx
function BookingConfirmedCard({ card, onReschedule }) {
	const isRescheduled = Boolean(card.is_rescheduled);
	const formatLocalizedSlot = (slotDatetime, fallback) => {
		if (!slotDatetime) return {
			local: fallback || "",
			utc: ""
		};
		try {
			const d = new Date(slotDatetime);
			if (isNaN(d.getTime())) return {
				local: fallback || "",
				utc: ""
			};
			const userLocale = navigator.language || "en-US";
			const localString = new Intl.DateTimeFormat(userLocale, {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: true
			}).format(d);
			const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const utcString = new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
				timeZone: "UTC"
			}).format(d);
			return {
				local: `${localString} (${userTz})`,
				utc: `${utcString} UTC`
			};
		} catch {
			return {
				local: fallback || "",
				utc: ""
			};
		}
	};
	const slotDisplay = formatLocalizedSlot(card.slot_datetime, card.datetime_formatted);
	return /* @__PURE__ */ jsxs("div", {
		className: `my-2.5 p-4 rounded-2xl border shadow-xl backdrop-blur-md text-left transition-all ${isRescheduled ? "bg-accent/10 border-accent/40 shadow-accent/5" : "bg-[#00f5ff]/10 border-[#00f5ff]/40 shadow-[#00f5ff]/5"}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-2 mb-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: `p-1.5 rounded-lg text-black ${isRescheduled ? "bg-accent" : "bg-[#00f5ff]"}`,
						children: isRescheduled ? /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(CalendarCheck2, { className: "w-4 h-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
						className: "text-sm font-bold text-white tracking-tight",
						children: isRescheduled ? "Consultation Rescheduled" : "Consultation Confirmed"
					}), /* @__PURE__ */ jsx("span", {
						className: `text-[10px] font-mono uppercase tracking-wider ${isRescheduled ? "text-accent" : "text-[#00f5ff]"}`,
						children: "15-Min Technical Intake Call"
					})] })]
				}), /* @__PURE__ */ jsx("span", {
					className: `px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${isRescheduled ? "bg-accent/20 text-accent border border-accent/30" : "bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/30"}`,
					children: card.status || (isRescheduled ? "Rescheduled" : "Confirmed")
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-black/40 p-3 rounded-xl my-2 border border-white/5 space-y-1.5 text-xs font-mono",
				children: [
					isRescheduled && card.previous_datetime && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-white/50 text-[11px] pb-1 border-b border-white/5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] uppercase",
							children: "Previous Slot"
						}), /* @__PURE__ */ jsx("span", {
							className: "line-through",
							children: card.previous_datetime
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between text-white/70 gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-white/40 text-[10px] uppercase shrink-0 pt-0.5",
							children: "Slot"
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-right",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-white block",
								children: slotDisplay.local
							}), slotDisplay.utc && /* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-white/50 block font-mono",
								children: slotDisplay.utc
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-white/70",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-white/40 text-[10px] uppercase",
							children: "Invitee"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-white",
							children: [
								card.client_name,
								" (",
								card.email,
								")"
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-[11px] text-white/70 flex items-start gap-1.5 mt-2",
				children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-[#00f5ff] shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("span", { children: card.meeting_link_note || "Calendar invite and Google Meet link sent to your inbox." })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] font-mono text-white/50",
					children: "Need a different time?"
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => onReschedule?.(card.consultation_id),
					className: "py-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer",
					children: [/* @__PURE__ */ jsx(CalendarClock, { className: "w-3.5 h-3.5 text-[#00f5ff]" }), /* @__PURE__ */ jsx("span", { children: "Reschedule Slot" })]
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Chat/ServiceCatalogCard.tsx
function ServiceCatalogCard({ card, onSendPrompt }) {
	const [expandedSlug, setExpandedSlug] = useState(null);
	const getServiceIcon = (iconName, slug) => {
		if (slug?.includes("mannequin") || iconName === "Shirt") return /* @__PURE__ */ jsx(Shirt, { className: "w-4 h-4" });
		if (slug?.includes("background") || iconName === "Scissors") return /* @__PURE__ */ jsx(Scissors, { className: "w-4 h-4" });
		if (slug?.includes("model") || iconName === "Sparkles") return /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" });
		if (slug?.includes("jewelry") || iconName === "Gem") return /* @__PURE__ */ jsx(Gem, { className: "w-4 h-4" });
		if (slug?.includes("3d") || iconName === "Box") return /* @__PURE__ */ jsx(Box, { className: "w-4 h-4" });
		if (slug?.includes("dtp") || iconName === "FileSpreadsheet") return /* @__PURE__ */ jsx(FileSpreadsheet, { className: "w-4 h-4" });
		return /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4" });
	};
	if (card.type === "service_detail_card") {
		const accentColor = card.accent_color || "#00f5ff";
		return /* @__PURE__ */ jsxs("div", {
			className: "my-2.5 p-4 rounded-2xl bg-[#12141a]/95 border border-[#00f5ff]/30 shadow-2xl backdrop-blur-md text-left space-y-3",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-3 border-b border-white/10 pb-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "p-2 rounded-xl text-black flex items-center justify-center font-bold",
							style: { backgroundColor: accentColor },
							children: getServiceIcon(card.icon, card.slug)
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono uppercase tracking-wider text-[#00f5ff] block",
							children: "Technical Specification"
						}), /* @__PURE__ */ jsx("h4", {
							className: "text-sm font-bold text-white tracking-tight",
							children: card.title
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-right",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-mono font-bold text-accent block",
							children: card.starting_rate
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-[10px] text-white/50 font-mono flex items-center gap-1 justify-end",
							children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }), card.turnaround]
						})]
					})]
				}),
				card.description && /* @__PURE__ */ jsx("p", {
					className: "text-xs text-white/70 leading-relaxed",
					children: card.description
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono",
					children: [card.features && card.features.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-accent uppercase tracking-wider block font-bold",
							children: "Key Highlights"
						}), card.features.map((feat, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-1.5 text-white/80 text-[11px]",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("span", { children: feat })]
						}, i))]
					}), card.deliverables && card.deliverables.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-[#00f5ff] uppercase tracking-wider block font-bold",
							children: "Master Deliverables"
						}), card.deliverables.map((deliv, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-1.5 text-white/80 text-[11px]",
							children: [/* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3 text-[#00f5ff] shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("span", { children: deliv })]
						}, i))]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 pt-1",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => onSendPrompt?.(`Calculate volume price for ${card.title}`),
						className: "flex-1 py-2 px-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer",
						children: [/* @__PURE__ */ jsx(Calculator, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Get Instant Quote" })]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => onSendPrompt?.(`Book technical intake call for ${card.title}`),
						className: "py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-[#00f5ff]" }), /* @__PURE__ */ jsx("span", { children: "Book Call" })]
					})]
				})
			]
		});
	}
	const services = card.services || [];
	return /* @__PURE__ */ jsxs("div", {
		className: "my-2.5 p-3.5 sm:p-4 rounded-2xl bg-[#12141a]/95 border border-white/15 shadow-2xl backdrop-blur-md text-left space-y-3",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between border-b border-white/10 pb-2.5",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "p-1.5 rounded-lg bg-accent/15 text-accent",
						children: /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
						className: "text-sm font-bold text-white tracking-tight",
						children: card.title || "Studio Production Services"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[10px] text-white/50 font-mono",
						children: card.subtitle || "Senior human retouchers • 100% Pen Tool precision"
					})] })]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "space-y-2",
				children: services.map((s) => {
					const isExpanded = expandedSlug === s.slug;
					return /* @__PURE__ */ jsxs("div", {
						className: `rounded-xl border transition-all ${isExpanded ? "bg-white/8 border-[#00f5ff]/40 shadow-lg" : "bg-white/4 border-white/5 hover:border-white/15"}`,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-2.5 flex items-center justify-between gap-2.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-black font-bold",
									style: { backgroundColor: s.accent_color || "#f5a623" },
									children: getServiceIcon(s.icon, s.slug)
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-xs font-bold text-white truncate",
										children: s.title
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-[10px] text-white/60 truncate font-mono",
										children: [
											s.starting_rate,
											" • ",
											s.turnaround
										]
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 shrink-0",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setExpandedSlug(isExpanded ? null : s.slug),
									className: "py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/70 hover:text-white font-mono flex items-center gap-1 transition-colors cursor-pointer",
									title: isExpanded ? "Collapse" : "View Specs",
									children: [/* @__PURE__ */ jsx("span", { children: isExpanded ? "Less" : "Specs" }), isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-3 h-3" })]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => onSendPrompt?.(`Get quote for ${s.title}`),
									className: "py-1 px-2 rounded-lg bg-accent hover:bg-accent-hover text-black text-[11px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer",
									children: [/* @__PURE__ */ jsx("span", { children: "Quote" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })]
								})]
							})]
						}), isExpanded && /* @__PURE__ */ jsxs("div", {
							className: "px-3 pb-3 pt-1 border-t border-white/10 space-y-2 animate-in fade-in duration-200",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-white/75",
									children: s.subtitle
								}),
								s.features && s.features.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[9px] font-mono uppercase tracking-wider text-accent font-semibold",
										children: "Technical Highlights"
									}), /* @__PURE__ */ jsx("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-white/80 font-mono",
										children: s.features.map((f, fIdx) => /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent" }), /* @__PURE__ */ jsx("span", { children: f })]
										}, fIdx))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-2 flex items-center gap-2",
									children: [/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => onSendPrompt?.(`Book technical call for ${s.title}`),
										className: "py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-mono flex items-center gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3 text-[#00f5ff]" }), /* @__PURE__ */ jsx("span", { children: "Schedule Call" })]
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => onSendPrompt?.(`Tell me about ${s.title} deliverables and formats`),
										className: "text-[11px] text-[#00f5ff] hover:underline font-mono py-1 px-2",
										children: "View Full SLA & Formats →"
									})]
								})
							]
						})]
					}, s.id || s.slug);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "p-2.5 rounded-xl bg-accent/10 border border-accent/25 flex items-center gap-2 text-[11px] font-mono text-white/80",
				children: [/* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", { children: card.trial_banner || "All services include 3 Free Sample Edits with zero upfront billing." })]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Chat/TrialQuotaExhaustedCard.tsx
function TrialQuotaExhaustedCard({ card, onSendPrompt }) {
	const services = card.services || [
		{
			name: "Clipping Path / Background Removal",
			rate: "$0.49 / image"
		},
		{
			name: "Multi-Path Vector Masking",
			rate: "$1.25 / image"
		},
		{
			name: "Ghost Mannequin / Invisible Symmetry",
			rate: "$0.99 / image"
		},
		{
			name: "High-End E-Commerce Retouching",
			rate: "$1.49 / image"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "my-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-2xl backdrop-blur-md text-left space-y-3.5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-2 border-b border-white/10 pb-2.5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "p-1.5 rounded-lg bg-amber-400 text-black",
						children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
						className: "text-sm font-bold text-white tracking-tight",
						children: card.title || "Free Trial Quota Limit Reached"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-amber-300 font-mono uppercase tracking-wider block",
						children: "Trial Credit Previously Claimed"
					})] })]
				}), /* @__PURE__ */ jsx("span", {
					className: "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0",
					children: "Standard Rates Apply"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-white/90 leading-relaxed",
					children: card.message || "You have already redeemed your 100% Free Trial sample quota under this email address. Free trials are limited to one trial batch per client / studio."
				}), card.client_email && /* @__PURE__ */ jsxs("div", {
					className: "text-[11px] text-white/50 pt-1",
					children: ["Registered Email: ", /* @__PURE__ */ jsx("span", {
						className: "text-[#00f5ff] font-semibold",
						children: card.client_email
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] font-mono uppercase tracking-widest text-white/40 block font-semibold",
					children: "Standard Studio Production Pricing"
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 gap-1.5",
					children: services.map((svc, idx) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs font-mono",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-neutral-300 text-[11px]",
							children: svc.name
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-accent text-xs",
							children: svc.rate
						})]
					}, idx))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pt-1 flex flex-col sm:flex-row gap-2",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => onSendPrompt?.("Schedule 15-Min Technical Call"),
					className: "flex-1 py-2 px-3 rounded-xl bg-[#00f5ff] hover:bg-[#00d8e6] text-black font-semibold text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-md",
					children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Book Technical Call" })]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => onSendPrompt?.("Show Pricing Calculator"),
					className: "flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/10",
					children: [/* @__PURE__ */ jsx(Calculator, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Volume Calculator" })]
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Chat/FreeTrialConfirmedCard.tsx
function FreeTrialConfirmedCard({ card, onSendPrompt }) {
	const imagesCount = card.images_count || 1;
	const [email, setEmail] = useState("");
	const [confirmedEmail, setConfirmedEmail] = useState(card.client_email || null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [quotaExceeded, setQuotaExceeded] = useState(false);
	const [quotaMessage, setQuotaMessage] = useState(null);
	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		if (!email.trim() || !email.includes("@")) {
			setError("Please provide a valid email address.");
			return;
		}
		setError(null);
		setIsSubmitting(true);
		try {
			const res = await fetch("/api/chat/lead", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest"
				},
				body: JSON.stringify({ email: email.trim() })
			});
			const data = await res.json();
			if (data.quota_exceeded) {
				setQuotaExceeded(true);
				setQuotaMessage(data.message);
				setConfirmedEmail(email.trim());
				return;
			}
			if (!res.ok) throw new Error(data.message || "Unable to save email");
			setConfirmedEmail(email.trim());
			onSendPrompt?.(`My email is ${email.trim()}`);
		} catch (err) {
			setError(err?.message || "Failed to link email. You can also type it in chat.");
		} finally {
			setIsSubmitting(false);
		}
	};
	if (quotaExceeded) return /* @__PURE__ */ jsx(TrialQuotaExhaustedCard, {
		card: {
			title: "Free Trial Quota Limit Reached",
			client_email: confirmedEmail || email,
			message: quotaMessage || void 0
		},
		onSendPrompt
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "my-2.5 p-4 rounded-2xl bg-accent/10 border border-accent/40 shadow-2xl backdrop-blur-md text-left space-y-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-2 border-b border-white/10 pb-2.5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "p-1.5 rounded-lg bg-accent text-black",
						children: /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
						className: "text-sm font-bold text-white tracking-tight",
						children: card.title || "100% Free Trial Activated"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-accent font-mono uppercase tracking-wider block",
						children: "Zero Cost • No Credit Card Required"
					})] })]
				}), /* @__PURE__ */ jsx("span", {
					className: "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30 shrink-0",
					children: card.status || "In Production Queue"
				})]
			}),
			card.images && card.images.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2 overflow-x-auto py-1",
				children: card.images.map((imgUrl, i) => /* @__PURE__ */ jsxs("div", {
					className: "relative w-14 h-14 rounded-xl overflow-hidden border border-white/15 bg-black/40 shrink-0 group",
					children: [/* @__PURE__ */ jsx("img", {
						src: imgUrl,
						alt: `Sample ${i + 1}`,
						className: "w-full h-full object-cover"
					}), /* @__PURE__ */ jsxs("span", {
						className: "absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono text-white/70 px-1 rounded-tl",
						children: ["#", i + 1]
					})]
				}, i))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-black/40 p-3 rounded-xl border border-white/5 space-y-2 text-xs font-mono",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-white/70",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-white/40 text-[10px] uppercase",
							children: "Sample Batch"
						}), /* @__PURE__ */ jsxs("span", {
							className: "font-semibold text-white",
							children: [
								imagesCount,
								" ",
								imagesCount === 1 ? "image" : "images",
								" submitted (",
								imagesCount,
								" of 3 free trial quota)"
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-white/70",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-white/40 text-[10px] uppercase",
							children: "Total Billing"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-accent text-sm",
							children: "$0.00 USD (FREE)"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-white/70",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-white/40 text-[10px] uppercase",
							children: "Turnaround SLA"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-white flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-[#00f5ff]" }), card.turnaround || "Sub-12 Hours Rapid SLA"]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-1 text-[11px] font-mono text-white/80",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[9px] uppercase tracking-wider text-white/40 font-bold block",
					children: "What You Will Receive"
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 text-white/80",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", { children: "100% Hand-Drawn Pen Tool Vector Clipping Paths" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 text-white/80",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Layered Master PSD with Clipping Mask & Alpha Channel" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 text-white/80",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", { children: "High-Resolution Transparent Web PNG" })]
						})
					]
				})]
			}),
			confirmedEmail ? /* @__PURE__ */ jsxs("div", {
				className: "p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-white/90 font-mono",
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-accent shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] text-white/40 uppercase block",
					children: "Delivery Destination"
				}), /* @__PURE__ */ jsx("span", {
					className: "text-[#00f5ff] font-semibold",
					children: confirmedEmail
				})] })]
			}) : /* @__PURE__ */ jsxs("form", {
				onSubmit: handleEmailSubmit,
				className: "p-3 rounded-xl bg-black/40 border border-[#00f5ff]/30 space-y-2 animate-in fade-in",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 text-xs text-[#00f5ff] font-mono",
						children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", {
							className: "font-semibold",
							children: "Where should we deliver your retouched master files?"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx("input", {
							type: "email",
							required: true,
							placeholder: "Enter your email (e.g. alex@brand.com)",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff]"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: isSubmitting,
							className: "py-1.5 px-3 rounded-lg bg-[#00f5ff] hover:bg-[#00d8e6] text-black font-semibold text-xs font-mono whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50",
							children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Saving..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "Confirm" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })] })
						})]
					}),
					error && /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-red-400 font-mono",
						children: error
					})
				]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Chat/OrderConfirmedCard.tsx
function OrderConfirmedCard({ card, onSendPrompt, onUploadClick }) {
	const orderNumber = card.order_number || "CE-ORD-NEW";
	const quantity = card.quantity || 1;
	const uploadedCount = card.uploaded_count || 0;
	const remainingCount = card.remaining_count ?? Math.max(0, quantity - uploadedCount);
	const discrepancyStatus = card.cloud_link ? "complete" : card.discrepancy_status || (uploadedCount < quantity ? "under" : uploadedCount > quantity ? "over" : "complete");
	const [email, setEmail] = useState("");
	const [confirmedEmail, setConfirmedEmail] = useState(card.client_email && !card.client_email.includes("temp.local") ? card.client_email : null);
	const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
	const [emailError, setEmailError] = useState(null);
	const [cloudLinkInput, setCloudLinkInput] = useState("");
	const [confirmedCloudLink, setConfirmedCloudLink] = useState(card.cloud_link || null);
	const [showCloudInput, setShowCloudInput] = useState(false);
	const [isSubmittingCloud, setIsSubmittingCloud] = useState(false);
	const [cloudError, setCloudError] = useState(null);
	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		if (!email.trim() || !email.includes("@")) {
			setEmailError("Please enter a valid email address.");
			return;
		}
		setEmailError(null);
		setIsSubmittingEmail(true);
		try {
			const res = await fetch("/api/chat/lead", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest"
				},
				body: JSON.stringify({ email: email.trim() })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Unable to save email");
			setConfirmedEmail(email.trim());
			onSendPrompt?.(`My email is ${email.trim()}`);
		} catch (err) {
			setEmailError(err?.message || "Failed to link email. You can also type it in chat.");
		} finally {
			setIsSubmittingEmail(false);
		}
	};
	const handleCloudLinkSubmit = async (e) => {
		e.preventDefault();
		const trimmed = cloudLinkInput.trim();
		if (!trimmed || !trimmed.startsWith("http")) {
			setCloudError("Please enter a valid URL (e.g. https://drive.google.com/...)");
			return;
		}
		setCloudError(null);
		setIsSubmittingCloud(true);
		try {
			const res = await fetch("/api/chat/cloud-link", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest"
				},
				body: JSON.stringify({ link: trimmed })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Unable to link cloud storage");
			setConfirmedCloudLink(trimmed);
			setShowCloudInput(false);
			onSendPrompt?.(`Here is my drive folder: ${trimmed}`);
		} catch (err) {
			setCloudError(err?.message || "Failed to save link. You can also paste it directly in chat.");
		} finally {
			setIsSubmittingCloud(false);
		}
	};
	const progressPercent = confirmedCloudLink ? 100 : Math.min(100, Math.round(uploadedCount / Math.max(1, quantity) * 100));
	return /* @__PURE__ */ jsxs("div", {
		className: "my-2.5 p-4 rounded-2xl bg-[#12141c]/95 border border-accent/40 shadow-2xl backdrop-blur-md text-left space-y-3.5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-2 border-b border-white/10 pb-2.5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "p-1.5 rounded-lg bg-accent text-black",
						children: /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("h4", {
							className: "text-sm font-bold text-white tracking-tight font-mono",
							children: orderNumber
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 font-semibold",
							children: "Queued"
						})]
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[11px] text-white/60",
						children: [
							card.service_name || "Commercial Retouching",
							" • ",
							/* @__PURE__ */ jsx("span", {
								className: "capitalize",
								children: card.complexity || "Simple"
							})
						]
					})] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-right shrink-0",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-sm font-bold text-accent font-mono block",
						children: ["$", card.total_price || "0.00"]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-white/50 font-mono",
						children: card.unit_price ? `$${card.unit_price}/img` : "USD"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl p-3 bg-white/[0.03] border border-white/10 space-y-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-xs font-mono",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-white/60 text-[11px]",
							children: "Upload Validation:"
						}), confirmedCloudLink ? /* @__PURE__ */ jsxs("span", {
							className: "text-purple-300 font-bold flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Folder, { className: "w-3.5 h-3.5" }), "Drive Folder Linked"]
						}) : discrepancyStatus === "under" ? /* @__PURE__ */ jsxs("span", {
							className: "text-amber-400 font-bold flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(AlertTriangle, { className: "w-3.5 h-3.5" }),
								uploadedCount,
								" of ",
								quantity,
								" files (",
								remainingCount,
								" pending)"
							]
						}) : discrepancyStatus === "over" ? /* @__PURE__ */ jsxs("span", {
							className: "text-cyan-400 font-bold flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
								uploadedCount,
								" files (Batch Expanded)"
							]
						}) : /* @__PURE__ */ jsxs("span", {
							className: "text-accent font-bold flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }),
								"All ",
								quantity,
								" files uploaded"
							]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "w-full bg-white/10 rounded-full h-1.5 overflow-hidden",
						children: /* @__PURE__ */ jsx("div", {
							className: `h-full transition-all duration-500 rounded-full ${confirmedCloudLink ? "bg-purple-400" : discrepancyStatus === "under" ? "bg-amber-400" : "bg-accent"}`,
							style: { width: `${progressPercent}%` }
						})
					}),
					!confirmedCloudLink && discrepancyStatus === "under" && /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row gap-1.5 pt-1",
						children: [onUploadClick && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: onUploadClick,
							className: "flex-1 py-1.5 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer",
							children: [/* @__PURE__ */ jsx(UploadCloud, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsxs("span", { children: [
								"Upload (",
								remainingCount,
								" left)"
							] })]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setShowCloudInput(!showCloudInput),
							className: "py-1.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer",
							children: [/* @__PURE__ */ jsx(Folder, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Share Drive Link" })]
						})]
					})
				]
			}),
			confirmedCloudLink ? /* @__PURE__ */ jsxs("div", {
				className: "p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [/* @__PURE__ */ jsx(Folder, { className: "w-4 h-4 text-purple-400 shrink-0" }), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono text-purple-300 block uppercase tracking-wider font-semibold",
							children: "Cloud Drive Folder"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono text-white/90 truncate block",
							children: confirmedCloudLink
						})]
					})]
				}), /* @__PURE__ */ jsxs("a", {
					href: confirmedCloudLink,
					target: "_blank",
					rel: "noreferrer",
					className: "px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-mono text-xs font-medium flex items-center gap-1 shrink-0 transition-colors",
					children: [/* @__PURE__ */ jsx("span", { children: "Open" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
				})]
			}) : showCloudInput ? /* @__PURE__ */ jsxs("form", {
				onSubmit: handleCloudLinkSubmit,
				className: "p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2 animate-in fade-in",
				children: [
					/* @__PURE__ */ jsx("label", {
						className: "text-[11px] text-purple-200 block font-mono",
						children: "Paste Google Drive, Dropbox, or WeTransfer link:"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-1.5",
						children: [/* @__PURE__ */ jsx("input", {
							type: "url",
							value: cloudLinkInput,
							onChange: (e) => setCloudLinkInput(e.target.value),
							placeholder: "https://drive.google.com/drive/folders/...",
							disabled: isSubmittingCloud,
							className: "flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-purple-400/30 text-white placeholder-white/30 text-xs focus:outline-none focus:border-purple-400 transition-colors font-mono"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: isSubmittingCloud || !cloudLinkInput.trim(),
							className: "px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-40 text-white font-semibold text-xs font-mono flex items-center gap-1 transition-all cursor-pointer shrink-0",
							children: isSubmittingCloud ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx("span", { children: "Attach" })
						})]
					}),
					cloudError && /* @__PURE__ */ jsx("p", {
						className: "text-[10px] text-red-400 font-mono",
						children: cloudError
					})
				]
			}) : null,
			card.images && card.images.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between mb-1.5",
				children: /* @__PURE__ */ jsxs("span", {
					className: "text-[11px] text-white/50 font-mono flex items-center gap-1",
					children: [
						/* @__PURE__ */ jsx(Image, { className: "w-3 h-3 text-accent" }),
						"Received Files (",
						card.images.length,
						"):"
					]
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin",
				children: [card.images.slice(0, 8).map((imgUrl, i) => /* @__PURE__ */ jsx("a", {
					href: imgUrl,
					target: "_blank",
					rel: "noreferrer",
					className: "relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black/40 shrink-0 hover:border-accent transition-colors",
					children: /* @__PURE__ */ jsx("img", {
						src: imgUrl,
						alt: `File ${i + 1}`,
						className: "w-full h-full object-cover"
					})
				}, i)), card.images.length > 8 && /* @__PURE__ */ jsxs("div", {
					className: "w-12 h-12 rounded-lg border border-white/10 bg-white/5 shrink-0 flex items-center justify-center text-[10px] font-mono text-white/70",
					children: ["+", card.images.length - 8]
				})]
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "pt-2 border-t border-white/10",
				children: confirmedEmail ? /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 p-2 rounded-xl bg-accent/10 border border-accent/30 text-xs text-white",
					children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-accent shrink-0" }), /* @__PURE__ */ jsxs("span", {
						className: "truncate",
						children: ["Files & invoice will be sent to: ", /* @__PURE__ */ jsx("strong", {
							className: "text-accent",
							children: confirmedEmail
						})]
					})]
				}) : /* @__PURE__ */ jsxs("form", {
					onSubmit: handleEmailSubmit,
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "text-[11px] text-white/70 block",
							children: "Where should we email your completed files and invoice?"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-1.5",
							children: [/* @__PURE__ */ jsx("input", {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "name@company.com",
								disabled: isSubmittingEmail,
								className: "flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/30 text-xs focus:outline-none focus:border-accent transition-colors font-mono"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: isSubmittingEmail || !email.trim(),
								className: "px-3 py-1.5 rounded-xl bg-accent hover:bg-[#b8dd00] disabled:opacity-40 text-black font-semibold text-xs font-mono flex items-center gap-1 transition-all cursor-pointer shrink-0",
								children: isSubmittingEmail ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "Save" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })] })
							})]
						}),
						emailError && /* @__PURE__ */ jsx("p", {
							className: "text-[10px] text-red-400 font-mono",
							children: emailError
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between text-[10px] font-mono text-white/50 pt-1",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-accent" }), card.turnaround || "24h Standard Turnaround"]
				}), /* @__PURE__ */ jsx("span", { children: "Max 25MB/img (Or Cloud Drive)" })]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Chat/ChatWidget.tsx
function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [sessionId, setSessionId] = useState(null);
	const [chatMode, setChatMode] = useState("bot");
	const [operatorName, setOperatorName] = useState(null);
	const [needsHuman, setNeedsHuman] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isTypingVisible, setIsTypingVisible] = useState(false);
	const [typingPhase, setTypingPhase] = useState("analyzing");
	const [isResetting, setIsResetting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const [nudgeMessage, setNudgeMessage] = useState(null);
	const [showNudgeBubble, setShowNudgeBubble] = useState(false);
	const [showQuickMenu, setShowQuickMenu] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);
	const messagesEndRef = useRef(null);
	const scrollContainerRef = useRef(null);
	const fileInputRef = useRef(null);
	const lastActivityRef = useRef(Date.now());
	useEffect(() => {
		const el = scrollContainerRef.current;
		if (!el) return;
		const stopScrollPropagation = (e) => {
			e.stopPropagation();
		};
		el.addEventListener("wheel", stopScrollPropagation, { passive: false });
		el.addEventListener("touchmove", stopScrollPropagation, { passive: false });
		return () => {
			el.removeEventListener("wheel", stopScrollPropagation);
			el.removeEventListener("touchmove", stopScrollPropagation);
		};
	}, [isOpen]);
	const initSession = (force = false) => {
		if (isResetting) return;
		const storedSession = localStorage.getItem("ce_chat_session_id");
		if (!storedSession && !force) return;
		fetch("/api/chat/session", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				...storedSession ? { "X-Chat-Session-Id": storedSession } : {}
			},
			body: JSON.stringify({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
		}).then((res) => res.json()).then((data) => {
			if (data.session_id) {
				setSessionId(data.session_id);
				localStorage.setItem("ce_chat_session_id", data.session_id);
			}
			if (data.mode) setChatMode(data.mode);
			if (data.operator_name !== void 0) setOperatorName(data.operator_name);
			if (data.needs_human !== void 0) setNeedsHuman(Boolean(data.needs_human));
			if (data.messages && Array.isArray(data.messages)) setMessages(data.messages);
		}).catch((err) => console.error("Chat init error:", err));
	};
	useEffect(() => {
		if (localStorage.getItem("ce_chat_session_id")) initSession(false);
	}, []);
	useEffect(() => {
		if (isOpen && !sessionId && !isResetting) initSession(true);
	}, [
		isOpen,
		sessionId,
		isResetting
	]);
	const scrollToBottom = (behavior = "smooth") => {
		if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({
			top: scrollContainerRef.current.scrollHeight,
			behavior
		});
	};
	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				scrollToBottom("smooth");
			}, 60);
			setUnreadCount(0);
			setShowNudgeBubble(false);
			return () => clearTimeout(timer);
		}
	}, [
		messages,
		isOpen,
		isTypingVisible
	]);
	const playNotificationChime = () => {
		try {
			const AudioContextClass = window.AudioContext || window.webkitAudioContext;
			if (!AudioContextClass) return;
			const audioCtx = new AudioContextClass();
			const osc = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + .15);
			gain.gain.setValueAtTime(.08, audioCtx.currentTime);
			gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + .35);
			osc.connect(gain);
			gain.connect(audioCtx.destination);
			osc.start();
			osc.stop(audioCtx.currentTime + .35);
		} catch {}
	};
	useEffect(() => {
		if (!sessionId) return;
		const pollInterval = setInterval(async () => {
			if (isLoading) return;
			try {
				const highestId = messages.reduce((max, m) => {
					const num = typeof m.id === "number" ? m.id : parseInt(String(m.id), 10);
					return !isNaN(num) && String(m.id).indexOf("user-") === -1 && num > max ? num : max;
				}, 0);
				const data = await (await fetch(`/api/chat/poll?after_id=${highestId}`, { headers: {
					"X-Chat-Session-Id": sessionId,
					"X-Requested-With": "XMLHttpRequest"
				} })).json();
				if (data.mode) setChatMode(data.mode);
				if (data.operator_name !== void 0) setOperatorName(data.operator_name);
				if (data.needs_human !== void 0) setNeedsHuman(Boolean(data.needs_human));
				if (data.messages && data.messages.length > 0) setMessages((prev) => {
					let updated = [...prev];
					let hasChanges = false;
					const brandNew = [];
					data.messages.forEach((m) => {
						const strId = String(m.id);
						if (updated.some((p) => String(p.id) === strId)) return;
						if (m.sender === "user") {
							const optIndex = updated.findIndex((p) => String(p.id).startsWith("user-") && p.content.trim() === m.content.trim());
							if (optIndex !== -1) {
								updated[optIndex] = {
									...updated[optIndex],
									id: m.id
								};
								hasChanges = true;
								return;
							}
							if (updated.some((p) => p.sender === "user" && p.content.trim() === m.content.trim())) return;
						}
						brandNew.push(m);
						updated.push(m);
						hasChanges = true;
					});
					if (!hasChanges) return prev;
					if (brandNew.some((m) => m.sender === "operator")) playNotificationChime();
					if (!isOpen && brandNew.length > 0) {
						setUnreadCount((c) => c + brandNew.length);
						setNudgeMessage(brandNew[brandNew.length - 1].content);
						setShowNudgeBubble(true);
					}
					return updated;
				});
			} catch {}
		}, 2500);
		return () => clearInterval(pollInterval);
	}, [
		sessionId,
		messages,
		isOpen,
		isLoading
	]);
	useEffect(() => {
		if (!isLoading) {
			setIsTypingVisible(false);
			setTypingPhase("analyzing");
			return;
		}
		const timer = setTimeout(() => {
			setIsTypingVisible(true);
		}, 700);
		const phase2Timer = setTimeout(() => {
			setTypingPhase("checking");
		}, 3500);
		const phase3Timer = setTimeout(() => {
			setTypingPhase("composing");
		}, 8500);
		return () => {
			clearTimeout(timer);
			clearTimeout(phase2Timer);
			clearTimeout(phase3Timer);
		};
	}, [isLoading]);
	useEffect(() => {
		const updateActivity = () => {
			lastActivityRef.current = Date.now();
		};
		window.addEventListener("mousemove", updateActivity);
		window.addEventListener("keydown", updateActivity);
		window.addEventListener("scroll", updateActivity);
		const interval = setInterval(() => {
			if (Date.now() - lastActivityRef.current > 9e4 && sessionId && messages.length > 0) fetch("/api/chat/inactivity-check", { headers: {
				"X-Chat-Session-Id": sessionId,
				"X-Requested-With": "XMLHttpRequest"
			} }).then((res) => res.json()).then((data) => {
				if (data.nudge) {
					setMessages((prev) => [...prev, data.nudge]);
					setNudgeMessage(data.nudge.content);
					if (!isOpen) {
						setShowNudgeBubble(true);
						setUnreadCount((c) => c + 1);
					}
				}
			}).catch(() => {});
		}, 3e4);
		return () => {
			window.removeEventListener("mousemove", updateActivity);
			window.removeEventListener("keydown", updateActivity);
			window.removeEventListener("scroll", updateActivity);
			clearInterval(interval);
		};
	}, [sessionId, isOpen]);
	const handleSendMessage = async (textToSend) => {
		const text = (textToSend || inputText).trim();
		if (!text || isLoading) return;
		setShowQuickMenu(false);
		if ([
			"/reset",
			"/clear",
			"reset",
			"clear"
		].includes(text.toLowerCase())) {
			handleResetChat();
			return;
		}
		const optimisticId = `user-${Date.now()}`;
		const newMsg = {
			id: optimisticId,
			sender: "user",
			content: text,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		setMessages((prev) => [...prev, newMsg]);
		setInputText("");
		setIsLoading(true);
		const startTime = Date.now();
		try {
			const data = await (await fetch("/api/chat/message", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					...sessionId ? { "X-Chat-Session-Id": sessionId } : {}
				},
				body: JSON.stringify({
					message: text,
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
				})
			})).json();
			if (data.session_id) {
				setSessionId(data.session_id);
				localStorage.setItem("ce_chat_session_id", data.session_id);
			}
			if (data.mode) setChatMode(data.mode);
			if (data.operator_name !== void 0) setOperatorName(data.operator_name);
			if (data.needs_human !== void 0) setNeedsHuman(Boolean(data.needs_human));
			const elapsed = Date.now() - startTime;
			const targetDelay = Math.max(0, 600 - elapsed);
			if (targetDelay > 0) await new Promise((resolve) => setTimeout(resolve, targetDelay));
			setMessages((prev) => {
				let updated = prev.map((m) => m.id === optimisticId ? {
					...m,
					id: data.user_message_id || m.id
				} : m);
				if (data.message && data.message.sender !== "user" && !updated.some((m) => String(m.id) === String(data.message.id))) updated.push(data.message);
				return updated;
			});
		} catch (err) {
			console.error("Error sending message:", err);
			setMessages((prev) => [...prev, {
				id: `error-${Date.now()}`,
				sender: "assistant",
				content: "I had a brief connection glitch. Please choose one of the options below or ask again!",
				suggested_replies: [
					"Calculate Pricing",
					"Schedule a Call",
					"Claim 3 Free Edits"
				]
			}]);
		} finally {
			setIsLoading(false);
		}
	};
	const MAX_FILE_SIZE_BYTES = 26214400;
	const uploadFiles = async (files) => {
		if (files.length === 0) return;
		const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
		const validFiles = files.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);
		if (oversizedFiles.length > 0) {
			const oversizedNames = oversizedFiles.map((f) => `${f.name} (${(f.size / 1048576).toFixed(1)}MB)`).join(", ");
			setMessages((prev) => [...prev, {
				id: Date.now() + Math.random(),
				sender: "assistant",
				content: `⚠️ **File Size Limit Notice:**\n\n${oversizedFiles.length === 1 ? "This file" : "These files"} exceed our 25MB direct upload limit:\n*${oversizedNames}*\n\n📁 **For large RAW, PSD, TIFF, or batch archives**, please share a **Google Drive, Dropbox, or WeTransfer link** right here in chat! Our retouchers will download directly from your cloud folder.`,
				suggested_replies: [
					"How do I share a Google Drive link?",
					"Calculate Pricing First",
					"Schedule Consultation Call"
				],
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			}]);
		}
		if (validFiles.length === 0) {
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}
		setIsUploading(true);
		try {
			const uploadedUrls = [];
			const base64List = [];
			let lastFileName = "";
			for (const file of validFiles) {
				const formData = new FormData();
				formData.append("file", file);
				const uploadRes = await fetch("/api/chat/upload", {
					method: "POST",
					headers: {
						"X-Requested-With": "XMLHttpRequest",
						...sessionId ? { "X-Chat-Session-Id": sessionId } : {}
					},
					body: formData
				});
				const uploadData = await uploadRes.json();
				if (uploadRes.ok && uploadData.url) {
					uploadedUrls.push(uploadData.url);
					if (uploadData.base64) base64List.push(uploadData.base64);
					lastFileName = uploadData.filename;
				} else if (uploadData.error) setMessages((prev) => [...prev, {
					id: Date.now() + Math.random(),
					sender: "assistant",
					content: `⚠️ ${uploadData.error}`,
					suggested_replies: ["Share Google Drive Link", "Schedule Consultation Call"],
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				}]);
			}
			if (uploadedUrls.length > 0) {
				const msgText = uploadedUrls.length === 1 ? `Uploaded sample image: ${lastFileName}` : `Uploaded batch of ${uploadedUrls.length} images for editing`;
				const data = await (await fetch("/api/chat/message", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
						...sessionId ? { "X-Chat-Session-Id": sessionId } : {}
					},
					body: JSON.stringify({
						message: msgText,
						attachments: uploadedUrls,
						images_base64: base64List
					})
				})).json();
				if (data.message) setMessages((prev) => [...prev, data.message]);
			}
		} catch (err) {
			console.error("Upload error:", err);
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const handleFileInputChange = (e) => {
		const files = Array.from(e.target.files || []);
		uploadFiles(files);
	};
	const handleBookSlot = async (bookingData) => {
		const payload = {
			...bookingData,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
		};
		const res = await fetch("/api/chat/book-slot", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				...sessionId ? { "X-Chat-Session-Id": sessionId } : {}
			},
			body: JSON.stringify(payload)
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data.message || "Unable to confirm booking");
		if (data.message) setMessages((prev) => [...prev, data.message]);
	};
	const handleResetChat = async () => {
		setIsResetting(true);
		try {
			const data = await (await fetch("/api/chat/reset", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					...sessionId ? { "X-Chat-Session-Id": sessionId } : {}
				}
			})).json();
			if (data.session_id) {
				setSessionId(data.session_id);
				localStorage.setItem("ce_chat_session_id", data.session_id);
			}
			if (data.messages && Array.isArray(data.messages)) setMessages(data.messages);
			setInputText("");
			setShowQuickMenu(false);
		} catch (err) {
			console.error("Reset error:", err);
		} finally {
			setIsResetting(false);
		}
	};
	const handleEditUserMessage = (msgId, text, index) => {
		setInputText(text);
		setMessages((prev) => prev.slice(0, index));
	};
	const handleDeleteUserMessage = (msgId, index) => {
		setMessages((prev) => prev.filter((_, i) => i !== index));
	};
	const formatInline = (text) => {
		return text.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, i) => {
			if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ jsx("strong", {
				className: "text-white font-semibold",
				children: part.slice(2, -2)
			}, i);
			if (part.startsWith("`") && part.endsWith("`")) return /* @__PURE__ */ jsx("code", {
				className: "px-1.5 py-0.5 rounded bg-white/10 text-accent font-mono text-[11px]",
				children: part.slice(1, -1)
			}, i);
			return part;
		});
	};
	const renderVisualMessage = (content, isUser) => {
		if (isUser) return /* @__PURE__ */ jsx("p", {
			className: "whitespace-pre-wrap text-xs font-semibold text-[#0a0c10] leading-relaxed select-text",
			children: content
		});
		const lines = content.split("\n");
		const elements = [];
		lines.forEach((rawLine, idx) => {
			const line = rawLine.trim();
			if (!line) {
				elements.push(/* @__PURE__ */ jsx("div", { className: "h-1" }, `sp-${idx}`));
				return;
			}
			const stepMatch = line.match(/^(\d+)[\.\)]\s*(.*)$/);
			if (stepMatch) {
				const num = stepMatch[1];
				const text = stepMatch[2];
				elements.push(/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-2.5 my-1.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all shadow-sm",
					children: [/* @__PURE__ */ jsx("span", {
						className: "w-5 h-5 rounded-md bg-accent/15 text-accent font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-accent/30 shadow-sm shadow-accent/10",
						children: num.padStart(2, "0")
					}), /* @__PURE__ */ jsx("div", {
						className: "text-xs leading-relaxed text-neutral-200 flex-1",
						children: formatInline(text)
					})]
				}, `step-${idx}`));
				return;
			}
			const bulletMatch = line.match(/^[\*\-•]\s*(.*)$/);
			if (bulletMatch) {
				const text = bulletMatch[1];
				elements.push(/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-2 my-1 pl-1",
					children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0 shadow-sm shadow-accent/50" }), /* @__PURE__ */ jsx("div", {
						className: "text-xs leading-relaxed text-neutral-200 flex-1",
						children: formatInline(text)
					})]
				}, `bullet-${idx}`));
				return;
			}
			const kpiMatch = line.match(/^(⏱️|🏷️|🎁|🚀|💡)\s*(.*)$/u);
			if (kpiMatch && /turnaround|rate|pricing|price|trial|discount|offer|sla/i.test(line) && kpiMatch) {
				const icon = kpiMatch[1];
				const text = kpiMatch[2];
				elements.push(/* @__PURE__ */ jsxs("div", {
					className: "my-2 p-2.5 rounded-xl bg-gradient-to-r from-accent/15 via-white/[0.02] to-transparent border border-accent/25 flex items-center gap-2.5 shadow-sm",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm shrink-0",
						children: icon
					}), /* @__PURE__ */ jsx("div", {
						className: "text-xs font-medium text-white/95 flex-1",
						children: formatInline(text)
					})]
				}, `hl-${idx}`));
				return;
			}
			if (line.startsWith("### ")) {
				elements.push(/* @__PURE__ */ jsx("h5", {
					className: "text-xs font-mono font-bold uppercase tracking-wider text-accent mt-3 mb-1",
					children: line.replace("### ", "")
				}, `h3-${idx}`));
				return;
			}
			elements.push(/* @__PURE__ */ jsx("p", {
				className: "text-xs leading-relaxed text-neutral-200 my-0.5",
				children: formatInline(line)
			}, `p-${idx}`));
		});
		return /* @__PURE__ */ jsx("div", {
			className: "space-y-0.5",
			children: elements
		});
	};
	return /* @__PURE__ */ jsxs("aside", {
		"aria-label": "Live Assistant",
		className: "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end",
		children: [
			/* @__PURE__ */ jsx(AnimatePresence, { children: showNudgeBubble && !isOpen && /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 10,
					scale: .95
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: 10,
					scale: .95
				},
				onClick: () => setIsOpen(true),
				className: "mb-3 mr-2 p-3.5 max-w-[290px] rounded-2xl bg-[#12141a]/95 border border-accent/40 shadow-2xl backdrop-blur-md cursor-pointer hover:border-accent transition-all",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-2 mb-1",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-[10px] font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-1",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }), " Quick Question?"]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: (e) => {
							e.stopPropagation();
							setShowNudgeBubble(false);
						},
						className: "text-white/40 hover:text-white",
						children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-white/90 leading-relaxed",
					children: nudgeMessage || "Test our quality with 3 free image edits! Zero cost, zero commitment."
				})]
			}) }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 20,
					scale: .95
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: 20,
					scale: .95
				},
				transition: { duration: .2 },
				"data-lenis-prevent": "true",
				"data-lenis-prevent-wheel": "true",
				"data-lenis-prevent-touch": "true",
				onDragOver: (e) => {
					e.preventDefault();
					setIsDragOver(true);
				},
				onDragLeave: () => setIsDragOver(false),
				onDrop: (e) => {
					e.preventDefault();
					setIsDragOver(false);
					const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
					if (files.length > 0) uploadFiles(files);
				},
				className: `relative flex flex-col rounded-3xl bg-[#0b0c10]/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden mb-3 transition-all duration-300 ${isExpanded ? "w-[calc(100vw-2rem)] sm:w-[720px] h-[min(700px,80vh)]" : "w-[calc(100vw-2rem)] sm:w-[380px] md:w-[410px] h-[min(540px,78vh)]"}`,
				children: [
					isDragOver && /* @__PURE__ */ jsxs("div", {
						className: "absolute inset-0 z-50 bg-[#0b0c10]/90 border-2 border-dashed border-accent rounded-3xl flex flex-col items-center justify-center gap-3 backdrop-blur-md p-6 text-center animate-in fade-in duration-200",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "p-4 rounded-2xl bg-accent/10 text-accent",
								children: /* @__PURE__ */ jsx(UploadCloud, { className: "w-12 h-12 animate-bounce" })
							}),
							/* @__PURE__ */ jsx("h4", {
								className: "text-base font-bold text-white font-mono",
								children: "Drop Photos Here"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-white/60 max-w-[280px]",
								children: "We will analyze the complexity and provide an instant price estimate."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "px-5 py-3.5 border-b border-white/10 bg-[#12141a]/90 flex items-center justify-between shrink-0",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("div", {
									className: `w-9 h-9 rounded-xl flex items-center justify-center transition-all ${chatMode === "operator" ? "bg-gradient-to-tr from-[#00f5ff]/30 to-accent/20 border border-[#00f5ff]/40 text-[#00f5ff]" : "bg-gradient-to-tr from-accent/25 to-[#00f5ff]/20 border border-white/20 text-accent"}`,
									children: chatMode === "operator" ? /* @__PURE__ */ jsx(User, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Bot, { className: "w-5 h-5" })
								}), /* @__PURE__ */ jsx("span", { className: `absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0b0c10] ${chatMode === "operator" ? "bg-[#00f5ff]" : "bg-accent"}` })]
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ jsx("h3", {
									className: "text-sm font-bold text-white tracking-tight",
									children: chatMode === "operator" ? "CuttingEdger Live Studio" : "CuttingEdger Assistant"
								})
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-[10px] text-white/50 font-mono flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${chatMode === "operator" ? "bg-[#00f5ff] animate-pulse" : "bg-accent animate-pulse"}` }), /* @__PURE__ */ jsx("span", { children: chatMode === "operator" ? `Live with ${operatorName || "Studio Specialist"}` : "24/7 Studio • Instant Estimates" })]
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleResetChat,
									disabled: isResetting,
									className: "px-2 py-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-mono border border-white/5 hover:border-white/15",
									title: "Start fresh conversation",
									children: [/* @__PURE__ */ jsx(RotateCcw, { className: `w-3 h-3 ${isResetting ? "animate-spin text-accent" : ""}` }), /* @__PURE__ */ jsx("span", {
										className: "hidden sm:inline",
										children: isResetting ? "Resetting..." : "New Chat"
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setIsExpanded(!isExpanded),
									className: "p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block",
									title: isExpanded ? "Collapse" : "Expand full view",
									children: isExpanded ? /* @__PURE__ */ jsx(Minimize2, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Maximize2, { className: "w-3.5 h-3.5" })
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setIsOpen(false),
									className: "p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer",
									title: "Close chat",
									children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
								})
							]
						})]
					}),
					chatMode === "operator" && /* @__PURE__ */ jsxs("div", {
						className: "px-4 py-1.5 bg-[#00f5ff]/10 border-b border-[#00f5ff]/20 text-[11px] font-mono text-[#00f5ff] flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1.5 font-semibold",
							children: [
								/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#00f5ff] animate-ping" }),
								"Live Specialist Active (",
								operatorName || "Production Lead",
								")"
							]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-white/50",
							children: "Direct Chat"
						})]
					}),
					needsHuman && chatMode !== "operator" && /* @__PURE__ */ jsx("div", {
						className: "px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] font-mono text-amber-400 flex items-center justify-between",
						children: /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" }), "Specialist notified • A live agent will reply shortly"]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						ref: scrollContainerRef,
						"data-lenis-prevent": "true",
						"data-lenis-prevent-wheel": "true",
						"data-lenis-prevent-touch": "true",
						onWheel: (e) => e.stopPropagation(),
						onTouchMove: (e) => e.stopPropagation(),
						style: {
							overscrollBehavior: "contain",
							WebkitOverflowScrolling: "touch"
						},
						className: "flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10",
						children: [
							messages.map((msg, index) => {
								const isUser = msg.sender === "user";
								const isOperator = msg.sender === "operator";
								const isLatestAssistant = !isUser && index === messages.length - 1;
								return /* @__PURE__ */ jsxs("div", {
									className: `flex flex-col group ${isUser ? "items-end" : "items-start"}`,
									children: [
										isOperator && /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 mb-1 text-[10px] text-[#00f5ff] font-mono",
											children: [/* @__PURE__ */ jsx(User, { className: "w-3 h-3 text-[#00f5ff]" }), /* @__PURE__ */ jsx("span", {
												className: "font-semibold",
												children: operatorName || "Live Studio Specialist"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative max-w-[88%]",
											children: [/* @__PURE__ */ jsxs("div", {
												className: `rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${isUser ? "bg-gradient-to-r from-accent to-[#ffe484] text-[#0a0c10] font-semibold rounded-br-xs shadow-md shadow-accent/20 border border-accent/40" : isOperator ? "bg-[#0e1724] text-white/95 border border-[#00f5ff]/30 rounded-bl-xs shadow-md shadow-[#00f5ff]/5" : "bg-[#151720] text-white/90 border border-white/5 rounded-bl-xs shadow-md"}`,
												children: [msg.attachments && msg.attachments.length > 0 && /* @__PURE__ */ jsx("div", {
													className: "mb-2 flex flex-wrap gap-1.5",
													children: msg.attachments.map((url, i) => /* @__PURE__ */ jsx("img", {
														src: url,
														alt: "Attached sample",
														className: "w-20 h-20 object-cover rounded-lg border border-white/20 shadow-md"
													}, i))
												}), renderVisualMessage(msg.content, isUser)]
											}), isUser && /* @__PURE__ */ jsxs("div", {
												className: "opacity-0 group-hover:opacity-100 absolute -bottom-5 right-1 flex items-center gap-2 text-[10px] text-white/50 transition-opacity",
												children: [/* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => handleEditUserMessage(msg.id, msg.content, index),
													className: "hover:text-accent flex items-center gap-1 cursor-pointer transition-colors",
													title: "Edit & fix typo in message",
													children: [/* @__PURE__ */ jsx(Pencil, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ jsx("span", { children: "Edit" })]
												}), /* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => handleDeleteUserMessage(msg.id, index),
													className: "hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors",
													title: "Remove message",
													children: [/* @__PURE__ */ jsx(Trash2, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ jsx("span", { children: "Delete" })]
												})]
											})]
										}),
										msg.tool_cards && msg.tool_cards.length > 0 && /* @__PURE__ */ jsx("div", {
											className: "w-full mt-2.5",
											children: msg.tool_cards.map((card, cIdx) => {
												if (card.type === "quote_card") return /* @__PURE__ */ jsx(QuoteCard, {
													card,
													onSelectReply: (text) => handleSendMessage(text),
													onUploadClick: () => fileInputRef.current?.click()
												}, cIdx);
												if (card.type === "free_trial_confirmed_card") return /* @__PURE__ */ jsx(FreeTrialConfirmedCard, {
													card,
													onSendPrompt: (text) => handleSendMessage(text)
												}, cIdx);
												if (card.type === "order_confirmed_card") return /* @__PURE__ */ jsx(OrderConfirmedCard, {
													card,
													onSendPrompt: (text) => handleSendMessage(text),
													onUploadClick: () => fileInputRef.current?.click()
												}, cIdx);
												if (card.type === "trial_quota_exhausted_card") return /* @__PURE__ */ jsx(TrialQuotaExhaustedCard, {
													card,
													onSendPrompt: (text) => handleSendMessage(text)
												}, cIdx);
												if (card.type === "reset_chat_prompt_card") return /* @__PURE__ */ jsxs("div", {
													className: "my-2 p-4 rounded-2xl bg-[#151720] border border-accent/30 shadow-lg text-left space-y-2.5 animate-in fade-in duration-200",
													children: [
														/* @__PURE__ */ jsxs("div", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ jsx("div", {
																className: "p-1.5 rounded-lg bg-accent/10 text-accent",
																children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-4 h-4" })
															}), /* @__PURE__ */ jsx("h4", {
																className: "text-xs font-bold text-white tracking-tight",
																children: card.title || "Start Fresh Conversation"
															})]
														}),
														/* @__PURE__ */ jsx("p", {
															className: "text-[11px] text-white/70 leading-relaxed",
															children: card.description
														}),
														/* @__PURE__ */ jsxs("button", {
															type: "button",
															onClick: handleResetChat,
															disabled: isResetting,
															className: "w-full py-2 px-3 rounded-xl bg-accent hover:bg-[#b8dd00] text-black font-semibold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
															children: [/* @__PURE__ */ jsx(RotateCcw, { className: `w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}` }), /* @__PURE__ */ jsx("span", { children: isResetting ? "Resetting..." : card.cta || "Start Fresh Chat" })]
														})
													]
												}, cIdx);
												if (card.type === "upload_prompt_card") return /* @__PURE__ */ jsxs("div", {
													className: "my-2 p-4 rounded-2xl bg-accent/10 border border-accent/40 shadow-xl backdrop-blur-md text-left",
													children: [
														/* @__PURE__ */ jsxs("div", {
															className: "flex items-center gap-2 mb-2",
															children: [/* @__PURE__ */ jsx("span", {
																className: "p-1.5 rounded-lg bg-accent text-black",
																children: /* @__PURE__ */ jsx(UploadCloud, { className: "w-4 h-4" })
															}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
																className: "text-sm font-bold text-white tracking-tight",
																children: card.title
															}), /* @__PURE__ */ jsx("span", {
																className: "text-[10px] text-accent font-mono",
																children: "Ready to process"
															})] })]
														}),
														/* @__PURE__ */ jsx("p", {
															className: "text-xs text-white/80 my-2 leading-relaxed",
															children: card.description
														}),
														/* @__PURE__ */ jsxs("button", {
															type: "button",
															onClick: () => fileInputRef.current?.click(),
															className: "w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-accent/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer",
															children: [/* @__PURE__ */ jsx(UploadCloud, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: card.cta || "Select Images to Upload" })]
														})
													]
												}, cIdx);
												if (card.type === "compact_slot_proposal") return /* @__PURE__ */ jsx(CompactSlotProposalCard, {
													card,
													onBookSlot: handleBookSlot,
													onShowAllTimes: () => handleSendMessage("Show full calendar with all dates")
												}, cIdx);
												if (card.type === "calendar_slot_picker") return /* @__PURE__ */ jsx(CalendarSlotPicker, {
													card,
													onBookSlot: handleBookSlot
												}, cIdx);
												if (card.type === "service_catalog_card" || card.type === "service_detail_card") return /* @__PURE__ */ jsx(ServiceCatalogCard, {
													card,
													onSendPrompt: (prompt) => handleSendMessage(prompt)
												}, cIdx);
												if (card.type === "booking_confirmed_card" || card.type === "appointment_status_card") return /* @__PURE__ */ jsx(BookingConfirmedCard, {
													card,
													onReschedule: () => {
														handleSendMessage("I would like to reschedule my consultation call");
													}
												}, cIdx);
												if (card.type === "info_card") {
													const hasServices = card.services && card.services.length > 0;
													const hasFaqs = card.faqs && card.faqs.length > 0;
													if (!hasServices && !hasFaqs) return null;
													return /* @__PURE__ */ jsxs("div", {
														className: "my-2 p-4 rounded-2xl bg-[#151720] border border-white/10 text-left space-y-2.5",
														children: [hasServices && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
															className: "text-[10px] font-mono uppercase tracking-wider text-accent block mb-1",
															children: "Studio Services"
														}), card.services.map((s, sI) => /* @__PURE__ */ jsxs("div", {
															className: "bg-white/5 p-2 rounded-lg my-1",
															children: [/* @__PURE__ */ jsx("p", {
																className: "text-xs font-bold text-white",
																children: s.title
															}), /* @__PURE__ */ jsx("p", {
																className: "text-[11px] text-white/60",
																children: s.subtitle
															})]
														}, sI))] }), hasFaqs && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
															className: "text-[10px] font-mono uppercase tracking-wider text-[#00f5ff] block mb-1",
															children: "FAQ Answers"
														}), card.faqs.map((f, fI) => /* @__PURE__ */ jsxs("div", {
															className: "bg-white/5 p-2 rounded-lg my-1",
															children: [/* @__PURE__ */ jsxs("p", {
																className: "text-xs font-semibold text-white",
																children: ["Q: ", f.q]
															}), /* @__PURE__ */ jsx("p", {
																className: "text-[11px] text-white/70 mt-0.5",
																children: f.a
															})]
														}, fI))] })]
													}, cIdx);
												}
												return null;
											})
										}),
										isLatestAssistant && msg.suggested_replies && msg.suggested_replies.length > 0 && !isLoading && /* @__PURE__ */ jsx("div", {
											className: "mt-3 flex flex-wrap gap-1.5 w-full",
											children: msg.suggested_replies.map((reply, rIdx) => /* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => handleSendMessage(reply),
												className: "text-[11px] font-mono px-3 py-1.5 rounded-xl bg-white/5 hover:bg-accent/15 hover:text-accent hover:border-accent/30 text-white/80 border border-white/10 transition-all text-left flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95",
												children: [/* @__PURE__ */ jsx("span", { children: reply }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-2.5 h-2.5 opacity-50 shrink-0" })]
											}, rIdx))
										})
									]
								}, msg.id || index);
							}),
							isTypingVisible && /* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-2 max-w-[85%] animate-in fade-in duration-200",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-6 h-6 rounded-lg bg-gradient-to-tr from-accent/20 to-[#00f5ff]/20 border border-white/15 flex items-center justify-center text-accent shrink-0 mt-0.5",
									children: /* @__PURE__ */ jsx(Bot, { className: "w-3.5 h-3.5" })
								}), /* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl rounded-tl-xs px-3.5 py-2.5 bg-[#151720] border border-white/10 shadow-md flex items-center gap-2.5",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" }),
											/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" }),
											/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent animate-bounce" })
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[11px] font-mono text-white/60",
										children: [
											typingPhase === "analyzing" && "CuttingEdger is analyzing request...",
											typingPhase === "checking" && "Reviewing studio schedule & specs...",
											typingPhase === "composing" && "Composing response..."
										]
									})]
								})]
							}),
							isUploading && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5 p-3 rounded-2xl bg-[#151720] border border-[#00f5ff]/30 text-[#00f5ff] text-xs w-fit",
								children: [/* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[11px]",
									children: "Uploading sample photo batch..."
								})]
							}),
							/* @__PURE__ */ jsx("div", { ref: messagesEndRef })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-3 border-t border-white/10 bg-[#12141a] relative",
						children: [
							/* @__PURE__ */ jsx(AnimatePresence, { children: showQuickMenu && /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									y: 10,
									scale: .95
								},
								animate: {
									opacity: 1,
									y: 0,
									scale: 1
								},
								exit: {
									opacity: 0,
									y: 10,
									scale: .95
								},
								className: "absolute bottom-full left-3 mb-2 w-72 rounded-2xl bg-[#151720]/95 border border-white/15 shadow-2xl backdrop-blur-xl p-2 z-50 space-y-1 font-mono text-xs",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "px-2.5 py-1.5 text-[10px] text-white/40 uppercase tracking-wider font-bold border-b border-white/5",
										children: "Quick Actions"
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => handleSendMessage("Get an Instant Quote"),
										className: "w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Get Instant Quote" })]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => handleSendMessage("Claim 3 Free Sample Edits"),
										className: "w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Claim 3 Free Sample Edits" })]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => handleSendMessage("Schedule Consultation Call"),
										className: "w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-[#00f5ff]" }), /* @__PURE__ */ jsx("span", { children: "Book 15-Min Technical Call" })]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => handleSendMessage("Turnaround SLAs"),
										className: "w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-[#ff3e8a]" }), /* @__PURE__ */ jsx("span", { children: "Turnaround & SLAs" })]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => handleSendMessage("Can I speak with a live specialist?"),
										className: "w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-[#00f5ff]" }), /* @__PURE__ */ jsx("span", { children: "Talk to Live Specialist" })]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => {
											setShowQuickMenu(false);
											fileInputRef.current?.click();
										},
										className: "w-full px-2.5 py-2 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-white/5 pt-2",
										children: [/* @__PURE__ */ jsx(UploadCloud, { className: "w-3.5 h-3.5 text-white/60" }), /* @__PURE__ */ jsx("span", { children: "Upload Batch Photos" })]
									})
								]
							}) }),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: (e) => {
									e.preventDefault();
									handleSendMessage();
								},
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("input", {
										type: "file",
										ref: fileInputRef,
										onChange: handleFileInputChange,
										accept: "image/jpeg,image/png,image/webp,image/tiff",
										multiple: true,
										className: "hidden"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setShowQuickMenu(!showQuickMenu),
										title: "Quick Actions Menu",
										className: `p-2 rounded-xl transition-all shrink-0 cursor-pointer ${showQuickMenu ? "bg-accent text-black rotate-45" : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"}`,
										children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 transition-transform" })
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => fileInputRef.current?.click(),
										title: "Attach sample photos",
										className: "p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0 cursor-pointer",
										children: /* @__PURE__ */ jsx(Paperclip, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: inputText,
										onChange: (e) => setInputText(e.target.value),
										placeholder: "Ask a question, pricing, turnaround, or edits...",
										className: "flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: !inputText.trim() || isLoading,
										className: "p-2 rounded-xl bg-accent hover:bg-accent-hover text-black transition-all disabled:opacity-30 disabled:hover:bg-accent shrink-0 cursor-pointer shadow-md shadow-accent/20",
										children: /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" })
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-[10px] text-white/40 pt-1.5 px-1 font-mono",
								children: [/* @__PURE__ */ jsx("span", { children: "We reply instantly • Ask us anything" }), /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-white/50",
									children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent" }), " 100% Confidential"]
								})]
							})
						]
					})
				]
			}) }),
			/* @__PURE__ */ jsxs(motion.button, {
				whileHover: { scale: 1.05 },
				whileTap: { scale: .95 },
				onClick: () => setIsOpen(!isOpen),
				className: "relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-[#12141a] to-[#1c1f2b] border border-accent/40 text-accent shadow-2xl hover:border-accent transition-all flex items-center justify-center group cursor-pointer",
				"aria-label": "Toggle AI Chat Dialog",
				children: [
					/* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-2xl bg-accent/20 blur-md group-hover:bg-accent/30 transition-all -z-10" }),
					isOpen ? /* @__PURE__ */ jsx(Minimize2, { className: "w-5 h-5 sm:w-6 sm:h-6 text-white" }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(MessageSquare, { className: "w-5 h-5 sm:w-6 sm:h-6 text-accent" }), /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-accent border-2 border-[#0a0b0e]" })] }),
					unreadCount > 0 && !isOpen && /* @__PURE__ */ jsx("span", {
						className: "absolute -top-2 -left-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold shadow-md",
						children: unreadCount
					})
				]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Common/CookieConsentBanner.tsx
var CONSENT_KEY = "cuttingedger_cookie_consent_v1";
function CookieConsentBanner() {
	const [isVisible, setIsVisible] = useState(false);
	useEffect(() => {
		try {
			if (!localStorage.getItem(CONSENT_KEY)) {
				const timer = setTimeout(() => setIsVisible(true), 1200);
				return () => clearTimeout(timer);
			}
		} catch (e) {}
	}, []);
	const handleAccept = () => {
		try {
			localStorage.setItem(CONSENT_KEY, JSON.stringify({
				analytics: true,
				marketing: true,
				timestamp: Date.now()
			}));
			window.dispatchEvent(new CustomEvent("ce_cookie_consent_updated", { detail: {
				analytics: true,
				marketing: true
			} }));
		} catch (e) {}
		setIsVisible(false);
	};
	const handleDecline = () => {
		try {
			localStorage.setItem(CONSENT_KEY, JSON.stringify({
				analytics: false,
				marketing: false,
				timestamp: Date.now()
			}));
			window.dispatchEvent(new CustomEvent("ce_cookie_consent_updated", { detail: {
				analytics: false,
				marketing: false
			} }));
		} catch (e) {}
		setIsVisible(false);
	};
	if (!isVisible) return null;
	return /* @__PURE__ */ jsxs("aside", {
		"aria-label": "Cookie and Privacy Consent",
		className: "fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[999] bg-[#0e1017]/95 border border-white/15 p-5 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300 select-none",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ jsx("div", {
				className: "w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0 text-accent",
				children: /* @__PURE__ */ jsx(Cookie, { className: "w-4 h-4" })
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5 flex-1 text-xs",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "font-display font-bold text-white text-sm",
						children: "Privacy & Consent Protocol"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-neutral-300 leading-relaxed",
						children: "We deploy privacy-preserving cookies and analytics to calibrate visual pipeline performance. No intrusive third-party cross-tracking."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 pt-1 font-mono text-[11px] text-neutral-400",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/cookie-policy",
								className: "underline hover:text-accent transition-colors",
								children: "Cookie Policy"
							}),
							/* @__PURE__ */ jsx("span", { children: "·" }),
							/* @__PURE__ */ jsx(Link, {
								href: "/privacy",
								className: "underline hover:text-accent transition-colors",
								children: "Privacy Terms"
							})
						]
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-white/10 font-mono text-xs",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: handleDecline,
				className: "px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-all",
				children: "Essential Only"
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: handleAccept,
				className: "px-4 py-1.5 rounded-lg bg-accent text-black font-bold hover:bg-accent-hover transition-all shadow-md",
				children: "Accept All"
			})]
		})]
	});
}
//#endregion
//#region resources/js/Components/ui/sonner.tsx
function Toaster$1({ ...props }) {
	return /* @__PURE__ */ jsx(Toaster, {
		theme: "dark",
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-[#0c0d12]/95 group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:font-mono group-[.toaster]:text-xs",
			description: "group-[.toast]:text-neutral-400 font-sans",
			actionButton: "group-[.toast]:bg-accent group-[.toast]:text-black font-mono font-bold",
			cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white",
			success: "group-[.toaster]:border-emerald-500/40 group-[.toaster]:text-emerald-300",
			error: "group-[.toaster]:border-rose-500/40 group-[.toaster]:text-rose-300"
		} },
		richColors: true,
		closeButton: true,
		position: "top-right",
		...props
	});
}
//#endregion
//#region resources/js/hooks/useSmoothScroll.ts
var globalLenis = null;
function useSmoothScroll() {
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		if (!globalLenis) {
			globalLenis = new Lenis({
				lerp: .1,
				wheelMultiplier: 1,
				touchMultiplier: 1,
				autoRaf: true,
				autoResize: true
			});
			if (typeof window !== "undefined") window.lenis = globalLenis;
		}
		const removeNavigateListener = router.on("navigate", () => {
			globalLenis?.scrollTo(0, { immediate: true });
		});
		return () => {
			removeNavigateListener();
		};
	}, []);
}
//#endregion
//#region resources/js/lib/attribution.ts
var STORAGE_KEY = "cuttingedger_lead_attribution";
function initializeAttribution() {
	if (typeof window === "undefined") return;
	try {
		const params = new URL(window.location.href).searchParams;
		const clickId = params.get("gclid") || params.get("fbclid") || params.get("msclkid") || params.get("ttclid") || params.get("irclickid") || "";
		const existingRaw = sessionStorage.getItem(STORAGE_KEY);
		let existing = {};
		if (existingRaw) try {
			existing = JSON.parse(existingRaw);
		} catch (e) {
			existing = {};
		}
		const attribution = {
			landing_page_url: existing.landing_page_url || window.location.href,
			submission_page_url: window.location.href,
			utm_source: params.get("utm_source") || existing.utm_source || (document.referrer ? new URL(document.referrer, window.location.origin).hostname : "direct"),
			utm_medium: params.get("utm_medium") || existing.utm_medium || (params.get("utm_source") ? "cpc" : "organic"),
			utm_campaign: params.get("utm_campaign") || existing.utm_campaign || "",
			utm_term: params.get("utm_term") || existing.utm_term || "",
			utm_content: params.get("utm_content") || existing.utm_content || "",
			click_id: clickId || existing.click_id || ""
		};
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
	} catch (err) {}
}
function getAttributionData() {
	if (typeof window === "undefined") return {
		landing_page_url: "",
		submission_page_url: ""
	};
	try {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (stored) return {
			...JSON.parse(stored),
			submission_page_url: window.location.href
		};
	} catch (e) {}
	return {
		landing_page_url: window.location.href,
		submission_page_url: window.location.href
	};
}
//#endregion
//#region resources/js/Layouts/AppLayout.tsx
function AppLayout({ children }) {
	const { url } = usePage();
	const { settings, flash } = usePage().props;
	const [isContactOpen, setIsContactOpen] = useState(false);
	const [isDiscoveryCallOpen, setIsDiscoveryCallOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	useSmoothScroll();
	useEffect(() => {
		initializeAttribution();
	}, []);
	useEffect(() => {
		const handleOpenDiscovery = () => setIsDiscoveryCallOpen(true);
		const handleOpenContact = () => setIsContactOpen(true);
		window.addEventListener("ce:open-discovery-call", handleOpenDiscovery);
		window.addEventListener("ce:open-contact", handleOpenContact);
		return () => {
			window.removeEventListener("ce:open-discovery-call", handleOpenDiscovery);
			window.removeEventListener("ce:open-contact", handleOpenContact);
		};
	}, []);
	useEffect(() => {
		if (url.startsWith("/thank-you")) return;
		if (flash?.success) toast.success(flash.success);
		if (flash?.error) toast.error(flash.error);
	}, [flash, url]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen flex flex-col bg-[#0a0b0e] text-[#f4f5f8] relative selection:bg-accent selection:text-black",
		children: [
			/* @__PURE__ */ jsx("a", {
				href: "#main-content",
				className: "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[1000] px-4 py-2 bg-accent text-black font-mono font-bold rounded-md shadow-lg",
				children: "Skip to main content"
			}),
			/* @__PURE__ */ jsx(Toaster$1, {}),
			/* @__PURE__ */ jsx(Header, {
				onOpenContact: () => setIsContactOpen(true),
				onOpenDiscoveryCall: () => setIsDiscoveryCallOpen(true),
				onOpenMobileMenu: () => setIsMobileMenuOpen(true),
				settings
			}),
			/* @__PURE__ */ jsx("main", {
				id: "main-content",
				className: "flex-1 w-full",
				children
			}),
			/* @__PURE__ */ jsx(Footer, { settings }),
			/* @__PURE__ */ jsx(DiscoveryCallModal, {
				isOpen: isDiscoveryCallOpen,
				onClose: () => setIsDiscoveryCallOpen(false)
			}),
			/* @__PURE__ */ jsx(SlideOverContact, {
				isOpen: isContactOpen,
				onClose: () => setIsContactOpen(false),
				settings
			}),
			/* @__PURE__ */ jsx(MobileMenu, {
				isOpen: isMobileMenuOpen,
				onClose: () => setIsMobileMenuOpen(false),
				onOpenContact: () => setIsContactOpen(true),
				settings
			}),
			/* @__PURE__ */ jsx(ChatWidget, {}),
			/* @__PURE__ */ jsx(CookieConsentBanner, {})
		]
	});
}
//#endregion
//#region resources/js/ssr.tsx
var appName = "CuttingEdger";
createServer((page) => createInertiaApp({
	page,
	render: renderToString,
	title: (title) => title ? `${title} — ${appName}` : `${appName} — Radical Digital Agency`,
	resolve: async (name) => {
		const resolvedPageModule = await resolvePageComponent(`./Pages/${name}.tsx`, /* #__PURE__ */ Object.assign({
			"./Pages/About.tsx": () => import("./assets/About-DwL7ED37.js"),
			"./Pages/Admin/BlogCategories/Index.tsx": () => import("./assets/Index-CO4iKG20.js"),
			"./Pages/Admin/Blogs/BlogForm.tsx": () => import("./assets/BlogForm-D7XPwDB7.js"),
			"./Pages/Admin/Blogs/Create.tsx": () => import("./assets/Create-BuXbfyCk.js"),
			"./Pages/Admin/Blogs/Edit.tsx": () => import("./assets/Edit-BqFrSogq.js"),
			"./Pages/Admin/Blogs/Index.tsx": () => import("./assets/Index-CY4A5K1b.js"),
			"./Pages/Admin/Blogs/Trash.tsx": () => import("./assets/Trash-BJjFUROJ.js"),
			"./Pages/Admin/Careers/Index.tsx": () => import("./assets/Index-DrU_y6i1.js"),
			"./Pages/Admin/ChatSessions/Index.tsx": () => import("./assets/Index-CZ0RjO44.js"),
			"./Pages/Admin/Clients/Index.tsx": () => import("./assets/Index-CXcmUq1t.js"),
			"./Pages/Admin/Consultations/Index.tsx": () => import("./assets/Index-DE-R36Y5.js"),
			"./Pages/Admin/Dashboard.tsx": () => import("./assets/Dashboard-CsHgu96n.js"),
			"./Pages/Admin/Faqs/Index.tsx": () => import("./assets/Index-B4G48Fou.js"),
			"./Pages/Admin/FreeTrials/Index.tsx": () => import("./assets/Index-B-xT9QQQ.js"),
			"./Pages/Admin/Login.tsx": () => import("./assets/Login-gsizN08-.js"),
			"./Pages/Admin/Messages/Index.tsx": () => import("./assets/Index-COJRVxwP.js"),
			"./Pages/Admin/Orders/Index.tsx": () => import("./assets/Index-CLUG717_.js"),
			"./Pages/Admin/Pricing/Index.tsx": () => import("./assets/Index-DyShMPc4.js"),
			"./Pages/Admin/Projects/Index.tsx": () => import("./assets/Index-B3CNV7zR.js"),
			"./Pages/Admin/Redirects/Index.tsx": () => import("./assets/Index-B8cty8wD.js"),
			"./Pages/Admin/Services/Index.tsx": () => import("./assets/Index-CahHP2n6.js"),
			"./Pages/Admin/Settings/Index.tsx": () => import("./assets/Index-hgBjH2QO.js"),
			"./Pages/Admin/Subscribers/Index.tsx": () => import("./assets/Index-Dxy6puqS.js"),
			"./Pages/Admin/Team/Index.tsx": () => import("./assets/Index-CZmgQVsa.js"),
			"./Pages/Admin/Testimonials/Index.tsx": () => import("./assets/Index-Dm8-m0ql.js"),
			"./Pages/Admin/TrackingScripts/Index.tsx": () => import("./assets/Index-DCO0kPlM.js"),
			"./Pages/Admin/Users/Index.tsx": () => import("./assets/Index-BStdypmZ.js"),
			"./Pages/Blog/Index.tsx": () => import("./assets/Index-CT1ltXy_.js"),
			"./Pages/Blog/Show.tsx": () => import("./assets/Show-Bz1J7ejG.js"),
			"./Pages/Careers/Index.tsx": () => import("./assets/Index-CnNOlIuz.js"),
			"./Pages/Careers/Show.tsx": () => import("./assets/Show-BTI7bUno.js"),
			"./Pages/Contact.tsx": () => import("./assets/Contact-CeZROX8y.js"),
			"./Pages/Errors/404.tsx": () => import("./assets/404-B2zMxnij.js"),
			"./Pages/Faq.tsx": () => import("./assets/Faq-uacoF8A5.js"),
			"./Pages/Home.tsx": () => import("./assets/Home-DSzUzwjd.js"),
			"./Pages/Legal/CookiePolicy.tsx": () => import("./assets/CookiePolicy-BJOtxyQi.js"),
			"./Pages/Pricing.tsx": () => import("./assets/Pricing-D62DHBuM.js"),
			"./Pages/Privacy.tsx": () => import("./assets/Privacy-CJ5wk8_j.js"),
			"./Pages/Reviews.tsx": () => import("./assets/Reviews-8qZohVkL.js"),
			"./Pages/Services/Index.tsx": () => import("./assets/Index-Cadezd1t.js"),
			"./Pages/Services/Show.tsx": () => import("./assets/Show-Dq9J-x56.js"),
			"./Pages/Team/Index.tsx": () => import("./assets/Index-hvotTPrv.js"),
			"./Pages/Team/Show.tsx": () => import("./assets/Show-CHjdVEH0.js"),
			"./Pages/Terms.tsx": () => import("./assets/Terms-qT_auwT-.js"),
			"./Pages/ThankYou.tsx": () => import("./assets/ThankYou-BXdnd_ao.js"),
			"./Pages/Trust/EsgPolicy.tsx": () => import("./assets/EsgPolicy-BwRNgPeE.js"),
			"./Pages/Trust/NdaCompliance.tsx": () => import("./assets/NdaCompliance-mxawUg3C.js"),
			"./Pages/Work/Index.tsx": () => import("./assets/Index-DCJhZ0il.js"),
			"./Pages/Work/Show.tsx": () => import("./assets/Show-Bsj1mT-O.js")
		}));
		const resolved = resolvedPageModule.default;
		if (resolved.layout === void 0) resolved.layout = (pageElement) => /* @__PURE__ */ jsx(AppLayout, { children: pageElement });
		return resolvedPageModule;
	},
	setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
}));
//#endregion
export { Toaster$1 as n, toast as r, getAttributionData as t };
