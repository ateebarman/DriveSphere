import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className, width, height, variant = "box" }) => {
    const variants = {
        box: "rounded-2xl",
        circle: "rounded-full",
        text: "rounded-lg h-4 w-full"
    };

    return (
        <div
            className={`relative overflow-hidden bg-white/[0.03] border border-white/5 ${variants[variant]} ${className}`}
            style={{ width, height }}
        >
            <motion.div
                animate={{
                    x: ['-100%', '200%'],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"
            />
        </div>
    );
};

export default Skeleton;
