import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Clock3, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

const BULLETS = [
    { icon: ShieldCheck, text: 'Free to start and easy to revisit later' },
    { icon: Clock3, text: 'Usually completed in under 45 minutes' },
];

export default function CTAStrip() {
    const navigate = useNavigate();

    return (
        <Motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="section-shell px-6 py-8 sm:px-8 sm:py-10 lg:px-12"
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.75fr)] lg:items-end">
                <div>
                    <p className="page-kicker">Ready when they are</p>
                    <h2 className="section-heading max-w-3xl">
                        Help users move from "I hope I am ready" to "I know what to improve next."
                    </h2>
                    <p className="section-copy max-w-2xl">
                        The tone stays aspirational, but grounded. This is the final nudge to begin the experience with confidence.
                    </p>
                </div>

                <div className="panel-muted p-5 sm:p-6">
                    <div className="flex flex-col gap-4">
                        <Button
                            variant="brand"
                            size="xl"
                            rounded="full"
                            onClick={() => navigate('/signup')}
                            className="w-full justify-center"
                        >
                            Start your assessment
                            <ArrowRight size={18} />
                        </Button>

                        <div className="grid gap-3">
                            {BULLETS.map((bullet) => (
                                <div key={bullet.text} className="flex items-center gap-3 rounded-[18px] border px-4 py-3" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface-elevated) / 0.76)' }}>
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                        <bullet.icon size={17} />
                                    </span>
                                    <span className="text-sm font-medium" style={{ color: 'rgb(var(--muted))' }}>{bullet.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Motion.section>
    );
}

