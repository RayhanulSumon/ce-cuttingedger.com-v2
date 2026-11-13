import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, ShieldAlert } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { LandingLayout } from '@/Layouts/LandingLayout';

const PAGE_BACKGROUND =
    'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

interface ForgotPasswordProps {
    from?: string;
}

export default function ForgotPassword({ from = 'client' }: ForgotPasswordProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const isAdminFlow = from === 'admin';

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div style={{ background: PAGE_BACKGROUND }} className="min-h-screen pb-20 pt-28 sm:pt-32">
            <SeoHead
                title="Reset Your Password — CuttingEdger"
                description="Request a secure password reset email link for your CuttingEdger Client or Admin account."
            />

            <div className="mx-auto max-w-md px-5">
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-50 p-4 text-xs font-semibold text-rose-800">
                        <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                        <span>{flash.error}</span>
                    </div>
                )}

                <div className="rounded-3xl border border-ink/10 bg-white p-7 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.14)] sm:p-9">
                    <div className="text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                            {isAdminFlow ? 'Admin Operations Recovery' : 'Account Recovery'}
                        </p>
                        <h1 className="mt-1.5 font-michroma text-2xl font-normal tracking-[0.06em] text-ink">
                            Forgot Password
                        </h1>
                        <p className="mt-2 text-xs text-subtle">
                            Enter the email address associated with your account and we will send you a secure link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                <Mail className="h-3.5 w-3.5 text-subtle" />
                                <span>Account Email Address</span>
                            </label>
                            <input
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder={isAdminFlow ? 'admin@cuttingedger.com' : 'you@brand.com'}
                                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-white focus:outline-none"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs font-semibold text-rose-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
                        >
                            <span>{processing ? 'Sending Reset Link...' : 'Email Password Reset Link'}</span>
                            <ArrowRight size={14} />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href={isAdminFlow ? '/admin/login' : '/login'}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-subtle hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>{isAdminFlow ? 'Back to Admin Sign In' : 'Back to Client Sign In'}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

ForgotPassword.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;

