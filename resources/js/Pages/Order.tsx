import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PAD_X } from '@/Components/Landing/shared';
import { LandingLayout } from '@/Layouts/LandingLayout';
import { getAttributionData } from '@/lib/attribution';
import { PageProps } from '@/types';

interface OrderProps {
    /** Service slug passed by the landing page call to action (e.g. `digital-twins`). */
    service?: string;
    /** What the visitor was looking at when they clicked the call to action (e.g. a model or look name). */
    reference?: string;
}

interface OrderCopy {
    label: string;
    eyebrow: string;
    title: string;
    description: string;
    steps: { title: string; body: string }[];
    referenceLabel: string;
    referencePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    volumeLabel: string;
    submit: string;
}

/** Each service gets its own explanation and form wording. */
const COPY: Record<string, OrderCopy> = {
    'digital-twins': {
        label: 'Custom Digital Twin',
        eyebrow: 'Custom digital twin',
        title: 'Your own AI model, built for your brand.',
        description:
            'Tell us the look, style and poses you need. We create a photoreal digital twin that can wear every garment in your collection, and you choose between preset licences or full lifetime copyright.',
        steps: [
            { title: 'Share the model brief', body: 'Describe the look, age range, style and poses. Point us to any model in our catalogue you like.' },
            { title: 'Approve the likeness', body: 'We send a fixed quote and a first likeness proof. You approve or adjust before we build the full set.' },
            { title: 'Receive your twin', body: 'You get every pose in the formats you need, with the usage rights you selected.' },
        ],
        referenceLabel: 'Model you liked',
        referencePlaceholder: 'e.g. Celeste M. — Pleated Couture Twin',
        messageLabel: 'Describe the model you want',
        messagePlaceholder: 'Look, age range, skin tone, hair, style, poses, backgrounds, deadline…',
        volumeLabel: 'How many poses or images?',
        submit: 'Request my digital twin',
    },
    'virtual-try-on': {
        label: 'Virtual Try-On Look',
        eyebrow: 'Virtual try-on',
        title: 'Put your garments on our styled looks.',
        description:
            'Send us your pieces and pick a look. We dress our models in your garments, matching fit, drape and colour, so every item can be shown on a model without booking a shoot.',
        steps: [
            { title: 'Send your garments', body: 'Share flat lays, ghost-mannequin shots or product photos, plus the look you want them styled in.' },
            { title: 'Review the first proof', body: 'We return a try-on proof within one business day for you to check fit, colour and styling.' },
            { title: 'Receive the finished looks', body: 'Approved looks are delivered in your sizes and formats, ready for your store and campaigns.' },
        ],
        referenceLabel: 'Look you liked',
        referencePlaceholder: 'e.g. Look 3 — Linen Summer Set',
        messageLabel: 'Which garments should we try on?',
        messagePlaceholder: 'Garment types, colours, sizes, number of looks, deadline…',
        volumeLabel: 'How many looks or garments?',
        submit: 'Request my try-on',
    },
    retouching: {
        label: 'Retouching & Post-Production',
        eyebrow: 'Retouching',
        title: 'Clean, consistent images, delivered fast.',
        description:
            'Send a few files or a full catalog. We retouch to your style guide with 24-hour turnaround for standard batches and a fixed delivery date for larger projects.',
        steps: [
            { title: 'Send the files', body: 'Tell us what needs doing and how many images there are. Cloud links work for large batches.' },
            { title: 'Get a fixed quote', body: 'We reply within one business day with a per-image price and a delivery date.' },
            { title: 'Approve and receive', body: 'You review a first sample, then we deliver the full set in the formats you need.' },
        ],
        referenceLabel: 'Project you liked',
        referencePlaceholder: 'e.g. A case study from our showcase',
        messageLabel: 'Describe the work',
        messagePlaceholder: 'Image types, retouching needs, style guide, deadline…',
        volumeLabel: 'How many images?',
        submit: 'Send order request',
    },
    other: {
        label: 'Something else',
        eyebrow: 'Custom order',
        title: 'Tell us what you have in mind.',
        description: 'Pick a service and describe the work. We send back a fixed quote and delivery date within one business day.',
        steps: [
            { title: 'Send the brief', body: 'Tell us what you need and how many images are involved.' },
            { title: 'Get a fixed quote', body: 'We reply within one business day with a price and a delivery date.' },
            { title: 'Approve and receive', body: 'You review a first proof, then we deliver the full set.' },
        ],
        referenceLabel: 'Anything you liked',
        referencePlaceholder: 'e.g. A model, look or project name',
        messageLabel: 'Describe your order',
        messagePlaceholder: 'Garments, poses, backgrounds, deadline…',
        volumeLabel: 'How many images?',
        submit: 'Send order request',
    },
};

const SERVICES = Object.entries(COPY).map(([slug, copy]) => ({ slug, label: copy.label }));

const VOLUMES = ['1 – 10 images', '10 – 50 images', '50 – 500 images', '500+ images / month'];

const FIELD =
    'w-full rounded-xl border border-[#16191f]/15 bg-white px-3.5 py-2.5 text-sm text-[#16191f] placeholder-[#8a919c] outline-none transition-colors hover:border-[#16191f]/30 focus:border-[#f5761a] focus:ring-2 focus:ring-[#f5761a]/20';
const LABEL = 'flex items-center justify-between text-xs font-semibold text-[#3a3f48]';
const ERROR = 'text-xs text-rose-600';

