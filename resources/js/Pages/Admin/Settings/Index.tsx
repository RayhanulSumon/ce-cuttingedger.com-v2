import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { cn } from "@/lib/utils";
import { NotificationEmailsSection } from "@/Components/Admin/Settings/NotificationEmailsSection";
import { Save, Globe, Search, Phone, Share2, ChevronDown } from "lucide-react";

interface SettingItem {
    id: number;
    key: string;
    value: string | null;
    group: string;
    description?: string;
}

interface SettingsIndexProps {
    settings: SettingItem[];
    adminNotificationRecipients: string[];
}

type SettingGroupId = "brand" | "contact" | "notifications" | "seo" | "integrations";

const LABEL_CLASS = "text-xs font-semibold text-ink-2 block mb-1.5";
const GROUP_IDS: SettingGroupId[] = ["brand", "contact", "notifications", "seo", "integrations"];

export default function SettingsIndex({ settings = [], adminNotificationRecipients = [] }: SettingsIndexProps) {
    const initialMap: Record<string, string> = {};
    settings.forEach((s) => {
        initialMap[s.key] = s.value || "";
    });

    const [openGroups, setOpenGroups] = useState<Record<SettingGroupId, boolean>>({
        brand: true,
        contact: false,
        notifications: false,
        seo: false,
        integrations: false,
    });

    const { data, setData, post, processing, isDirty, errors } = useForm({
        settings: {
            brand_name: initialMap["brand_name"] || "Cutting Edger",
            tagline:
                initialMap["tagline"] ||
                "AI-Driven Visual Performance & Post-Production Agency.",
            contact_email: initialMap["contact_email"] || "info@cuttingedger.com",
            contact_phones: initialMap["contact_phones"] ?? "USA | +1 (409) 995-2565",
            whatsapp_number: initialMap["whatsapp_number"] ?? "",
            admin_notification_emails:
                initialMap["admin_notification_emails"] ?? adminNotificationRecipients.join("\n"),
            office_address:
                initialMap["office_address"] ||
                "Artisan Center, Level-7, House# 57/9, West Panthapath, Dhaka 1215",
            default_meta_title:
                initialMap["default_meta_title"] ||
                "Cutting Edger — AI-Driven Visual Performance Agency",
            default_meta_description:
                initialMap["default_meta_description"] ||
                "High-volume e-commerce catalog retouching, color standardization, white-label agency bandwidth, and 3D CGI virtual production studio.",
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
            notifications: next,
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
                    className="min-h-10 sm:min-h-9 border-line bg-surface text-xs font-semibold text-ink-2 hover:bg-surface-2 cursor-pointer"
                >
                    {allOpen ? "Collapse All" : "Expand All"}
                </Button>
            </AdminPageHeader>

            <form onSubmit={submit} className="max-w-4xl space-y-4 pb-8">
                {/* Group 1: Brand Identity */}
                <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
                    <button
                        type="button"
                        onClick={() => toggleGroup("brand")}
                        aria-expanded={openGroups.brand}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-2 sm:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <Globe className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-ink">Brand Identity</h2>
                                <p className="truncate text-xs text-subtle">
                                    Brand name and homepage tagline
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className="hidden rounded-full bg-surface-2 px-2.5 py-0.5 text-2xs font-semibold text-muted sm:inline-block">
                                2 fields
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-faint transition-transform duration-200",
                                    openGroups.brand ? "rotate-180" : ""
                                )}
                            />
                        </div>
                    </button>

                    {openGroups.brand && (
                        <div className="space-y-4 border-t border-line px-4 py-5 sm:px-6">
                            <div>
                                <label className={LABEL_CLASS}>Brand Name *</label>
                                <Input
                                    value={data.settings.brand_name}
                                    onChange={(e) => updateSetting("brand_name", e.target.value)}
                                    className="bg-surface border-line text-ink"
                                    required
                                />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Tagline *</label>
                                <Textarea
                                    value={data.settings.tagline}
                                    onChange={(e) => updateSetting("tagline", e.target.value)}
                                    rows={2}
                                    className="bg-surface border-line text-ink"
                                    required
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Group 2: Contact & Studio Details */}
                <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
                    <button
                        type="button"
                        onClick={() => toggleGroup("contact")}
                        aria-expanded={openGroups.contact}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-2 sm:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success-soft text-success">
                                <Phone className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-ink">Contact &amp; Studio Details</h2>
                                <p className="truncate text-xs text-subtle">
                                    Email, phone numbers, WhatsApp, and office address
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className="hidden rounded-full bg-surface-2 px-2.5 py-0.5 text-2xs font-semibold text-muted sm:inline-block">
                                4 fields
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-faint transition-transform duration-200",
                                    openGroups.contact ? "rotate-180" : ""
                                )}
                            />
                        </div>
                    </button>

                    {openGroups.contact && (
                        <div className="space-y-4 border-t border-line px-4 py-5 sm:px-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={LABEL_CLASS}>Contact Email *</label>
                                    <Input
                                        type="email"
                                        value={data.settings.contact_email}
                                        onChange={(e) => updateSetting("contact_email", e.target.value)}
                                        className="bg-surface border-line text-ink"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLASS}>WhatsApp Number (digits only)</label>
                                    <Input
                                        placeholder="8801700000000"
                                        value={data.settings.whatsapp_number}
                                        onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
                                        className="bg-surface border-line text-ink"
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
                                    className="bg-surface border-line text-ink"
                                />
                            </div>

                            <div>
                                <label className={LABEL_CLASS}>Office Address</label>
                                <Input
                                    value={data.settings.office_address}
                                    onChange={(e) => updateSetting("office_address", e.target.value)}
                                    className="bg-surface border-line text-ink"
                                />
                            </div>
                        </div>
                    )}
                </section>

                <NotificationEmailsSection
                    open={openGroups.notifications}
                    onToggle={() => toggleGroup("notifications")}
                    value={data.settings.admin_notification_emails}
                    onChange={(value) => updateSetting("admin_notification_emails", value)}
                    error={(errors as Record<string, string | undefined>)["settings.admin_notification_emails"]}
                />

                {/* Group 3: SEO & Search Crawlers */}
                <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
                    <button
                        type="button"
                        onClick={() => toggleGroup("seo")}
                        aria-expanded={openGroups.seo}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-2 sm:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-info-soft text-info">
                                <Search className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-ink">SEO &amp; Search Crawlers</h2>
                                <p className="truncate text-xs text-subtle">
                                    Default meta title and meta description
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className="hidden rounded-full bg-surface-2 px-2.5 py-0.5 text-2xs font-semibold text-muted sm:inline-block">
                                2 fields
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-faint transition-transform duration-200",
                                    openGroups.seo ? "rotate-180" : ""
                                )}
                            />
                        </div>
                    </button>

                    {openGroups.seo && (
                        <div className="space-y-4 border-t border-line px-4 py-5 sm:px-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={LABEL_CLASS}>Default Meta Title</label>
                                    <Input
                                        value={data.settings.default_meta_title}
                                        onChange={(e) =>
                                            updateSetting("default_meta_title", e.target.value)
                                        }
                                        placeholder="Brand — Tagline"
                                        className="bg-surface border-line text-ink"
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
                                        className="bg-surface border-line text-ink"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Group 4: Booking & Social Links */}
                <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
                    <button
                        type="button"
                        onClick={() => toggleGroup("integrations")}
                        aria-expanded={openGroups.integrations}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-2 sm:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning">
                                <Share2 className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-ink">Booking &amp; Social Links</h2>
                                <p className="truncate text-xs text-subtle">
                                    Calendly booking link and social media URLs
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className="hidden rounded-full bg-surface-2 px-2.5 py-0.5 text-2xs font-semibold text-muted sm:inline-block">
                                4 fields
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-faint transition-transform duration-200",
                                    openGroups.integrations ? "rotate-180" : ""
                                )}
                            />
                        </div>
                    </button>

                    {openGroups.integrations && (
                        <div className="space-y-4 border-t border-line px-4 py-5 sm:px-6">
                            <div>
                                <label className={LABEL_CLASS}>Calendly 30-Minute Booking URL *</label>
                                <Input
                                    type="url"
                                    value={data.settings.calendly_url}
                                    onChange={(e) => updateSetting("calendly_url", e.target.value)}
                                    placeholder="https://calendly.com/your-brand/30min"
                                    className="bg-surface border-line text-ink"
                                    required
                                />
                                <p className="mt-1.5 text-xs text-subtle">
                                    Embedded on <code className="font-mono text-ink-2">/book-a-demo</code> and sent in pilot order and inquiry confirmation emails.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className={LABEL_CLASS}>LinkedIn URL</label>
                                    <Input
                                        type="url"
                                        value={data.settings.social_linkedin}
                                        onChange={(e) => updateSetting("social_linkedin", e.target.value)}
                                        placeholder="https://linkedin.com/..."
                                        className="bg-surface border-line text-ink"
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLASS}>X / Twitter URL</label>
                                    <Input
                                        type="url"
                                        value={data.settings.social_twitter}
                                        onChange={(e) => updateSetting("social_twitter", e.target.value)}
                                        placeholder="https://x.com/..."
                                        className="bg-surface border-line text-ink"
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLASS}>Instagram URL</label>
                                    <Input
                                        type="url"
                                        value={data.settings.social_instagram}
                                        onChange={(e) => updateSetting("social_instagram", e.target.value)}
                                        placeholder="https://instagram.com/..."
                                        className="bg-surface border-line text-ink"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Sticky Bottom Save Bar */}
                <div className="sticky bottom-3 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-surface/95 px-4 sm:px-5 py-3 shadow-md backdrop-blur-md">
                    <span className="text-xs font-medium text-muted">
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
                        className="min-h-11 sm:min-h-10 w-full sm:w-auto gap-2 px-6 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer"
                    >
                        <Save className="h-4 w-4" />
                        <span>{processing ? "Saving..." : "Save Settings"}</span>
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
