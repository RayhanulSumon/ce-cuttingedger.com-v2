import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/Components/Common/PageHero';
import { SeoHead } from '@/Components/Common/SeoHead';
import { getAttributionData } from '@/lib/attribution';
import { PageProps } from '@/types';

interface OrderProps {
    /** Service slug passed by the landing page call to action (e.g. `digital-twins`). */
    service?: string;
    /** What the visitor was looking at when they clicked "Order now" (e.g. a model or look name). */
    reference?: string;
}

const SERVICES = [
    { slug: 'digital-twins', label: 'Custom Digital Twin' },
    { slug: 'virtual-try-on', label: 'Virtual Try-On Look' },
    { slug: 'retouching', label: 'Retouching & Post-Production' },
    { slug: 'other', label: 'Something else' },
];

const VOLUMES = ['1 – 10 images', '10 – 50 images', '50 – 500 images', '500+ images / month'];

const FIELD =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors hover:border-white/20 focus:border-accent focus:ring-1 focus:ring-accent/30';
const LABEL = 'flex items-center justify-between text-xs font-medium text-neutral-300';
const ERROR = 'font-mono text-xs text-rose-400';

const STEPS = [
    { title: 'Send the brief', body: 'Tell us which model, look or garment you want and how many images you need.' },
    { title: 'Get a fixed quote', body: 'We reply within one business day with a price and a delivery date.' },
    { title: 'Approve & receive', body: 'You review a first proof, then we deliver the full set in the formats you need.' },
];

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

            <PageHero
                compact
                eyebrow="Custom order"
                title="Order exactly the look"
                highlight="you have in mind."
                description="Pick a model, a look or a garment and tell us what you need. We send back a fixed quote and delivery date within one business day."
                backUrl="/"
                backLabel="Back to home"
            />

            <section className="bg-[#0a0b0e] py-12 sm:py-16">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
                    <ol className="space-y-6">
                        {STEPS.map((step, i) => (
                            <li key={step.title} className="flex gap-4">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent/40 font-mono text-xs font-bold text-accent">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <h2 className="text-base font-bold text-white">{step.title}</h2>
                                    <p className="mt-1 text-sm leading-relaxed text-neutral-400">{step.body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white/10 bg-[#12141a] p-6 sm:p-8">
                        {flash?.success && (
                            <div role="status" className="flex items-start gap-3.5 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-white">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-accent">Order request received</p>
                                    <p className="text-xs leading-relaxed text-neutral-300">{flash.success}</p>
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
                                    <span className="text-accent">*</span>
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
                                    <span className="text-accent">*</span>
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
                                    How many images?
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
                                Model or look you liked
                            </label>
                            <input
                                id="order-reference"
                                type="text"
                                value={data.reference}
                                onChange={(event) => setData('reference', event.target.value)}
                                placeholder="e.g. Celeste M. — Pleated Couture Twin"
                                className={FIELD}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="order-message" className={LABEL}>
                                <span>Describe your order</span>
                                <span className="text-accent">*</span>
                            </label>
                            <textarea
                                id="order-message"
                                required
                                rows={5}
                                value={data.message}
                                onChange={(event) => setData('message', event.target.value)}
                                placeholder="Garments, poses, backgrounds, deadline…"
                                className={`${FIELD} resize-none`}
                            />
                            {errors.message && <p className={ERROR}>{errors.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-[#0a0b0e] transition-colors hover:bg-accent-hover disabled:opacity-60"
                        >
                            {processing ? 'Sending…' : 'Send order request'}
                            <ArrowUpRight size={18} />
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
