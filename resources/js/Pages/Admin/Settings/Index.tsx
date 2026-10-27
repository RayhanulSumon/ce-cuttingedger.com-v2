import React from "react";
import { useForm } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Save, Globe, Shield, Terminal, Search, Calendar, Share2 } from "lucide-react";

interface SettingItem {
    id: number;
    key: string;
    value: string | null;
    group: string;
    description?: string;
}

interface SettingsIndexProps {
    settings: SettingItem[];
}

export default function SettingsIndex({ settings = [] }: SettingsIndexProps) {
    const initialMap: Record<string, string> = {};
    settings.forEach((s) => {
        initialMap[s.key] = s.value || "";
    });

    const { data, setData, post, processing } = useForm({
        settings: {
            brand_name: initialMap["brand_name"] || "Cutting Edger",
            tagline:
                initialMap["tagline"] ||
                "AI-Driven Visual Performance & Post-Production Agency.",
            contact_email: initialMap["contact_email"] || "hello@cuttingedger.com",
            contact_phone: initialMap["contact_phone"] || "+1 (409) 995-2565",
            office_address:
                initialMap["office_address"] ||
                "Artisan Center, Level-7, House# 57/9, West Panthapath, Dhaka 1215",
            // SEO & Indexing
            default_meta_title:
                initialMap["default_meta_title"] ||
                "Cutting Edger — AI-Driven Visual Performance Agency",
            default_meta_description:
                initialMap["default_meta_description"] ||
                "High-volume e-commerce catalog retouching, color standardization, white-label agency bandwidth, and 3D CGI virtual production studio.",
            robots_txt_content:
                initialMap["robots_txt_content"] ||
                "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /thank-you\n\nSitemap: https://cuttingedger.com/sitemap.xml",
            // Lead Conversion & Scheduling
            calendly_url:
                initialMap["calendly_url"] ||
                "https://calendly.com/cuttingedger/discovery-call",
            // Social Profiles for Organization Schema
            social_linkedin:
                initialMap["social_linkedin"] ||
                "https://linkedin.com/company/cutting-edger",
            social_twitter:
                initialMap["social_twitter"] ||
                "https://twitter.com/cutting_edger",
            social_instagram:
                initialMap["social_instagram"] ||
                "https://instagram.com/cuttingedgerinc",
        },
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.settings.update"));
    };

    return (
        <AdminLayout title="SYSTEM ARCHITECTURE // SETTINGS">
            <AdminPageHeader
                title="System & Brand Settings"
                description="Governs global metadata, brand identity tags, search crawlers (robots.txt), and Calendly endpoints."
                badge="SUPER ADMIN ONLY"
            />

            <form onSubmit={submit} className="max-w-4xl space-y-8 pb-12">
                {/* 1. Brand Identity */}
                <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                        <Globe className="w-4 h-4 text-accent" />
                        <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                            Identity & Global Agency Metadata
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Global Brand Name
                            </label>
                            <Input
                                value={data.settings.brand_name}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        brand_name: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Mission & Tagline
                            </label>
                            <Textarea
                                value={data.settings.tagline}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        tagline: e.target.value,
                                    })
                                }
                                rows={2}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 2. SEO & Crawl Governance (Doc §3.3 & §3.11) */}
                <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                        <Search className="w-4 h-4 text-accent" />
                        <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                            Search Engine Optimization & Crawler Rules
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Default Meta Title Template
                                </label>
                                <Input
                                    value={data.settings.default_meta_title}
                                    onChange={(e) =>
                                        setData("settings", {
                                            ...data.settings,
                                            default_meta_title: e.target.value,
                                        })
                                    }
                                    placeholder="Brand — Tagline"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Default Meta Description
                                </label>
                                <Input
                                    value={data.settings.default_meta_description}
                                    onChange={(e) =>
                                        setData("settings", {
                                            ...data.settings,
                                            default_meta_description: e.target.value,
                                        })
                                    }
                                    placeholder="High-volume catalog retouching..."
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    robots.txt Direct Editor
                                </label>
                                <span className="text-[11px] font-mono text-accent">
                                    Live at /robots.txt
                                </span>
                            </div>
                            <Textarea
                                value={data.settings.robots_txt_content}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        robots_txt_content: e.target.value,
                                    })
                                }
                                rows={6}
                                className="font-mono text-xs bg-black/40 border-white/15 text-neutral-200"
                            />
                            <p className="text-[11px] text-neutral-500 font-mono">
                                Directly controls crawl directives and references the XML sitemap. Changes take effect instantly without deployment.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Lead Conversion & Discovery Calls (Doc §4.1 & §4.4) */}
                <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                        <Calendar className="w-4 h-4 text-accent" />
                        <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                            Lead Capture & Booking Integrations
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Calendly Discovery Call URL
                            </label>
                            <Input
                                type="url"
                                value={data.settings.calendly_url}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        calendly_url: e.target.value,
                                    })
                                }
                                placeholder="https://calendly.com/your-org/discovery-call"
                                required
                            />
                            <p className="text-[11px] text-neutral-500 font-mono">
                                Embedded on Thank-You page, Service CTAs, and in client confirmation emails.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. Contact Endpoints & Social Links */}
                <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                        <Terminal className="w-4 h-4 text-accent" />
                        <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                            Studio Coordinates & Organization Schema
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Inbound Leads Notification Email
                            </label>
                            <Input
                                type="email"
                                value={data.settings.contact_email}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        contact_email: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Studio Phone
                            </label>
                            <Input
                                value={data.settings.contact_phone}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        contact_phone: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-neutral-400">
                            Physical Headquarters Address
                        </label>
                        <Input
                            value={data.settings.office_address}
                            onChange={(e) =>
                                setData("settings", {
                                    ...data.settings,
                                    office_address: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                LinkedIn Profile
                            </label>
                            <Input
                                type="url"
                                value={data.settings.social_linkedin}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        social_linkedin: e.target.value,
                                    })
                                }
                                placeholder="https://linkedin.com/..."
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Twitter / X Profile
                            </label>
                            <Input
                                type="url"
                                value={data.settings.social_twitter}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        social_twitter: e.target.value,
                                    })
                                }
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Instagram Profile
                            </label>
                            <Input
                                type="url"
                                value={data.settings.social_instagram}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        social_instagram: e.target.value,
                                    })
                                }
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="gap-2 px-8 h-12 text-sm font-display font-bold uppercase tracking-wider bg-accent text-black hover:bg-accent-hover"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? "Saving..." : "Save Configuration"}</span>
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
