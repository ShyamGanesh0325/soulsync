'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const Login: React.FC = () => {
    const { checkUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [loginStep, setLoginStep] = useState<'options' | 'phone' | 'email' | 'google'>('options');

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isSignUp) {
                await api.post('/auth/register', {
                    email,
                    password,
                    full_name: fullName,
                    age: 18,
                    gender: 'Other',
                    location: 'Unknown'
                });
            }

            // Login after signup or directly
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);

            const response = await api.post('/auth/login', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                await checkUser();
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            setError(err.response?.data?.detail || "Authentication failed. Please check your credentials.");
        } finally {
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
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
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
                <p className="text-foreground/60 mb-12 flex items-center justify-center gap-2">
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

                            <div className="pt-4 flex items-center justify-center gap-4 text-gray-400">
                                <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800" />
                                <span className="text-xs uppercase tracking-widest font-bold">Or</span>
                                <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800" />
                            </div>

                            <p className="text-xs text-gray-400 mt-8 px-8 leading-relaxed">
                                By logging in, you agree to our <b>Terms of Service</b> and <b>Privacy Policy</b>. No bots allowed! 🤖🚫
                            </p>
                        </motion.div>
                    )}

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
                                        required
                                    />
                                )}

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 ring-primary transition-all"
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 ring-primary transition-all"
                                    required
                                />

                                {error && (
                                    <p className="text-red-500 text-sm font-bold text-center">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
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
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Login;
