import React from 'react';
import { Client } from '@/types/models';
import { Marquee } from '@/Components/ui/Marquee';
import { Eyebrow, Reveal, SectionProps } from './shared';

const FALLBACK_NAMES = ['Zara Studio', 'Northline', 'Aurelle', 'Maison Vell', 'Kōrin', 'Atelier 9', 'Oakhouse', 'Lumen & Co', 'Veridian', 'Halcyon'];

interface ClientsProps extends SectionProps {
    clients: Client[];
}

function Logo({ name, src }: { name: string; src?: string }) {
    return (
        <div className="mx-6 flex h-24 w-56 shrink-0 items-center justify-center rounded-2xl border border-[#1d1d1d]/10 bg-white px-6">
            {src ? (
                <img src={src} alt={name} loading="lazy" className="max-h-12 max-w-full object-contain grayscale" />
            ) : (
                <span className="text-lg font-extrabold tracking-tight text-[#1d1d1d]/70">{name}</span>
            )}
        </div>
    );
}

export function ClientsSection({ active, clients }: ClientsProps) {
    const logos = clients.length
        ? clients.map((c) => ({ name: c.name, src: c.logo_light || c.logo_dark }))
        : FALLBACK_NAMES.map((name) => ({ name, src: undefined }));
    const half = Math.ceil(logos.length / 2);
    const rowOne = logos.slice(0, half);
    const rowTwo = logos.slice(half).length ? logos.slice(half) : logos;

    return (
        <div className="flex h-full w-full flex-col justify-center gap-10 overflow-hidden bg-[#f2f2f1] pt-20">
            <Reveal active={active} className="px-6 text-center sm:px-14">
                <Eyebrow>05 / Client list</Eyebrow>
                <h2 className="mx-auto mt-3 max-w-3xl text-[clamp(28px,4.6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#1d1d1d]">
                    Trusted by brands that ship at scale.
                </h2>
            </Reveal>
            <Reveal active={active} delay={0.2} className="space-y-5">
                <Marquee direction="left" speed="slow">
                    {rowOne.map((l, i) => (
                        <Logo key={l.name + i} {...l} />
                    ))}
                </Marquee>
                <Marquee direction="right" speed="slow">
                    {rowTwo.map((l, i) => (
                        <Logo key={l.name + i} {...l} />
                    ))}
                </Marquee>
            </Reveal>
        </div>
    );
}

