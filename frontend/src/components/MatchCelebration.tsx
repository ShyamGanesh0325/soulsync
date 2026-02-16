import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchCelebrationProps {
    userName: string;
    matchName: string;
    userPhoto?: string;
    matchPhoto?: string;
    onClose: () => void;
    onChat: () => void;
}

const MatchCelebration: React.FC<MatchCelebrationProps> = ({
    userName,
    matchName,
    userPhoto,
    matchPhoto,
    onClose,
    onChat
}) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Trigger particle explosion (Keep confetti but themed)
        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 180, ticks: 100, zIndex: 0, colors: ['#FF2E63', '#9D4EDD', '#08D9D6'] };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 20 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.9), y: 0.1 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.9), y: 0.9 } });
        }, 350);

        setTimeout(() => setShowContent(true), 800);

        return () => clearInterval(interval);
    }, []);

    const blobVariants = {
        animate: {
            borderRadius: [
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "30% 60% 70% 40% / 50% 60% 30% 60%",
                "60% 40% 30% 70% / 60% 30% 70% 40%"
            ],
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050510] flex flex-col items-center justify-center text-white overflow-hidden p-0"
        >
            {/* Cosmic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent" />
                <motion.div
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"
                />
            </div>

            <AnimatePresence>
                {showContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center w-full h-full justify-between py-16 px-6"
                    >
                        {/* Header: Brand Centric */}
                        <div className="text-center">
                            <motion.div
                                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                                animate={{ letterSpacing: "0.05em", opacity: 1 }}
                                className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4"
                            >
                                Synchronicity Detected
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                Frequency Unlocked
                            </h2>
                            <div className="flex justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 12, 4] }}
                                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1 bg-primary rounded-full"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* The Merge Visualization - VERTICAL and ABSTRACT */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 relative py-12">
                            {/* User Aura Blob (Top) */}
                            <motion.div
                                variants={blobVariants}
                                animate="animate"
                                className="w-36 h-36 bg-primary/20 p-1 border border-primary/30 shadow-[0_0_50px_rgba(255,46,99,0.3)] overflow-hidden"
                            >
                                {userPhoto ? (
                                    <img src={userPhoto} alt={userName} className="w-full h-full object-cover rounded-[inherit]" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-4xl font-bold">You</div>
                                )}
                            </motion.div>

                            {/* The Vibe Core (Center) */}
                            <div className="relative h-24 flex items-center justify-center">
                                <motion.div
                                    animate={{ height: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute w-[2px] bg-gradient-to-b from-primary via-purple-500 to-primary/0"
                                />
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        boxShadow: ["0 0 20px rgba(255,46,99,0.5)", "0 0 50px rgba(157,78,221,0.8)", "0 0 20px rgba(255,46,99,0.5)"]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center transform backdrop-blur-md"
                                >
                                    <Sparkles size={24} className="text-primary" />
                                </motion.div>
                            </div>

                            {/* Match Aura Blob (Bottom) */}
                            <motion.div
                                variants={blobVariants}
                                animate="animate"
                                transition={{ delay: 0.5 }}
                                className="w-36 h-36 bg-purple-500/20 p-1 border border-purple-500/30 shadow-[0_0_50px_rgba(157,78,221,0.3)] overflow-hidden"
                            >
                                {matchPhoto ? (
                                    <img src={matchPhoto} alt={matchName} className="w-full h-full object-cover rounded-[inherit]" />
                                ) : (
                                    <div className="w-full h-full bg-purple-500 flex items-center justify-center text-4xl font-bold uppercase">{matchName[0]}</div>
                                )}
                            </motion.div>

                            {/* Status label tag */}
                            <div className="mt-8 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                                <span className="text-[10px] font-black tracking-widest text-primary uppercase">98.4% Match Density</span>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="w-full max-w-sm space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onChat}
                                className="w-full bg-white text-black py-4 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-gray-100 transition-all group"
                            >
                                <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
                                Open Connection
                            </motion.button>
                            <button
                                onClick={onClose}
                                className="w-full bg-transparent text-white/40 hover:text-white py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all"
                            >
                                Continue Scanning
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={onClose}
                className="absolute top-10 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all z-50 backdrop-blur-sm"
            >
                <X size={28} />
            </button>
        </motion.div>
    );
};

export default MatchCelebration;
