import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Check, Search } from 'lucide-react';
import { PROFESSIONS } from '../data/professions';
import Button from './ui/Button';
import Input from './ui/Input';

export default function ProfessionModal({ isOpen, onSelect, initialProfession = null }) {
    const [selectedId, setSelectedId] = useState(initialProfession);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProfessions = PROFESSIONS.filter((profession) =>
        profession.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                style={{ background: 'rgb(8 13 22 / 0.55)', backdropFilter: 'blur(12px)' }}
            >
                <Motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: 12 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-3xl overflow-hidden rounded-[34px] border"
                    style={{
                        background: 'rgb(var(--surface-elevated) / 0.95)',
                        borderColor: 'rgb(var(--border))',
                        boxShadow: 'var(--shadow-panel)',
                        backdropFilter: 'blur(24px)',
                    }}
                >
                    <div className="grid gap-6 p-6 sm:p-8">
                        <div className="text-center">
                            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                <Briefcase size={28} />
                            </span>
                            <p className="page-kicker mt-6">Career path selection</p>
                            <h2 className="text-[2rem] font-black tracking-[-0.05em]" style={{ color: 'rgb(var(--text))' }}>
                                Choose the role you want to prepare for.
                            </h2>
                            <p className="mt-3 text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                Your selection personalizes questions, guidance, and the overall assessment flow.
                            </p>
                        </div>

                        <Input
                            type="text"
                            placeholder="Search professions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            startIcon={<Search size={16} />}
                        />

                        <div className="grid max-h-[340px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                            {filteredProfessions.map((profession) => {
                                const isSelected = selectedId === profession.id;

                                return (
                                    <button
                                        key={profession.id}
                                        type="button"
                                        onClick={() => setSelectedId(profession.id)}
                                        className="interactive-tile flex items-center gap-3 p-4 text-left"
                                        style={isSelected ? { background: 'rgb(var(--brand-soft))', borderColor: 'rgb(var(--brand) / 0.2)' } : undefined}
                                    >
                                        <span className="flex h-11 w-11 items-center justify-center rounded-[18px]" style={{ background: isSelected ? 'rgb(var(--surface-elevated))' : 'rgb(var(--surface2))', color: 'rgb(var(--brand))' }}>
                                            <Briefcase size={18} />
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>
                                                {profession.label}
                                            </p>
                                            <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                                Personalized track
                                            </p>
                                        </div>
                                        {isSelected && <Check size={16} style={{ color: 'rgb(var(--brand))' }} />}
                                    </button>
                                );
                            })}
                        </div>

                        <Button
                            variant="brand"
                            size="lg"
                            rounded="full"
                            onClick={() => selectedId && onSelect(selectedId)}
                            disabled={!selectedId}
                            className="w-full justify-center"
                        >
                            Confirm selection
                        </Button>
                    </div>
                </Motion.div>
            </div>
        </AnimatePresence>
    );
}
