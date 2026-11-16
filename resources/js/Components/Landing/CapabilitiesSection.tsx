import React, { memo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { PageProps } from '@/types';
import { Eyebrow, PAD_X, Reveal, SectionProps } from './shared';

const CAPABILITY_IMAGES = [
    '/images/portfolio/portfolio-1.jpg',
    '/images/portfolio/portfolio-2.jpg',
    '/images/portfolio/portfolio-3.jpg',
    '/images/portfolio/portfolio-4.jpg',
] as const;

/** The main capabilities (2D, 3D, DTP, Video) as clean editorial grid tiles. Content comes from the admin panel. */
export const CapabilitiesSection = memo(function CapabilitiesSection({ active, openDemo }: SectionProps) {
    const { capabilities_nav = [] } = usePage<PageProps>().props;

    return (
        <div
            data-scrollable
            className={`flex h-full w-full flex-col justify-center overflow-y-auto bg-page pb-8 pt-24 ${PAD_X}`}
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <Reveal active={active}>
                        <Eyebrow>Capabilities</Eyebrow>
                        <h2 className="mt-2 text-[clamp(22px,2.8vw,38px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-ink">
                            What can we help you with
                        </h2>
                    </Reveal>
                    <Reveal active={active} delay={0.08}>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                            Four core capabilities, many specialities. Pick one to see what we deliver and how it works.
                        </p>
                    </Reveal>
                </div>

                <Reveal active={active} delay={0.14} className="flex shrink-0 flex-wrap items-center gap-2.5">
                    <Link
                        href="/capabilities"
                        prefetch
                        className="rounded-full border border-ink/20 bg-surface px-5 py-2.5 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white sm:text-sm"
                    >
                        All capabilities
                    </Link>
                    <button
                        type="button"
                        onClick={openDemo}
                        className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-hover sm:text-sm"
                    >
                        Book a Demo
                    </button>
                </Reveal>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-8 lg:grid-cols-4">
                {capabilities_nav.map((capability, i) => {
                    const imageSrc = CAPABILITY_IMAGES[i % CAPABILITY_IMAGES.length];

                    return (
                        <li key={capability.id}>
                            <Reveal active={active} delay={0.18 + i * 0.06} y="20px" className="h-full">
                                <Link href={capability.path} prefetch className="group block h-full">
                                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-ink/10 bg-surface">
                                        <img
                                            src={imageSrc}
                                            alt={capability.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                                        />
                                        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-surface/90 text-ink opacity-0 shadow-sm backdrop-blur-sm transition-[opacity,transform,background-color,color] duration-200 group-hover:rotate-45 group-hover:bg-primary group-hover:text-white group-hover:opacity-100">
                                            <ArrowUpRight size={15} />
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <h3 className="truncate text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors duration-200 group-hover:text-primary sm:text-sm">
                                            {capability.title}
                                        </h3>
                                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                                            {capability.subtitle}
                                        </p>
                                    </div>
                                </Link>
                            </Reveal>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
});
