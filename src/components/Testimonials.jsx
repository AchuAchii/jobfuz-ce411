import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Badge from './ui/Badge';

const TESTIMONIALS = [
    {
        quote: 'Jobfuz made the whole prep process feel less chaotic. I knew what to improve before I started sending resumes.',
        name: 'Sarah Chen',
        role: 'Software Engineer',
    },
    {
        quote: 'The writing and interview practice helped me sound much more composed. It felt like a rehearsal space, not a generic quiz site.',
        name: 'Michael Rodriguez',
        role: 'Product Manager',
    },
    {
        quote: 'I liked that the design felt serious and clean. It gave me confidence that the feedback was worth paying attention to.',
        name: 'Emily Watson',
        role: 'Data Analyst',
    },
];

export default function Testimonials() {
    return (
        <section className="section-shell px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <Badge variant="muted" className="uppercase tracking-[0.18em]">Success stories</Badge>
                    <p className="page-kicker mt-6">What users feel after using it</p>
                    <h2 className="section-heading max-w-3xl">
                        Less uncertainty, more clarity before applying.
                    </h2>
                </div>
                <p className="section-copy max-w-xl">
                    The strongest signal here is emotional: graduates leave feeling calmer, better prepared, and more certain about the next step.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {TESTIMONIALS.map((item, index) => (
                    <Motion.article
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}
                        className="interactive-tile flex h-full flex-col p-6"
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[18px]" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                            <Quote size={18} />
                        </div>
                        <p className="flex-1 text-base leading-8" style={{ color: 'rgb(var(--muted))' }}>
                            "{item.quote}"
                        </p>
                        <div className="mt-6 border-t pt-4" style={{ borderColor: 'rgb(var(--border))' }}>
                            <p className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>{item.name}</p>
                            <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>{item.role}</p>
                        </div>
                    </Motion.article>
                ))}
            </div>
        </section>
    );
}

