import React from 'react';
import { Link } from '@inertiajs/react';
import { Lock, MailCheck } from 'lucide-react';
import { currentRedirectUrl, markAuthReturn } from '@/lib/orderDraft';

interface OrderAuthUser {
    name: string;
    email: string;
    email_verified_at?: string | null;
    role?: string | null;
}

interface OrderAuthNoticeProps {
    user?: OrderAuthUser | null;
    fallbackPath: string;
    onBeforeNavigate?: () => void;
}

/** True only when the signed-in user is a client (never an admin or super_admin). */
export function isClientUser(user?: { role?: string | null } | null): boolean {
    return Boolean(user && user.role !== 'super_admin' && user.role !== 'admin');
}

/** True only when a non-admin client has verified their email address. */
export function isVerifiedClient(user?: { role?: string | null; email_verified_at?: string | null } | null): boolean {
    return Boolean(isClientUser(user) && user?.email_verified_at);
}

/**
 * Shown at the final submission step when a visitor is not signed in as a client
 * or has not yet verified their email. Preserves their configured draft across auth.
 */
export function OrderAuthNotice({ user, fallbackPath, onBeforeNavigate }: OrderAuthNoticeProps) {
    if (isVerifiedClient(user)) {
        return null;
    }

    const redirectParam = encodeURIComponent(currentRedirectUrl(fallbackPath));
    const isAdminSession = Boolean(user && !isClientUser(user));

    if (!user || isAdminSession) {
        return (
            <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-4 text-xs">
                <div className="flex items-start gap-2.5">
                    <Lock size={15} className="mt-0.5 shrink-0 text-primary" />
                    <div className="space-y-2">
                        <p className="font-bold text-ink">
                            {isAdminSession ? 'Client account required to submit' : 'Sign in required at final step'}
                        </p>
                        <p className="leading-relaxed text-subtle">
                            {isAdminSession
                                ? 'You are currently signed in with an Admin account. Sign in with a client account or create one to submit this order.'
                                : 'Your selections are saved automatically. Sign in or create an account to submit and continue right where you left off.'}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            <Link
                                href={`/login?redirect=${redirectParam}`}
                                prefetch
                                onClick={() => {
                                    markAuthReturn();
                                    onBeforeNavigate?.();
                                }}
                                className="inline-flex items-center rounded-full bg-ink px-3.5 py-1.5 text-2xs font-bold text-surface transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                                Sign in to Continue
                            </Link>
                            <Link
                                href={`/register?redirect=${redirectParam}`}
                                prefetch
                                onClick={() => {
                                    markAuthReturn();
                                    onBeforeNavigate?.();
                                }}
                                className="inline-flex items-center rounded-full border border-ink/20 bg-surface px-3.5 py-1.5 text-2xs font-bold text-ink transition-colors hover:border-primary hover:text-primary-ink"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-warning/30 bg-warning-soft p-4 text-xs">
            <div className="flex items-start gap-2.5">
                <MailCheck size={15} className="mt-0.5 shrink-0 text-warning" />
                <div className="space-y-2">
                    <p className="font-bold text-warning">Verify your email to submit</p>
                    <p className="leading-relaxed text-warning/80">
                        Your selections are saved automatically. Verify your email address and return here to submit your request.
                    </p>
                    <Link
                        href="/verify-email"
                        prefetch
                        onClick={() => {
                            markAuthReturn();
                            onBeforeNavigate?.();
                        }}
                        className="inline-flex items-center rounded-full bg-warning px-3.5 py-1.5 text-2xs font-bold text-white transition-colors hover:bg-warning/90"
                    >
                        Verify Email
                    </Link>
                </div>
            </div>
        </div>
    );
}
