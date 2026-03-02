'use client';

import React from 'react';
import { Heart, Sparkles, User, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
    isLoggedIn: boolean;
    onSettingsClick?: () => void;
    onProfileClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onSettingsClick, onProfileClick }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-white/20 dark:border-gray-800/50">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
            >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transform -rotate-6">
                    <Heart className="text-white w-6 h-6 fill-current" />
                </div>
                <span className="text-2xl font-black tracking-tight dark:text-white">
                    Soul<span className="text-primary">Sync</span>
                </span>
            </motion.div>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onProfileClick}
                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                        >
                            <User size={20} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onSettingsClick}
                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                        >
                            <SettingsIcon size={20} />
                        </motion.button>
                    </>
                ) : (
                    <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                        <Sparkles className="text-primary" size={14} />
                        <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Aura Sync Active</span>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
