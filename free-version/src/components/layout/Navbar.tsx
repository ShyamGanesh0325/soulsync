'use client';

import React from 'react';
import { Heart, Sparkles, User, Settings as SettingsIcon, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
    isLoggedIn: boolean;
    currentTab: 'dashboard' | 'discover' | 'chat';
    onTabChange: (tab: 'dashboard' | 'discover' | 'chat') => void;
    onSettingsClick?: () => void;
    onProfileClick?: () => void;
    onFilterClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, currentTab, onTabChange, onSettingsClick, onProfileClick, onFilterClick }) => {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <Sparkles size={18} /> },
        { id: 'discover', label: 'Discover', icon: <Heart size={18} /> },
        { id: 'chat', label: 'Mentors', icon: <User size={18} /> },
    ] as const;

    return (
        <div className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
            <nav className="pointer-events-auto flex items-center gap-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 px-4 py-2 rounded-[2rem] shadow-2xl shadow-black/10 max-w-fit overflow-x-auto no-scrollbar">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 pr-2 border-r border-gray-200 dark:border-gray-800"
                >
                    <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transform -rotate-6">
                        <Heart className="text-white w-5 h-5 fill-current" />
                    </div>
                </motion.div>

                {/* Tabs Section */}
                {isLoggedIn && (
                    <div className="flex items-center gap-1 p-1 bg-gray-100/50 dark:bg-gray-900/50 rounded-2xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${currentTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Actions Section */}
                <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                    {isLoggedIn ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onProfileClick}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                <User size={18} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onFilterClick}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                <Filter size={18} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onSettingsClick}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                <SettingsIcon size={18} />
                            </motion.button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 px-2">
                            <Sparkles className="text-primary animate-pulse" size={14} />
                            <span className="text-[10px] uppercase font-bold text-primary tracking-widest leading-none">Aura Active</span>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
