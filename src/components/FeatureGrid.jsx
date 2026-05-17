import React from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';

export default function FeatureGrid({ features }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                >
                    <Card
                        hover
                        className="group p-8 h-full"
                    >
                        <div className="mb-6 p-3.5 bg-[var(--surface-2)] rounded-xl w-fit group-hover:bg-[var(--brand)] transition-colors duration-[200ms]">
                            {React.cloneElement(feature.icon, {
                                className: "w-6 h-6 text-[var(--text-primary)] group-hover:text-white transition-colors duration-[200ms]"
                            })}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">{feature.title}</h3>
                        <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                            {feature.description}
                        </p>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
