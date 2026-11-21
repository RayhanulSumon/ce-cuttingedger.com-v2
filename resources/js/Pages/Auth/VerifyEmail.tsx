import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, LogOut, MailCheck, RefreshCw } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { LandingLayout } from '@/Layouts/LandingLayout';

const PAGE_BACKGROUND =
    'linear-gradient(90deg, var(--color-page) 0%, var(--color-surface-2) 55%, var(--color-surface) 100%)';

export default function VerifyEmail() {
    const { auth, flash } = usePage<{
        auth?: { user?: { name: string; email: string } | null };
        flash?: { success?: string; error?: string };
    }>().props;

    const { post, processing } = useForm({});

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div style={{ background: PAGE_BACKGROUND }} className="min-h-screen pb-20 pt-28 sm:pt-32">
            <SeoHead
                title="Verify Your Email — CuttingEdger Client Portal"
                description="Verify your email address to unlock Digital Twin ordering, Virtual Try-On quotes, and your Client Portal."
            />

            <div className="mx-auto max-w-md px-5">
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-success/25 bg-success-soft p-4 text-xs font-semibold text-success">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 rounded-2xl border border-danger/25 bg-danger-soft p-4 text-xs font-semibold text-danger">
                        {flash.error}
                    </div>
                )}

                <div className="rounded-3xl border border-ink/10 bg-surface p-7 text-center shadow-[0_18px_45px_-20px_rgba(15,23,42,0.14)] sm:p-9">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <MailCheck className="h-7 w-7" />
                    </div>

                    <p className="mt-4 text-2xs font-bold uppercase tracking-[0.2em] text-primary">
                        Email Verification Required
                    </p>
                    <h1 className="mt-1.5 font-display text-xl text-ink">
                        Check Your Inbox
                    </h1>

                    <p className="mt-3 text-xs leading-relaxed text-subtle">
                        We sent a verification link to{' '}
                        <strong className="text-ink">{auth?.user?.email}</strong>. Please click that link to verify your account and continue to your order or Client Panel.
                    </p>

                    <form onSubmit={handleResend} className="mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${processing ? 'animate-spin' : ''}`} />
                            <span>{processing ? 'Sending Link...' : 'Resend Verification Email'}</span>
                        </button>
                    </form>

                    <div className="mt-5 border-t border-ink/10 pt-4">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-subtle hover:text-danger"
                        >
                            <LogOut size={13} />
                            <span>Sign out or use a different account</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

VerifyEmail.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;

