import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { cn } from "@/lib/utils";
import { Save, Globe, Search, Phone, Share2, ChevronDown, ExternalLink } from "lucide-react";

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

type SettingGroupId = "brand" | "contact" | "seo" | "integrations";

const LABEL_CLASS = "text-xs font-semibold text-slate-700 block mb-1.5";
const GROUP_IDS: SettingGroupId[] = ["brand", "contact", "seo", "integrations"];

export default function SettingsIndex({ settings = [] }: SettingsIndexProps) {
    const initialMap: Record<string, string> = {};
    settings.forEach((s) => {
        initialMap[s.key] = s.value || "";
    });

    const [openGroups, setOpenGroups] = useState<Record<SettingGroupId, boolean>>({
        brand: true,
        contact: false,
        seo: false,
        integrations: false,
    });

    const { data, setData, post, processing, isDirty } = useForm({
        settings: {
            brand_name: initialMap["brand_name"] || "Cutting Edger",
            tagline:
                initialMap["tagline"] ||
                "AI-Driven Visual Performance & Post-Production Agency.",
            contact_email: initialMap["contact_email"] || "info@cuttingedger.com",
            contact_phones: initialMap["contact_phones"] ?? "USA | +1 (409) 995-2565",
            whatsapp_number: initialMap["whatsapp_number"] ?? "",
            office_address:
                initialMap["office_address"] ||
                "Artisan Center, Level-7, House# 57/9, West Panthapath, Dhaka 1215",
            default_meta_title:
                initialMap["default_meta_title"] ||
                "Cutting Edger — AI-Driven Visual Performance Agency",
            default_meta_description:
                initialMap["default_meta_description"] ||
                "High-volume e-commerce catalog retouching, color standardization, white-label agency bandwidth, and 3D CGI virtual production studio.",
            robots_txt_content:
                initialMap["robots_txt_content"] ||
                "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /thank-you\n\nSitemap: https://cuttingedger.com/sitemap.xml",
            calendly_url:
                initialMap["calendly_url"] ||
                "https://calendly.com/cuttingedger/discovery-call",
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

    const updateSetting = (key: keyof typeof data.settings, value: string) => {
        setData("settings", {
            ...data.settings,
            [key]: value,
        });
    };

    const toggleGroup = (id: SettingGroupId) => {
        setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const allOpen = GROUP_IDS.every((id) => openGroups[id]);
    const toggleAll = () => {
        const next = !allOpen;
        setOpenGroups({
            brand: next,
            contact: next,
            seo: next,
            integrations: next,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.settings.update"), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Settings">
            <AdminPageHeader
                title="Settings"
                description="Manage brand identity, contact details, SEO defaults, and booking links."
                badge="Super Admin"
            >
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleAll}
                    className="min-h-10 sm:min-h-9 border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                    {allOpen ? "Collapse All" : "Expand All"}
                </Button>
            </AdminPageHeader>

            <form onSubmit={submit} className="max-w-4xl space-y-4 pb-8">
                {/* Group 1: Brand Identity */}
                <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                    <button
                        type="button"
                        onClick={() => toggleGroup("brand")}
                        aria-expanded={openGroups.brand}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50/80 sm:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <Globe className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-ink">Brand Identity</h2>
                                <p className="truncate text-xs text-slate-500">
                                    Brand name and homepage tagline
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className="hidden rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 sm:inline-block">
                                2 fields
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-slate-400 transition-transform duration-200",
                                    openGroups.brand ? "rotate-180" : ""
                                )}
                            />
                        </div>
                    </button>

                    {openGroups.brand && (
                        <div className="space-y-4 border-t border-slate-100 px-4 py-5 sm:px-6">
                            <div>
                                <label className={LABEL_CLASS}>Brand Name *</label>
                                <Input
                                    value={data.settings.brand_name}
                                    onChange={(e) => updateSetting("brand_name", e.target.value)}
                                    className="bg-white border-slate-200 text-ink"
                                    required
                                />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Tagline *</label>
                                <Textarea
                                    value={data.settings.tagline}
                                    onChange={(e) => updateSetting("tagline", e.target.value)}
                                    rows={2}
                                    className="bg-white border-slate-200 text-ink"
                                    required
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Group 2: Contact & Studio Details */}
                <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                    <button
                        type="button"
                        onClick={() => toggleGroup("contact")}
                        aria-expanded={openGroups.contact}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50/80 sm:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                                <Phone className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-ink">Contact &amp; Studio Details</h2>
                                <p className="truncate text-xs text-slate-500">
                                    Email, phone numbers, WhatsApp, and office address
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className="hidden rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 sm:inline-block">
                                4 fields
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-slate-400 transition-transform duration-200",
                                    openGroups.contact ? "rotate-180" : ""
                                )}
                            />
                        </div>
                    </button>

                    {openGroups.contact && (
                        <div className="space-y-4 border-t border-slate-100 px-4 py-5 sm:px-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={LABEL_CLASS}>Contact Email *</label>
                                    <Input
                                        type="email"
                                        value={data.settings.contact_email}
                                        onChange={(e) => updateSetting("contact_email", e.target.value)}
                                        className="bg-white border-slate-200 text-ink"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLASS}>WhatsApp Number (digits only)</label>
                                    <Input
                                        placeholder="8801700000000"
                                        value={data.settings.whatsapp_number}
                                        onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
                                        className="bg-white border-slate-200 text-ink"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={LABEL_CLASS}>
                                    Phone Numbers (one per line: Country | Number)
                                </label>
                                <Textarea
                                    rows={3}
                                    placeholder={"USA | +1 (409) 995-2565\nBD | +88 02 0000 0000"}
                                    value={data.settings.contact_phones}
                                    onChange={(e) => updateSetting("contact_phones", e.target.value)}
                                    className="bg-white border-slate-200 text-ink"
                                />
                            </div>

                            <div>
                                <label className={LABEL_CLASS}>Office Address</label>
                                <Input
                                    value={data.settings.office_address}
                                    onChange={(e) => updateSetting("office_address", e.target.value)}
                                    className="bg-white border-slate-200 text-ink"
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Group 3: SEO & Search Crawlers */}
                <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                    <button
                        type="button"
                        onClick={() => toggleGroup("seo")}
                        aria-expanded={openGroups.seo}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50/80 sm:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-700">
                                <Search className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-ink">SEO &amp; Search Crawlers</h2>
                                <p className="truncate text-xs text-slate-500">
                                    Default meta title, description, and live robots.txt
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className="hidden rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 sm:inline-block">
                                3 fields
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-slate-400 transition-transform duration-200",
                                    openGroups.seo ? "rotate-180" : ""
                                )}
                            />
                        </div>
                    </button>

                    {openGroups.seo && (
                        <div className="space-y-4 border-t border-slate-100 px-4 py-5 sm:px-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={LABEL_CLASS}>Default Meta Title</label>
                                    <Input
                                        value={data.settings.default_meta_title}
                                        onChange={(e) =>
                                            updateSetting("default_meta_title", e.target.value)
                                        }
                                        placeholder="Brand — Tagline"
                                        className="bg-white border-slate-200 text-ink"
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLASS}>Default Meta Description</label>
                                    <Input
                                        value={data.settings.default_meta_description}
                                        onChange={(e) =>
                                            updateSetting("default_meta_description", e.target.value)
                                        }
                                        placeholder="High-volume catalog retouching..."
                                        className="bg-white border-slate-200 text-ink"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-1.5 flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold text-slate-700">
                                        robots.txt Rules
                                    </label>
                                    <a
                                        href="/robots.txt"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                    >
                                        <span>View /robots.txt</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                                <Textarea
                                    value={data.settings.robots_txt_content}
                                    onChange={(e) =>
                                        updateSetting("robots_txt_content", e.target.value)
                                    }
                                    rows={6}
                                    className="font-mono text-xs bg-slate-50 border-slate-200 text-ink"
                                />
                                <p className="mt-1.5 text-xs text-slate-500">
                                    Takes effect immediately at /robots.txt without rebuilding.
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Group 4: Booking & Social Links */}
                <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                    <button
                        type="button"
                        onClick={() => toggleGroup("integrations")}
                        aria-expanded={openGroups.integrations}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50/80 sm:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
                                <Share2 className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-ink">Booking &amp; Social Links</h2>
                                <p className="truncate text-xs text-slate-500">
                                    Calendly discovery link and social media URLs
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className="hidden rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 sm:inline-block">
                                4 fields
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-slate-400 transition-transform duration-200",
                                    openGroups.integrations ? "rotate-180" : ""
                                )}
                            />
                        </div>
                    </button>

                    {openGroups.integrations && (
                        <div className="space-y-4 border-t border-slate-100 px-4 py-5 sm:px-6">
                            <div>
                                <label className={LABEL_CLASS}>Calendly Discovery Call URL *</label>
                                <Input
                                    type="url"
                                    value={data.settings.calendly_url}
                                    onChange={(e) => updateSetting("calendly_url", e.target.value)}
                                    placeholder="https://calendly.com/your-org/discovery-call"
                                    className="bg-white border-slate-200 text-ink"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className={LABEL_CLASS}>LinkedIn URL</label>
                                    <Input
                                        type="url"
                                        value={data.settings.social_linkedin}
                                        onChange={(e) => updateSetting("social_linkedin", e.target.value)}
                                        placeholder="https://linkedin.com/..."
                                        className="bg-white border-slate-200 text-ink"
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLASS}>X / Twitter URL</label>
                                    <Input
                                        type="url"
                                        value={data.settings.social_twitter}
                                        onChange={(e) => updateSetting("social_twitter", e.target.value)}
                                        placeholder="https://x.com/..."
                                        className="bg-white border-slate-200 text-ink"
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLASS}>Instagram URL</label>
                                    <Input
                                        type="url"
                                        value={data.settings.social_instagram}
                                        onChange={(e) => updateSetting("social_instagram", e.target.value)}
                                        placeholder="https://instagram.com/..."
                                        className="bg-white border-slate-200 text-ink"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Sticky Bottom Save Bar */}
                <div className="sticky bottom-3 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-4 sm:px-5 py-3 shadow-md backdrop-blur-md">
                    <span className="text-xs font-medium text-slate-600">
                        {isDirty ? (
                            <span className="font-semibold text-primary">
                                You have unsaved changes
                            </span>
                        ) : (
                            "All settings up to date"
                        )}
                    </span>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="min-h-11 sm:min-h-10 w-full sm:w-auto gap-2 px-6 text-xs font-bold bg-primary text-white hover:bg-primary-hover cursor-pointer"
                    >
                        <Save className="h-4 w-4" />
                        <span>{processing ? "Saving..." : "Save Settings"}</span>
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
