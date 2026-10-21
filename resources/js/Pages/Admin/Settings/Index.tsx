import React from "react";
import { useForm } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Save, Globe, Shield, Terminal } from "lucide-react";

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
            brand_name: initialMap["brand_name"] || "CUTTING EDGER",
            contact_email: initialMap["contact_email"] || "hello@cuttingedger.com",
            contact_phone: initialMap["contact_phone"] || "+1 (800) 555-EDGE",
            tagline:
                initialMap["tagline"] ||
                "Crafting digital supremacy through kinetic engineering and radical design.",
            office_address:
                initialMap["office_address"] ||
                "742 Mission St, Design District, San Francisco, CA",
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
                description="Governs global metadata, brand identity tags, and studio contact endpoints."
                badge="SUPER ADMIN ONLY"
            />

            <form onSubmit={submit} className="max-w-3xl space-y-8">
                {/* Brand Identity */}
                <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                        <Globe className="w-4 h-4 text-[#d4ff00]" />
                        <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                            Identity & Global Metadata
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
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Endpoints */}
                <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                        <Terminal className="w-4 h-4 text-[#d4ff00]" />
                        <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                            Studio Communication Coordinates
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Contact Email
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
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="gap-2 px-6 h-11"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? "Saving..." : "Save Configuration"}</span>
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
