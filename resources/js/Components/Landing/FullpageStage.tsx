import React from 'react';
import { motion } from 'framer-motion';

interface FullpageStageProps {
    index: number;
    sections: React.ReactNode[];
}

/** Stacks every section full-screen; the active one slides in, the others park above or below. */
export function FullpageStage({ index, sections }: FullpageStageProps) {
    return (
        <div className="fixed inset-0 overflow-hidden">
            {sections.map((section, i) => {
                const y = i < index ? '-100%' : i > index ? '100%' : '0%';
                return (
                    <motion.section
                        key={i}
                        className="absolute inset-0"
                        initial={false}
                        animate={{ y }}
                        transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
                        style={{ zIndex: i === index ? 2 : 1, visibility: Math.abs(i - index) > 1 ? 'hidden' : 'visible' }}
                        aria-hidden={i !== index}
                        {...(i !== index ? { inert: true } : {})}
                    >
                        {section}
                    </motion.section>
                );
            })}
        </div>
    );
}

