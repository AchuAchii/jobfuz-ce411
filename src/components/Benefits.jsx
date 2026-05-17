import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Award, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import Badge from './ui/Badge';

const BENEFITS = [
    {
        icon: ShieldCheck,
        title: 'Quietly trustworthy',
        description: 'The product tone stays measured and credible so new graduates feel supported instead of judged.',
    },
    {
        icon: Target,
        title: 'Focused feedback',
        description: 'Each assessment tells users what improved and what deserves attention next, without overwhelming them.',
    },
    {
        icon: Award,
        title: 'Professional polish',
        description: 'From the first screen to the final result, the interface feels like a premium readiness studio.',
    },
    {
        icon: TrendingUp,
        title: 'Progress you can revisit',
        description: 'History, insights, and stage tracking turn preparation into an ongoing process rather than a one-off test.',
    },
];

export default function Benefits() {
    return (
        <section className="section-shell px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="panel-muted p-6 sm:p-7 lg:p-8">
                    <Badge variant="brand" className="uppercase tracking-[0.18em]">Why it works</Badge>
                    <p className="page-kicker mt-6">Designed for first-job confidence</p>
                    <h2 className="section-heading max-w-2xl">
                        Help graduates feel more prepared before the market asks them to be.
                    </h2>
                    <p className="section-copy max-w-2xl">
                        Jobfuz is not about loud gamification. It is about giving early-career users a space that feels modern,
                        calm, and dependable while they work through genuinely stressful milestones.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {BENEFITS.map((benefit, index) => {
                        const Icon = benefit.icon;

                        return (
                            <Motion.article
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                                className="interactive-tile p-5"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[18px]" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                    <Icon size={18} />
                                </div>
                                <h3 className="mb-2 text-lg font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                    {benefit.title}
                                </h3>
                                <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                    {benefit.description}
                                </p>
                            </Motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

