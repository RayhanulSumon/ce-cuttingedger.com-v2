import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
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

const HIGHLIGHTS = [
    '30-Min Google Meet with a Dedicated Project Manager',
    'Live workflow walkthrough & custom volume pricing',
    'Complimentary 3-image production test batch',
];

const TIME_SLOTS = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '07:00 PM',
];

const TOPICS = [
    'Digital Twins',
    'Virtual Try-On',
    '2D Retouching',
    '3D CGI & Modeling',
];

export default function BookDemo() {
    const { settings, auth } = usePage<PageProps>().props;
    const contactEmail = settings?.contact_email || 'info@cuttingedger.com';
    const contactPhone = settings?.contact_phone || '+1 (409) 995-2565';

    // Calculate minimum date (tomorrow)
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]); // Default 11:30 AM
    const [selectedDate, setSelectedDate] = useState(tomorrow);
    const [selectedTopics, setSelectedTopics] = useState<string[]>(['Digital Twins', 'Virtual Try-On']);
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        company: auth?.user?.company || '',
        phone: auth?.user?.phone || '',
        notes: '',
    });

    const toggleTopic = (topic: string) => {
        setSelectedTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedMessage = [
            `30-Minute Discovery Session Scheduled (Google Meet)`,
            `Date: ${selectedDate}`,
            `Time: ${selectedSlot} (Client Timezone)`,
            `Topics: ${selectedTopics.join(', ') || 'General Discovery'}`,
            data.notes ? `Notes: ${data.notes}` : '',
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
                description="Schedule a 30-minute Google Meet call with a dedicated Cutting Edger project manager to review turnaround SLAs, custom pricing, and your free 3-image test."
                canonicalUrl="/book-a-demo"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Book a Demo', url: '/book-a-demo' },
                ]}
            />

            <div className="bg-page min-h-[calc(100vh-80px)] text-ink">
                <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
                            {/* LEFT COLUMN: Clean, Minimal Editorial Intro */}
                            <div className="space-y-6 lg:col-span-5 pt-2">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-2xs font-bold uppercase tracking-[0.16em] text-primary-ink">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                        <span>30-Min Discovery Session</span>
                                    </div>

                                    <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-ink leading-[1.12]">
                                        Book a <span className="text-primary-ink">Demo.</span>
                                    </h1>

                                    <p className="text-sm sm:text-base leading-relaxed text-muted max-w-md">
                                        Schedule a 30-minute Google Meet discovery call. At your scheduled time, one of our dedicated project managers will connect with you to plan your visual pipeline, review SLAs, and scope a free 3-image production test.
                                    </p>
                                </div>

                                {/* Minimal Highlights List */}
                                <div className="space-y-3 pt-2">
                                    {HIGHLIGHTS.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-ink">
                                            <CheckCircle2 className="h-4 w-4 text-primary-ink shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Trust Badges Strip */}
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted pt-2 border-t border-ink/10">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-primary-ink" />
                                        <span>24h Turnaround SLA</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5 text-primary-ink" />
                                        <span>Enterprise NDA</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Sparkles className="h-3.5 w-3.5 text-primary-ink" />
                                        <span>No Obligation</span>
                                    </span>
                                </div>

                                {/* Direct Contact Line */}
                                <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
                                    >
                                        <Mail size={13} className="text-primary-ink" />
                                        <span>{contactEmail}</span>
                                    </a>
                                    <span>&bull;</span>
                                    <a
                                        href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                                        className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
                                    >
                                        <Phone size={13} className="text-primary-ink" />
                                        <span>{contactPhone}</span>
                                    </a>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Dedicated 30-Min Schedule Booking Form */}
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
                                                    Schedule 30-Min Discovery Call
                                                </h2>
                                                <p className="text-2xs text-muted">
                                                    Live via Google Meet &bull; Dedicated Project Manager
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form or Confirmation View */}
                                    <div className="p-6 sm:p-8">
                                        {submitted ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-success-soft text-success shadow-xs">
                                                    <CheckCircle2 className="h-7 w-7" />
                                                </div>
                                                <h3 className="mt-4 font-display text-xl font-bold text-ink">
                                                    Discovery Call Requested!
                                                </h3>
                                                <p className="mt-2 max-w-sm text-xs sm:text-sm text-muted leading-relaxed">
                                                    Your 30-minute discovery session has been received for{' '}
                                                    <strong className="text-ink">{selectedDate}</strong> at{' '}
                                                    <strong className="text-ink">{selectedSlot}</strong>.
                                                </p>
                                                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left text-xs text-ink max-w-md w-full space-y-1.5">
                                                    <div className="flex items-center gap-2 font-bold text-primary-ink">
                                                        <Video size={14} />
                                                        <span>Google Meet Calendar Invite</span>
                                                    </div>
                                                    <p className="text-muted leading-relaxed">
                                                        We have sent a confirmation email to <span className="font-semibold text-ink">{data.email}</span>. One of our dedicated project managers will contact you and host the Google Meet session at your scheduled time.
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
                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                {/* Step 1: Date & Time Picker */}
                                                <div>
                                                    <label className="flex items-center gap-1.5 text-xs font-bold text-ink mb-2">
                                                        <Calendar className="h-3.5 w-3.5 text-primary-ink" />
                                                        <span>1. Select Date &amp; Preferred Time</span>
                                                    </label>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <input
                                                                type="date"
                                                                required
                                                                min={tomorrow}
                                                                value={selectedDate}
                                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                                className="w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-1.5">
                                                            {TIME_SLOTS.map((slot) => {
                                                                const isSelected = selectedSlot === slot;
                                                                return (
                                                                    <button
                                                                        key={slot}
                                                                        type="button"
                                                                        onClick={() => setSelectedSlot(slot)}
                                                                        className={`rounded-lg py-2 px-1 text-center text-2xs font-semibold transition-all ${
                                                                            isSelected
                                                                                ? 'bg-primary text-primary-foreground shadow-xs'
                                                                                : 'border border-ink/10 bg-surface-2 text-ink hover:border-ink/25'
                                                                        }`}
                                                                    >
                                                                        {slot}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Step 2: Topics of Interest */}
                                                <div>
                                                    <label className="flex items-center gap-1.5 text-xs font-bold text-ink mb-2">
                                                        <Sparkles className="h-3.5 w-3.5 text-primary-ink" />
                                                        <span>2. Services of Interest</span>
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {TOPICS.map((topic) => {
                                                            const isChecked = selectedTopics.includes(topic);
                                                            return (
                                                                <button
                                                                    key={topic}
                                                                    type="button"
                                                                    onClick={() => toggleTopic(topic)}
                                                                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                                                        isChecked
                                                                            ? 'bg-ink text-white shadow-xs'
                                                                            : 'border border-ink/15 bg-surface text-ink hover:border-ink/30'
                                                                    }`}
                                                                >
                                                                    {topic}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Step 3: Contact Details */}
                                                <div className="space-y-3 pt-1 border-t border-ink/10">
                                                    <p className="text-xs font-bold text-ink pt-1">
                                                        3. Your Details (For Calendar Invite)
                                                    </p>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-1 text-2xs font-bold text-ink mb-1">
                                                                <User className="h-3 w-3 text-subtle" />
                                                                <span>Full Name *</span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={data.name}
                                                                onChange={(e) => setData('name', e.target.value)}
                                                                placeholder="Alex Rivera"
                                                                className="w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                            />
                                                            {errors.name && (
                                                                <p className="mt-1 text-2xs text-danger">{errors.name}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center gap-1 text-2xs font-bold text-ink mb-1">
                                                                <Mail className="h-3 w-3 text-subtle" />
                                                                <span>Work Email *</span>
                                                            </div>
                                                            <input
                                                                type="email"
                                                                required
                                                                value={data.email}
                                                                onChange={(e) => setData('email', e.target.value)}
                                                                placeholder="alex@brand.com"
                                                                className="w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                            />
                                                            {errors.email && (
                                                                <p className="mt-1 text-2xs text-danger">{errors.email}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-1 text-2xs font-bold text-ink mb-1">
                                                                <Building2 className="h-3 w-3 text-subtle" />
                                                                <span>Brand / Company</span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={data.company}
                                                                onChange={(e) => setData('company', e.target.value)}
                                                                placeholder="Fashion Atelier"
                                                                className="w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                            />
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center gap-1 text-2xs font-bold text-ink mb-1">
                                                                <Phone className="h-3 w-3 text-subtle" />
                                                                <span>Phone / WhatsApp</span>
                                                            </div>
                                                            <input
                                                                type="tel"
                                                                value={data.phone}
                                                                onChange={(e) => setData('phone', e.target.value)}
                                                                placeholder="+1 (555) 000-0000"
                                                                className="w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <textarea
                                                            rows={2}
                                                            value={data.notes}
                                                            onChange={(e) => setData('notes', e.target.value)}
                                                            placeholder="Any specific questions or sample image links? (Optional)"
                                                            className="w-full rounded-xl border border-ink/15 bg-surface-2 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder:text-subtle/50 focus:border-primary focus:bg-surface focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_12px_28px_-10px_var(--color-primary)] transition-all hover:brightness-110 disabled:opacity-50"
                                                >
                                                    <span>
                                                        {processing
                                                            ? 'Scheduling Meeting...'
                                                            : `Confirm 30-Min Call for ${selectedSlot}`}
                                                    </span>
                                                    <ArrowRight size={14} />
                                                </button>

                                                <p className="text-center text-2xs text-subtle">
                                                    🔒 A Google Meet invite will be sent directly to your email. One of our dedicated project managers will contact you at your scheduled time.
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
