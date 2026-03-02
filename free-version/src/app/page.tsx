'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Bot, ShieldCheck, LogOut, MessageSquare, Heart as HeartIcon, Globe } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Settings from '@/components/layout/Settings';
import Filters from '@/components/layout/Filters';
import Login from '@/components/auth/Login';
import ChatWindow from '@/components/chat/ChatWindow';
import AuraDashboard from '@/components/dashboard/AuraDashboard';
import DiscoveryFeed from '@/components/discovery/DiscoveryFeed';
import { useAuth } from '@/context/AuthContext';

type AppView = 'landing' | 'login' | 'main';
type Tab = 'dashboard' | 'discover' | 'chat';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [chatMode, setChatMode] = useState<'select' | 'active'>('select');
  const [activeBot, setActiveBot] = useState<'bot_luna' | 'bot_atlas'>('bot_luna');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
  if (user && view !== 'main') {
    setView('main');
  } else if (!user && view === 'main') {
    setView('landing');
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 overflow-x-hidden bg-background">
      <Navbar
        isLoggedIn={!!user}
        currentTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'chat') setChatMode('select');
        }}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onFilterClick={() => setIsFiltersOpen(true)}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={() => signOut()}
      />

      <Filters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      {/* Decorative Background Circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-6xl">
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

              <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl leading-relaxed mx-auto">
                The world's first dating platform powered by pure vibez and local-first AI. Forever free, forever synchronized.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
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

          {/* Main App View (Tabs) */}
          {user && view === 'main' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              {activeTab === 'dashboard' && <AuraDashboard />}

              {activeTab === 'discover' && (
                <div className="py-8">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-black mb-2 dark:text-white">Soul <span className="text-primary">Discovery</span></h2>
                    <p className="text-foreground/50 font-medium">Resonance-guided matching powered by Atlas AI.</p>
                  </div>
                  <DiscoveryFeed />
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="w-full max-w-4xl mx-auto">
                  {chatMode === 'select' ? (
                    <div className="py-12 text-center">
                      <h2 className="text-4xl font-black mb-4 dark:text-white">Talk to Your <span className="text-primary">Soul Mentor</span></h2>
                      <p className="text-lg text-foreground/60 mb-12">Level up your frequency with AI expert advice.</p>
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
                              setChatMode('active');
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
                    </div>
                  ) : (
                    <div className="w-full py-6 flex justify-center">
                      <ChatWindow
                        key={activeBot}
                        botId={activeBot}
                        botName={activeBot === 'bot_luna' ? 'Luna' : 'Atlas'}
                        onBack={() => setChatMode('select')}
                      />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
