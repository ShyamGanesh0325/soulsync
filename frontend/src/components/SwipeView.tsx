import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Info, RotateCcw, Star, ShieldCheck, Sparkles, Briefcase, Cigarette, Zap, Wind } from 'lucide-react';

interface Match {
    id: string;
    name: string;
    age: number;
    bio: string;
    compatibility_score: number;
    interests: string[];
    location: string;
    verified: boolean;
    photos?: string[];
    jobTitle?: string;
    school?: string;
    height?: number;
    aura?: string;
    lifestyle?: {
        smoking?: string;
        drinking?: string;
        fitness?: string;
    };
}

interface SwipeViewProps {
    matches: Match[];
    onSwipeRight: (matchId: string) => void;
    onSwipeLeft: (matchId: string) => void;
    onViewDetail: (match: Match) => void;
    onClose: () => void;
}

const SwipeView: React.FC<SwipeViewProps> = ({ matches, onSwipeRight, onSwipeLeft, onViewDetail, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const activeMatch = matches[currentIndex];

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
    const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);
    const likeOpacity = useTransform(x, [50, 150], [0, 1]);

    const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
        if (info.offset.x > 100) {
            onSwipeRight(activeMatch.id);
            nextCard();
        } else if (info.offset.x < -100) {
            onSwipeLeft(activeMatch.id);
            nextCard();
        }
    };

    const nextCard = () => {
        if (currentIndex < matches.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose(); // No more cards
        }
    };

    if (!activeMatch) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="w-full max-w-md flex justify-between items-center mb-6">
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={28} />
                </button>
                <div className="flex items-center gap-1 text-primary">
                    <Zap size={20} fill="currentColor" />
                    <span className="font-black text-xl tracking-tighter">SoulSync</span>
                </div>
                <button className="p-2 text-primary">
                    <ShieldCheck size={24} />
                </button>
            </div>

            {/* Swipe Deck */}
            <div className="relative w-full max-w-md aspect-[3/4] perspective-1000">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeMatch.id}
                        style={{ x, rotate, opacity }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        whileDrag={{ scale: 1.05 }}
                        className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-gray-100 dark:border-gray-700"
                    >
                        {/* Photo */}
                        <div className="h-full w-full relative">
                            {activeMatch.photos?.[0] ? (
                                <img src={activeMatch.photos[0]} alt={activeMatch.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
                            )}

                            {/* Overlay Badges */}
                            <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 border-4 border-primary rounded-lg px-4 py-2 rotate-[-20deg] z-10 bg-white/10 backdrop-blur-sm">
                                <span className="text-4xl font-black text-primary uppercase tracking-widest">Sync</span>
                            </motion.div>
                            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-10 border-4 border-gray-400 rounded-lg px-4 py-2 rotate-[20deg] z-10 bg-white/10 backdrop-blur-sm">
                                <span className="text-4xl font-black text-gray-400 uppercase tracking-widest">Pass</span>
                            </motion.div>

                            {/* Info Gradient */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 pt-20 text-white">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h3 className="text-3xl font-black flex items-center gap-2">
                                            {activeMatch.name}, {activeMatch.age}
                                            {activeMatch.verified && <ShieldCheck size={24} className="text-blue-400 fill-blue-400/20" />}
                                        </h3>
                                        <p className="text-white/80 line-clamp-1 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                            {activeMatch.location} • {activeMatch.compatibility_score}% Match
                                        </p>

                                        {/* SoulSync Unique Tags */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {activeMatch.jobTitle && (
                                                <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border border-white/10">
                                                    <Briefcase size={10} /> {activeMatch.jobTitle}
                                                </span>
                                            )}
                                            {activeMatch.aura && (
                                                <span className="px-2 py-1 bg-primary/40 backdrop-blur-md rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border border-primary/20 animate-pulse">
                                                    <Sparkles size={10} /> {activeMatch.aura} Aura
                                                </span>
                                            )}
                                            {activeMatch.lifestyle?.smoking === 'Never' && (
                                                <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border border-white/10">
                                                    <Cigarette size={10} className="opacity-50" /> Non-Smoker
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onViewDetail(activeMatch)}
                                        className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-all"
                                    >
                                        <Info size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full max-w-md flex justify-center items-center gap-6 mt-8">
                <button className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-yellow-500 hover:scale-110 transition-transform">
                    <RotateCcw size={24} />
                </button>
                <button
                    onClick={() => {
                        onSwipeLeft(activeMatch.id);
                        nextCard();
                    }}
                    className="p-5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-gray-400 hover:scale-110 transition-transform"
                >
                    <Wind size={32} />
                </button>
                <button className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-indigo-400 hover:scale-110 transition-transform">
                    <Star size={24} fill="currentColor" />
                </button>
                <button
                    onClick={() => {
                        onSwipeRight(activeMatch.id);
                        nextCard();
                    }}
                    className="p-5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-primary hover:scale-110 transition-transform"
                >
                    <Zap size={32} fill="currentColor" />
                </button>
                <button className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-purple-500 hover:scale-110 transition-transform">
                    <Sparkles size={24} fill="currentColor" />
                </button>
            </div>
        </div>
    );
};

export default SwipeView;
