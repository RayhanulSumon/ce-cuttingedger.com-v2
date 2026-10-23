import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Mail, Phone, MapPin, Send, CheckCircle2, Calendar, ShieldCheck, Clock, Building2, Briefcase, Globe, ShoppingBag, RotateCw } from 'lucide-react';
import { getAttributionData } from '@/lib/attribution';
import { PageProps } from '@/types';

export default function Contact() {
    const { settings } = usePage<PageProps>().props;
    const calendlyUrl = (settings as any)?.calendly_url || 'https://calendly.com/cuttingedger/discovery-call';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, wasSuccessful, reset, errors, transform } = useForm({
        name: '',
        email: '',
        company: '',
        role: '',
        website: '',
        monthly_volume: '500 – 2,000 SKUs / mo',
        platform: 'Shopify / Shopify Plus',
        service_interest: 'E-Commerce Catalog Optimization',
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

    const isBusy = processing || isSubmitting;

    const budgetTiers = [
        'Ad-Hoc / Pilot Test (< $1,000)',
        '$1,000 – $3,000 / month',
        '$3,000 – $8,000 / month',
        '$8,000+ / month (Enterprise High-Volume)',
    ];

    const serviceOptions = [
        'E-Commerce Catalog Optimization',
        'Hand-Drawn Clipping Path & Masking',
        'Invisible Ghost Mannequin 3D Jointing',
        'Color Standardization & Delta-E Matching',
        'White-Label Agency Dedicated Bandwidth',
        '3D CGI Product Modeling & Virtual Staging',
        '3D Furniture Modeling & AR Digital Twins',
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isBusy) return;

        setIsSubmitting(true);
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
            onFinish: () => setIsSubmitting(false),
            onError: () => refreshCaptcha(),
        });
    };

    return (
        <>
            <SeoHead
                title="Initiate Production Partnership & Quote Consultation"
                description="Connect with Cutting Edger directors. Inquire about high-volume catalog retouching, color standardization, white-label agency partnerships, or 3D CGI production."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Contact Us', url: '/contact' },
                ]}
            />

            <PageHero
                eyebrow="COMMERCIAL ACCESS"
                title="SCALE YOUR"
                highlight="VISUAL PERFORMANCE."
                description="Connect with our Senior Production Directors for custom catalog SLAs, white-label agency partnerships, or virtual 3D staging."
            />

            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#12141c] border border-white/10 shadow-2xl">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-2 font-bold">
                                [ PRODUCTION BRIEF TRANSMISSION ]
                            </span>
                            <h2 className="text-3xl font-display font-bold text-white mb-8">
                                Project Brief & Quote Request
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Marcus Vance"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                        {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                                            Work Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="marcus@brand.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                        {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            <span>Company / Studio</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            placeholder="Vance Fashion Studio"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold flex items-center gap-1.5">
                                            <Briefcase className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            <span>Your Role</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            placeholder="VP of E-Commerce / Creative Director"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            <span>Store / Website URL</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://vancefashion.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold flex items-center gap-1.5">
                                            <ShoppingBag className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            <span>Commerce Platform</span>
                                        </label>
                                        <select
                                            value={data.platform}
                                            onChange={(e) => setData('platform', e.target.value)}
                                            className="w-full bg-[#161822] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        >
                                            <option value="Shopify / Shopify Plus">Shopify / Shopify Plus</option>
                                            <option value="Amazon Marketplace">Amazon Marketplace</option>
                                            <option value="Magento / Adobe Commerce">Magento / Adobe Commerce</option>
                                            <option value="BigCommerce">BigCommerce</option>
                                            <option value="Custom Headless / Other">Custom Headless / Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                                            Primary Discipline
                                        </label>
                                        <select
                                            value={data.service_interest}
                                            onChange={(e) => setData('service_interest', e.target.value)}
                                            className="w-full bg-[#161822] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        >
                                            {serviceOptions.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                                            Estimated Monthly Volume / Budget
                                        </label>
                                        <select
                                            value={data.budget}
                                            onChange={(e) => setData('budget', e.target.value)}
                                            className="w-full bg-[#161822] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        >
                                            {budgetTiers.map((tier) => (
                                                <option key={tier} value={tier}>{tier}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                                        Project Scope & Turnaround Requirements *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Detail your monthly SKU volume, background specifications, desired turnaround SLA, or custom retouching guidelines..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                    />
                                    {errors.message && <p className="text-xs text-rose-400 mt-1">{errors.message}</p>}
                                </div>

                                {/* Math Spam Protection (Doc §4.4) */}
                                {captchaQuestion && (
                                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
                                        <div className="space-y-0.5">
                                            <span className="text-xs font-mono text-neutral-300 font-bold flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" />
                                                <span>Security Verification: What is {captchaQuestion} ?</span>
                                                <button
                                                    type="button"
                                                    onClick={refreshCaptcha}
                                                    title="Generate new question"
                                                    className="p-1 text-neutral-500 hover:text-[#d4ff00] transition-colors"
                                                >
                                                    <RotateCw className="w-3 h-3" />
                                                </button>
                                            </span>
                                            <span className="text-[11px] text-neutral-500 font-mono">Solve the math problem to submit inquiry.</span>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={data.captcha_answer}
                                            onChange={(e) => setData('captcha_answer', e.target.value)}
                                            placeholder="Answer"
                                            className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-center text-white focus:outline-none focus:border-[#d4ff00]"
                                        />
                                    </div>
                                )}

                                {errors['captcha_answer'] && (
                                    <p className="text-xs text-rose-400 font-mono">
                                        {errors['captcha_answer']}
                                    </p>
                                )}

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                                        <ShieldCheck className="w-4 h-4 text-[#d4ff00]" />
                                        <span>Mutual NDA Protected</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isBusy}
                                        className="px-8 py-3.5 rounded-xl bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#bfe600] transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>{isBusy ? 'Transmitting...' : 'Send Inquiry'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Direct Calendly & Coordinates Sidebar */}
                        <div className="lg:col-span-5 space-y-8">
                            {/* Direct Calendly Card */}
                            <div className="p-8 rounded-3xl bg-[#12141c] border border-[#d4ff00]/30 shadow-2xl space-y-5">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4ff00]/10 text-xs font-mono text-[#d4ff00] font-bold">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>INSTANT SCHEDULING</span>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white">
                                    Prefer a Direct Video Discovery Call?
                                </h3>
                                <p className="text-xs text-neutral-300 leading-relaxed">
                                    Skip the email queue. Schedule a 15-minute screen-share with our Production Director to review asset guidelines, sample tests, and dedicated volume pricing.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                                    className="w-full py-3.5 rounded-xl bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#bfe600] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Select Real-Time Calendar Slot</span>
                                </button>
                            </div>

                            {/* Direct Contact Coordinates */}
                            <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6">
                                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-400 font-bold">
                                    [ STUDIO COMMUNICATIONS ]
                                </h3>

                                <div className="space-y-4 text-xs font-mono text-neutral-300">
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white font-bold">Enterprise Client Support</p>
                                            <a href="mailto:hello@cuttingedger.com" className="text-neutral-400 hover:text-white transition-colors">
                                                hello@cuttingedger.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white font-bold">Direct Phone Hotline</p>
                                            <span className="text-neutral-400">+1 (409) 995-2565</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white font-bold">Global Operations Center</p>
                                            <span className="text-neutral-400">
                                                Artisan Center, Level-7, House# 57/9, West Panthapath, Dhaka 1215
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
