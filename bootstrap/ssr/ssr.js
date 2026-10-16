import { forwardRef, useEffect, useState } from "react";
import { Link, createInertiaApp, useForm, usePage } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
import { ArrowUp, ArrowUpRight, Check, Mail, MapPin, Menu, Moon, Phone, Send, Sun, X } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
//#region resources/js/Components/UI/Button.tsx
var Button = forwardRef(({ variant = "primary", size = "md", withArrow = false, href, isExternal = false, className = "", children, ...props }, ref) => {
	const baseClasses = `group relative inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 overflow-hidden select-none cursor-pointer ${{
		sm: "px-4 py-2 text-xs font-semibold tracking-wider uppercase",
		md: "px-6 py-3.5 text-xs md:text-sm font-bold tracking-wider uppercase",
		lg: "px-8 py-4 text-sm md:text-base font-bold tracking-wider uppercase"
	}[size]} ${{
		primary: "bg-[#d4ff00] text-black hover:bg-[#c2eb00] hover:shadow-[0_0_25px_rgba(212,255,0,0.35)] font-display active:scale-95",
		secondary: "bg-white/10 dark:bg-white/5 text-neutral-900 dark:text-white border border-black/10 dark:border-white/10 hover:border-[#d4ff00]/60 hover:text-[#d4ff00] dark:hover:text-[#d4ff00] backdrop-blur-md active:scale-95",
		outline: "border border-black/20 dark:border-white/20 text-neutral-900 dark:text-white hover:border-[#d4ff00] hover:text-[#d4ff00] bg-transparent active:scale-95",
		ghost: "text-neutral-700 dark:text-neutral-300 hover:text-[#d4ff00] dark:hover:text-[#d4ff00] bg-transparent"
	}[variant]} ${className}`;
	const content = /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("span", {
		className: "relative z-10 flex items-center gap-2",
		children: [children, withArrow && /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
	}) });
	if (href) {
		if (isExternal) return /* @__PURE__ */ jsx("a", {
			href,
			target: "_blank",
			rel: "noopener noreferrer",
			className: baseClasses,
			children: content
		});
		return /* @__PURE__ */ jsx(Link, {
			href,
			className: baseClasses,
			children: content
		});
	}
	return /* @__PURE__ */ jsx("button", {
		ref,
		className: baseClasses,
		...props,
		children: content
	});
});
Button.displayName = "Button";
//#endregion
//#region resources/js/Layouts/Header.tsx
function Header({ onOpenContact, onOpenMobileMenu, settings }) {
	const { url } = usePage();
	const [isScrolled, setIsScrolled] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) setIsScrolled(true);
			else setIsScrolled(false);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	const navItems = [
		{
			label: "Work",
			href: "/work"
		},
		{
			label: "Services",
			href: "/services"
		},
		{
			label: "About",
			href: "/about"
		},
		{
			label: "Team",
			href: "/team"
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
		className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-3.5 bg-[#0a0b0e]/85 dark:bg-[#0a0b0e]/90 light:bg-white/85 backdrop-blur-xl border-b border-black/5 dark:border-white/10 shadow-sm" : "py-6 bg-transparent"}`,
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ jsxs(Link, {
						href: "/",
						className: "group flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#d4ff00] rounded-lg",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-display font-black text-xl sm:text-2xl tracking-tighter text-neutral-900 dark:text-white transition-colors",
								children: settings?.brand_name || "CUTTING"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-display font-black text-xl sm:text-2xl tracking-tighter text-[#d4ff00]",
								children: "EDGER."
							}),
							/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse ml-0.5" })
						]
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "hidden lg:flex items-center gap-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md",
						children: navItems.map((item) => {
							const active = isActive(item.href);
							return /* @__PURE__ */ jsx(Link, {
								href: item.href,
								className: `relative px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded-full ${active ? "text-[#d4ff00] bg-black/20 dark:bg-white/10" : "text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-[#d4ff00]"}`,
								children: item.label
							}, item.href);
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx(ThemeToggle, {}),
							/* @__PURE__ */ jsxs(Button, {
								variant: "primary",
								size: "sm",
								onClick: onOpenContact,
								className: "hidden sm:inline-flex",
								children: [/* @__PURE__ */ jsx("span", { children: "Let's talk" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onOpenMobileMenu,
								"aria-label": "Open mobile navigation menu",
								className: "p-2.5 rounded-full border border-black/10 dark:border-white/15 bg-white/5 dark:bg-white/5 text-neutral-800 dark:text-neutral-200 hover:text-[#d4ff00] hover:border-[#d4ff00] lg:hidden transition-colors",
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
function Footer({ settings }) {
	const { data, setData, post, processing, wasSuccessful, reset } = useForm({ email: "" });
	const handleNewsletterSubmit = (e) => {
		e.preventDefault();
		post("/newsletter", {
			preserveScroll: true,
			onSuccess: () => reset()
		});
	};
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	return /* @__PURE__ */ jsxs("footer", {
		className: "relative bg-[#0a0b0e] text-white border-t border-white/10 pt-20 pb-12 overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4ff00]/10 rounded-full blur-[140px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "pb-16 border-b border-white/10",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-4",
						children: "Ready To Transform Your Category?"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col lg:flex-row lg:items-end justify-between gap-8",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.05] max-w-3xl",
							children: [
								"Let’s engineer something",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-[#d4ff00] underline decoration-[#d4ff00]/40 underline-offset-8",
									children: "unforgettable"
								}),
								" ",
								"together."
							]
						}), /* @__PURE__ */ jsxs("a", {
							href: `mailto:${settings?.contact_email || "hello@cuttingedger.com"}`,
							className: "group inline-flex items-center gap-3 text-lg sm:text-xl font-mono text-neutral-300 hover:text-[#d4ff00] transition-colors",
							children: [/* @__PURE__ */ jsx("span", { children: settings?.contact_email || "hello@cuttingedger.com" }), /* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-full border border-white/20 group-hover:border-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black flex items-center justify-center transition-all",
								children: /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-5 h-5" })
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-white/10",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-2 space-y-4",
							children: [
								/* @__PURE__ */ jsxs(Link, {
									href: "/",
									className: "font-display font-extrabold text-2xl tracking-tighter",
									children: [/* @__PURE__ */ jsx("span", { children: "CUTTING" }), /* @__PURE__ */ jsx("span", {
										className: "text-[#d4ff00]",
										children: "EDGER."
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-400 text-sm max-w-sm leading-relaxed",
									children: settings?.tagline || "A next-generation digital agency engineering tactile brand identities, kinetic software interfaces, and radical web experiences."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs text-neutral-500 uppercase block mb-2",
										children: "Headquartered in"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-sm text-neutral-300 font-medium",
										children: settings?.office_address || "San Francisco & London"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4",
							children: "Index"
						}), /* @__PURE__ */ jsx("ul", {
							className: "space-y-2.5 text-sm",
							children: [
								"Work",
								"Services",
								"About",
								"Team",
								"Careers",
								"Pricing"
							].map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
								href: `/${item.toLowerCase()}`,
								className: "text-neutral-400 hover:text-[#d4ff00] transition-colors",
								children: item
							}) }, item))
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4",
							children: "Socials"
						}), /* @__PURE__ */ jsx("ul", {
							className: "space-y-2.5 text-sm",
							children: [
								{
									name: "Twitter / X",
									url: "https://twitter.com"
								},
								{
									name: "Instagram",
									url: "https://instagram.com"
								},
								{
									name: "LinkedIn",
									url: "https://linkedin.com"
								},
								{
									name: "Dribbble",
									url: "https://dribbble.com"
								},
								{
									name: "GitHub",
									url: "https://github.com"
								}
							].map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
								href: s.url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-neutral-400 hover:text-[#d4ff00] transition-colors inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx("span", { children: s.name }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3 opacity-60" })]
							}) }, s.name))
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("h4", {
								className: "font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4",
								children: "Dispatch"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-neutral-400 mb-3",
								children: "Quarterly digest on design theory, kinetic web engineering, and product velocity."
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleNewsletterSubmit,
								className: "space-y-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("input", {
										type: "email",
										required: true,
										value: data.email,
										onChange: (e) => setData("email", e.target.value),
										placeholder: "your@email.com",
										className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4ff00] transition-colors pr-10"
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: processing,
										"aria-label": "Subscribe to newsletter",
										className: "absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-[#d4ff00] text-black hover:bg-[#c2eb00] transition-colors",
										children: wasSuccessful ? /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5" })
									})]
								}), wasSuccessful && /* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-mono text-[#d4ff00] block",
									children: "Subscribed successfully."
								})]
							})
						] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-6",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" CuttingEdger Inc. All rights reserved."
							] }),
							/* @__PURE__ */ jsx(Link, {
								href: "/privacy",
								className: "hover:text-neutral-300 transition-colors",
								children: "Privacy Policy"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/terms",
								className: "hover:text-neutral-300 transition-colors",
								children: "Terms of Service"
							})
						]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: scrollToTop,
						"aria-label": "Scroll back to top",
						className: "inline-flex items-center gap-2 text-neutral-400 hover:text-[#d4ff00] transition-colors cursor-pointer",
						children: [/* @__PURE__ */ jsx("span", { children: "Back to top" }), /* @__PURE__ */ jsx("div", {
							className: "p-1 rounded-full border border-white/20",
							children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-3.5 h-3.5" })
						})]
					})]
				})
			]
		})]
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
	useEffect(() => {
		if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const onMouseMove = (e) => {
			setPosition({
				x: e.clientX,
				y: e.clientY
			});
			if (!isVisible) setIsVisible(true);
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
		const onMouseLeave = () => setIsVisible(false);
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mouseup", onMouseUp);
		document.documentElement.addEventListener("mouseleave", onMouseLeave);
		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mouseup", onMouseUp);
			document.documentElement.removeEventListener("mouseleave", onMouseLeave);
		};
	}, [isVisible]);
	if (!isVisible) return null;
	return /* @__PURE__ */ jsxs("aside", {
		"aria-hidden": "true",
		className: "pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block",
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
function useSmoothScroll() {
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const lenis = new Lenis({
			duration: 1.1,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			touchMultiplier: 1.5,
			wheelMultiplier: .9,
			smoothWheel: true
		});
		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		const animationFrameId = requestAnimationFrame(raf);
		return () => {
			cancelAnimationFrame(animationFrameId);
			lenis.destroy();
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
			/* @__PURE__ */ jsx(Footer, { settings }),
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
			"./Pages/Home.tsx": () => import("./assets/Home-BJekxxdu.js"),
			"./Pages/Pricing.tsx": () => import("./assets/Pricing-_1a_ywWU.js"),
			"./Pages/Privacy.tsx": () => import("./assets/Privacy-DC_n0dd-.js"),
			"./Pages/Services/Index.tsx": () => import("./assets/Index-DOQSv2UF.js"),
			"./Pages/Services/Show.tsx": () => import("./assets/Show-Bte9XrKH.js"),
			"./Pages/Team/Index.tsx": () => import("./assets/Index-BgW5vUpt.js"),
			"./Pages/Team/Show.tsx": () => import("./assets/Show-DeA1iJSB.js"),
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
export { Button as t };