export default function Order({ service = '', reference = '' }: OrderProps) {
    const { flash } = usePage<PageProps>().props;
    const initialService = SERVICES.find((item) => item.slug === service) ?? SERVICES[0];

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        name: '',
        email: '',
        company: '',
        service_interest: initialService.label,
        monthly_volume: VOLUMES[0],
        reference,
        message: '',
        honeypot: '',
    });

    // The wording follows the service picked in the form, so switching it explains the new service.
    const copy = Object.values(COPY).find((item) => item.label === data.service_interest) ?? COPY.other;

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const attribution = getAttributionData();

        // The contact endpoint stores one free-text brief, so the reference travels inside the message.
        transform(({ reference: selected, ...rest }) => ({
            ...rest,
            message: selected ? `Reference: ${selected}\n\n${rest.message}` : rest.message,
            submission_page_url: window.location.href,
            landing_page_url: attribution.landing_page_url || window.location.href,
            utm_source: attribution.utm_source || '',
            utm_medium: attribution.utm_medium || '',
            utm_campaign: attribution.utm_campaign || '',
        }));

        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset('message', 'reference'),
        });
    };

    return (
        <>
            <SeoHead
                title="Order a Custom Digital Twin or Try-On Look"
                description="Request a custom digital twin, virtual try-on look or retouching order from CuttingEdger. Fixed quote within one business day."
            />

            <section className={`pb-16 pt-28 sm:pt-32 ${PAD_X}`}>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#5d6572] transition-colors hover:text-[#f5761a]"
                >
                    <ArrowLeft size={14} />
                    Back to home
                </Link>

                <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5d6572]">{copy.eyebrow}</p>
                        <h1 className="mt-3 text-[clamp(30px,4.2vw,56px)] font-extrabold leading-[1] tracking-[-0.03em] text-[#16191f]">
                            {copy.title}
                        </h1>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#2f333a] sm:text-lg">{copy.description}</p>

                        <ol className="mt-10 space-y-6">
                            {copy.steps.map((step, i) => (
                                <li key={step.title} className="flex gap-4">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#16191f] text-sm font-bold text-white">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h2 className="text-base font-bold text-[#16191f]">{step.title}</h2>
                                        <p className="mt-1 text-sm leading-relaxed text-[#4a505b]">{step.body}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-4 rounded-3xl border border-[#16191f]/10 bg-white p-6 shadow-[0_24px_50px_-34px_rgba(22,25,31,0.35)] sm:p-8"
                    >
                        {flash?.success && (
                            <div role="status" className="flex items-start gap-3.5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-emerald-800">Order request received</p>
                                    <p className="text-xs leading-relaxed text-emerald-900/80">{flash.success}</p>
                                </div>
                            </div>
                        )}

                        <input
                            type="text"
                            name="website_url"
                            value={data.honeypot}
                            onChange={(event) => setData('honeypot', event.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                            className="hidden"
                            aria-hidden="true"
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="order-name" className={LABEL}>
                                    <span>Your name</span>
                                    <span className="text-[#f5761a]">*</span>
                                </label>
                                <input
                                    id="order-name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    autoComplete="name"
                                    className={FIELD}
                                />
                                {errors.name && <p className={ERROR}>{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="order-email" className={LABEL}>
                                    <span>Work email</span>
                                    <span className="text-[#f5761a]">*</span>
                                </label>
                                <input
                                    id="order-email"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    autoComplete="email"
                                    className={FIELD}
                                />
                                {errors.email && <p className={ERROR}>{errors.email}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="order-company" className={LABEL}>
                                Company
                            </label>
                            <input
                                id="order-company"
                                type="text"
                                value={data.company}
                                onChange={(event) => setData('company', event.target.value)}
                                autoComplete="organization"
                                className={FIELD}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="order-service" className={LABEL}>
                                    What do you want to order?
                                </label>
                                <select
                                    id="order-service"
                                    value={data.service_interest}
                                    onChange={(event) => setData('service_interest', event.target.value)}
                                    className={FIELD}
                                >
                                    {SERVICES.map((item) => (
                                        <option key={item.slug} value={item.label}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="order-volume" className={LABEL}>
                                    {copy.volumeLabel}
                                </label>
                                <select
                                    id="order-volume"
                                    value={data.monthly_volume}
                                    onChange={(event) => setData('monthly_volume', event.target.value)}
                                    className={FIELD}
                                >
                                    {VOLUMES.map((volume) => (
                                        <option key={volume} value={volume}>
                                            {volume}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="order-reference" className={LABEL}>
                                {copy.referenceLabel}
                            </label>
                            <input
                                id="order-reference"
                                type="text"
                                value={data.reference}
                                onChange={(event) => setData('reference', event.target.value)}
                                placeholder={copy.referencePlaceholder}
                                className={FIELD}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="order-message" className={LABEL}>
                                <span>{copy.messageLabel}</span>
                                <span className="text-[#f5761a]">*</span>
                            </label>
                            <textarea
                                id="order-message"
                                required
                                rows={5}
                                value={data.message}
                                onChange={(event) => setData('message', event.target.value)}
                                placeholder={copy.messagePlaceholder}
                                className={`${FIELD} resize-none`}
                            />
                            {errors.message && <p className={ERROR}>{errors.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f5761a] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(245,118,26,0.9)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#e0650c] disabled:opacity-60"
                        >
                            {processing ? 'Sending…' : copy.submit}
                            <ArrowUpRight size={18} />
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

Order.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;
