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
    Clock,
    Lock,
    Users,
    Sparkles,
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
    const contactPhone = (settings as any)?.contact_phone || '+1 (409) 995-2565';
    const contactAddress = (settings as any)?.company_address || 'Artisan Center, Panthapath, Dhaka 1215';
    const [copiedEmail, setCopiedEmail] = useState(false);

    const { data, setData, post, processing, errors, reset, transform } = useForm({
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
                reset('name', 'email', 'company', 'website', 'message', 'captcha_answer');
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

            <section className="relative py-16 sm:py-24 lg:py-28 bg-[#f2f2f1] min-h-[90vh] flex items-center overflow-hidden">
                {/* Ambient Radial Mesh Lighting */}
                <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[28rem] bg-[#f5761a]/[0.04] rounded-full blur-[220px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[36rem] h-[24rem] bg-white/[0.015] rounded-full blur-[200px] pointer-events-none" />

                {/* Subtle Technical Grid Texture */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
                    aria-hidden="true"
                />

                <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                        
                        {/* LEFT: Clean, High-End Editorial Context */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="space-y-3.5">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5761a]/10 border border-[#f5761a]/25 text-[11px] font-mono uppercase tracking-[0.18em] text-[#c4540a] font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Direct Studio Inquiry</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-display font-extrabold text-[#16191f] tracking-tight leading-[1.12]">
                                    Let’s scale your <span className="text-[#c4540a]">product imagery.</span>
                                </h1>
                                <p className="text-[#4a505b] text-sm sm:text-base leading-relaxed max-w-md">
                                    Whether ramping up for a seasonal catalog drop, standardizing multi-category color specs, or securing dedicated studio bandwidth, our directors respond within 24 business hours.
                                </p>
                            </div>

                            {/* Direct Communication Channels */}
                            <div className="space-y-3 pt-2">
                                {/* Email Card with 1-Click Copy */}
                                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-[#16191f]/10 hover:border-[#16191f]/20 transition-all">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-[#f5761a]/10 border border-[#f5761a]/20 flex items-center justify-center text-[#c4540a] shrink-0">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-mono uppercase tracking-wider text-[#4a505b]">Direct Email</p>
                                            <a
                                                href={`mailto:${contactEmail}`}
                                                className="text-[#16191f] hover:text-[#c4540a] font-mono text-xs sm:text-sm truncate block transition-colors font-medium"
                                            >
                                                {contactEmail}
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyEmail}
                                        aria-label="Copy studio email address"
                                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-[#2f333a] hover:text-[#16191f] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-2"
                                    >
                                        {copiedEmail ? (
                                            <span className="text-[#c4540a] flex items-center gap-1 font-semibold">
                                                <Check className="w-3.5 h-3.5" /> Copied
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[#4a505b] hover:text-[#16191f]">
                                                <Copy className="w-3.5 h-3.5" /> Copy
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Discovery Call Card */}
                                <div
                                    onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                                    className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-[#16191f]/10 hover:border-[#f5761a]/40 hover:bg-[#f5761a]/[0.02] transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-[#16191f]/10 group-hover:bg-[#f5761a] group-hover:text-white group-hover:border-[#f5761a] flex items-center justify-center text-[#2f333a] transition-all shrink-0">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono uppercase tracking-wider text-[#c4540a] font-semibold">Live Screen-Share</p>
                                            <p className="text-[#16191f] group-hover:text-[#c4540a] text-xs sm:text-sm font-medium transition-colors">
                                                Book 15-Min Discovery Call
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[#5d6572] group-hover:text-[#c4540a] group-hover:translate-x-1 transition-all text-xs font-mono">
                                        →
                                    </span>
                                </div>

                                {/* Hotline & Studio Location in Compact Clean Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-[#16191f]/10 space-y-1">
                                        <div className="flex items-center gap-1.5 text-[#4a505b] text-[10px] font-mono uppercase tracking-wider">
                                            <Phone className="w-3 h-3 text-[#c4540a]" />
                                            <span>Studio Line</span>
                                        </div>
                                        <p className="text-[#2f333a] font-mono text-xs font-medium">
                                            {contactPhone}
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-[#16191f]/10 space-y-1">
                                        <div className="flex items-center gap-1.5 text-[#4a505b] text-[10px] font-mono uppercase tracking-wider">
                                            <MapPin className="w-3 h-3 text-[#4a505b]" />
                                            <span>Studio Hub</span>
                                        </div>
                                        <p className="text-[#2f333a] text-xs truncate" title={contactAddress}>
                                            {contactAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Clean Studio Standards Pill Row */}
                            <div className="pt-2 border-t border-[#16191f]/10 space-y-2.5">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-[#4a505b] font-medium">
                                    Studio Commitments
                                </p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2.5 text-[#2f333a]">
                                        <Clock className="w-4 h-4 text-[#c4540a] shrink-0 mt-0.5" />
                                        <span><strong className="text-[#16191f] font-medium">24-Hour Production SLA:</strong> Guaranteed delivery on scheduled catalog drops.</span>
                                    </div>
                                    <div className="flex items-start gap-2.5 text-[#2f333a]">
                                        <Lock className="w-4 h-4 text-[#c4540a] shrink-0 mt-0.5" />
                                        <span><strong className="text-[#16191f] font-medium">Mutual Non-Disclosure Agreement:</strong> Secure IP protection for unreleased collections.</span>
                                    </div>
                                    <div className="flex items-start gap-2.5 text-[#2f333a]">
                                        <Users className="w-4 h-4 text-[#c4540a] shrink-0 mt-0.5" />
                                        <span><strong className="text-[#16191f] font-medium">Dedicated Retoucher Pod:</strong> Assigned senior colorists aligned to your guidelines.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Ultra-Clean Glassmorphic Form Card */}
                        <div className="lg:col-span-7">
                            <form
                                onSubmit={handleSubmit}
                                className="relative p-6 sm:p-9 lg:p-10 rounded-3xl bg-gradient-to-b from-white/95 to-[#f2f2f1]/95 border border-[#16191f]/10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl space-y-5 overflow-hidden"
                            >
                                {/* Top Hairline Accent Highlight */}
                                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#f5761a]/70 to-transparent" />

                                <div className="flex items-center justify-between pb-3.5 border-b border-[#16191f]/10">
                                    <div className="space-y-1">
                                        <h2 className="text-lg sm:text-xl font-display font-bold text-[#16191f] tracking-tight">
                                            Project Inquiry
                                        </h2>
                                        <p className="text-xs text-[#4a505b]">
                                            Tell us about your requirements. Zero spam, ever.
                                        </p>
                                    </div>
                                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-[#16191f]/10 text-[10px] font-mono uppercase tracking-wider text-[#4a505b]">
                                        <ShieldCheck className="w-3 h-3 text-[#c4540a]" />
                                        <span>Confidential</span>
                                    </span>
                                </div>

                                {/* Clean In-page Success Banner */}
                                {flash?.success && (
                                    <div className="p-4 rounded-2xl bg-[#f5761a]/10 border border-[#f5761a]/30 flex items-start gap-3.5 text-[#16191f] animate-in fade-in duration-300">
                                        <CheckCircle2 className="w-5 h-5 text-[#c4540a] shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-[#c4540a]">Inquiry Transmitted Successfully</p>
                                            <p className="text-xs text-[#2f333a] leading-relaxed">{flash.success}</p>
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
                                        <label className="text-xs text-[#2f333a] font-medium flex items-center justify-between">
                                            <span>Your Name</span>
                                            <span className="text-[#c4540a]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Alex Mercer"
                                            className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-[#16191f]/10 hover:border-[#16191f]/20 focus:border-[#f5761a] focus:bg-[#f5761a]/[0.02] focus:ring-1 focus:ring-[#f5761a]/30 rounded-xl text-sm text-[#16191f] placeholder-[#8a919c] transition-all outline-none"
                                        />
                                        {errors.name && <p className="text-xs text-rose-400 font-mono">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs text-[#2f333a] font-medium flex items-center justify-between">
                                            <span>Work Email</span>
                                            <span className="text-[#c4540a]">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="alex@company.com"
                                            className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-[#16191f]/10 hover:border-[#16191f]/20 focus:border-[#f5761a] focus:bg-[#f5761a]/[0.02] focus:ring-1 focus:ring-[#f5761a]/30 rounded-xl text-sm text-[#16191f] placeholder-[#8a919c] transition-all outline-none"
                                        />
                                        {errors.email && <p className="text-xs text-rose-400 font-mono">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Row 2: Company & Store URL */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-[#4a505b] font-medium">
                                            Company / Brand <span className="text-[#5d6572] font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            placeholder="Acme Footwear"
                                            className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-[#16191f]/10 hover:border-[#16191f]/20 focus:border-[#f5761a] focus:bg-[#f5761a]/[0.02] focus:ring-1 focus:ring-[#f5761a]/30 rounded-xl text-sm text-[#16191f] placeholder-[#8a919c] transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs text-[#4a505b] font-medium">
                                            Store / Website <span className="text-[#5d6572] font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://acme.com"
                                            className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-[#16191f]/10 hover:border-[#16191f]/20 focus:border-[#f5761a] focus:bg-[#f5761a]/[0.02] focus:ring-1 focus:ring-[#f5761a]/30 rounded-xl text-sm text-[#16191f] placeholder-[#8a919c] transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Service Needed - Refined Modern Chips */}
                                <div className="space-y-2">
                                    <label className="text-xs text-[#2f333a] font-medium block">
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
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                                                        active
                                                            ? 'bg-[#f5761a] text-white font-bold shadow-[0_0_15px_rgba(245,166,35,0.35)] scale-[1.02]'
                                                            : 'bg-white/[0.03] border border-[#16191f]/10 text-[#2f333a] hover:border-[#16191f]/25 hover:text-[#16191f]'
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
                                    <label className="text-xs text-[#2f333a] font-medium flex items-center justify-between">
                                        <span>Project Scope & Timeline</span>
                                        <span className="text-[#c4540a]">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Briefly describe your image volume, desired background specs, or turnaround deadline..."
                                        className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-[#16191f]/10 hover:border-[#16191f]/20 focus:border-[#f5761a] focus:bg-[#f5761a]/[0.02] focus:ring-1 focus:ring-[#f5761a]/30 rounded-xl text-sm text-[#16191f] placeholder-[#8a919c] transition-all outline-none leading-relaxed"
                                    />
                                    {errors.message && <p className="text-xs text-rose-400 font-mono">{errors.message}</p>}
                                </div>

                                {/* Bottom Row: Clean Security Challenge & High-Converting Submit Button */}
                                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#16191f]/10">
                                    {/* Minimalist Integrated Security Verification */}
                                    {captchaQuestion ? (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-[#16191f]/10 text-xs font-mono text-[#2f333a] self-start sm:self-auto">
                                            <span className="text-[#4a505b] text-[11px]">Security:</span>
                                            <span className="text-[#c4540a] font-semibold">{captchaQuestion} =</span>
                                            <input
                                                type="text"
                                                required
                                                value={data.captcha_answer}
                                                onChange={(e) => setData('captcha_answer', e.target.value)}
                                                placeholder="?"
                                                className="w-12 px-2 py-0.5 bg-white/[0.06] border border-[#16191f]/15 focus:border-[#f5761a] rounded-md text-xs text-center text-[#16191f] font-mono focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={refreshCaptcha}
                                                title="Refresh challenge"
                                                className="text-[#5d6572] hover:text-[#c4540a] transition-colors p-0.5 cursor-pointer"
                                            >
                                                <RotateCw className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs text-[#4a505b] font-mono">
                                            <ShieldCheck className="w-3.5 h-3.5 text-[#c4540a]" />
                                            <span>Protected under Mutual NDA</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 rounded-xl bg-[#f5761a] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-[#ffb834] hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer shrink-0"
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
