import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Section({
    children,
    className,
    id,
    onInView,
    style,
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    React.useEffect(() => {
        if (isInView && onInView) onInView();
    }, [isInView, onInView]);

    return (
        <section
            ref={ref}
            id={id}
            className={cn("py-16 px-6 relative overflow-hidden transition-colors duration-700", className)}
            style={style}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="max-w-7xl mx-auto relative z-10"
            >
                {children}
            </motion.div>
        </section>
    );
}
