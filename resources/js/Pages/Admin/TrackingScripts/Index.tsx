import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Code2, Trash2, Power, Edit } from "lucide-react";

interface TrackingScript {
    id: number;
    name: string;
    type: string;
    placement: "head" | "body_start" | "footer";
    code: string;
    target_scope: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

interface TrackingScriptsProps {
    scripts: TrackingScript[];
}

export default function TrackingScriptsIndex({ scripts = [] }: TrackingScriptsProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingScript, setEditingScript] = useState<TrackingScript | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: "",
        type: "custom",
        placement: "head",
        code: "",
        target_scope: "all",
        is_active: true,
        sort_order: 0,
    });

    const openCreate = () => {
        setEditingScript(null);
        reset();
        setIsCreating(true);
    };

    const openEdit = (script: TrackingScript) => {
        setEditingScript(script);
        setData({
            name: script.name,
            type: script.type,
            placement: script.placement,
            code: script.code,
            target_scope: script.target_scope,
            is_active: script.is_active,
            sort_order: script.sort_order,
        });
        setIsCreating(true);
    };

    const closeForm = () => {
        setIsCreating(false);
        setEditingScript(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingScript) {
            put(route("admin.tracking-scripts.update", editingScript.id), {
                onSuccess: () => closeForm(),
            });
        } else {
            post(route("admin.tracking-scripts.store"), {
                onSuccess: () => closeForm(),
            });
        }
    };

    const handleToggle = (id: number) => {
        router.post(route("admin.tracking-scripts.toggle", id));
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Remove tracking script "${name}"? This takes effect immediately across all pages.`)) {
            router.delete(route("admin.tracking-scripts.destroy", id));
        }
    };

    // Quick preset templates
    const applyPreset = (preset: "gtm" | "clarity" | "gsc" | "pixel") => {
        if (preset === "gtm") {
            setData({
                name: "Google Tag Manager",
                type: "tag_manager",
                placement: "head",
                code: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->`,
                target_scope: "all",
                is_active: true,
                sort_order: 1,
            });
        } else if (preset === "clarity") {
            setData({
                name: "Microsoft Clarity Telemetry",
                type: "analytics",
                placement: "head",
                code: `<script type="text/javascript">
(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
</script>`,
                target_scope: "all",
                is_active: true,
                sort_order: 2,
            });
        } else if (preset === "gsc") {
            setData({
                name: "Search Console Verification Tag",
                type: "verification",
                placement: "head",
                code: `<meta name="google-site-verification" content="YOUR_VERIFICATION_STRING" />`,
                target_scope: "all",
                is_active: true,
                sort_order: 3,
            });
        }
    };

    return (
        <AdminLayout title="SEO & TRACKING SCRIPTS">
            <AdminPageHeader
                title="Scripts & Telemetry Management"
                description="Inject and manage Google Tag Manager, GA4, Microsoft Clarity, Meta pixels, and verification meta tags without codebase deployments."
                badge="MARKETING & SEO SELF-SERVE"
                actionLabel="Add Tracking Script"
                onActionClick={openCreate}
            />

            {/* Modal / Inline Drawer Form */}
            {isCreating && (
                <div className="mb-8 p-5 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-display font-bold text-ink">
                                {editingScript ? `Edit: ${editingScript.name}` : "Configure New Tracking Script"}
                            </h2>
                        </div>

                        {!editingScript && (
                            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                                <span className="text-slate-500">Presets:</span>
                                <button
                                    type="button"
                                    onClick={() => applyPreset("gtm")}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                                >
                                    + GTM
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset("clarity")}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                                >
                                    + Clarity
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset("gsc")}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                                >
                                    + Search Console
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5 sm:col-span-1">
                                <label className="text-xs font-mono uppercase text-slate-500 font-bold">
                                    Script Label *
                                </label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="e.g. Google Tag Manager"
                                    required
                                />
                                {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5 sm:col-span-1">
                                <label className="text-xs font-mono uppercase text-slate-500 font-bold">
                                    Script Category
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData("type", e.target.value as any)}
                                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm text-ink focus:outline-none focus:border-primary"
                                >
                                    <option value="tag_manager">Tag Manager (GTM / Tealium)</option>
                                    <option value="analytics">Analytics (GA4 / Clarity / Plausible)</option>
                                    <option value="pixel">Ad Pixel (Meta / Google Ads / LinkedIn)</option>
                                    <option value="verification">Search Engine Verification Tag</option>
                                    <option value="custom">Custom Utility Script</option>
                                </select>
                            </div>

                            <div className="space-y-1.5 sm:col-span-1">
                                <label className="text-xs font-mono uppercase text-slate-500 font-bold">
                                    HTML Injection Placement *
                                </label>
                                <select
                                    value={data.placement}
                                    onChange={(e) => setData("placement", e.target.value as any)}
                                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm text-ink focus:outline-none focus:border-primary"
                                >
                                    <option value="head">&lt;head&gt; (Standard for tags and verification)</option>
                                    <option value="body_start">Start of &lt;body&gt; (GTM noscript)</option>
                                    <option value="footer">End of &lt;body&gt; / Footer (Non-critical pixels)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-slate-500 font-bold">
                                Script / HTML Snippet *
                            </label>
                            <Textarea
                                rows={7}
                                value={data.code}
                                onChange={(e) => setData("code", e.target.value)}
                                placeholder="Paste your <script>...</script> or <meta ... /> tags here."
                                className="font-mono text-xs leading-relaxed"
                                required
                            />
                            {errors.code && <p className="text-xs text-rose-600">{errors.code}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData("is_active", e.target.checked)}
                                    className="w-4 h-4 rounded accent-primary"
                                />
                                <span className="text-slate-700">Active (Injected into HTML on live site)</span>
                            </label>

                            <div className="flex flex-wrap items-center justify-end gap-3">
                                <Button type="button" variant="outline" onClick={closeForm} className="min-h-10 sm:min-h-9">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="min-h-10 sm:min-h-9 bg-primary text-white font-bold hover:bg-primary-hover">
                                    {processing ? "Persisting..." : editingScript ? "Update Script" : "Save & Activate"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Mobile Card List (< md) */}
            <div className="md:hidden space-y-3">
                {scripts.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200/90 bg-white px-5 py-10 text-center text-xs font-mono text-slate-400 shadow-xs">
                        No tracking or telemetry scripts configured yet. Click "Add Tracking Script" above.
                    </div>
                ) : (
                    scripts.map((script) => (
                        <div
                            key={script.id}
                            className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1 flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-primary shrink-0" />
                                    <span className="font-bold text-sm text-ink break-words">
                                        {script.name}
                                    </span>
                                </div>
                                <span
                                    className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                        script.is_active
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-slate-100 text-slate-500 border-slate-200"
                                    }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${script.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                                    <span>{script.is_active ? "Live" : "Disabled"}</span>
                                </span>
                            </div>

                            <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 text-xs">
                                <div className="flex items-center justify-between gap-3 py-2">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        Placement
                                    </span>
                                    <span className="font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                        &lt;{script.placement}&gt;
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-2">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        Category
                                    </span>
                                    <span className="capitalize text-slate-700 font-medium">
                                        {script.type.replace("_", " ")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-2">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        Scope
                                    </span>
                                    <span className="uppercase font-mono text-slate-600">
                                        {script.target_scope || "all"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggle(script.id)}
                                    className={`min-h-11 px-3 text-xs font-semibold gap-1.5 ${
                                        script.is_active
                                            ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                            : "border-slate-200 text-slate-600"
                                    }`}
                                >
                                    <Power className="w-3.5 h-3.5" />
                                    <span>{script.is_active ? "Disable" : "Enable"}</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEdit(script)}
                                    className="min-h-11 px-3.5 text-xs font-semibold gap-1.5"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(script.id, script.name)}
                                    className="min-h-11 px-3 text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                                    title="Delete Script"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Scripts Inventory Table (md+) */}
            <div className="hidden md:block rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                        <thead className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-[#f8fafc]">
                            <tr>
                                <th className="py-3.5 px-6 font-semibold">Script Label</th>
                                <th className="py-3.5 px-4 font-semibold">Placement</th>
                                <th className="py-3.5 px-4 font-semibold">Type</th>
                                <th className="py-3.5 px-4 font-semibold">State</th>
                                <th className="py-3.5 px-6 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {scripts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">
                                        No tracking or telemetry scripts configured yet. Click "Add Tracking Script" above.
                                    </td>
                                </tr>
                            ) : (
                                scripts.map((script) => (
                                    <tr key={script.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-6 font-bold text-ink">
                                            <div className="flex items-center gap-2">
                                                <Code2 className="w-4 h-4 text-primary" />
                                                <span>{script.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                                                &lt;{script.placement}&gt;
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-slate-600 capitalize">
                                            {script.type.replace("_", " ")}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                    script.is_active
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-slate-100 text-slate-500 border-slate-200"
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${script.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                                                <span>{script.is_active ? "Live" : "Disabled"}</span>
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(script.id)}
                                                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                                        script.is_active
                                                            ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                            : "border-slate-200 text-slate-500 hover:text-ink hover:bg-slate-50"
                                                    }`}
                                                    title={script.is_active ? "Disable Script" : "Enable Script"}
                                                >
                                                    <Power className="w-3.5 h-3.5" />
                                                </button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEdit(script)}
                                                    className="h-8 px-2.5 text-xs"
                                                >
                                                    Edit
                                                </Button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(script.id, script.name)}
                                                    className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                    title="Delete Script"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
