import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Code2, Plus, Trash2, Power, Check, AlertCircle, Sparkles } from "lucide-react";

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
                actions={
                    <Button onClick={openCreate} className="gap-2 bg-accent text-black font-bold hover:bg-accent-hover">
                        <Plus className="w-4 h-4" />
                        <span>Add Tracking Script</span>
                    </Button>
                }
            />

            {/* Modal / Inline Drawer Form */}
            {isCreating && (
                <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-[#12141c] border border-accent/40 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-accent" />
                            <h2 className="text-lg font-display font-bold text-white">
                                {editingScript ? `Edit: ${editingScript.name}` : "Configure New Tracking Script"}
                            </h2>
                        </div>

                        {!editingScript && (
                            <div className="flex items-center gap-2 font-mono text-xs">
                                <span className="text-neutral-400">Presets:</span>
                                <button
                                    type="button"
                                    onClick={() => applyPreset("gtm")}
                                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300"
                                >
                                    + GTM
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset("clarity")}
                                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300"
                                >
                                    + Clarity
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset("gsc")}
                                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300"
                                >
                                    + Search Console
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5 sm:col-span-1">
                                <label className="text-xs font-mono uppercase text-neutral-400 font-bold">
                                    Script Label *
                                </label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="e.g. Google Tag Manager"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5 sm:col-span-1">
                                <label className="text-xs font-mono uppercase text-neutral-400 font-bold">
                                    Script Category
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData("type", e.target.value as any)}
                                    className="w-full px-4 py-2.5 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent"
                                >
                                    <option value="tag_manager">Tag Manager (GTM / Tealium)</option>
                                    <option value="analytics">Analytics (GA4 / Clarity / Plausible)</option>
                                    <option value="pixel">Ad Pixel (Meta / Google Ads / LinkedIn)</option>
                                    <option value="verification">Search Engine Verification Tag</option>
                                    <option value="custom">Custom Utility Script</option>
                                </select>
                            </div>

                            <div className="space-y-1.5 sm:col-span-1">
                                <label className="text-xs font-mono uppercase text-neutral-400 font-bold">
                                    HTML Injection Placement *
                                </label>
                                <select
                                    value={data.placement}
                                    onChange={(e) => setData("placement", e.target.value as any)}
                                    className="w-full px-4 py-2.5 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent"
                                >
                                    <option value="head">&lt;head&gt; (Standard for tags and verification)</option>
                                    <option value="body_start">Start of &lt;body&gt; (GTM noscript)</option>
                                    <option value="footer">End of &lt;body&gt; / Footer (Non-critical pixels)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400 font-bold">
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
                            {errors.code && <p className="text-xs text-red-400">{errors.code}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData("is_active", e.target.checked)}
                                    className="w-4 h-4 rounded accent-accent"
                                />
                                <span className="text-neutral-300">Active (Injected into HTML on live site)</span>
                            </label>

                            <div className="flex items-center gap-3">
                                <Button type="button" variant="outline" onClick={closeForm}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-accent text-black font-bold hover:bg-accent-hover">
                                    {processing ? "Persisting..." : editingScript ? "Update Script" : "Save & Activate"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Scripts Inventory Table */}
            <div className="rounded-2xl bg-[#12141c] border border-white/10 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs font-mono">
                    <thead className="border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-white/[0.02]">
                        <tr>
                            <th className="py-3.5 px-6">Script Label</th>
                            <th className="py-3.5 px-4">Placement</th>
                            <th className="py-3.5 px-4">Type</th>
                            <th className="py-3.5 px-4">State</th>
                            <th className="py-3.5 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {scripts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-neutral-500">
                                    No tracking or telemetry scripts configured yet. Click "Add Tracking Script" above.
                                </td>
                            </tr>
                        ) : (
                            scripts.map((script) => (
                                <tr key={script.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6 font-bold text-white">
                                        <div className="flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-accent" />
                                            <span>{script.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                                            &lt;{script.placement}&gt;
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-neutral-400 capitalize">
                                        {script.type.replace("_", " ")}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                script.is_active
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${script.is_active ? "bg-emerald-400" : "bg-neutral-500"}`} />
                                            <span>{script.is_active ? "Live" : "Disabled"}</span>
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(script.id)}
                                                className={`p-2 rounded-lg border transition-colors ${
                                                    script.is_active
                                                        ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                        : "border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
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
                                                className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
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
        </AdminLayout>
    );
}
