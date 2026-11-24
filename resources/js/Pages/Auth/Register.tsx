import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowRight, Building2, Eye, EyeOff, Lock, Mail, Phone, Shield, User } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { LandingLayout } from '@/Layouts/LandingLayout';

const PAGE_BACKGROUND = [
    'radial-gradient(ellipse 70% 50% at 50% 12%, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 70%)',
    'radial-gradient(ellipse 50% 40% at 85% 80%, color-mix(in srgb, var(--color-primary) 6%, transparent), transparent 60%)',
    'var(--color-page)',
].join(', ');

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

export default function ClientRegister() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register.submit'));
    };

    return (
        <div style={{ background: PAGE_BACKGROUND }} className="relative min-h-[calc(100vh-80px)] pb-20 pt-24 sm:pt-28 lg:pt-32">
            {/* Soft subtle grid for depth */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,var(--color-ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ink)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            />

            <SeoHead
                title="Create Client Account — CuttingEdger Studio Portal"
                description="Create a verified CuttingEdger client account via email or Google to order Digital Twins and place Virtual Try-On orders."
            />

            <div className="relative z-10 mx-auto max-w-[560px] px-4 sm:px-6">
                <div className="rounded-3xl border border-ink/10 bg-surface/95 p-7 sm:p-9 shadow-[0_24px_60px_-20px_rgba(16,17,20,0.12),0_1px_2px_rgba(16,17,20,0.04)] backdrop-blur-xl">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-2xs font-bold uppercase tracking-[0.18em] text-primary-ink">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>Client Studio Portal</span>
                        </div>

                        <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                            Create Your Account
                        </h1>
                        <p className="mt-1.5 text-xs sm:text-sm text-subtle leading-relaxed">
                            Sign up with Google or work email to place and track production orders.
                        </p>
                    </div>

                    {/* Google Sign-Up Button */}
                    <div className="mt-6">
                        <a
                            href={route('auth.google.redirect')}
                            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-ink/15 bg-surface px-4 py-3 text-xs font-bold text-ink shadow-xs transition-all hover:border-ink/35 hover:bg-surface-2 hover:-translate-y-0.5"
                        >
                            <GoogleIcon />
                            <span>Sign up with Google (Instant Verification)</span>
                        </a>
                    </div>

                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-ink/10" />
                        <span className="text-2xs font-bold uppercase tracking-widest text-subtle">
                            or register with work email
                        </span>
                        <div className="h-px flex-1 bg-ink/10" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                    <User className="h-3.5 w-3.5 text-subtle" />
                                    <span>Full Name *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Alex Rivera"
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-primary focus:bg-surface focus:outline-none"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs font-semibold text-danger">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                    <Mail className="h-3.5 w-3.5 text-subtle" />
                                    <span>Work Email *</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="alex@brand.com"
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-primary focus:bg-surface focus:outline-none"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs font-semibold text-danger">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                    <Building2 className="h-3.5 w-3.5 text-subtle" />
                                    <span>Brand / Company</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    placeholder="Atelier Studio"
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-primary focus:bg-surface focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                    <Phone className="h-3.5 w-3.5 text-subtle" />
                                    <span>Phone / WhatsApp</span>
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-primary focus:bg-surface focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                    <Lock className="h-3.5 w-3.5 text-subtle" />
                                    <span>Password *</span>
                                </label>
                                <div className="relative mt-1.5">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Min. 8 characters"
                                        className="w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 pr-10 text-sm text-ink transition-colors focus:border-primary focus:bg-surface focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink focus:outline-none"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs font-semibold text-danger">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                    <Lock className="h-3.5 w-3.5 text-subtle" />
                                    <span>Confirm Password *</span>
                                </label>
                                <div className="relative mt-1.5">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        placeholder="Repeat password"
                                        className="w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 pr-10 text-sm text-ink transition-colors focus:border-primary focus:bg-surface focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink focus:outline-none"
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
                        >
                            <span>
                                {processing
                                    ? 'Creating Account...'
                                    : 'Create Account & Send Verification'}
                            </span>
                            <ArrowRight size={14} />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-subtle">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-primary transition-colors hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>

                {/* Subtle Trust Indicators */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-2xs text-subtle">
                    <span className="inline-flex items-center gap-1.5">
                        <Shield size={12} className="text-primary" />
                        <span>100% Confidential</span>
                    </span>
                    <span>&bull;</span>
                    <span>Instant Studio Setup</span>
                    <span>&bull;</span>
                    <span>No Credit Card Required</span>
                </div>
            </div>
        </div>
    );
}

ClientRegister.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;
