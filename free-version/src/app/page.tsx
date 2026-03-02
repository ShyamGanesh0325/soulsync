'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Bot, ShieldCheck, LogOut } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Login from '@/components/auth/Login';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuth } from '@/context/AuthContext';

type AppView = 'landing' | 'login' | 'chat_select' | 'chat';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [activeBot, setActiveBot] = useState<'bot_luna' | 'bot_atlas'>('bot_luna');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Auth Redirect Logic
  if (!user && view !== 'landing' && view !== 'login') {
    setView('landing');
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 overflow-x-hidden bg-background">
      <Navbar
        isLoggedIn={!!user}
        onSettingsClick={() => signOut()}
      />

      {/* Decorative Background Circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-6xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          {/* Landing View */}
          {!user && view === 'landing' && (
            <motion.section
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center text-center space-y-8 py-12"
            >
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-sm border border-primary/20 backdrop-blur-sm">
                <Sparkles className="text-primary" size={18} />
                <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest">
                  Next-Gen AI Matchmaking
                </span>
              </div>

              <h1 className="text-5xl md:text-8xl font-black tracking-tighter dark:text-white leading-tight">
                Find Your <span className="text-primary">Frequency</span>
              </h1>

              <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl leading-relaxed">
                The world's first dating platform powered by pure vibez and local-first AI. Forever free, forever synchronized.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setView('login')}
                  className="group relative px-8 py-4 bg-primary text-white font-black text-xl rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Sync My Soul <ArrowRight size={24} />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 pt-12 grayscale opacity-50">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} />
                  <span className="font-bold text-sm">Privacy First</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                  <span className="text-xl font-bold">$0</span>
                  <span className="text-sm font-bold">Always Free</span>
                </div>
              </div>
            </motion.section>
          )}

          {/* Login View */}
          {!user && view === 'login' && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <Login />
              <button
                onClick={() => setView('landing')}
                className="mt-4 text-sm font-bold text-gray-500 hover:text-primary transition-colors text-center w-full"
              >
                ← Back to Home
              </button>
            </motion.div>
          )}

          {/* Post-Auth View: Chat Selection */}
          {user && view !== 'chat' && (
            <motion.section
              key="chat_select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl py-12 text-center"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-white leading-tight">Choose Your <span className="text-primary">Mentor</span></h2>
              <p className="text-lg text-foreground/60 mb-12">Hone your social frequency with our specialized AI coaches.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { id: 'bot_luna', name: 'Luna', bio: 'Emotional Frequency Coach', icon: '✨', color: 'bg-blue-500' },
                  { id: 'bot_atlas', name: 'Atlas', bio: 'Vibe Spark Specialist', icon: '⚡', color: 'bg-orange-500' }
                ].map((bot) => (
                  <motion.button
                    key={bot.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveBot(bot.id as any);
                      setView('chat');
                    }}
                    className="flex flex-col items-center p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all text-center"
                  >
                    <div className={`w-20 h-20 ${bot.color} rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-lg shadow-primary/20`}>
                      {bot.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-2 dark:text-white">{bot.name}</h3>
                    <p className="font-bold text-foreground/50">{bot.bio}</p>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => signOut()}
                className="mt-12 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
              >
                Sign Out
              </button>
            </motion.section>
          )}

          {/* Chat View */}
          {user && view === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex justify-center py-6"
            >
              <ChatWindow
                botId={activeBot}
                botName={activeBot === 'bot_luna' ? 'Luna' : 'Atlas'}
                onBack={() => setView('chat_select')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
