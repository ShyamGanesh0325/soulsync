'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Bell, BellOff, Shield, Sparkles, Save, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, onLogout }) => {
    const [notifications, setNotifications] = useState(true);
    const [safeMode, setSafeMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load initial settings
    React.useEffect(() => {
        if (isOpen) {
            const fetchSettings = async () => {
                setLoading(true);
                try {
                    const response = await api.get('/auth/me');
                    const user = response.data;
                    setNotifications(user.notifications_enabled ?? true);
                    setSafeMode(user.safe_mode_enabled ?? true);
                } catch (err) {
                    console.error("Failed to fetch settings:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSettings();
        }
    }, [isOpen]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/auth/me', {
                notifications_enabled: notifications,
                safe_mode_enabled: safeMode
            });
            onClose();
        } catch (err) {
            console.error("Failed to save settings:", err);
            alert("Failed to save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

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

                    {/* Settings Panel Wrapper */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="pointer-events-auto w-full max-w-md"
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
                                <div className="p-8 space-y-8">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                            <p className="text-gray-500 font-bold">Syncing preferences...</p>
                                        </div>
                                    ) : (
                                        <>
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

                                            {/* Actions Section */}
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-95"
                                                >
                                                    Disconnect Souls
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Info */}
                                    <div className="text-center pt-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                            SoulSync Ultimate v1.0 • Groq Powered AI
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Settings;
