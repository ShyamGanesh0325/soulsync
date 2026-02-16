import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile, PredictionResponse } from '../types';
import { X, MessageCircle, ShieldAlert, Sparkles, ShieldCheck, Flame, Brain, Music, PartyPopper, Flag, Calendar, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface StoryCardProps {
    userData: UserProfile;
    prediction: PredictionResponse;
    onReset: () => void;
    onStartMatching: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ userData, prediction, onReset, onStartMatching }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Determine match level
    const score = prediction.compatibility_score;
    let matchLevel = "Low Match";
    let color = "bg-gray-500";

    if (score > 80) {
        matchLevel = "Perfect Alignment! ✨";
        color = "bg-primary";
    } else if (score > 60) {
        matchLevel = "Strong Connection";
        color = "bg-blue-500";
    } else if (score > 40) {
        matchLevel = "Potential Spark";
        color = "bg-yellow-500";
    }

    // Safety Level
    const safetyScore = prediction.safety_score || 0;
    const isSafe = safetyScore > 70;
    const safetyColor = isSafe ? "text-green-600" : safetyScore > 40 ? "text-yellow-600" : "text-red-600";
    const safetyText = isSafe ? "Verified Safe" : safetyScore > 40 ? "Moderate Risk" : "High Risk";

    // Share functionality
    const handleShare = async () => {
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, {
                    backgroundColor: '#000000',
                    scale: 2,
                    logging: false,
                });

                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.download = `soulsync-match-${Math.round(score)}.png`;
                        link.href = url;
                        link.click();
                        URL.revokeObjectURL(url);
                    }
                });
            } catch (err) {
                console.error('Error generating share image:', err);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black/90 p-4">
            <AnimatePresence>
                <motion.div
                    ref={cardRef}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative h-[85vh] flex flex-col"
                >
                    {/* Header Image / Gradient */}
                    <div className={`h-1/3 ${color} relative flex items-center justify-center`}>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                        <div className="z-10 text-white text-center">
                            <h2 className="text-5xl font-black tracking-tighter">{Math.round(score)}%</h2>
                            <p className="text-lg opacity-90 font-medium uppercase tracking-widest">{matchLevel}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <button
                                onClick={handleShare}
                                className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition shadow-lg"
                                title="Download & Share"
                            >
                                <Share2 className="text-white" size={20} />
                            </button>
                            <button
                                onClick={onReset}
                                className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition shadow-lg"
                            >
                                <X className="text-white" size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900 custom-scrollbar transition-colors duration-300">

                        {/* Match DNA Section */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Your Match DNA</h3>
                            <div className="space-y-4">

                                {/* DNA Bar: Personality */}
                                <div>
                                    <div className="flex justify-between text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">
                                        <span className="flex items-center gap-2"><Brain size={16} className="text-purple-500" /> Personality Sync</span>
                                        <span>{Math.round(prediction.match_details?.personality_strength || 0)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${prediction.match_details?.personality_strength || 0}%` }} />
                                    </div>
                                </div>

                                {/* DNA Bar: Love Style */}
                                <div>
                                    <div className="flex justify-between text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">
                                        <span className="flex items-center gap-2"><Sparkles size={16} className="text-pink-500" /> Essence Match</span>
                                        <span>{Math.round(prediction.match_details?.love_style_intensity || 0)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${prediction.match_details?.love_style_intensity || 0}%` }} />
                                    </div>
                                </div>

                                {/* DNA Bar: Lifestyle */}
                                <div>
                                    <div className="flex justify-between text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">
                                        <span className="flex items-center gap-2"><Music size={16} className="text-blue-500" /> Vibe Check</span>
                                        <span>{Math.round(prediction.match_details?.lifestyle_match || 0)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${prediction.match_details?.lifestyle_match || 0}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Safety & Ghosting Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className={`p-4 rounded-2xl border ${isSafe ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    {isSafe ? <ShieldCheck className={safetyColor} size={20} /> : <ShieldAlert className={safetyColor} size={20} />}
                                    <span className={`font-bold text-sm ${safetyColor}`}>{safetyText}</span>
                                </div>
                                <p className={`text-2xl font-bold ${safetyColor}`}>{Math.round(safetyScore)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Safety Score</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-1">
                                    <MessageCircle className="text-gray-600 dark:text-gray-400" size={20} />
                                    <span className="font-bold text-sm text-gray-700 dark:text-gray-200">Chat Success</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{(prediction.conversation_success * 100).toFixed(0)}%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prediction</p>
                                <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Toxic Filter ON</span>
                            </div>
                        </div>

                        {/* Icebreakers Section */}
                        {prediction.icebreakers && prediction.icebreakers.length > 0 && (
                            <div className="mb-8">
                                <h4 className="font-bold flex items-center gap-2 mb-3 text-lg text-gray-900 dark:text-white">
                                    <Flame className="text-orange-500" size={20} />
                                    AI Flirt Assistant
                                </h4>
                                <div className="space-y-2">
                                    {prediction.icebreakers.map((starter, idx) => (
                                        <div key={idx} className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-900/30 text-sm text-gray-700 dark:text-gray-300 italic">
                                            "{starter}"
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Personality Flags Section */}
                        {prediction.flags && prediction.flags.length > 0 && (
                            <div className="mb-8">
                                <h4 className="font-bold flex items-center gap-2 mb-3 text-lg">
                                    <Flag className="text-gray-700" size={20} />
                                    Personality Flags
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {prediction.flags.map((flag, idx) => {
                                        let colorClass = "bg-gray-100 text-gray-700";
                                        if (flag.type === 'green') colorClass = "bg-green-100 text-green-700 border-green-200";
                                        if (flag.type === 'beige') colorClass = "bg-orange-50 text-orange-700 border-orange-100";
                                        if (flag.type === 'red') colorClass = "bg-red-50 text-red-700 border-red-100";

                                        return (
                                            <span key={idx} className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
                                                {flag.text}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Analysis Section */}
                        <div className="mb-8 bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                            <h4 className="font-bold flex items-center gap-2 mb-2 text-purple-800 dark:text-purple-300">
                                <Sparkles className="text-purple-600" size={20} />
                                AI Bio Analysis
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {prediction.bio_feedback}
                            </p>
                        </div>

                        {/* Relationship Timeline */}
                        {prediction.timeline && prediction.timeline.length > 0 && (
                            <div className="mb-8">
                                <h4 className="font-bold flex items-center gap-2 mb-4 text-lg">
                                    <Calendar className="text-pink-500" size={20} />
                                    Predicted Timeline
                                </h4>
                                <div className="relative border-l-2 border-dashed border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                                    {prediction.timeline.map((item, idx) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className="absolute -left-[5px] top-1 w-3 h-3 rounded-full bg-pink-500 ring-4 ring-white dark:ring-gray-900" />
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{item.time}</p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.event}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats Footer */}
                        <div className="text-center text-xs text-gray-400 mb-4">
                            Assessment based on {userData.age}y/o {userData.gender} in {userData.location}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onStartMatching}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                        >
                            <PartyPopper className="text-yellow-400" size={24} />
                            Start Matching
                        </motion.button>

                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default StoryCard;
