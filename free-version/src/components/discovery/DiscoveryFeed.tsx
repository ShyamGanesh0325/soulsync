'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import SafetyScore from './SafetyScore';
import { Sparkles, Heart, Zap, MapPin, Briefcase, GraduationCap } from 'lucide-react';

interface Match {
    id: string;
    name: string;
    age: number;
    bio: string;
    location: string;
    jobTitle: string;
    aura: string;
    compatibility_score: number;
}

interface ResonanceInsight {
    compatibility_score: number;
    ghosting_probability: number;
    safety_score: number;
    icebreakers: string[];
    timeline: { time: string; event: string }[];
    flags: { type: string; text: string }[];
}

const DiscoveryFeed: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [insight, setInsight] = useState<ResonanceInsight | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await api.get('/chat/matches');
                const filtered = response.data.matches.filter((m: any) => !m.is_bot);
                setMatches(filtered);
            } catch (err) {
                setError('Failed to load discovery feed. Check your connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    const fetchInsight = async (matchId: string) => {
        try {
            const response = await api.get(`/discovery/insights/${matchId}`);
            setInsight(response.data);
        } catch (err) {
            console.error("Resonance failure:", err);
        }
    };

    useEffect(() => {
        if (matches[currentIndex]) {
            setInsight(null);
            fetchInsight(matches[currentIndex].id);
        }
    }, [currentIndex, matches]);

    const handleNext = () => {
        if (currentIndex < matches.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

    const currentMatch = matches[currentIndex];

    if (!currentMatch) return (
        <div className="p-20 text-center">
            <Sparkles size={48} className="mx-auto text-primary mb-4 opacity-20" />
            <h3 className="text-xl font-black text-gray-400">The energy pool is quiet...</h3>
            <p className="text-gray-500">Check back soon for new resonance matches.</p>
        </div>
    );

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMatch.id}
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                    className="relative bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                    {/* Header Image Placeholder */}
                    <div className={`h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-8`}>
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="bg-white/40 backdrop-blur-3xl rounded-3xl p-6 border border-white/30"
                        >
                            <Heart size={48} className="text-primary fill-current" />
                        </motion.div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black dark:text-white">{currentMatch.name}, {currentMatch.age}</h2>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    <span className="text-xs font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">
                                        {currentMatch.aura} Aura
                                    </span>
                                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                        <MapPin size={12} /> {currentMatch.location}
                                    </span>
                                </div>
                            </div>
                            {insight && (
                                <div className="text-right">
                                    <div className="text-primary font-black text-3xl">{insight.compatibility_score.toFixed(0)}%</div>
                                    <div className="text-[10px] uppercase font-black text-gray-400">Match Accuracy</div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 italic text-foreground/80 font-medium">
                            "{currentMatch.bio}"
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                                <span className="flex items-center gap-2"><Briefcase size={16} /> {currentMatch.jobTitle}</span>
                            </div>

                            {insight && (
                                <>
                                    <hr className="border-gray-100 dark:border-gray-800" />
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-black uppercase tracking-tighter dark:text-white">Resonance Insight</h4>
                                            <SafetyScore score={insight.safety_score} ghostingProb={insight.ghosting_probability} />
                                        </div>
                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                            <p className="text-sm font-medium dark:text-gray-300">
                                                <Sparkles size={14} className="inline mr-2 text-primary" />
                                                <b>Luna's Insight:</b> Your {insight.flags?.[0]?.text || "Frequency"} aligns perfectly.
                                                {insight.ghosting_probability < 30 ? " Very high response potential." : " Take it slow with this one."}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleNext}
                                className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                Pass
                            </button>
                            <button
                                onClick={() => alert("Resonance Sync Initiated! Check your matches.")}
                                className="flex-[2] py-4 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Sync Vibes
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default DiscoveryFeed;
