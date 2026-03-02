import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Sparkles, Save, Loader2, Filter } from 'lucide-react';
import { getCurrentUser, type UserResponse } from '../api';
import { updateFullProfile } from '../services/profileService';

interface FiltersProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: (user: UserResponse) => void;
}

const Filters: React.FC<FiltersProps> = ({ isOpen, onClose, onUpdate }) => {
    const [distance, setDistance] = useState(50);
    const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
    const [minComp, setMinComp] = useState(0);
    const [loveLanguage, setLoveLanguage] = useState('any');
    const [minTraits, setMinTraits] = useState({
        openness: 0,
        extroversion: 0,
        agreeableness: 0,
        neuroticism: 0,
        conscientiousness: 0
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fullUser, setFullUser] = useState<UserResponse | null>(null);

    // Load initial filters
    React.useEffect(() => {
        if (isOpen) {
            const fetchFilters = async () => {
                setLoading(true);
                try {
                    const user = await getCurrentUser();
                    setFullUser(user);
                    setDistance(user.max_distance || 50);
                    setAgeRange([user.min_age_pref || 18, user.max_age_pref || 35]);
                    setMinComp(user.min_compatibility || 0);
                    setLoveLanguage(user.required_love_language || 'any');
                    setMinTraits({
                        openness: user.min_openness || 0,
                        extroversion: user.min_extroversion || 0,
                        agreeableness: user.min_agreeableness || 0,
                        neuroticism: user.min_neuroticism || 0,
                        conscientiousness: user.min_conscientiousness || 0
                    });
                } catch (err) {
                    console.error("Failed to fetch filters:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchFilters();
        }
    }, [isOpen]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Use the centralized Bulletproof service
            const updatedUser = await updateFullProfile(fullUser, {
                max_distance: Number(distance),
                min_age_pref: Number(ageRange[0]),
                max_age_pref: Number(ageRange[1]),
                min_compatibility: Number(minComp),
                required_love_language: loveLanguage,
                min_openness: Number(minTraits.openness),
                min_extroversion: Number(minTraits.extroversion),
                min_agreeableness: Number(minTraits.agreeableness),
                min_neuroticism: Number(minTraits.neuroticism),
                min_conscientiousness: Number(minTraits.conscientiousness)
            });

            if (onUpdate) onUpdate(updatedUser);
            onClose();
        } catch (err: any) {
            console.error("STILL FAILING. Server response:", err.response?.data);
            console.error("Payload sent causing error:", err.config?.data);
            alert("Failed to save changes. Check console for error details.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
                    />

                    {/* Filters Panel Wrapper */}
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="pointer-events-auto w-full max-w-md"
                        >
                            <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 relative text-left">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                        <Filter size={28} />
                                        Discovery
                                    </h2>
                                    <p className="text-white/80 font-bold text-sm mt-1 uppercase tracking-widest">Adjust your range</p>
                                </div>

                                {/* Content */}
                                <div className="p-0 text-left">
                                    {loading ? (
                                        <div className="p-8 flex flex-col items-center justify-center py-12">
                                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                            <p className="text-gray-500 font-bold">Fetching preferences...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                                {/* Compatibility Score */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center text-left">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                                                                <Sparkles size={20} className="text-purple-500" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-black text-gray-900 dark:text-white">SoulSync™ Score</h3>
                                                                <p className="text-xs font-bold text-gray-400 uppercase">Minimum compatibility</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xl font-black text-purple-500">{minComp}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0" max="100" step="5"
                                                        value={minComp}
                                                        onChange={(e) => setMinComp(Number(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                    />
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Higher scores prioritize long-term potential.</p>
                                                </div>

                                                {/* Distance */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center text-left">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                                                <MapPin size={20} className="text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-black text-gray-900 dark:text-white">Distance</h3>
                                                                <p className="text-xs font-bold text-gray-400 uppercase">Maximum radius</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xl font-black text-blue-500">{distance}km</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="2" max="160"
                                                        value={distance}
                                                        onChange={(e) => setDistance(Number(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                    />
                                                </div>

                                                {/* Age Range */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center text-left">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                                                                <Users size={20} className="text-indigo-500" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-black text-gray-900 dark:text-white">Age Range</h3>
                                                                <p className="text-xs font-bold text-gray-400 uppercase">Preference</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xl font-black text-indigo-500">{ageRange[0]} - {ageRange[1]}</span>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <input
                                                            type="range"
                                                            min="18" max="100"
                                                            value={ageRange[0]}
                                                            onChange={(e) => setAgeRange([Math.min(Number(e.target.value), ageRange[1]), ageRange[1]])}
                                                            className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                        />
                                                        <input
                                                            type="range"
                                                            min="18" max="100"
                                                            value={ageRange[1]}
                                                            onChange={(e) => setAgeRange([ageRange[0], Math.max(Number(e.target.value), ageRange[0])])}
                                                            className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Love Language */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                                                            <Sparkles size={20} className="text-red-500" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-gray-900 dark:text-white">Love Language</h3>
                                                            <p className="text-xs font-bold text-gray-400 uppercase">Primary alignment</p>
                                                        </div>
                                                    </div>
                                                    <select
                                                        value={loveLanguage}
                                                        onChange={(e) => setLoveLanguage(e.target.value)}
                                                        className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-red-500 rounded-2xl font-bold text-gray-700 dark:text-gray-200 transition-all outline-none"
                                                    >
                                                        <option value="any">Any Love Language</option>
                                                        <option value="quality_time">Quality Time</option>
                                                        <option value="words_of_affirmation">Words of Affirmation</option>
                                                        <option value="physical_touch">Physical Touch</option>
                                                        <option value="acts_of_service">Acts of Service</option>
                                                        <option value="gifts">Gifts</option>
                                                    </select>
                                                </div>

                                                {/* Personality Traits */}
                                                <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Soul Profile Filters</h3>

                                                    {[
                                                        { id: 'openness', label: 'Openness', icon: '🌍' },
                                                        { id: 'extroversion', label: 'Extroversion', icon: '⚡' },
                                                        { id: 'agreeableness', label: 'Agreeableness', icon: '🧠' },
                                                        { id: 'neuroticism', label: 'Neuroticism', icon: '🤯' },
                                                        { id: 'conscientiousness', label: 'Conscientiousness', icon: '✅' }
                                                    ].map(trait => (
                                                        <div key={trait.id} className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-black text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                                                    <span>{trait.icon}</span> {trait.label}
                                                                </span>
                                                                <span className="text-sm font-black text-blue-500">{minTraits[trait.id as keyof typeof minTraits]}/10</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0" max="10"
                                                                value={minTraits[trait.id as keyof typeof minTraits]}
                                                                onChange={(e) => setMinTraits({ ...minTraits, [trait.id]: Number(e.target.value) })}
                                                                className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            <div className="p-8 bg-gray-50 dark:bg-gray-900/50">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                                                    Apply Premium Filters
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Filters;
