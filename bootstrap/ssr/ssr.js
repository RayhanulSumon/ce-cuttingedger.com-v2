import { useEffect, useState } from "react";
import { Link, createInertiaApp, router, useForm, usePage } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
import { ArrowUpRight, ChevronDown, ChevronUp, Mail, MapPin, Menu, Moon, Phone, Send, Sun, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
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
//#region resources/js/Components/UI/ThemeToggle.tsx
function ThemeToggle({ className = "" }) {
	const { isDark, toggleTheme } = useTheme();
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: toggleTheme,
		"aria-label": isDark ? "Switch to light theme" : "Switch to dark theme",
		className: `relative inline-flex items-center justify-center p-2 rounded-full border border-white/10 dark:border-white/15 bg-white/5 dark:bg-[#12141a] hover:border-[#d4ff00]/60 hover:text-[#d4ff00] text-neutral-300 dark:text-neutral-200 transition-all duration-300 ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Toggle theme"
		}), isDark ? /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4 text-[#d4ff00] transition-transform duration-300 hover:rotate-90" }) : /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4 text-neutral-800 transition-transform duration-300 hover:-rotate-12" })]
	});
}
//#endregion
//#region resources/js/Layouts/Header.tsx
function Header({ onOpenContact, onOpenMobileMenu }) {
	const { url } = usePage();
	const [isScrolled, setIsScrolled] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(null);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 15) setIsScrolled(true);
			else setIsScrolled(false);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	const navItems = [
		{
			label: "Home",
			href: "/",
			children: [
				{
					label: "Creative Studio (Dark)",
					href: "/"
				},
				{
					label: "2D & 3D Interactive Reel",
					href: "/work"
				},
				{
					label: "Capabilities & Services",
					href: "/services"
				}
			]
		},
		{
			label: "Pages",
			href: "/about",
			children: [
				{
					label: "About Studio",
					href: "/about"
				},
				{
					label: "Creative Team",
					href: "/team"
				},
				{
					label: "Careers & Openings",
					href: "/careers"
				},
				{
					label: "Pricing Plans",
					href: "/pricing"
				},
				{
					label: "Studio FAQ",
					href: "/faq"
				}
			]
		},
		{
			label: "Projects",
			href: "/work",
			children: [
				{
					label: "All Commissions (24+)",
					href: "/work"
				},
				{
					label: "3D Spatial CGI",
					href: "/work?category=3d"
				},
				{
					label: "2D Vector Identity",
					href: "/work?category=2d"
				},
				{
					label: "Kinetic WebGL Systems",
					href: "/work?category=web"
				}
			]
		},
		{
			label: "Services",
			href: "/services",
			children: [
				{
					label: "All Disciplines",
					href: "/services"
				},
				{
					label: "Brand Architecture",
					href: "/services/brand-architecture"
				},
				{
					label: "Kinetic 3D & CGI",
					href: "/services/kinetic-3d"
				},
				{
					label: "Full-Stack Web Velocity",
					href: "/services/creative-web"
				}
			]
		},
		{
			label: "Blog",
			href: "/blog",
			children: [{
				label: "Studio Insights",
				href: "/blog"
			}, {
				label: "Design System Notes",
				href: "/blog"
			}]
		},
		{
			label: "Contact",
			href: "/contact",
			children: [{
				label: "Contact Us",
				href: "/contact"
			}, {
				label: "Start a Commission",
				href: "/contact"
			}]
		}
	];
	const isActive = (href) => {
		if (href === "/") return url === "/";
		return url.startsWith(href);
	};
	return /* @__PURE__ */ jsx("header", {
		className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-3 bg-[#0c0d12]/95 backdrop-blur-xl border-b border-white/10 shadow-lg" : "py-5 bg-[#090a0d]/80 backdrop-blur-md border-b border-white/5"}`,
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ jsxs(Link, {
						href: "/",
						className: "group flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[#d4ff00] rounded-lg select-none",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black transition-all duration-300",
							children: /* @__PURE__ */ jsx("svg", {
								viewBox: "0 0 24 24",
								fill: "currentColor",
								className: "w-4 h-4",
								children: /* @__PURE__ */ jsx("path", { d: "M12 2L2 22h7l3-6 3 6h7L12 2zm0 6l1.8 3.6h-3.6L12 8z" })
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline tracking-tight",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-['Antonio',_'Bebas_Neue',_sans-serif] text-2xl sm:text-3xl font-bold text-white transition-colors",
								children: "CUTTING"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-['Antonio',_'Bebas_Neue',_sans-serif] text-2xl sm:text-3xl font-bold text-[#d4ff00] ml-1",
								children: "EDGER."
							})]
						})]
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "hidden lg:flex items-center gap-1",
						children: navItems.map((item) => {
							const active = isActive(item.href);
							const hasChildren = item.children && item.children.length > 0;
							return /* @__PURE__ */ jsxs("div", {
								className: "relative",
								onMouseEnter: () => setOpenDropdown(item.label),
								onMouseLeave: () => setOpenDropdown(null),
								children: [/* @__PURE__ */ jsxs(Link, {
									href: item.href,
									className: `px-3.5 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-lg group ${active ? "text-[#d4ff00]" : "text-neutral-300 hover:text-white"}`,
									children: [/* @__PURE__ */ jsx("span", { children: item.label }), hasChildren && /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform group-hover:rotate-180" })]
								}), hasChildren && openDropdown === item.label && /* @__PURE__ */ jsx("div", {
									className: "absolute top-full left-0 w-56 pt-2 z-50",
									children: /* @__PURE__ */ jsx("div", {
										className: "rounded-2xl p-2 bg-[#12141c] border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1",
										children: item.children.map((child, idx) => /* @__PURE__ */ jsx(Link, {
											href: child.href,
											className: "block px-3 py-2 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-black hover:bg-[#d4ff00] rounded-xl transition-colors",
											children: child.label
										}, idx))
									})
								})]
							}, item.label);
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx(ThemeToggle, {}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: onOpenContact,
								className: "hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4ff00] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#c2eb00] hover:shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-all duration-300 cursor-pointer select-none",
								children: [/* @__PURE__ */ jsx("span", { children: "Get in Touch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-black stroke-[2.5]" })]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onOpenMobileMenu,
								"aria-label": "Open mobile navigation menu",
								className: "p-2.5 rounded-full border border-white/15 bg-white/5 text-neutral-200 hover:text-[#d4ff00] hover:border-[#d4ff00] lg:hidden transition-colors",
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
	const isHomePage = url === "/" || url.split("?")[0] === "";
	const isCompact = compact !== void 0 ? compact : !isHomePage;
	const letters = Array.from("CONTACT US");
	const [hoveredIndex, setHoveredIndex] = useState(null);
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
			url: settings?.social_twitter || "https://twitter.com"
		},
		{
			name: "Instagram",
			url: settings?.social_instagram || "https://instagram.com"
		},
		{
			name: "Behance",
			url: "https://behance.net"
		},
		{
			name: "Dribbble",
			url: settings?.social_dribbble || "https://dribbble.com"
		},
		{
			name: "LinkedIn",
			url: settings?.social_linkedin || "https://linkedin.com"
		}
	];
	if (isCompact) return /* @__PURE__ */ jsx("footer", {
		id: "site-footer",
		className: "relative bg-[#07080a] text-white border-t border-white/10 select-none",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-white/10",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "inline-flex items-center gap-2 font-['MangoGrotesque',_'Antonio',_sans-serif] text-3xl sm:text-4xl font-normal tracking-wider text-white uppercase hover:text-[#d4ff00] transition-colors",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-2xl font-black text-[#d4ff00]",
								children: "▲"
							}), /* @__PURE__ */ jsx("span", { children: "cuttingedger" })]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm text-neutral-400 font-sans max-w-sm",
							children: "Radical digital agency & creative engineering studio for visionary innovators."
						})]
					}),
					/* @__PURE__ */ jsxs("nav", {
						className: "flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm font-mono uppercase tracking-wider text-neutral-300",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/work",
								className: "hover:text-[#d4ff00] transition-colors",
								children: "Work"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/services",
								className: "hover:text-[#d4ff00] transition-colors",
								children: "Services"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/about",
								className: "hover:text-[#d4ff00] transition-colors",
								children: "About"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/pricing",
								className: "hover:text-[#d4ff00] transition-colors",
								children: "Pricing"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/contact",
								className: "hover:text-[#d4ff00] transition-colors",
								children: "Contact"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ jsx(Link, {
							href: "/contact",
							onClick: (e) => {
								if (onOpenContact) {
									e.preventDefault();
									onOpenContact();
								}
							},
							className: "px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-[#d4ff00] hover:text-black hover:border-[#d4ff00] text-xs font-mono uppercase tracking-wider text-white transition-all duration-300 shadow-sm",
							children: "Start a Project"
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-400 font-sans",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-6 order-2 sm:order-1",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [
								"Copyright © ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" CuttingEdger."
							] }),
							/* @__PURE__ */ jsx(Link, {
								href: "/privacy",
								className: "hover:text-white transition-colors",
								children: "Privacy"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/terms",
								className: "hover:text-white transition-colors",
								children: "Terms"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-6 order-1 sm:order-2",
						children: socials.map((social) => /* @__PURE__ */ jsx("a", {
							href: social.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "relative text-[#f9f4e8]/80 hover:text-white transition-colors font-medium tracking-wide after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#d4ff00] after:transition-all after:duration-300",
							children: social.name
						}, social.name))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "order-3",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: scrollToTop,
							"aria-label": "Scroll back to top",
							className: "w-9 h-9 rounded-full bg-white/10 hover:bg-[#d4ff00] hover:text-black text-white flex items-center justify-center transition-all duration-300 cursor-pointer",
							children: /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 stroke-[2.5]" })
						})
					})
				]
			})]
		})
	});
	return /* @__PURE__ */ jsx("footer", {
		id: "site-footer",
		className: "relative bg-[#090a0d] px-3 sm:px-5 pb-4 pt-12 sm:pt-16 select-none",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative rounded-[24px] sm:rounded-[36px] overflow-hidden border border-white/10 min-h-[82vh] lg:min-h-[88vh] flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.95)]",
			style: {
				backgroundColor: "#080302",
				backgroundImage: "url('/images/footer-bg.jpg')",
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover"
			},
			children: [
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40 pointer-events-none" }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-base font-sans text-[#f9f4e8]",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-normal text-[#f9f4e8]/90 tracking-wide order-2 sm:order-1",
							children: "Creative Design Agency"
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "order-1 sm:order-2 inline-flex items-center gap-1.5 font-['MangoGrotesque',_'Antonio',_sans-serif] text-3xl sm:text-4xl font-normal tracking-wider text-white uppercase hover:text-[#d4ff00] transition-colors",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-2xl font-black text-[#d4ff00]",
								children: "▲"
							}), /* @__PURE__ */ jsx("span", { children: "cuttingedger" })]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "font-normal text-[#f9f4e8]/90 tracking-wide order-3 hidden sm:inline-block",
							children: settings?.office_address || "Based in London"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 w-full px-2 sm:px-4 py-14 sm:py-20 flex flex-col items-center justify-center text-center my-auto",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-['Plus_Jakarta_Sans',_sans-serif] text-xs sm:text-sm uppercase tracking-[0.22em] text-[#f9f4e8]/70 font-medium mb-6 sm:mb-8 select-none",
						children: "CONTACT US AND LET'S BRING YOUR VISION TO LIFE"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/contact",
						onClick: (e) => {
							if (onOpenContact) {
								e.preventDefault();
								onOpenContact();
							}
						},
						onPointerLeave: () => setHoveredIndex(null),
						className: "cursor-pointer group flex items-start justify-center select-none w-full max-w-[98%] mx-auto",
						title: "Click to get in touch",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex items-start justify-center flex-nowrap overflow-visible",
							children: letters.map((char, index) => {
								if (char === " ") return /* @__PURE__ */ jsx("span", { className: "w-3 sm:w-6 md:w-10 lg:w-14 inline-block pointer-events-none" }, `space-${index}`);
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
										scaleY: isHovered ? 1.3 : 1,
										y: isHovered ? "6.5%" : "0%"
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
									style: { transformOrigin: "center center" },
									className: "inline-block font-['MangoGrotesque',_'Antonio',_sans-serif] font-normal uppercase text-[90px] xs:text-[130px] sm:text-[190px] md:text-[270px] lg:text-[340px] xl:text-[400px] leading-[0.86] text-[#f9f4e8] tracking-[-0.01em] will-change-transform select-none cursor-pointer hover:text-white",
									children: char
								}, `char-${index}`);
							})
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 w-full pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm font-sans text-[#f9f4e8] border-t border-white/10",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-6",
							children: [
								/* @__PURE__ */ jsx("span", { children: "Powered by CuttingEdger" }),
								/* @__PURE__ */ jsx(Link, {
									href: "/privacy",
									className: "text-[#f9f4e8]/60 hover:text-white transition-colors text-xs",
									children: "Privacy"
								}),
								/* @__PURE__ */ jsx(Link, {
									href: "/terms",
									className: "text-[#f9f4e8]/60 hover:text-white transition-colors text-xs",
									children: "Terms"
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-6 sm:gap-8",
							children: socials.map((social) => /* @__PURE__ */ jsx("a", {
								href: social.url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "relative text-[#f9f4e8] hover:text-white transition-colors font-medium tracking-wide after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#f9f4e8] after:transition-all after:duration-300",
								children: social.name
							}, social.name))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsxs("span", { children: ["Copyright © ", (/* @__PURE__ */ new Date()).getFullYear()] }), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: scrollToTop,
								"aria-label": "Scroll back to top",
								className: "w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#d4ff00] transition-all duration-300 shadow-xl cursor-pointer shrink-0",
								children: /* @__PURE__ */ jsx(ChevronUp, { className: "w-5 h-5 stroke-[2.5]" })
							})]
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
	useEffect(() => {
		if (isOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);
	const navLinks = [
		{
			label: "Work",
			href: "/work",
			count: "08"
		},
		{
			label: "Services",
			href: "/services",
			count: "04"
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
						className: "text-[#d4ff00]",
						children: "EDGER."
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsx(ThemeToggle, {}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close mobile navigation",
						className: "p-3 rounded-full border border-white/20 text-neutral-300 hover:text-[#d4ff00] hover:border-[#d4ff00] transition-colors",
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
							className: "group flex items-baseline justify-between py-2 border-b border-white/5 hover:border-[#d4ff00]/40 transition-colors",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-300 group-hover:text-[#d4ff00] group-hover:translate-x-3 transition-all duration-300",
								children: item.label
							}), /* @__PURE__ */ jsxs("span", {
								className: "font-mono text-xs sm:text-sm text-neutral-500 group-hover:text-[#d4ff00]",
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
			/* @__PURE__ */ jsxs("div", {
				className: "pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "font-mono text-xs uppercase text-neutral-400 block mb-1",
					children: "Direct Line"
				}), /* @__PURE__ */ jsx("a", {
					href: `mailto:${settings?.contact_email || "hello@cuttingedger.com"}`,
					className: "text-sm font-semibold hover:text-[#d4ff00] transition-colors",
					children: settings?.contact_email || "hello@cuttingedger.com"
				})] }), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => {
						onClose();
						onOpenContact();
					},
					className: "bg-[#d4ff00] text-black px-6 py-3.5 rounded-full font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#c2eb00] transition-colors",
					children: [/* @__PURE__ */ jsx("span", { children: "Initiate Project" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Layouts/SlideOverContact.tsx
function SlideOverContact({ isOpen, onClose, settings }) {
	const { data, setData, post, processing, reset, wasSuccessful } = useForm({
		name: "",
		email: "",
		message: "",
		service_interest: "General Inquiry",
		honeypot: ""
	});
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
		post("/contact", {
			preserveScroll: true,
			onSuccess: () => reset()
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
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
						children: "Direct Agency Channel"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close contact drawer",
						className: "p-2 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-neutral-400 transition-colors",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ jsxs("h2", {
						id: "slideover-title",
						className: "text-3xl sm:text-4xl font-display font-bold leading-tight",
						children: ["Have a wild project in mind? ", /* @__PURE__ */ jsx("span", {
							className: "text-[#d4ff00]",
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
							className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
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
							className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
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
							className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
						})] }),
						wasSuccessful && /* @__PURE__ */ jsx("div", {
							className: "p-3 rounded-lg bg-[#d4ff00]/10 border border-[#d4ff00]/40 text-[#d4ff00] text-xs font-mono",
							children: "Inbound message transmitted. We will reply within 24 hours."
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: processing,
							className: "w-full bg-[#d4ff00] text-black font-display font-bold py-3.5 px-6 rounded-xl hover:bg-[#c2eb00] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50",
							children: [/* @__PURE__ */ jsx("span", { children: processing ? "Sending..." : "Transmit Inquiry" }), /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 transition-transform group-hover:translate-x-1" })]
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
							className: "flex items-center gap-2.5 text-neutral-300 hover:text-[#d4ff00] transition-colors",
							children: [/* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-[#d4ff00]" }), /* @__PURE__ */ jsx("span", { children: settings?.contact_email || "studio@cuttingedger.com" })]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: `tel:${settings?.contact_phone || "+18005553343"}`,
							className: "flex items-center gap-2.5 text-neutral-300 hover:text-[#d4ff00] transition-colors",
							children: [/* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-[#d4ff00]" }), /* @__PURE__ */ jsx("span", { children: settings?.contact_phone || "+1 (800) 555-EDGE" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 text-neutral-400 sm:col-span-2",
							children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-[#d4ff00]" }), /* @__PURE__ */ jsx("span", { children: settings?.office_address || "742 Evergreen Terrace, Creative District, SF" })]
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
						className: "text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-[#d4ff00] transition-colors flex items-center gap-1",
						children: [/* @__PURE__ */ jsx("span", { children: social }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })]
					}, social))
				})]
			})]
		})]
	});
}
//#endregion
//#region resources/js/Components/UI/CursorFollower.tsx
function CursorFollower() {
	const [position, setPosition] = useState({
		x: -100,
		y: -100
	});
	const [isHovered, setIsHovered] = useState(false);
	const [isClicking, setIsClicking] = useState(false);
	const [label, setLabel] = useState(null);
	const [isVisible, setIsVisible] = useState(false);
	const [isIdle, setIsIdle] = useState(false);
	useEffect(() => {
		if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let idleTimer;
		const onMouseMove = (e) => {
			setPosition({
				x: e.clientX,
				y: e.clientY
			});
			if (!isVisible) setIsVisible(true);
			setIsIdle(false);
			clearTimeout(idleTimer);
			idleTimer = setTimeout(() => {
				setIsIdle(true);
			}, 2500);
			const target = e.target;
			if (target) {
				const interactive = target.closest("a, button, [role=\"button\"], input, textarea, .cursor-interactive");
				const viewTarget = target.closest("[data-cursor-view]");
				if (viewTarget) {
					setIsHovered(true);
					setLabel(viewTarget.getAttribute("data-cursor-view") || "VIEW");
				} else if (interactive) {
					setIsHovered(true);
					setLabel(null);
				} else {
					setIsHovered(false);
					setLabel(null);
				}
			}
		};
		const onMouseDown = () => setIsClicking(true);
		const onMouseUp = () => setIsClicking(false);
		const onMouseLeave = () => {
			setIsVisible(false);
			setIsIdle(true);
		};
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mouseup", onMouseUp);
		document.documentElement.addEventListener("mouseleave", onMouseLeave);
		return () => {
			clearTimeout(idleTimer);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mouseup", onMouseUp);
			document.documentElement.removeEventListener("mouseleave", onMouseLeave);
		};
	}, [isVisible]);
	if (!isVisible) return null;
	return /* @__PURE__ */ jsxs("aside", {
		"aria-hidden": "true",
		className: `pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block transition-opacity duration-300 ${isIdle ? "opacity-0" : "opacity-100"}`,
		children: [/* @__PURE__ */ jsx("div", {
			className: `fixed top-0 left-0 rounded-full flex items-center justify-center font-display text-[10px] font-bold tracking-widest uppercase transition-all duration-150 ease-out ${label ? "w-20 h-20 bg-[#d4ff00] text-black shadow-lg shadow-[#d4ff00]/40 scale-100" : isHovered ? "w-12 h-12 border-2 border-[#d4ff00] bg-[#d4ff00]/10 backdrop-blur-[2px] scale-110" : isClicking ? "w-7 h-7 border border-[#d4ff00] bg-[#d4ff00]/30 scale-90" : "w-8 h-8 border border-white/20 dark:border-white/30"}`,
			style: { transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)` },
			children: label && /* @__PURE__ */ jsx("span", { children: label })
		}), !label && /* @__PURE__ */ jsx("div", {
			className: "fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#d4ff00] transition-transform duration-75 ease-out",
			style: { transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)` }
		})]
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
				lerp: .09,
				wheelMultiplier: 1,
				touchMultiplier: 1.5,
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
//#region resources/js/Layouts/AppLayout.tsx
function AppLayout({ children }) {
	const { settings, flash } = usePage().props;
	const [isContactOpen, setIsContactOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	useSmoothScroll();
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen flex flex-col bg-[#0a0b0e] text-[#f4f5f8] relative selection:bg-[#d4ff00] selection:text-black",
		children: [
			/* @__PURE__ */ jsx(CursorFollower, {}),
			/* @__PURE__ */ jsx("a", {
				href: "#main-content",
				className: "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[1000] px-4 py-2 bg-[#d4ff00] text-black font-mono font-bold rounded-md shadow-lg",
				children: "Skip to main content"
			}),
			flash?.success && /* @__PURE__ */ jsx("div", {
				role: "alert",
				className: "fixed top-20 right-6 z-[90] bg-[#d4ff00] text-black px-5 py-3 rounded-xl font-mono text-xs font-bold shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2",
				children: /* @__PURE__ */ jsxs("span", { children: ["✓ ", flash.success] })
			}),
			/* @__PURE__ */ jsx(Header, {
				onOpenContact: () => setIsContactOpen(true),
				onOpenMobileMenu: () => setIsMobileMenuOpen(true),
				settings
			}),
			/* @__PURE__ */ jsx("main", {
				id: "main-content",
				className: "flex-1 w-full",
				children
			}),
			/* @__PURE__ */ jsx(Footer, {
				settings,
				onOpenContact: () => setIsContactOpen(true)
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
			})
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
			"./Pages/About.tsx": () => import("./assets/About-DNo7KDqP.js"),
			"./Pages/Admin/Dashboard.tsx": () => import("./assets/Dashboard-CaLjuC1d.js"),
			"./Pages/Blog/Index.tsx": () => import("./assets/Index-BxwCtltU.js"),
			"./Pages/Blog/Show.tsx": () => import("./assets/Show-BuTGy-wQ.js"),
			"./Pages/Careers/Index.tsx": () => import("./assets/Index-UfhDvLx-.js"),
			"./Pages/Careers/Show.tsx": () => import("./assets/Show-CCFV4Z-L.js"),
			"./Pages/Contact.tsx": () => import("./assets/Contact-4WLn7vZL.js"),
			"./Pages/Errors/404.tsx": () => import("./assets/404-BxtF8My5.js"),
			"./Pages/Faq.tsx": () => import("./assets/Faq-DBDoabi7.js"),
			"./Pages/Home.tsx": () => import("./assets/Home-Z1e2MY--.js"),
			"./Pages/Pricing.tsx": () => import("./assets/Pricing-_1a_ywWU.js"),
			"./Pages/Privacy.tsx": () => import("./assets/Privacy-DC_n0dd-.js"),
			"./Pages/Services/Index.tsx": () => import("./assets/Index-DOQSv2UF.js"),
			"./Pages/Services/Show.tsx": () => import("./assets/Show-Bte9XrKH.js"),
			"./Pages/Team/Index.tsx": () => import("./assets/Index-BgW5vUpt.js"),
			"./Pages/Team/Show.tsx": () => import("./assets/Show-ghpFx5_H.js"),
			"./Pages/Terms.tsx": () => import("./assets/Terms-B6q8Z3MW.js"),
			"./Pages/Work/Index.tsx": () => import("./assets/Index-ByZ2a6VU.js"),
			"./Pages/Work/Show.tsx": () => import("./assets/Show-CPf_3Lt7.js")
		}));
		const resolved = resolvedPageModule.default;
		if (resolved.layout === void 0) resolved.layout = (pageElement) => /* @__PURE__ */ jsx(AppLayout, { children: pageElement });
		return resolvedPageModule;
	},
	setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
}));
//#endregion
export {};
