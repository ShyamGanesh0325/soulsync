'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Bell, BellOff, Shield, Sparkles, MapPin, Users, Filter } from 'lucide-react';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, onLogout }) => {
    const [notifications, setNotifications] = useState(true);
    const [safeMode, setSafeMode] = useState(true);
    const [distance, setDistance] = useState(50);
    const [ageRange, setAgeRange] = useState([18, 35]);

    const handleLogout = () => {
        onLogout();
        onClose();
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

                    {/* Settings Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        className="fixed top-1/2 left-1/2 z-[70] w-full max-w-md pointer-events-auto"
                    >
                        <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary to-accent p-8 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                    <Sparkles size={28} />
                                    Settings
                                </h2>
                                <p className="text-white/80 font-bold text-sm mt-1 uppercase tracking-widest">Customize your frequency</p>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar">
                                {/* Notifications */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-2xl">
                                            {notifications ? <Bell size={20} className="text-primary" /> : <BellOff size={20} className="text-gray-400" />}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 dark:text-white">Notifications</h3>
                                            <p className="text-xs font-bold text-gray-400">Get resonance alerts</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${notifications ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'
                                            }`}
                                    >
                                        <motion.div
                                            layout
                                            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg ${notifications ? 'left-7' : 'left-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Safe Mode */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-2xl">
                                            <Shield size={20} className="text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 dark:text-white">Safe Mode</h3>
                                            <p className="text-xs font-bold text-gray-400">Toxic vibe filter</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSafeMode(!safeMode)}
                                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${safeMode ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'
                                            }`}
                                    >
                                        <motion.div
                                            layout
                                            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg ${safeMode ? 'left-7' : 'left-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Discovery Section */}
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Filter size={14} /> Discovery Range
                                    </h3>

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
                                </div>

                                {/* Logout Button */}
                                <div className="pt-4">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-95"
                                    >
                                        Disconnect Souls
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                        SoulSync Ultimate v1.0 • Groq Powered AI
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence >
    );
};

export default Settings;
