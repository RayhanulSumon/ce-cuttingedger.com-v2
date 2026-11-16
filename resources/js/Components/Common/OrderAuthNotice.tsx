import React from 'react';
import { Link } from '@inertiajs/react';
import { Lock, MailCheck } from 'lucide-react';
import { currentRedirectUrl, markAuthReturn } from '@/lib/orderDraft';

interface OrderAuthUser {
    name: string;
    email: string;
    email_verified_at?: string | null;
}

interface OrderAuthNoticeProps {
    user?: OrderAuthUser | null;
    fallbackPath: string;
    onBeforeNavigate?: () => void;
}

/**
 * Shown at the final submission step when a visitor is not signed in or has
 * not yet verified their email. Preserves their configured draft across auth.
 */
export function OrderAuthNotice({ user, fallbackPath, onBeforeNavigate }: OrderAuthNoticeProps) {
    if (user && user.email_verified_at) {
        return null;
    }

    const redirectParam = encodeURIComponent(currentRedirectUrl(fallbackPath));

    if (!user) {
        return (
            <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-4 text-xs">
                <div className="flex items-start gap-2.5">
                    <Lock size={15} className="mt-0.5 shrink-0 text-primary" />
                    <div className="space-y-2">
                        <p className="font-bold text-ink">Sign in required at final step</p>
                        <p className="leading-relaxed text-subtle">
                            Your selections are saved automatically. Sign in or create an account to submit and continue right where you left off.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            <Link
                                href={`/login?redirect=${redirectParam}`}
                                prefetch
                                onClick={() => {
                                    markAuthReturn();
                                    onBeforeNavigate?.();
                                }}
                                className="inline-flex items-center rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-primary"
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
                                className="inline-flex items-center rounded-full border border-ink/20 bg-white px-3.5 py-1.5 text-[11px] font-bold text-ink transition-colors hover:border-primary hover:text-primary"
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
        <div className="rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-xs">
            <div className="flex items-start gap-2.5">
                <MailCheck size={15} className="mt-0.5 shrink-0 text-amber-700" />
                <div className="space-y-2">
                    <p className="font-bold text-amber-950">Verify your email to submit</p>
                    <p className="leading-relaxed text-amber-900/80">
                        Your selections are saved automatically. Verify your email address and return here to submit your request.
                    </p>
                    <Link
                        href="/verify-email"
                        prefetch
                        onClick={() => {
                            markAuthReturn();
                            onBeforeNavigate?.();
                        }}
                        className="inline-flex items-center rounded-full bg-amber-900 px-3.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-amber-800"
                    >
                        Verify Email
                    </Link>
                </div>
            </div>
        </div>
    );
}
