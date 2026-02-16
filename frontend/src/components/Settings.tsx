import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Bell, BellOff, Shield, Sparkles, MapPin, Users, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [safeMode, setSafeMode] = useState(true);
    const [distance, setDistance] = useState(50);
    const [ageRange, setAgeRange] = useState([18, 35]);
    const [showMe, setShowMe] = useState<'Everyone' | 'Men' | 'Women'>('Everyone');

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Settings Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition"
                                >
                                    <X size={24} />
                                </button>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Sparkles size={24} />
                                    Settings
                                </h2>
                                <p className="text-white/80 text-sm mt-1">Customize your experience</p>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {theme === 'dark' ? <Moon size={20} className="text-gray-700 dark:text-gray-300" /> : <Sun size={20} className="text-gray-700 dark:text-gray-300" />}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Switch to {theme === 'dark' ? 'light' : 'dark'} theme</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleTheme}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-purple-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <motion.div
                                            layout
                                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                                            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg ${theme === 'dark' ? 'left-7' : 'left-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Notifications */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {notifications ? <Bell size={20} className="text-gray-700 dark:text-gray-300" /> : <BellOff size={20} className="text-gray-700 dark:text-gray-300" />}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Get match alerts</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${notifications ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <motion.div
                                            layout
                                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                                            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg ${notifications ? 'left-7' : 'left-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Safe Mode */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield size={20} className="text-gray-700 dark:text-gray-300" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Safe Mode</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Enhanced content filtering</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSafeMode(!safeMode)}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${safeMode ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <motion.div
                                            layout
                                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                                            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg ${safeMode ? 'left-7' : 'left-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                                {/* Discovery Section */}
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-6">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Filter size={14} /> Discovery Settings
                                    </h3>

                                    {/* Distance */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <MapPin size={16} /> Maximum Distance
                                            </span>
                                            <span className="text-primary">{distance}km</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="2" max="160"
                                            value={distance}
                                            onChange={(e) => setDistance(Number(e.target.value))}
                                            className="w-full accent-primary h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Age Range */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm font-bold">
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

                                    {/* Show Me */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Show Me</label>
                                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                            {['Men', 'Women', 'Everyone'].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => setShowMe(option as 'Men' | 'Women' | 'Everyone')}
                                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${showMe === option
                                                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                        SoulSync v1.0 • Built with AI ✨
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Settings;
