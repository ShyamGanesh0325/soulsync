import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Phone, Mail, User } from 'lucide-react';
import { login, register } from '../api';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginStep, setLoginStep] = useState<'options' | 'phone' | 'email' | 'google'>('options');
    const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSelect = (email: string) => {
        setSelectedGoogleAccount(email);
        setIsLoading(true);
        // Simulate syncing data from google
        setTimeout(() => {
            setIsLoading(false);
            alert("Google Login is currently in Demo Mode. PROD NOTICE: Use the Email Login with your registered credentials to save a session.");
            // onLogin() removed to prevent tokenless authentication
        }, 2000);
    };

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Phone Login is currently unavailable. Please use the Email login option.");
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isSignUp) {
                console.log("📝 Attempting registration...");
                await register({
                    email,
                    password,
                    full_name: fullName,
                    age: 18,
                    gender: 'Other',
                    location: 'Unknown'
                });
                console.log("✅ Registration successful");
            }

            console.log("🔑 Attempting login...");
            const token = await login({ email, password });

            if (token && token.access_token) {
                console.log("💾 AUTH SUCCESS: Saving token to localStorage");
                localStorage.setItem('token', token.access_token);

                // Sanity check
                const savedToken = localStorage.getItem('token');
                if (savedToken) {
                    console.log("✅ Token verified in localStorage");
                    onLogin();
                } else {
                    console.error("❌ Failed to save token to localStorage");
                    setError("Critical Error: Browser refused to save credentials. Please check your privacy settings or use a different browser.");
                    setIsLoading(false);
                }
            } else {
                console.error("❌ Token response missing access_token");
                setError("Login failed: Backend did not return a valid session.");
                setIsLoading(false);
            }
        } catch (err: any) {
            console.error("🔥 Auth Error:", err);
            setError(isSignUp ? "Registration failed. Email might be taken." : "Login failed. Check your credentials.");
            setIsLoading(false);
        }
    };

    const circles = [
        { x: 10, y: 20, size: 200 },
        { x: 80, y: 15, size: 300 },
        { x: 30, y: 70, size: 250 },
        { x: 85, y: 80, size: 400 },
        { x: 50, y: 40, size: 150 },
        { x: 15, y: 85, size: 350 },
    ];

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#FFF0F3] dark:bg-gray-950">
            {/* Background Animated Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {circles.map((c, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -50, 0],
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute rounded-full blur-3xl bg-primary/20"
                        style={{
                            width: `${c.size}px`,
                            height: `${c.size}px`,
                            left: `${c.x}%`,
                            top: `${c.y}%`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md p-8 text-center"
            >
                {/* Logo Section */}
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-3xl shadow-2xl mb-8 transform -rotate-12"
                >
                    <Heart className="text-white w-12 h-12 fill-current" />
                </motion.div>

                <h1 className="text-5xl font-black mb-2 tracking-tight dark:text-white">
                    Soul<span className="text-primary">Sync</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-12 flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    Find your soulmate using pure vibez
                </p>

                {/* Login Options */}
                <AnimatePresence mode="wait">
                    {loginStep === 'options' && (
                        <motion.div
                            key="options"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={() => setLoginStep('phone')}
                                className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-500">
                                        <Phone size={20} />
                                    </div>
                                    <span className="font-bold text-gray-700 dark:text-gray-200">Continue with Phone</span>
                                </div>
                            </button>

                            {/* Google Button (Visual only for now) */}
                            <button
                                onClick={() => setLoginStep('google')}
                                className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-500">
                                        <Mail size={20} />
                                    </div>
                                    <span className="font-bold text-gray-700 dark:text-gray-200">Continue with Google</span>
                                </div>
                            </button>

                            <button
                                onClick={() => setLoginStep('email')}
                                className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600">
                                        <Mail size={20} />
                                    </div>
                                    <span className="font-bold text-gray-700 dark:text-gray-200">Continue with Email</span>
                                </div>
                            </button>

                            {/* Divider & Terms */}
                            <div className="pt-4 flex items-center justify-center gap-4 text-gray-400">
                                <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800" />
                                <span className="text-xs uppercase tracking-widest font-bold">Or</span>
                                <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800" />
                            </div>

                            <p className="text-xs text-gray-400 mt-8 px-8">
                                By logging in, you agree to our <b>Terms of Service</b> and <b>Privacy Policy</b>. No bots allowed! 🤖🚫
                            </p>
                        </motion.div>
                    )}

                    {/* Phone Step (Simplified) */}
                    {loginStep === 'phone' && (
                        <motion.div
                            key="phone"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 text-left"
                        >
                            <div>
                                <h2 className="text-2xl font-black dark:text-white">Coming Soon</h2>
                                <p className="text-gray-500 dark:text-gray-400">Phone login is under construction. Please use Email.</p>
                                <button
                                    type="button"
                                    onClick={() => setLoginStep('options')}
                                    className="mt-4 w-full text-primary font-bold text-sm hover:underline transition-colors py-2 text-center"
                                >
                                    Go Back
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Email Step (Real Auth) */}
                    {loginStep === 'email' && (
                        <motion.div
                            key="email"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 text-left"
                        >
                            <div>
                                <h2 className="text-2xl font-black dark:text-white">
                                    {isSignUp ? "Create Account" : "Welcome Back"}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {isSignUp ? "Join the vibe tribe today!" : "Enter your credentials to continue."}
                                </p>
                            </div>

                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                {isSignUp && (
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 ring-primary transition-all"
                                    />
                                )}

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 ring-primary transition-all"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 ring-primary transition-all"
                                />

                                {error && (
                                    <p className="text-red-500 text-sm font-bold text-center">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || !email || !password || (isSignUp && !fullName)}
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        isSignUp ? "Sign Up" : "Log In"
                                    )}
                                </button>

                                <div className="text-center space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSignUp(!isSignUp);
                                            setError(null);
                                        }}
                                        className="text-primary font-bold text-sm hover:underline"
                                    >
                                        {isSignUp ? "Already have an account? Log In" : "New here? Create Account"}
                                    </button>

                                    <div className="block">
                                        <button
                                            type="button"
                                            onClick={() => setLoginStep('options')}
                                            className="text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {loginStep === 'google' && (
                        <motion.div
                            key="google"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <div className="flex justify-center">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold dark:text-white">Choose an account</h2>
                                <p className="text-sm text-gray-500">to continue to <span className="text-primary font-bold">SoulSync</span></p>
                            </div>

                            <div className="space-y-1">
                                {[
                                    { name: 'Shyam Ganesh', email: 'shyam.g@gmail.com', initial: 'S', color: 'bg-blue-500' },
                                    { name: 'John Wick', email: 'wick.john@outlook.com', initial: 'J', color: 'bg-indigo-600' }
                                ].map((acc) => (
                                    <button
                                        key={acc.email}
                                        onClick={() => handleGoogleSelect(acc.email)}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors text-left group"
                                    >
                                        <div className={`w-10 h-10 ${acc.color} rounded-full flex items-center justify-center text-white font-bold`}>
                                            {acc.initial}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-bold text-sm dark:text-gray-200">{acc.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                                        </div>
                                    </button>
                                ))}

                                <button
                                    onClick={() => setLoginStep('email')}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors text-left"
                                >
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={20} />
                                    </div>
                                    <p className="font-bold text-sm dark:text-gray-200">Use another account</p>
                                </button>
                            </div>

                            <p className="text-[10px] text-gray-400 leading-relaxed pt-2">
                                To continue, Google will share your name, email address, language preference, and profile picture with SoulSync.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-md"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                            />
                            <p className="font-bold text-primary animate-pulse tracking-widest uppercase text-xs">
                                {selectedGoogleAccount
                                    ? `Syncing ${selectedGoogleAccount}...`
                                    : "Syncing Souls..."
                                }
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
