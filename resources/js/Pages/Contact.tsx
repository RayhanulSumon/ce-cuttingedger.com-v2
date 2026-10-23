import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    Calendar,
    ShieldCheck,
    Clock,
    Sparkles,
    Check,
    Copy,
    RotateCw,
    Building2,
    Globe,
    Layers,
} from 'lucide-react';
import { getAttributionData } from '@/lib/attribution';
import { PageProps } from '@/types';

const POPULAR_SERVICES = [
    'E-Commerce Catalog',
    'Clipping & Masking',
    'Ghost Mannequin',
    'Color Matching',
    '3D CGI & AR Twins',
    'Agency White-Label',
];

const VOLUME_OPTIONS = [
    'Ad-Hoc / Pilot Test (< 500 SKUs)',
    '500 – 2,000 SKUs / month',
    '2,000 – 5,000 SKUs / month',
    '5,000+ SKUs / month (Enterprise)',
];

export default function Contact() {
    const { settings } = usePage<PageProps>().props;
    const contactEmail = (settings as any)?.contact_email || 'hello@cuttingedger.com';
    const [copiedEmail, setCopiedEmail] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        email: '',
        company: '',
        role: '',
        website: '',
        monthly_volume: VOLUME_OPTIONS[1],
        platform: 'Shopify / Shopify Plus',
        service_interest: POPULAR_SERVICES[0],
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
                {/* Ambient Soft Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[24rem] bg-[#d4ff00]/5 rounded-full blur-[220px] pointer-events-none" />

                <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                        
                        {/* LEFT COLUMN: Editorial Context & Direct Contact */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/25 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Direct Studio Access</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
                                    Let’s talk about your <span className="text-[#d4ff00]">visual catalog.</span>
                                </h1>
                                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                                    Whether you need to scale 5,000+ SKUs/month, standardize cross-channel color delta-E, or establish a dedicated white-label team, our directors are here to assist.
                                </p>
                            </div>

                            {/* Direct Contact Cards */}
                            <div className="space-y-3">
                                {/* Email */}
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 group hover:border-white/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00]/25 flex items-center justify-center text-[#d4ff00]">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Direct Inbox</p>
                                            <a href={`mailto:${contactEmail}`} className="text-sm font-bold text-white hover:text-[#d4ff00] transition-colors">
                                                {contactEmail}
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyEmail}
                                        title="Copy Email"
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
                                    >
                                        {copiedEmail ? <Check className="w-4 h-4 text-[#d4ff00]" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Phone */}
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Phone Hotline</p>
                                        <span className="text-sm font-bold text-white">+1 (409) 995-2565</span>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Production Hub</p>
                                        <span className="text-xs text-neutral-300">Artisan Center, Panthapath, Dhaka 1215</span>
                                    </div>
                                </div>
                            </div>

                            {/* Live Discovery Call Box */}
                            <div className="p-5 rounded-2xl bg-[#10121a] border border-[#d4ff00]/25 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-white">Prefer a live screen-share?</p>
                                    <p className="text-[11px] text-neutral-400">Book a 15-min discovery call with our lead director.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                                    className="px-4 py-2.5 rounded-xl bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#bfe600] transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Schedule Call</span>
                                </button>
                            </div>

                            {/* Trust Proof Pills */}
                            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#d4ff00]" /> &lt; 24h Response
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" /> NDA Protected
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-[#d4ff00]" /> 100% Hand-Crafted
                                </span>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Clean, Lightweight, Airy Contact Form */}
                        <div className="lg:col-span-7">
                            <form
                                onSubmit={handleSubmit}
                                className="p-6 sm:p-9 rounded-3xl bg-[#0d0f15]/95 border border-white/10 shadow-2xl backdrop-blur-xl space-y-5"
                            >
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-display font-bold text-white">
                                            Send a Project Brief
                                        </h2>
                                        <p className="text-xs text-neutral-400">
                                            Fill in your project details. We respond with a personalized proposal.
                                        </p>
                                    </div>
                                    <span className="font-mono text-[11px] text-[#d4ff00] font-bold uppercase tracking-wider">
                                        No Obligation
                                    </span>
                                </div>

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
                                        <label className="text-xs font-mono uppercase text-neutral-300 font-bold">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Alex Mercer"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                        {errors.name && <p className="text-xs text-rose-400 font-mono">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-neutral-300 font-bold">
                                            Work Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="alex@company.com"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                        {errors.email && <p className="text-xs text-rose-400 font-mono">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Row 2: Company & Store URL */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            <span>Company / Studio</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            placeholder="Acme Footwear Co."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            <span>Website / Store URL</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://acme.com"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Interactive Service Pill Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold block">
                                        Service of Interest
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {POPULAR_SERVICES.map((srv) => {
                                            const active = data.service_interest === srv;
                                            return (
                                                <button
                                                    key={srv}
                                                    type="button"
                                                    onClick={() => setData('service_interest', srv)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                                                        active
                                                            ? 'bg-[#d4ff00]/15 border-[#d4ff00] text-[#d4ff00] font-bold shadow-sm'
                                                            : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/25 hover:text-white'
                                                    }`}
                                                >
                                                    {srv}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Monthly Volume Dropdown */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold">
                                        Estimated Monthly Volume
                                    </label>
                                    <select
                                        value={data.monthly_volume}
                                        onChange={(e) => setData('monthly_volume', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#131620] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                    >
                                        {VOLUME_OPTIONS.map((v) => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono uppercase text-neutral-300 font-bold">
                                        Project Scope & Instructions *
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Detail your requirements (e.g. 500 product images/week, pure white background 255, 24h turnaround, layered PSD masters)..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4ff00] transition-colors leading-relaxed"
                                    />
                                    {errors.message && <p className="text-xs text-rose-400 font-mono">{errors.message}</p>}
                                </div>

                                {/* Math Spam Verification */}
                                {captchaQuestion && (
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                            <span className="text-xs font-mono text-neutral-300 font-bold">
                                                Security: What is {captchaQuestion} ?
                                            </span>
                                            <button
                                                type="button"
                                                onClick={refreshCaptcha}
                                                title="New Math Question"
                                                className="p-1 text-neutral-500 hover:text-[#d4ff00] transition-colors cursor-pointer"
                                            >
                                                <RotateCw className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={data.captcha_answer}
                                            onChange={(e) => setData('captcha_answer', e.target.value)}
                                            placeholder="Answer"
                                            className="w-20 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-center text-white focus:outline-none focus:border-[#d4ff00]"
                                        />
                                    </div>
                                )}
                                {errors.captcha_answer && (
                                    <p className="text-xs text-rose-400 font-mono">{errors.captcha_answer}</p>
                                )}

                                {/* Bottom Action */}
                                <div className="pt-2 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" />
                                        <span>Mutual Non-Disclosure Protected</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-7 py-3 rounded-xl bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#bfe600] transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>{processing ? 'Transmitting...' : 'Send Inquiry'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
