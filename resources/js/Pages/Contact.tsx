import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import {
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock,
    Copy,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Phone,
    RotateCw,
    Users,
} from 'lucide-react';
import { PageProps } from '@/types';

const FIELD_LABEL_CLASS = 'block text-xs font-semibold text-ink';
const INPUT_CLASS =
    'w-full min-h-11 rounded-xl border border-ink/12 bg-surface-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-faint transition-colors hover:border-ink/25 focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/15';

const FIELD_ANCHORS: Record<string, { id: string; label: string }> = {
    name: { id: 'contact-name', label: 'Name' },
    email: { id: 'contact-email', label: 'Work Email' },
    phone: { id: 'contact-phone', label: 'Phone' },
    company: { id: 'contact-company', label: 'Company' },
    website: { id: 'contact-website', label: 'Website' },
    message: { id: 'contact-message', label: 'Project details' },
    captcha_answer: { id: 'contact-captcha', label: 'Security answer' },
};

export default function Contact() {
    const { url, props } = usePage<PageProps>();
    const { auth, settings, flash, capabilities_nav = [] } = props;
    const capabilityOptions = useMemo(
        () => [...capabilities_nav.map((capability) => capability.title), 'Not sure yet'],
        [capabilities_nav],
    );

    const query = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : (url.split('?')[1] ?? ''),
    );
    const requestedService = query.get('service')?.trim() ?? '';
    const requestedCapability = query.get('capability')?.trim() ?? '';

    const matchedService = useMemo(() => {
        if (!requestedService) {
            return capabilityOptions[0] ?? 'Not sure yet';
        }
        return (
            capabilityOptions.find(
                (option) =>
                    option.toLowerCase() === requestedService.toLowerCase() ||
                    option.toLowerCase().includes(requestedService.toLowerCase()),
            ) ??
            capabilityOptions[0] ??
            'Not sure yet'
        );
    }, [capabilityOptions, requestedService]);

    const initialMessage = requestedCapability
        ? `Interested in ${requestedCapability}. Please share turnaround and quote details for our upcoming batch.`
        : '';

    const contactEmail = settings?.contact_email || 'info@cuttingedger.com';
    const contactPhones =
        settings?.contact_phones && settings.contact_phones.length > 0
            ? settings.contact_phones
            : [{ label: 'Studio', number: settings?.contact_phone || '+1 (409) 995-2565' }];
    const contactAddress = settings?.office_address || 'Artisan Center, Panthapath, Dhaka 1215';

    const [copiedEmail, setCopiedEmail] = useState(false);
    const [showOptionalDetails, setShowOptionalDetails] = useState(false);
    const [captchaQuestion, setCaptchaQuestion] = useState('');
    const errorSummaryRef = useRef<HTMLDivElement | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth?.user?.name ?? '',
        email: auth?.user?.email ?? '',
        phone: auth?.user?.phone ?? '',
        company: auth?.user?.company ?? '',
        website: '',
        service_interest: matchedService,
        message: initialMessage,
        honeypot: '',
        captcha_answer: '',
        captcha_token: '',
    });

    useEffect(() => {
        if (!requestedService && !requestedCapability) {
            return;
        }
        setData((prev) => ({
            ...prev,
            service_interest: requestedService ? matchedService : prev.service_interest,
            message: prev.message === '' && initialMessage ? initialMessage : prev.message,
        }));
    }, [requestedService, requestedCapability, matchedService, initialMessage, setData]);

    useEffect(() => {
        if (errors.phone || errors.company || errors.website) {
            setShowOptionalDetails(true);
        }
    }, [errors.phone, errors.company, errors.website]);

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
        refreshCaptcha();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCopyEmail = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(contactEmail).catch(() => {});
        }
        setCopiedEmail(true);
        window.setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                reset('message', 'website', 'captcha_answer');
                refreshCaptcha();
            },
            onError: () => {
                refreshCaptcha();
                window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
            },
        });
    };

    const errorList = Object.entries(errors).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0,
    );

    return (
        <>
            <SeoHead
                title="Contact Studio — Cutting Edger"
                description="Connect directly with Cutting Edger studio directors for custom volume pricing, SLA turnaround, or a quick discovery call."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Contact', url: '/contact' },
                ]}
            />

            <section className="relative bg-page pt-28 pb-16 sm:pt-32 sm:pb-24 lg:min-h-[calc(100vh-4rem)] lg:flex lg:items-center">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
                        {/* LEFT: Editorial Contact Overview */}
                        <div className="space-y-6 lg:col-span-5">
                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-ink">
                                    Contact Studio
                                </p>
                                <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[42px] lg:leading-[1.12] [text-wrap:balance]">
                                    Let’s talk about your{' '}
                                    <span className="text-primary-ink">next project.</span>
                                </h1>
                                <p className="max-w-md text-sm leading-relaxed text-muted sm:text-base">
                                    Share your goals or catalog requirements and our studio directors will respond within 24 hours.
                                </p>
                            </div>

                            {/* Unified Direct Contact Card */}
                            <div className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-xs">
                                {/* Direct Email Row */}
                                <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary-ink">
                                            <Mail className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-2xs font-medium text-subtle">Email</p>
                                            <a
                                                href={`mailto:${contactEmail}`}
                                                className="block truncate text-sm font-semibold text-ink transition-colors hover:text-primary-ink"
                                            >
                                                {contactEmail}
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyEmail}
                                        aria-label="Copy email address"
                                        className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-ink/10 bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-ink/25 hover:text-ink"
                                    >
                                        {copiedEmail ? (
                                            <span className="inline-flex items-center gap-1 text-success">
                                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                                Copied
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1">
                                                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                                Copy
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Phone Row(s) */}
                                <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink-2">
                                        <Phone className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <p className="text-2xs font-medium text-subtle">Phone</p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            {contactPhones.map((item, idx) => (
                                                <a
                                                    key={`${item.number}-${idx}`}
                                                    href={`tel:${item.number.replace(/[^+\d]/g, '')}`}
                                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-primary-ink"
                                                >
                                                    {contactPhones.length > 1 && item.label && (
                                                        <span className="text-xs font-medium text-subtle">
                                                            {item.label}:
                                                        </span>
                                                    )}
                                                    <span>{item.number}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Studio Address Row */}
                                <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink-2">
                                        <MapPin className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-2xs font-medium text-subtle">Studio</p>
                                        <p className="text-sm font-medium leading-snug text-ink">
                                            {contactAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quiet Trust Strip */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium text-subtle">
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-primary-ink" aria-hidden="true" />
                                    24h response
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Lock className="h-3.5 w-3.5 text-primary-ink" aria-hidden="true" />
                                    Mutual NDA
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5 text-primary-ink" aria-hidden="true" />
                                    Dedicated team
                                </span>
                            </div>
                        </div>

                        {/* RIGHT: Clean Light Form Card */}
                        <div className="lg:col-span-7">
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="space-y-6 rounded-3xl border border-ink/10 bg-surface p-6 shadow-[0_20px_50px_-28px_rgba(22,25,31,0.14)] sm:p-8 lg:p-10"
                            >
                                <div className="space-y-1 border-b border-ink/8 pb-4">
                                    <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                                        Start a conversation
                                    </h2>
                                    <p className="text-xs text-muted">
                                        Tell us what you’re working on — we’ll get back to you within one business day.
                                    </p>
                                </div>

                                {/* Success Feedback */}
                                {flash?.success && (
                                    <div
                                        role="status"
                                        className="flex items-start gap-3 rounded-2xl border border-success/25 bg-success-soft p-4 text-success"
                                    >
                                        <CheckCircle2
                                            className="mt-0.5 h-5 w-5 shrink-0 text-success"
                                            aria-hidden="true"
                                        />
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold">Message received</p>
                                            <p className="text-xs leading-relaxed text-success">
                                                {flash.success}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Focusable Error Summary */}
                                {errorList.length > 0 && (
                                    <div
                                        ref={errorSummaryRef}
                                        tabIndex={-1}
                                        role="alert"
                                        aria-labelledby="contact-error-summary"
                                        className="rounded-2xl border border-danger/25 bg-danger-soft p-4 text-xs text-danger focus:outline-none focus:ring-2 focus:ring-danger/30"
                                    >
                                        <p id="contact-error-summary" className="font-bold text-danger">
                                            Please check the highlighted fields:
                                        </p>
                                        <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
                                            {errorList.map(([field, message]) => {
                                                const anchor = FIELD_ANCHORS[field];
                                                return (
                                                    <li key={field}>
                                                        {anchor ? (
                                                            <a
                                                                href={`#${anchor.id}`}
                                                                className="font-medium underline hover:text-danger"
                                                            >
                                                                {anchor.label}: {message}
                                                            </a>
                                                        ) : (
                                                            <span>{message}</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
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
                                <input type="hidden" name="captcha_token" value={data.captcha_token} />

                                {/* Core Row 1: Name & Work Email */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label htmlFor="contact-name" className={FIELD_LABEL_CLASS}>
                                            Your Name <span className="text-primary-ink">*</span>
                                        </label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            aria-invalid={Boolean(errors.name)}
                                            aria-describedby={errors.name ? 'contact-name-error' : undefined}
                                            placeholder="Alex Mercer"
                                            className={INPUT_CLASS}
                                        />
                                        {errors.name && (
                                            <p id="contact-name-error" className="text-xs font-medium text-danger">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="contact-email" className={FIELD_LABEL_CLASS}>
                                            Work Email <span className="text-primary-ink">*</span>
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            aria-invalid={Boolean(errors.email)}
                                            aria-describedby={errors.email ? 'contact-email-error' : undefined}
                                            placeholder="alex@company.com"
                                            className={INPUT_CLASS}
                                        />
                                        {errors.email && (
                                            <p id="contact-email-error" className="text-xs font-medium text-danger">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Core Row 2: Service Chips */}
                                <div className="space-y-2">
                                    <span className={FIELD_LABEL_CLASS}>What do you need help with?</span>
                                    <div className="flex flex-wrap gap-2">
                                        {capabilityOptions.map((service) => {
                                            const active = data.service_interest === service;
                                            return (
                                                <button
                                                    key={service}
                                                    type="button"
                                                    aria-pressed={active}
                                                    onClick={() => setData('service_interest', service)}
                                                    className={`min-h-9 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                                        active
                                                            ? 'border-ink bg-ink text-white'
                                                            : 'border-ink/12 bg-surface text-ink-2 hover:border-ink/30 hover:text-ink'
                                                    }`}
                                                >
                                                    {service}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Core Row 3: Message */}
                                <div className="space-y-1.5">
                                    <label htmlFor="contact-message" className={FIELD_LABEL_CLASS}>
                                        Project details <span className="text-primary-ink">*</span>
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        required
                                        rows={4}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        aria-invalid={Boolean(errors.message)}
                                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                                        placeholder="Share your image count, style references, or timeline..."
                                        className={`${INPUT_CLASS} min-h-[112px] leading-relaxed`}
                                    />
                                    {errors.message && (
                                        <p id="contact-message-error" className="text-xs font-medium text-danger">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                {/* Progressive Disclosure for Optional Fields */}
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        aria-expanded={showOptionalDetails}
                                        onClick={() => setShowOptionalDetails((prev) => !prev)}
                                        className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary-ink transition-colors hover:text-primary"
                                    >
                                        <span>
                                            {showOptionalDetails
                                                ? 'Hide optional details'
                                                : '+ Add phone, company or website (optional)'}
                                        </span>
                                        <ChevronDown
                                            className={`h-3.5 w-3.5 transition-transform ${
                                                showOptionalDetails ? 'rotate-180' : ''
                                            }`}
                                            aria-hidden="true"
                                        />
                                    </button>

                                    {showOptionalDetails && (
                                        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-ink/8 bg-surface-2 p-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <label htmlFor="contact-phone" className={FIELD_LABEL_CLASS}>
                                                    Phone
                                                </label>
                                                <input
                                                    id="contact-phone"
                                                    type="tel"
                                                    autoComplete="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+1 (555) 000-0000"
                                                    className={`${INPUT_CLASS} bg-surface`}
                                                />
                                                {errors.phone && (
                                                    <p className="text-xs font-medium text-danger">
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label htmlFor="contact-company" className={FIELD_LABEL_CLASS}>
                                                    Company / Brand
                                                </label>
                                                <input
                                                    id="contact-company"
                                                    type="text"
                                                    autoComplete="organization"
                                                    value={data.company}
                                                    onChange={(e) => setData('company', e.target.value)}
                                                    placeholder="Acme Footwear"
                                                    className={`${INPUT_CLASS} bg-surface`}
                                                />
                                                {errors.company && (
                                                    <p className="text-xs font-medium text-danger">
                                                        {errors.company}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5 sm:col-span-2">
                                                <label htmlFor="contact-website" className={FIELD_LABEL_CLASS}>
                                                    Store / Website
                                                </label>
                                                <input
                                                    id="contact-website"
                                                    type="url"
                                                    autoComplete="url"
                                                    value={data.website}
                                                    onChange={(e) => setData('website', e.target.value)}
                                                    placeholder="https://yourstore.com"
                                                    className={`${INPUT_CLASS} bg-surface`}
                                                />
                                                {errors.website && (
                                                    <p className="text-xs font-medium text-danger">
                                                        {errors.website}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer: Compact Math Check & Primary Submit */}
                                <div className="space-y-2 border-t border-ink/8 pt-5">
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        {captchaQuestion ? (
                                            <div className="inline-flex min-h-10 items-center gap-2 self-start rounded-xl border border-ink/12 bg-surface-2 px-3 py-1.5 text-xs text-ink-2 sm:self-auto">
                                                <span className="font-medium text-subtle">Security check:</span>
                                                <span className="font-semibold text-ink">{captchaQuestion} =</span>
                                                <input
                                                    id="contact-captcha"
                                                    type="text"
                                                    inputMode="numeric"
                                                    required
                                                    aria-label="Security math answer"
                                                    aria-invalid={Boolean(errors.captcha_answer)}
                                                    value={data.captcha_answer}
                                                    onChange={(e) => setData('captcha_answer', e.target.value)}
                                                    placeholder="?"
                                                    className="w-12 rounded-lg border border-ink/15 bg-surface px-2 py-1 text-center text-xs font-semibold text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={refreshCaptcha}
                                                    aria-label="Refresh security challenge"
                                                    title="Refresh security challenge"
                                                    className="cursor-pointer rounded-md p-1 text-subtle transition-colors hover:text-primary-ink"
                                                >
                                                    <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="h-10" aria-hidden="true" />
                                        )}

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Send Message</span>
                                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {errors.captcha_answer && (
                                        <p className="text-xs font-medium text-danger">
                                            {errors.captcha_answer}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
