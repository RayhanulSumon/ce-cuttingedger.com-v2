import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowRight, Building2, Lock, Mail, Phone, User } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { LandingLayout } from '@/Layouts/LandingLayout';

const PAGE_BACKGROUND =
    'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

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
        <div style={{ background: PAGE_BACKGROUND }} className="min-h-screen pb-20 pt-28 sm:pt-32">
            <SeoHead
                title="Create Client Account — CuttingEdger Studio Portal"
                description="Create a verified CuttingEdger client account via email or Google to order Digital Twins and request Virtual Try-On quotes."
            />

            <div className="mx-auto max-w-lg px-5">
                <div className="rounded-3xl border border-ink/10 bg-white p-7 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.14)] sm:p-9">
                    <div className="text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                            Client Studio Portal
                        </p>
                        <h1 className="mt-1.5 font-michroma text-2xl font-normal tracking-[0.06em] text-ink">
                            Create Your Account
                        </h1>
                        <p className="mt-2 text-xs text-subtle">
                            Sign up with Google or verify your work email to place Digital Twin orders and Virtual Try-On quotes.
                        </p>
                    </div>

                    {/* Google Sign-Up Button */}
                    <div className="mt-6">
                        <a
                            href={route('auth.google.redirect')}
                            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-ink/15 bg-white px-4 py-3 text-xs font-bold text-ink shadow-xs transition-all hover:border-ink/35 hover:bg-[#f8fafc]"
                        >
                            <GoogleIcon />
                            <span>Sign up with Google (Instant Verification)</span>
                        </a>
                    </div>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-ink/10" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-subtle">
                            or sign up with email
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
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs font-semibold text-rose-600">
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
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs font-semibold text-rose-600">
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
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
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
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                    <Lock className="h-3.5 w-3.5 text-subtle" />
                                    <span>Password *</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
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
                                    <span>Confirm Password *</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    placeholder="Repeat password"
                                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
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
                        <Link href="/login" className="font-bold text-primary hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

ClientRegister.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;

