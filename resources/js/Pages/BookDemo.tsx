import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageProps } from '@/types';
import {
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Mail,
    Phone,
    Shield,
    Sparkles,
    User,
    Video,
} from 'lucide-react';

const WHAT_WE_COVER = [
    {
        title: '30-Min Walkthrough with a Project Manager',
        detail: 'Connect directly on Google Meet to align on your workflow and delivery targets.',
    },
    {
        title: 'Custom Volume Pricing & SLAs',
        detail: 'Transparent per-SKU rates, 24h standard delivery, and rush queues.',
    },
    {
        title: 'Complimentary 3-Image Production Test',
        detail: 'Benchmark our retouching and 3D CGI quality on your own raw assets.',
    },
];

const TIME_SLOTS = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '07:00 PM',
];

export default function BookDemo() {
    const { settings, auth } = usePage<PageProps>().props;
    const contactEmail = settings?.contact_email || 'info@cuttingedger.com';
    const contactPhone = settings?.contact_phone || '+1 (409) 995-2565';

    // Minimum date is tomorrow
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState(tomorrow);
    const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        company: auth?.user?.company || '',
        phone: auth?.user?.phone || '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedMessage = [
            `30-Minute Discovery Session via Google Meet`,
            `Scheduled Date: ${selectedDate}`,
            `Scheduled Time: ${selectedTime} (Client Local Time)`,
            `Platform: Google Meet`,
            data.notes ? `Client Notes: ${data.notes}` : '',
        ]
            .filter(Boolean)
            .join('\n');

        post(route('contact.store'), {
            preserveScroll: true,
            data: {
                ...data,
                service_interest: '30-Min Live Demo (Google Meet)',
                message: formattedMessage,
            },
            onSuccess: () => {
                setSubmitted(true);
            },
        });
    };

    return (
        <>
            <SeoHead
                title="Book a Demo — 30-Min Discovery Session | Cutting Edger"
                description="Schedule a 30-minute Google Meet call with a Cutting Edger project manager to review turnaround SLAs, custom pricing, and your free 3-image test."
                canonicalUrl="/book-a-demo"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Book a Demo', url: '/book-a-demo' },
                ]}
            />

            <div className="bg-page min-h-[calc(100vh-80px)] text-ink">
                <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                            {/* LEFT COLUMN: Original Card-Structured Design with Minimal Text */}
                            <div className="space-y-5 lg:col-span-5">
                                {/* Header */}
                                <div className="space-y-2.5">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-2xs font-semibold uppercase tracking-[0.14em] text-primary-ink">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                        30-Min Live Demo
                                    </span>

                                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                                        Book a <span className="text-primary-ink">Demo</span>.
                                    </h1>

                                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                                        Pick a convenient time for a 30-minute Google Meet session with our project manager.
                                    </p>
                                </div>

                                {/* Production Hub Status Card */}
                                <div className="rounded-2xl border border-ink/8 bg-surface p-4 flex items-center justify-between gap-3 shadow-2xs">
                                    <div className="flex items-center gap-3">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold text-ink">Production Hubs Online</p>
                                            <p className="text-2xs text-subtle">24/7 Dual-Shift Production Queue</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-2xs font-bold text-emerald-700">
                                        Live
                                    </span>
                                </div>

                                {/* What We Cover Card */}
                                <div className="rounded-2xl border border-ink/8 bg-surface p-5 space-y-3.5 shadow-2xs">
                                    <p className="text-2xs font-bold uppercase tracking-[0.14em] text-subtle">
                                        What We Cover
                                    </p>
                                    <ul className="space-y-3">
                                        {WHAT_WE_COVER.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-xs">
                                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-ink leading-snug">{item.title}</p>
                                                    <p className="text-muted leading-relaxed text-2xs mt-0.5">{item.detail}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap items-center gap-4 text-2xs font-semibold text-muted pt-0.5">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                        24h SLA
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5 text-primary" />
                                        Mutual NDA
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                                        No obligation
                                    </span>
                                </div>

                                {/* Written Brief Card */}
                                <div className="rounded-2xl border border-dashed border-ink/12 bg-surface-2/60 p-4 space-y-2 text-xs">
                                    <p className="font-bold text-ink">Prefer to send a written brief?</p>
                                    <div className="flex items-center justify-between gap-3 text-2xs">
                                        <Link
                                            href="/contact"
                                            className="inline-flex items-center gap-1 font-semibold text-primary-ink hover:underline"
                                        >
                                            Go to Contact Page <ArrowRight className="h-3 w-3" />
                                        </Link>
                                        <a
                                            href={`mailto:${contactEmail}`}
                                            className="text-subtle hover:text-ink transition-colors inline-flex items-center gap-1"
                                        >
                                            <Mail className="h-3 w-3" />
                                            {contactEmail}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Elevated Schedule Booking Card */}
                            <div className="lg:col-span-7">
                                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-sm">
                                    {/* Card Header Bar */}
                                    <div className="flex items-center justify-between gap-3 border-b border-ink/8 px-6 py-4 bg-surface-2">
                                        <div className="flex items-center gap-3">
                                            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary-ink">
                                                <Video className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <h2 className="text-sm font-bold text-ink">
                                                    Select a Date &amp; Time
                                                </h2>
                                                <p className="text-2xs text-muted">
                                                    30-Min Google Meet &bull; Project Manager
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form or Confirmation View */}
                                    <div className="p-6 sm:p-8">
                                        {submitted ? (
                                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-success-soft text-success shadow-xs">
                                                    <CheckCircle2 className="h-7 w-7" />
                                                </div>
                                                <h3 className="mt-4 font-display text-xl font-bold text-ink">
                                                    Discovery Call Requested!
                                                </h3>
                                                <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                                                    Your 30-minute discovery call has been scheduled for{' '}
                                                    <strong className="text-ink">{selectedDate}</strong> at{' '}
                                                    <strong className="text-ink">{selectedTime}</strong>.
                                                </p>
                                                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left text-xs text-ink w-full space-y-1.5">
                                                    <div className="flex items-center gap-2 font-bold text-primary-ink">
                                                        <Video size={14} />
                                                        <span>Google Meet Calendar Invite</span>
                                                    </div>
                                                    <p className="text-muted leading-relaxed">
                                                        We have sent a calendar invite to <span className="font-semibold text-ink">{data.email}</span>. One of our project managers will contact you and join the Google Meet session at your scheduled time.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSubmitted(false)}
                                                    className="mt-6 rounded-full border border-ink/15 px-5 py-2 text-xs font-semibold text-ink hover:bg-surface-2 transition-colors"
                                                >
                                                    Schedule Another Session
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                {/* Date & Time Picker */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                    <div>
                                                        <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                                            <Calendar className="h-3.5 w-3.5 text-subtle" />
                                                            <span>Preferred Date *</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            required
                                                            min={tomorrow}
                                                            value={selectedDate}
                                                            onChange={(e) => setSelectedDate(e.target.value)}
                                                            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                                            <Clock className="h-3.5 w-3.5 text-subtle" />
                                                            <span>Time Slot *</span>
                                                        </label>
                                                        <select
                                                            value={selectedTime}
                                                            onChange={(e) => setSelectedTime(e.target.value)}
                                                            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                        >
                                                            {TIME_SLOTS.map((slot) => (
                                                                <option key={slot} value={slot}>
                                                                    {slot} (Your Timezone)
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Contact Details */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                                    <div>
                                                        <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                                            <User className="h-3.5 w-3.5 text-subtle" />
                                                            <span>Full Name *</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={data.name}
                                                            onChange={(e) => setData('name', e.target.value)}
                                                            placeholder="Alex Rivera"
                                                            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                        />
                                                        {errors.name && (
                                                            <p className="mt-1 text-2xs text-danger">{errors.name}</p>
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
                                                            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                        />
                                                        {errors.email && (
                                                            <p className="mt-1 text-2xs text-danger">{errors.email}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                                                            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
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
                                                            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                                                        <Sparkles className="h-3.5 w-3.5 text-subtle" />
                                                        <span>Questions or Project Notes (Optional)</span>
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        value={data.notes}
                                                        onChange={(e) => setData('notes', e.target.value)}
                                                        placeholder="e.g. Digital Twins, Virtual Try-On, or custom batch retouching volumes..."
                                                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-surface focus:outline-none"
                                                    />
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
                                                >
                                                    <span>
                                                        {processing
                                                            ? 'Scheduling Call...'
                                                            : `Confirm 30-Min Demo (${selectedTime})`}
                                                    </span>
                                                    <ArrowRight size={14} />
                                                </button>

                                                <p className="text-center text-2xs text-subtle pt-1">
                                                    🔒 Google Meet invite sent via email &bull; One of our project managers will contact you at your scheduled time.
                                                </p>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
