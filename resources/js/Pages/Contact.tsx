import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import {
    ArrowRight,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Phone,
    UploadCloud,
    User,
    Users,
    Video,
} from 'lucide-react';
import { PageProps } from '@/types';

const FIELD_LABEL_CLASS = 'block text-2xs sm:text-xs font-semibold text-ink';
const INPUT_CLASS =
    'w-full min-h-9 sm:min-h-10 rounded-xl border border-ink/12 bg-surface-2 px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-ink placeholder:text-faint transition-colors hover:border-ink/25 focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/15';

const FIELD_ANCHORS: Record<string, { id: string; label: string }> = {
    name: { id: 'contact-name', label: 'Name' },
    email: { id: 'contact-email', label: 'Work Email' },
    phone: { id: 'contact-phone', label: 'Phone' },
    company: { id: 'contact-company', label: 'Company' },
    message: { id: 'contact-message', label: 'Project details' },
};

export default function Contact() {
    const { url, props } = usePage<PageProps>();
    const { auth, settings, flash, capabilities_nav = [] } = props;

    const capabilityOptions = useMemo(() => {
        if (capabilities_nav.length > 0) {
            return [...capabilities_nav.map((capability) => capability.title), 'Other'];
        }
        return [
            'Digital Twins',
            'Virtual Try-On',
            '2D Retouching',
            '3D CGI & Modeling',
            'Other',
        ];
    }, [capabilities_nav]);

    const query = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : (url.split('?')[1] ?? ''),
    );
    const requestedService = query.get('service')?.trim() ?? '';
    const requestedCapability = query.get('capability')?.trim() ?? '';

    const matchedService = useMemo(() => {
        if (!requestedService) {
            return capabilityOptions[0] ?? '2D Retouching';
        }
        return (
            capabilityOptions.find(
                (option) =>
                    option.toLowerCase() === requestedService.toLowerCase() ||
                    option.toLowerCase().includes(requestedService.toLowerCase()),
            ) ??
            capabilityOptions[0] ??
            '2D Retouching'
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
    const [sampleCloudLink, setSampleCloudLink] = useState('');
    const errorSummaryRef = useRef<HTMLDivElement | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth?.user?.name ?? '',
        email: auth?.user?.email ?? '',
        phone: auth?.user?.phone ?? '',
        company: auth?.user?.company ?? '',
        service_interest: matchedService,
        message: initialMessage,
        honeypot: '',
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

    const handleCopyEmail = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(contactEmail).catch(() => {});
        }
        setCopiedEmail(true);
        window.setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // If client provided a sample cloud link, append cleanly to message body
        if (sampleCloudLink.trim()) {
            data.message = `${data.message}\n\n[Sample Assets / Reference Link]:\n${sampleCloudLink.trim()}`;
        }

        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                reset('message');
                setSampleCloudLink('');
            },
            onError: () => {
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
                description="Connect directly with a Cutting Edger project manager for custom volume pricing, SLA turnaround, or a quick discovery call."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Contact', url: '/contact' },
                ]}
            />

            <section className="relative bg-page pt-20 pb-12 sm:pt-24 sm:pb-16">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
                        {/* LEFT: Editorial Contact Overview (Compact, Screen-Fitting) */}
                        <div className="space-y-4 sm:space-y-4.5 lg:col-span-5">
                            <div className="space-y-2">
                                <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-primary-ink">
                                    Contact Studio
                                </p>
                                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-[34px] lg:leading-[1.15] [text-wrap:balance]">
                                    Let’s talk about your{' '}
                                    <span className="text-primary-ink">next project.</span>
                                </h1>
                                <p className="max-w-md text-xs sm:text-sm leading-relaxed text-muted">
                                    Share your goals or catalog requirements, and one of our project managers will respond within 24 hours.
                                </p>
                            </div>

                            {/* Live Dual-Shift Studio Status */}
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-ink/10 shadow-xs">
                                <span className="relative flex h-2.5 w-2.5 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-ink">
                                            Dual-Shift Studio Active
                                        </span>
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-success-soft text-success">
                                            Online Now
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-muted truncate mt-0.5">
                                        24/7 Dual-Shift Queue · Avg Quote Response: &lt; 15 mins
                                    </p>
                                </div>
                            </div>

                            {/* Unified Direct Contact Card */}
                            <div className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-xs">
                                {/* Direct Email Row */}
                                <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-4.5">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary-ink">
                                            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-medium text-subtle">Email</p>
                                            <a
                                                href={`mailto:${contactEmail}`}
                                                className="block truncate text-xs sm:text-sm font-semibold text-ink transition-colors hover:text-primary-ink"
                                            >
                                                {contactEmail}
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyEmail}
                                        aria-label="Copy email address"
                                        className="inline-flex min-h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-ink/10 bg-surface-2 px-2 py-1 text-2xs font-semibold text-ink-2 transition-colors hover:border-ink/25 hover:text-ink"
                                    >
                                        {copiedEmail ? (
                                            <span className="inline-flex items-center gap-1 text-success">
                                                <Check className="h-3 w-3" aria-hidden="true" />
                                                Copied
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1">
                                                <Copy className="h-3 w-3" aria-hidden="true" />
                                                Copy
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Phone Row(s) */}
                                <div className="flex items-start gap-2.5 px-4 py-2.5 sm:px-4.5">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-ink-2">
                                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <p className="text-[10px] font-medium text-subtle">Phone</p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                                            {contactPhones.map((item, idx) => (
                                                <a
                                                    key={`${item.number}-${idx}`}
                                                    href={`tel:${item.number.replace(/[^+\d]/g, '')}`}
                                                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-ink transition-colors hover:text-primary-ink"
                                                >
                                                    {contactPhones.length > 1 && item.label && (
                                                        <span className="text-[11px] font-medium text-subtle">
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
                                <div className="flex items-start gap-2.5 px-4 py-2.5 sm:px-4.5">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-ink-2">
                                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-medium text-subtle">Studio</p>
                                        <p className="text-xs sm:text-sm font-medium leading-snug text-ink">
                                            {contactAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quiet Trust Strip */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-0.5 text-2xs font-medium text-subtle">
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="h-3 w-3 text-primary-ink" aria-hidden="true" />
                                    24h SLA Response
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Lock className="h-3 w-3 text-primary-ink" aria-hidden="true" />
                                    Mutual NDA Protected
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Users className="h-3 w-3 text-primary-ink" aria-hidden="true" />
                                    Studio Team
                                </span>
                            </div>

                            {/* Demo Walkthrough Alternative Card */}
                            <div className="rounded-2xl border border-dashed border-ink/15 bg-surface-2/60 p-3 sm:p-3.5 space-y-1 text-xs">
                                <p className="font-bold text-ink text-2xs sm:text-xs">Prefer a live video walkthrough?</p>
                                <div className="flex items-center justify-between gap-3 text-2xs">
                                    <Link
                                        href="/book-a-demo"
                                        className="inline-flex items-center gap-1 font-semibold text-primary-ink hover:underline"
                                    >
                                        Book a 30-Min Demo <ArrowRight className="h-3 w-3" />
                                    </Link>
                                    <span className="text-subtle inline-flex items-center gap-1">
                                        <Video size={11} className="text-primary-ink" />
                                        Google Meet
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Clean, Elevated Form Card (Compact & Fitted) */}
                        <div className="lg:col-span-7">
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-sm"
                            >
                                {/* Card Header Bar */}
                                <div className="border-b border-ink/8 px-5 py-3.5 sm:px-6 sm:py-4 bg-surface-2/40">
                                    <h2 className="text-sm sm:text-base font-bold text-ink">
                                        Start a conversation
                                    </h2>
                                    <p className="text-2xs text-muted mt-0.5">
                                        Tell us what you’re working on — one of our project managers will get back to you within 24 hours.
                                    </p>
                                </div>

                                <div className="p-5 sm:p-6 space-y-3.5 sm:space-y-4">
                                    {/* Success Feedback */}
                                    {flash?.success && (
                                        <div
                                            role="status"
                                            className="flex items-start gap-2.5 rounded-xl border border-success/25 bg-success-soft p-3 text-success"
                                        >
                                            <CheckCircle2
                                                className="mt-0.5 h-4 w-4 shrink-0 text-success"
                                                aria-hidden="true"
                                            />
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-bold">Message received</p>
                                                <p className="text-2xs leading-relaxed text-success">
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
                                            className="rounded-xl border border-danger/25 bg-danger-soft p-3 text-2xs text-danger focus:outline-none focus:ring-2 focus:ring-danger/30"
                                        >
                                            <p id="contact-error-summary" className="font-bold text-danger">
                                                Please check the highlighted fields:
                                            </p>
                                            <ul className="mt-1 list-disc space-y-0.5 pl-4">
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

                                    {/* Core 2x2 Grid: Name, Work Email, Brand, Phone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                                        <div className="space-y-1">
                                            <label htmlFor="contact-name" className={FIELD_LABEL_CLASS}>
                                                <span className="flex items-center gap-1.5">
                                                    <User className="h-3 w-3 text-subtle" />
                                                    <span>Your Name <span className="text-primary-ink">*</span></span>
                                                </span>
                                            </label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                required
                                                autoComplete="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Alex Mercer"
                                                className={INPUT_CLASS}
                                            />
                                            {errors.name && (
                                                <p id="contact-name-error" className="text-2xs font-medium text-danger">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="contact-email" className={FIELD_LABEL_CLASS}>
                                                <span className="flex items-center gap-1.5">
                                                    <Mail className="h-3 w-3 text-subtle" />
                                                    <span>Work Email <span className="text-primary-ink">*</span></span>
                                                </span>
                                            </label>
                                            <input
                                                id="contact-email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="alex@company.com"
                                                className={INPUT_CLASS}
                                            />
                                            {errors.email && (
                                                <p id="contact-email-error" className="text-2xs font-medium text-danger">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="contact-company" className={FIELD_LABEL_CLASS}>
                                                <span className="flex items-center gap-1.5">
                                                    <Building2 className="h-3 w-3 text-subtle" />
                                                    <span>Brand / Company <span className="text-2xs font-normal text-muted">(Optional)</span></span>
                                                </span>
                                            </label>
                                            <input
                                                id="contact-company"
                                                type="text"
                                                autoComplete="organization"
                                                value={data.company}
                                                onChange={(e) => setData('company', e.target.value)}
                                                placeholder="e.g. Atelier Studio"
                                                className={INPUT_CLASS}
                                            />
                                            {errors.company && (
                                                <p className="text-2xs font-medium text-danger">
                                                    {errors.company}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="contact-phone" className={FIELD_LABEL_CLASS}>
                                                <span className="flex items-center gap-1.5">
                                                    <Phone className="h-3 w-3 text-subtle" />
                                                    <span>Phone / WhatsApp <span className="text-2xs font-normal text-muted">(Optional)</span></span>
                                                </span>
                                            </label>
                                            <input
                                                id="contact-phone"
                                                type="tel"
                                                autoComplete="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className={INPUT_CLASS}
                                            />
                                            {errors.phone && (
                                                <p className="text-2xs font-medium text-danger">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Service Selection Chips */}
                                    <div className="space-y-1.5">
                                        <span className={FIELD_LABEL_CLASS}>What do you need help with?</span>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {capabilityOptions.map((service) => {
                                                const active = data.service_interest === service;
                                                return (
                                                    <button
                                                        key={service}
                                                        type="button"
                                                        aria-pressed={active}
                                                        onClick={() => setData('service_interest', service)}
                                                        className={`min-h-7.5 sm:min-h-8 cursor-pointer rounded-full border px-3 sm:px-3.5 py-1 text-2xs sm:text-xs font-semibold transition-all duration-150 ${
                                                            active
                                                                ? 'border-ink bg-ink text-white shadow-xs'
                                                                : 'border-ink/12 bg-surface text-ink-2 hover:border-ink/30 hover:bg-surface-2'
                                                        }`}
                                                    >
                                                        {service}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Message / Project Details */}
                                    <div className="space-y-1">
                                        <label htmlFor="contact-message" className={FIELD_LABEL_CLASS}>
                                            Project details <span className="text-primary-ink">*</span>
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            required
                                            rows={2}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            aria-invalid={Boolean(errors.message)}
                                            aria-describedby={errors.message ? 'contact-message-error' : undefined}
                                            placeholder="Share your image count, style references, or timeline..."
                                            className={`${INPUT_CLASS} min-h-[68px] sm:min-h-[76px] leading-relaxed`}
                                        />
                                        {errors.message && (
                                            <p id="contact-message-error" className="text-2xs font-medium text-danger">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sample Assets / Cloud Link Input */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="sample-link" className={FIELD_LABEL_CLASS}>
                                                <span className="flex items-center gap-1.5">
                                                    <UploadCloud className="h-3 w-3 text-primary-ink" />
                                                    <span>Sample Assets or Reference Link <span className="text-2xs font-normal text-muted">(Optional)</span></span>
                                                </span>
                                            </label>
                                            <span className="text-[11px] text-subtle">Drive, Dropbox, WeTransfer</span>
                                        </div>
                                        <input
                                            id="sample-link"
                                            type="url"
                                            value={sampleCloudLink}
                                            onChange={(e) => setSampleCloudLink(e.target.value)}
                                            placeholder="https://drive.google.com/... or wetransfer.com/..."
                                            className={INPUT_CLASS}
                                        />
                                        <p className="text-[11px] text-subtle">
                                            Want a complimentary 1–3 image test retouch? Paste your cloud link here to benchmark our quality.
                                        </p>
                                    </div>

                                    {/* Footer: Elevated Full-Width Submit & Trust Badges */}
                                    <div className="space-y-2.5 border-t border-ink/8 pt-3.5">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                                    <span>Sending Message...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Send Message</span>
                                                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-center text-[11px] text-subtle">
                                            🔒 24h SLA Response &bull; Mutual NDA Protected &bull; Dedicated Studio QC Review
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
