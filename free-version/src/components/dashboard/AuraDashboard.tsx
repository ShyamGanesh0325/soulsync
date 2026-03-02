'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Brain, Heart, Zap, Shield } from 'lucide-react';

const AuraDashboard: React.FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    const traits = [
        { name: 'Openness', value: user.openness || 5, icon: <Brain size={16} />, color: 'bg-blue-400' },
        { name: 'Extroversion', value: user.extroversion || 5, icon: <Zap size={16} />, color: 'bg-yellow-400' },
        { name: 'Agreeableness', value: user.agreeableness || 5, icon: <Heart size={16} />, color: 'bg-pink-400' },
        { name: 'Neuroticism', value: user.neuroticism || 5, icon: <Shield size={16} />, color: 'bg-purple-400' },
        { name: 'Conscientiousness', value: user.conscientiousness || 5, icon: <Sparkles size={16} />, color: 'bg-green-400' },
    ];

    const getAuraColor = () => {
        if ((user.openness || 0) > 7) return 'from-blue-500/20 to-purple-500/20';
        if ((user.agreeableness || 0) > 7) return 'from-pink-500/20 to-rose-500/20';
        if ((user.extroversion || 0) > 7) return 'from-yellow-500/20 to-orange-500/20';
        return 'from-primary/10 to-primary/20';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${getAuraColor()} border border-white/20 overflow-hidden`}>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-xl flex items-center justify-center border-4 border-white/50 shadow-2xl"
                    >
                        <Heart size={64} className="text-primary fill-current" />
                    </motion.div>

                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black mb-2 dark:text-white">Your Soul Aura</h2>
                        <p className="text-foreground/70 font-medium max-w-md">
                            Your energy is currently shifting towards <b>Emotional Resonance</b>.
                            Matches who value deep conversation will feel drawn to your frequency today.
                        </p>
                    </div>
                </div>

                {/* Animated background blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-3xl rounded-full -ml-32 -mb-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2 dark:text-white">
                        <Brain className="text-primary" /> Personality Pulse
                    </h3>
                    <div className="space-y-6">
                        {traits.map((trait) => (
                            <div key={trait.name} className="space-y-2">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="flex items-center gap-2 dark:text-gray-300">
                                        {trait.icon} {trait.name}
                                    </span>
                                    <span className="dark:text-gray-400">{trait.value}/10</span>
                                </div>
                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${trait.value * 10}%` }}
                                        className={`h-full ${trait.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center text-center">
                    <div className="mb-4 inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl text-primary mx-auto">
                        <Sparkles size={32} />
                    </div>
                    <h3 className="text-xl font-black mb-2 dark:text-white">Vibe Mastery</h3>
                    <p className="text-foreground/60 font-medium mb-6">
                        Keep chatting with Luna and Atlas to refine your social charisma and emotional intelligence.
                    </p>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Next Unlock</span>
                        <p className="text-gray-600 dark:text-gray-300 font-bold mt-1">Deep Talk Architect Badge</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuraDashboard;
