import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, KeyRound, Lock, Mail } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { LandingLayout } from '@/Layouts/LandingLayout';

const PAGE_BACKGROUND =
    'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <div style={{ background: PAGE_BACKGROUND }} className="min-h-screen pb-20 pt-28 sm:pt-32">
            <SeoHead
                title="Set New Password — CuttingEdger"
                description="Choose a new password for your CuttingEdger account."
            />

            <div className="mx-auto max-w-md px-5">
                <div className="rounded-3xl border border-ink/10 bg-white p-7 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.14)] sm:p-9">
                    <div className="text-center">
                        <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <KeyRound className="h-5 w-5" />
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                            Security Update
                        </p>
                        <h1 className="mt-1.5 font-michroma text-2xl font-normal tracking-[0.06em] text-ink">
                            Set New Password
                        </h1>
                        <p className="mt-2 text-xs text-subtle">
                            Enter your account email and choose a strong new password (minimum 8 characters).
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                <Mail className="h-3.5 w-3.5 text-subtle" />
                                <span>Email Address</span>
                            </label>
                            <input
                                type="email"
                                required
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
                                <span>New Password</span>
                            </label>
                            <input
                                type="password"
                                required
                                autoFocus
                                minLength={8}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-white focus:outline-none"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs font-semibold text-rose-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                <Lock className="h-3.5 w-3.5 text-subtle" />
                                <span>Confirm New Password</span>
                            </label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Re-enter your new password"
                                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-white focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
                        >
                            <span>{processing ? 'Updating Password...' : 'Save New Password'}</span>
                            <ArrowRight size={14} />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-subtle hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Back to Sign In</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

ResetPassword.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;

