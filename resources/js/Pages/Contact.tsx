import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function Contact() {
    const { data, setData, post, processing, wasSuccessful, reset } = useForm({
        name: '',
        email: '',
        company: '',
        budget: '$25k - $50k',
        service_interest: 'Product Design & Web',
        message: '',
        honeypot: '',
    });

    const budgetTiers = [
        '< $15k',
        '$15k - $30k',
        '$30k - $60k',
        '$60k+',
    ];

    const serviceOptions = [
        'Product Design & UX',
        'Brand Architecture',
        'Kinetic 3D & Motion',
        'Creative Full-Stack Web',
        'Complete Flagship Build',
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <SeoHead
                title="Initiate Project Commission"
                description="Connect with the partners at CuttingEdger. Let's discuss your next digital flagship or category transformation."
            />

            <PageHero
                eyebrow="DIRECT ACCESS"
                title="LET’S INVENT THE"
                highlight="NEXT FRONTIER."
                description="We partner with a maximum of 4 clients concurrently to guarantee undivided focus, velocity, and uncompromised craft."
            />

            <section className="py-24 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#12141c] border border-white/10 shadow-2xl">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-2">
                                [ TRANSMISSION PROTOCOL ]
                            </span>
                            <h2 className="text-3xl font-display font-bold text-white mb-8">
                                Project Brief
                            </h2>

                            {wasSuccessful ? (
                                <div className="p-8 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00] text-center space-y-4">
                                    <CheckCircle2 className="w-12 h-12 text-[#d4ff00] mx-auto" />
                                    <h3 className="text-2xl font-display font-bold text-white">
                                        Transmission Acknowledged.
                                    </h3>
                                    <p className="text-neutral-300 text-sm max-w-md mx-auto">
                                        Your brief has landed in our studio terminal. Elena or Marcus will review your parameters and follow up within 24 business hours.
                                    </p>
                                </div>
                            ) : (
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

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Dr. Jessica Vance"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="jessica@quantum.io"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                                            Company / Venture Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            placeholder="Quantum Dynamics Inc."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                    </div>

                                    {/* Service Focus Selection */}
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                                            Primary Discipline
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {serviceOptions.map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setData('service_interest', opt)}
                                                    className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                                                        data.service_interest === opt
                                                            ? 'bg-[#d4ff00] text-black font-bold'
                                                            : 'bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Budget Tier Selection */}
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                                            Anticipated Capital Allocation
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {budgetTiers.map((b) => (
                                                <button
                                                    key={b}
                                                    type="button"
                                                    onClick={() => setData('budget', b)}
                                                    className={`px-3 py-2.5 rounded-lg text-xs font-mono text-center transition-colors cursor-pointer ${
                                                        data.budget === b
                                                            ? 'bg-[#d4ff00] text-black font-bold'
                                                            : 'bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    {b}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                                            Project Vision & Scope *
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Tell us about the problem, timeline, references, and ideal outcome..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[#d4ff00] text-black font-display font-bold py-4 px-6 rounded-xl hover:bg-[#c2eb00] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_25px_rgba(212,255,0,0.25)] disabled:opacity-50"
                                    >
                                        <span>{processing ? 'Transmitting...' : 'Dispatch Project Brief'}</span>
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Coordinates & Custom Dark Map Embed */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6">
                                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block">
                                    [ PHYSICAL & DIGITAL PRESENCE ]
                                </span>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-xl bg-white/5 text-[#d4ff00] mt-0.5">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-mono text-xs text-neutral-400 uppercase block">San Francisco Studio</span>
                                            <p className="text-white text-sm font-medium">
                                                742 Mission St, Design District, San Francisco, CA 94103
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-xl bg-white/5 text-[#d4ff00] mt-0.5">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-mono text-xs text-neutral-400 uppercase block">Inbound Commissions</span>
                                            <a href="mailto:hello@cuttingedger.com" className="text-white hover:text-[#d4ff00] text-sm font-medium transition-colors">
                                                hello@cuttingedger.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-xl bg-white/5 text-[#d4ff00] mt-0.5">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-mono text-xs text-neutral-400 uppercase block">Studio Switchboard</span>
                                            <a href="tel:+18005553343" className="text-white hover:text-[#d4ff00] text-sm font-medium transition-colors">
                                                +1 (800) 555-EDGE
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Styled Dark Interactive SVG Map */}
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0e1018] p-6 text-center space-y-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block">
                                    Studio Radar Coordinates
                                </span>

                                <div className="relative w-full aspect-[16/10] bg-[#0c0d12] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 bg-grain opacity-40" />
                                    <div className="absolute inset-0 [background:radial-gradient(#2d3345_1px,transparent_1px)] [background-size:16px_16px]" />

                                    {/* Radar Circle Rings */}
                                    <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center animate-ping" style={{ animationDuration: '4s' }} />
                                    <div className="absolute w-24 h-24 rounded-full border border-[#d4ff00]/30 flex items-center justify-center" />
                                    <div className="absolute w-3 h-3 rounded-full bg-[#d4ff00] shadow-[0_0_15px_#d4ff00]" />

                                    <div className="absolute bottom-3 left-3 bg-black/80 px-2.5 py-1 rounded text-[10px] font-mono text-[#d4ff00]">
                                        37.7749° N, 122.4194° W
                                    </div>
                                </div>

                                <p className="text-xs text-neutral-500 font-mono">
                                    In-person studio workshops by appointment only.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
