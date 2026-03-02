import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Sparkles, Save, Loader2, Filter } from 'lucide-react';
import api, { getCurrentUser, updateCurrentUser, type UserResponse } from '../api';

interface FiltersProps {
    isOpen: boolean;
    onClose: () => void;
}

const Filters: React.FC<FiltersProps> = ({ isOpen, onClose }) => {
    const [distance, setDistance] = useState(50);
    const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
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
            await updateCurrentUser({
                ...(fullUser || {}),
                max_distance: distance,
                min_age_pref: ageRange[0],
                max_age_pref: ageRange[1]
            } as UserResponse);
            onClose();
        } catch (err) {
            console.error("Failed to save filters:", err);
            alert("Failed to save changes. Please try again.");
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
                                <div className="p-8 space-y-8 text-left">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                            <p className="text-gray-500 font-bold">Fetching preferences...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Distance */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
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
                                                <div className="flex justify-between items-center">
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

                                            {/* Save Button */}
                                            <div className="pt-4">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                                                    Apply Filters
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
