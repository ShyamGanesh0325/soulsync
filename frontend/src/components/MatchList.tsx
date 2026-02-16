import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface Match {
    id: string;
    name: string;
    age: number;
    bio: string;
    compatibility_score: number;
    interests: string[];
    location: string;
    verified: boolean;
    is_bot?: boolean;
}

interface MatchListProps {
    matches: Match[];
    onSelectMatch: (matchId: string) => void;
    title?: string;
    subtitle?: string;
    onToggleView?: () => void;
    toggleLabel?: string;
}

const MatchList: React.FC<MatchListProps> = ({
    matches,
    onSelectMatch,
    title = "Your Alignments",
    subtitle = "Souls that synchronize with your frequency ✨",
    onToggleView,
    toggleLabel
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2">{title}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
                    </div>
                    {onToggleView && toggleLabel && (
                        <button
                            onClick={onToggleView}
                            className="px-4 py-2 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 rounded-lg font-medium shadow-sm hover:shadow-md transition-all border border-purple-100 dark:border-gray-600"
                        >
                            {toggleLabel}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matches.map((match, index) => (
                        <motion.div
                            key={match.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100 dark:border-gray-700"
                            onClick={() => onSelectMatch(match.id)}
                        >
                            {/* Header with Score */}
                            <div className={`p-6 relative ${match.is_bot ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-2xl font-bold text-white">
                                                {match.name}
                                                {match.verified && <span className="text-lg ml-1">✓</span>}
                                            </h3>
                                            {match.is_bot && (
                                                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/30 uppercase tracking-tighter">
                                                    AI Mentor
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/90">{match.age} • {match.location}</p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full border border-white/20">
                                        <p className="text-white font-bold text-lg">{match.compatibility_score}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{match.bio}</p>

                                {/* Interests */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {match.interests.slice(0, 3).map((interest, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition">
                                        <MessageCircle size={20} />
                                        Chat Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchList;
