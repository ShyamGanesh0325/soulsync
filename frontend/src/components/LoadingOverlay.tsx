import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Syncing Souls..." }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"
        >
            <div className="relative">
                {/* Pulsing aura */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
                />

                {/* Core animation */}
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-full shadow-2xl border border-gray-100 dark:border-gray-700">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles size={48} className="text-primary" />
                    </motion.div>
                </div>
            </div>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-xl font-black text-gray-800 dark:text-white uppercase tracking-widest"
            >
                {message}
            </motion.p>

            <div className="mt-4 flex gap-1">
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default LoadingOverlay;
