import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface AccordionItemProps {
    id: string | number;
    question: string;
    answer: string;
    category?: string;
    defaultOpen?: boolean;
}

export function AccordionItem({ id, question, answer, defaultOpen = false }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-ink/10 group transition-colors">
            <button
                type="button"
                id={`accordion-btn-${id}`}
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${id}`}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 sm:py-8 flex items-center justify-between text-left cursor-pointer focus:outline-none"
            >
                <span className="font-display font-bold text-lg sm:text-2xl text-ink group-hover:text-primary-ink transition-colors pr-6">
                    {question}
                </span>

                <div
                    className={`w-9 h-9 shrink-0 rounded-full border border-ink/10 flex items-center justify-center transition-all duration-300 ${
                        isOpen
                            ? 'bg-primary text-white border-primary'
                            : 'text-muted group-hover:border-primary group-hover:text-primary-ink'
                    }`}
                >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>

            <div
                id={`accordion-panel-${id}`}
                role="region"
                aria-labelledby={`accordion-btn-${id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100 pb-8' : 'max-h-0 opacity-0'
                }`}
            >
                <p className="text-muted text-sm sm:text-base leading-relaxed max-w-3xl">
                    {answer}
                </p>
            </div>
        </div>
    );
}

export function Accordion({ items }: { items: AccordionItemProps[] }) {
    return (
        <div className="divide-y divide-transparent">
            {items.map((item, index) => (
                <AccordionItem
                    key={item.id}
                    {...item}
                    defaultOpen={index === 0}
                />
            ))}
        </div>
    );
}
