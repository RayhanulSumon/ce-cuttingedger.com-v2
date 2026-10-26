import React from "react";
import { useForm } from "@inertiajs/react";
import { SeoHead } from "@/Components/Common/SeoHead";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Terminal, Shield, Lock, Mail, ArrowRight } from "lucide-react";

export default function Login() {
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

            <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center p-4 selection:bg-accent selection:text-black">
                {/* Background grid accent */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                <div className="w-full max-w-md relative z-10 space-y-8">
                    {/* Brand header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent text-black font-black text-xl font-mono shadow-xl shadow-[#fbb718]/10">
                            CE
                        </div>
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-accent block">
                                [ STUDIO OPERATIONS // RESTRICTED ACCESS ]
                            </span>
                            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight mt-1">
                                Command Clearance.
                            </h1>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="p-8 rounded-3xl bg-[#0f1118] border border-white/10 shadow-2xl space-y-6">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
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
                                    className="bg-[#161922] border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-[#fbb718]"
                                />
                                {errors.email && (
                                    <p className="text-xs text-rose-400 font-mono">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-neutral-500" />
                                    <span>Master Passcode</span>
                                </label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="bg-[#161922] border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-[#fbb718]"
                                />
                                {errors.password && (
                                    <p className="text-xs text-rose-400 font-mono">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Checkbox */}
                            <div className="flex items-center justify-between text-xs pt-1">
                                <label className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-white transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData("remember", e.target.checked)
                                        }
                                        className="rounded border-white/20 bg-[#161922] text-accent focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span>Maintain Session</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-accent hover:bg-[#bde600] text-black font-semibold text-sm rounded-xl gap-2 mt-4"
                            >
                                <span>{processing ? "Authenticating..." : "Authorize Access"}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>

                    <div className="text-center">
                        <span className="text-[11px] font-mono text-neutral-500">
                            SECURED BY CUTTING EDGER OPS ENGINE
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = (page: React.ReactNode) => page;
