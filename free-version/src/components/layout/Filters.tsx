'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Filter as FilterIcon, Save, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface FiltersProps {
    isOpen: boolean;
    onClose: () => void;
}

const Filters: React.FC<FiltersProps> = ({ isOpen, onClose }) => {
    const [distance, setDistance] = useState(50);
    const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load initial filters
    React.useEffect(() => {
        if (isOpen) {
            const fetchFilters = async () => {
                setLoading(true);
                try {
                    const response = await api.get('/auth/me');
                    const user = response.data;
                    setDistance(user.max_distance ?? 50);
                    setAgeRange([user.min_age_pref ?? 18, user.max_age_pref ?? 35]);
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
            await api.put('/auth/me', {
                max_distance: distance,
                min_age_pref: ageRange[0],
                max_age_pref: ageRange[1]
            });
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                    />

                    {/* Filters Panel Wrapper */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="pointer-events-auto w-full max-w-md"
                        >
                            <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-accent to-primary p-8 relative">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                        <FilterIcon size={28} />
                                        Discovery
                                    </h2>
                                    <p className="text-white/80 font-bold text-sm mt-1 uppercase tracking-widest">Tune your frequency</p>
                                </div>

                                {/* Content */}
                                <div className="p-8 space-y-8">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                            <p className="text-gray-500 font-bold">Syncing preferences...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Distance */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm font-black">
                                                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <MapPin size={16} /> Max Distance
                                                    </span>
                                                    <span className="text-primary">{distance}km</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="2" max="160"
                                                    value={distance}
                                                    onChange={(e) => setDistance(Number(e.target.value))}
                                                    className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                            </div>

                                            {/* Age Range */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm font-black">
                                                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <Users size={16} /> Age Range
                                                    </span>
                                                    <span className="text-primary">{ageRange[0]} - {ageRange[1]}</span>
                                                </div>
                                                <div className="flex gap-4">
                                                    <input
                                                        type="range"
                                                        min="18" max="100"
                                                        value={ageRange[0]}
                                                        onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
                                                        className="w-full accent-primary h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                    <input
                                                        type="range"
                                                        min="18" max="100"
                                                        value={ageRange[1]}
                                                        onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
                                                        className="w-full accent-primary h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            <div className="pt-4">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
