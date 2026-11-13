import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { SeoHead } from "@/Components/Common/SeoHead";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { CheckCircle2, Lock, Mail, ArrowRight } from "lucide-react";

export default function Login() {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.login.submit"));
    };

    return (
        <>
            <SeoHead title="Ops Portal Clearance — Sign In" />

            <div
                style={{
                    background:
                        "linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)",
                }}
                className="min-h-screen text-ink flex items-center justify-center p-4 selection:bg-primary selection:text-white"
            >
                <div className="w-full max-w-md relative z-10 space-y-8">
                    {/* Brand header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white font-black text-xl font-mono shadow-lg shadow-primary/20">
                            CE
                        </div>
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-primary block font-bold">
                                [ STUDIO OPERATIONS // ADMIN PORTAL ]
                            </span>
                            <h1 className="text-3xl font-display font-extrabold text-ink tracking-tight mt-1">
                                Command Clearance
                            </h1>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="rounded-2xl border border-rose-500/30 bg-rose-50 p-4 text-xs font-semibold text-rose-800">
                            {flash.error}
                        </div>
                    )}

                    {/* Login Card */}
                    <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.12)] space-y-6">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Clearance ID / Email</span>
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    placeholder="admin@cuttingedger.com"
                                    required
                                    autoFocus
                                    className="bg-[#f8fafc] border-slate-200 text-ink placeholder:text-slate-400 focus-visible:ring-primary"
                                />
                                {errors.email && (
                                    <p className="text-xs text-rose-600 font-mono">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Master Passcode</span>
                                </label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="bg-[#f8fafc] border-slate-200 text-ink placeholder:text-slate-400 focus-visible:ring-primary"
                                />
                                {errors.password && (
                                    <p className="text-xs text-rose-600 font-mono">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Checkbox & Forgot Password */}
                            <div className="flex items-center justify-between text-xs pt-1">
                                <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-ink transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData("remember", e.target.checked)
                                        }
                                        className="rounded border-slate-300 bg-white text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span>Maintain Session</span>
                                </label>
                                <Link
                                    href="/forgot-password?from=admin"
                                    className="font-semibold text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl gap-2 mt-4 shadow-md shadow-primary/20 cursor-pointer"
                            >
                                <span>{processing ? "Authenticating..." : "Authorize Access"}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>

                    <div className="text-center">
                        <span className="text-[11px] font-mono text-slate-500">
                            SECURED BY CUTTING EDGER OPS ENGINE
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = (page: React.ReactNode) => page;
