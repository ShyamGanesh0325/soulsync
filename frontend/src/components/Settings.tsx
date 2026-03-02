import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Bell, BellOff, Shield, Sparkles, Save, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCurrentUser, updateCurrentUser, type UserResponse } from '../api';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, onLogout }) => {
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [safeMode, setSafeMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fullUser, setFullUser] = useState<UserResponse | null>(null);

    // Load initial settings
    React.useEffect(() => {
        if (isOpen) {
            const fetchSettings = async () => {
                setLoading(true);
                try {
                    const user = await getCurrentUser();
                    setFullUser(user);
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
            // Hard-Reset: Fetch latest profile to ensure no fields are missing
            const user = await getCurrentUser();

            // Bulletproof: Force explicit types and defaults for every field
            const finalPayload = {
                // Basic Info
                name: user?.name || "User",
                age: Number(user?.age || 18),
                gender: user?.gender || "Other",
                location: user?.location || "Unknown",

                // Personality (Must be Numbers)
                openness: Number(user?.openness ?? 5),
                extroversion: Number(user?.extroversion ?? 5),
                agreeableness: Number(user?.agreeableness ?? 5),
                neuroticism: Number(user?.neuroticism ?? 5),
                conscientiousness: Number(user?.conscientiousness ?? 5),

                // Love Languages (Must be Numbers)
                words_of_affirmation: Number(user?.words_of_affirmation ?? 0),
                quality_time: Number(user?.quality_time ?? 0),
                gifts: Number(user?.gifts ?? 0),
                physical_touch: Number(user?.physical_touch ?? 0),
                acts_of_service: Number(user?.acts_of_service ?? 0),

                // Interests (Must be Numbers/0 or 1)
                likes_music: Number(user?.likes_music ?? 0),
                likes_travel: Number(user?.likes_travel ?? 0),
                likes_pets: Number(user?.likes_pets ?? 0),
                foodie: Number(user?.foodie ?? 0),
                gym_person: Number(user?.gym_person ?? 0),
                movie_lover: Number(user?.movie_lover ?? 0),
                gamer: Number(user?.gamer ?? 0),
                reader: Number(user?.reader ?? 0),
                night_owl: Number(user?.night_owl ?? 0),
                early_bird: Number(user?.early_bird ?? 0),

                // Strings
                zodiac_sign: user?.zodiac_sign || "Unknown",
                relationship_goal: user?.relationship_goal || "Unknown",
                fav_music_genre: user?.fav_music_genre || "Unknown",
                bio_text: user?.bio_text || "No bio yet",

                // Keep existing filters
                max_distance: Number(user?.max_distance ?? 50),
                min_age_pref: Number(user?.min_age_pref ?? 18),
                max_age_pref: Number(user?.max_age_pref ?? 100),

                // Arrays & Booleans (Crucial for PUT requests)
                photos: user?.photos || [],
                notifications_enabled: Boolean(notifications),
                safe_mode_enabled: Boolean(safeMode),

                // Optional fields
                jobTitle: user?.jobTitle,
                school: user?.school,
                height: user?.height ? Number(user.height) : undefined,
                loveLanguage: user?.loveLanguage,
                aura: user?.aura,
                lifestyle: user?.lifestyle
            } as UserResponse;

            console.log("Bulletproof Payload Check - Final Payload:", finalPayload);

            await updateCurrentUser(finalPayload);
            onClose();
        } catch (err: any) {
            console.error("STILL FAILING. Server response:", err.response?.data);
            console.error("Payload sent causing error:", err.config?.data);
            alert("Failed to save changes. Check console for error details.");
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] text-left"
                    />

                    {/* Settings Panel Wrapper */}
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="pointer-events-auto w-full max-w-md"
                        >
                            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 text-left">
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
                                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                                            <p className="text-gray-500 font-bold">Syncing preferences...</p>
                                        </div>
                                    ) : (
                                        <>
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

                                            {/* Actions Section */}
                                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="w-full py-3 bg-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Info */}
                                    <div className="pt-2 text-center">
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                            SoulSync v1.0 • Built with AI ✨
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence >
    );
};

export default Settings;
