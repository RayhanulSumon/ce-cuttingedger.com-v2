import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import {
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Calendar,
    ShieldCheck,
    Check,
    CheckCircle2,
    Copy,
    RotateCw,
    Loader2,
} from 'lucide-react';
import { getAttributionData } from '@/lib/attribution';
import { PageProps } from '@/types';

const SERVICES = [
    'Catalog Retouching',
    'Clipping & Masking',
    'Ghost Mannequin',
    'Color Matching',
    '3D CGI / AR',
    'Agency White-Label',
];

export default function Contact() {
    const { settings, flash } = usePage<PageProps>().props;
    const contactEmail = (settings as any)?.contact_email || 'hello@cuttingedger.com';
    const [copiedEmail, setCopiedEmail] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        email: '',
        company: '',
        role: '',
        website: '',
        monthly_volume: '500 – 2,000 SKUs / month',
        platform: 'Shopify / Shopify Plus',
        service_interest: SERVICES[0],
        budget: '$1,500 – $5,000 / mo Retainer',
        message: '',
        honeypot: '',
        captcha_answer: '',
        captcha_token: '',
        // Attribution
        landing_page_url: '',
        submission_page_url: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_term: '',
        utm_content: '',
        click_id: '',
    });

    const [captchaQuestion, setCaptchaQuestion] = useState<string>('');

    const refreshCaptcha = () => {
        fetch('/api/captcha/math')
            .then((res) => res.json())
            .then((res) => {
                if (res.question && res.token) {
                    setCaptchaQuestion(res.question);
                    setData((prev) => ({
                        ...prev,
                        captcha_token: res.token,
                        captcha_answer: '',
                    }));
                }
            })
            .catch(() => {});
    };

    useEffect(() => {
        const attr = getAttributionData();
        setData((prev) => ({
            ...prev,
            landing_page_url: attr.landing_page_url,
            submission_page_url: attr.submission_page_url,
            utm_source: attr.utm_source || '',
            utm_medium: attr.utm_medium || '',
            utm_campaign: attr.utm_campaign || '',
            utm_term: attr.utm_term || '',
            utm_content: attr.utm_content || '',
            click_id: attr.click_id || '',
        }));

        refreshCaptcha();
    }, []);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(contactEmail);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const attr = getAttributionData();

        transform((currentData) => ({
            ...currentData,
            submission_page_url: window.location.href,
            landing_page_url: attr.landing_page_url || currentData.landing_page_url || window.location.href,
            utm_source: attr.utm_source || currentData.utm_source || '',
            utm_medium: attr.utm_medium || currentData.utm_medium || '',
            utm_campaign: attr.utm_campaign || currentData.utm_campaign || '',
            utm_term: attr.utm_term || currentData.utm_term || '',
            utm_content: attr.utm_content || currentData.utm_content || '',
            click_id: attr.click_id || currentData.click_id || '',
        }));

        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                refreshCaptcha();
            },
            onError: () => refreshCaptcha(),
        });
    };

    return (
        <>
            <SeoHead
                title="Contact Production Studio — Cutting Edger"
                description="Connect directly with Cutting Edger directors. Request custom catalog volume pricing, SLA agreements, or schedule a technical call."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Contact', url: '/contact' },
                ]}
            />

            <section className="relative py-16 sm:py-24 bg-[#07080a] min-h-[90vh] flex items-center overflow-hidden">
                {/* Subtle Ambient Radial Lighting */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[22rem] bg-accent/5 rounded-full blur-[220px] pointer-events-none" />

                <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                        
                        {/* LEFT: Clean Minimalist Context */}
                        <div className="lg:col-span-5 space-y-8 pt-2">
                            <div className="space-y-3">
                                <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">
                                    Get In Touch
                                </span>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
                                    Let’s scale your <span className="text-accent">product imagery.</span>
                                </h1>
                                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md">
                                    Whether ramping up for a seasonal catalog drop, standardizing multi-category color specs, or setting up dedicated studio bandwidth, our directors respond within 24 business hours.
                                </p>
                            </div>

                            {/* Clean, Unboxed Direct Channels */}
                            <div className="space-y-4 pt-2 border-t border-white/10">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-accent" />
                                        <a
                                            href={`mailto:${contactEmail}`}
                                            className="text-white hover:text-accent font-mono transition-colors text-xs sm:text-sm"
                                        >
                                            {contactEmail}
                                        </a>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyEmail}
                                        className="text-xs font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        {copiedEmail ? (
                                            <span className="text-accent flex items-center gap-1">
                                                <Check className="w-3.5 h-3.5" /> Copied
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Copy className="w-3.5 h-3.5" /> Copy
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-accent" />
                                    <span className="text-neutral-300 font-mono text-xs sm:text-sm">
                                        +1 (409) 995-2565
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-neutral-400" />
                                    <span className="text-neutral-400 text-xs">
                                        Artisan Center, Panthapath, Dhaka 1215
                                    </span>
                                </div>
                            </div>

                            {/* Clean Discovery Call Link */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                                    className="inline-flex items-center gap-2 text-xs font-mono text-accent hover:text-white hover:underline transition-all cursor-pointer font-bold"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Prefer a live screen-share? Book 15-min call →</span>
                                </button>
                            </div>

                            {/* Trust Proof */}
                            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-neutral-400">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    <span>24-Hour Production SLA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    <span>Protected under Mutual Non-Disclosure Agreement</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    <span>Dedicated senior retoucher team</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Ultra-Clean, Modern Form Card */}
                        <div className="lg:col-span-7">
                            <form
                                onSubmit={handleSubmit}
                                className="p-6 sm:p-10 rounded-3xl bg-[#0c0d12]/95 border border-white/10 shadow-2xl backdrop-blur-xl space-y-6"
                            >
                                <div className="space-y-1 pb-2 border-b border-white/10">
                                    <h2 className="text-xl font-display font-bold text-white">
                                        Project Inquiry
                                    </h2>
                                    <p className="text-xs text-neutral-400">
                                        Tell us about your requirements. No spam, ever.
                                    </p>
                                </div>

                                {/* Clean In-page Success Banner */}
                                {flash?.success && (
                                    <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 flex items-start gap-3.5 text-white animate-in fade-in duration-300">
                                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-accent">Inquiry Transmitted Successfully</p>
                                            <p className="text-xs text-neutral-300 leading-relaxed">{flash.success}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Honeypot */}
                                <input
                                    type="text"
                                    name="website_url"
                                    value={data.honeypot}
                                    onChange={(e) => setData('honeypot', e.target.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    className="hidden"
                                    aria-hidden="true"
                                />

                                {/* Hidden Captcha Token */}
                                <input type="hidden" name="captcha_token" value={data.captcha_token} />

                                {/* Row 1: Name & Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-neutral-300 font-medium">
                                            Your Name <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Alex Mercer"
                                            className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors"
                                        />
                                        {errors.name && <p className="text-xs text-rose-400 font-mono">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs text-neutral-300 font-medium">
                                            Work Email <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="alex@company.com"
                                            className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors"
                                        />
                                        {errors.email && <p className="text-xs text-rose-400 font-mono">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Row 2: Company & Store URL */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-neutral-400 font-medium">
                                            Company / Brand <span className="text-neutral-500">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            placeholder="Acme Footwear"
                                            className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs text-neutral-400 font-medium">
                                            Store / Website <span className="text-neutral-500">(Optional)</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://acme.com"
                                            className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Service Needed - Lightweight Pill Selectors */}
                                <div className="space-y-2">
                                    <label className="text-xs text-neutral-300 font-medium block">
                                        Service Needed
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {SERVICES.map((srv) => {
                                            const active = data.service_interest === srv;
                                            return (
                                                <button
                                                    key={srv}
                                                    type="button"
                                                    onClick={() => setData('service_interest', srv)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer border ${
                                                        active
                                                            ? 'bg-accent/15 border-accent text-accent font-bold'
                                                            : 'bg-white/[0.02] border-white/10 text-neutral-300 hover:border-white/20 hover:text-white'
                                                    }`}
                                                >
                                                    {srv}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-neutral-300 font-medium">
                                        Project Scope & Timeline <span className="text-accent">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Briefly describe your image volume, desired background specs, or turnaround deadline..."
                                        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors leading-relaxed"
                                    />
                                    {errors.message && <p className="text-xs text-rose-400 font-mono">{errors.message}</p>}
                                </div>

                                {/* Bottom Row: Math Challenge & Submit */}
                                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
                                    {/* Minimalist Math Challenge */}
                                    {captchaQuestion ? (
                                        <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                                            <span>Security: What is {captchaQuestion} ?</span>
                                            <input
                                                type="text"
                                                required
                                                value={data.captcha_answer}
                                                onChange={(e) => setData('captcha_answer', e.target.value)}
                                                placeholder="Answer"
                                                className="w-16 px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-center text-white focus:outline-none focus:border-accent"
                                            />
                                            <button
                                                type="button"
                                                onClick={refreshCaptcha}
                                                title="New Challenge"
                                                className="p-1 text-neutral-500 hover:text-accent transition-colors cursor-pointer"
                                            >
                                                <RotateCw className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                                            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                                            <span>Mutual NDA</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Transmitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Inquiry</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                {errors.captcha_answer && (
                                    <p className="text-xs text-rose-400 font-mono">{errors.captcha_answer}</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
