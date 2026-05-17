import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { BrandLockup } from './Brand';

export default function Footer() {
    return (
        <footer className="px-4 pb-8 sm:px-6">
            <div className="mx-auto max-w-6xl rounded-[32px] border px-6 py-7 sm:px-8" style={{ background: 'rgb(var(--surface-elevated) / 0.84)', borderColor: 'rgb(var(--border))', boxShadow: 'var(--shadow-panel)', backdropFilter: 'blur(20px)' }}>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-start">
                    <div>
                        <BrandLockup size={38} wordmarkClassName="text-[1.35rem]" />
                        <p className="mt-4 max-w-lg text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                            A calm, modern AI assessment platform that helps new graduates feel more prepared before sending applications into the real world.
                        </p>
                    </div>

                    <div>
                        <p className="page-kicker mb-3">Jump to</p>
                        <div className="grid gap-2 text-sm">
                            <a href="#features" style={{ color: 'rgb(var(--muted))' }}>Features</a>
                            <a href="#how-it-works" style={{ color: 'rgb(var(--muted))' }}>Process</a>
                            <a href="#contact" style={{ color: 'rgb(var(--muted))' }}>Contact</a>
                        </div>
                    </div>

                    <div>
                        <p className="page-kicker mb-3">Connect</p>
                        <div className="flex flex-wrap gap-2">
                            {[Github, Twitter, Linkedin, Mail].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:-translate-y-0.5"
                                    style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--muted))', background: 'rgb(var(--surface2) / 0.8)' }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t pt-5 text-xs sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--subtle))' }}>
                    <p>&copy; {new Date().getFullYear()} Jobfuz. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
