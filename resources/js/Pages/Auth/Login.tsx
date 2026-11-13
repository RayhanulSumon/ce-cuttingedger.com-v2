import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Lock, Mail, Sparkles } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { LandingLayout } from '@/Layouts/LandingLayout';

const PAGE_BACKGROUND =
    'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

interface LoginProps {
    intendedUrl?: string | null;
}

function GoogleIcon() {
    return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.3-2 3l3.2 2.5c1.9-1.7 3-4.3 3-7.4 0-.7-.1-1.4-.2-2H12z"
            />
            <path
                fill="#34A853"
                d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.9v2.6C4.6 19.8 8 22 12 22z"
            />
            <path
                fill="#4A90E2"
                d="M6.2 13.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.6H2.9C2.3 8.9 2 10.4 2 12s.3 3.1.9 4.4l3.3-2.6z"
            />
            <path
                fill="#FBBC05"
                d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 2.9 14.7 2 12 2 8 2 4.6 4.2 2.9 7.6l3.3 2.6c.8-2.5 3.1-4.3 5.8-4.3z"
            />
        </svg>
    );
}

export default function ClientLogin({ intendedUrl }: LoginProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login.submit'));
    };

    const isOrderingRedirect =
        intendedUrl &&
        (intendedUrl.includes('/digital-twins/order') ||
            intendedUrl.includes('/virtual-try-on/quote'));

    return (
        <div style={{ background: PAGE_BACKGROUND }} className="min-h-screen pb-20 pt-28 sm:pt-32">
            <SeoHead
                title="Client Sign In — CuttingEdger Studio Portal"
                description="Sign in to your CuttingEdger client account to order Digital Twins, request Virtual Try-On quotes, and manage your deliverables."
            />

            <div className="mx-auto max-w-md px-5">
                {isOrderingRedirect && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/25 bg-white/90 p-4 text-xs shadow-sm">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                            <p className="font-bold text-ink">Sign in required to place an order</p>
                            <p className="mt-0.5 text-subtle">
                                Please sign in or create a verified account to continue to your order specification and track it in your Client Panel.
                            </p>
                        </div>
                    </div>
                )}

                {flash?.success && (
                    <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-50 p-4 text-xs font-semibold text-rose-800">
                        {flash.error}
                    </div>
                )}

                <div className="rounded-3xl border border-ink/10 bg-white p-7 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.14)] sm:p-9">
                    <div className="text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                            Client Studio Portal
                        </p>
                        <h1 className="mt-1.5 font-michroma text-2xl font-normal tracking-[0.06em] text-ink">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-xs text-subtle">
                            Sign in to configure Digital Twins, request Virtual Try-On quotes, and manage your orders.
                        </p>
                    </div>

                    {/* Google Sign-In Button */}
                    <div className="mt-6">
                        <a
                            href={route('auth.google.redirect')}
                            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-ink/15 bg-white px-4 py-3 text-xs font-bold text-ink shadow-xs transition-all hover:border-ink/35 hover:bg-[#f8fafc]"
                        >
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </a>
                    </div>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-ink/10" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-subtle">
                            or sign in with email
                        </span>
                        <div className="h-px flex-1 bg-ink/10" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                <Mail className="h-3.5 w-3.5 text-subtle" />
                                <span>Work Email</span>
                            </label>
                            <input
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@brand.com"
                                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-white focus:outline-none"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs font-semibold text-rose-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                <Lock className="h-3.5 w-3.5 text-subtle" />
                                <span>Password</span>
                            </label>
                            <input
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••••••"
                                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-white focus:outline-none"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs font-semibold text-rose-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs">
                            <label className="flex cursor-pointer items-center gap-2 text-subtle hover:text-ink">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-ink/20 text-primary focus:ring-0"
                                />
                                <span>Keep me signed in</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="font-bold text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
                        >
                            <span>{processing ? 'Signing In...' : 'Sign In to Portal'}</span>
                            <ArrowRight size={14} />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-subtle">
                        New to CuttingEdger?{' '}
                        <Link
                            href="/register"
                            className="font-bold text-primary hover:underline"
                        >
                            Create a free client account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

ClientLogin.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;

