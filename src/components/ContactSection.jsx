import React, { useRef, useState } from 'react';
import { motion as Motion, useInView } from 'framer-motion';
import { CheckCircle, Github, Linkedin, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';
import { submitContactMessage } from '../services/contactService';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Input from './ui/Input';

const SOCIAL = [
    { Icon: Github, href: '#', label: 'GitHub' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const INFO = [
    { Icon: Mail, text: 'hello@jobfuz.com', label: 'Email' },
    { Icon: Phone, text: '+1 (800) 555-0199', label: 'Phone' },
    { Icon: MapPin, text: 'San Francisco, CA, USA', label: 'Location' },
];

export default function ContactSection({ embedded = false }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setError('Please complete your name, email, and message before sending.');
            return;
        }

        setSending(true);
        setError('');

        try {
            await submitContactMessage(form);
            setSent(true);
        } catch (submitError) {
            setError(submitError.message || 'We could not send your message right now.');
        } finally {
            setSending(false);
        }
    };

    return (
        <section
            id={embedded ? undefined : 'contact'}
            ref={ref}
            style={{ scrollMarginTop: '88px' }}
        >
            <div className={embedded ? 'w-full max-w-6xl mx-auto px-4 sm:px-6' : 'max-w-6xl mx-auto px-4 sm:px-6 py-20'}>
                <div className="section-shell px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
                    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.45 }}
                        >
                            <Badge variant="brand" className="uppercase tracking-[0.18em]">Contact</Badge>
                            <p className="page-kicker mt-6">Questions, partnerships, product feedback</p>
                            <h2 className="section-heading max-w-3xl">
                                A contact area that feels as polished as the rest of the product.
                            </h2>
                        </Motion.div>
                        <p className="section-copy max-w-xl">
                            The final section should stay warm and approachable, while still matching the premium tone established across the rest of the interface.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
                        <Motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.45, delay: 0.05 }}
                            className="grid gap-4"
                        >
                            {INFO.map((item) => (
                                <div key={item.label} className="panel-muted flex items-center gap-4 p-4">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-[18px]" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                        <item.Icon size={18} />
                                    </span>
                                    <div>
                                        <p className="page-kicker mb-2">{item.label}</p>
                                        <p className="text-sm font-medium" style={{ color: 'rgb(var(--text))' }}>{item.text}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="panel-muted p-5">
                                <p className="page-kicker mb-3">Follow the brand</p>
                                <div className="flex flex-wrap gap-3">
                                    {SOCIAL.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            aria-label={item.label}
                                            className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                                            style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--muted))', background: 'rgb(var(--surface-elevated) / 0.82)' }}
                                        >
                                            <item.Icon size={15} />
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </Motion.div>

                        <Motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.45, delay: 0.08 }}
                            className="panel-surface p-5 sm:p-6"
                        >
                            {sent ? (
                                <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-center">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgb(var(--success-soft))', color: 'rgb(var(--success))' }}>
                                        <CheckCircle size={28} />
                                    </span>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                            Message sent
                                        </h3>
                                        <p className="mt-2 max-w-md text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                            Thanks for reaching out. Your note has been saved and is ready for review.
                                        </p>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        rounded="full"
                                        onClick={() => {
                                            setSent(false);
                                            setError('');
                                            setForm({ name: '', email: '', message: '' });
                                        }}
                                    >
                                        Send another message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                                    {error && (
                                        <div className="danger-panel rounded-[18px] px-4 py-3 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                                Name
                                            </label>
                                            <Input
                                                name="name"
                                                placeholder="Your full name"
                                                value={form.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                                Email
                                            </label>
                                            <Input
                                                name="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={form.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            placeholder="Tell us what you need help with"
                                            value={form.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full resize-y rounded-[var(--radius)] border border-border bg-surface/90 px-4 py-3 text-sm text-text shadow-card transition-all duration-[220ms] placeholder:text-subtle focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand/15"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="brand"
                                        size="lg"
                                        rounded="full"
                                        disabled={sending}
                                        className="w-full justify-center"
                                    >
                                        {sending ? (
                                            <>
                                                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Send message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </Motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

