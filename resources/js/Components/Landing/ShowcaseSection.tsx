import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/types/models';
import { Eyebrow, Reveal, SectionProps } from './shared';

const FALLBACK = [
    { title: 'Apparel Catalog', category: '2D Retouching', image: '/images/portfolio/portfolio-1.jpg', href: '/case-studies' },
    { title: 'Jewelry Close-ups', category: 'High-end retouch', image: '/images/portfolio/portfolio-2.jpg', href: '/case-studies' },
    { title: 'Furniture CGI', category: '3D Visualisation', image: '/images/portfolio/portfolio-3.jpg', href: '/case-studies' },
    { title: 'Campaign Layouts', category: 'DTP', image: '/images/portfolio/portfolio-4.jpg', href: '/case-studies' },
];

interface ShowcaseProps extends SectionProps {
    projects: Project[];
}

export function ShowcaseSection({ active, projects }: ShowcaseProps) {
    const items = projects.length
        ? projects.slice(0, 4).map((p, i) => ({
              title: p.title,
              category: p.category?.name ?? p.client_name,
              image: p.cover_image || FALLBACK[i % 4].image,
              href: `/case-studies/${p.slug}`,
          }))
        : FALLBACK;
    const [open, setOpen] = useState(0);

    return (
        <div className="flex h-full w-full flex-col bg-[#f5f4ef] px-6 pb-8 pt-24 sm:px-14">
            <Reveal active={active} className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <Eyebrow>04 / Showcase</Eyebrow>
                    <h2 className="mt-3 text-[clamp(28px,4.6vw,64px)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#0f0f0e]">
                        Selected work
                    </h2>
                </div>
                <Link href="/case-studies" className="inline-flex items-center gap-1 border-b border-[#0f0f0e] pb-1 text-sm font-semibold">
                    All case studies <ArrowUpRight size={16} />
                </Link>
            </Reveal>

            <Reveal active={active} delay={0.15} className="mt-6 flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
                {items.map((item, i) => (
                    <Link
                        key={item.title + i}
                        href={item.href}
                        onMouseEnter={() => setOpen(i)}
                        onFocus={() => setOpen(i)}
                        style={{ backgroundImage: `url(${item.image})` }}
                        className={`group relative min-h-0 overflow-hidden rounded-[22px] bg-[#151515] bg-cover bg-center transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
                            open === i ? 'flex-[4]' : 'flex-[1]'
                        }`}
                    >
                        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        <span className="absolute bottom-5 left-5 right-5 text-white">
                            <span className="block text-[10px] uppercase tracking-[0.25em] opacity-70">{item.category}</span>
                            <span className="mt-1 block text-xl font-extrabold leading-tight lg:whitespace-nowrap">{item.title}</span>
                        </span>
                        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-black opacity-0 transition-opacity group-hover:opacity-100">
                            <ArrowUpRight size={18} />
                        </span>
                    </Link>
                ))}
            </Reveal>
        </div>
    );
}

